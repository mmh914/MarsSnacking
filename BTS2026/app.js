const app = document.querySelector("#app");
const backButton = document.querySelector("#backButton");
const screenTitle = document.querySelector("#screenTitle");
const breadcrumb = document.querySelector("#breadcrumb");
const items = window.BTS_ITEMS || [];
const { cardTemplate, bindArchiveCards, wireModal } = window.BarcodeCards;

const state = { brandId: null, sizeId: null };

function buildNavigationData(sourceItems) {
  const brands = [];
  const brandMap = new Map();

  sourceItems.forEach((item) => {
    let brand = brandMap.get(item.brandId);
    if (!brand) {
      brand = {
        id: item.brandId,
        name: item.brandName,
        color: item.brandColor,
        accent: item.brandAccent,
        sizes: []
      };
      brandMap.set(item.brandId, brand);
      brands.push(brand);
    }

    let size = brand.sizes.find((entry) => entry.id === item.sizeId);
    if (!size) {
      size = { id: item.sizeId, label: item.sizeLabel, items: [] };
      brand.sizes.push(size);
    }

    size.items.push(item);
  });

  return { brands };
}

const data = buildNavigationData(items);

function selectedBrand() {
  return data.brands.find((brand) => brand.id === state.brandId);
}

function selectedSize() {
  return selectedBrand()?.sizes.find((size) => size.id === state.sizeId);
}

function setState(nextState) {
  Object.assign(state, nextState);
  render();
}

function updateHeader() {
  const parts = [selectedBrand()?.name, selectedSize()?.label].filter(Boolean);
  const isHome = !state.brandId;
  backButton.hidden = isHome;
  screenTitle.textContent = isHome ? "Selling Sheet" : parts[parts.length - 1];
  breadcrumb.textContent = parts.length ? parts.join(" -> ") : "Choose a brand";
}

function cardButton({ className = "", style = "", title, subtitle, action, label }) {
  return `<button class="card ${className}" style="${style}" type="button" data-action="${action}" aria-label="${label || title}">
    <span class="card-title">${title}</span>
    ${subtitle ? `<span class="card-subtitle">${subtitle}</span>` : ""}
  </button>`;
}

function renderHome() {
  app.innerHTML = `<section class="grid brand-grid">
    ${data.brands.map((brand) => cardButton({
      className: "brand-card",
      style: `--brand:${brand.color};--accent:${brand.accent}`,
      title: brand.name,
      subtitle: `${brand.sizes.length} size categories`,
      action: `brand:${brand.id}`
    })).join("")}
  </section>`;
}

function renderSizes() {
  const brand = selectedBrand();
  app.innerHTML = `<section class="grid size-grid">
    ${brand.sizes.map((size) => cardButton({
      className: "size-card",
      style: `--brand:${brand.color};--accent:${brand.accent}`,
      title: size.label,
      subtitle: `${size.items.length} items`,
      action: `size:${size.id}`
    })).join("")}
  </section>`;
}

function renderItems() {
  const size = selectedSize();
  const sorted = [...size.items].sort((a, b) => a.name.localeCompare(b.name));

  app.innerHTML = `<section class="grid">
    ${sorted.map((item, index) => cardTemplate(item, index)).join("")}
  </section>`;

  bindArchiveCards(app, sorted);
}

function render() {
  updateHeader();
  if (!state.brandId) renderHome();
  else if (!state.sizeId) renderSizes();
  else renderItems();
}

app.addEventListener("click", (event) => {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const [type, id] = control.dataset.action.split(":");
  if (type === "brand") setState({ brandId: id, sizeId: null });
  if (type === "size") setState({ sizeId: id });
});

backButton.addEventListener("click", () => {
  if (state.sizeId) setState({ sizeId: null });
  else setState({ brandId: null });
});

wireModal();
render();
