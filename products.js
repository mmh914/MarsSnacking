/*
  Back-to-school selling sheet product data.
  Replace placeholder values with the final Mars/Kellanova item details.
  Product images should be stored in /assets/products/ and referenced below.
*/
window.PRODUCT_DATA = {
  displayTypes: {
    sidekick: 'Sidekick',
    halfEndcap: 'Half Endcap',
    endcap: 'Endcap',
    halfPallet: 'Half Pallet',
    fullPallet: 'Full Pallet'
  },
  brands: [
    {
      id: 'rice-krispies-treats',
      name: 'Rice Krispies Treats',
      color: '#0066b3',
      accent: '#e51b23',
      sizes: [
        {
          id: '8ct',
          label: '8 ct Bars',
          items: [
            {
              id: 'rkt-original-8ct',
              name: 'Original Treats',
              image: 'assets/products/rkt-original-8ct.png', // TODO: replace with real product image filename.
              upc: '038000265017',
              walmartItemNumber: 'WM-RKT-8001',
              orderSuggestions: { sidekick: 12, halfEndcap: 24, endcap: 48 }
            },
            {
              id: 'rkt-chocolatey-8ct',
              name: 'Chocolatey Drizzle Treats',
              image: 'assets/products/rkt-chocolatey-8ct.png', // TODO: replace with real product image filename.
              upc: '038000265024',
              walmartItemNumber: 'WM-RKT-8002',
              orderSuggestions: { sidekick: 10, endcap: 40, halfPallet: 96 }
            }
          ]
        },
        {
          id: '16ct',
          label: '16 ct Bars',
          items: [
            {
              id: 'rkt-original-16ct',
              name: 'Original Treats Club Pack',
              image: 'assets/products/rkt-original-16ct.png', // TODO: replace with real product image filename.
              upc: '038000265031',
              walmartItemNumber: 'WM-RKT-1601',
              orderSuggestions: { halfEndcap: 18, endcap: 36, halfPallet: 72, fullPallet: 144 }
            },
            {
              id: 'rkt-rainbow-16ct',
              name: 'Rainbow Treats',
              image: 'assets/products/rkt-rainbow-16ct.png', // TODO: replace with real product image filename.
              upc: '038000265048',
              walmartItemNumber: 'WM-RKT-1602',
              orderSuggestions: { sidekick: 8, halfEndcap: 16, endcap: 32 }
            }
          ]
        }
      ]
    },
    {
      id: 'pop-tarts',
      name: 'Pop-Tarts',
      color: '#ed1c24',
      accent: '#00a3e0',
      sizes: [
        {
          id: '8ct',
          label: '8 ct Toaster Pastries',
          items: [
            {
              id: 'pt-strawberry-8ct',
              name: 'Frosted Strawberry',
              image: 'assets/products/pt-strawberry-8ct.png', // TODO: replace with real product image filename.
              upc: '038000222010',
              walmartItemNumber: 'WM-PT-8001',
              orderSuggestions: { sidekick: 14, halfEndcap: 28, endcap: 56 }
            },
            {
              id: 'pt-brown-sugar-8ct',
              name: 'Frosted Brown Sugar Cinnamon',
              image: 'assets/products/pt-brown-sugar-8ct.png', // TODO: replace with real product image filename.
              upc: '038000222027',
              walmartItemNumber: 'WM-PT-8002',
              orderSuggestions: { sidekick: 14, endcap: 56 }
            }
          ]
        },
        {
          id: '12ct',
          label: '12 ct Toaster Pastries',
          items: [
            {
              id: 'pt-strawberry-12ct',
              name: 'Frosted Strawberry Value Pack',
              image: 'assets/products/pt-strawberry-12ct.png', // TODO: replace with real product image filename.
              upc: '038000222034',
              walmartItemNumber: 'WM-PT-1201',
              orderSuggestions: { halfEndcap: 24, endcap: 48 }
            },
            {
              id: 'pt-smores-12ct',
              name: 'Frosted S’mores Value Pack',
              image: 'assets/products/pt-smores-12ct.png', // TODO: replace with real product image filename.
              upc: '038000222041',
              walmartItemNumber: 'WM-PT-1202',
              orderSuggestions: { sidekick: 12, halfEndcap: 24 }
            }
          ]
        }
      ]
    },
    {
      id: 'pringles',
      name: 'Pringles',
      color: '#d71920',
      accent: '#ffc72c',
      sizes: [
        {
          id: 'snack-stacks',
          label: 'Snack Stacks',
          items: [
            {
              id: 'prg-original-stacks',
              name: 'Original Snack Stacks',
              image: 'assets/products/prg-original-stacks.png', // TODO: replace with real product image filename.
              upc: '038000138014',
              walmartItemNumber: 'WM-PRG-SS01',
              orderSuggestions: { sidekick: 16, halfEndcap: 32, endcap: 64 }
            },
            {
              id: 'prg-sour-cream-stacks',
              name: 'Sour Cream & Onion Snack Stacks',
              image: 'assets/products/prg-sour-cream-stacks.png', // TODO: replace with real product image filename.
              upc: '038000138021',
              walmartItemNumber: 'WM-PRG-SS02',
              orderSuggestions: { sidekick: 16, endcap: 64, halfPallet: 128 }
            }
          ]
        },
        {
          id: 'full-size',
          label: 'Full Size Cans',
          items: [
            {
              id: 'prg-original-can',
              name: 'Original Crisps',
              image: 'assets/products/prg-original-can.png', // TODO: replace with real product image filename.
              upc: '038000138038',
              walmartItemNumber: 'WM-PRG-FS01',
              orderSuggestions: { halfEndcap: 24, endcap: 48, halfPallet: 120, fullPallet: 240 }
            },
            {
              id: 'prg-cheddar-can',
              name: 'Cheddar Cheese Crisps',
              image: 'assets/products/prg-cheddar-can.png', // TODO: replace with real product image filename.
              upc: '038000138045',
              walmartItemNumber: 'WM-PRG-FS02',
              orderSuggestions: { sidekick: 12, halfEndcap: 24, fullPallet: 240 }
            }
          ]
        }
      ]
    },
    {
      id: 'cheez-it',
      name: 'Cheez-It',
      color: '#f58220',
      accent: '#c8102e',
      sizes: [
        {
          id: '12ct',
          label: '12 ct Snack Packs',
          items: [
            {
              id: 'cz-original-12ct',
              name: 'Original Snack Packs',
              image: 'assets/products/cz-original-12ct.png', // TODO: replace with real product image filename.
              upc: '024100122019',
              walmartItemNumber: 'WM-CZ-1201',
              orderSuggestions: { sidekick: 18, halfEndcap: 36, endcap: 72 }
            },
            {
              id: 'cz-white-cheddar-12ct',
              name: 'White Cheddar Snack Packs',
              image: 'assets/products/cz-white-cheddar-12ct.png', // TODO: replace with real product image filename.
              upc: '024100122026',
              walmartItemNumber: 'WM-CZ-1202',
              orderSuggestions: { sidekick: 18, endcap: 72, halfPallet: 144 }
            }
          ]
        },
        {
          id: 'family-size',
          label: 'Family Size Boxes',
          items: [
            {
              id: 'cz-original-family',
              name: 'Original Family Size',
              image: 'assets/products/cz-original-family.png', // TODO: replace with real product image filename.
              upc: '024100122033',
              walmartItemNumber: 'WM-CZ-FS01',
              orderSuggestions: { halfEndcap: 20, endcap: 40, halfPallet: 100, fullPallet: 200 }
            },
            {
              id: 'cz-extra-toasty-family',
              name: 'Extra Toasty Family Size',
              image: 'assets/products/cz-extra-toasty-family.png', // TODO: replace with real product image filename.
              upc: '024100122040',
              walmartItemNumber: 'WM-CZ-FS02',
              orderSuggestions: { sidekick: 10, halfEndcap: 20, endcap: 40 }
            }
          ]
        }
      ]
    }
  ]
};
