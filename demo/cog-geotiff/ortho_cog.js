const layer = new ol.layer.WebGLTile({
  source: new ol.source.GeoTIFF({
    // convertToRGB: true,
    sources: [
      {
        // url: 'https://www.geo2france.fr/public/cog/ortho/2021_R32_Ortho_0m20_RVB_COG.tif',
        // url: 'https://ftp.datagrandest.fr/opendata/ign/bd-ortho/67/2021-RVB/cog/OHR_RVB_0M20_JP2-E080_LAMB93_D67-2021.tif',
        // url: 'https://sig.hautsdefrance.fr/ext/ol_cog/2021_PNR_SE_Ortho_0m20_RVB_COG.tif',
        url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif",
      },
    ],
  }),
});

new CustomLayer("ortho_cog", layer);
