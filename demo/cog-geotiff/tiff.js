const band = ["band", 1];

const source = new ol.source.GeoTIFF({
  wrapX: true,
  normalize: false,
  sources: [
    {
      url: "demo/cog-geotiff/data/boutro.tiff",
    },
  ],
});

const bandValue = ["band", 1];
const layer = new ol.layer.WebGLTile({
  source: source,
  style: {
    color: [
      "case",
      ["==", bandValue, -0],
      ["color", 0, 0, 0, 0],
      ["<=", bandValue, -5],
      ["color", 48, 18, 59, 1],
      ["<=", bandValue, -4],
      ["color", 69, 91, 205, 1],
      ["<=", bandValue, -3],
      ["color", 62, 156, 254, 1],
      ["<=", bandValue, -2],
      ["color", 24, 215, 203, 1],
      ["<=", bandValue, -1],
      ["color", 72, 248, 130, 1],
      ["<=", bandValue, 0],
      ["color", 164, 252, 60, 1],
      ["<=", bandValue, 1],
      ["color", 226, 220, 56, 1],
      ["<=", bandValue, 2],
      ["color", 254, 163, 49, 1],
      ["<=", bandValue, 3],
      ["color", 239, 89, 17, 1],
      ["<=", bandValue, 4],
      ["color", 194, 36, 3, 1],
      ["<=", bandValue, 5],
      ["color", 122, 4, 3, 1],
      ["color", 0, 0, 0, 1],
    ],
  },
});

new CustomLayer("tiff", layer);
