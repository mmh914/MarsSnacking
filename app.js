const app = document.querySelector('#app');
const backButton = document.querySelector('#backButton');
const screenTitle = document.querySelector('#screenTitle');
const breadcrumb = document.querySelector('#breadcrumb');
const data = window.PRODUCT_DATA;

const state = { brandId: null, sizeId: null, itemId: null };

function selectedBrand() {
  return data.brands.find((brand) => brand.id === state.brandId);
}

function selectedSize() {
  return selectedBrand()?.sizes.find((size) => size.id === state.sizeId);
}

function selectedItem() {
  return selectedSize()?.items.find((item) => item.id === state.itemId);
}

function setState(nextState) {
  Object.assign(state, nextState);
  render();
}

function updateHeader() {
  const parts = [selectedBrand()?.name, selectedSize()?.label, selectedItem()?.name].filter(Boolean);
  const isHome = !state.brandId;
  backButton.hidden = isHome;
  screenTitle.textContent = isHome ? 'Selling Sheet' : parts[parts.length - 1];
  breadcrumb.textContent = parts.length ? parts.join(' → ') : 'Choose a brand';
}

function cardButton({ className = '', style = '', title, subtitle, action, label }) {
  return `<button class="card ${className}" style="${style}" type="button" data-action="${action}" aria-label="${label || title}">
    <span class="card-title">${title}</span>
    ${subtitle ? `<span class="card-subtitle">${subtitle}</span>` : ''}
  </button>`;
}

function renderHome() {
  app.innerHTML = `<section class="grid brand-grid">
    ${data.brands.map((brand) => cardButton({
      className: 'brand-card',
      style: `--brand:${brand.color};--accent:${brand.accent}`,
      title: brand.name,
      subtitle: `${brand.sizes.length} size categories`,
      action: `brand:${brand.id}`
    })).join('')}
  </section>`;
}

function renderSizes() {
  const brand = selectedBrand();
  app.innerHTML = `<section class="grid size-grid">
    ${brand.sizes.map((size) => cardButton({
      className: 'size-card',
      style: `--brand:${brand.color};--accent:${brand.accent}`,
      title: size.label,
      subtitle: `${size.items.length} items`,
      action: `size:${size.id}`
    })).join('')}
  </section>`;
}

function imageMarkup(item) {
  return `<div class="product-image-wrap">
    <img src="${item.image}" alt="${item.name}" loading="eager" onerror="this.hidden=true; this.nextElementSibling.hidden=false;">
    <div class="image-placeholder" hidden>Product image coming soon</div>
  </div>`;
}

function renderItems() {
  const brand = selectedBrand();
  const size = selectedSize();
  app.innerHTML = `<section class="grid item-grid">
    ${size.items.map((item) => `<button class="item-card" style="--brand:${brand.color};--accent:${brand.accent}" type="button" data-action="item:${item.id}">
      ${imageMarkup(item)}
      <span class="card-title">${item.name}</span>
      <span class="card-subtitle">UPC ${item.upc}</span>
    </button>`).join('')}
  </section>`;
}

function renderDetail() {
  const brand = selectedBrand();
  const size = selectedSize();
  const item = selectedItem();
  app.innerHTML = `<article class="detail-panel" style="--brand:${brand.color};--accent:${brand.accent}">
    <section class="detail-hero">
      ${imageMarkup(item)}
      <div class="detail-copy">
        <p class="eyebrow">${brand.name} • ${size.label}</p>
        <h2>${item.name}</h2>
        <dl class="facts">
          <div><dt>UPC</dt><dd>${item.upc}</dd></div>
          <div><dt>Walmart item #</dt><dd>${item.walmartItemNumber}</dd></div>
        </dl>
      </div>
    </section>
    <section class="detail-grid">
      <div class="barcode-card">
        <h3>Barcode</h3>
        <div id="barcodeTarget" class="barcode-target"></div>
      </div>
      <div class="orders-card">
        <h3>Suggested order amounts</h3>
        <div class="order-list">
          ${Object.entries(data.displayTypes).map(([key, label]) => {
            const amount = item.orderSuggestions[key];
            return `<div class="order-row ${amount ? '' : 'muted'}"><span>${label}</span><strong>${amount ? `${amount} cases` : '—'}</strong></div>`;
          }).join('')}
        </div>
      </div>
    </section>
  </article>`;
  window.renderUpcBarcode(document.querySelector('#barcodeTarget'), item.upc);
}

function render() {
  updateHeader();
  if (!state.brandId) renderHome();
  else if (!state.sizeId) renderSizes();
  else if (!state.itemId) renderItems();
  else renderDetail();
}

app.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const [type, id] = control.dataset.action.split(':');
  if (type === 'brand') setState({ brandId: id, sizeId: null, itemId: null });
  if (type === 'size') setState({ sizeId: id, itemId: null });
  if (type === 'item') setState({ itemId: id });
});

backButton.addEventListener('click', () => {
  if (state.itemId) setState({ itemId: null });
  else if (state.sizeId) setState({ sizeId: null });
  else setState({ brandId: null });
});

render();
