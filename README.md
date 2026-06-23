# Back-to-School Selling Sheet

A static, browser-based selling tool for GitHub Pages. It uses plain HTML, CSS, and JavaScript, loads product data immediately, and keeps navigation state in the browser for instant Brand → Size → Item switching.

## Files

- `index.html` - single-page app shell.
- `styles.css` - iPad-friendly responsive layout and retail card styling.
- `app.js` - DOM rendering, navigation state, and barcode hookup.
- `products.js` - editable product data for brands, sizes, items, UPCs, Walmart item numbers, and order quantities.
- `assets/products/` - place final product images here.
- `assets/vendor/upc-barcode.js` - local dependency-free UPC-A SVG barcode renderer.

## Editing product data

Open `products.js` and update the `window.PRODUCT_DATA` object. The structure is:

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

## Product images

Put real product images in `assets/products/`, then update each item's `image` path in `products.js`. The sample data already includes placeholder paths and comments where final filenames should go. If an image is missing, the app shows a neutral "Product image coming soon" placeholder.

Recommended image format: transparent PNG or optimized JPG/WebP, sized roughly 800px wide or smaller for quick iPad loading.

## UPCs and Walmart item numbers

Update each item's:

- `upc` with the final 12-digit UPC-A value.
- `walmartItemNumber` with the final Walmart item number.

The barcode is generated in the browser from the `upc` value in `products.js`.

## Barcode library

Barcode rendering uses the local script `assets/vendor/upc-barcode.js`. It is a small dependency-free UPC-A SVG renderer included in this repository, so the app does not depend on a remote CDN at runtime.

## Deploying with GitHub Pages

1. Commit these files to the repository.
2. Push the branch to GitHub.
3. In GitHub, open **Settings → Pages**.
4. Set the source to the branch and folder that contain `index.html` (usually the repository root on the `main` branch).
5. Save. GitHub Pages will publish the static app URL after the site builds.

No build step, server, or backend is required.
