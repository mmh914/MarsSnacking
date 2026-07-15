# Repository Instructions

## Shared Page Assets

- All HTML pages must use the shared root stylesheet at `styles.css`.
- Do not add page-specific stylesheet files unless the shared stylesheet cannot reasonably support the page; prefer extending `styles.css` with scoped classes.
- Pages in subdirectories should reference the shared stylesheet with the correct relative path, for example `../styles.css`.

## Barcode Generation

- All pages that render UPC/barcode cards must use the shared barcode generator in `shared/barcode-cards.js`.
- Do not create new page-specific barcode renderers. Existing page-specific generators, such as `BTS2026/upc-barcode.js`, are legacy and should be phased out as pages are updated.
- Pages in subdirectories should load the shared barcode generator with the correct relative path, for example `../shared/barcode-cards.js`.

## Product Data

- `product-catalog-data/product-catalog.json` is the canonical source for item information going forward.
- New item data, edits to item details, image paths, UPCs, Walmart item numbers, and related product metadata should be made in `product-catalog-data/product-catalog.json`.
- Other item data files, including `BTS2026/products.js`, `BTS2026/back-to-school-items.js`, and `LTOsheet/lto-barcode-items.js`, are legacy compatibility files and should be phased out.
- When updating an existing page, prefer migrating it to read from `product-catalog-data/product-catalog.json` rather than adding or expanding legacy page-specific data.

## Implementation Notes

- This is a static site intended to work on GitHub Pages with no build step.
- Keep paths relative and browser-compatible.
- Avoid introducing runtime dependencies or CDN requirements for core page functionality.
