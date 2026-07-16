(function () {
  const LEFT_GUARD = "101";
  const CENTER_GUARD = "01010";
  const RIGHT_GUARD = "101";

  const L_CODES = {
    "0": "0001101", "1": "0011001", "2": "0010011", "3": "0111101", "4": "0100011",
    "5": "0110001", "6": "0101111", "7": "0111011", "8": "0110111", "9": "0001011"
  };

  const R_CODES = {
    "0": "1110010", "1": "1100110", "2": "1101100", "3": "1000010", "4": "1011100",
    "5": "1001110", "6": "1010000", "7": "1000100", "8": "1001000", "9": "1110100"
  };

  function cleanUpc(upc) {
    return String(upc).replace(/\D/g, "");
  }

  function isValidUpcA(upc) {
    const digits = cleanUpc(upc);
    if (!/^\d{12}$/.test(digits)) return false;
    const body = digits.slice(0, 11).split("").map(Number);
    const check = Number(digits[11]);
    const sum = body.reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
    return (10 - (sum % 10)) % 10 === check;
  }

  function upcToBits(upc) {
    const digits = cleanUpc(upc);
    if (!/^\d{12}$/.test(digits)) throw new Error(`UPC must be 12 digits: ${upc}`);
    const left = digits.slice(0, 6).split("").map((d) => L_CODES[d]).join("");
    const right = digits.slice(6).split("").map((d) => R_CODES[d]).join("");
    return LEFT_GUARD + left + CENTER_GUARD + right + RIGHT_GUARD;
  }

  function renderBarcodeSvg(upc) {
    const digits = cleanUpc(upc);
    const bits = upcToBits(digits);
    const moduleWidth = 2;
    const barHeight = 72;
    const guardHeight = 82;
    const quiet = 10;
    const width = bits.length * moduleWidth + quiet * 2;
    const height = 104;

    let rects = "";
    for (let i = 0; i < bits.length; i += 1) {
      if (bits[i] === "1") {
        const inGuard = i < 3 || (i >= 45 && i < 50) || i >= 92;
        rects += `<rect x="${quiet + i * moduleWidth}" y="0" width="${moduleWidth}" height="${inGuard ? guardHeight : barHeight}" />`;
      }
    }

    return `
      <svg class="barcode" viewBox="0 0 ${width} ${height}" role="img" aria-label="UPC ${digits}">
        <rect class="barcode-bg" width="100%" height="100%" fill="white"></rect>
        <g class="barcode-bars" fill="black">${rects}</g>
      </svg>
    `;
  }

  function formatUpc(upc) {
    const d = cleanUpc(upc);
    return d.length === 12 ? `${d[0]} ${d.slice(1, 6)} ${d.slice(6, 11)} ${d[11]}` : upc;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function itemImageMarkup(item, sizeClass = "") {
    const safeName = escapeHtml(item.name);
    const safeImageSrc = escapeHtml(item.imageSrc || "");

    return item.imageSrc
      ? `<img class="${sizeClass}" src="${safeImageSrc}" alt="${safeName}" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'missing-image', textContent:'Image not found'}))">`
      : `<div class="missing-image">No image</div>`;
  }

  function cardTemplate(item, index) {
    const valid = isValidUpcA(item.upc);
    const barcode = /^\d{12}$/.test(cleanUpc(item.upc))
      ? renderBarcodeSvg(item.upc)
      : `<div class="missing-image">Invalid UPC</div>`;
    const safeName = escapeHtml(item.name);

    return `
      <article class="item-card archive-card" tabindex="0" role="button" data-item-index="${index}" aria-label="Expand barcode for ${safeName}">
        <div class="item-image-wrap">
          ${itemImageMarkup(item, "item-image")}
        </div>
        <p class="item-name">${safeName}</p>
        ${barcode}
        <div class="upc-text">${formatUpc(item.upc)}</div>
        <div class="meta">${valid ? "" : "Check digit warning"}</div>
      </article>
    `;
  }

  function openExpandedCard(item) {
    const modal = document.getElementById("barcodeModal");
    const image = document.getElementById("expandedImage");
    const name = document.getElementById("expandedName");
    const barcode = document.getElementById("expandedBarcode");
    const upc = document.getElementById("expandedUpc");

    if (!modal || !image || !name || !barcode || !upc) return;

    image.innerHTML = itemImageMarkup(item);
    name.textContent = item.name;
    barcode.innerHTML = /^\d{12}$/.test(cleanUpc(item.upc))
      ? renderBarcodeSvg(item.upc)
      : `<div class="missing-image">Invalid UPC</div>`;
    upc.textContent = formatUpc(item.upc);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    document.getElementById("closeModal")?.focus();
  }

  function closeExpandedCard() {
    const modal = document.getElementById("barcodeModal");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function bindArchiveCards(container, items) {
    container.querySelectorAll(".archive-card").forEach((card) => {
      const openCard = () => openExpandedCard(items[Number(card.dataset.itemIndex)]);
      card.addEventListener("click", openCard);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCard();
        }
      });
    });
  }

  function wireModal() {
    document.getElementById("closeModal")?.addEventListener("click", closeExpandedCard);
    document.querySelector(".modal-backdrop")?.addEventListener("click", closeExpandedCard);
    document.addEventListener("keydown", (event) => {
      const modal = document.getElementById("barcodeModal");
      if (event.key === "Escape" && modal && !modal.hidden) {
        closeExpandedCard();
      }
    });
  }

  function getBarcodeColorMode() {
    try {
      return localStorage.getItem("barcodeColorMode");
    } catch (_error) {
      return null;
    }
  }

  function setBarcodeColorMode(mode) {
    try {
      localStorage.setItem("barcodeColorMode", mode);
    } catch (_error) {
      // Keep the toggle working for the current page even when storage is unavailable.
    }
  }

  function syncBarcodeToggleLabel(button, isNormal) {
    button.setAttribute("aria-pressed", String(isNormal));
    button.textContent = isNormal ? "Use inverted barcodes" : "Use normal barcodes";
  }

  function wireBarcodeInvertToggle() {
    document.documentElement.classList.add("has-barcode-toggle");
    if (document.getElementById("barcodeInvertToggle")) return;

    const button = document.createElement("button");
    button.id = "barcodeInvertToggle";
    button.className = "barcode-invert-toggle";
    button.type = "button";

    const isNormal = getBarcodeColorMode() === "normal";
    document.documentElement.classList.toggle("barcode-normal-barcodes", isNormal);
    syncBarcodeToggleLabel(button, isNormal);

    button.addEventListener("click", () => {
      const nextIsNormal = !document.documentElement.classList.contains("barcode-normal-barcodes");
      document.documentElement.classList.toggle("barcode-normal-barcodes", nextIsNormal);
      setBarcodeColorMode(nextIsNormal ? "normal" : "inverted");
      syncBarcodeToggleLabel(button, nextIsNormal);
    });

    document.body.append(button);
  }
  function syncDarkModeClass() {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;

    const update = () => {
      document.documentElement.classList.toggle("dark-mode", query.matches);
    };

    update();
    if (query.addEventListener) query.addEventListener("change", update);
    else query.addListener?.(update);
  }

  syncDarkModeClass();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireBarcodeInvertToggle, { once: true });
  } else {
    wireBarcodeInvertToggle();
  }

  window.BarcodeCards = {
    cleanUpc,
    isValidUpcA,
    renderBarcodeSvg,
    formatUpc,
    cardTemplate,
    openExpandedCard,
    closeExpandedCard,
    bindArchiveCards,
    wireBarcodeInvertToggle,
    wireModal
  };
}());
