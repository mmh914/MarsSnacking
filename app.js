const app = document.querySelector('#app');
const backButton = document.querySelector('#backButton');
const screenTitle = document.querySelector('#screenTitle');
const breadcrumb = document.querySelector('#breadcrumb');
const data = window.PRODUCT_DATA;

const state = { brandId: null, sizeId: null };

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

function orderRows(item) {
  return Object.entries(data.displayTypes).map(([key, label]) => {
    const amount = item.orderSuggestions[key];
    return `<div class="order-row ${amount ? '' : 'muted'}"><span>${label}</span><strong>${amount ? `${amount} cases` : '—'}</strong></div>`;
  }).join('');
}

function renderItems() {
  const brand = selectedBrand();
  const size = selectedSize();
  app.innerHTML = `<section class="items-board" style="--brand:${brand.color};--accent:${brand.accent}">
    ${size.items.map((item) => `<article class="selling-item-card">
      <div class="selling-item-top">
        ${imageMarkup(item)}
        <div class="selling-item-copy">
          <p class="eyebrow">${brand.name} • ${size.label}</p>
          <h2>${item.name}</h2>
          <dl class="facts compact-facts">
            <div><dt>UPC</dt><dd>${item.upc}</dd></div>
            <div><dt>Walmart item #</dt><dd>${item.walmartItemNumber}</dd></div>
          </dl>
        </div>
      </div>
      <div class="selling-item-bottom">
        <section class="barcode-card">
          <h3>Barcode</h3>
          <div class="barcode-target" data-upc="${item.upc}"></div>
        </section>
        <section class="orders-card">
          <h3>Suggested order amounts</h3>
          <div class="order-list">${orderRows(item)}</div>
        </section>
      </div>
    </article>`).join('')}
  </section>`;

  document.querySelectorAll('[data-upc]').forEach((target) => {
    window.renderUpcBarcode(target, target.dataset.upc);
  });
}

function render() {
  updateHeader();
  if (!state.brandId) renderHome();
  else if (!state.sizeId) renderSizes();
  else renderItems();
}

app.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const [type, id] = control.dataset.action.split(':');
  if (type === 'brand') setState({ brandId: id, sizeId: null });
  if (type === 'size') setState({ sizeId: id });
});

backButton.addEventListener('click', () => {
  if (state.sizeId) setState({ sizeId: null });
  else setState({ brandId: null });
});

render();
