# Mars Snacking Tools

A small static-site hub for separate Mars Snacking project pages. The repository root keeps the standard `index.html` entry point for GitHub Pages, and each project lives in its own folder with a descriptive HTML file name.

## Pages

- `index.html` - umbrella splash page / tool hub.
- `LTOsheet/lto-barcode-archive.html` - Limited Time Offer barcode archive.
- `BTS2026/back-to-school-selling-sheet.html` - Back-to-School 2026 selling sheet.

## Naming convention

For static websites, `index.html` is conventionally the default page for a folder. It is normal to keep one at the repository root so visiting the published site opens a home page automatically.

For separate projects under the same umbrella, use descriptive file names for each project's entry page, such as `lto-barcode-archive.html` or `back-to-school-selling-sheet.html`. That avoids having several open editor tabs all named `index.html` while still keeping each project grouped with its own assets.

## Back-to-School Selling Sheet

The Back-to-School tool is a static, browser-based selling tool for GitHub Pages. It uses plain HTML, CSS, and JavaScript, loads product data immediately, and keeps navigation state in the browser for instant Brand -> Size -> Item switching.

### Files

- `BTS2026/back-to-school-selling-sheet.html` - single-page app shell.
- `styles.css` - shared styling for the project pages.
- `BTS2026/app.js` - DOM rendering, navigation state, and barcode hookup.
- `BTS2026/products.js` - editable product data for brands, sizes, items, UPCs, Walmart item numbers, and order quantities.
- `BTS2026/assets/products/` - place final product images here.
- `BTS2026/assets/vendor/upc-barcode.js` - local dependency-free UPC-A SVG barcode renderer.

### Editing product data

Open `BTS2026/products.js` and update the `window.PRODUCT_DATA` object. The structure is:

```js
{
  displayTypes: {
    sidekick: 'Sidekick',
    halfEndcap: 'Half Endcap',
    endcap: 'Endcap',
    halfPallet: 'Half Pallet',
    fullPallet: 'Full Pallet'
  },
  brands: [
    {
      id: 'pop-tarts',
      name: 'Pop-Tarts',
      color: '#ed1c24',
      accent: '#00a3e0',
      sizes: [
        {
          id: '12ct',
          label: '12 ct Toaster Pastries',
          items: [
            {
              id: 'pt-strawberry-12ct',
              name: 'Frosted Strawberry Value Pack',
              image: 'assets/products/pt-strawberry-12ct.png',
              upc: '038000222034',
              walmartItemNumber: 'WM-PT-1201',
              orderSuggestions: { halfEndcap: 24, endcap: 48 }
            }
          ]
        }
      ]
    }
  ]
}
```

Each item can include only the display types that apply. For example, if Pop-Tarts should not have pallet recommendations, omit `halfPallet` and `fullPallet` from that item's `orderSuggestions`.

### Product images

Put real product images in `BTS2026/assets/products/`, then update each item's `image` path in `BTS2026/products.js`. The sample data already includes placeholder paths and comments where final filenames should go. If an image is missing, the app shows a neutral "Product image coming soon" placeholder.

Recommended image format: transparent PNG or optimized JPG/WebP, sized roughly 800px wide or smaller for quick iPad loading.

### UPCs and Walmart item numbers

Update each item's:

- `upc` with the final 12-digit UPC-A value.
- `walmartItemNumber` with the final Walmart item number.

The barcode is generated in the browser from the `upc` value in `BTS2026/products.js`.

### Barcode library

Barcode rendering uses the local script `BTS2026/assets/vendor/upc-barcode.js`. It is a small dependency-free UPC-A SVG barcode renderer included in this repository, so the app does not depend on a remote CDN at runtime.

## Deploying with GitHub Pages

1. Commit these files to the repository.
2. Push the branch to GitHub.
3. In GitHub, open **Settings -> Pages**.
4. Set the source to the branch and repository root folder that contain `index.html`.
5. Save. GitHub Pages will publish the splash page first, with links to the project pages.

No build step, server, or backend is required.
