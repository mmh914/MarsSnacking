(function () {
  const app = document.getElementById("app");
  const backButton = document.getElementById("backButton");
  const screenTitle = document.getElementById("screenTitle");
  const breadcrumb = document.getElementById("breadcrumb");
  const warning = document.getElementById("sheetWarning");
  const config = window.SALES_SHEET;
  const { cardTemplate, bindArchiveCards, wireModal } = window.BarcodeCards || {};
  const state = { brandId: null, sizeId: null };
  const panels = new Map();
  let data = null;

  const BRAND_THEMES = {
    "Cheez-It": ["#f58220", "#c8102e"],
    "Pringles": ["#d71920", "#ffc72c"],
    "Pop-Tarts": ["#ed1c24", "#00a3e0"],
    "Rice Krispies Treats": ["#0066b3", "#e51b23"],
    "Club": ["#b51f2a", "#d5a94e"],
    "Town House": ["#b32025", "#f2c14e"],
    "Eggo": ["#d5232f", "#f7c744"],
    "Frozen": ["#3273a8", "#8bc9e8"],
    "Other": ["#4f5d67", "#9aa7b1"]
  };

  function slug(value) {
    return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function themeFor(brandName) {
    return BRAND_THEMES[brandName] || BRAND_THEMES.Other;
  }

  function panelKey(brandId, sizeId) {
    if (!brandId) return "home";
    return sizeId ? `items:${brandId}:${sizeId}` : `sizes:${brandId}`;
  }

  function setMessage(message, kind = "loading") {
    app.innerHTML = `<div class="sheet-message sheet-message-${kind}">${escapeHtml(message)}</div>`;
  }

  function validateConfig() {
    if (!config || !config.id || !config.title || !config.eyebrow || !Array.isArray(config.productIds) || !config.productIds.length) {
      throw new Error("Sales Sheet configuration requires id, title, eyebrow, and a non-empty productIds array.");
    }
    if (!cardTemplate || !bindArchiveCards || !wireModal) {
      throw new Error("The shared barcode card library is unavailable.");
    }
  }

  function imagePathFromCatalog(imagePath, catalogUrl) {
    if (!imagePath) return "";
    if (/^(?:[a-z]+:|\/)/i.test(imagePath)) return imagePath;
    const repositoryRoot = new URL("../", catalogUrl);
    return new URL(imagePath, repositoryRoot).href;
  }

  function normalizeProduct(product, catalogUrl) {
    return {
      ...product,
      imageSrc: imagePathFromCatalog(product.image, catalogUrl)
    };
  }

  function buildNavigation(catalog, catalogUrl) {
    const byId = new Map();
    const duplicateCatalogIds = new Set();
    catalog.products.forEach((product) => {
      if (byId.has(product.id)) duplicateCatalogIds.add(product.id);
      else byId.set(product.id, product);
    });

    const seenDefinitionIds = new Set();
    const duplicateDefinitionIds = [];
    const missingIds = [];
    const products = [];

    config.productIds.forEach((id) => {
      if (seenDefinitionIds.has(id)) {
        duplicateDefinitionIds.push(id);
        return;
      }
      seenDefinitionIds.add(id);
      const product = byId.get(id);
      if (!product || duplicateCatalogIds.has(id)) {
        missingIds.push(id);
        return;
      }
      products.push(normalizeProduct(product, catalogUrl));
    });

    const brands = [];
    const brandMap = new Map();
    products.forEach((product) => {
      let brand = brandMap.get(product.brand);
      if (!brand) {
        brand = { id: slug(product.brand), name: product.brand, thumbnail: product, sizes: [], sizeMap: new Map() };
        brandMap.set(product.brand, brand);
        brands.push(brand);
      }
      let size = brand.sizeMap.get(product.sizeGroup.id);
      if (!size) {
        size = { ...product.sizeGroup, items: [], firstIndex: products.indexOf(product) };
        brand.sizeMap.set(size.id, size);
        brand.sizes.push(size);
      }
      size.items.push(product);
    });
    brands.forEach((brand) => brand.sizes.sort((a, b) => a.sortOrder - b.sortOrder || a.firstIndex - b.firstIndex));

    return { brands, missingIds, duplicateDefinitionIds, duplicateCatalogIds: [...duplicateCatalogIds] };
  }

  function navigationButton({ className, style, title, subtitle, action, thumbnail }) {
    const thumbnailMarkup = thumbnail?.imageSrc
      ? `<span class="navigation-thumbnail-wrap"><img class="navigation-thumbnail" src="${escapeHtml(thumbnail.imageSrc)}" alt="" onerror="this.parentElement.remove()"></span>`
      : "";
    return `<button class="card ${className}" style="${style}" type="button" data-action="${escapeHtml(action)}" aria-label="${escapeHtml(title)}">
      ${thumbnailMarkup}
      <span class="navigation-card-copy">
        <span class="card-title">${escapeHtml(title)}</span>
        <span class="card-subtitle">${escapeHtml(subtitle)}</span>
      </span>
    </button>`;
  }

  function createPanel(key, markup) {
    const section = document.createElement("section");
    section.className = "sheet-panel";
    section.dataset.panel = key;
    section.hidden = true;
    section.innerHTML = markup;
    panels.set(key, section);
    app.append(section);
    return section;
  }

  function buildPanels() {
    app.innerHTML = "";
    panels.clear();

    createPanel("home", `<div class="grid brand-grid">${data.brands.map((brand) => {
      const [color, accent] = themeFor(brand.name);
      return navigationButton({
        className: "brand-card",
        style: `--brand:${color};--accent:${accent}`,
        title: brand.name,
        subtitle: `${brand.sizes.length} size group${brand.sizes.length === 1 ? "" : "s"}`,
        action: `brand:${brand.id}`,
        thumbnail: brand.thumbnail
      });
    }).join("")}</div>`);

    data.brands.forEach((brand) => {
      const [color, accent] = themeFor(brand.name);
      createPanel(`sizes:${brand.id}`, `<div class="grid size-grid">${brand.sizes.map((size) => navigationButton({
        className: "size-card",
        style: `--brand:${color};--accent:${accent}`,
        title: size.label,
        subtitle: `${size.items.length} item${size.items.length === 1 ? "" : "s"}`,
        action: `size:${size.id}`,
        thumbnail: size.items[0]
      })).join("")}</div>`);

      brand.sizes.forEach((size) => {
        const panel = createPanel(`items:${brand.id}:${size.id}`, `<div class="grid item-grid">${size.items.map((item, index) => cardTemplate(item, index)).join("")}</div>`);
        bindArchiveCards(panel, size.items);
      });
    });
  }

  function selectedBrand() {
    return data.brands.find((brand) => brand.id === state.brandId);
  }

  function selectedSize() {
    return selectedBrand()?.sizes.find((size) => size.id === state.sizeId);
  }

  function showCurrentPanel({ focus = false } = {}) {
    panels.forEach((panel, key) => { panel.hidden = key !== panelKey(state.brandId, state.sizeId); });
    const brand = selectedBrand();
    const size = selectedSize();
    const parts = [brand?.name, size?.label].filter(Boolean);
    const isHome = !brand;

    screenTitle.textContent = isHome ? config.title : parts[parts.length - 1];
    breadcrumb.textContent = parts.length ? parts.join(" → ") : "Choose a brand";
    backButton.setAttribute("aria-label", isHome ? "Back to site home" : "Back to previous screen");
    document.title = config.title;

    if (focus) panels.get(panelKey(state.brandId, state.sizeId))?.querySelector("button, [tabindex='0']")?.focus();
  }

  function showWarnings() {
    const problems = [];
    if (data.missingIds.length) problems.push(`Missing or non-unique catalog IDs: ${data.missingIds.join(", ")}`);
    if (data.duplicateDefinitionIds.length) problems.push(`Duplicate sheet IDs ignored: ${[...new Set(data.duplicateDefinitionIds)].join(", ")}`);
    if (data.duplicateCatalogIds.length) problems.push(`Duplicate catalog IDs: ${data.duplicateCatalogIds.join(", ")}`);
    warning.hidden = !problems.length;
    warning.textContent = problems.join(" • ");
    if (problems.length) console.warn(`[Sales Sheet: ${config.id}] ${problems.join(" | ")}`);
  }

  async function loadSheet() {
    setMessage("Loading sales sheet…");
    warning.hidden = true;
    backButton.disabled = true;

    try {
      validateConfig();
      const catalogUrl = new URL(document.body.dataset.catalogUrl, document.baseURI);
      const response = await fetch(catalogUrl);
      if (!response.ok) throw new Error(`Catalog request failed with status ${response.status}.`);
      const catalog = await response.json();
      if (!catalog || !Array.isArray(catalog.products)) throw new Error("Catalog products array is missing.");

      data = buildNavigation(catalog, catalogUrl);
      if (!data.brands.length) {
        const unresolved = data.missingIds.length ? ` Unresolved IDs: ${data.missingIds.join(", ")}.` : "";
        throw new Error(`None of this Sales Sheet's configured product IDs resolve to unique catalog products.${unresolved}`);
      }
      buildPanels();
      showWarnings();
      state.brandId = null;
      state.sizeId = null;
      backButton.disabled = false;
      showCurrentPanel();
    } catch (error) {
      console.error(error);
      setMessage(`${error.message} Select Retry to load the sheet again.`, "error");
      const retry = document.createElement("button");
      retry.className = "retry-button";
      retry.type = "button";
      retry.textContent = "Retry";
      retry.addEventListener("click", loadSheet, { once: true });
      app.querySelector(".sheet-message")?.append(retry);
      backButton.disabled = false;
    }
  }

  app.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control || !data) return;
    const separator = control.dataset.action.indexOf(":");
    const type = control.dataset.action.slice(0, separator);
    const id = control.dataset.action.slice(separator + 1);
    if (type === "brand") {
      state.brandId = id;
      state.sizeId = null;
      showCurrentPanel({ focus: true });
    } else if (type === "size") {
      state.sizeId = id;
      showCurrentPanel({ focus: true });
    }
  });

  backButton.addEventListener("click", () => {
    if (!data || !state.brandId) {
      window.location.href = document.body.dataset.homeUrl;
    } else if (state.sizeId) {
      state.sizeId = null;
      showCurrentPanel({ focus: true });
    } else {
      state.brandId = null;
      showCurrentPanel({ focus: true });
    }
  });

  if (config?.eyebrow) document.getElementById("sheetEyebrow").textContent = config.eyebrow;
  wireModal?.();
  loadSheet();
}());
