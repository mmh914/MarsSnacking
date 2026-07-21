# Mars Snacking Tools

A dependency-free static-site hub for Mars Snacking selling tools. The repository root is the GitHub Pages entry point, and each tool has a descriptive direct URL.

## Pages

- `index.html` — site home and tool hub.
- `LTOsheet/lto-barcode-archive.html` — Limited Time Offer barcode archive.
- `BTS2026/back-to-school-selling-sheet.html` — Back-to-School 2026 Sales Sheet.

## Product catalog

`product-catalog-data/product-catalog.json` is the only source for product names, brands, package sizes, size groups, UPCs, Walmart item numbers, images, and lifecycle status. Add or correct product information there before referencing it from another page. Image paths are repository-relative, such as `product-catalog-data/images/example.png`.

## Sales Sheet framework

Sales Sheets use the shared controller in `shared/sales-sheet.js`, the shared barcode cards in `shared/barcode-cards.js`, and the root `styles.css`. They follow the fixed navigation flow:

`Brand → Size Group → Item Cards`

The catalog is requested once when a sheet opens. The controller resolves the fixed product list and creates all Brand, Size Group, and item panels immediately. Moving between panels does not fetch or rebuild product data.

### Defining a sheet

Each Sales Sheet has a small definition loaded before the shared controller:

```js
window.SALES_SHEET = {
  id: "back-to-school-2026",
  title: "Back-to-School Selling Sheet",
  eyebrow: "Mars Snacking • Back-to-School",
  productIds: [
    "back-to-school-cheez-it-10-pack",
    "back-to-school-pringles-snack-stacks-27-pack"
  ]
};
```

Only catalog IDs belong in `productIds`. Their order establishes selling priority: item cards retain definition order, brands follow first appearance, and size groups use the catalog's `sizeGroup.sortOrder`. Duplicate definition IDs are ignored with a warning. Missing or non-unique catalog IDs are omitted and reported visibly.

Inactive and discontinued products remain on explicitly configured sheets and receive a lifecycle badge.

### Adding another Sales Sheet

1. Add and validate every product in the master catalog.
2. Create a folder containing a definition file and an HTML shell based on the BTS page.
3. Set the shell's relative `data-catalog-url` and `data-home-url` paths.
4. Load the definition, `shared/barcode-cards.js`, and `shared/sales-sheet.js` in that order.
5. Add a direct project card to `index.html`.

Do not create page-specific product records, barcode generators, stylesheets, or navigation controllers.

## Back-to-School 2026

The BTS definition is `BTS2026/sales-sheet-definition.js`. It currently references the two Back-to-School products present in the master catalog. Future BTS products must be added to the catalog before their IDs are added to this definition.

## Local testing and deployment

Because browsers restrict `fetch()` from `file:` URLs, serve the repository over HTTP for local testing, for example with `python -m http.server`. GitHub Pages requires no build step or runtime dependency: commit the files, push the branch, and publish from the repository root.
