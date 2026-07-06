/* Local, dependency-free UPC-A SVG barcode renderer for this GitHub Pages app. */
(function () {
  const LEFT_ODD = {
    0: '0001101', 1: '0011001', 2: '0010011', 3: '0111101', 4: '0100011',
    5: '0110001', 6: '0101111', 7: '0111011', 8: '0110111', 9: '0001011'
  };
  const RIGHT = {
    0: '1110010', 1: '1100110', 2: '1101100', 3: '1000010', 4: '1011100',
    5: '1001110', 6: '1010000', 7: '1000100', 8: '1001000', 9: '1110100'
  };

  function normalizeUpc(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length >= 12 ? digits.slice(0, 12) : digits.padStart(12, '0');
  }

  function bitsForUpc(upc) {
    const left = upc.slice(1, 6).split('').map((d) => LEFT_ODD[d]).join('');
    const right = upc.slice(6, 11).split('').map((d) => RIGHT[d]).join('');
    return `101${left}01010${right}101`;
  }

  window.renderUpcBarcode = function renderUpcBarcode(target, value) {
    const upc = normalizeUpc(value);
    const bits = bitsForUpc(upc);
    const moduleWidth = 3;
    const barHeight = 94;
    const textHeight = 22;
    const quiet = 18;
    const width = bits.length * moduleWidth + quiet * 2;
    let x = quiet;
    const bars = [];

    bits.split('').forEach((bit) => {
      if (bit === '1') {
        bars.push(`<rect x="${x}" y="8" width="${moduleWidth}" height="${barHeight}" />`);
      }
      x += moduleWidth;
    });

    target.innerHTML = `
      <svg class="barcode-svg" viewBox="0 0 ${width} ${barHeight + textHeight}" role="img" aria-label="UPC barcode ${upc}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fff" />
        <g fill="#111">${bars.join('')}</g>
        <text x="${width / 2}" y="${barHeight + 18}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="2">${upc}</text>
      </svg>`;
  };
}());
