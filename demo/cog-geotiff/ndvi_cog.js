const ndvi = ["/", ["-", ["band", 2], ["band", 1]], ["+", ["band", 2], ["band", 1]]];

const ndwi = ["/", ["-", ["band", 3], ["band", 1]], ["+", ["band", 3], ["band", 1]]];

const source = new ol.source.GeoTIFF({
  // convertToRGB: true,
  sources: [
    {
      url: "https://s2downloads.eox.at/demo/Sentinel-2/3857/R10m.tif",
      bands: [3, 4],
      min: 0,
      nodata: 0,
      max: 65535,
    },
    {
      url: "https://s2downloads.eox.at/demo/Sentinel-2/3857/R60m.tif",
      bands: [9],
      min: 0,
      nodata: 0,
      max: 65535,
    },
  ],
});
const layer = new ol.layer.WebGLTile({
  source: source,
  style: {
    color: [
      "color",
      // red: | NDVI - NDWI |
      ["*", 255, ["abs", ["-", ndvi, ndwi]]],
      // green: NDVI
      ["*", 255, ndvi],
      // blue: NDWI
      ["*", 255, ndwi],
      // alpha
      ["band", 4],
    ],
  },
});

new CustomLayer("ndvi_cog", layer);
