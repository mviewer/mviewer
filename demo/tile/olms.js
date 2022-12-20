!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t(
        require("ol/style/Style"),
        require("ol/style/Fill"),
        require("ol/style/Stroke"),
        require("ol/Observable"),
        require("ol/proj"),
        require("ol/style/Icon"),
        require("ol/tilegrid/TileGrid"),
        require("ol/Map"),
        require("ol/layer/Vector"),
        require("ol/layer/VectorTile"),
        require("ol/source/TileJSON"),
        require("ol/source/Vector"),
        require("ol/source/VectorTile"),
        require("ol/style/Circle"),
        require("ol/tilegrid"),
        require("ol/View"),
        require("ol/format/GeoJSON"),
        require("ol/format/MVT"),
        require("ol/layer/Tile")
      ))
    : "function" == typeof define && define.amd
    ? define(
        [
          "ol/style/Style",
          "ol/style/Fill",
          "ol/style/Stroke",
          "ol/Observable",
          "ol/proj",
          "ol/style/Icon",
          "ol/tilegrid/TileGrid",
          "ol/Map",
          "ol/layer/Vector",
          "ol/layer/VectorTile",
          "ol/source/TileJSON",
          "ol/source/Vector",
          "ol/source/VectorTile",
          "ol/style/Circle",
          "ol/tilegrid",
          "ol/View",
          "ol/format/GeoJSON",
          "ol/format/MVT",
          "ol/layer/Tile",
        ],
        t
      )
    : "object" == typeof exports
    ? (exports.olms = t(
        require("ol/style/Style"),
        require("ol/style/Fill"),
        require("ol/style/Stroke"),
        require("ol/Observable"),
        require("ol/proj"),
        require("ol/style/Icon"),
        require("ol/tilegrid/TileGrid"),
        require("ol/Map"),
        require("ol/layer/Vector"),
        require("ol/layer/VectorTile"),
        require("ol/source/TileJSON"),
        require("ol/source/Vector"),
        require("ol/source/VectorTile"),
        require("ol/style/Circle"),
        require("ol/tilegrid"),
        require("ol/View"),
        require("ol/format/GeoJSON"),
        require("ol/format/MVT"),
        require("ol/layer/Tile")
      ))
    : (e.olms = t(
        e.ol.style.Style,
        e.ol.style.Fill,
        e.ol.style.Stroke,
        e.ol.Observable,
        e.ol.proj,
        e.ol.style.Icon,
        e.ol.tilegrid.TileGrid,
        e.ol.Map,
        e.ol.layer.Vector,
        e.ol.layer.VectorTile,
        e.ol.source.TileJSON,
        e.ol.source.Vector,
        e.ol.source.VectorTile,
        e.ol.style.Circle,
        e.ol.tilegrid,
        e.ol.View,
        e.ol.format.GeoJSON,
        e.ol.format.MVT,
        e.ol.layer.Tile
      ));
})(window, function (e, t, r, n, o, i, a, s, l, u, c, p, h, d, f, y, m, g, v) {
  return (function (e) {
    var t = {};
    function r(n) {
      if (t[n]) return t[n].exports;
      var o = (t[n] = { i: n, l: !1, exports: {} });
      return e[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
    }
    return (
      (r.m = e),
      (r.c = t),
      (r.d = function (e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
      }),
      (r.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (r.t = function (e, t) {
        if ((1 & t && (e = r(e)), 8 & t)) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (
          (r.r(n),
          Object.defineProperty(n, "default", { enumerable: !0, value: e }),
          2 & t && "string" != typeof e)
        )
          for (var o in e)
            r.d(
              n,
              o,
              function (t) {
                return e[t];
              }.bind(null, o)
            );
        return n;
      }),
      (r.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return r.d(t, "a", t), t;
      }),
      (r.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (r.p = ""),
      r((r.s = 27))
    );
  })([
    function (e, t, r) {
      "use strict";
      (function (e, n) {
        r.d(t, "a", function () {
          return J;
        }),
          r.d(t, "b", function () {
            return wr;
          }),
          r.d(t, "c", function () {
            return Kr;
          }),
          r.d(t, "d", function () {
            return pr;
          }),
          r.d(t, "e", function () {
            return Xr;
          }),
          r.d(t, "f", function () {
            return o;
          });
        var o = {
          $version: 8,
          $root: {
            version: {
              required: !0,
              type: "enum",
              values: [8],
              doc: "Style specification version number. Must be 8.",
              example: 8,
            },
            name: {
              type: "string",
              doc: "A human-readable name for the style.",
              example: "Bright",
            },
            metadata: {
              type: "*",
              doc: "Arbitrary properties useful to track with the stylesheet, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'.",
            },
            center: {
              type: "array",
              value: "number",
              doc: "Default map center in longitude and latitude.  The style center will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
              example: [-73.9749, 40.7736],
            },
            zoom: {
              type: "number",
              doc: "Default zoom level.  The style zoom will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
              example: 12.5,
            },
            bearing: {
              type: "number",
              default: 0,
              period: 360,
              units: "degrees",
              doc: 'Default bearing, in degrees. The bearing is the compass direction that is "up"; for example, a bearing of 90° orients the map so that east is up. This value will be used only if the map has not been positioned by other means (e.g. map options or user interaction).',
              example: 29,
            },
            pitch: {
              type: "number",
              default: 0,
              units: "degrees",
              doc: "Default pitch, in degrees. Zero is perpendicular to the surface, for a look straight down at the map, while a greater value like 60 looks ahead towards the horizon. The style pitch will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
              example: 50,
            },
            light: {
              type: "light",
              doc: "The global light source.",
              example: { anchor: "viewport", color: "white", intensity: 0.4 },
            },
            sources: {
              required: !0,
              type: "sources",
              doc: "Data source specifications.",
              example: {
                "mapbox-streets": {
                  type: "vector",
                  url: "mapbox://mapbox.mapbox-streets-v6",
                },
              },
            },
            sprite: {
              type: "string",
              doc: "A base URL for retrieving the sprite image and metadata. The extensions `.png`, `.json` and scale factor `@2x.png` will be automatically appended. This property is required if any layer uses the `background-pattern`, `fill-pattern`, `line-pattern`, `fill-extrusion-pattern`, or `icon-image` properties. The URL must be absolute, containing the [scheme, authority and path components](https://en.wikipedia.org/wiki/URL#Syntax).",
              example: "mapbox://sprites/mapbox/bright-v8",
            },
            glyphs: {
              type: "string",
              doc: "A URL template for loading signed-distance-field glyph sets in PBF format. The URL must include `{fontstack}` and `{range}` tokens. This property is required if any layer uses the `text-field` layout property. The URL must be absolute, containing the [scheme, authority and path components](https://en.wikipedia.org/wiki/URL#Syntax).",
              example: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
            },
            transition: {
              type: "transition",
              doc: "A global transition definition to use as a default across properties, to be used for timing transitions between one value and the next when no property-specific transition is set. Collision-based symbol fading is controlled independently of the style's `transition` property.",
              example: { duration: 300, delay: 0 },
            },
            layers: {
              required: !0,
              type: "array",
              value: "layer",
              doc: "Layers will be drawn in the order of this array.",
              example: [
                {
                  id: "water",
                  source: "mapbox-streets",
                  "source-layer": "water",
                  type: "fill",
                  paint: { "fill-color": "#00ffff" },
                },
              ],
            },
          },
          sources: {
            "*": {
              type: "source",
              doc: "Specification of a data source. For vector and raster sources, either TileJSON or a URL to a TileJSON must be provided. For image and video sources, a URL must be provided. For GeoJSON sources, a URL or inline GeoJSON must be provided.",
            },
          },
          source: [
            "source_vector",
            "source_raster",
            "source_raster_dem",
            "source_geojson",
            "source_video",
            "source_image",
          ],
          source_vector: {
            type: {
              required: !0,
              type: "enum",
              values: { vector: { doc: "A vector tile source." } },
              doc: "The type of the source.",
            },
            url: {
              type: "string",
              doc: "A URL to a TileJSON resource. Supported protocols are `http:`, `https:`, and `mapbox://<Tileset ID>`.",
            },
            tiles: {
              type: "array",
              value: "string",
              doc: "An array of one or more tile source URLs, as in the TileJSON spec.",
            },
            bounds: {
              type: "array",
              value: "number",
              length: 4,
              default: [-180, -85.051129, 180, 85.051129],
              doc: "An array containing the longitude and latitude of the southwest and northeast corners of the source's bounding box in the following order: `[sw.lng, sw.lat, ne.lng, ne.lat]`. When this property is included in a source, no tiles outside of the given bounds are requested by Mapbox GL.",
            },
            scheme: {
              type: "enum",
              values: {
                xyz: { doc: "Slippy map tilenames scheme." },
                tms: { doc: "OSGeo spec scheme." },
              },
              default: "xyz",
              doc: "Influences the y direction of the tile coordinates. The global-mercator (aka Spherical Mercator) profile is assumed.",
            },
            minzoom: {
              type: "number",
              default: 0,
              doc: "Minimum zoom level for which tiles are available, as in the TileJSON spec.",
            },
            maxzoom: {
              type: "number",
              default: 22,
              doc: "Maximum zoom level for which tiles are available, as in the TileJSON spec. Data from tiles at the maxzoom are used when displaying the map at higher zoom levels.",
            },
            attribution: {
              type: "string",
              doc: "Contains an attribution to be displayed when the map is shown to a user.",
            },
            promoteId: {
              type: "promoteId",
              doc: "A property to use as a feature id (for feature state). Either a property name, or an object of the form `{<sourceLayer>: <propertyName>}`. If specified as a string for a vector tile source, the same property is used across all its source layers.",
            },
            "*": { type: "*", doc: "Other keys to configure the data source." },
          },
          source_raster: {
            type: {
              required: !0,
              type: "enum",
              values: { raster: { doc: "A raster tile source." } },
              doc: "The type of the source.",
            },
            url: {
              type: "string",
              doc: "A URL to a TileJSON resource. Supported protocols are `http:`, `https:`, and `mapbox://<Tileset ID>`.",
            },
            tiles: {
              type: "array",
              value: "string",
              doc: "An array of one or more tile source URLs, as in the TileJSON spec.",
            },
            bounds: {
              type: "array",
              value: "number",
              length: 4,
              default: [-180, -85.051129, 180, 85.051129],
              doc: "An array containing the longitude and latitude of the southwest and northeast corners of the source's bounding box in the following order: `[sw.lng, sw.lat, ne.lng, ne.lat]`. When this property is included in a source, no tiles outside of the given bounds are requested by Mapbox GL.",
            },
            minzoom: {
              type: "number",
              default: 0,
              doc: "Minimum zoom level for which tiles are available, as in the TileJSON spec.",
            },
            maxzoom: {
              type: "number",
              default: 22,
              doc: "Maximum zoom level for which tiles are available, as in the TileJSON spec. Data from tiles at the maxzoom are used when displaying the map at higher zoom levels.",
            },
            tileSize: {
              type: "number",
              default: 512,
              units: "pixels",
              doc: "The minimum visual size to display tiles for this layer. Only configurable for raster layers.",
            },
            scheme: {
              type: "enum",
              values: {
                xyz: { doc: "Slippy map tilenames scheme." },
                tms: { doc: "OSGeo spec scheme." },
              },
              default: "xyz",
              doc: "Influences the y direction of the tile coordinates. The global-mercator (aka Spherical Mercator) profile is assumed.",
            },
            attribution: {
              type: "string",
              doc: "Contains an attribution to be displayed when the map is shown to a user.",
            },
            "*": { type: "*", doc: "Other keys to configure the data source." },
          },
          source_raster_dem: {
            type: {
              required: !0,
              type: "enum",
              values: { "raster-dem": { doc: "A RGB-encoded raster DEM source" } },
              doc: "The type of the source.",
            },
            url: {
              type: "string",
              doc: "A URL to a TileJSON resource. Supported protocols are `http:`, `https:`, and `mapbox://<Tileset ID>`.",
            },
            tiles: {
              type: "array",
              value: "string",
              doc: "An array of one or more tile source URLs, as in the TileJSON spec.",
            },
            bounds: {
              type: "array",
              value: "number",
              length: 4,
              default: [-180, -85.051129, 180, 85.051129],
              doc: "An array containing the longitude and latitude of the southwest and northeast corners of the source's bounding box in the following order: `[sw.lng, sw.lat, ne.lng, ne.lat]`. When this property is included in a source, no tiles outside of the given bounds are requested by Mapbox GL.",
            },
            minzoom: {
              type: "number",
              default: 0,
              doc: "Minimum zoom level for which tiles are available, as in the TileJSON spec.",
            },
            maxzoom: {
              type: "number",
              default: 22,
              doc: "Maximum zoom level for which tiles are available, as in the TileJSON spec. Data from tiles at the maxzoom are used when displaying the map at higher zoom levels.",
            },
            tileSize: {
              type: "number",
              default: 512,
              units: "pixels",
              doc: "The minimum visual size to display tiles for this layer. Only configurable for raster layers.",
            },
            attribution: {
              type: "string",
              doc: "Contains an attribution to be displayed when the map is shown to a user.",
            },
            encoding: {
              type: "enum",
              values: {
                terrarium: {
                  doc: "Terrarium format PNG tiles. See https://aws.amazon.com/es/public-datasets/terrain/ for more info.",
                },
                mapbox: {
                  doc: "Mapbox Terrain RGB tiles. See https://www.mapbox.com/help/access-elevation-data/#mapbox-terrain-rgb for more info.",
                },
              },
              default: "mapbox",
              doc: "The encoding used by this source. Mapbox Terrain RGB is used by default",
            },
            "*": { type: "*", doc: "Other keys to configure the data source." },
          },
          source_geojson: {
            type: {
              required: !0,
              type: "enum",
              values: { geojson: { doc: "A GeoJSON data source." } },
              doc: "The data type of the GeoJSON source.",
            },
            data: { type: "*", doc: "A URL to a GeoJSON file, or inline GeoJSON." },
            maxzoom: {
              type: "number",
              default: 18,
              doc: "Maximum zoom level at which to create vector tiles (higher means greater detail at high zoom levels).",
            },
            attribution: {
              type: "string",
              doc: "Contains an attribution to be displayed when the map is shown to a user.",
            },
            buffer: {
              type: "number",
              default: 128,
              maximum: 512,
              minimum: 0,
              doc: "Size of the tile buffer on each side. A value of 0 produces no buffer. A value of 512 produces a buffer as wide as the tile itself. Larger values produce fewer rendering artifacts near tile edges and slower performance.",
            },
            tolerance: {
              type: "number",
              default: 0.375,
              doc: "Douglas-Peucker simplification tolerance (higher means simpler geometries and faster performance).",
            },
            cluster: {
              type: "boolean",
              default: !1,
              doc: "If the data is a collection of point features, setting this to true clusters the points by radius into groups. Cluster groups become new `Point` features in the source with additional properties:\n * `cluster` Is `true` if the point is a cluster \n * `cluster_id` A unqiue id for the cluster to be used in conjunction with the [cluster inspection methods](https://www.mapbox.com/mapbox-gl-js/api/#geojsonsource#getclusterexpansionzoom)\n * `point_count` Number of original points grouped into this cluster\n * `point_count_abbreviated` An abbreviated point count",
            },
            clusterRadius: {
              type: "number",
              default: 50,
              minimum: 0,
              doc: "Radius of each cluster if clustering is enabled. A value of 512 indicates a radius equal to the width of a tile.",
            },
            clusterMaxZoom: {
              type: "number",
              doc: "Max zoom on which to cluster points if clustering is enabled. Defaults to one zoom less than maxzoom (so that last zoom features are not clustered).",
            },
            clusterProperties: {
              type: "*",
              doc: 'An object defining custom properties on the generated clusters if clustering is enabled, aggregating values from clustered points. Has the form `{"property_name": [operator, map_expression]}`. `operator` is any expression function that accepts at least 2 operands (e.g. `"+"` or `"max"`) — it accumulates the property value from clusters/points the cluster contains; `map_expression` produces the value of a single point.\n\nExample: `{"sum": ["+", ["get", "scalerank"]]}`.\n\nFor more advanced use cases, in place of `operator`, you can use a custom reduce expression that references a special `["accumulated"]` value, e.g.:\n`{"sum": [["+", ["accumulated"], ["get", "sum"]], ["get", "scalerank"]]}`',
            },
            lineMetrics: {
              type: "boolean",
              default: !1,
              doc: "Whether to calculate line distance metrics. This is required for line layers that specify `line-gradient` values.",
            },
            generateId: {
              type: "boolean",
              default: !1,
              doc: "Whether to generate ids for the geojson features. When enabled, the `feature.id` property will be auto assigned based on its index in the `features` array, over-writing any previous values.",
            },
            promoteId: {
              type: "promoteId",
              doc: "A property to use as a feature id (for feature state). Either a property name, or an object of the form `{<sourceLayer>: <propertyName>}`.",
            },
          },
          source_video: {
            type: {
              required: !0,
              type: "enum",
              values: { video: { doc: "A video data source." } },
              doc: "The data type of the video source.",
            },
            urls: {
              required: !0,
              type: "array",
              value: "string",
              doc: "URLs to video content in order of preferred format.",
            },
            coordinates: {
              required: !0,
              doc: "Corners of video specified in longitude, latitude pairs.",
              type: "array",
              length: 4,
              value: {
                type: "array",
                length: 2,
                value: "number",
                doc: "A single longitude, latitude pair.",
              },
            },
          },
          source_image: {
            type: {
              required: !0,
              type: "enum",
              values: { image: { doc: "An image data source." } },
              doc: "The data type of the image source.",
            },
            url: { required: !0, type: "string", doc: "URL that points to an image." },
            coordinates: {
              required: !0,
              doc: "Corners of image specified in longitude, latitude pairs.",
              type: "array",
              length: 4,
              value: {
                type: "array",
                length: 2,
                value: "number",
                doc: "A single longitude, latitude pair.",
              },
            },
          },
          layer: {
            id: { type: "string", doc: "Unique layer name.", required: !0 },
            type: {
              type: "enum",
              values: {
                fill: {
                  doc: "A filled polygon with an optional stroked border.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.10.0",
                      android: "2.0.1",
                      ios: "2.0.0",
                      macos: "0.1.0",
                    },
                  },
                },
                line: {
                  doc: "A stroked line.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.10.0",
                      android: "2.0.1",
                      ios: "2.0.0",
                      macos: "0.1.0",
                    },
                  },
                },
                symbol: {
                  doc: "An icon or a text label.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.10.0",
                      android: "2.0.1",
                      ios: "2.0.0",
                      macos: "0.1.0",
                    },
                  },
                },
                circle: {
                  doc: "A filled circle.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.10.0",
                      android: "2.0.1",
                      ios: "2.0.0",
                      macos: "0.1.0",
                    },
                  },
                },
                heatmap: {
                  doc: "A heatmap.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.41.0",
                      android: "6.0.0",
                      ios: "4.0.0",
                      macos: "0.7.0",
                    },
                  },
                },
                "fill-extrusion": {
                  doc: "An extruded (3D) polygon.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.27.0",
                      android: "5.1.0",
                      ios: "3.6.0",
                      macos: "0.5.0",
                    },
                  },
                },
                raster: {
                  doc: "Raster map textures such as satellite imagery.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.10.0",
                      android: "2.0.1",
                      ios: "2.0.0",
                      macos: "0.1.0",
                    },
                  },
                },
                hillshade: {
                  doc: "Client-side hillshading visualization based on DEM data. Currently, the implementation only supports Mapbox Terrain RGB and Mapzen Terrarium tiles.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.43.0",
                      android: "6.0.0",
                      ios: "4.0.0",
                      macos: "0.7.0",
                    },
                  },
                },
                background: {
                  doc: "The background color or pattern of the map.",
                  "sdk-support": {
                    "basic functionality": {
                      js: "0.10.0",
                      android: "2.0.1",
                      ios: "2.0.0",
                      macos: "0.1.0",
                    },
                  },
                },
              },
              doc: "Rendering type of this layer.",
              required: !0,
            },
            metadata: {
              type: "*",
              doc: "Arbitrary properties useful to track with the layer, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'.",
            },
            source: {
              type: "string",
              doc: "Name of a source description to be used for this layer. Required for all layer types except `background`.",
            },
            "source-layer": {
              type: "string",
              doc: "Layer to use from a vector tile source. Required for vector tile sources; prohibited for all other source types, including GeoJSON sources.",
            },
            minzoom: {
              type: "number",
              minimum: 0,
              maximum: 24,
              doc: "The minimum zoom level for the layer. At zoom levels less than the minzoom, the layer will be hidden.",
            },
            maxzoom: {
              type: "number",
              minimum: 0,
              maximum: 24,
              doc: "The maximum zoom level for the layer. At zoom levels equal to or greater than the maxzoom, the layer will be hidden.",
            },
            filter: {
              type: "filter",
              doc: "A expression specifying conditions on source features. Only features that match the filter are displayed. Zoom expressions in filters are only evaluated at integer zoom levels. The `feature-state` expression is not supported in filter expressions.",
            },
            layout: { type: "layout", doc: "Layout properties for the layer." },
            paint: { type: "paint", doc: "Default paint properties for this layer." },
          },
          layout: [
            "layout_fill",
            "layout_line",
            "layout_circle",
            "layout_heatmap",
            "layout_fill-extrusion",
            "layout_symbol",
            "layout_raster",
            "layout_hillshade",
            "layout_background",
          ],
          layout_background: {
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              "property-type": "constant",
            },
          },
          layout_fill: {
            "fill-sort-key": {
              type: "number",
              doc: "Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.",
              "sdk-support": {
                "basic functionality": { js: "1.2.0" },
                "data-driven styling": { js: "1.2.0" },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              "property-type": "constant",
            },
          },
          layout_circle: {
            "circle-sort-key": {
              type: "number",
              doc: "Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.",
              "sdk-support": {
                "basic functionality": { js: "1.2.0" },
                "data-driven styling": { js: "1.2.0" },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              "property-type": "constant",
            },
          },
          layout_heatmap: {
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.41.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              "property-type": "constant",
            },
          },
          "layout_fill-extrusion": {
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              "property-type": "constant",
            },
          },
          layout_line: {
            "line-cap": {
              type: "enum",
              values: {
                butt: {
                  doc: "A cap with a squared-off end which is drawn to the exact endpoint of the line.",
                },
                round: {
                  doc: "A cap with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.",
                },
                square: {
                  doc: "A cap with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.",
                },
              },
              default: "butt",
              doc: "The display of line endings.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "line-join": {
              type: "enum",
              values: {
                bevel: {
                  doc: "A join with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.",
                },
                round: {
                  doc: "A join with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.",
                },
                miter: {
                  doc: "A join with a sharp, angled corner which is drawn with the outer sides beyond the endpoint of the path until they meet.",
                },
              },
              default: "miter",
              doc: "The display of lines when joining.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.40.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "line-miter-limit": {
              type: "number",
              default: 2,
              doc: "Used to automatically convert miter joins to bevel joins for sharp angles.",
              requires: [{ "line-join": "miter" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "line-round-limit": {
              type: "number",
              default: 1.05,
              doc: "Used to automatically convert round joins to miter joins for shallow angles.",
              requires: [{ "line-join": "round" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "line-sort-key": {
              type: "number",
              doc: "Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.",
              "sdk-support": {
                "basic functionality": { js: "1.2.0" },
                "data-driven styling": { js: "1.2.0" },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              "property-type": "constant",
            },
          },
          layout_symbol: {
            "symbol-placement": {
              type: "enum",
              values: {
                point: {
                  doc: "The label is placed at the point where the geometry is located.",
                },
                line: {
                  doc: "The label is placed along the line of the geometry. Can only be used on `LineString` and `Polygon` geometries.",
                },
                "line-center": {
                  doc: "The label is placed at the center of the line of the geometry. Can only be used on `LineString` and `Polygon` geometries. Note that a single feature in a vector tile may contain multiple line geometries.",
                },
              },
              default: "point",
              doc: "Label placement relative to its geometry.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "`line-center` value": {
                  js: "0.47.0",
                  android: "6.4.0",
                  ios: "4.3.0",
                  macos: "0.10.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "symbol-spacing": {
              type: "number",
              default: 250,
              minimum: 1,
              units: "pixels",
              doc: "Distance between two symbol anchors.",
              requires: [{ "symbol-placement": "line" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "symbol-avoid-edges": {
              type: "boolean",
              default: !1,
              doc: "If true, the symbols will not cross tile edges to avoid mutual collisions. Recommended in layers that don't have enough padding in the vector tile to prevent collisions, or if it is a point symbol layer placed after a line symbol layer. When using a client that supports global collision detection, like Mapbox GL JS version 0.42.0 or greater, enabling this property is not needed to prevent clipped labels at tile boundaries.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "symbol-sort-key": {
              type: "number",
              doc: "Sorts features in ascending order based on this value. Features with lower sort keys are drawn and placed first.  When `icon-allow-overlap` or `text-allow-overlap` is `false`, features with a lower sort key will have priority during placement. When `icon-allow-overlap` or `text-allow-overlap` is set to `true`, features with a higher sort key will overlap over features with a lower sort key.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.53.0",
                  android: "7.4.0",
                  ios: "4.11.0",
                  macos: "0.14.0",
                },
                "data-driven styling": {
                  js: "0.53.0",
                  android: "7.4.0",
                  ios: "4.11.0",
                  macos: "0.14.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "symbol-z-order": {
              type: "enum",
              values: {
                auto: {
                  doc: "If `symbol-sort-key` is set, sort based on that. Otherwise sort symbols by their y-position relative to the viewport.",
                },
                "viewport-y": {
                  doc: "Symbols will be sorted by their y-position relative to the viewport.",
                },
                source: {
                  doc: "Symbols will be rendered in the same order as the source data with no sorting applied.",
                },
              },
              default: "auto",
              doc: "Controls the order in which overlapping symbols in the same layer are rendered",
              "sdk-support": {
                "basic functionality": {
                  js: "0.49.0",
                  android: "6.6.0",
                  ios: "4.5.0",
                  macos: "0.12.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-allow-overlap": {
              type: "boolean",
              default: !1,
              doc: "If true, the icon will be visible even if it collides with other previously drawn symbols.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-ignore-placement": {
              type: "boolean",
              default: !1,
              doc: "If true, other symbols can be visible even if they collide with the icon.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-optional": {
              type: "boolean",
              default: !1,
              doc: "If true, text will display without their corresponding icons when the icon collides with other symbols and the text does not.",
              requires: ["icon-image", "text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-rotation-alignment": {
              type: "enum",
              values: {
                map: {
                  doc: "When `symbol-placement` is set to `point`, aligns icons east-west. When `symbol-placement` is set to `line` or `line-center`, aligns icon x-axes with the line.",
                },
                viewport: {
                  doc: "Produces icons whose x-axes are aligned with the x-axis of the viewport, regardless of the value of `symbol-placement`.",
                },
                auto: {
                  doc: "When `symbol-placement` is set to `point`, this is equivalent to `viewport`. When `symbol-placement` is set to `line` or `line-center`, this is equivalent to `map`.",
                },
              },
              default: "auto",
              doc: "In combination with `symbol-placement`, determines the rotation behavior of icons.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "`auto` value": {
                  js: "0.25.0",
                  android: "4.2.0",
                  ios: "3.4.0",
                  macos: "0.3.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-size": {
              type: "number",
              default: 1,
              minimum: 0,
              units: "factor of the original icon size",
              doc: "Scales the original size of the icon by the provided factor. The new pixel size of the image will be the original pixel size multiplied by `icon-size`. 1 is the original size; 3 triples the size of the image.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.35.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "icon-text-fit": {
              type: "enum",
              values: {
                none: {
                  doc: "The icon is displayed at its intrinsic aspect ratio.",
                },
                width: {
                  doc: "The icon is scaled in the x-dimension to fit the width of the text.",
                },
                height: {
                  doc: "The icon is scaled in the y-dimension to fit the height of the text.",
                },
                both: { doc: "The icon is scaled in both x- and y-dimensions." },
              },
              default: "none",
              doc: "Scales the icon to fit around the associated text.",
              requires: ["icon-image", "text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.21.0",
                  android: "4.2.0",
                  ios: "3.4.0",
                  macos: "0.2.1",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-text-fit-padding": {
              type: "array",
              value: "number",
              length: 4,
              default: [0, 0, 0, 0],
              units: "pixels",
              doc: "Size of the additional area added to dimensions determined by `icon-text-fit`, in clockwise order: top, right, bottom, left.",
              requires: [
                "icon-image",
                "text-field",
                { "icon-text-fit": ["both", "width", "height"] },
              ],
              "sdk-support": {
                "basic functionality": {
                  js: "0.21.0",
                  android: "4.2.0",
                  ios: "3.4.0",
                  macos: "0.2.1",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-image": {
              type: "resolvedImage",
              doc: "Name of image in sprite to use for drawing an image background.",
              tokens: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.35.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "icon-rotate": {
              type: "number",
              default: 0,
              period: 360,
              units: "degrees",
              doc: "Rotates the icon clockwise.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.21.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "icon-padding": {
              type: "number",
              default: 2,
              minimum: 0,
              units: "pixels",
              doc: "Size of the additional area around the icon bounding box used for detecting symbol collisions.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-keep-upright": {
              type: "boolean",
              default: !1,
              doc: "If true, the icon may be flipped to prevent it from being rendered upside-down.",
              requires: [
                "icon-image",
                { "icon-rotation-alignment": "map" },
                { "symbol-placement": ["line", "line-center"] },
              ],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-offset": {
              type: "array",
              value: "number",
              length: 2,
              default: [0, 0],
              doc: "Offset distance of icon from its anchor. Positive values indicate right and down, while negative values indicate left and up. Each component is multiplied by the value of `icon-size` to obtain the final offset in pixels. When combined with `icon-rotate` the offset will be as if the rotated direction was up.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "icon-anchor": {
              type: "enum",
              values: {
                center: {
                  doc: "The center of the icon is placed closest to the anchor.",
                },
                left: {
                  doc: "The left side of the icon is placed closest to the anchor.",
                },
                right: {
                  doc: "The right side of the icon is placed closest to the anchor.",
                },
                top: {
                  doc: "The top of the icon is placed closest to the anchor.",
                },
                bottom: {
                  doc: "The bottom of the icon is placed closest to the anchor.",
                },
                "top-left": {
                  doc: "The top left corner of the icon is placed closest to the anchor.",
                },
                "top-right": {
                  doc: "The top right corner of the icon is placed closest to the anchor.",
                },
                "bottom-left": {
                  doc: "The bottom left corner of the icon is placed closest to the anchor.",
                },
                "bottom-right": {
                  doc: "The bottom right corner of the icon is placed closest to the anchor.",
                },
              },
              default: "center",
              doc: "Part of the icon placed closest to the anchor.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.40.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
                "data-driven styling": {
                  js: "0.40.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "icon-pitch-alignment": {
              type: "enum",
              values: {
                map: { doc: "The icon is aligned to the plane of the map." },
                viewport: {
                  doc: "The icon is aligned to the plane of the viewport.",
                },
                auto: {
                  doc: "Automatically matches the value of `icon-rotation-alignment`.",
                },
              },
              default: "auto",
              doc: "Orientation of icon when map is pitched.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.39.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-pitch-alignment": {
              type: "enum",
              values: {
                map: { doc: "The text is aligned to the plane of the map." },
                viewport: {
                  doc: "The text is aligned to the plane of the viewport.",
                },
                auto: {
                  doc: "Automatically matches the value of `text-rotation-alignment`.",
                },
              },
              default: "auto",
              doc: "Orientation of text when map is pitched.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.21.0",
                  android: "4.2.0",
                  ios: "3.4.0",
                  macos: "0.2.1",
                },
                "`auto` value": {
                  js: "0.25.0",
                  android: "4.2.0",
                  ios: "3.4.0",
                  macos: "0.3.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-rotation-alignment": {
              type: "enum",
              values: {
                map: {
                  doc: "When `symbol-placement` is set to `point`, aligns text east-west. When `symbol-placement` is set to `line` or `line-center`, aligns text x-axes with the line.",
                },
                viewport: {
                  doc: "Produces glyphs whose x-axes are aligned with the x-axis of the viewport, regardless of the value of `symbol-placement`.",
                },
                auto: {
                  doc: "When `symbol-placement` is set to `point`, this is equivalent to `viewport`. When `symbol-placement` is set to `line` or `line-center`, this is equivalent to `map`.",
                },
              },
              default: "auto",
              doc: "In combination with `symbol-placement`, determines the rotation behavior of the individual glyphs forming the text.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "`auto` value": {
                  js: "0.25.0",
                  android: "4.2.0",
                  ios: "3.4.0",
                  macos: "0.3.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-field": {
              type: "formatted",
              default: "",
              tokens: !0,
              doc: "Value to use for a text label. If a plain `string` is provided, it will be treated as a `formatted` with default/inherited formatting options.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-font": {
              type: "array",
              value: "string",
              default: ["Open Sans Regular", "Arial Unicode MS Regular"],
              doc: "Font stack to use for displaying text.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-size": {
              type: "number",
              default: 16,
              minimum: 0,
              units: "pixels",
              doc: "Font size.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.35.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-max-width": {
              type: "number",
              default: 10,
              minimum: 0,
              units: "ems",
              doc: "The maximum line width for text wrapping.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.40.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-line-height": {
              type: "number",
              default: 1.2,
              units: "ems",
              doc: "Text leading value for multi-line text.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-letter-spacing": {
              type: "number",
              default: 0,
              units: "ems",
              doc: "Text tracking amount.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.40.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-justify": {
              type: "enum",
              values: {
                auto: { doc: "The text is aligned towards the anchor position." },
                left: { doc: "The text is aligned to the left." },
                center: { doc: "The text is centered." },
                right: { doc: "The text is aligned to the right." },
              },
              default: "center",
              doc: "Text justification options.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.39.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
                auto: {
                  js: "0.54.0",
                  android: "7.4.0",
                  ios: "4.10.0",
                  macos: "0.14.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-radial-offset": {
              type: "number",
              units: "ems",
              default: 0,
              doc: "Radial offset of text, in the direction of the symbol's anchor. Useful in combination with `text-variable-anchor`, which defaults to using the two-dimensional `text-offset` if present.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.54.0",
                  android: "7.4.0",
                  ios: "4.10.0",
                  macos: "0.14.0",
                },
                "data-driven styling": {
                  js: "0.54.0",
                  android: "7.4.0",
                  ios: "4.10.0",
                  macos: "0.14.0",
                },
              },
              requires: ["text-field"],
              "property-type": "data-driven",
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
            },
            "text-variable-anchor": {
              type: "array",
              value: "enum",
              values: {
                center: {
                  doc: "The center of the text is placed closest to the anchor.",
                },
                left: {
                  doc: "The left side of the text is placed closest to the anchor.",
                },
                right: {
                  doc: "The right side of the text is placed closest to the anchor.",
                },
                top: {
                  doc: "The top of the text is placed closest to the anchor.",
                },
                bottom: {
                  doc: "The bottom of the text is placed closest to the anchor.",
                },
                "top-left": {
                  doc: "The top left corner of the text is placed closest to the anchor.",
                },
                "top-right": {
                  doc: "The top right corner of the text is placed closest to the anchor.",
                },
                "bottom-left": {
                  doc: "The bottom left corner of the text is placed closest to the anchor.",
                },
                "bottom-right": {
                  doc: "The bottom right corner of the text is placed closest to the anchor.",
                },
              },
              requires: ["text-field", { "symbol-placement": ["point"] }],
              doc: "To increase the chance of placing high-priority labels on the map, you can provide an array of `text-anchor` locations: the renderer will attempt to place the label at each location, in order, before moving onto the next label. Use `text-justify: auto` to choose justification based on anchor position. To apply an offset, use the `text-radial-offset` or the two-dimensional `text-offset`.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.54.0",
                  android: "7.4.0",
                  ios: "4.10.0",
                  macos: "0.14.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-anchor": {
              type: "enum",
              values: {
                center: {
                  doc: "The center of the text is placed closest to the anchor.",
                },
                left: {
                  doc: "The left side of the text is placed closest to the anchor.",
                },
                right: {
                  doc: "The right side of the text is placed closest to the anchor.",
                },
                top: {
                  doc: "The top of the text is placed closest to the anchor.",
                },
                bottom: {
                  doc: "The bottom of the text is placed closest to the anchor.",
                },
                "top-left": {
                  doc: "The top left corner of the text is placed closest to the anchor.",
                },
                "top-right": {
                  doc: "The top right corner of the text is placed closest to the anchor.",
                },
                "bottom-left": {
                  doc: "The bottom left corner of the text is placed closest to the anchor.",
                },
                "bottom-right": {
                  doc: "The bottom right corner of the text is placed closest to the anchor.",
                },
              },
              default: "center",
              doc: "Part of the text placed closest to the anchor.",
              requires: ["text-field", { "!": "text-variable-anchor" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.39.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-max-angle": {
              type: "number",
              default: 45,
              units: "degrees",
              doc: "Maximum angle change between adjacent characters.",
              requires: ["text-field", { "symbol-placement": ["line", "line-center"] }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-writing-mode": {
              type: "array",
              value: "enum",
              values: {
                horizontal: {
                  doc: "If a text's language supports horizontal writing mode, symbols with point placement would be laid out horizontally.",
                },
                vertical: {
                  doc: "If a text's language supports vertical writing mode, symbols with point placement would be laid out vertically.",
                },
              },
              doc: "The property allows control over a symbol's orientation. Note that the property values act as a hint, so that a symbol whose language doesn’t support the provided orientation will be laid out in its natural orientation. Example: English point symbol will be rendered horizontally even if array value contains single 'vertical' enum value. The order of elements in an array define priority order for the placement of an orientation variant.",
              requires: ["text-field", { "symbol-placement": ["point"] }],
              "sdk-support": {
                "basic functionality": {
                  js: "1.3.0",
                  android: "8.3.0",
                  ios: "5.3.0",
                  macos: "0.14.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-rotate": {
              type: "number",
              default: 0,
              period: 360,
              units: "degrees",
              doc: "Rotates the text clockwise.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.35.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-padding": {
              type: "number",
              default: 2,
              minimum: 0,
              units: "pixels",
              doc: "Size of the additional area around the text bounding box used for detecting symbol collisions.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-keep-upright": {
              type: "boolean",
              default: !0,
              doc: "If true, the text may be flipped vertically to prevent it from being rendered upside-down.",
              requires: [
                "text-field",
                { "text-rotation-alignment": "map" },
                { "symbol-placement": ["line", "line-center"] },
              ],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-transform": {
              type: "enum",
              values: {
                none: { doc: "The text is not altered." },
                uppercase: {
                  doc: "Forces all letters to be displayed in uppercase.",
                },
                lowercase: {
                  doc: "Forces all letters to be displayed in lowercase.",
                },
              },
              default: "none",
              doc: "Specifies how to capitalize text, similar to the CSS `text-transform` property.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-offset": {
              type: "array",
              doc: "Offset distance of text from its anchor. Positive values indicate right and down, while negative values indicate left and up. If used with text-variable-anchor, input values will be taken as absolute values. Offsets along the x- and y-axis will be applied automatically based on the anchor position.",
              value: "number",
              units: "ems",
              length: 2,
              default: [0, 0],
              requires: ["text-field", { "!": "text-radial-offset" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.35.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom", "feature"] },
              "property-type": "data-driven",
            },
            "text-allow-overlap": {
              type: "boolean",
              default: !1,
              doc: "If true, the text will be visible even if it collides with other previously drawn symbols.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-ignore-placement": {
              type: "boolean",
              default: !1,
              doc: "If true, other symbols can be visible even if they collide with the text.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-optional": {
              type: "boolean",
              default: !1,
              doc: "If true, icons will display without their corresponding text when the text collides with other symbols and the icon does not.",
              requires: ["text-field", "icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              "property-type": "constant",
            },
          },
          layout_raster: {
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              "property-type": "constant",
            },
          },
          layout_hillshade: {
            visibility: {
              type: "enum",
              values: {
                visible: { doc: "The layer is shown." },
                none: { doc: "The layer is not shown." },
              },
              default: "visible",
              doc: "Whether this layer is displayed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              "property-type": "constant",
            },
          },
          filter: {
            type: "array",
            value: "*",
            doc: "A filter selects specific features from a layer.",
          },
          filter_operator: {
            type: "enum",
            values: {
              "==": { doc: '`["==", key, value]` equality: `feature[key] = value`' },
              "!=": {
                doc: '`["!=", key, value]` inequality: `feature[key] ≠ value`',
              },
              ">": {
                doc: '`[">", key, value]` greater than: `feature[key] > value`',
              },
              ">=": {
                doc: '`[">=", key, value]` greater than or equal: `feature[key] ≥ value`',
              },
              "<": { doc: '`["<", key, value]` less than: `feature[key] < value`' },
              "<=": {
                doc: '`["<=", key, value]` less than or equal: `feature[key] ≤ value`',
              },
              in: {
                doc: '`["in", key, v0, ..., vn]` set inclusion: `feature[key] ∈ {v0, ..., vn}`',
              },
              "!in": {
                doc: '`["!in", key, v0, ..., vn]` set exclusion: `feature[key] ∉ {v0, ..., vn}`',
              },
              all: { doc: '`["all", f0, ..., fn]` logical `AND`: `f0 ∧ ... ∧ fn`' },
              any: { doc: '`["any", f0, ..., fn]` logical `OR`: `f0 ∨ ... ∨ fn`' },
              none: {
                doc: '`["none", f0, ..., fn]` logical `NOR`: `¬f0 ∧ ... ∧ ¬fn`',
              },
              has: { doc: '`["has", key]` `feature[key]` exists' },
              "!has": { doc: '`["!has", key]` `feature[key]` does not exist' },
            },
            doc: "The filter operator.",
          },
          geometry_type: {
            type: "enum",
            values: {
              Point: { doc: "Filter to point geometries." },
              LineString: { doc: "Filter to line geometries." },
              Polygon: { doc: "Filter to polygon geometries." },
            },
            doc: "The geometry type for the filter to select.",
          },
          function: {
            expression: { type: "expression", doc: "An expression." },
            stops: { type: "array", doc: "An array of stops.", value: "function_stop" },
            base: {
              type: "number",
              default: 1,
              minimum: 0,
              doc: "The exponential base of the interpolation curve. It controls the rate at which the result increases. Higher values make the result increase more towards the high end of the range. With `1` the stops are interpolated linearly.",
            },
            property: {
              type: "string",
              doc: "The name of a feature property to use as the function input.",
              default: "$zoom",
            },
            type: {
              type: "enum",
              values: {
                identity: { doc: "Return the input value as the output value." },
                exponential: {
                  doc: "Generate an output by interpolating between stops just less than and just greater than the function input.",
                },
                interval: {
                  doc: "Return the output value of the stop just less than the function input.",
                },
                categorical: {
                  doc: "Return the output value of the stop equal to the function input.",
                },
              },
              doc: "The interpolation strategy to use in function evaluation.",
              default: "exponential",
            },
            colorSpace: {
              type: "enum",
              values: {
                rgb: { doc: "Use the RGB color space to interpolate color values" },
                lab: {
                  doc: "Use the LAB color space to interpolate color values.",
                },
                hcl: {
                  doc: "Use the HCL color space to interpolate color values, interpolating the Hue, Chroma, and Luminance channels individually.",
                },
              },
              doc: "The color space in which colors interpolated. Interpolating colors in perceptual color spaces like LAB and HCL tend to produce color ramps that look more consistent and produce colors that can be differentiated more easily than those interpolated in RGB space.",
              default: "rgb",
            },
            default: {
              type: "*",
              required: !1,
              doc: "A value to serve as a fallback function result when a value isn't otherwise available. It is used in the following circumstances:\n* In categorical functions, when the feature value does not match any of the stop domain values.\n* In property and zoom-and-property functions, when a feature does not contain a value for the specified property.\n* In identity functions, when the feature value is not valid for the style property (for example, if the function is being used for a `circle-color` property but the feature property value is not a string or not a valid color).\n* In interval or exponential property and zoom-and-property functions, when the feature value is not numeric.\nIf no default is provided, the style property's default is used in these circumstances.",
            },
          },
          function_stop: {
            type: "array",
            minimum: 0,
            maximum: 24,
            value: ["number", "color"],
            length: 2,
            doc: "Zoom level and value pair.",
          },
          expression: {
            type: "array",
            value: "*",
            minimum: 1,
            doc: "An expression defines a function that can be used for data-driven style properties or feature filters.",
          },
          expression_name: {
            doc: "",
            type: "enum",
            values: {
              let: {
                doc: 'Binds expressions to named variables, which can then be referenced in the result expression using ["var", "variable_name"].',
                group: "Variable binding",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              var: {
                doc: 'References variable bound using "let".',
                group: "Variable binding",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              literal: {
                doc: "Provides a literal array or object value.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              array: {
                doc: "Asserts that the input is an array (optionally with a specific item type and length).  If, when the input expression is evaluated, it is not of the asserted type, then this assertion will cause the whole expression to be aborted.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              at: {
                doc: "Retrieves an item from an array.",
                group: "Lookup",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              in: {
                doc: "Determines whether an item exists in an array or a substring exists in a string.",
                group: "Lookup",
                "sdk-support": { "basic functionality": { js: "1.6.0" } },
              },
              case: {
                doc: "Selects the first output whose corresponding test condition evaluates to true, or the fallback value otherwise.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              match: {
                doc: 'Selects the output whose label value matches the input value, or the fallback value if no match is found. The input can be any expression (e.g. `["get", "building_type"]`). Each label must be either:\n * a single literal value; or\n * an array of literal values, whose values must be all strings or all numbers (e.g. `[100, 101]` or `["c", "b"]`). The input matches if any of the values in the array matches, similar to the `"in"` operator.\n\nEach label must be unique. If the input type does not match the type of the labels, the result will be the fallback value.',
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              coalesce: {
                doc: "Evaluates each expression in turn until the first non-null value is obtained, and returns that value.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              step: {
                doc: 'Produces discrete, stepped results by evaluating a piecewise-constant function defined by pairs of input and output values ("stops"). The `input` may be any numeric expression (e.g., `["get", "population"]`). Stop inputs must be numeric literals in strictly ascending order. Returns the output value of the stop just less than the input, or the first output if the input is less than the first stop.',
                group: "Ramps, scales, curves",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.42.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              interpolate: {
                doc: 'Produces continuous, smooth results by interpolating between pairs of input and output values ("stops"). The `input` may be any numeric expression (e.g., `["get", "population"]`). Stop inputs must be numeric literals in strictly ascending order. The output type must be `number`, `array<number>`, or `color`.\n\nInterpolation types:\n- `["linear"]`: interpolates linearly between the pair of stops just less than and just greater than the input.\n- `["exponential", base]`: interpolates exponentially between the stops just less than and just greater than the input. `base` controls the rate at which the output increases: higher values make the output increase more towards the high end of the range. With values close to 1 the output increases linearly.\n- `["cubic-bezier", x1, y1, x2, y2]`: interpolates using the cubic bezier curve defined by the given control points.',
                group: "Ramps, scales, curves",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.42.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "interpolate-hcl": {
                doc: 'Produces continuous, smooth results by interpolating between pairs of input and output values ("stops"). Works like `interpolate`, but the output type must be `color`, and the interpolation is performed in the Hue-Chroma-Luminance color space.',
                group: "Ramps, scales, curves",
                "sdk-support": { "basic functionality": { js: "0.49.0" } },
              },
              "interpolate-lab": {
                doc: 'Produces continuous, smooth results by interpolating between pairs of input and output values ("stops"). Works like `interpolate`, but the output type must be `color`, and the interpolation is performed in the CIELAB color space.',
                group: "Ramps, scales, curves",
                "sdk-support": { "basic functionality": { js: "0.49.0" } },
              },
              ln2: {
                doc: "Returns mathematical constant ln(2).",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              pi: {
                doc: "Returns the mathematical constant pi.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              e: {
                doc: "Returns the mathematical constant e.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              typeof: {
                doc: "Returns a string describing the type of the given value.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              string: {
                doc: "Asserts that the input value is a string. If multiple values are provided, each one is evaluated in order until a string is obtained. If none of the inputs are strings, the expression is an error.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              number: {
                doc: "Asserts that the input value is a number. If multiple values are provided, each one is evaluated in order until a number is obtained. If none of the inputs are numbers, the expression is an error.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              boolean: {
                doc: "Asserts that the input value is a boolean. If multiple values are provided, each one is evaluated in order until a boolean is obtained. If none of the inputs are booleans, the expression is an error.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              object: {
                doc: "Asserts that the input value is an object. If multiple values are provided, each one is evaluated in order until an object is obtained. If none of the inputs are objects, the expression is an error.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              collator: {
                doc: "Returns a `collator` for use in locale-dependent comparison operations. The `case-sensitive` and `diacritic-sensitive` options default to `false`. The `locale` argument specifies the IETF language tag of the locale to use. If none is provided, the default locale is used. If the requested locale is not available, the `collator` will use a system-defined fallback locale. Use `resolved-locale` to test the results of locale fallback behavior.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.2.0",
                    macos: "0.9.0",
                  },
                },
              },
              format: {
                doc: "Returns `formatted` text containing annotations for use in mixed-format `text-field` entries. For a `text-field` entries of a string type, following option object's properties are supported: If set, the `text-font` value overrides the font specified by the root layout properties. If set, the `font-scale` value specifies a scaling factor relative to the `text-size` specified in the root layout properties. If set, the `text-color` value overrides the color specified by the root paint properties for this layer.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.48.0",
                    android: "6.7.0",
                    ios: "4.6.0",
                    macos: "0.12.0",
                  },
                  "text-font": {
                    js: "0.48.0",
                    android: "6.7.0",
                    ios: "4.6.0",
                    macos: "0.12.0",
                  },
                  "font-scale": {
                    js: "0.48.0",
                    android: "6.7.0",
                    ios: "4.6.0",
                    macos: "0.12.0",
                  },
                  "text-color": {
                    js: "1.3.0",
                    android: "7.3.0",
                    ios: "4.10.0",
                    macos: "0.14.0",
                  },
                  image: { js: "1.6.0" },
                },
              },
              image: {
                doc: "Returns an `image` type for use in `icon-image`, `*-pattern` entries and as a section in the `format` expression. If set, the `image` argument will check that the requested image exists in the style and will return either the resolved image name or `null`, depending on whether or not the image is currently in the style. This validation process is synchronous and requires the image to have been added to the style before requesting it in the `image` argument.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "1.4.0",
                    android: "8.6.0",
                    ios: "5.6.0",
                  },
                },
              },
              "number-format": {
                doc: "Converts the input number into a string representation using the providing formatting rules. If set, the `locale` argument specifies the locale to use, as a BCP 47 language tag. If set, the `currency` argument specifies an ISO 4217 code to use for currency-style formatting. If set, the `min-fraction-digits` and `max-fraction-digits` arguments specify the minimum and maximum number of fractional digits to include.",
                group: "Types",
                "sdk-support": { "basic functionality": { js: "0.54.0" } },
              },
              "to-string": {
                doc: 'Converts the input value to a string. If the input is `null`, the result is `""`. If the input is a boolean, the result is `"true"` or `"false"`. If the input is a number, it is converted to a string as specified by the ["NumberToString" algorithm](https://tc39.github.io/ecma262/#sec-tostring-applied-to-the-number-type) of the ECMAScript Language Specification. If the input is a color, it is converted to a string of the form `"rgba(r,g,b,a)"`, where `r`, `g`, and `b` are numerals ranging from 0 to 255, and `a` ranges from 0 to 1. Otherwise, the input is converted to a string in the format specified by the [`JSON.stringify`](https://tc39.github.io/ecma262/#sec-json.stringify) function of the ECMAScript Language Specification.',
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "to-number": {
                doc: 'Converts the input value to a number, if possible. If the input is `null` or `false`, the result is 0. If the input is `true`, the result is 1. If the input is a string, it is converted to a number as specified by the ["ToNumber Applied to the String Type" algorithm](https://tc39.github.io/ecma262/#sec-tonumber-applied-to-the-string-type) of the ECMAScript Language Specification. If multiple values are provided, each one is evaluated in order until the first successful conversion is obtained. If none of the inputs can be converted, the expression is an error.',
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "to-boolean": {
                doc: "Converts the input value to a boolean. The result is `false` when then input is an empty string, 0, `false`, `null`, or `NaN`; otherwise it is `true`.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "to-rgba": {
                doc: "Returns a four-element array containing the input color's red, green, blue, and alpha components, in that order.",
                group: "Color",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "to-color": {
                doc: "Converts the input value to a color. If multiple values are provided, each one is evaluated in order until the first successful conversion is obtained. If none of the inputs can be converted, the expression is an error.",
                group: "Types",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              rgb: {
                doc: "Creates a color value from red, green, and blue components, which must range between 0 and 255, and an alpha component of 1. If any component is out of range, the expression is an error.",
                group: "Color",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              rgba: {
                doc: "Creates a color value from red, green, blue components, which must range between 0 and 255, and an alpha component which must range between 0 and 1. If any component is out of range, the expression is an error.",
                group: "Color",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              get: {
                doc: "Retrieves a property value from the current feature's properties, or from another object if a second argument is provided. Returns null if the requested property is missing.",
                group: "Lookup",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              has: {
                doc: "Tests for the presence of an property value in the current feature's properties, or from another object if a second argument is provided.",
                group: "Lookup",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              length: {
                doc: "Gets the length of an array or string.",
                group: "Lookup",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              properties: {
                doc: 'Gets the feature properties object.  Note that in some cases, it may be more efficient to use ["get", "property_name"] directly.',
                group: "Feature data",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "feature-state": {
                doc: "Retrieves a property value from the current feature's state. Returns null if the requested property is not present on the feature's state. A feature's state is not part of the GeoJSON or vector tile data, and must be set programmatically on each feature. Features are identified by their `id` attribute, which must be an integer or a string that can be cast to an integer. Note that [\"feature-state\"] can only be used with paint properties that support data-driven styling.",
                group: "Feature data",
                "sdk-support": { "basic functionality": { js: "0.46.0" } },
              },
              "geometry-type": {
                doc: "Gets the feature's geometry type: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon.",
                group: "Feature data",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              id: {
                doc: "Gets the feature's id, if it has one.",
                group: "Feature data",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              zoom: {
                doc: 'Gets the current zoom level.  Note that in style layout and paint properties, ["zoom"] may only appear as the input to a top-level "step" or "interpolate" expression.',
                group: "Zoom",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "heatmap-density": {
                doc: "Gets the kernel density estimation of a pixel in a heatmap layer, which is a relative measure of how many data points are crowded around a particular pixel. Can only be used in the `heatmap-color` property.",
                group: "Heatmap",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "line-progress": {
                doc: "Gets the progress along a gradient line. Can only be used in the `line-gradient` property.",
                group: "Feature data",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.6.0",
                    macos: "0.12.0",
                  },
                },
              },
              accumulated: {
                doc: "Gets the value of a cluster property accumulated so far. Can only be used in the `clusterProperties` option of a clustered GeoJSON source.",
                group: "Feature data",
                "sdk-support": { "basic functionality": { js: "0.53.0" } },
              },
              "+": {
                doc: "Returns the sum of the inputs.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "*": {
                doc: "Returns the product of the inputs.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "-": {
                doc: "For two inputs, returns the result of subtracting the second input from the first. For a single input, returns the result of subtracting it from 0.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "/": {
                doc: "Returns the result of floating point division of the first input by the second.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "%": {
                doc: "Returns the remainder after integer division of the first input by the second.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "^": {
                doc: "Returns the result of raising the first input to the power specified by the second.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              sqrt: {
                doc: "Returns the square root of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.42.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              log10: {
                doc: "Returns the base-ten logarithm of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              ln: {
                doc: "Returns the natural logarithm of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              log2: {
                doc: "Returns the base-two logarithm of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              sin: {
                doc: "Returns the sine of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              cos: {
                doc: "Returns the cosine of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              tan: {
                doc: "Returns the tangent of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              asin: {
                doc: "Returns the arcsine of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              acos: {
                doc: "Returns the arccosine of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              atan: {
                doc: "Returns the arctangent of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              min: {
                doc: "Returns the minimum value of the inputs.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              max: {
                doc: "Returns the maximum value of the inputs.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              round: {
                doc: 'Rounds the input to the nearest integer. Halfway values are rounded away from zero. For example, `["round", -1.5]` evaluates to -2.',
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.45.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              abs: {
                doc: "Returns the absolute value of the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.45.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              ceil: {
                doc: "Returns the smallest integer that is greater than or equal to the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.45.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              floor: {
                doc: "Returns the largest integer that is less than or equal to the input.",
                group: "Math",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.45.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "==": {
                doc: "Returns `true` if the input values are equal, `false` otherwise. The comparison is strictly typed: values of different runtime types are always considered unequal. Cases where the types are known to be different at parse time are considered invalid and will produce a parse error. Accepts an optional `collator` argument to control locale-dependent string comparisons.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                  collator: {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.2.0",
                    macos: "0.9.0",
                  },
                },
              },
              "!=": {
                doc: "Returns `true` if the input values are not equal, `false` otherwise. The comparison is strictly typed: values of different runtime types are always considered unequal. Cases where the types are known to be different at parse time are considered invalid and will produce a parse error. Accepts an optional `collator` argument to control locale-dependent string comparisons.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                  collator: {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.2.0",
                    macos: "0.9.0",
                  },
                },
              },
              ">": {
                doc: "Returns `true` if the first input is strictly greater than the second, `false` otherwise. The arguments are required to be either both strings or both numbers; if during evaluation they are not, expression evaluation produces an error. Cases where this constraint is known not to hold at parse time are considered in valid and will produce a parse error. Accepts an optional `collator` argument to control locale-dependent string comparisons.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                  collator: {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.2.0",
                    macos: "0.9.0",
                  },
                },
              },
              "<": {
                doc: "Returns `true` if the first input is strictly less than the second, `false` otherwise. The arguments are required to be either both strings or both numbers; if during evaluation they are not, expression evaluation produces an error. Cases where this constraint is known not to hold at parse time are considered in valid and will produce a parse error. Accepts an optional `collator` argument to control locale-dependent string comparisons.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                  collator: {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.2.0",
                    macos: "0.9.0",
                  },
                },
              },
              ">=": {
                doc: "Returns `true` if the first input is greater than or equal to the second, `false` otherwise. The arguments are required to be either both strings or both numbers; if during evaluation they are not, expression evaluation produces an error. Cases where this constraint is known not to hold at parse time are considered in valid and will produce a parse error. Accepts an optional `collator` argument to control locale-dependent string comparisons.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                  collator: {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.2.0",
                    macos: "0.9.0",
                  },
                },
              },
              "<=": {
                doc: "Returns `true` if the first input is less than or equal to the second, `false` otherwise. The arguments are required to be either both strings or both numbers; if during evaluation they are not, expression evaluation produces an error. Cases where this constraint is known not to hold at parse time are considered in valid and will produce a parse error. Accepts an optional `collator` argument to control locale-dependent string comparisons.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                  collator: {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.2.0",
                    macos: "0.9.0",
                  },
                },
              },
              all: {
                doc: "Returns `true` if all the inputs are `true`, `false` otherwise. The inputs are evaluated in order, and evaluation is short-circuiting: once an input expression evaluates to `false`, the result is `false` and no further input expressions are evaluated.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              any: {
                doc: "Returns `true` if any of the inputs are `true`, `false` otherwise. The inputs are evaluated in order, and evaluation is short-circuiting: once an input expression evaluates to `true`, the result is `true` and no further input expressions are evaluated.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "!": {
                doc: "Logical negation. Returns `true` if the input is `false`, and `false` if the input is `true`.",
                group: "Decision",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              within: {
                doc: "Returns `true` if the feature being evaluated is inside the pre-defined geometry boundary, `false` otherwise. The expression has one argument which must be a valid GeoJSON Polygon/Multi-Polygon object. The expression only evaluates on `Point` or `LineString` feature. For `Point` feature, The expression will return false if any point of the feature is on the boundary or outside the boundary. For `LineString` feature, the expression will return false if the line is fully outside the boundary, or the line is partially intersecting the boundary, which means either part of the line is outside of the boundary, or end point of the line lies on the boundary.",
                group: "Decision",
                "sdk-support": { "basic functionality": { js: "1.9.0" } },
              },
              "is-supported-script": {
                doc: "Returns `true` if the input string is expected to render legibly. Returns `false` if the input string contains sections that cannot be rendered without potential loss of meaning (e.g. Indic scripts that require complex text shaping, or right-to-left scripts if the the `mapbox-gl-rtl-text` plugin is not in use in Mapbox GL JS).",
                group: "String",
                "sdk-support": {
                  "basic functionality": { js: "0.45.0", android: "6.6.0" },
                },
              },
              upcase: {
                doc: "Returns the input string converted to uppercase. Follows the Unicode Default Case Conversion algorithm and the locale-insensitive case mappings in the Unicode Character Database.",
                group: "String",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              downcase: {
                doc: "Returns the input string converted to lowercase. Follows the Unicode Default Case Conversion algorithm and the locale-insensitive case mappings in the Unicode Character Database.",
                group: "String",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              concat: {
                doc: "Returns a `string` consisting of the concatenation of the inputs. Each input is converted to a string as if by `to-string`.",
                group: "String",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.41.0",
                    android: "6.0.0",
                    ios: "4.0.0",
                    macos: "0.7.0",
                  },
                },
              },
              "resolved-locale": {
                doc: "Returns the IETF language tag of the locale being used by the provided `collator`. This can be used to determine the default system locale, or to determine if a requested locale was successfully loaded.",
                group: "String",
                "sdk-support": {
                  "basic functionality": {
                    js: "0.45.0",
                    android: "6.5.0",
                    ios: "4.2.0",
                    macos: "0.9.0",
                  },
                },
              },
            },
          },
          light: {
            anchor: {
              type: "enum",
              default: "viewport",
              values: {
                map: {
                  doc: "The position of the light source is aligned to the rotation of the map.",
                },
                viewport: {
                  doc: "The position of the light source is aligned to the rotation of the viewport.",
                },
              },
              "property-type": "data-constant",
              transition: !1,
              expression: { interpolated: !1, parameters: ["zoom"] },
              doc: "Whether extruded geometries are lit relative to the map or viewport.",
              example: "map",
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
            },
            position: {
              type: "array",
              default: [1.15, 210, 30],
              length: 3,
              value: "number",
              "property-type": "data-constant",
              transition: !0,
              expression: { interpolated: !0, parameters: ["zoom"] },
              doc: "Position of the light source relative to lit (extruded) geometries, in [r radial coordinate, a azimuthal angle, p polar angle] where r indicates the distance from the center of the base of an object to its light, a indicates the position of the light relative to 0° (0° when `light.anchor` is set to `viewport` corresponds to the top of the viewport, or 0° when `light.anchor` is set to `map` corresponds to due north, and degrees proceed clockwise), and p indicates the height of the light (from 0°, directly above, to 180°, directly below).",
              example: [1.5, 90, 80],
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
            },
            color: {
              type: "color",
              "property-type": "data-constant",
              default: "#ffffff",
              expression: { interpolated: !0, parameters: ["zoom"] },
              transition: !0,
              doc: "Color tint for lighting extruded geometries.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
            },
            intensity: {
              type: "number",
              "property-type": "data-constant",
              default: 0.5,
              minimum: 0,
              maximum: 1,
              expression: { interpolated: !0, parameters: ["zoom"] },
              transition: !0,
              doc: "Intensity of lighting (on a scale from 0 to 1). Higher numbers will present as more extreme contrast.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
            },
          },
          paint: [
            "paint_fill",
            "paint_line",
            "paint_circle",
            "paint_heatmap",
            "paint_fill-extrusion",
            "paint_symbol",
            "paint_raster",
            "paint_hillshade",
            "paint_background",
          ],
          paint_fill: {
            "fill-antialias": {
              type: "boolean",
              default: !0,
              doc: "Whether or not the fill should be antialiased.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "fill-opacity": {
              type: "number",
              default: 1,
              minimum: 0,
              maximum: 1,
              doc: "The opacity of the entire fill layer. In contrast to the `fill-color`, this value will also affect the 1px stroke around the fill, if the stroke is used.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.21.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "fill-color": {
              type: "color",
              default: "#000000",
              doc: "The color of the filled part of this layer. This color can be specified as `rgba` with an alpha component and the color's opacity will not affect the opacity of the 1px stroke, if it is used.",
              transition: !0,
              requires: [{ "!": "fill-pattern" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.19.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "fill-outline-color": {
              type: "color",
              doc: "The outline color of the fill. Matches the value of `fill-color` if unspecified.",
              transition: !0,
              requires: [{ "!": "fill-pattern" }, { "fill-antialias": !0 }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.19.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "fill-translate": {
              type: "array",
              value: "number",
              length: 2,
              default: [0, 0],
              transition: !0,
              units: "pixels",
              doc: "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "fill-translate-anchor": {
              type: "enum",
              values: {
                map: { doc: "The fill is translated relative to the map." },
                viewport: {
                  doc: "The fill is translated relative to the viewport.",
                },
              },
              doc: "Controls the frame of reference for `fill-translate`.",
              default: "map",
              requires: ["fill-translate"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "fill-pattern": {
              type: "resolvedImage",
              transition: !0,
              doc: "Name of image in sprite to use for drawing image fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoom-dependent expressions will be evaluated only at integer zoom levels.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.49.0",
                  android: "6.5.0",
                  macos: "0.11.0",
                  ios: "4.4.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "cross-faded-data-driven",
            },
          },
          "paint_fill-extrusion": {
            "fill-extrusion-opacity": {
              type: "number",
              default: 1,
              minimum: 0,
              maximum: 1,
              doc: "The opacity of the entire fill extrusion layer. This is rendered on a per-layer, not per-feature, basis, and data-driven styling is not available.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "fill-extrusion-color": {
              type: "color",
              default: "#000000",
              doc: "The base color of the extruded fill. The extrusion's surfaces will be shaded differently based on this color in combination with the root `light` settings. If this color is specified as `rgba` with an alpha component, the alpha component will be ignored; use `fill-extrusion-opacity` to set layer opacity.",
              transition: !0,
              requires: [{ "!": "fill-extrusion-pattern" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
                "data-driven styling": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "fill-extrusion-translate": {
              type: "array",
              value: "number",
              length: 2,
              default: [0, 0],
              transition: !0,
              units: "pixels",
              doc: "The geometry's offset. Values are [x, y] where negatives indicate left and up (on the flat plane), respectively.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "fill-extrusion-translate-anchor": {
              type: "enum",
              values: {
                map: {
                  doc: "The fill extrusion is translated relative to the map.",
                },
                viewport: {
                  doc: "The fill extrusion is translated relative to the viewport.",
                },
              },
              doc: "Controls the frame of reference for `fill-extrusion-translate`.",
              default: "map",
              requires: ["fill-extrusion-translate"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "fill-extrusion-pattern": {
              type: "resolvedImage",
              transition: !0,
              doc: "Name of image in sprite to use for drawing images on extruded fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoom-dependent expressions will be evaluated only at integer zoom levels.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
                "data-driven styling": {
                  js: "0.49.0",
                  android: "6.5.0",
                  macos: "0.11.0",
                  ios: "4.4.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "cross-faded-data-driven",
            },
            "fill-extrusion-height": {
              type: "number",
              default: 0,
              minimum: 0,
              units: "meters",
              doc: "The height with which to extrude this layer.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
                "data-driven styling": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "fill-extrusion-base": {
              type: "number",
              default: 0,
              minimum: 0,
              units: "meters",
              doc: "The height with which to extrude the base of this layer. Must be less than or equal to `fill-extrusion-height`.",
              transition: !0,
              requires: ["fill-extrusion-height"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
                "data-driven styling": {
                  js: "0.27.0",
                  android: "5.1.0",
                  ios: "3.6.0",
                  macos: "0.5.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "fill-extrusion-vertical-gradient": {
              type: "boolean",
              default: !0,
              doc: "Whether to apply a vertical gradient to the sides of a fill-extrusion layer. If true, sides will be shaded slightly darker farther down.",
              transition: !1,
              "sdk-support": {
                "basic functionality": {
                  js: "0.50.0",
                  ios: "4.7.0",
                  macos: "0.13.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
          },
          paint_line: {
            "line-opacity": {
              type: "number",
              doc: "The opacity at which the line will be drawn.",
              default: 1,
              minimum: 0,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "line-color": {
              type: "color",
              doc: "The color with which the line will be drawn.",
              default: "#000000",
              transition: !0,
              requires: [{ "!": "line-pattern" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.23.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "line-translate": {
              type: "array",
              value: "number",
              length: 2,
              default: [0, 0],
              transition: !0,
              units: "pixels",
              doc: "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "line-translate-anchor": {
              type: "enum",
              values: {
                map: { doc: "The line is translated relative to the map." },
                viewport: {
                  doc: "The line is translated relative to the viewport.",
                },
              },
              doc: "Controls the frame of reference for `line-translate`.",
              default: "map",
              requires: ["line-translate"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "line-width": {
              type: "number",
              default: 1,
              minimum: 0,
              transition: !0,
              units: "pixels",
              doc: "Stroke thickness.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.39.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "line-gap-width": {
              type: "number",
              default: 0,
              minimum: 0,
              doc: "Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap.",
              transition: !0,
              units: "pixels",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "line-offset": {
              type: "number",
              default: 0,
              doc: "The line's offset. For linear features, a positive value offsets the line to the right, relative to the direction of the line, and a negative value to the left. For polygon features, a positive value results in an inset, and a negative value results in an outset.",
              transition: !0,
              units: "pixels",
              "sdk-support": {
                "basic functionality": {
                  js: "0.12.1",
                  android: "3.0.0",
                  ios: "3.1.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "line-blur": {
              type: "number",
              default: 0,
              minimum: 0,
              transition: !0,
              units: "pixels",
              doc: "Blur applied to the line, in pixels.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "line-dasharray": {
              type: "array",
              value: "number",
              doc: "Specifies the lengths of the alternating dashes and gaps that form the dash pattern. The lengths are later scaled by the line width. To convert a dash length to pixels, multiply the length by the current line width. Note that GeoJSON sources with `lineMetrics: true` specified won't render dashed lines to the expected scale. Also note that zoom-dependent expressions will be evaluated only at integer zoom levels.",
              minimum: 0,
              transition: !0,
              units: "line widths",
              requires: [{ "!": "line-pattern" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {},
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "cross-faded",
            },
            "line-pattern": {
              type: "resolvedImage",
              transition: !0,
              doc: "Name of image in sprite to use for drawing image lines. For seamless patterns, image width must be a factor of two (2, 4, 8, ..., 512). Note that zoom-dependent expressions will be evaluated only at integer zoom levels.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.49.0",
                  android: "6.5.0",
                  macos: "0.11.0",
                  ios: "4.4.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom", "feature"] },
              "property-type": "cross-faded-data-driven",
            },
            "line-gradient": {
              type: "color",
              doc: 'Defines a gradient with which to color a line feature. Can only be used with GeoJSON sources that specify `"lineMetrics": true`.',
              transition: !1,
              requires: [
                { "!": "line-dasharray" },
                { "!": "line-pattern" },
                { source: "geojson", has: { lineMetrics: !0 } },
              ],
              "sdk-support": {
                "basic functionality": {
                  js: "0.45.0",
                  android: "6.5.0",
                  ios: "4.4.0",
                  macos: "0.11.0",
                },
                "data-driven styling": {},
              },
              expression: { interpolated: !0, parameters: ["line-progress"] },
              "property-type": "color-ramp",
            },
          },
          paint_circle: {
            "circle-radius": {
              type: "number",
              default: 5,
              minimum: 0,
              transition: !0,
              units: "pixels",
              doc: "Circle radius.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.18.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "circle-color": {
              type: "color",
              default: "#000000",
              doc: "The fill color of the circle.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.18.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "circle-blur": {
              type: "number",
              default: 0,
              doc: "Amount to blur the circle. 1 blurs the circle such that only the centerpoint is full opacity.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.20.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "circle-opacity": {
              type: "number",
              doc: "The opacity at which the circle will be drawn.",
              default: 1,
              minimum: 0,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.20.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "circle-translate": {
              type: "array",
              value: "number",
              length: 2,
              default: [0, 0],
              transition: !0,
              units: "pixels",
              doc: "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "circle-translate-anchor": {
              type: "enum",
              values: {
                map: { doc: "The circle is translated relative to the map." },
                viewport: {
                  doc: "The circle is translated relative to the viewport.",
                },
              },
              doc: "Controls the frame of reference for `circle-translate`.",
              default: "map",
              requires: ["circle-translate"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "circle-pitch-scale": {
              type: "enum",
              values: {
                map: {
                  doc: "Circles are scaled according to their apparent distance to the camera.",
                },
                viewport: { doc: "Circles are not scaled." },
              },
              default: "map",
              doc: "Controls the scaling behavior of the circle when the map is pitched.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.21.0",
                  android: "4.2.0",
                  ios: "3.4.0",
                  macos: "0.2.1",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "circle-pitch-alignment": {
              type: "enum",
              values: {
                map: { doc: "The circle is aligned to the plane of the map." },
                viewport: {
                  doc: "The circle is aligned to the plane of the viewport.",
                },
              },
              default: "viewport",
              doc: "Orientation of circle when map is pitched.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.39.0",
                  android: "5.2.0",
                  ios: "3.7.0",
                  macos: "0.6.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "circle-stroke-width": {
              type: "number",
              default: 0,
              minimum: 0,
              transition: !0,
              units: "pixels",
              doc: "The width of the circle's stroke. Strokes are placed outside of the `circle-radius`.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
                "data-driven styling": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "circle-stroke-color": {
              type: "color",
              default: "#000000",
              doc: "The stroke color of the circle.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
                "data-driven styling": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "circle-stroke-opacity": {
              type: "number",
              doc: "The opacity of the circle's stroke.",
              default: 1,
              minimum: 0,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
                "data-driven styling": {
                  js: "0.29.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
          },
          paint_heatmap: {
            "heatmap-radius": {
              type: "number",
              default: 30,
              minimum: 1,
              transition: !0,
              units: "pixels",
              doc: "Radius of influence of one heatmap point in pixels. Increasing the value makes the heatmap smoother, but less detailed.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.41.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
                "data-driven styling": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "heatmap-weight": {
              type: "number",
              default: 1,
              minimum: 0,
              transition: !1,
              doc: "A measure of how much an individual point contributes to the heatmap. A value of 10 would be equivalent to having 10 points of weight 1 in the same spot. Especially useful when combined with clustering.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.41.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
                "data-driven styling": {
                  js: "0.41.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "heatmap-intensity": {
              type: "number",
              default: 1,
              minimum: 0,
              transition: !0,
              doc: "Similar to `heatmap-weight` but controls the intensity of the heatmap globally. Primarily used for adjusting the heatmap based on zoom level.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.41.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "heatmap-color": {
              type: "color",
              default: [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0, 0, 255, 0)",
                0.1,
                "royalblue",
                0.3,
                "cyan",
                0.5,
                "lime",
                0.7,
                "yellow",
                1,
                "red",
              ],
              doc: 'Defines the color of each pixel based on its density value in a heatmap.  Should be an expression that uses `["heatmap-density"]` as input.',
              transition: !1,
              "sdk-support": {
                "basic functionality": {
                  js: "0.41.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
                "data-driven styling": {},
              },
              expression: { interpolated: !0, parameters: ["heatmap-density"] },
              "property-type": "color-ramp",
            },
            "heatmap-opacity": {
              type: "number",
              doc: "The global opacity at which the heatmap layer will be drawn.",
              default: 1,
              minimum: 0,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.41.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
          },
          paint_symbol: {
            "icon-opacity": {
              doc: "The opacity at which the icon will be drawn.",
              type: "number",
              default: 1,
              minimum: 0,
              maximum: 1,
              transition: !0,
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "icon-color": {
              type: "color",
              default: "#000000",
              transition: !0,
              doc: "The color of the icon. This can only be used with sdf icons.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "icon-halo-color": {
              type: "color",
              default: "rgba(0, 0, 0, 0)",
              transition: !0,
              doc: "The color of the icon's halo. Icon halos can only be used with SDF icons.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "icon-halo-width": {
              type: "number",
              default: 0,
              minimum: 0,
              transition: !0,
              units: "pixels",
              doc: "Distance of halo to the icon outline.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "icon-halo-blur": {
              type: "number",
              default: 0,
              minimum: 0,
              transition: !0,
              units: "pixels",
              doc: "Fade out the halo towards the outside.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "icon-translate": {
              type: "array",
              value: "number",
              length: 2,
              default: [0, 0],
              transition: !0,
              units: "pixels",
              doc: "Distance that the icon's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.",
              requires: ["icon-image"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "icon-translate-anchor": {
              type: "enum",
              values: {
                map: { doc: "Icons are translated relative to the map." },
                viewport: { doc: "Icons are translated relative to the viewport." },
              },
              doc: "Controls the frame of reference for `icon-translate`.",
              default: "map",
              requires: ["icon-image", "icon-translate"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-opacity": {
              type: "number",
              doc: "The opacity at which the text will be drawn.",
              default: 1,
              minimum: 0,
              maximum: 1,
              transition: !0,
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "text-color": {
              type: "color",
              doc: "The color with which the text will be drawn.",
              default: "#000000",
              transition: !0,
              overridable: !0,
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "text-halo-color": {
              type: "color",
              default: "rgba(0, 0, 0, 0)",
              transition: !0,
              doc: "The color of the text's halo, which helps it stand out from backgrounds.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "text-halo-width": {
              type: "number",
              default: 0,
              minimum: 0,
              transition: !0,
              units: "pixels",
              doc: "Distance of halo to the font outline. Max text halo width is 1/4 of the font-size.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "text-halo-blur": {
              type: "number",
              default: 0,
              minimum: 0,
              transition: !0,
              units: "pixels",
              doc: "The halo's fadeout distance towards the outside.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {
                  js: "0.33.0",
                  android: "5.0.0",
                  ios: "3.5.0",
                  macos: "0.4.0",
                },
              },
              expression: {
                interpolated: !0,
                parameters: ["zoom", "feature", "feature-state"],
              },
              "property-type": "data-driven",
            },
            "text-translate": {
              type: "array",
              value: "number",
              length: 2,
              default: [0, 0],
              transition: !0,
              units: "pixels",
              doc: "Distance that the text's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.",
              requires: ["text-field"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "text-translate-anchor": {
              type: "enum",
              values: {
                map: { doc: "The text is translated relative to the map." },
                viewport: {
                  doc: "The text is translated relative to the viewport.",
                },
              },
              doc: "Controls the frame of reference for `text-translate`.",
              default: "map",
              requires: ["text-field", "text-translate"],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
          },
          paint_raster: {
            "raster-opacity": {
              type: "number",
              doc: "The opacity at which the image will be drawn.",
              default: 1,
              minimum: 0,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "raster-hue-rotate": {
              type: "number",
              default: 0,
              period: 360,
              transition: !0,
              units: "degrees",
              doc: "Rotates hues around the color wheel.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "raster-brightness-min": {
              type: "number",
              doc: "Increase or reduce the brightness of the image. The value is the minimum brightness.",
              default: 0,
              minimum: 0,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "raster-brightness-max": {
              type: "number",
              doc: "Increase or reduce the brightness of the image. The value is the maximum brightness.",
              default: 1,
              minimum: 0,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "raster-saturation": {
              type: "number",
              doc: "Increase or reduce the saturation of the image.",
              default: 0,
              minimum: -1,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "raster-contrast": {
              type: "number",
              doc: "Increase or reduce the contrast of the image.",
              default: 0,
              minimum: -1,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "raster-resampling": {
              type: "enum",
              doc: "The resampling/interpolation method to use for overscaling, also known as texture magnification filter",
              values: {
                linear: {
                  doc: "(Bi)linear filtering interpolates pixel values using the weighted average of the four closest original source pixels creating a smooth but blurry look when overscaled",
                },
                nearest: {
                  doc: "Nearest neighbor filtering interpolates pixel values using the nearest original source pixel creating a sharp but pixelated look when overscaled",
                },
              },
              default: "linear",
              "sdk-support": {
                "basic functionality": {
                  js: "0.47.0",
                  android: "6.3.0",
                  ios: "4.2.0",
                  macos: "0.9.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "raster-fade-duration": {
              type: "number",
              default: 300,
              minimum: 0,
              transition: !1,
              units: "milliseconds",
              doc: "Fade duration when a new tile is added.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
          },
          paint_hillshade: {
            "hillshade-illumination-direction": {
              type: "number",
              default: 335,
              minimum: 0,
              maximum: 359,
              doc: "The direction of the light source used to generate the hillshading with 0 as the top of the viewport if `hillshade-illumination-anchor` is set to `viewport` and due north if `hillshade-illumination-anchor` is set to `map`.",
              transition: !1,
              "sdk-support": {
                "basic functionality": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "hillshade-illumination-anchor": {
              type: "enum",
              values: {
                map: {
                  doc: "The hillshade illumination is relative to the north direction.",
                },
                viewport: {
                  doc: "The hillshade illumination is relative to the top of the viewport.",
                },
              },
              default: "viewport",
              doc: "Direction of light source when map is rotated.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "hillshade-exaggeration": {
              type: "number",
              doc: "Intensity of the hillshade",
              default: 0.5,
              minimum: 0,
              maximum: 1,
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "hillshade-shadow-color": {
              type: "color",
              default: "#000000",
              doc: "The shading color of areas that face away from the light source.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "hillshade-highlight-color": {
              type: "color",
              default: "#FFFFFF",
              doc: "The shading color of areas that faces towards the light source.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "hillshade-accent-color": {
              type: "color",
              default: "#000000",
              doc: "The shading color used to accentuate rugged terrain like sharp cliffs and gorges.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.43.0",
                  android: "6.0.0",
                  ios: "4.0.0",
                  macos: "0.7.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
          },
          paint_background: {
            "background-color": {
              type: "color",
              default: "#000000",
              doc: "The color with which the background will be drawn.",
              transition: !0,
              requires: [{ "!": "background-pattern" }],
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
            "background-pattern": {
              type: "resolvedImage",
              transition: !0,
              doc: "Name of image in sprite to use for drawing an image background. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoom-dependent expressions will be evaluated only at integer zoom levels.",
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
                "data-driven styling": {},
              },
              expression: { interpolated: !1, parameters: ["zoom"] },
              "property-type": "cross-faded",
            },
            "background-opacity": {
              type: "number",
              default: 1,
              minimum: 0,
              maximum: 1,
              doc: "The opacity at which the background will be drawn.",
              transition: !0,
              "sdk-support": {
                "basic functionality": {
                  js: "0.10.0",
                  android: "2.0.1",
                  ios: "2.0.0",
                  macos: "0.1.0",
                },
              },
              expression: { interpolated: !0, parameters: ["zoom"] },
              "property-type": "data-constant",
            },
          },
          transition: {
            duration: {
              type: "number",
              default: 300,
              minimum: 0,
              units: "milliseconds",
              doc: "Time allotted for transitions to complete.",
            },
            delay: {
              type: "number",
              default: 0,
              minimum: 0,
              units: "milliseconds",
              doc: "Length of time before a transition begins.",
            },
          },
          "property-type": {
            "data-driven": {
              type: "property-type",
              doc: "Property is interpolable and can be represented using a property expression.",
            },
            "cross-faded": {
              type: "property-type",
              doc: "Property is non-interpolable; rather, its values will be cross-faded to smoothly transition between integer zooms.",
            },
            "cross-faded-data-driven": {
              type: "property-type",
              doc: "Property is non-interpolable; rather, its values will be cross-faded to smoothly transition between integer zooms. It can be represented using a property expression.",
            },
            "color-ramp": {
              type: "property-type",
              doc: "Property should be specified using a color ramp from which the output color can be sampled based on a property calculation.",
            },
            "data-constant": {
              type: "property-type",
              doc: "Property is interpolable but cannot be represented using a property expression.",
            },
            constant: {
              type: "property-type",
              doc: "Property is constant across all zoom levels and property values.",
            },
          },
          promoteId: {
            "*": {
              type: "string",
              doc: "A name of a feature property to use as ID for feature state.",
            },
          },
        };
        var i =
          "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof window
            ? window
            : void 0 !== e
            ? e
            : "undefined" != typeof self
            ? self
            : {};
        function a(e, t) {
          return e((t = { exports: {} }), t.exports), t.exports;
        }
        var s = a(function (e, t) {
            !(function (r) {
              var n = t && !t.nodeType && t,
                o = e && !e.nodeType && e,
                a = "object" == typeof i && i;
              (a.global !== a && a.window !== a && a.self !== a) || (r = a);
              var s,
                l,
                u = 2147483647,
                c = 36,
                p = 1,
                h = 26,
                d = 38,
                f = 700,
                y = 72,
                m = 128,
                g = "-",
                v = /^xn--/,
                b = /[^\x20-\x7E]/,
                w = /[\x2E\u3002\uFF0E\uFF61]/g,
                x = {
                  overflow: "Overflow: input needs wider integers to process",
                  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                  "invalid-input": "Invalid input",
                },
                k = c - p,
                S = Math.floor,
                _ = String.fromCharCode;
              function j(e) {
                throw RangeError(x[e]);
              }
              function T(e, t) {
                for (var r = e.length, n = []; r--; ) n[r] = t(e[r]);
                return n;
              }
              function A(e, t) {
                var r = e.split("@"),
                  n = "";
                return (
                  r.length > 1 && ((n = r[0] + "@"), (e = r[1])),
                  n + T((e = e.replace(w, ".")).split("."), t).join(".")
                );
              }
              function O(e) {
                for (var t, r, n = [], o = 0, i = e.length; o < i; )
                  (t = e.charCodeAt(o++)) >= 55296 && t <= 56319 && o < i
                    ? 56320 == (64512 & (r = e.charCodeAt(o++)))
                      ? n.push(((1023 & t) << 10) + (1023 & r) + 65536)
                      : (n.push(t), o--)
                    : n.push(t);
                return n;
              }
              function E(e) {
                return T(e, function (e) {
                  var t = "";
                  return (
                    e > 65535 &&
                      ((t += _((((e -= 65536) >>> 10) & 1023) | 55296)),
                      (e = 56320 | (1023 & e))),
                    (t += _(e))
                  );
                }).join("");
              }
              function M(e, t) {
                return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
              }
              function z(e, t, r) {
                var n = 0;
                for (e = r ? S(e / f) : e >> 1, e += S(e / t); e > (k * h) >> 1; n += c)
                  e = S(e / k);
                return S(n + ((k + 1) * e) / (e + d));
              }
              function C(e) {
                var t,
                  r,
                  n,
                  o,
                  i,
                  a,
                  s,
                  l,
                  d,
                  f,
                  v,
                  b = [],
                  w = e.length,
                  x = 0,
                  k = m,
                  _ = y;
                for ((r = e.lastIndexOf(g)) < 0 && (r = 0), n = 0; n < r; ++n)
                  e.charCodeAt(n) >= 128 && j("not-basic"), b.push(e.charCodeAt(n));
                for (o = r > 0 ? r + 1 : 0; o < w; ) {
                  for (
                    i = x, a = 1, s = c;
                    o >= w && j("invalid-input"),
                      ((l =
                        (v = e.charCodeAt(o++)) - 48 < 10
                          ? v - 22
                          : v - 65 < 26
                          ? v - 65
                          : v - 97 < 26
                          ? v - 97
                          : c) >= c ||
                        l > S((u - x) / a)) &&
                        j("overflow"),
                      (x += l * a),
                      !(l < (d = s <= _ ? p : s >= _ + h ? h : s - _));
                    s += c
                  )
                    a > S(u / (f = c - d)) && j("overflow"), (a *= f);
                  (_ = z(x - i, (t = b.length + 1), 0 == i)),
                    S(x / t) > u - k && j("overflow"),
                    (k += S(x / t)),
                    (x %= t),
                    b.splice(x++, 0, k);
                }
                return E(b);
              }
              function I(e) {
                var t,
                  r,
                  n,
                  o,
                  i,
                  a,
                  s,
                  l,
                  d,
                  f,
                  v,
                  b,
                  w,
                  x,
                  k,
                  T = [];
                for (b = (e = O(e)).length, t = m, r = 0, i = y, a = 0; a < b; ++a)
                  (v = e[a]) < 128 && T.push(_(v));
                for (n = o = T.length, o && T.push(g); n < b; ) {
                  for (s = u, a = 0; a < b; ++a) (v = e[a]) >= t && v < s && (s = v);
                  for (
                    s - t > S((u - r) / (w = n + 1)) && j("overflow"),
                      r += (s - t) * w,
                      t = s,
                      a = 0;
                    a < b;
                    ++a
                  )
                    if (((v = e[a]) < t && ++r > u && j("overflow"), v == t)) {
                      for (
                        l = r, d = c;
                        !(l < (f = d <= i ? p : d >= i + h ? h : d - i));
                        d += c
                      )
                        (k = l - f),
                          (x = c - f),
                          T.push(_(M(f + (k % x), 0))),
                          (l = S(k / x));
                      T.push(_(M(l, 0))), (i = z(r, w, n == o)), (r = 0), ++n;
                    }
                  ++r, ++t;
                }
                return T.join("");
              }
              if (
                ((s = {
                  version: "1.3.2",
                  ucs2: { decode: O, encode: E },
                  decode: C,
                  encode: I,
                  toASCII: function (e) {
                    return A(e, function (e) {
                      return b.test(e) ? "xn--" + I(e) : e;
                    });
                  },
                  toUnicode: function (e) {
                    return A(e, function (e) {
                      return v.test(e) ? C(e.slice(4).toLowerCase()) : e;
                    });
                  },
                }),
                n && o)
              )
                if (e.exports == n) o.exports = s;
                else for (l in s) s.hasOwnProperty(l) && (n[l] = s[l]);
              else r.punycode = s;
            })(i);
          }),
          l = {
            isString: function (e) {
              return "string" == typeof e;
            },
            isObject: function (e) {
              return "object" == typeof e && null !== e;
            },
            isNull: function (e) {
              return null === e;
            },
            isNullOrUndefined: function (e) {
              return null == e;
            },
          };
        function u(e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        }
        var c = function (e, t, r, n) {
            (t = t || "&"), (r = r || "=");
            var o = {};
            if ("string" != typeof e || 0 === e.length) return o;
            var i = /\+/g;
            e = e.split(t);
            var a = 1e3;
            n && "number" == typeof n.maxKeys && (a = n.maxKeys);
            var s = e.length;
            a > 0 && s > a && (s = a);
            for (var l = 0; l < s; ++l) {
              var c,
                p,
                h,
                d,
                f = e[l].replace(i, "%20"),
                y = f.indexOf(r);
              y >= 0
                ? ((c = f.substr(0, y)), (p = f.substr(y + 1)))
                : ((c = f), (p = "")),
                (h = decodeURIComponent(c)),
                (d = decodeURIComponent(p)),
                u(o, h)
                  ? Array.isArray(o[h])
                    ? o[h].push(d)
                    : (o[h] = [o[h], d])
                  : (o[h] = d);
            }
            return o;
          },
          p = function (e) {
            switch (typeof e) {
              case "string":
                return e;
              case "boolean":
                return e ? "true" : "false";
              case "number":
                return isFinite(e) ? e : "";
              default:
                return "";
            }
          },
          h = function (e, t, r, n) {
            return (
              (t = t || "&"),
              (r = r || "="),
              null === e && (e = void 0),
              "object" == typeof e
                ? Object.keys(e)
                    .map(function (n) {
                      var o = encodeURIComponent(p(n)) + r;
                      return Array.isArray(e[n])
                        ? e[n]
                            .map(function (e) {
                              return o + encodeURIComponent(p(e));
                            })
                            .join(t)
                        : o + encodeURIComponent(p(e[n]));
                    })
                    .join(t)
                : n
                ? encodeURIComponent(p(n)) + r + encodeURIComponent(p(e))
                : ""
            );
          },
          d = a(function (e, t) {
            (t.decode = t.parse = c), (t.encode = t.stringify = h);
          });
        d.decode, d.parse, d.encode, d.stringify;
        function f() {
          (this.protocol = null),
            (this.slashes = null),
            (this.auth = null),
            (this.host = null),
            (this.port = null),
            (this.hostname = null),
            (this.hash = null),
            (this.search = null),
            (this.query = null),
            (this.pathname = null),
            (this.path = null),
            (this.href = null);
        }
        var y = /^([a-z0-9.+-]+:)/i,
          m = /:[0-9]*$/,
          g = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
          v = ["{", "}", "|", "\\", "^", "`"].concat([
            "<",
            ">",
            '"',
            "`",
            " ",
            "\r",
            "\n",
            "\t",
          ]),
          b = ["'"].concat(v),
          w = ["%", "/", "?", ";", "#"].concat(b),
          x = ["/", "?", "#"],
          k = /^[+a-z0-9A-Z_-]{0,63}$/,
          S = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
          _ = { javascript: !0, "javascript:": !0 },
          j = { javascript: !0, "javascript:": !0 },
          T = {
            http: !0,
            https: !0,
            ftp: !0,
            gopher: !0,
            file: !0,
            "http:": !0,
            "https:": !0,
            "ftp:": !0,
            "gopher:": !0,
            "file:": !0,
          };
        function A(e, t, r) {
          if (e && l.isObject(e) && e instanceof f) return e;
          var n = new f();
          return n.parse(e, t, r), n;
        }
        (f.prototype.parse = function (e, t, r) {
          if (!l.isString(e))
            throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
          var n = e.indexOf("?"),
            o = -1 !== n && n < e.indexOf("#") ? "?" : "#",
            i = e.split(o);
          i[0] = i[0].replace(/\\/g, "/");
          var a = (e = i.join(o));
          if (((a = a.trim()), !r && 1 === e.split("#").length)) {
            var u = g.exec(a);
            if (u)
              return (
                (this.path = a),
                (this.href = a),
                (this.pathname = u[1]),
                u[2]
                  ? ((this.search = u[2]),
                    (this.query = t
                      ? d.parse(this.search.substr(1))
                      : this.search.substr(1)))
                  : t && ((this.search = ""), (this.query = {})),
                this
              );
          }
          var c = y.exec(a);
          if (c) {
            var p = (c = c[0]).toLowerCase();
            (this.protocol = p), (a = a.substr(c.length));
          }
          if (r || c || a.match(/^\/\/[^@\/]+@[^@\/]+/)) {
            var h = "//" === a.substr(0, 2);
            !h || (c && j[c]) || ((a = a.substr(2)), (this.slashes = !0));
          }
          if (!j[c] && (h || (c && !T[c]))) {
            for (var f, m, v = -1, A = 0; A < x.length; A++) {
              -1 !== (O = a.indexOf(x[A])) && (-1 === v || O < v) && (v = O);
            }
            -1 !== (m = -1 === v ? a.lastIndexOf("@") : a.lastIndexOf("@", v)) &&
              ((f = a.slice(0, m)),
              (a = a.slice(m + 1)),
              (this.auth = decodeURIComponent(f))),
              (v = -1);
            for (A = 0; A < w.length; A++) {
              var O;
              -1 !== (O = a.indexOf(w[A])) && (-1 === v || O < v) && (v = O);
            }
            -1 === v && (v = a.length),
              (this.host = a.slice(0, v)),
              (a = a.slice(v)),
              this.parseHost(),
              (this.hostname = this.hostname || "");
            var E =
              "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
            if (!E)
              for (
                var M = this.hostname.split(/\./), z = ((A = 0), M.length);
                A < z;
                A++
              ) {
                var C = M[A];
                if (C && !C.match(k)) {
                  for (var I = "", P = 0, R = C.length; P < R; P++)
                    C.charCodeAt(P) > 127 ? (I += "x") : (I += C[P]);
                  if (!I.match(k)) {
                    var N = M.slice(0, A),
                      q = M.slice(A + 1),
                      L = C.match(S);
                    L && (N.push(L[1]), q.unshift(L[2])),
                      q.length && (a = "/" + q.join(".") + a),
                      (this.hostname = N.join("."));
                    break;
                  }
                }
              }
            this.hostname.length > 255
              ? (this.hostname = "")
              : (this.hostname = this.hostname.toLowerCase()),
              E || (this.hostname = s.toASCII(this.hostname));
            var F = this.port ? ":" + this.port : "",
              D = this.hostname || "";
            (this.host = D + F),
              (this.href += this.host),
              E &&
                ((this.hostname = this.hostname.substr(1, this.hostname.length - 2)),
                "/" !== a[0] && (a = "/" + a));
          }
          if (!_[p])
            for (A = 0, z = b.length; A < z; A++) {
              var B = b[A];
              if (-1 !== a.indexOf(B)) {
                var U = encodeURIComponent(B);
                U === B && (U = escape(B)), (a = a.split(B).join(U));
              }
            }
          var G = a.indexOf("#");
          -1 !== G && ((this.hash = a.substr(G)), (a = a.slice(0, G)));
          var W = a.indexOf("?");
          if (
            (-1 !== W
              ? ((this.search = a.substr(W)),
                (this.query = a.substr(W + 1)),
                t && (this.query = d.parse(this.query)),
                (a = a.slice(0, W)))
              : t && ((this.search = ""), (this.query = {})),
            a && (this.pathname = a),
            T[p] && this.hostname && !this.pathname && (this.pathname = "/"),
            this.pathname || this.search)
          ) {
            F = this.pathname || "";
            var V = this.search || "";
            this.path = F + V;
          }
          return (this.href = this.format()), this;
        }),
          (f.prototype.format = function () {
            var e = this.auth || "";
            e && ((e = (e = encodeURIComponent(e)).replace(/%3A/i, ":")), (e += "@"));
            var t = this.protocol || "",
              r = this.pathname || "",
              n = this.hash || "",
              o = !1,
              i = "";
            this.host
              ? (o = e + this.host)
              : this.hostname &&
                ((o =
                  e +
                  (-1 === this.hostname.indexOf(":")
                    ? this.hostname
                    : "[" + this.hostname + "]")),
                this.port && (o += ":" + this.port)),
              this.query &&
                l.isObject(this.query) &&
                Object.keys(this.query).length &&
                (i = d.stringify(this.query));
            var a = this.search || (i && "?" + i) || "";
            return (
              t && ":" !== t.substr(-1) && (t += ":"),
              this.slashes || ((!t || T[t]) && !1 !== o)
                ? ((o = "//" + (o || "")), r && "/" !== r.charAt(0) && (r = "/" + r))
                : o || (o = ""),
              n && "#" !== n.charAt(0) && (n = "#" + n),
              a && "?" !== a.charAt(0) && (a = "?" + a),
              t +
                o +
                (r = r.replace(/[?#]/g, function (e) {
                  return encodeURIComponent(e);
                })) +
                (a = a.replace("#", "%23")) +
                n
            );
          }),
          (f.prototype.resolve = function (e) {
            return this.resolveObject(A(e, !1, !0)).format();
          }),
          (f.prototype.resolveObject = function (e) {
            if (l.isString(e)) {
              var t = new f();
              t.parse(e, !1, !0), (e = t);
            }
            for (var r = new f(), n = Object.keys(this), o = 0; o < n.length; o++) {
              var i = n[o];
              r[i] = this[i];
            }
            if (((r.hash = e.hash), "" === e.href)) return (r.href = r.format()), r;
            if (e.slashes && !e.protocol) {
              for (var a = Object.keys(e), s = 0; s < a.length; s++) {
                var u = a[s];
                "protocol" !== u && (r[u] = e[u]);
              }
              return (
                T[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"),
                (r.href = r.format()),
                r
              );
            }
            if (e.protocol && e.protocol !== r.protocol) {
              if (!T[e.protocol]) {
                for (var c = Object.keys(e), p = 0; p < c.length; p++) {
                  var h = c[p];
                  r[h] = e[h];
                }
                return (r.href = r.format()), r;
              }
              if (((r.protocol = e.protocol), e.host || j[e.protocol]))
                r.pathname = e.pathname;
              else {
                for (
                  var d = (e.pathname || "").split("/");
                  d.length && !(e.host = d.shift());

                );
                e.host || (e.host = ""),
                  e.hostname || (e.hostname = ""),
                  "" !== d[0] && d.unshift(""),
                  d.length < 2 && d.unshift(""),
                  (r.pathname = d.join("/"));
              }
              if (
                ((r.search = e.search),
                (r.query = e.query),
                (r.host = e.host || ""),
                (r.auth = e.auth),
                (r.hostname = e.hostname || e.host),
                (r.port = e.port),
                r.pathname || r.search)
              ) {
                var y = r.pathname || "",
                  m = r.search || "";
                r.path = y + m;
              }
              return (r.slashes = r.slashes || e.slashes), (r.href = r.format()), r;
            }
            var g = r.pathname && "/" === r.pathname.charAt(0),
              v = e.host || (e.pathname && "/" === e.pathname.charAt(0)),
              b = v || g || (r.host && e.pathname),
              w = b,
              x = (r.pathname && r.pathname.split("/")) || [],
              k =
                ((d = (e.pathname && e.pathname.split("/")) || []),
                r.protocol && !T[r.protocol]);
            if (
              (k &&
                ((r.hostname = ""),
                (r.port = null),
                r.host && ("" === x[0] ? (x[0] = r.host) : x.unshift(r.host)),
                (r.host = ""),
                e.protocol &&
                  ((e.hostname = null),
                  (e.port = null),
                  e.host && ("" === d[0] ? (d[0] = e.host) : d.unshift(e.host)),
                  (e.host = null)),
                (b = b && ("" === d[0] || "" === x[0]))),
              v)
            )
              (r.host = e.host || "" === e.host ? e.host : r.host),
                (r.hostname = e.hostname || "" === e.hostname ? e.hostname : r.hostname),
                (r.search = e.search),
                (r.query = e.query),
                (x = d);
            else if (d.length)
              x || (x = []),
                x.pop(),
                (x = x.concat(d)),
                (r.search = e.search),
                (r.query = e.query);
            else if (!l.isNullOrUndefined(e.search)) {
              if (k)
                (r.hostname = r.host = x.shift()),
                  (E = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) &&
                    ((r.auth = E.shift()), (r.host = r.hostname = E.shift()));
              return (
                (r.search = e.search),
                (r.query = e.query),
                (l.isNull(r.pathname) && l.isNull(r.search)) ||
                  (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")),
                (r.href = r.format()),
                r
              );
            }
            if (!x.length)
              return (
                (r.pathname = null),
                r.search ? (r.path = "/" + r.search) : (r.path = null),
                (r.href = r.format()),
                r
              );
            for (
              var S = x.slice(-1)[0],
                _ =
                  ((r.host || e.host || x.length > 1) && ("." === S || ".." === S)) ||
                  "" === S,
                A = 0,
                O = x.length;
              O >= 0;
              O--
            )
              "." === (S = x[O])
                ? x.splice(O, 1)
                : ".." === S
                ? (x.splice(O, 1), A++)
                : A && (x.splice(O, 1), A--);
            if (!b && !w) for (; A--; A) x.unshift("..");
            !b || "" === x[0] || (x[0] && "/" === x[0].charAt(0)) || x.unshift(""),
              _ && "/" !== x.join("/").substr(-1) && x.push("");
            var E,
              M = "" === x[0] || (x[0] && "/" === x[0].charAt(0));
            k &&
              ((r.hostname = r.host = M ? "" : x.length ? x.shift() : ""),
              (E = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) &&
                ((r.auth = E.shift()), (r.host = r.hostname = E.shift())));
            return (
              (b = b || (r.host && x.length)) && !M && x.unshift(""),
              x.length
                ? (r.pathname = x.join("/"))
                : ((r.pathname = null), (r.path = null)),
              (l.isNull(r.pathname) && l.isNull(r.search)) ||
                (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")),
              (r.auth = e.auth || r.auth),
              (r.slashes = r.slashes || e.slashes),
              (r.href = r.format()),
              r
            );
          }),
          (f.prototype.parseHost = function () {
            var e = this.host,
              t = m.exec(e);
            t &&
              (":" !== (t = t[0]) && (this.port = t.substr(1)),
              (e = e.substr(0, e.length - t.length))),
              e && (this.hostname = e);
          });
        function O(e) {
          for (var t = arguments, r = [], n = arguments.length - 1; n-- > 0; )
            r[n] = t[n + 1];
          for (var o = 0, i = r; o < i.length; o += 1) {
            var a = i[o];
            for (var s in a) e[s] = a[s];
          }
          return e;
        }
        var E = (function (e) {
            function t(t, r) {
              e.call(this, r), (this.message = r), (this.key = t);
            }
            return (
              e && (t.__proto__ = e),
              (t.prototype = Object.create(e && e.prototype)),
              (t.prototype.constructor = t),
              t
            );
          })(Error),
          M = function (e, t) {
            void 0 === t && (t = []), (this.parent = e), (this.bindings = {});
            for (var r = 0, n = t; r < n.length; r += 1) {
              var o = n[r],
                i = o[0],
                a = o[1];
              this.bindings[i] = a;
            }
          };
        (M.prototype.concat = function (e) {
          return new M(this, e);
        }),
          (M.prototype.get = function (e) {
            if (this.bindings[e]) return this.bindings[e];
            if (this.parent) return this.parent.get(e);
            throw new Error(e + " not found in scope.");
          }),
          (M.prototype.has = function (e) {
            return !!this.bindings[e] || (!!this.parent && this.parent.has(e));
          });
        var z = { kind: "null" },
          C = { kind: "number" },
          I = { kind: "string" },
          P = { kind: "boolean" },
          R = { kind: "color" },
          N = { kind: "object" },
          q = { kind: "value" },
          L = { kind: "collator" },
          F = { kind: "formatted" },
          D = { kind: "resolvedImage" };
        function B(e, t) {
          return { kind: "array", itemType: e, N: t };
        }
        function U(e) {
          if ("array" === e.kind) {
            var t = U(e.itemType);
            return "number" == typeof e.N
              ? "array<" + t + ", " + e.N + ">"
              : "value" === e.itemType.kind
              ? "array"
              : "array<" + t + ">";
          }
          return e.kind;
        }
        var G = [z, C, I, P, R, F, N, B(q), D];
        function W(e, t) {
          if ("error" === t.kind) return null;
          if ("array" === e.kind) {
            if (
              "array" === t.kind &&
              ((0 === t.N && "value" === t.itemType.kind) ||
                !W(e.itemType, t.itemType)) &&
              ("number" != typeof e.N || e.N === t.N)
            )
              return null;
          } else {
            if (e.kind === t.kind) return null;
            if ("value" === e.kind)
              for (var r = 0, n = G; r < n.length; r += 1) {
                if (!W(n[r], t)) return null;
              }
          }
          return "Expected " + U(e) + " but found " + U(t) + " instead.";
        }
        var V = a(function (e, t) {
            var r = {
              transparent: [0, 0, 0, 0],
              aliceblue: [240, 248, 255, 1],
              antiquewhite: [250, 235, 215, 1],
              aqua: [0, 255, 255, 1],
              aquamarine: [127, 255, 212, 1],
              azure: [240, 255, 255, 1],
              beige: [245, 245, 220, 1],
              bisque: [255, 228, 196, 1],
              black: [0, 0, 0, 1],
              blanchedalmond: [255, 235, 205, 1],
              blue: [0, 0, 255, 1],
              blueviolet: [138, 43, 226, 1],
              brown: [165, 42, 42, 1],
              burlywood: [222, 184, 135, 1],
              cadetblue: [95, 158, 160, 1],
              chartreuse: [127, 255, 0, 1],
              chocolate: [210, 105, 30, 1],
              coral: [255, 127, 80, 1],
              cornflowerblue: [100, 149, 237, 1],
              cornsilk: [255, 248, 220, 1],
              crimson: [220, 20, 60, 1],
              cyan: [0, 255, 255, 1],
              darkblue: [0, 0, 139, 1],
              darkcyan: [0, 139, 139, 1],
              darkgoldenrod: [184, 134, 11, 1],
              darkgray: [169, 169, 169, 1],
              darkgreen: [0, 100, 0, 1],
              darkgrey: [169, 169, 169, 1],
              darkkhaki: [189, 183, 107, 1],
              darkmagenta: [139, 0, 139, 1],
              darkolivegreen: [85, 107, 47, 1],
              darkorange: [255, 140, 0, 1],
              darkorchid: [153, 50, 204, 1],
              darkred: [139, 0, 0, 1],
              darksalmon: [233, 150, 122, 1],
              darkseagreen: [143, 188, 143, 1],
              darkslateblue: [72, 61, 139, 1],
              darkslategray: [47, 79, 79, 1],
              darkslategrey: [47, 79, 79, 1],
              darkturquoise: [0, 206, 209, 1],
              darkviolet: [148, 0, 211, 1],
              deeppink: [255, 20, 147, 1],
              deepskyblue: [0, 191, 255, 1],
              dimgray: [105, 105, 105, 1],
              dimgrey: [105, 105, 105, 1],
              dodgerblue: [30, 144, 255, 1],
              firebrick: [178, 34, 34, 1],
              floralwhite: [255, 250, 240, 1],
              forestgreen: [34, 139, 34, 1],
              fuchsia: [255, 0, 255, 1],
              gainsboro: [220, 220, 220, 1],
              ghostwhite: [248, 248, 255, 1],
              gold: [255, 215, 0, 1],
              goldenrod: [218, 165, 32, 1],
              gray: [128, 128, 128, 1],
              green: [0, 128, 0, 1],
              greenyellow: [173, 255, 47, 1],
              grey: [128, 128, 128, 1],
              honeydew: [240, 255, 240, 1],
              hotpink: [255, 105, 180, 1],
              indianred: [205, 92, 92, 1],
              indigo: [75, 0, 130, 1],
              ivory: [255, 255, 240, 1],
              khaki: [240, 230, 140, 1],
              lavender: [230, 230, 250, 1],
              lavenderblush: [255, 240, 245, 1],
              lawngreen: [124, 252, 0, 1],
              lemonchiffon: [255, 250, 205, 1],
              lightblue: [173, 216, 230, 1],
              lightcoral: [240, 128, 128, 1],
              lightcyan: [224, 255, 255, 1],
              lightgoldenrodyellow: [250, 250, 210, 1],
              lightgray: [211, 211, 211, 1],
              lightgreen: [144, 238, 144, 1],
              lightgrey: [211, 211, 211, 1],
              lightpink: [255, 182, 193, 1],
              lightsalmon: [255, 160, 122, 1],
              lightseagreen: [32, 178, 170, 1],
              lightskyblue: [135, 206, 250, 1],
              lightslategray: [119, 136, 153, 1],
              lightslategrey: [119, 136, 153, 1],
              lightsteelblue: [176, 196, 222, 1],
              lightyellow: [255, 255, 224, 1],
              lime: [0, 255, 0, 1],
              limegreen: [50, 205, 50, 1],
              linen: [250, 240, 230, 1],
              magenta: [255, 0, 255, 1],
              maroon: [128, 0, 0, 1],
              mediumaquamarine: [102, 205, 170, 1],
              mediumblue: [0, 0, 205, 1],
              mediumorchid: [186, 85, 211, 1],
              mediumpurple: [147, 112, 219, 1],
              mediumseagreen: [60, 179, 113, 1],
              mediumslateblue: [123, 104, 238, 1],
              mediumspringgreen: [0, 250, 154, 1],
              mediumturquoise: [72, 209, 204, 1],
              mediumvioletred: [199, 21, 133, 1],
              midnightblue: [25, 25, 112, 1],
              mintcream: [245, 255, 250, 1],
              mistyrose: [255, 228, 225, 1],
              moccasin: [255, 228, 181, 1],
              navajowhite: [255, 222, 173, 1],
              navy: [0, 0, 128, 1],
              oldlace: [253, 245, 230, 1],
              olive: [128, 128, 0, 1],
              olivedrab: [107, 142, 35, 1],
              orange: [255, 165, 0, 1],
              orangered: [255, 69, 0, 1],
              orchid: [218, 112, 214, 1],
              palegoldenrod: [238, 232, 170, 1],
              palegreen: [152, 251, 152, 1],
              paleturquoise: [175, 238, 238, 1],
              palevioletred: [219, 112, 147, 1],
              papayawhip: [255, 239, 213, 1],
              peachpuff: [255, 218, 185, 1],
              peru: [205, 133, 63, 1],
              pink: [255, 192, 203, 1],
              plum: [221, 160, 221, 1],
              powderblue: [176, 224, 230, 1],
              purple: [128, 0, 128, 1],
              rebeccapurple: [102, 51, 153, 1],
              red: [255, 0, 0, 1],
              rosybrown: [188, 143, 143, 1],
              royalblue: [65, 105, 225, 1],
              saddlebrown: [139, 69, 19, 1],
              salmon: [250, 128, 114, 1],
              sandybrown: [244, 164, 96, 1],
              seagreen: [46, 139, 87, 1],
              seashell: [255, 245, 238, 1],
              sienna: [160, 82, 45, 1],
              silver: [192, 192, 192, 1],
              skyblue: [135, 206, 235, 1],
              slateblue: [106, 90, 205, 1],
              slategray: [112, 128, 144, 1],
              slategrey: [112, 128, 144, 1],
              snow: [255, 250, 250, 1],
              springgreen: [0, 255, 127, 1],
              steelblue: [70, 130, 180, 1],
              tan: [210, 180, 140, 1],
              teal: [0, 128, 128, 1],
              thistle: [216, 191, 216, 1],
              tomato: [255, 99, 71, 1],
              turquoise: [64, 224, 208, 1],
              violet: [238, 130, 238, 1],
              wheat: [245, 222, 179, 1],
              white: [255, 255, 255, 1],
              whitesmoke: [245, 245, 245, 1],
              yellow: [255, 255, 0, 1],
              yellowgreen: [154, 205, 50, 1],
            };
            function n(e) {
              return (e = Math.round(e)) < 0 ? 0 : e > 255 ? 255 : e;
            }
            function o(e) {
              return e < 0 ? 0 : e > 1 ? 1 : e;
            }
            function i(e) {
              return "%" === e[e.length - 1]
                ? n((parseFloat(e) / 100) * 255)
                : n(parseInt(e));
            }
            function a(e) {
              return "%" === e[e.length - 1] ? o(parseFloat(e) / 100) : o(parseFloat(e));
            }
            function s(e, t, r) {
              return (
                r < 0 ? (r += 1) : r > 1 && (r -= 1),
                6 * r < 1
                  ? e + (t - e) * r * 6
                  : 2 * r < 1
                  ? t
                  : 3 * r < 2
                  ? e + (t - e) * (2 / 3 - r) * 6
                  : e
              );
            }
            try {
              t.parseCSSColor = function (e) {
                var t,
                  o = e.replace(/ /g, "").toLowerCase();
                if (o in r) return r[o].slice();
                if ("#" === o[0])
                  return 4 === o.length
                    ? (t = parseInt(o.substr(1), 16)) >= 0 && t <= 4095
                      ? [
                          ((3840 & t) >> 4) | ((3840 & t) >> 8),
                          (240 & t) | ((240 & t) >> 4),
                          (15 & t) | ((15 & t) << 4),
                          1,
                        ]
                      : null
                    : 7 === o.length &&
                      (t = parseInt(o.substr(1), 16)) >= 0 &&
                      t <= 16777215
                    ? [(16711680 & t) >> 16, (65280 & t) >> 8, 255 & t, 1]
                    : null;
                var l = o.indexOf("("),
                  u = o.indexOf(")");
                if (-1 !== l && u + 1 === o.length) {
                  var c = o.substr(0, l),
                    p = o.substr(l + 1, u - (l + 1)).split(","),
                    h = 1;
                  switch (c) {
                    case "rgba":
                      if (4 !== p.length) return null;
                      h = a(p.pop());
                    case "rgb":
                      return 3 !== p.length ? null : [i(p[0]), i(p[1]), i(p[2]), h];
                    case "hsla":
                      if (4 !== p.length) return null;
                      h = a(p.pop());
                    case "hsl":
                      if (3 !== p.length) return null;
                      var d = (((parseFloat(p[0]) % 360) + 360) % 360) / 360,
                        f = a(p[1]),
                        y = a(p[2]),
                        m = y <= 0.5 ? y * (f + 1) : y + f - y * f,
                        g = 2 * y - m;
                      return [
                        n(255 * s(g, m, d + 1 / 3)),
                        n(255 * s(g, m, d)),
                        n(255 * s(g, m, d - 1 / 3)),
                        h,
                      ];
                    default:
                      return null;
                  }
                }
                return null;
              };
            } catch (e) {}
          }).parseCSSColor,
          J = function (e, t, r, n) {
            void 0 === n && (n = 1),
              (this.r = e),
              (this.g = t),
              (this.b = r),
              (this.a = n);
          };
        (J.parse = function (e) {
          if (e) {
            if (e instanceof J) return e;
            if ("string" == typeof e) {
              var t = V(e);
              if (t)
                return new J(
                  (t[0] / 255) * t[3],
                  (t[1] / 255) * t[3],
                  (t[2] / 255) * t[3],
                  t[3]
                );
            }
          }
        }),
          (J.prototype.toString = function () {
            var e = this.toArray(),
              t = e[0],
              r = e[1],
              n = e[2],
              o = e[3];
            return (
              "rgba(" +
              Math.round(t) +
              "," +
              Math.round(r) +
              "," +
              Math.round(n) +
              "," +
              o +
              ")"
            );
          }),
          (J.prototype.toArray = function () {
            var e = this.r,
              t = this.g,
              r = this.b,
              n = this.a;
            return 0 === n
              ? [0, 0, 0, 0]
              : [(255 * e) / n, (255 * t) / n, (255 * r) / n, n];
          }),
          (J.black = new J(0, 0, 0, 1)),
          (J.white = new J(1, 1, 1, 1)),
          (J.transparent = new J(0, 0, 0, 0)),
          (J.red = new J(1, 0, 0, 1));
        var Y = function (e, t, r) {
          (this.sensitivity = e ? (t ? "variant" : "case") : t ? "accent" : "base"),
            (this.locale = r),
            (this.collator = new Intl.Collator(this.locale ? this.locale : [], {
              sensitivity: this.sensitivity,
              usage: "search",
            }));
        };
        (Y.prototype.compare = function (e, t) {
          return this.collator.compare(e, t);
        }),
          (Y.prototype.resolvedLocale = function () {
            return new Intl.Collator(this.locale ? this.locale : []).resolvedOptions()
              .locale;
          });
        var $ = function (e, t, r, n, o) {
            (this.text = e),
              (this.image = t),
              (this.scale = r),
              (this.fontStack = n),
              (this.textColor = o);
          },
          H = function (e) {
            this.sections = e;
          };
        (H.fromString = function (e) {
          return new H([new $(e, null, null, null, null)]);
        }),
          (H.prototype.isEmpty = function () {
            return (
              0 === this.sections.length ||
              !this.sections.some(function (e) {
                return 0 !== e.text.length || (e.image && 0 !== e.image.name.length);
              })
            );
          }),
          (H.factory = function (e) {
            return e instanceof H ? e : H.fromString(e);
          }),
          (H.prototype.toString = function () {
            return 0 === this.sections.length
              ? ""
              : this.sections
                  .map(function (e) {
                    return e.text;
                  })
                  .join("");
          }),
          (H.prototype.serialize = function () {
            for (var e = ["format"], t = 0, r = this.sections; t < r.length; t += 1) {
              var n = r[t];
              if (n.image) e.push(["image", n.image.name]);
              else {
                e.push(n.text);
                var o = {};
                n.fontStack && (o["text-font"] = ["literal", n.fontStack.split(",")]),
                  n.scale && (o["font-scale"] = n.scale),
                  n.textColor &&
                    (o["text-color"] = ["rgba"].concat(n.textColor.toArray())),
                  e.push(o);
              }
            }
            return e;
          });
        var K = function (e) {
          (this.name = e.name), (this.available = e.available);
        };
        function X(e, t, r, n) {
          return "number" == typeof e &&
            e >= 0 &&
            e <= 255 &&
            "number" == typeof t &&
            t >= 0 &&
            t <= 255 &&
            "number" == typeof r &&
            r >= 0 &&
            r <= 255
            ? void 0 === n || ("number" == typeof n && n >= 0 && n <= 1)
              ? null
              : "Invalid rgba value [" +
                [e, t, r, n].join(", ") +
                "]: 'a' must be between 0 and 1."
            : "Invalid rgba value [" +
                ("number" == typeof n ? [e, t, r, n] : [e, t, r]).join(", ") +
                "]: 'r', 'g', and 'b' must be between 0 and 255.";
        }
        function Z(e) {
          if (null === e) return !0;
          if ("string" == typeof e) return !0;
          if ("boolean" == typeof e) return !0;
          if ("number" == typeof e) return !0;
          if (e instanceof J) return !0;
          if (e instanceof Y) return !0;
          if (e instanceof H) return !0;
          if (e instanceof K) return !0;
          if (Array.isArray(e)) {
            for (var t = 0, r = e; t < r.length; t += 1) {
              if (!Z(r[t])) return !1;
            }
            return !0;
          }
          if ("object" == typeof e) {
            for (var n in e) if (!Z(e[n])) return !1;
            return !0;
          }
          return !1;
        }
        function Q(e) {
          if (null === e) return z;
          if ("string" == typeof e) return I;
          if ("boolean" == typeof e) return P;
          if ("number" == typeof e) return C;
          if (e instanceof J) return R;
          if (e instanceof Y) return L;
          if (e instanceof H) return F;
          if (e instanceof K) return D;
          if (Array.isArray(e)) {
            for (var t, r = e.length, n = 0, o = e; n < o.length; n += 1) {
              var i = Q(o[n]);
              if (t) {
                if (t === i) continue;
                t = q;
                break;
              }
              t = i;
            }
            return B(t || q, r);
          }
          return N;
        }
        function ee(e) {
          var t = typeof e;
          return null === e
            ? ""
            : "string" === t || "number" === t || "boolean" === t
            ? String(e)
            : e instanceof J || e instanceof H || e instanceof K
            ? e.toString()
            : JSON.stringify(e);
        }
        (K.prototype.toString = function () {
          return this.name;
        }),
          (K.fromString = function (e) {
            return e ? new K({ name: e, available: !1 }) : null;
          }),
          (K.prototype.serialize = function () {
            return ["image", this.name];
          });
        var te = function (e, t) {
          (this.type = e), (this.value = t);
        };
        (te.parse = function (e, t) {
          if (2 !== e.length)
            return t.error(
              "'literal' expression requires exactly one argument, but found " +
                (e.length - 1) +
                " instead."
            );
          if (!Z(e[1])) return t.error("invalid value");
          var r = e[1],
            n = Q(r),
            o = t.expectedType;
          return (
            "array" !== n.kind ||
              0 !== n.N ||
              !o ||
              "array" !== o.kind ||
              ("number" == typeof o.N && 0 !== o.N) ||
              (n = o),
            new te(n, r)
          );
        }),
          (te.prototype.evaluate = function () {
            return this.value;
          }),
          (te.prototype.eachChild = function () {}),
          (te.prototype.outputDefined = function () {
            return !0;
          }),
          (te.prototype.serialize = function () {
            return "array" === this.type.kind || "object" === this.type.kind
              ? ["literal", this.value]
              : this.value instanceof J
              ? ["rgba"].concat(this.value.toArray())
              : this.value instanceof H
              ? this.value.serialize()
              : this.value;
          });
        var re = function (e) {
          (this.name = "ExpressionEvaluationError"), (this.message = e);
        };
        re.prototype.toJSON = function () {
          return this.message;
        };
        var ne = { string: I, number: C, boolean: P, object: N },
          oe = function (e, t) {
            (this.type = e), (this.args = t);
          };
        (oe.parse = function (e, t) {
          if (e.length < 2) return t.error("Expected at least one argument.");
          var r,
            n = 1,
            o = e[0];
          if ("array" === o) {
            var i, a;
            if (e.length > 2) {
              var s = e[1];
              if ("string" != typeof s || !(s in ne) || "object" === s)
                return t.error(
                  'The item type argument of "array" must be one of string, number, boolean',
                  1
                );
              (i = ne[s]), n++;
            } else i = q;
            if (e.length > 3) {
              if (
                null !== e[2] &&
                ("number" != typeof e[2] || e[2] < 0 || e[2] !== Math.floor(e[2]))
              )
                return t.error(
                  'The length argument to "array" must be a positive integer literal',
                  2
                );
              (a = e[2]), n++;
            }
            r = B(i, a);
          } else r = ne[o];
          for (var l = []; n < e.length; n++) {
            var u = t.parse(e[n], n, q);
            if (!u) return null;
            l.push(u);
          }
          return new oe(r, l);
        }),
          (oe.prototype.evaluate = function (e) {
            for (var t = 0; t < this.args.length; t++) {
              var r = this.args[t].evaluate(e);
              if (!W(this.type, Q(r))) return r;
              if (t === this.args.length - 1)
                throw new re(
                  "Expected value to be of type " +
                    U(this.type) +
                    ", but found " +
                    U(Q(r)) +
                    " instead."
                );
            }
            return null;
          }),
          (oe.prototype.eachChild = function (e) {
            this.args.forEach(e);
          }),
          (oe.prototype.outputDefined = function () {
            return this.args.every(function (e) {
              return e.outputDefined();
            });
          }),
          (oe.prototype.serialize = function () {
            var e = this.type,
              t = [e.kind];
            if ("array" === e.kind) {
              var r = e.itemType;
              if ("string" === r.kind || "number" === r.kind || "boolean" === r.kind) {
                t.push(r.kind);
                var n = e.N;
                ("number" == typeof n || this.args.length > 1) && t.push(n);
              }
            }
            return t.concat(
              this.args.map(function (e) {
                return e.serialize();
              })
            );
          });
        var ie = function (e) {
          (this.type = F), (this.sections = e);
        };
        (ie.parse = function (e, t) {
          if (e.length < 2) return t.error("Expected at least one argument.");
          var r = e[1];
          if (!Array.isArray(r) && "object" == typeof r)
            return t.error("First argument must be an image or text section.");
          for (var n = [], o = !1, i = 1; i <= e.length - 1; ++i) {
            var a = e[i];
            if (o && "object" == typeof a && !Array.isArray(a)) {
              o = !1;
              var s = null;
              if (a["font-scale"] && !(s = t.parse(a["font-scale"], 1, C))) return null;
              var l = null;
              if (a["text-font"] && !(l = t.parse(a["text-font"], 1, B(I)))) return null;
              var u = null;
              if (a["text-color"] && !(u = t.parse(a["text-color"], 1, R))) return null;
              var c = n[n.length - 1];
              (c.scale = s), (c.font = l), (c.textColor = u);
            } else {
              var p = t.parse(e[i], 1, q);
              if (!p) return null;
              var h = p.type.kind;
              if (
                "string" !== h &&
                "value" !== h &&
                "null" !== h &&
                "resolvedImage" !== h
              )
                return t.error(
                  "Formatted text type must be 'string', 'value', 'image' or 'null'."
                );
              (o = !0), n.push({ content: p, scale: null, font: null, textColor: null });
            }
          }
          return new ie(n);
        }),
          (ie.prototype.evaluate = function (e) {
            return new H(
              this.sections.map(function (t) {
                var r = t.content.evaluate(e);
                return Q(r) === D
                  ? new $("", r, null, null, null)
                  : new $(
                      ee(r),
                      null,
                      t.scale ? t.scale.evaluate(e) : null,
                      t.font ? t.font.evaluate(e).join(",") : null,
                      t.textColor ? t.textColor.evaluate(e) : null
                    );
              })
            );
          }),
          (ie.prototype.eachChild = function (e) {
            for (var t = 0, r = this.sections; t < r.length; t += 1) {
              var n = r[t];
              e(n.content),
                n.scale && e(n.scale),
                n.font && e(n.font),
                n.textColor && e(n.textColor);
            }
          }),
          (ie.prototype.outputDefined = function () {
            return !1;
          }),
          (ie.prototype.serialize = function () {
            for (var e = ["format"], t = 0, r = this.sections; t < r.length; t += 1) {
              var n = r[t];
              e.push(n.content.serialize());
              var o = {};
              n.scale && (o["font-scale"] = n.scale.serialize()),
                n.font && (o["text-font"] = n.font.serialize()),
                n.textColor && (o["text-color"] = n.textColor.serialize()),
                e.push(o);
            }
            return e;
          });
        var ae = function (e) {
          (this.type = D), (this.input = e);
        };
        (ae.parse = function (e, t) {
          if (2 !== e.length) return t.error("Expected two arguments.");
          var r = t.parse(e[1], 1, I);
          return r ? new ae(r) : t.error("No image name provided.");
        }),
          (ae.prototype.evaluate = function (e) {
            var t = this.input.evaluate(e),
              r = K.fromString(t);
            return (
              r && e.availableImages && (r.available = e.availableImages.indexOf(t) > -1),
              r
            );
          }),
          (ae.prototype.eachChild = function (e) {
            e(this.input);
          }),
          (ae.prototype.outputDefined = function () {
            return !1;
          }),
          (ae.prototype.serialize = function () {
            return ["image", this.input.serialize()];
          });
        var se = { "to-boolean": P, "to-color": R, "to-number": C, "to-string": I },
          le = function (e, t) {
            (this.type = e), (this.args = t);
          };
        (le.parse = function (e, t) {
          if (e.length < 2) return t.error("Expected at least one argument.");
          var r = e[0];
          if (("to-boolean" === r || "to-string" === r) && 2 !== e.length)
            return t.error("Expected one argument.");
          for (var n = se[r], o = [], i = 1; i < e.length; i++) {
            var a = t.parse(e[i], i, q);
            if (!a) return null;
            o.push(a);
          }
          return new le(n, o);
        }),
          (le.prototype.evaluate = function (e) {
            if ("boolean" === this.type.kind) return Boolean(this.args[0].evaluate(e));
            if ("color" === this.type.kind) {
              for (var t, r, n = 0, o = this.args; n < o.length; n += 1) {
                if (((r = null), (t = o[n].evaluate(e)) instanceof J)) return t;
                if ("string" == typeof t) {
                  var i = e.parseColor(t);
                  if (i) return i;
                } else if (
                  Array.isArray(t) &&
                  !(r =
                    t.length < 3 || t.length > 4
                      ? "Invalid rbga value " +
                        JSON.stringify(t) +
                        ": expected an array containing either three or four numeric values."
                      : X(t[0], t[1], t[2], t[3]))
                )
                  return new J(t[0] / 255, t[1] / 255, t[2] / 255, t[3]);
              }
              throw new re(
                r ||
                  "Could not parse color from value '" +
                    ("string" == typeof t ? t : String(JSON.stringify(t))) +
                    "'"
              );
            }
            if ("number" === this.type.kind) {
              for (var a = null, s = 0, l = this.args; s < l.length; s += 1) {
                if (null === (a = l[s].evaluate(e))) return 0;
                var u = Number(a);
                if (!isNaN(u)) return u;
              }
              throw new re("Could not convert " + JSON.stringify(a) + " to number.");
            }
            return "formatted" === this.type.kind
              ? H.fromString(ee(this.args[0].evaluate(e)))
              : "resolvedImage" === this.type.kind
              ? K.fromString(ee(this.args[0].evaluate(e)))
              : ee(this.args[0].evaluate(e));
          }),
          (le.prototype.eachChild = function (e) {
            this.args.forEach(e);
          }),
          (le.prototype.outputDefined = function () {
            return this.args.every(function (e) {
              return e.outputDefined();
            });
          }),
          (le.prototype.serialize = function () {
            if ("formatted" === this.type.kind)
              return new ie([
                { content: this.args[0], scale: null, font: null, textColor: null },
              ]).serialize();
            if ("resolvedImage" === this.type.kind)
              return new ae(this.args[0]).serialize();
            var e = ["to-" + this.type.kind];
            return (
              this.eachChild(function (t) {
                e.push(t.serialize());
              }),
              e
            );
          });
        var ue = ["Unknown", "Point", "LineString", "Polygon"],
          ce = function () {
            (this.globals = null),
              (this.feature = null),
              (this.featureState = null),
              (this.formattedSection = null),
              (this._parseColorCache = {}),
              (this.availableImages = null),
              (this.canonical = null);
          };
        (ce.prototype.id = function () {
          return this.feature && "id" in this.feature ? this.feature.id : null;
        }),
          (ce.prototype.geometryType = function () {
            return this.feature
              ? "number" == typeof this.feature.type
                ? ue[this.feature.type]
                : this.feature.type
              : null;
          }),
          (ce.prototype.geometry = function () {
            return this.feature && "geometry" in this.feature
              ? this.feature.geometry
              : null;
          }),
          (ce.prototype.canonicalID = function () {
            return this.canonical;
          }),
          (ce.prototype.properties = function () {
            return (this.feature && this.feature.properties) || {};
          }),
          (ce.prototype.parseColor = function (e) {
            var t = this._parseColorCache[e];
            return t || (t = this._parseColorCache[e] = J.parse(e)), t;
          });
        var pe = function (e, t, r, n) {
          (this.name = e), (this.type = t), (this._evaluate = r), (this.args = n);
        };
        (pe.prototype.evaluate = function (e) {
          return this._evaluate(e, this.args);
        }),
          (pe.prototype.eachChild = function (e) {
            this.args.forEach(e);
          }),
          (pe.prototype.outputDefined = function () {
            return !1;
          }),
          (pe.prototype.serialize = function () {
            return [this.name].concat(
              this.args.map(function (e) {
                return e.serialize();
              })
            );
          }),
          (pe.parse = function (e, t) {
            var r,
              n = e[0],
              o = pe.definitions[n];
            if (!o)
              return t.error(
                'Unknown expression "' +
                  n +
                  '". If you wanted a literal array, use ["literal", [...]].',
                0
              );
            for (
              var i = Array.isArray(o) ? o[0] : o.type,
                a = Array.isArray(o) ? [[o[1], o[2]]] : o.overloads,
                s = a.filter(function (t) {
                  var r = t[0];
                  return !Array.isArray(r) || r.length === e.length - 1;
                }),
                l = null,
                u = 0,
                c = s;
              u < c.length;
              u += 1
            ) {
              var p = c[u],
                h = p[0],
                d = p[1];
              l = new Fe(t.registry, t.path, null, t.scope);
              for (var f = [], y = !1, m = 1; m < e.length; m++) {
                var g = e[m],
                  v = Array.isArray(h) ? h[m - 1] : h.type,
                  b = l.parse(g, 1 + f.length, v);
                if (!b) {
                  y = !0;
                  break;
                }
                f.push(b);
              }
              if (!y)
                if (Array.isArray(h) && h.length !== f.length)
                  l.error(
                    "Expected " +
                      h.length +
                      " arguments, but found " +
                      f.length +
                      " instead."
                  );
                else {
                  for (var w = 0; w < f.length; w++) {
                    var x = Array.isArray(h) ? h[w] : h.type,
                      k = f[w];
                    l.concat(w + 1).checkSubtype(x, k.type);
                  }
                  if (0 === l.errors.length) return new pe(n, i, d, f);
                }
            }
            if (1 === s.length) (r = t.errors).push.apply(r, l.errors);
            else {
              for (
                var S = (s.length ? s : a)
                    .map(function (e) {
                      var t,
                        r = e[0];
                      return (
                        (t = r),
                        Array.isArray(t)
                          ? "(" + t.map(U).join(", ") + ")"
                          : "(" + U(t.type) + "...)"
                      );
                    })
                    .join(" | "),
                  _ = [],
                  j = 1;
                j < e.length;
                j++
              ) {
                var T = t.parse(e[j], 1 + _.length);
                if (!T) return null;
                _.push(U(T.type));
              }
              t.error(
                "Expected arguments of type " +
                  S +
                  ", but found (" +
                  _.join(", ") +
                  ") instead."
              );
            }
            return null;
          }),
          (pe.register = function (e, t) {
            for (var r in ((pe.definitions = t), t)) e[r] = pe;
          });
        var he = function (e, t, r) {
          (this.type = L),
            (this.locale = r),
            (this.caseSensitive = e),
            (this.diacriticSensitive = t);
        };
        (he.parse = function (e, t) {
          if (2 !== e.length) return t.error("Expected one argument.");
          var r = e[1];
          if ("object" != typeof r || Array.isArray(r))
            return t.error("Collator options argument must be an object.");
          var n = t.parse(void 0 !== r["case-sensitive"] && r["case-sensitive"], 1, P);
          if (!n) return null;
          var o = t.parse(
            void 0 !== r["diacritic-sensitive"] && r["diacritic-sensitive"],
            1,
            P
          );
          if (!o) return null;
          var i = null;
          return r.locale && !(i = t.parse(r.locale, 1, I)) ? null : new he(n, o, i);
        }),
          (he.prototype.evaluate = function (e) {
            return new Y(
              this.caseSensitive.evaluate(e),
              this.diacriticSensitive.evaluate(e),
              this.locale ? this.locale.evaluate(e) : null
            );
          }),
          (he.prototype.eachChild = function (e) {
            e(this.caseSensitive),
              e(this.diacriticSensitive),
              this.locale && e(this.locale);
          }),
          (he.prototype.outputDefined = function () {
            return !1;
          }),
          (he.prototype.serialize = function () {
            var e = {};
            return (
              (e["case-sensitive"] = this.caseSensitive.serialize()),
              (e["diacritic-sensitive"] = this.diacriticSensitive.serialize()),
              this.locale && (e.locale = this.locale.serialize()),
              ["collator", e]
            );
          });
        var de = fe;
        function fe(e, t, r, n) {
          (this.cx = 3 * e),
            (this.bx = 3 * (r - e) - this.cx),
            (this.ax = 1 - this.cx - this.bx),
            (this.cy = 3 * t),
            (this.by = 3 * (n - t) - this.cy),
            (this.ay = 1 - this.cy - this.by),
            (this.p1x = e),
            (this.p1y = n),
            (this.p2x = r),
            (this.p2y = n);
        }
        (fe.prototype.sampleCurveX = function (e) {
          return ((this.ax * e + this.bx) * e + this.cx) * e;
        }),
          (fe.prototype.sampleCurveY = function (e) {
            return ((this.ay * e + this.by) * e + this.cy) * e;
          }),
          (fe.prototype.sampleCurveDerivativeX = function (e) {
            return (3 * this.ax * e + 2 * this.bx) * e + this.cx;
          }),
          (fe.prototype.solveCurveX = function (e, t) {
            var r, n, o, i, a;
            for (void 0 === t && (t = 1e-6), o = e, a = 0; a < 8; a++) {
              if (((i = this.sampleCurveX(o) - e), Math.abs(i) < t)) return o;
              var s = this.sampleCurveDerivativeX(o);
              if (Math.abs(s) < 1e-6) break;
              o -= i / s;
            }
            if ((o = e) < (r = 0)) return r;
            if (o > (n = 1)) return n;
            for (; r < n; ) {
              if (((i = this.sampleCurveX(o)), Math.abs(i - e) < t)) return o;
              e > i ? (r = o) : (n = o), (o = 0.5 * (n - r) + r);
            }
            return o;
          }),
          (fe.prototype.solve = function (e, t) {
            return this.sampleCurveY(this.solveCurveX(e, t));
          });
        var ye = function (e, t) {
          e &&
            (t
              ? this.setSouthWest(e).setNorthEast(t)
              : 4 === e.length
              ? this.setSouthWest([e[0], e[1]]).setNorthEast([e[2], e[3]])
              : this.setSouthWest(e[0]).setNorthEast(e[1]));
        };
        (ye.prototype.setNorthEast = function (e) {
          return (
            (this._ne = e instanceof me ? new me(e.lng, e.lat) : me.convert(e)), this
          );
        }),
          (ye.prototype.setSouthWest = function (e) {
            return (
              (this._sw = e instanceof me ? new me(e.lng, e.lat) : me.convert(e)), this
            );
          }),
          (ye.prototype.extend = function (e) {
            var t,
              r,
              n = this._sw,
              o = this._ne;
            if (e instanceof me) (t = e), (r = e);
            else {
              if (!(e instanceof ye)) {
                if (Array.isArray(e)) {
                  if (4 === e.length || e.every(Array.isArray)) {
                    var i = e;
                    return this.extend(ye.convert(i));
                  }
                  var a = e;
                  return this.extend(me.convert(a));
                }
                return this;
              }
              if (((t = e._sw), (r = e._ne), !t || !r)) return this;
            }
            return (
              n || o
                ? ((n.lng = Math.min(t.lng, n.lng)),
                  (n.lat = Math.min(t.lat, n.lat)),
                  (o.lng = Math.max(r.lng, o.lng)),
                  (o.lat = Math.max(r.lat, o.lat)))
                : ((this._sw = new me(t.lng, t.lat)), (this._ne = new me(r.lng, r.lat))),
              this
            );
          }),
          (ye.prototype.getCenter = function () {
            return new me(
              (this._sw.lng + this._ne.lng) / 2,
              (this._sw.lat + this._ne.lat) / 2
            );
          }),
          (ye.prototype.getSouthWest = function () {
            return this._sw;
          }),
          (ye.prototype.getNorthEast = function () {
            return this._ne;
          }),
          (ye.prototype.getNorthWest = function () {
            return new me(this.getWest(), this.getNorth());
          }),
          (ye.prototype.getSouthEast = function () {
            return new me(this.getEast(), this.getSouth());
          }),
          (ye.prototype.getWest = function () {
            return this._sw.lng;
          }),
          (ye.prototype.getSouth = function () {
            return this._sw.lat;
          }),
          (ye.prototype.getEast = function () {
            return this._ne.lng;
          }),
          (ye.prototype.getNorth = function () {
            return this._ne.lat;
          }),
          (ye.prototype.toArray = function () {
            return [this._sw.toArray(), this._ne.toArray()];
          }),
          (ye.prototype.toString = function () {
            return (
              "LngLatBounds(" + this._sw.toString() + ", " + this._ne.toString() + ")"
            );
          }),
          (ye.prototype.isEmpty = function () {
            return !(this._sw && this._ne);
          }),
          (ye.prototype.contains = function (e) {
            var t = me.convert(e),
              r = t.lng,
              n = t.lat,
              o = this._sw.lat <= n && n <= this._ne.lat,
              i = this._sw.lng <= r && r <= this._ne.lng;
            return (
              this._sw.lng > this._ne.lng && (i = this._sw.lng >= r && r >= this._ne.lng),
              o && i
            );
          }),
          (ye.convert = function (e) {
            return !e || e instanceof ye ? e : new ye(e);
          });
        var me = function (e, t) {
          if (isNaN(e) || isNaN(t))
            throw new Error("Invalid LngLat object: (" + e + ", " + t + ")");
          if (((this.lng = +e), (this.lat = +t), this.lat > 90 || this.lat < -90))
            throw new Error("Invalid LngLat latitude value: must be between -90 and 90");
        };
        (me.prototype.wrap = function () {
          return new me(
            ((e = this.lng),
            (o = ((((e - (t = -180)) % (n = (r = 180) - t)) + n) % n) + t) === t ? r : o),
            this.lat
          );
          var e, t, r, n, o;
        }),
          (me.prototype.toArray = function () {
            return [this.lng, this.lat];
          }),
          (me.prototype.toString = function () {
            return "LngLat(" + this.lng + ", " + this.lat + ")";
          }),
          (me.prototype.distanceTo = function (e) {
            var t = Math.PI / 180,
              r = this.lat * t,
              n = e.lat * t,
              o =
                Math.sin(r) * Math.sin(n) +
                Math.cos(r) * Math.cos(n) * Math.cos((e.lng - this.lng) * t);
            return 6371008.8 * Math.acos(Math.min(o, 1));
          }),
          (me.prototype.toBounds = function (e) {
            void 0 === e && (e = 0);
            var t = (360 * e) / 40075017,
              r = t / Math.cos((Math.PI / 180) * this.lat);
            return new ye(
              new me(this.lng - r, this.lat - t),
              new me(this.lng + r, this.lat + t)
            );
          }),
          (me.convert = function (e) {
            if (e instanceof me) return e;
            if (Array.isArray(e) && (2 === e.length || 3 === e.length))
              return new me(Number(e[0]), Number(e[1]));
            if (!Array.isArray(e) && "object" == typeof e && null !== e)
              return new me(Number("lng" in e ? e.lng : e.lon), Number(e.lat));
            throw new Error(
              "`LngLatLike` argument must be specified as a LngLat instance, an object {lng: <lng>, lat: <lat>}, an object {lon: <lng>, lat: <lat>}, or an array of [<lng>, <lat>]"
            );
          });
        var ge = 2 * Math.PI * 6371008.8;
        function ve(e) {
          return ge * Math.cos((e * Math.PI) / 180);
        }
        function be(e) {
          var t = 180 - 360 * e;
          return (360 / Math.PI) * Math.atan(Math.exp((t * Math.PI) / 180)) - 90;
        }
        var we = function (e, t, r) {
          void 0 === r && (r = 0), (this.x = +e), (this.y = +t), (this.z = +r);
        };
        (we.fromLngLat = function (e, t) {
          void 0 === t && (t = 0);
          var r,
            n = me.convert(e);
          return new we(
            (180 + n.lng) / 360,
            ((r = n.lat),
            (180 -
              (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (r * Math.PI) / 360))) /
              360),
            (function (e, t) {
              return e / ve(t);
            })(t, n.lat)
          );
        }),
          (we.prototype.toLngLat = function () {
            return new me(360 * this.x - 180, be(this.y));
          }),
          (we.prototype.toAltitude = function () {
            return (e = this.z), (t = this.y), e * ve(be(t));
            var e, t;
          }),
          (we.prototype.meterInMercatorCoordinateUnits = function () {
            return (1 / ge) * ((e = be(this.y)), 1 / Math.cos((e * Math.PI) / 180));
            var e;
          });
        var xe = 8192;
        function ke(e, t) {
          (e[0] = Math.min(e[0], t[0])),
            (e[1] = Math.min(e[1], t[1])),
            (e[2] = Math.max(e[2], t[0])),
            (e[3] = Math.max(e[3], t[1]));
        }
        function Se(e, t) {
          return !(e[0] <= t[0]) && !(e[2] >= t[2]) && !(e[1] <= t[1]) && !(e[3] >= t[3]);
        }
        function _e(e, t) {
          var r = we.fromLngLat({ lng: e[0], lat: e[1] }, 0),
            n = Math.pow(2, t.z);
          return [Math.round(r.x * n * xe), Math.round(r.y * n * xe)];
        }
        function je(e, t, r) {
          return (
            t[1] > e[1] != r[1] > e[1] &&
            e[0] < ((r[0] - t[0]) * (e[1] - t[1])) / (r[1] - t[1]) + t[0]
          );
        }
        function Te(e, t) {
          for (var r, n, o, i, a, s, l, u = !1, c = 0, p = t.length; c < p; c++)
            for (var h = t[c], d = 0, f = h.length; d < f - 1; d++) {
              if (
                ((r = e),
                (n = h[d]),
                (o = h[d + 1]),
                (i = void 0),
                (a = void 0),
                (s = void 0),
                (l = void 0),
                (i = r[0] - n[0]),
                (a = r[1] - n[1]),
                (s = r[0] - o[0]),
                (l = r[1] - o[1]),
                i * l - s * a == 0 && i * s <= 0 && a * l <= 0)
              )
                return !1;
              je(e, h[d], h[d + 1]) && (u = !u);
            }
          return u;
        }
        function Ae(e, t) {
          for (var r = 0; r < t.length; r++) if (Te(e, t[r])) return !0;
          return !1;
        }
        function Oe(e, t, r, n) {
          var o = e[0] - r[0],
            i = e[1] - r[1],
            a = t[0] - r[0],
            s = t[1] - r[1],
            l = n[0] - r[0],
            u = n[1] - r[1];
          return (o * u - l * i) * (a * u - l * s) < 0;
        }
        function Ee(e, t, r) {
          for (var n = 0, o = r; n < o.length; n += 1)
            for (var i = o[n], a = 0; a < i.length - 1; ++a)
              if (
                ((s = e),
                (l = t),
                (u = i[a]),
                (c = i[a + 1]),
                (p = void 0),
                (h = void 0),
                (d = void 0),
                (f = void 0),
                (d = [l[0] - s[0], l[1] - s[1]]),
                (f = [c[0] - u[0], c[1] - u[1]]),
                0 != (p = f)[0] * (h = d)[1] - p[1] * h[0] &&
                  Oe(s, l, u, c) &&
                  Oe(u, c, s, l))
              )
                return !0;
          var s, l, u, c, p, h, d, f;
          return !1;
        }
        function Me(e, t) {
          for (var r = 0; r < e.length; ++r) if (!Te(e[r], t)) return !1;
          for (var n = 0; n < e.length - 1; ++n) if (Ee(e[n], e[n + 1], t)) return !1;
          return !0;
        }
        function ze(e, t) {
          for (var r = 0; r < t.length; r++) if (Me(e, t[r])) return !0;
          return !1;
        }
        function Ce(e, t, r) {
          for (var n = [], o = 0; o < e.length; o++) {
            for (var i = [], a = 0; a < e[o].length; a++) {
              var s = _e(e[o][a], r);
              ke(t, s), i.push(s);
            }
            n.push(i);
          }
          return n;
        }
        function Ie(e, t, r) {
          for (var n = [], o = 0; o < e.length; o++) {
            var i = Ce(e[o], t, r);
            n.push(i);
          }
          return n;
        }
        var Pe = function (e, t) {
          (this.type = P), (this.geojson = e), (this.geometries = t);
        };
        function Re(e) {
          if (e instanceof pe) {
            if ("get" === e.name && 1 === e.args.length) return !1;
            if ("feature-state" === e.name) return !1;
            if ("has" === e.name && 1 === e.args.length) return !1;
            if ("properties" === e.name || "geometry-type" === e.name || "id" === e.name)
              return !1;
            if (/^filter-/.test(e.name)) return !1;
          }
          if (e instanceof Pe) return !1;
          var t = !0;
          return (
            e.eachChild(function (e) {
              t && !Re(e) && (t = !1);
            }),
            t
          );
        }
        function Ne(e) {
          if (e instanceof pe && "feature-state" === e.name) return !1;
          var t = !0;
          return (
            e.eachChild(function (e) {
              t && !Ne(e) && (t = !1);
            }),
            t
          );
        }
        function qe(e, t) {
          if (e instanceof pe && t.indexOf(e.name) >= 0) return !1;
          var r = !0;
          return (
            e.eachChild(function (e) {
              r && !qe(e, t) && (r = !1);
            }),
            r
          );
        }
        (Pe.parse = function (e, t) {
          if (2 !== e.length)
            return t.error(
              "'within' expression requires exactly one argument, but found " +
                (e.length - 1) +
                " instead."
            );
          if (Z(e[1])) {
            var r = e[1];
            if ("FeatureCollection" === r.type)
              for (var n = 0; n < r.features.length; ++n) {
                var o = r.features[n].geometry.type;
                if ("Polygon" === o || "MultiPolygon" === o)
                  return new Pe(r, r.features[n].geometry);
              }
            else if ("Feature" === r.type) {
              var i = r.geometry.type;
              if ("Polygon" === i || "MultiPolygon" === i) return new Pe(r, r.geometry);
            } else if ("Polygon" === r.type || "MultiPolygon" === r.type)
              return new Pe(r, r);
          }
          return t.error(
            "'within' expression requires valid geojson object that contains polygon geometry type."
          );
        }),
          (Pe.prototype.evaluate = function (e) {
            if (null != e.geometry() && null != e.canonicalID()) {
              if ("Point" === e.geometryType())
                return (function (e, t) {
                  for (
                    var r = [1 / 0, 1 / 0, -1 / 0, -1 / 0],
                      n = [1 / 0, 1 / 0, -1 / 0, -1 / 0],
                      o = e.canonicalID(),
                      i = [o.x * xe, o.y * xe],
                      a = [],
                      s = 0,
                      l = e.geometry();
                    s < l.length;
                    s += 1
                  )
                    for (var u = 0, c = l[s]; u < c.length; u += 1) {
                      var p = c[u],
                        h = [p.x + i[0], p.y + i[1]];
                      ke(r, h), a.push(h);
                    }
                  if ("Polygon" === t.type) {
                    var d = Ce(t.coordinates, n, o);
                    if (!Se(r, n)) return !1;
                    for (var f = 0, y = a; f < y.length; f += 1) {
                      if (!Te(y[f], d)) return !1;
                    }
                  }
                  if ("MultiPolygon" === t.type) {
                    var m = Ie(t.coordinates, n, o);
                    if (!Se(r, n)) return !1;
                    for (var g = 0, v = a; g < v.length; g += 1) {
                      if (!Ae(v[g], m)) return !1;
                    }
                  }
                  return !0;
                })(e, this.geometries);
              if ("LineString" === e.geometryType())
                return (function (e, t) {
                  for (
                    var r = [1 / 0, 1 / 0, -1 / 0, -1 / 0],
                      n = [1 / 0, 1 / 0, -1 / 0, -1 / 0],
                      o = e.canonicalID(),
                      i = [o.x * xe, o.y * xe],
                      a = [],
                      s = 0,
                      l = e.geometry();
                    s < l.length;
                    s += 1
                  ) {
                    for (var u = [], c = 0, p = l[s]; c < p.length; c += 1) {
                      var h = p[c],
                        d = [h.x + i[0], h.y + i[1]];
                      ke(r, d), u.push(d);
                    }
                    a.push(u);
                  }
                  if ("Polygon" === t.type) {
                    var f = Ce(t.coordinates, n, o);
                    if (!Se(r, n)) return !1;
                    for (var y = 0, m = a; y < m.length; y += 1) {
                      if (!Me(m[y], f)) return !1;
                    }
                  }
                  if ("MultiPolygon" === t.type) {
                    var g = Ie(t.coordinates, n, o);
                    if (!Se(r, n)) return !1;
                    for (var v = 0, b = a; v < b.length; v += 1) {
                      if (!ze(b[v], g)) return !1;
                    }
                  }
                  return !0;
                })(e, this.geometries);
            }
            return !1;
          }),
          (Pe.prototype.eachChild = function () {}),
          (Pe.prototype.outputDefined = function () {
            return !0;
          }),
          (Pe.prototype.serialize = function () {
            return ["within", this.geojson];
          });
        var Le = function (e, t) {
          (this.type = t.type), (this.name = e), (this.boundExpression = t);
        };
        (Le.parse = function (e, t) {
          if (2 !== e.length || "string" != typeof e[1])
            return t.error(
              "'var' expression requires exactly one string literal argument."
            );
          var r = e[1];
          return t.scope.has(r)
            ? new Le(r, t.scope.get(r))
            : t.error(
                'Unknown variable "' +
                  r +
                  '". Make sure "' +
                  r +
                  '" has been bound in an enclosing "let" expression before using it.',
                1
              );
        }),
          (Le.prototype.evaluate = function (e) {
            return this.boundExpression.evaluate(e);
          }),
          (Le.prototype.eachChild = function () {}),
          (Le.prototype.outputDefined = function () {
            return !1;
          }),
          (Le.prototype.serialize = function () {
            return ["var", this.name];
          });
        var Fe = function (e, t, r, n, o) {
          void 0 === t && (t = []),
            void 0 === n && (n = new M()),
            void 0 === o && (o = []),
            (this.registry = e),
            (this.path = t),
            (this.key = t
              .map(function (e) {
                return "[" + e + "]";
              })
              .join("")),
            (this.scope = n),
            (this.errors = o),
            (this.expectedType = r);
        };
        function De(e, t) {
          for (var r, n, o = e.length - 1, i = 0, a = o, s = 0; i <= a; )
            if (((r = e[(s = Math.floor((i + a) / 2))]), (n = e[s + 1]), r <= t)) {
              if (s === o || t < n) return s;
              i = s + 1;
            } else {
              if (!(r > t)) throw new re("Input is not a number.");
              a = s - 1;
            }
          return 0;
        }
        (Fe.prototype.parse = function (e, t, r, n, o) {
          return (
            void 0 === o && (o = {}),
            t ? this.concat(t, r, n)._parse(e, o) : this._parse(e, o)
          );
        }),
          (Fe.prototype._parse = function (e, t) {
            function r(e, t, r) {
              return "assert" === r
                ? new oe(t, [e])
                : "coerce" === r
                ? new le(t, [e])
                : e;
            }
            if (
              ((null !== e &&
                "string" != typeof e &&
                "boolean" != typeof e &&
                "number" != typeof e) ||
                (e = ["literal", e]),
              Array.isArray(e))
            ) {
              if (0 === e.length)
                return this.error(
                  'Expected an array with at least one element. If you wanted a literal array, use ["literal", []].'
                );
              var n = e[0];
              if ("string" != typeof n)
                return (
                  this.error(
                    "Expression name must be a string, but found " +
                      typeof n +
                      ' instead. If you wanted a literal array, use ["literal", [...]].',
                    0
                  ),
                  null
                );
              var o = this.registry[n];
              if (o) {
                var i = o.parse(e, this);
                if (!i) return null;
                if (this.expectedType) {
                  var a = this.expectedType,
                    s = i.type;
                  if (
                    ("string" !== a.kind &&
                      "number" !== a.kind &&
                      "boolean" !== a.kind &&
                      "object" !== a.kind &&
                      "array" !== a.kind) ||
                    "value" !== s.kind
                  )
                    if (
                      ("color" !== a.kind &&
                        "formatted" !== a.kind &&
                        "resolvedImage" !== a.kind) ||
                      ("value" !== s.kind && "string" !== s.kind)
                    ) {
                      if (this.checkSubtype(a, s)) return null;
                    } else i = r(i, a, t.typeAnnotation || "coerce");
                  else i = r(i, a, t.typeAnnotation || "assert");
                }
                if (
                  !(i instanceof te) &&
                  "resolvedImage" !== i.type.kind &&
                  (function e(t) {
                    if (t instanceof Le) return e(t.boundExpression);
                    if (t instanceof pe && "error" === t.name) return !1;
                    if (t instanceof he) return !1;
                    if (t instanceof Pe) return !1;
                    var r = t instanceof le || t instanceof oe,
                      n = !0;
                    if (
                      (t.eachChild(function (t) {
                        n = r ? n && e(t) : n && t instanceof te;
                      }),
                      !n)
                    )
                      return !1;
                    return (
                      Re(t) &&
                      qe(t, [
                        "zoom",
                        "heatmap-density",
                        "line-progress",
                        "accumulated",
                        "is-supported-script",
                      ])
                    );
                  })(i)
                ) {
                  var l = new ce();
                  try {
                    i = new te(i.type, i.evaluate(l));
                  } catch (e) {
                    return this.error(e.message), null;
                  }
                }
                return i;
              }
              return this.error(
                'Unknown expression "' +
                  n +
                  '". If you wanted a literal array, use ["literal", [...]].',
                0
              );
            }
            return void 0 === e
              ? this.error("'undefined' value invalid. Use null instead.")
              : "object" == typeof e
              ? this.error('Bare objects invalid. Use ["literal", {...}] instead.')
              : this.error("Expected an array, but found " + typeof e + " instead.");
          }),
          (Fe.prototype.concat = function (e, t, r) {
            var n = "number" == typeof e ? this.path.concat(e) : this.path,
              o = r ? this.scope.concat(r) : this.scope;
            return new Fe(this.registry, n, t || null, o, this.errors);
          }),
          (Fe.prototype.error = function (e) {
            for (var t = arguments, r = [], n = arguments.length - 1; n-- > 0; )
              r[n] = t[n + 1];
            var o =
              "" +
              this.key +
              r
                .map(function (e) {
                  return "[" + e + "]";
                })
                .join("");
            this.errors.push(new E(o, e));
          }),
          (Fe.prototype.checkSubtype = function (e, t) {
            var r = W(e, t);
            return r && this.error(r), r;
          });
        var Be = function (e, t, r) {
          (this.type = e), (this.input = t), (this.labels = []), (this.outputs = []);
          for (var n = 0, o = r; n < o.length; n += 1) {
            var i = o[n],
              a = i[0],
              s = i[1];
            this.labels.push(a), this.outputs.push(s);
          }
        };
        function Ue(e, t, r) {
          return e * (1 - r) + t * r;
        }
        (Be.parse = function (e, t) {
          if (e.length - 1 < 4)
            return t.error(
              "Expected at least 4 arguments, but found only " + (e.length - 1) + "."
            );
          if ((e.length - 1) % 2 != 0)
            return t.error("Expected an even number of arguments.");
          var r = t.parse(e[1], 1, C);
          if (!r) return null;
          var n = [],
            o = null;
          t.expectedType && "value" !== t.expectedType.kind && (o = t.expectedType);
          for (var i = 1; i < e.length; i += 2) {
            var a = 1 === i ? -1 / 0 : e[i],
              s = e[i + 1],
              l = i,
              u = i + 1;
            if ("number" != typeof a)
              return t.error(
                'Input/output pairs for "step" expressions must be defined using literal numeric values (not computed expressions) for the input values.',
                l
              );
            if (n.length && n[n.length - 1][0] >= a)
              return t.error(
                'Input/output pairs for "step" expressions must be arranged with input values in strictly ascending order.',
                l
              );
            var c = t.parse(s, u, o);
            if (!c) return null;
            (o = o || c.type), n.push([a, c]);
          }
          return new Be(o, r, n);
        }),
          (Be.prototype.evaluate = function (e) {
            var t = this.labels,
              r = this.outputs;
            if (1 === t.length) return r[0].evaluate(e);
            var n = this.input.evaluate(e);
            if (n <= t[0]) return r[0].evaluate(e);
            var o = t.length;
            return n >= t[o - 1] ? r[o - 1].evaluate(e) : r[De(t, n)].evaluate(e);
          }),
          (Be.prototype.eachChild = function (e) {
            e(this.input);
            for (var t = 0, r = this.outputs; t < r.length; t += 1) {
              e(r[t]);
            }
          }),
          (Be.prototype.outputDefined = function () {
            return this.outputs.every(function (e) {
              return e.outputDefined();
            });
          }),
          (Be.prototype.serialize = function () {
            for (
              var e = ["step", this.input.serialize()], t = 0;
              t < this.labels.length;
              t++
            )
              t > 0 && e.push(this.labels[t]), e.push(this.outputs[t].serialize());
            return e;
          });
        var Ge = Object.freeze({
            __proto__: null,
            number: Ue,
            color: function (e, t, r) {
              return new J(
                Ue(e.r, t.r, r),
                Ue(e.g, t.g, r),
                Ue(e.b, t.b, r),
                Ue(e.a, t.a, r)
              );
            },
            array: function (e, t, r) {
              return e.map(function (e, n) {
                return Ue(e, t[n], r);
              });
            },
          }),
          We = 0.95047,
          Ve = 1,
          Je = 1.08883,
          Ye = 4 / 29,
          $e = 6 / 29,
          He = 3 * $e * $e,
          Ke = $e * $e * $e,
          Xe = Math.PI / 180,
          Ze = 180 / Math.PI;
        function Qe(e) {
          return e > Ke ? Math.pow(e, 1 / 3) : e / He + Ye;
        }
        function et(e) {
          return e > $e ? e * e * e : He * (e - Ye);
        }
        function tt(e) {
          return (
            255 * (e <= 0.0031308 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055)
          );
        }
        function rt(e) {
          return (e /= 255) <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
        }
        function nt(e) {
          var t = rt(e.r),
            r = rt(e.g),
            n = rt(e.b),
            o = Qe((0.4124564 * t + 0.3575761 * r + 0.1804375 * n) / We),
            i = Qe((0.2126729 * t + 0.7151522 * r + 0.072175 * n) / Ve);
          return {
            l: 116 * i - 16,
            a: 500 * (o - i),
            b: 200 * (i - Qe((0.0193339 * t + 0.119192 * r + 0.9503041 * n) / Je)),
            alpha: e.a,
          };
        }
        function ot(e) {
          var t = (e.l + 16) / 116,
            r = isNaN(e.a) ? t : t + e.a / 500,
            n = isNaN(e.b) ? t : t - e.b / 200;
          return (
            (t = Ve * et(t)),
            (r = We * et(r)),
            (n = Je * et(n)),
            new J(
              tt(3.2404542 * r - 1.5371385 * t - 0.4985314 * n),
              tt(-0.969266 * r + 1.8760108 * t + 0.041556 * n),
              tt(0.0556434 * r - 0.2040259 * t + 1.0572252 * n),
              e.alpha
            )
          );
        }
        function it(e, t, r) {
          var n = t - e;
          return e + r * (n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n);
        }
        var at = {
            forward: nt,
            reverse: ot,
            interpolate: function (e, t, r) {
              return {
                l: Ue(e.l, t.l, r),
                a: Ue(e.a, t.a, r),
                b: Ue(e.b, t.b, r),
                alpha: Ue(e.alpha, t.alpha, r),
              };
            },
          },
          st = {
            forward: function (e) {
              var t = nt(e),
                r = t.l,
                n = t.a,
                o = t.b,
                i = Math.atan2(o, n) * Ze;
              return {
                h: i < 0 ? i + 360 : i,
                c: Math.sqrt(n * n + o * o),
                l: r,
                alpha: e.a,
              };
            },
            reverse: function (e) {
              var t = e.h * Xe,
                r = e.c;
              return ot({
                l: e.l,
                a: Math.cos(t) * r,
                b: Math.sin(t) * r,
                alpha: e.alpha,
              });
            },
            interpolate: function (e, t, r) {
              return {
                h: it(e.h, t.h, r),
                c: Ue(e.c, t.c, r),
                l: Ue(e.l, t.l, r),
                alpha: Ue(e.alpha, t.alpha, r),
              };
            },
          },
          lt = Object.freeze({ __proto__: null, lab: at, hcl: st }),
          ut = function (e, t, r, n, o) {
            (this.type = e),
              (this.operator = t),
              (this.interpolation = r),
              (this.input = n),
              (this.labels = []),
              (this.outputs = []);
            for (var i = 0, a = o; i < a.length; i += 1) {
              var s = a[i],
                l = s[0],
                u = s[1];
              this.labels.push(l), this.outputs.push(u);
            }
          };
        function ct(e, t, r, n) {
          var o = n - r,
            i = e - r;
          return 0 === o
            ? 0
            : 1 === t
            ? i / o
            : (Math.pow(t, i) - 1) / (Math.pow(t, o) - 1);
        }
        (ut.interpolationFactor = function (e, t, r, n) {
          var o = 0;
          if ("exponential" === e.name) o = ct(t, e.base, r, n);
          else if ("linear" === e.name) o = ct(t, 1, r, n);
          else if ("cubic-bezier" === e.name) {
            var i = e.controlPoints;
            o = new de(i[0], i[1], i[2], i[3]).solve(ct(t, 1, r, n));
          }
          return o;
        }),
          (ut.parse = function (e, t) {
            var r = e[0],
              n = e[1],
              o = e[2],
              i = e.slice(3);
            if (!Array.isArray(n) || 0 === n.length)
              return t.error("Expected an interpolation type expression.", 1);
            if ("linear" === n[0]) n = { name: "linear" };
            else if ("exponential" === n[0]) {
              var a = n[1];
              if ("number" != typeof a)
                return t.error(
                  "Exponential interpolation requires a numeric base.",
                  1,
                  1
                );
              n = { name: "exponential", base: a };
            } else {
              if ("cubic-bezier" !== n[0])
                return t.error("Unknown interpolation type " + String(n[0]), 1, 0);
              var s = n.slice(1);
              if (
                4 !== s.length ||
                s.some(function (e) {
                  return "number" != typeof e || e < 0 || e > 1;
                })
              )
                return t.error(
                  "Cubic bezier interpolation requires four numeric arguments with values between 0 and 1.",
                  1
                );
              n = { name: "cubic-bezier", controlPoints: s };
            }
            if (e.length - 1 < 4)
              return t.error(
                "Expected at least 4 arguments, but found only " + (e.length - 1) + "."
              );
            if ((e.length - 1) % 2 != 0)
              return t.error("Expected an even number of arguments.");
            if (!(o = t.parse(o, 2, C))) return null;
            var l = [],
              u = null;
            "interpolate-hcl" === r || "interpolate-lab" === r
              ? (u = R)
              : t.expectedType && "value" !== t.expectedType.kind && (u = t.expectedType);
            for (var c = 0; c < i.length; c += 2) {
              var p = i[c],
                h = i[c + 1],
                d = c + 3,
                f = c + 4;
              if ("number" != typeof p)
                return t.error(
                  'Input/output pairs for "interpolate" expressions must be defined using literal numeric values (not computed expressions) for the input values.',
                  d
                );
              if (l.length && l[l.length - 1][0] >= p)
                return t.error(
                  'Input/output pairs for "interpolate" expressions must be arranged with input values in strictly ascending order.',
                  d
                );
              var y = t.parse(h, f, u);
              if (!y) return null;
              (u = u || y.type), l.push([p, y]);
            }
            return "number" === u.kind ||
              "color" === u.kind ||
              ("array" === u.kind &&
                "number" === u.itemType.kind &&
                "number" == typeof u.N)
              ? new ut(u, r, n, o, l)
              : t.error("Type " + U(u) + " is not interpolatable.");
          }),
          (ut.prototype.evaluate = function (e) {
            var t = this.labels,
              r = this.outputs;
            if (1 === t.length) return r[0].evaluate(e);
            var n = this.input.evaluate(e);
            if (n <= t[0]) return r[0].evaluate(e);
            var o = t.length;
            if (n >= t[o - 1]) return r[o - 1].evaluate(e);
            var i = De(t, n),
              a = t[i],
              s = t[i + 1],
              l = ut.interpolationFactor(this.interpolation, n, a, s),
              u = r[i].evaluate(e),
              c = r[i + 1].evaluate(e);
            return "interpolate" === this.operator
              ? Ge[this.type.kind.toLowerCase()](u, c, l)
              : "interpolate-hcl" === this.operator
              ? st.reverse(st.interpolate(st.forward(u), st.forward(c), l))
              : at.reverse(at.interpolate(at.forward(u), at.forward(c), l));
          }),
          (ut.prototype.eachChild = function (e) {
            e(this.input);
            for (var t = 0, r = this.outputs; t < r.length; t += 1) {
              e(r[t]);
            }
          }),
          (ut.prototype.outputDefined = function () {
            return this.outputs.every(function (e) {
              return e.outputDefined();
            });
          }),
          (ut.prototype.serialize = function () {
            var e;
            e =
              "linear" === this.interpolation.name
                ? ["linear"]
                : "exponential" === this.interpolation.name
                ? 1 === this.interpolation.base
                  ? ["linear"]
                  : ["exponential", this.interpolation.base]
                : ["cubic-bezier"].concat(this.interpolation.controlPoints);
            for (
              var t = [this.operator, e, this.input.serialize()], r = 0;
              r < this.labels.length;
              r++
            )
              t.push(this.labels[r], this.outputs[r].serialize());
            return t;
          });
        var pt = function (e, t) {
          (this.type = e), (this.args = t);
        };
        (pt.parse = function (e, t) {
          if (e.length < 2) return t.error("Expectected at least one argument.");
          var r = null,
            n = t.expectedType;
          n && "value" !== n.kind && (r = n);
          for (var o = [], i = 0, a = e.slice(1); i < a.length; i += 1) {
            var s = a[i],
              l = t.parse(s, 1 + o.length, r, void 0, { typeAnnotation: "omit" });
            if (!l) return null;
            (r = r || l.type), o.push(l);
          }
          var u =
            n &&
            o.some(function (e) {
              return W(n, e.type);
            });
          return new pt(u ? q : r, o);
        }),
          (pt.prototype.evaluate = function (e) {
            for (var t, r = null, n = 0, o = 0, i = this.args; o < i.length; o += 1) {
              if (
                (n++,
                (r = i[o].evaluate(e)) &&
                  r instanceof K &&
                  !r.available &&
                  (t || (t = r.name), (r = null), n === this.args.length && (r = t)),
                null !== r)
              )
                break;
            }
            return r;
          }),
          (pt.prototype.eachChild = function (e) {
            this.args.forEach(e);
          }),
          (pt.prototype.outputDefined = function () {
            return this.args.every(function (e) {
              return e.outputDefined();
            });
          }),
          (pt.prototype.serialize = function () {
            var e = ["coalesce"];
            return (
              this.eachChild(function (t) {
                e.push(t.serialize());
              }),
              e
            );
          });
        var ht = function (e, t) {
          (this.type = t.type), (this.bindings = [].concat(e)), (this.result = t);
        };
        (ht.prototype.evaluate = function (e) {
          return this.result.evaluate(e);
        }),
          (ht.prototype.eachChild = function (e) {
            for (var t = 0, r = this.bindings; t < r.length; t += 1) {
              e(r[t][1]);
            }
            e(this.result);
          }),
          (ht.parse = function (e, t) {
            if (e.length < 4)
              return t.error(
                "Expected at least 3 arguments, but found " + (e.length - 1) + " instead."
              );
            for (var r = [], n = 1; n < e.length - 1; n += 2) {
              var o = e[n];
              if ("string" != typeof o)
                return t.error("Expected string, but found " + typeof o + " instead.", n);
              if (/[^a-zA-Z0-9_]/.test(o))
                return t.error(
                  "Variable names must contain only alphanumeric characters or '_'.",
                  n
                );
              var i = t.parse(e[n + 1], n + 1);
              if (!i) return null;
              r.push([o, i]);
            }
            var a = t.parse(e[e.length - 1], e.length - 1, t.expectedType, r);
            return a ? new ht(r, a) : null;
          }),
          (ht.prototype.outputDefined = function () {
            return this.result.outputDefined();
          }),
          (ht.prototype.serialize = function () {
            for (var e = ["let"], t = 0, r = this.bindings; t < r.length; t += 1) {
              var n = r[t],
                o = n[0],
                i = n[1];
              e.push(o, i.serialize());
            }
            return e.push(this.result.serialize()), e;
          });
        var dt = function (e, t, r) {
          (this.type = e), (this.index = t), (this.input = r);
        };
        (dt.parse = function (e, t) {
          if (3 !== e.length)
            return t.error(
              "Expected 2 arguments, but found " + (e.length - 1) + " instead."
            );
          var r = t.parse(e[1], 1, C),
            n = t.parse(e[2], 2, B(t.expectedType || q));
          if (!r || !n) return null;
          var o = n.type;
          return new dt(o.itemType, r, n);
        }),
          (dt.prototype.evaluate = function (e) {
            var t = this.index.evaluate(e),
              r = this.input.evaluate(e);
            if (t < 0) throw new re("Array index out of bounds: " + t + " < 0.");
            if (t >= r.length)
              throw new re(
                "Array index out of bounds: " + t + " > " + (r.length - 1) + "."
              );
            if (t !== Math.floor(t))
              throw new re(
                "Array index must be an integer, but found " + t + " instead."
              );
            return r[t];
          }),
          (dt.prototype.eachChild = function (e) {
            e(this.index), e(this.input);
          }),
          (dt.prototype.outputDefined = function () {
            return !1;
          }),
          (dt.prototype.serialize = function () {
            return ["at", this.index.serialize(), this.input.serialize()];
          });
        var ft = function (e, t) {
          (this.type = P), (this.needle = e), (this.haystack = t);
        };
        (ft.parse = function (e, t) {
          if (3 !== e.length)
            return t.error(
              "Expected 2 arguments, but found " + (e.length - 1) + " instead."
            );
          var r,
            n = t.parse(e[1], 1, q),
            o = t.parse(e[2], 2, q);
          return n && o
            ? "boolean" !== (r = n.type).kind &&
              "string" !== r.kind &&
              "number" !== r.kind &&
              "null" !== r.kind &&
              "value" !== r.kind
              ? t.error(
                  "Expected first argument to be of type boolean, string, number or null, but found " +
                    U(n.type) +
                    " instead"
                )
              : new ft(n, o)
            : null;
        }),
          (ft.prototype.evaluate = function (e) {
            var t = this.needle.evaluate(e),
              r = this.haystack.evaluate(e);
            if (null == t || !r) return !1;
            if (
              !(function (e) {
                return (
                  "boolean" == typeof e || "string" == typeof e || "number" == typeof e
                );
              })(t)
            )
              throw new re(
                "Expected first argument to be of type boolean, string or number, but found " +
                  U(Q(t)) +
                  " instead."
              );
            if (
              !(function (e) {
                return Array.isArray(e) || "string" == typeof e;
              })(r)
            )
              throw new re(
                "Expected second argument to be of type array or string, but found " +
                  U(Q(r)) +
                  " instead."
              );
            return r.indexOf(t) >= 0;
          }),
          (ft.prototype.eachChild = function (e) {
            e(this.needle), e(this.haystack);
          }),
          (ft.prototype.outputDefined = function () {
            return !0;
          }),
          (ft.prototype.serialize = function () {
            return ["in", this.needle.serialize(), this.haystack.serialize()];
          });
        var yt = function (e, t, r, n, o, i) {
          (this.inputType = e),
            (this.type = t),
            (this.input = r),
            (this.cases = n),
            (this.outputs = o),
            (this.otherwise = i);
        };
        (yt.parse = function (e, t) {
          if (e.length < 5)
            return t.error(
              "Expected at least 4 arguments, but found only " + (e.length - 1) + "."
            );
          if (e.length % 2 != 1) return t.error("Expected an even number of arguments.");
          var r, n;
          t.expectedType && "value" !== t.expectedType.kind && (n = t.expectedType);
          for (var o = {}, i = [], a = 2; a < e.length - 1; a += 2) {
            var s = e[a],
              l = e[a + 1];
            Array.isArray(s) || (s = [s]);
            var u = t.concat(a);
            if (0 === s.length) return u.error("Expected at least one branch label.");
            for (var c = 0, p = s; c < p.length; c += 1) {
              var h = p[c];
              if ("number" != typeof h && "string" != typeof h)
                return u.error("Branch labels must be numbers or strings.");
              if ("number" == typeof h && Math.abs(h) > Number.MAX_SAFE_INTEGER)
                return u.error(
                  "Branch labels must be integers no larger than " +
                    Number.MAX_SAFE_INTEGER +
                    "."
                );
              if ("number" == typeof h && Math.floor(h) !== h)
                return u.error("Numeric branch labels must be integer values.");
              if (r) {
                if (u.checkSubtype(r, Q(h))) return null;
              } else r = Q(h);
              if (void 0 !== o[String(h)])
                return u.error("Branch labels must be unique.");
              o[String(h)] = i.length;
            }
            var d = t.parse(l, a, n);
            if (!d) return null;
            (n = n || d.type), i.push(d);
          }
          var f = t.parse(e[1], 1, q);
          if (!f) return null;
          var y = t.parse(e[e.length - 1], e.length - 1, n);
          return y
            ? "value" !== f.type.kind && t.concat(1).checkSubtype(r, f.type)
              ? null
              : new yt(r, n, f, o, i, y)
            : null;
        }),
          (yt.prototype.evaluate = function (e) {
            var t = this.input.evaluate(e);
            return (
              (Q(t) === this.inputType && this.outputs[this.cases[t]]) ||
              this.otherwise
            ).evaluate(e);
          }),
          (yt.prototype.eachChild = function (e) {
            e(this.input), this.outputs.forEach(e), e(this.otherwise);
          }),
          (yt.prototype.outputDefined = function () {
            return (
              this.outputs.every(function (e) {
                return e.outputDefined();
              }) && this.otherwise.outputDefined()
            );
          }),
          (yt.prototype.serialize = function () {
            for (
              var e = this,
                t = ["match", this.input.serialize()],
                r = [],
                n = {},
                o = 0,
                i = Object.keys(this.cases).sort();
              o < i.length;
              o += 1
            ) {
              var a = i[o];
              void 0 === (p = n[this.cases[a]])
                ? ((n[this.cases[a]] = r.length), r.push([this.cases[a], [a]]))
                : r[p][1].push(a);
            }
            for (
              var s = function (t) {
                  return "number" === e.inputType.kind ? Number(t) : t;
                },
                l = 0,
                u = r;
              l < u.length;
              l += 1
            ) {
              var c = u[l],
                p = c[0],
                h = c[1];
              1 === h.length ? t.push(s(h[0])) : t.push(h.map(s)),
                t.push(this.outputs[outputIndex$1].serialize());
            }
            return t.push(this.otherwise.serialize()), t;
          });
        var mt = function (e, t, r) {
          (this.type = e), (this.branches = t), (this.otherwise = r);
        };
        function gt(e, t) {
          return "==" === e || "!=" === e
            ? "boolean" === t.kind ||
                "string" === t.kind ||
                "number" === t.kind ||
                "null" === t.kind ||
                "value" === t.kind
            : "string" === t.kind || "number" === t.kind || "value" === t.kind;
        }
        function vt(e, t, r, n) {
          return 0 === n.compare(t, r);
        }
        function bt(e, t, r) {
          var n = "==" !== e && "!=" !== e;
          return (function () {
            function o(e, t, r) {
              (this.type = P),
                (this.lhs = e),
                (this.rhs = t),
                (this.collator = r),
                (this.hasUntypedArgument =
                  "value" === e.type.kind || "value" === t.type.kind);
            }
            return (
              (o.parse = function (e, t) {
                if (3 !== e.length && 4 !== e.length)
                  return t.error("Expected two or three arguments.");
                var r = e[0],
                  i = t.parse(e[1], 1, q);
                if (!i) return null;
                if (!gt(r, i.type))
                  return t
                    .concat(1)
                    .error(
                      '"' +
                        r +
                        "\" comparisons are not supported for type '" +
                        U(i.type) +
                        "'."
                    );
                var a = t.parse(e[2], 2, q);
                if (!a) return null;
                if (!gt(r, a.type))
                  return t
                    .concat(2)
                    .error(
                      '"' +
                        r +
                        "\" comparisons are not supported for type '" +
                        U(a.type) +
                        "'."
                    );
                if (
                  i.type.kind !== a.type.kind &&
                  "value" !== i.type.kind &&
                  "value" !== a.type.kind
                )
                  return t.error(
                    "Cannot compare types '" + U(i.type) + "' and '" + U(a.type) + "'."
                  );
                n &&
                  ("value" === i.type.kind && "value" !== a.type.kind
                    ? (i = new oe(a.type, [i]))
                    : "value" !== i.type.kind &&
                      "value" === a.type.kind &&
                      (a = new oe(i.type, [a])));
                var s = null;
                if (4 === e.length) {
                  if (
                    "string" !== i.type.kind &&
                    "string" !== a.type.kind &&
                    "value" !== i.type.kind &&
                    "value" !== a.type.kind
                  )
                    return t.error("Cannot use collator to compare non-string types.");
                  if (!(s = t.parse(e[3], 3, L))) return null;
                }
                return new o(i, a, s);
              }),
              (o.prototype.evaluate = function (o) {
                var i = this.lhs.evaluate(o),
                  a = this.rhs.evaluate(o);
                if (n && this.hasUntypedArgument) {
                  var s = Q(i),
                    l = Q(a);
                  if (s.kind !== l.kind || ("string" !== s.kind && "number" !== s.kind))
                    throw new re(
                      'Expected arguments for "' +
                        e +
                        '" to be (string, string) or (number, number), but found (' +
                        s.kind +
                        ", " +
                        l.kind +
                        ") instead."
                    );
                }
                if (this.collator && !n && this.hasUntypedArgument) {
                  var u = Q(i),
                    c = Q(a);
                  if ("string" !== u.kind || "string" !== c.kind) return t(o, i, a);
                }
                return this.collator ? r(o, i, a, this.collator.evaluate(o)) : t(o, i, a);
              }),
              (o.prototype.eachChild = function (e) {
                e(this.lhs), e(this.rhs), this.collator && e(this.collator);
              }),
              (o.prototype.outputDefined = function () {
                return !0;
              }),
              (o.prototype.serialize = function () {
                var t = [e];
                return (
                  this.eachChild(function (e) {
                    t.push(e.serialize());
                  }),
                  t
                );
              }),
              o
            );
          })();
        }
        (mt.parse = function (e, t) {
          if (e.length < 4)
            return t.error(
              "Expected at least 3 arguments, but found only " + (e.length - 1) + "."
            );
          if (e.length % 2 != 0) return t.error("Expected an odd number of arguments.");
          var r;
          t.expectedType && "value" !== t.expectedType.kind && (r = t.expectedType);
          for (var n = [], o = 1; o < e.length - 1; o += 2) {
            var i = t.parse(e[o], o, P);
            if (!i) return null;
            var a = t.parse(e[o + 1], o + 1, r);
            if (!a) return null;
            n.push([i, a]), (r = r || a.type);
          }
          var s = t.parse(e[e.length - 1], e.length - 1, r);
          return s ? new mt(r, n, s) : null;
        }),
          (mt.prototype.evaluate = function (e) {
            for (var t = 0, r = this.branches; t < r.length; t += 1) {
              var n = r[t],
                o = n[0],
                i = n[1];
              if (o.evaluate(e)) return i.evaluate(e);
            }
            return this.otherwise.evaluate(e);
          }),
          (mt.prototype.eachChild = function (e) {
            for (var t = 0, r = this.branches; t < r.length; t += 1) {
              var n = r[t],
                o = n[0],
                i = n[1];
              e(o), e(i);
            }
            e(this.otherwise);
          }),
          (mt.prototype.outputDefined = function () {
            return (
              this.branches.every(function (e) {
                e[0];
                return e[1].outputDefined();
              }) && this.otherwise.outputDefined()
            );
          }),
          (mt.prototype.serialize = function () {
            var e = ["case"];
            return (
              this.eachChild(function (t) {
                e.push(t.serialize());
              }),
              e
            );
          });
        var wt = bt(
            "==",
            function (e, t, r) {
              return t === r;
            },
            vt
          ),
          xt = bt(
            "!=",
            function (e, t, r) {
              return t !== r;
            },
            function (e, t, r, n) {
              return !vt(0, t, r, n);
            }
          ),
          kt = bt(
            "<",
            function (e, t, r) {
              return t < r;
            },
            function (e, t, r, n) {
              return n.compare(t, r) < 0;
            }
          ),
          St = bt(
            ">",
            function (e, t, r) {
              return t > r;
            },
            function (e, t, r, n) {
              return n.compare(t, r) > 0;
            }
          ),
          _t = bt(
            "<=",
            function (e, t, r) {
              return t <= r;
            },
            function (e, t, r, n) {
              return n.compare(t, r) <= 0;
            }
          ),
          jt = bt(
            ">=",
            function (e, t, r) {
              return t >= r;
            },
            function (e, t, r, n) {
              return n.compare(t, r) >= 0;
            }
          ),
          Tt = function (e, t, r, n, o) {
            (this.type = I),
              (this.number = e),
              (this.locale = t),
              (this.currency = r),
              (this.minFractionDigits = n),
              (this.maxFractionDigits = o);
          };
        (Tt.parse = function (e, t) {
          if (3 !== e.length) return t.error("Expected two arguments.");
          var r = t.parse(e[1], 1, C);
          if (!r) return null;
          var n = e[2];
          if ("object" != typeof n || Array.isArray(n))
            return t.error("NumberFormat options argument must be an object.");
          var o = null;
          if (n.locale && !(o = t.parse(n.locale, 1, I))) return null;
          var i = null;
          if (n.currency && !(i = t.parse(n.currency, 1, I))) return null;
          var a = null;
          if (n["min-fraction-digits"] && !(a = t.parse(n["min-fraction-digits"], 1, C)))
            return null;
          var s = null;
          return n["max-fraction-digits"] &&
            !(s = t.parse(n["max-fraction-digits"], 1, C))
            ? null
            : new Tt(r, o, i, a, s);
        }),
          (Tt.prototype.evaluate = function (e) {
            return new Intl.NumberFormat(this.locale ? this.locale.evaluate(e) : [], {
              style: this.currency ? "currency" : "decimal",
              currency: this.currency ? this.currency.evaluate(e) : void 0,
              minimumFractionDigits: this.minFractionDigits
                ? this.minFractionDigits.evaluate(e)
                : void 0,
              maximumFractionDigits: this.maxFractionDigits
                ? this.maxFractionDigits.evaluate(e)
                : void 0,
            }).format(this.number.evaluate(e));
          }),
          (Tt.prototype.eachChild = function (e) {
            e(this.number),
              this.locale && e(this.locale),
              this.currency && e(this.currency),
              this.minFractionDigits && e(this.minFractionDigits),
              this.maxFractionDigits && e(this.maxFractionDigits);
          }),
          (Tt.prototype.outputDefined = function () {
            return !1;
          }),
          (Tt.prototype.serialize = function () {
            var e = {};
            return (
              this.locale && (e.locale = this.locale.serialize()),
              this.currency && (e.currency = this.currency.serialize()),
              this.minFractionDigits &&
                (e["min-fraction-digits"] = this.minFractionDigits.serialize()),
              this.maxFractionDigits &&
                (e["max-fraction-digits"] = this.maxFractionDigits.serialize()),
              ["number-format", this.number.serialize(), e]
            );
          });
        var At = function (e) {
          (this.type = C), (this.input = e);
        };
        (At.parse = function (e, t) {
          if (2 !== e.length)
            return t.error(
              "Expected 1 argument, but found " + (e.length - 1) + " instead."
            );
          var r = t.parse(e[1], 1);
          return r
            ? "array" !== r.type.kind &&
              "string" !== r.type.kind &&
              "value" !== r.type.kind
              ? t.error(
                  "Expected argument of type string or array, but found " +
                    U(r.type) +
                    " instead."
                )
              : new At(r)
            : null;
        }),
          (At.prototype.evaluate = function (e) {
            var t = this.input.evaluate(e);
            if ("string" == typeof t) return t.length;
            if (Array.isArray(t)) return t.length;
            throw new re(
              "Expected value to be of type string or array, but found " +
                U(Q(t)) +
                " instead."
            );
          }),
          (At.prototype.eachChild = function (e) {
            e(this.input);
          }),
          (At.prototype.outputDefined = function () {
            return !1;
          }),
          (At.prototype.serialize = function () {
            var e = ["length"];
            return (
              this.eachChild(function (t) {
                e.push(t.serialize());
              }),
              e
            );
          });
        var Ot = {
          "==": wt,
          "!=": xt,
          ">": St,
          "<": kt,
          ">=": jt,
          "<=": _t,
          array: oe,
          at: dt,
          boolean: oe,
          case: mt,
          coalesce: pt,
          collator: he,
          format: ie,
          image: ae,
          in: ft,
          interpolate: ut,
          "interpolate-hcl": ut,
          "interpolate-lab": ut,
          length: At,
          let: ht,
          literal: te,
          match: yt,
          number: oe,
          "number-format": Tt,
          object: oe,
          step: Be,
          string: oe,
          "to-boolean": le,
          "to-color": le,
          "to-number": le,
          "to-string": le,
          var: Le,
          within: Pe,
        };
        function Et(e, t) {
          var r = t[0],
            n = t[1],
            o = t[2],
            i = t[3];
          (r = r.evaluate(e)), (n = n.evaluate(e)), (o = o.evaluate(e));
          var a = i ? i.evaluate(e) : 1,
            s = X(r, n, o, a);
          if (s) throw new re(s);
          return new J((r / 255) * a, (n / 255) * a, (o / 255) * a, a);
        }
        function Mt(e, t) {
          return e in t;
        }
        function zt(e, t) {
          var r = t[e];
          return void 0 === r ? null : r;
        }
        function Ct(e) {
          return { type: e };
        }
        function It(e) {
          return { result: "success", value: e };
        }
        function Pt(e) {
          return { result: "error", value: e };
        }
        function Rt(e) {
          return (
            "data-driven" === e["property-type"] ||
            "cross-faded-data-driven" === e["property-type"]
          );
        }
        function Nt(e) {
          return !!e.expression && e.expression.parameters.indexOf("zoom") > -1;
        }
        function qt(e) {
          return !!e.expression && e.expression.interpolated;
        }
        function Lt(e) {
          return e instanceof Number
            ? "number"
            : e instanceof String
            ? "string"
            : e instanceof Boolean
            ? "boolean"
            : Array.isArray(e)
            ? "array"
            : null === e
            ? "null"
            : typeof e;
        }
        function Ft(e) {
          return "object" == typeof e && null !== e && !Array.isArray(e);
        }
        function Dt(e) {
          return e;
        }
        function Bt(e, t) {
          var r,
            n,
            o,
            i = "color" === t.type,
            a = e.stops && "object" == typeof e.stops[0][0],
            s = a || void 0 !== e.property,
            l = a || !s,
            u = e.type || (qt(t) ? "exponential" : "interval");
          if (
            (i &&
              ((e = O({}, e)).stops &&
                (e.stops = e.stops.map(function (e) {
                  return [e[0], J.parse(e[1])];
                })),
              e.default
                ? (e.default = J.parse(e.default))
                : (e.default = J.parse(t.default))),
            e.colorSpace && "rgb" !== e.colorSpace && !lt[e.colorSpace])
          )
            throw new Error("Unknown color space: " + e.colorSpace);
          if ("exponential" === u) r = Vt;
          else if ("interval" === u) r = Wt;
          else if ("categorical" === u) {
            (r = Gt), (n = Object.create(null));
            for (var c = 0, p = e.stops; c < p.length; c += 1) {
              var h = p[c];
              n[h[0]] = h[1];
            }
            o = typeof e.stops[0][0];
          } else {
            if ("identity" !== u) throw new Error('Unknown function type "' + u + '"');
            r = Jt;
          }
          if (a) {
            for (var d = {}, f = [], y = 0; y < e.stops.length; y++) {
              var m = e.stops[y],
                g = m[0].zoom;
              void 0 === d[g] &&
                ((d[g] = {
                  zoom: g,
                  type: e.type,
                  property: e.property,
                  default: e.default,
                  stops: [],
                }),
                f.push(g)),
                d[g].stops.push([m[0].value, m[1]]);
            }
            for (var v = [], b = 0, w = f; b < w.length; b += 1) {
              var x = w[b];
              v.push([d[x].zoom, Bt(d[x], t)]);
            }
            var k = { name: "linear" };
            return {
              kind: "composite",
              interpolationType: k,
              interpolationFactor: ut.interpolationFactor.bind(void 0, k),
              zoomStops: v.map(function (e) {
                return e[0];
              }),
              evaluate: function (r, n) {
                var o = r.zoom;
                return Vt({ stops: v, base: e.base }, t, o).evaluate(o, n);
              },
            };
          }
          if (l) {
            var S =
              "exponential" === u
                ? { name: "exponential", base: void 0 !== e.base ? e.base : 1 }
                : null;
            return {
              kind: "camera",
              interpolationType: S,
              interpolationFactor: ut.interpolationFactor.bind(void 0, S),
              zoomStops: e.stops.map(function (e) {
                return e[0];
              }),
              evaluate: function (i) {
                var a = i.zoom;
                return r(e, t, a, n, o);
              },
            };
          }
          return {
            kind: "source",
            evaluate: function (i, a) {
              var s = a && a.properties ? a.properties[e.property] : void 0;
              return void 0 === s ? Ut(e.default, t.default) : r(e, t, s, n, o);
            },
          };
        }
        function Ut(e, t, r) {
          return void 0 !== e ? e : void 0 !== t ? t : void 0 !== r ? r : void 0;
        }
        function Gt(e, t, r, n, o) {
          return Ut(typeof r === o ? n[r] : void 0, e.default, t.default);
        }
        function Wt(e, t, r) {
          if ("number" !== Lt(r)) return Ut(e.default, t.default);
          var n = e.stops.length;
          if (1 === n) return e.stops[0][1];
          if (r <= e.stops[0][0]) return e.stops[0][1];
          if (r >= e.stops[n - 1][0]) return e.stops[n - 1][1];
          var o = De(
            e.stops.map(function (e) {
              return e[0];
            }),
            r
          );
          return e.stops[o][1];
        }
        function Vt(e, t, r) {
          var n = void 0 !== e.base ? e.base : 1;
          if ("number" !== Lt(r)) return Ut(e.default, t.default);
          var o = e.stops.length;
          if (1 === o) return e.stops[0][1];
          if (r <= e.stops[0][0]) return e.stops[0][1];
          if (r >= e.stops[o - 1][0]) return e.stops[o - 1][1];
          var i = De(
              e.stops.map(function (e) {
                return e[0];
              }),
              r
            ),
            a = (function (e, t, r, n) {
              var o = n - r,
                i = e - r;
              return 0 === o
                ? 0
                : 1 === t
                ? i / o
                : (Math.pow(t, i) - 1) / (Math.pow(t, o) - 1);
            })(r, n, e.stops[i][0], e.stops[i + 1][0]),
            s = e.stops[i][1],
            l = e.stops[i + 1][1],
            u = Ge[t.type] || Dt;
          if (e.colorSpace && "rgb" !== e.colorSpace) {
            var c = lt[e.colorSpace];
            u = function (e, t) {
              return c.reverse(c.interpolate(c.forward(e), c.forward(t), a));
            };
          }
          return "function" == typeof s.evaluate
            ? {
                evaluate: function () {
                  for (var e = arguments, t = [], r = arguments.length; r--; )
                    t[r] = e[r];
                  var n = s.evaluate.apply(void 0, t),
                    o = l.evaluate.apply(void 0, t);
                  if (void 0 !== n && void 0 !== o) return u(n, o, a);
                },
              }
            : u(s, l, a);
        }
        function Jt(e, t, r) {
          return (
            "color" === t.type
              ? (r = J.parse(r))
              : "formatted" === t.type
              ? (r = H.fromString(r.toString()))
              : "resolvedImage" === t.type
              ? (r = K.fromString(r.toString()))
              : Lt(r) === t.type || ("enum" === t.type && t.values[r]) || (r = void 0),
            Ut(r, e.default, t.default)
          );
        }
        pe.register(Ot, {
          error: [
            { kind: "error" },
            [I],
            function (e, t) {
              var r = t[0];
              throw new re(r.evaluate(e));
            },
          ],
          typeof: [
            I,
            [q],
            function (e, t) {
              return U(Q(t[0].evaluate(e)));
            },
          ],
          "to-rgba": [
            B(C, 4),
            [R],
            function (e, t) {
              return t[0].evaluate(e).toArray();
            },
          ],
          rgb: [R, [C, C, C], Et],
          rgba: [R, [C, C, C, C], Et],
          has: {
            type: P,
            overloads: [
              [
                [I],
                function (e, t) {
                  return Mt(t[0].evaluate(e), e.properties());
                },
              ],
              [
                [I, N],
                function (e, t) {
                  var r = t[0],
                    n = t[1];
                  return Mt(r.evaluate(e), n.evaluate(e));
                },
              ],
            ],
          },
          get: {
            type: q,
            overloads: [
              [
                [I],
                function (e, t) {
                  return zt(t[0].evaluate(e), e.properties());
                },
              ],
              [
                [I, N],
                function (e, t) {
                  var r = t[0],
                    n = t[1];
                  return zt(r.evaluate(e), n.evaluate(e));
                },
              ],
            ],
          },
          "feature-state": [
            q,
            [I],
            function (e, t) {
              return zt(t[0].evaluate(e), e.featureState || {});
            },
          ],
          properties: [
            N,
            [],
            function (e) {
              return e.properties();
            },
          ],
          "geometry-type": [
            I,
            [],
            function (e) {
              return e.geometryType();
            },
          ],
          id: [
            q,
            [],
            function (e) {
              return e.id();
            },
          ],
          zoom: [
            C,
            [],
            function (e) {
              return e.globals.zoom;
            },
          ],
          "heatmap-density": [
            C,
            [],
            function (e) {
              return e.globals.heatmapDensity || 0;
            },
          ],
          "line-progress": [
            C,
            [],
            function (e) {
              return e.globals.lineProgress || 0;
            },
          ],
          accumulated: [
            q,
            [],
            function (e) {
              return void 0 === e.globals.accumulated ? null : e.globals.accumulated;
            },
          ],
          "+": [
            C,
            Ct(C),
            function (e, t) {
              for (var r = 0, n = 0, o = t; n < o.length; n += 1) {
                r += o[n].evaluate(e);
              }
              return r;
            },
          ],
          "*": [
            C,
            Ct(C),
            function (e, t) {
              for (var r = 1, n = 0, o = t; n < o.length; n += 1) {
                r *= o[n].evaluate(e);
              }
              return r;
            },
          ],
          "-": {
            type: C,
            overloads: [
              [
                [C, C],
                function (e, t) {
                  var r = t[0],
                    n = t[1];
                  return r.evaluate(e) - n.evaluate(e);
                },
              ],
              [
                [C],
                function (e, t) {
                  return -t[0].evaluate(e);
                },
              ],
            ],
          },
          "/": [
            C,
            [C, C],
            function (e, t) {
              var r = t[0],
                n = t[1];
              return r.evaluate(e) / n.evaluate(e);
            },
          ],
          "%": [
            C,
            [C, C],
            function (e, t) {
              var r = t[0],
                n = t[1];
              return r.evaluate(e) % n.evaluate(e);
            },
          ],
          ln2: [
            C,
            [],
            function () {
              return Math.LN2;
            },
          ],
          pi: [
            C,
            [],
            function () {
              return Math.PI;
            },
          ],
          e: [
            C,
            [],
            function () {
              return Math.E;
            },
          ],
          "^": [
            C,
            [C, C],
            function (e, t) {
              var r = t[0],
                n = t[1];
              return Math.pow(r.evaluate(e), n.evaluate(e));
            },
          ],
          sqrt: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.sqrt(r.evaluate(e));
            },
          ],
          log10: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.log(r.evaluate(e)) / Math.LN10;
            },
          ],
          ln: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.log(r.evaluate(e));
            },
          ],
          log2: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.log(r.evaluate(e)) / Math.LN2;
            },
          ],
          sin: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.sin(r.evaluate(e));
            },
          ],
          cos: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.cos(r.evaluate(e));
            },
          ],
          tan: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.tan(r.evaluate(e));
            },
          ],
          asin: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.asin(r.evaluate(e));
            },
          ],
          acos: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.acos(r.evaluate(e));
            },
          ],
          atan: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.atan(r.evaluate(e));
            },
          ],
          min: [
            C,
            Ct(C),
            function (e, t) {
              return Math.min.apply(
                Math,
                t.map(function (t) {
                  return t.evaluate(e);
                })
              );
            },
          ],
          max: [
            C,
            Ct(C),
            function (e, t) {
              return Math.max.apply(
                Math,
                t.map(function (t) {
                  return t.evaluate(e);
                })
              );
            },
          ],
          abs: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.abs(r.evaluate(e));
            },
          ],
          round: [
            C,
            [C],
            function (e, t) {
              var r = t[0].evaluate(e);
              return r < 0 ? -Math.round(-r) : Math.round(r);
            },
          ],
          floor: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.floor(r.evaluate(e));
            },
          ],
          ceil: [
            C,
            [C],
            function (e, t) {
              var r = t[0];
              return Math.ceil(r.evaluate(e));
            },
          ],
          "filter-==": [
            P,
            [I, q],
            function (e, t) {
              var r = t[0],
                n = t[1];
              return e.properties()[r.value] === n.value;
            },
          ],
          "filter-id-==": [
            P,
            [q],
            function (e, t) {
              var r = t[0];
              return e.id() === r.value;
            },
          ],
          "filter-type-==": [
            P,
            [I],
            function (e, t) {
              var r = t[0];
              return e.geometryType() === r.value;
            },
          ],
          "filter-<": [
            P,
            [I, q],
            function (e, t) {
              var r = t[0],
                n = t[1],
                o = e.properties()[r.value],
                i = n.value;
              return typeof o == typeof i && o < i;
            },
          ],
          "filter-id-<": [
            P,
            [q],
            function (e, t) {
              var r = t[0],
                n = e.id(),
                o = r.value;
              return typeof n == typeof o && n < o;
            },
          ],
          "filter->": [
            P,
            [I, q],
            function (e, t) {
              var r = t[0],
                n = t[1],
                o = e.properties()[r.value],
                i = n.value;
              return typeof o == typeof i && o > i;
            },
          ],
          "filter-id->": [
            P,
            [q],
            function (e, t) {
              var r = t[0],
                n = e.id(),
                o = r.value;
              return typeof n == typeof o && n > o;
            },
          ],
          "filter-<=": [
            P,
            [I, q],
            function (e, t) {
              var r = t[0],
                n = t[1],
                o = e.properties()[r.value],
                i = n.value;
              return typeof o == typeof i && o <= i;
            },
          ],
          "filter-id-<=": [
            P,
            [q],
            function (e, t) {
              var r = t[0],
                n = e.id(),
                o = r.value;
              return typeof n == typeof o && n <= o;
            },
          ],
          "filter->=": [
            P,
            [I, q],
            function (e, t) {
              var r = t[0],
                n = t[1],
                o = e.properties()[r.value],
                i = n.value;
              return typeof o == typeof i && o >= i;
            },
          ],
          "filter-id->=": [
            P,
            [q],
            function (e, t) {
              var r = t[0],
                n = e.id(),
                o = r.value;
              return typeof n == typeof o && n >= o;
            },
          ],
          "filter-has": [
            P,
            [q],
            function (e, t) {
              return t[0].value in e.properties();
            },
          ],
          "filter-has-id": [
            P,
            [],
            function (e) {
              return null !== e.id() && void 0 !== e.id();
            },
          ],
          "filter-type-in": [
            P,
            [B(I)],
            function (e, t) {
              return t[0].value.indexOf(e.geometryType()) >= 0;
            },
          ],
          "filter-id-in": [
            P,
            [B(q)],
            function (e, t) {
              return t[0].value.indexOf(e.id()) >= 0;
            },
          ],
          "filter-in-small": [
            P,
            [I, B(q)],
            function (e, t) {
              var r = t[0];
              return t[1].value.indexOf(e.properties()[r.value]) >= 0;
            },
          ],
          "filter-in-large": [
            P,
            [I, B(q)],
            function (e, t) {
              var r = t[0],
                n = t[1];
              return (function (e, t, r, n) {
                for (; r <= n; ) {
                  var o = (r + n) >> 1;
                  if (t[o] === e) return !0;
                  t[o] > e ? (n = o - 1) : (r = o + 1);
                }
                return !1;
              })(e.properties()[r.value], n.value, 0, n.value.length - 1);
            },
          ],
          all: {
            type: P,
            overloads: [
              [
                [P, P],
                function (e, t) {
                  var r = t[0],
                    n = t[1];
                  return r.evaluate(e) && n.evaluate(e);
                },
              ],
              [
                Ct(P),
                function (e, t) {
                  for (var r = 0, n = t; r < n.length; r += 1) {
                    if (!n[r].evaluate(e)) return !1;
                  }
                  return !0;
                },
              ],
            ],
          },
          any: {
            type: P,
            overloads: [
              [
                [P, P],
                function (e, t) {
                  var r = t[0],
                    n = t[1];
                  return r.evaluate(e) || n.evaluate(e);
                },
              ],
              [
                Ct(P),
                function (e, t) {
                  for (var r = 0, n = t; r < n.length; r += 1) {
                    if (n[r].evaluate(e)) return !0;
                  }
                  return !1;
                },
              ],
            ],
          },
          "!": [
            P,
            [P],
            function (e, t) {
              return !t[0].evaluate(e);
            },
          ],
          "is-supported-script": [
            P,
            [I],
            function (e, t) {
              var r = t[0],
                n = e.globals && e.globals.isSupportedScript;
              return !n || n(r.evaluate(e));
            },
          ],
          upcase: [
            I,
            [I],
            function (e, t) {
              return t[0].evaluate(e).toUpperCase();
            },
          ],
          downcase: [
            I,
            [I],
            function (e, t) {
              return t[0].evaluate(e).toLowerCase();
            },
          ],
          concat: [
            I,
            Ct(q),
            function (e, t) {
              return t
                .map(function (t) {
                  return ee(t.evaluate(e));
                })
                .join("");
            },
          ],
          "resolved-locale": [
            I,
            [L],
            function (e, t) {
              return t[0].evaluate(e).resolvedLocale();
            },
          ],
        });
        var Yt = function (e, t) {
          var r;
          (this.expression = e),
            (this._warningHistory = {}),
            (this._evaluator = new ce()),
            (this._defaultValue = t
              ? "color" === (r = t).type && Ft(r.default)
                ? new J(0, 0, 0, 0)
                : "color" === r.type
                ? J.parse(r.default) || null
                : void 0 === r.default
                ? null
                : r.default
              : null),
            (this._enumValues = t && "enum" === t.type ? t.values : null);
        };
        function $t(e) {
          return (
            Array.isArray(e) && e.length > 0 && "string" == typeof e[0] && e[0] in Ot
          );
        }
        function Ht(e, t) {
          var r = new Fe(
              Ot,
              [],
              t
                ? (function (e) {
                    var t = {
                      color: R,
                      string: I,
                      number: C,
                      enum: I,
                      boolean: P,
                      formatted: F,
                      resolvedImage: D,
                    };
                    if ("array" === e.type) return B(t[e.value] || q, e.length);
                    return t[e.type];
                  })(t)
                : void 0
            ),
            n = r.parse(
              e,
              void 0,
              void 0,
              void 0,
              t && "string" === t.type ? { typeAnnotation: "coerce" } : void 0
            );
          return n ? It(new Yt(n, t)) : Pt(r.errors);
        }
        (Yt.prototype.evaluateWithoutErrorHandling = function (e, t, r, n, o, i) {
          return (
            (this._evaluator.globals = e),
            (this._evaluator.feature = t),
            (this._evaluator.featureState = r),
            (this._evaluator.canonical = n),
            (this._evaluator.availableImages = o || null),
            (this._evaluator.formattedSection = i),
            this.expression.evaluate(this._evaluator)
          );
        }),
          (Yt.prototype.evaluate = function (e, t, r, n, o, i) {
            (this._evaluator.globals = e),
              (this._evaluator.feature = t || null),
              (this._evaluator.featureState = r || null),
              (this._evaluator.canonical = n),
              (this._evaluator.availableImages = o || null),
              (this._evaluator.formattedSection = i || null);
            try {
              var a = this.expression.evaluate(this._evaluator);
              if (null == a || ("number" == typeof a && a != a))
                return this._defaultValue;
              if (this._enumValues && !(a in this._enumValues))
                throw new re(
                  "Expected value to be one of " +
                    Object.keys(this._enumValues)
                      .map(function (e) {
                        return JSON.stringify(e);
                      })
                      .join(", ") +
                    ", but found " +
                    JSON.stringify(a) +
                    " instead."
                );
              return a;
            } catch (e) {
              return (
                this._warningHistory[e.message] ||
                  ((this._warningHistory[e.message] = !0),
                  "undefined" != typeof console && console.warn(e.message)),
                this._defaultValue
              );
            }
          });
        var Kt = function (e, t) {
          (this.kind = e),
            (this._styleExpression = t),
            (this.isStateDependent = "constant" !== e && !Ne(t.expression));
        };
        (Kt.prototype.evaluateWithoutErrorHandling = function (e, t, r, n, o, i) {
          return this._styleExpression.evaluateWithoutErrorHandling(e, t, r, n, o, i);
        }),
          (Kt.prototype.evaluate = function (e, t, r, n, o, i) {
            return this._styleExpression.evaluate(e, t, r, n, o, i);
          });
        var Xt = function (e, t, r, n) {
          (this.kind = e),
            (this.zoomStops = r),
            (this._styleExpression = t),
            (this.isStateDependent = "camera" !== e && !Ne(t.expression)),
            (this.interpolationType = n);
        };
        function Zt(e, t) {
          if ("error" === (e = Ht(e, t)).result) return e;
          var r = e.value.expression,
            n = Re(r);
          if (!n && !Rt(t)) return Pt([new E("", "data expressions not supported")]);
          var o = qe(r, ["zoom"]);
          if (!o && !Nt(t)) return Pt([new E("", "zoom expressions not supported")]);
          var i = (function e(t) {
            var r = null;
            if (t instanceof ht) r = e(t.result);
            else if (t instanceof pt)
              for (var n = 0, o = t.args; n < o.length; n += 1) {
                var i = o[n];
                if ((r = e(i))) break;
              }
            else
              (t instanceof Be || t instanceof ut) &&
                t.input instanceof pe &&
                "zoom" === t.input.name &&
                (r = t);
            if (r instanceof E) return r;
            return (
              t.eachChild(function (t) {
                var n = e(t);
                n instanceof E
                  ? (r = n)
                  : !r && n
                  ? (r = new E(
                      "",
                      '"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.'
                    ))
                  : r &&
                    n &&
                    r !== n &&
                    (r = new E(
                      "",
                      'Only one zoom-based "step" or "interpolate" subexpression may be used in an expression.'
                    ));
              }),
              r
            );
          })(r);
          if (!i && !o)
            return Pt([
              new E(
                "",
                '"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.'
              ),
            ]);
          if (i instanceof E) return Pt([i]);
          if (i instanceof ut && !qt(t))
            return Pt([
              new E("", '"interpolate" expressions cannot be used with this property'),
            ]);
          if (!i) return It(new Kt(n ? "constant" : "source", e.value));
          var a = i instanceof ut ? i.interpolation : void 0;
          return It(new Xt(n ? "camera" : "composite", e.value, i.labels, a));
        }
        (Xt.prototype.evaluateWithoutErrorHandling = function (e, t, r, n, o, i) {
          return this._styleExpression.evaluateWithoutErrorHandling(e, t, r, n, o, i);
        }),
          (Xt.prototype.evaluate = function (e, t, r, n, o, i) {
            return this._styleExpression.evaluate(e, t, r, n, o, i);
          }),
          (Xt.prototype.interpolationFactor = function (e, t, r) {
            return this.interpolationType
              ? ut.interpolationFactor(this.interpolationType, e, t, r)
              : 0;
          });
        var Qt = function (e, t) {
          (this._parameters = e),
            (this._specification = t),
            O(this, Bt(this._parameters, this._specification));
        };
        function er(e) {
          return "object" == typeof e ? ["literal", e] : e;
        }
        function tr(e, t) {
          var r = e.stops;
          if (!r)
            return (function (e, t) {
              var r = ["get", e.property];
              if (void 0 === e.default) return "string" === t.type ? ["string", r] : r;
              if ("enum" === t.type)
                return ["match", r, Object.keys(t.values), r, e.default];
              var n = ["color" === t.type ? "to-color" : t.type, r, er(e.default)];
              return "array" === t.type && n.splice(1, 0, t.value, t.length || null), n;
            })(e, t);
          var n = r && "object" == typeof r[0][0],
            o = n || void 0 !== e.property,
            i = n || !o;
          return (
            (r = r.map(function (e) {
              return !o && t.tokens && "string" == typeof e[1]
                ? [e[0], lr(e[1])]
                : [e[0], er(e[1])];
            })),
            n
              ? (function (e, t, r) {
                  for (var n = {}, o = {}, i = [], a = 0; a < r.length; a++) {
                    var s = r[a],
                      l = s[0].zoom;
                    void 0 === n[l] &&
                      ((n[l] = {
                        zoom: l,
                        type: e.type,
                        property: e.property,
                        default: e.default,
                      }),
                      (o[l] = []),
                      i.push(l)),
                      o[l].push([s[0].value, s[1]]);
                  }
                  if ("exponential" === sr({}, t)) {
                    for (
                      var u = [rr(e), ["linear"], ["zoom"]], c = 0, p = i;
                      c < p.length;
                      c += 1
                    ) {
                      var h = p[c],
                        d = or(n[h], t, o[h]);
                      ar(u, h, d, !1);
                    }
                    return u;
                  }
                  for (var f = ["step", ["zoom"]], y = 0, m = i; y < m.length; y += 1) {
                    var g = m[y],
                      v = or(n[g], t, o[g]);
                    ar(f, g, v, !0);
                  }
                  return ir(f), f;
                })(e, t, r)
              : i
              ? (function (e, t, r, n) {
                  void 0 === n && (n = ["zoom"]);
                  var o,
                    i = sr(e, t),
                    a = !1;
                  if ("interval" === i) (o = ["step", n]), (a = !0);
                  else {
                    if ("exponential" !== i)
                      throw new Error('Unknown zoom function type "' + i + '"');
                    var s = void 0 !== e.base ? e.base : 1;
                    o = [rr(e), 1 === s ? ["linear"] : ["exponential", s], n];
                  }
                  for (var l = 0, u = r; l < u.length; l += 1) {
                    var c = u[l];
                    ar(o, c[0], c[1], a);
                  }
                  return ir(o), o;
                })(e, t, r)
              : or(e, t, r)
          );
        }
        function rr(e) {
          switch (e.colorSpace) {
            case "hcl":
              return "interpolate-hcl";
            case "lab":
              return "interpolate-lab";
            default:
              return "interpolate";
          }
        }
        function nr(e, t) {
          return void 0 !== e ? e : void 0 !== t ? t : void 0;
        }
        function or(e, t, r) {
          var n = sr(e, t),
            o = ["get", e.property];
          if ("categorical" === n && "boolean" == typeof r[0][0]) {
            for (var i = ["case"], a = 0, s = r; a < s.length; a += 1) {
              var l = s[a];
              i.push(["==", o, l[0]], l[1]);
            }
            return i.push(er(nr(e.default, t.default))), i;
          }
          if ("categorical" === n) {
            for (var u = ["match", o], c = 0, p = r; c < p.length; c += 1) {
              var h = p[c];
              ar(u, h[0], h[1], !1);
            }
            return u.push(er(nr(e.default, t.default))), u;
          }
          if ("interval" === n) {
            for (var d = ["step", ["number", o]], f = 0, y = r; f < y.length; f += 1) {
              var m = y[f];
              ar(d, m[0], m[1], !0);
            }
            return (
              ir(d),
              void 0 === e.default
                ? d
                : ["case", ["==", ["typeof", o], "number"], d, er(e.default)]
            );
          }
          if ("exponential" === n) {
            for (
              var g = void 0 !== e.base ? e.base : 1,
                v = [rr(e), 1 === g ? ["linear"] : ["exponential", g], ["number", o]],
                b = 0,
                w = r;
              b < w.length;
              b += 1
            ) {
              var x = w[b];
              ar(v, x[0], x[1], !1);
            }
            return void 0 === e.default
              ? v
              : ["case", ["==", ["typeof", o], "number"], v, er(e.default)];
          }
          throw new Error("Unknown property function type " + n);
        }
        function ir(e) {
          "step" === e[0] && 3 === e.length && (e.push(0), e.push(e[3]));
        }
        function ar(e, t, r, n) {
          (e.length > 3 && t === e[e.length - 2]) ||
            ((n && 2 === e.length) || e.push(t), e.push(r));
        }
        function sr(e, t) {
          return e.type ? e.type : t.expression.interpolated ? "exponential" : "interval";
        }
        function lr(e) {
          for (
            var t = ["concat"], r = /{([^{}]+)}/g, n = 0, o = r.exec(e);
            null !== o;
            o = r.exec(e)
          ) {
            var i = e.slice(n, r.lastIndex - o[0].length);
            (n = r.lastIndex), i.length > 0 && t.push(i), t.push(["get", o[1]]);
          }
          if (1 === t.length) return e;
          if (n < e.length) t.push(e.slice(n));
          else if (2 === t.length) return ["to-string", t[1]];
          return t;
        }
        function ur(e) {
          if (!0 === e || !1 === e) return !0;
          if (!Array.isArray(e) || 0 === e.length) return !1;
          switch (e[0]) {
            case "has":
              return e.length >= 2 && "$id" !== e[1] && "$type" !== e[1];
            case "in":
              return e.length >= 3 && ("string" != typeof e[1] || Array.isArray(e[2]));
            case "!in":
            case "!has":
            case "none":
              return !1;
            case "==":
            case "!=":
            case ">":
            case ">=":
            case "<":
            case "<=":
              return 3 !== e.length || Array.isArray(e[1]) || Array.isArray(e[2]);
            case "any":
            case "all":
              for (var t = 0, r = e.slice(1); t < r.length; t += 1) {
                var n = r[t];
                if (!ur(n) && "boolean" != typeof n) return !1;
              }
              return !0;
            default:
              return !0;
          }
        }
        (Qt.deserialize = function (e) {
          return new Qt(e._parameters, e._specification);
        }),
          (Qt.serialize = function (e) {
            return { _parameters: e._parameters, _specification: e._specification };
          });
        var cr = {
          type: "boolean",
          default: !1,
          transition: !1,
          "property-type": "data-driven",
          expression: { interpolated: !1, parameters: ["zoom", "feature"] },
        };
        function pr(e) {
          if (null == e)
            return {
              filter: function () {
                return !0;
              },
              needGeometry: !1,
            };
          ur(e) || (e = dr(e));
          var t = Ht(e, cr);
          if ("error" === t.result)
            throw new Error(
              t.value
                .map(function (e) {
                  return e.key + ": " + e.message;
                })
                .join(", ")
            );
          return {
            filter: function (e, r, n) {
              return t.value.evaluate(e, r, {}, n);
            },
            needGeometry: Array.isArray(e) && 0 !== e.length && "within" === e[0],
          };
        }
        function hr(e, t) {
          return e < t ? -1 : e > t ? 1 : 0;
        }
        function dr(e) {
          if (!e) return !0;
          var t,
            r = e[0];
          return e.length <= 1
            ? "any" !== r
            : "==" === r
            ? fr(e[1], e[2], "==")
            : "!=" === r
            ? gr(fr(e[1], e[2], "=="))
            : "<" === r || ">" === r || "<=" === r || ">=" === r
            ? fr(e[1], e[2], r)
            : "any" === r
            ? ((t = e.slice(1)), ["any"].concat(t.map(dr)))
            : "all" === r
            ? ["all"].concat(e.slice(1).map(dr))
            : "none" === r
            ? ["all"].concat(e.slice(1).map(dr).map(gr))
            : "in" === r
            ? yr(e[1], e.slice(2))
            : "!in" === r
            ? gr(yr(e[1], e.slice(2)))
            : "has" === r
            ? mr(e[1])
            : "!has" !== r || gr(mr(e[1]));
        }
        function fr(e, t, r) {
          switch (e) {
            case "$type":
              return ["filter-type-" + r, t];
            case "$id":
              return ["filter-id-" + r, t];
            default:
              return ["filter-" + r, e, t];
          }
        }
        function yr(e, t) {
          if (0 === t.length) return !1;
          switch (e) {
            case "$type":
              return ["filter-type-in", ["literal", t]];
            case "$id":
              return ["filter-id-in", ["literal", t]];
            default:
              return t.length > 200 &&
                !t.some(function (e) {
                  return typeof e != typeof t[0];
                })
                ? ["filter-in-large", e, ["literal", t.sort(hr)]]
                : ["filter-in-small", e, ["literal", t]];
          }
        }
        function mr(e) {
          switch (e) {
            case "$type":
              return !0;
            case "$id":
              return ["filter-has-id"];
            default:
              return ["filter-has", e];
          }
        }
        function gr(e) {
          return ["!", e];
        }
        var vr = [
          "type",
          "source",
          "source-layer",
          "minzoom",
          "maxzoom",
          "filter",
          "layout",
        ];
        function br(e, t) {
          var r = {};
          for (var n in e) "ref" !== n && (r[n] = e[n]);
          return (
            vr.forEach(function (e) {
              e in t && (r[e] = t[e]);
            }),
            r
          );
        }
        function wr(e) {
          e = e.slice();
          for (var t = Object.create(null), r = 0; r < e.length; r++) t[e[r].id] = e[r];
          for (var n = 0; n < e.length; n++)
            "ref" in e[n] && (e[n] = br(e[n], t[e[n].ref]));
          return e;
        }
        var xr = function (e, t, r, n) {
            (this.message = (e ? e + ": " : "") + r),
              n && (this.identifier = n),
              null != t && t.__line__ && (this.line = t.__line__);
          },
          kr = function (e) {
            (this.error = e), (this.message = e.message);
            var t = e.message.match(/line (\d+)/);
            this.line = t ? parseInt(t[1], 10) : 0;
          };
        function Sr(e) {
          var t = e.key,
            r = e.value;
          return r ? [new xr(t, r, "constants have been deprecated as of v8")] : [];
        }
        function _r(e) {
          return e instanceof Number || e instanceof String || e instanceof Boolean
            ? e.valueOf()
            : e;
        }
        function jr(e) {
          if (Array.isArray(e)) return e.map(jr);
          if (
            e instanceof Object &&
            !(e instanceof Number || e instanceof String || e instanceof Boolean)
          ) {
            var t = {};
            for (var r in e) t[r] = jr(e[r]);
            return t;
          }
          return _r(e);
        }
        function Tr(e) {
          var t = e.key,
            r = e.value,
            n = e.valueSpec || {},
            o = e.objectElementValidators || {},
            i = e.style,
            a = e.styleSpec,
            s = [],
            l = Lt(r);
          if ("object" !== l) return [new xr(t, r, "object expected, " + l + " found")];
          for (var u in r) {
            var c = u.split(".")[0],
              p = n[c] || n["*"],
              h = void 0;
            if (o[c]) h = o[c];
            else if (n[c]) h = Ur;
            else if (o["*"]) h = o["*"];
            else {
              if (!n["*"]) {
                s.push(new xr(t, r[u], 'unknown property "' + u + '"'));
                continue;
              }
              h = Ur;
            }
            s = s.concat(
              h(
                {
                  key: (t ? t + "." : t) + u,
                  value: r[u],
                  valueSpec: p,
                  style: i,
                  styleSpec: a,
                  object: r,
                  objectKey: u,
                },
                r
              )
            );
          }
          for (var d in n)
            o[d] ||
              (n[d].required &&
                void 0 === n[d].default &&
                void 0 === r[d] &&
                s.push(new xr(t, r, 'missing required property "' + d + '"')));
          return s;
        }
        function Ar(e) {
          var t = e.value,
            r = e.valueSpec,
            n = e.style,
            o = e.styleSpec,
            i = e.key,
            a = e.arrayElementValidator || Ur;
          if ("array" !== Lt(t))
            return [new xr(i, t, "array expected, " + Lt(t) + " found")];
          if (r.length && t.length !== r.length)
            return [
              new xr(
                i,
                t,
                "array length " + r.length + " expected, length " + t.length + " found"
              ),
            ];
          if (r["min-length"] && t.length < r["min-length"])
            return [
              new xr(
                i,
                t,
                "array length at least " +
                  r["min-length"] +
                  " expected, length " +
                  t.length +
                  " found"
              ),
            ];
          var s = { type: r.value, values: r.values };
          o.$version < 7 && (s.function = r.function),
            "object" === Lt(r.value) && (s = r.value);
          for (var l = [], u = 0; u < t.length; u++)
            l = l.concat(
              a({
                array: t,
                arrayIndex: u,
                value: t[u],
                valueSpec: s,
                style: n,
                styleSpec: o,
                key: i + "[" + u + "]",
              })
            );
          return l;
        }
        function Or(e) {
          var t = e.key,
            r = e.value,
            n = e.valueSpec,
            o = Lt(r);
          return (
            "number" === o && r != r && (o = "NaN"),
            "number" !== o
              ? [new xr(t, r, "number expected, " + o + " found")]
              : "minimum" in n && r < n.minimum
              ? [new xr(t, r, r + " is less than the minimum value " + n.minimum)]
              : "maximum" in n && r > n.maximum
              ? [new xr(t, r, r + " is greater than the maximum value " + n.maximum)]
              : []
          );
        }
        function Er(e) {
          var t,
            r,
            n,
            o = e.valueSpec,
            i = _r(e.value.type),
            a = {},
            s = "categorical" !== i && void 0 === e.value.property,
            l = !s,
            u =
              "array" === Lt(e.value.stops) &&
              "array" === Lt(e.value.stops[0]) &&
              "object" === Lt(e.value.stops[0][0]),
            c = Tr({
              key: e.key,
              value: e.value,
              valueSpec: e.styleSpec.function,
              style: e.style,
              styleSpec: e.styleSpec,
              objectElementValidators: {
                stops: function (e) {
                  if ("identity" === i)
                    return [
                      new xr(
                        e.key,
                        e.value,
                        'identity function may not have a "stops" property'
                      ),
                    ];
                  var t = [],
                    r = e.value;
                  (t = t.concat(
                    Ar({
                      key: e.key,
                      value: r,
                      valueSpec: e.valueSpec,
                      style: e.style,
                      styleSpec: e.styleSpec,
                      arrayElementValidator: p,
                    })
                  )),
                    "array" === Lt(r) &&
                      0 === r.length &&
                      t.push(new xr(e.key, r, "array must have at least one stop"));
                  return t;
                },
                default: function (e) {
                  return Ur({
                    key: e.key,
                    value: e.value,
                    valueSpec: o,
                    style: e.style,
                    styleSpec: e.styleSpec,
                  });
                },
              },
            });
          return (
            "identity" === i &&
              s &&
              c.push(new xr(e.key, e.value, 'missing required property "property"')),
            "identity" === i ||
              e.value.stops ||
              c.push(new xr(e.key, e.value, 'missing required property "stops"')),
            "exponential" === i &&
              e.valueSpec.expression &&
              !qt(e.valueSpec) &&
              c.push(new xr(e.key, e.value, "exponential functions not supported")),
            e.styleSpec.$version >= 8 &&
              (l && !Rt(e.valueSpec)
                ? c.push(new xr(e.key, e.value, "property functions not supported"))
                : s &&
                  !Nt(e.valueSpec) &&
                  c.push(new xr(e.key, e.value, "zoom functions not supported"))),
            ("categorical" !== i && !u) ||
              void 0 !== e.value.property ||
              c.push(new xr(e.key, e.value, '"property" property is required')),
            c
          );
          function p(e) {
            var t = [],
              i = e.value,
              s = e.key;
            if ("array" !== Lt(i))
              return [new xr(s, i, "array expected, " + Lt(i) + " found")];
            if (2 !== i.length)
              return [
                new xr(s, i, "array length 2 expected, length " + i.length + " found"),
              ];
            if (u) {
              if ("object" !== Lt(i[0]))
                return [new xr(s, i, "object expected, " + Lt(i[0]) + " found")];
              if (void 0 === i[0].zoom)
                return [new xr(s, i, "object stop key must have zoom")];
              if (void 0 === i[0].value)
                return [new xr(s, i, "object stop key must have value")];
              if (n && n > _r(i[0].zoom))
                return [
                  new xr(s, i[0].zoom, "stop zoom values must appear in ascending order"),
                ];
              _r(i[0].zoom) !== n && ((n = _r(i[0].zoom)), (r = void 0), (a = {})),
                (t = t.concat(
                  Tr({
                    key: s + "[0]",
                    value: i[0],
                    valueSpec: { zoom: {} },
                    style: e.style,
                    styleSpec: e.styleSpec,
                    objectElementValidators: { zoom: Or, value: h },
                  })
                ));
            } else
              t = t.concat(
                h(
                  {
                    key: s + "[0]",
                    value: i[0],
                    valueSpec: {},
                    style: e.style,
                    styleSpec: e.styleSpec,
                  },
                  i
                )
              );
            return $t(jr(i[1]))
              ? t.concat([
                  new xr(
                    s + "[1]",
                    i[1],
                    "expressions are not allowed in function stops."
                  ),
                ])
              : t.concat(
                  Ur({
                    key: s + "[1]",
                    value: i[1],
                    valueSpec: o,
                    style: e.style,
                    styleSpec: e.styleSpec,
                  })
                );
          }
          function h(e, n) {
            var s = Lt(e.value),
              l = _r(e.value),
              u = null !== e.value ? e.value : n;
            if (t) {
              if (s !== t)
                return [
                  new xr(
                    e.key,
                    u,
                    s + " stop domain type must match previous stop domain type " + t
                  ),
                ];
            } else t = s;
            if ("number" !== s && "string" !== s && "boolean" !== s)
              return [
                new xr(
                  e.key,
                  u,
                  "stop domain value must be a number, string, or boolean"
                ),
              ];
            if ("number" !== s && "categorical" !== i) {
              var c = "number expected, " + s + " found";
              return (
                Rt(o) &&
                  void 0 === i &&
                  (c +=
                    '\nIf you intended to use a categorical function, specify `"type": "categorical"`.'),
                [new xr(e.key, u, c)]
              );
            }
            return "categorical" !== i ||
              "number" !== s ||
              (isFinite(l) && Math.floor(l) === l)
              ? "categorical" !== i && "number" === s && void 0 !== r && l < r
                ? [new xr(e.key, u, "stop domain values must appear in ascending order")]
                : ((r = l),
                  "categorical" === i && l in a
                    ? [new xr(e.key, u, "stop domain values must be unique")]
                    : ((a[l] = !0), []))
              : [new xr(e.key, u, "integer expected, found " + l)];
          }
        }
        function Mr(e) {
          var t = ("property" === e.expressionContext ? Zt : Ht)(
            jr(e.value),
            e.valueSpec
          );
          if ("error" === t.result)
            return t.value.map(function (t) {
              return new xr("" + e.key + t.key, e.value, t.message);
            });
          var r = t.value.expression || t.value._styleExpression.expression;
          if (
            "property" === e.expressionContext &&
            "text-font" === e.propertyKey &&
            !r.outputDefined()
          )
            return [
              new xr(
                e.key,
                e.value,
                'Invalid data expression for "' +
                  e.propertyKey +
                  '". Output values must be contained as literals within the expression.'
              ),
            ];
          if ("property" === e.expressionContext && "layout" === e.propertyType && !Ne(r))
            return [
              new xr(
                e.key,
                e.value,
                '"feature-state" data expressions are not supported with layout properties.'
              ),
            ];
          if ("filter" === e.expressionContext && !Ne(r))
            return [
              new xr(
                e.key,
                e.value,
                '"feature-state" data expressions are not supported with filters.'
              ),
            ];
          if (e.expressionContext && 0 === e.expressionContext.indexOf("cluster")) {
            if (!qe(r, ["zoom", "feature-state"]))
              return [
                new xr(
                  e.key,
                  e.value,
                  '"zoom" and "feature-state" expressions are not supported with cluster properties.'
                ),
              ];
            if ("cluster-initial" === e.expressionContext && !Re(r))
              return [
                new xr(
                  e.key,
                  e.value,
                  "Feature data expressions are not supported with initial expression part of cluster properties."
                ),
              ];
          }
          return [];
        }
        function zr(e) {
          var t = e.key,
            r = e.value,
            n = e.valueSpec,
            o = [];
          return (
            Array.isArray(n.values)
              ? -1 === n.values.indexOf(_r(r)) &&
                o.push(
                  new xr(
                    t,
                    r,
                    "expected one of [" +
                      n.values.join(", ") +
                      "], " +
                      JSON.stringify(r) +
                      " found"
                  )
                )
              : -1 === Object.keys(n.values).indexOf(_r(r)) &&
                o.push(
                  new xr(
                    t,
                    r,
                    "expected one of [" +
                      Object.keys(n.values).join(", ") +
                      "], " +
                      JSON.stringify(r) +
                      " found"
                  )
                ),
            o
          );
        }
        function Cr(e) {
          return ur(jr(e.value))
            ? Mr(
                O({}, e, {
                  expressionContext: "filter",
                  valueSpec: { value: "boolean" },
                })
              )
            : (function e(t) {
                var r = t.value,
                  n = t.key;
                if ("array" !== Lt(r))
                  return [new xr(n, r, "array expected, " + Lt(r) + " found")];
                var o,
                  i = t.styleSpec,
                  a = [];
                if (r.length < 1)
                  return [new xr(n, r, "filter array must have at least 1 element")];
                switch (
                  ((a = a.concat(
                    zr({
                      key: n + "[0]",
                      value: r[0],
                      valueSpec: i.filter_operator,
                      style: t.style,
                      styleSpec: t.styleSpec,
                    })
                  )),
                  _r(r[0]))
                ) {
                  case "<":
                  case "<=":
                  case ">":
                  case ">=":
                    r.length >= 2 &&
                      "$type" === _r(r[1]) &&
                      a.push(
                        new xr(n, r, '"$type" cannot be use with operator "' + r[0] + '"')
                      );
                  case "==":
                  case "!=":
                    3 !== r.length &&
                      a.push(
                        new xr(
                          n,
                          r,
                          'filter array for operator "' + r[0] + '" must have 3 elements'
                        )
                      );
                  case "in":
                  case "!in":
                    r.length >= 2 &&
                      "string" !== (o = Lt(r[1])) &&
                      a.push(new xr(n + "[1]", r[1], "string expected, " + o + " found"));
                    for (var s = 2; s < r.length; s++)
                      (o = Lt(r[s])),
                        "$type" === _r(r[1])
                          ? (a = a.concat(
                              zr({
                                key: n + "[" + s + "]",
                                value: r[s],
                                valueSpec: i.geometry_type,
                                style: t.style,
                                styleSpec: t.styleSpec,
                              })
                            ))
                          : "string" !== o &&
                            "number" !== o &&
                            "boolean" !== o &&
                            a.push(
                              new xr(
                                n + "[" + s + "]",
                                r[s],
                                "string, number, or boolean expected, " + o + " found"
                              )
                            );
                    break;
                  case "any":
                  case "all":
                  case "none":
                    for (var l = 1; l < r.length; l++)
                      a = a.concat(
                        e({
                          key: n + "[" + l + "]",
                          value: r[l],
                          style: t.style,
                          styleSpec: t.styleSpec,
                        })
                      );
                    break;
                  case "has":
                  case "!has":
                    (o = Lt(r[1])),
                      2 !== r.length
                        ? a.push(
                            new xr(
                              n,
                              r,
                              'filter array for "' +
                                r[0] +
                                '" operator must have 2 elements'
                            )
                          )
                        : "string" !== o &&
                          a.push(
                            new xr(n + "[1]", r[1], "string expected, " + o + " found")
                          );
                }
                return a;
              })(e);
        }
        function Ir(e, t) {
          var r = e.key,
            n = e.style,
            o = e.styleSpec,
            i = e.value,
            a = e.objectKey,
            s = o[t + "_" + e.layerType];
          if (!s) return [];
          var l = a.match(/^(.*)-transition$/);
          if ("paint" === t && l && s[l[1]] && s[l[1]].transition)
            return Ur({
              key: r,
              value: i,
              valueSpec: o.transition,
              style: n,
              styleSpec: o,
            });
          var u,
            c = e.valueSpec || s[a];
          if (!c) return [new xr(r, i, 'unknown property "' + a + '"')];
          if ("string" === Lt(i) && Rt(c) && !c.tokens && (u = /^{([^}]+)}$/.exec(i)))
            return [
              new xr(
                r,
                i,
                '"' +
                  a +
                  '" does not support interpolation syntax\nUse an identity property function instead: `{ "type": "identity", "property": ' +
                  JSON.stringify(u[1]) +
                  " }`."
              ),
            ];
          var p = [];
          return (
            "symbol" === e.layerType &&
              ("text-field" === a &&
                n &&
                !n.glyphs &&
                p.push(
                  new xr(r, i, 'use of "text-field" requires a style "glyphs" property')
                ),
              "text-font" === a &&
                Ft(jr(i)) &&
                "identity" === _r(i.type) &&
                p.push(new xr(r, i, '"text-font" does not support identity functions'))),
            p.concat(
              Ur({
                key: e.key,
                value: i,
                valueSpec: c,
                style: n,
                styleSpec: o,
                expressionContext: "property",
                propertyType: t,
                propertyKey: a,
              })
            )
          );
        }
        function Pr(e) {
          return Ir(e, "paint");
        }
        function Rr(e) {
          return Ir(e, "layout");
        }
        function Nr(e) {
          var t = [],
            r = e.value,
            n = e.key,
            o = e.style,
            i = e.styleSpec;
          r.type || r.ref || t.push(new xr(n, r, 'either "type" or "ref" is required'));
          var a,
            s = _r(r.type),
            l = _r(r.ref);
          if (r.id)
            for (var u = _r(r.id), c = 0; c < e.arrayIndex; c++) {
              var p = o.layers[c];
              _r(p.id) === u &&
                t.push(
                  new xr(
                    n,
                    r.id,
                    'duplicate layer id "' +
                      r.id +
                      '", previously used at line ' +
                      p.id.__line__
                  )
                );
            }
          if ("ref" in r)
            ["type", "source", "source-layer", "filter", "layout"].forEach(function (e) {
              e in r &&
                t.push(new xr(n, r[e], '"' + e + '" is prohibited for ref layers'));
            }),
              o.layers.forEach(function (e) {
                _r(e.id) === l && (a = e);
              }),
              a
                ? a.ref
                  ? t.push(new xr(n, r.ref, "ref cannot reference another ref layer"))
                  : (s = _r(a.type))
                : t.push(new xr(n, r.ref, 'ref layer "' + l + '" not found'));
          else if ("background" !== s)
            if (r.source) {
              var h = o.sources && o.sources[r.source],
                d = h && _r(h.type);
              h
                ? "vector" === d && "raster" === s
                  ? t.push(
                      new xr(n, r.source, 'layer "' + r.id + '" requires a raster source')
                    )
                  : "raster" === d && "raster" !== s
                  ? t.push(
                      new xr(n, r.source, 'layer "' + r.id + '" requires a vector source')
                    )
                  : "vector" !== d || r["source-layer"]
                  ? "raster-dem" === d && "hillshade" !== s
                    ? t.push(
                        new xr(
                          n,
                          r.source,
                          "raster-dem source can only be used with layer type 'hillshade'."
                        )
                      )
                    : "line" !== s ||
                      !r.paint ||
                      !r.paint["line-gradient"] ||
                      ("geojson" === d && h.lineMetrics) ||
                      t.push(
                        new xr(
                          n,
                          r,
                          'layer "' +
                            r.id +
                            '" specifies a line-gradient, which requires a GeoJSON source with `lineMetrics` enabled.'
                        )
                      )
                  : t.push(
                      new xr(n, r, 'layer "' + r.id + '" must specify a "source-layer"')
                    )
                : t.push(new xr(n, r.source, 'source "' + r.source + '" not found'));
            } else t.push(new xr(n, r, 'missing required property "source"'));
          return (t = t.concat(
            Tr({
              key: n,
              value: r,
              valueSpec: i.layer,
              style: e.style,
              styleSpec: e.styleSpec,
              objectElementValidators: {
                "*": function () {
                  return [];
                },
                type: function () {
                  return Ur({
                    key: n + ".type",
                    value: r.type,
                    valueSpec: i.layer.type,
                    style: e.style,
                    styleSpec: e.styleSpec,
                    object: r,
                    objectKey: "type",
                  });
                },
                filter: Cr,
                layout: function (e) {
                  return Tr({
                    layer: r,
                    key: e.key,
                    value: e.value,
                    style: e.style,
                    styleSpec: e.styleSpec,
                    objectElementValidators: {
                      "*": function (e) {
                        return Rr(O({ layerType: s }, e));
                      },
                    },
                  });
                },
                paint: function (e) {
                  return Tr({
                    layer: r,
                    key: e.key,
                    value: e.value,
                    style: e.style,
                    styleSpec: e.styleSpec,
                    objectElementValidators: {
                      "*": function (e) {
                        return Pr(O({ layerType: s }, e));
                      },
                    },
                  });
                },
              },
            })
          ));
        }
        function qr(e) {
          var t = e.value,
            r = e.key,
            n = Lt(t);
          return "string" !== n ? [new xr(r, t, "string expected, " + n + " found")] : [];
        }
        var Lr = {
          promoteId: function (e) {
            var t = e.key,
              r = e.value;
            if ("string" === Lt(r)) return qr({ key: t, value: r });
            var n = [];
            for (var o in r) n.push.apply(n, qr({ key: t + "." + o, value: r[o] }));
            return n;
          },
        };
        function Fr(e) {
          var t = e.value,
            r = e.key,
            n = e.styleSpec,
            o = e.style;
          if (!t.type) return [new xr(r, t, '"type" is required')];
          var i,
            a = _r(t.type);
          switch (a) {
            case "vector":
            case "raster":
            case "raster-dem":
              return (i = Tr({
                key: r,
                value: t,
                valueSpec: n["source_" + a.replace("-", "_")],
                style: e.style,
                styleSpec: n,
                objectElementValidators: Lr,
              }));
            case "geojson":
              if (
                ((i = Tr({
                  key: r,
                  value: t,
                  valueSpec: n.source_geojson,
                  style: o,
                  styleSpec: n,
                  objectElementValidators: Lr,
                })),
                t.cluster)
              )
                for (var s in t.clusterProperties) {
                  var l = t.clusterProperties[s],
                    u = l[0],
                    c = l[1],
                    p = "string" == typeof u ? [u, ["accumulated"], ["get", s]] : u;
                  i.push.apply(
                    i,
                    Mr({
                      key: r + "." + s + ".map",
                      value: c,
                      expressionContext: "cluster-map",
                    })
                  ),
                    i.push.apply(
                      i,
                      Mr({
                        key: r + "." + s + ".reduce",
                        value: p,
                        expressionContext: "cluster-reduce",
                      })
                    );
                }
              return i;
            case "video":
              return Tr({
                key: r,
                value: t,
                valueSpec: n.source_video,
                style: o,
                styleSpec: n,
              });
            case "image":
              return Tr({
                key: r,
                value: t,
                valueSpec: n.source_image,
                style: o,
                styleSpec: n,
              });
            case "canvas":
              return [
                new xr(
                  r,
                  null,
                  "Please use runtime APIs to add canvas sources, rather than including them in stylesheets.",
                  "source.canvas"
                ),
              ];
            default:
              return zr({
                key: r + ".type",
                value: t.type,
                valueSpec: {
                  values: ["vector", "raster", "raster-dem", "geojson", "video", "image"],
                },
                style: o,
                styleSpec: n,
              });
          }
        }
        function Dr(e) {
          var t = e.value,
            r = e.styleSpec,
            n = r.light,
            o = e.style,
            i = [],
            a = Lt(t);
          if (void 0 === t) return i;
          if ("object" !== a)
            return (i = i.concat([
              new xr("light", t, "object expected, " + a + " found"),
            ]));
          for (var s in t) {
            var l = s.match(/^(.*)-transition$/);
            i =
              l && n[l[1]] && n[l[1]].transition
                ? i.concat(
                    Ur({
                      key: s,
                      value: t[s],
                      valueSpec: r.transition,
                      style: o,
                      styleSpec: r,
                    })
                  )
                : n[s]
                ? i.concat(
                    Ur({
                      key: s,
                      value: t[s],
                      valueSpec: n[s],
                      style: o,
                      styleSpec: r,
                    })
                  )
                : i.concat([new xr(s, t[s], 'unknown property "' + s + '"')]);
          }
          return i;
        }
        var Br = {
          "*": function () {
            return [];
          },
          array: Ar,
          boolean: function (e) {
            var t = e.value,
              r = e.key,
              n = Lt(t);
            return "boolean" !== n
              ? [new xr(r, t, "boolean expected, " + n + " found")]
              : [];
          },
          number: Or,
          color: function (e) {
            var t = e.key,
              r = e.value,
              n = Lt(r);
            return "string" !== n
              ? [new xr(t, r, "color expected, " + n + " found")]
              : null === V(r)
              ? [new xr(t, r, 'color expected, "' + r + '" found')]
              : [];
          },
          constants: Sr,
          enum: zr,
          filter: Cr,
          function: Er,
          layer: Nr,
          object: Tr,
          source: Fr,
          light: Dr,
          string: qr,
          formatted: function (e) {
            return 0 === qr(e).length ? [] : Mr(e);
          },
          resolvedImage: function (e) {
            return 0 === qr(e).length ? [] : Mr(e);
          },
        };
        function Ur(e) {
          var t = e.value,
            r = e.valueSpec,
            n = e.styleSpec;
          return r.expression && Ft(_r(t))
            ? Er(e)
            : r.expression && $t(jr(t))
            ? Mr(e)
            : r.type && Br[r.type]
            ? Br[r.type](e)
            : Tr(O({}, e, { valueSpec: r.type ? n[r.type] : r }));
        }
        function Gr(e) {
          var t = e.value,
            r = e.key,
            n = qr(e);
          return n.length
            ? n
            : (-1 === t.indexOf("{fontstack}") &&
                n.push(new xr(r, t, '"glyphs" url must include a "{fontstack}" token')),
              -1 === t.indexOf("{range}") &&
                n.push(new xr(r, t, '"glyphs" url must include a "{range}" token')),
              n);
        }
        function Wr(e, t) {
          void 0 === t && (t = o);
          var r = [];
          return (
            (r = r.concat(
              Ur({
                key: "",
                value: e,
                valueSpec: t.$root,
                styleSpec: t,
                style: e,
                objectElementValidators: {
                  glyphs: Gr,
                  "*": function () {
                    return [];
                  },
                },
              })
            )),
            e.constants &&
              (r = r.concat(
                Sr({ key: "constants", value: e.constants, style: e, styleSpec: t })
              )),
            Vr(r)
          );
        }
        function Vr(e) {
          return [].concat(e).sort(function (e, t) {
            return e.line - t.line;
          });
        }
        function Jr(e) {
          return function () {
            for (var t = arguments, r = [], n = arguments.length; n--; ) r[n] = t[n];
            return Vr(e.apply(this, r));
          };
        }
        (Wr.source = Jr(Fr)),
          (Wr.light = Jr(Dr)),
          (Wr.layer = Jr(Nr)),
          (Wr.filter = Jr(Cr)),
          (Wr.paintProperty = Jr(Pr)),
          (Wr.layoutProperty = Jr(Rr));
        var Yr = a(function (e, t) {
          var r = (function () {
            var e = function (e, t, r, n) {
                for (r = r || {}, n = e.length; n--; r[e[n]] = t);
                return r;
              },
              t = [1, 12],
              r = [1, 13],
              n = [1, 9],
              o = [1, 10],
              i = [1, 11],
              a = [1, 14],
              s = [1, 15],
              l = [14, 18, 22, 24],
              u = [18, 22],
              c = [22, 24],
              p = {
                trace: function () {},
                yy: {},
                symbols_: {
                  error: 2,
                  JSONString: 3,
                  STRING: 4,
                  JSONNumber: 5,
                  NUMBER: 6,
                  JSONNullLiteral: 7,
                  NULL: 8,
                  JSONBooleanLiteral: 9,
                  TRUE: 10,
                  FALSE: 11,
                  JSONText: 12,
                  JSONValue: 13,
                  EOF: 14,
                  JSONObject: 15,
                  JSONArray: 16,
                  "{": 17,
                  "}": 18,
                  JSONMemberList: 19,
                  JSONMember: 20,
                  ":": 21,
                  ",": 22,
                  "[": 23,
                  "]": 24,
                  JSONElementList: 25,
                  $accept: 0,
                  $end: 1,
                },
                terminals_: {
                  2: "error",
                  4: "STRING",
                  6: "NUMBER",
                  8: "NULL",
                  10: "TRUE",
                  11: "FALSE",
                  14: "EOF",
                  17: "{",
                  18: "}",
                  21: ":",
                  22: ",",
                  23: "[",
                  24: "]",
                },
                productions_: [
                  0,
                  [3, 1],
                  [5, 1],
                  [7, 1],
                  [9, 1],
                  [9, 1],
                  [12, 2],
                  [13, 1],
                  [13, 1],
                  [13, 1],
                  [13, 1],
                  [13, 1],
                  [13, 1],
                  [15, 2],
                  [15, 3],
                  [20, 3],
                  [19, 1],
                  [19, 3],
                  [16, 2],
                  [16, 3],
                  [25, 1],
                  [25, 3],
                ],
                performAction: function (e, t, r, n, o, i, a) {
                  var s = i.length - 1;
                  switch (o) {
                    case 1:
                      (this.$ = new String(
                        e
                          .replace(/\\(\\|")/g, "$1")
                          .replace(/\\n/g, "\n")
                          .replace(/\\r/g, "\r")
                          .replace(/\\t/g, "\t")
                          .replace(/\\v/g, "\v")
                          .replace(/\\f/g, "\f")
                          .replace(/\\b/g, "\b")
                      )),
                        (this.$.__line__ = this._$.first_line);
                      break;
                    case 2:
                      (this.$ = new Number(e)), (this.$.__line__ = this._$.first_line);
                      break;
                    case 3:
                      this.$ = null;
                      break;
                    case 4:
                      (this.$ = new Boolean(!0)), (this.$.__line__ = this._$.first_line);
                      break;
                    case 5:
                      (this.$ = new Boolean(!1)), (this.$.__line__ = this._$.first_line);
                      break;
                    case 6:
                      return (this.$ = i[s - 1]);
                    case 13:
                      (this.$ = {}),
                        Object.defineProperty(this.$, "__line__", {
                          value: this._$.first_line,
                          enumerable: !1,
                        });
                      break;
                    case 14:
                    case 19:
                      (this.$ = i[s - 1]),
                        Object.defineProperty(this.$, "__line__", {
                          value: this._$.first_line,
                          enumerable: !1,
                        });
                      break;
                    case 15:
                      this.$ = [i[s - 2], i[s]];
                      break;
                    case 16:
                      (this.$ = {}), (this.$[i[s][0]] = i[s][1]);
                      break;
                    case 17:
                      (this.$ = i[s - 2]), (i[s - 2][i[s][0]] = i[s][1]);
                      break;
                    case 18:
                      (this.$ = []),
                        Object.defineProperty(this.$, "__line__", {
                          value: this._$.first_line,
                          enumerable: !1,
                        });
                      break;
                    case 20:
                      this.$ = [i[s]];
                      break;
                    case 21:
                      (this.$ = i[s - 2]), i[s - 2].push(i[s]);
                  }
                },
                table: [
                  {
                    3: 5,
                    4: t,
                    5: 6,
                    6: r,
                    7: 3,
                    8: n,
                    9: 4,
                    10: o,
                    11: i,
                    12: 1,
                    13: 2,
                    15: 7,
                    16: 8,
                    17: a,
                    23: s,
                  },
                  { 1: [3] },
                  { 14: [1, 16] },
                  e(l, [2, 7]),
                  e(l, [2, 8]),
                  e(l, [2, 9]),
                  e(l, [2, 10]),
                  e(l, [2, 11]),
                  e(l, [2, 12]),
                  e(l, [2, 3]),
                  e(l, [2, 4]),
                  e(l, [2, 5]),
                  e([14, 18, 21, 22, 24], [2, 1]),
                  e(l, [2, 2]),
                  { 3: 20, 4: t, 18: [1, 17], 19: 18, 20: 19 },
                  {
                    3: 5,
                    4: t,
                    5: 6,
                    6: r,
                    7: 3,
                    8: n,
                    9: 4,
                    10: o,
                    11: i,
                    13: 23,
                    15: 7,
                    16: 8,
                    17: a,
                    23: s,
                    24: [1, 21],
                    25: 22,
                  },
                  { 1: [2, 6] },
                  e(l, [2, 13]),
                  { 18: [1, 24], 22: [1, 25] },
                  e(u, [2, 16]),
                  { 21: [1, 26] },
                  e(l, [2, 18]),
                  { 22: [1, 28], 24: [1, 27] },
                  e(c, [2, 20]),
                  e(l, [2, 14]),
                  { 3: 20, 4: t, 20: 29 },
                  {
                    3: 5,
                    4: t,
                    5: 6,
                    6: r,
                    7: 3,
                    8: n,
                    9: 4,
                    10: o,
                    11: i,
                    13: 30,
                    15: 7,
                    16: 8,
                    17: a,
                    23: s,
                  },
                  e(l, [2, 19]),
                  {
                    3: 5,
                    4: t,
                    5: 6,
                    6: r,
                    7: 3,
                    8: n,
                    9: 4,
                    10: o,
                    11: i,
                    13: 31,
                    15: 7,
                    16: 8,
                    17: a,
                    23: s,
                  },
                  e(u, [2, 17]),
                  e(u, [2, 15]),
                  e(c, [2, 21]),
                ],
                defaultActions: { 16: [2, 6] },
                parseError: function (e, t) {
                  if (!t.recoverable) throw new Error(e);
                  this.trace(e);
                },
                parse: function (e) {
                  var t = this,
                    r = [0],
                    n = [null],
                    o = [],
                    i = this.table,
                    a = "",
                    s = 0,
                    l = 0,
                    u = 2,
                    c = 1,
                    p = o.slice.call(arguments, 1),
                    h = Object.create(this.lexer),
                    d = { yy: {} };
                  for (var f in this.yy)
                    Object.prototype.hasOwnProperty.call(this.yy, f) &&
                      (d.yy[f] = this.yy[f]);
                  h.setInput(e, d.yy),
                    (d.yy.lexer = h),
                    (d.yy.parser = this),
                    void 0 === h.yylloc && (h.yylloc = {});
                  var y = h.yylloc;
                  o.push(y);
                  var m = h.options && h.options.ranges;
                  function g() {
                    var e;
                    return (
                      "number" != typeof (e = h.lex() || c) && (e = t.symbols_[e] || e), e
                    );
                  }
                  "function" == typeof d.yy.parseError
                    ? (this.parseError = d.yy.parseError)
                    : (this.parseError = Object.getPrototypeOf(this).parseError);
                  for (var v, b, w, x, k, S, _, j, T, A = {}; ; ) {
                    if (
                      ((w = r[r.length - 1]),
                      this.defaultActions[w]
                        ? (x = this.defaultActions[w])
                        : (null == v && (v = g()), (x = i[w] && i[w][v])),
                      void 0 === x || !x.length || !x[0])
                    ) {
                      var O = "";
                      for (S in ((T = []), i[w]))
                        this.terminals_[S] &&
                          S > u &&
                          T.push("'" + this.terminals_[S] + "'");
                      (O = h.showPosition
                        ? "Parse error on line " +
                          (s + 1) +
                          ":\n" +
                          h.showPosition() +
                          "\nExpecting " +
                          T.join(", ") +
                          ", got '" +
                          (this.terminals_[v] || v) +
                          "'"
                        : "Parse error on line " +
                          (s + 1) +
                          ": Unexpected " +
                          (v == c
                            ? "end of input"
                            : "'" + (this.terminals_[v] || v) + "'")),
                        this.parseError(O, {
                          text: h.match,
                          token: this.terminals_[v] || v,
                          line: h.yylineno,
                          loc: y,
                          expected: T,
                        });
                    }
                    if (x[0] instanceof Array && x.length > 1)
                      throw new Error(
                        "Parse Error: multiple actions possible at state: " +
                          w +
                          ", token: " +
                          v
                      );
                    switch (x[0]) {
                      case 1:
                        r.push(v),
                          n.push(h.yytext),
                          o.push(h.yylloc),
                          r.push(x[1]),
                          (v = null),
                          b
                            ? ((v = b), (b = null))
                            : ((l = h.yyleng),
                              (a = h.yytext),
                              (s = h.yylineno),
                              (y = h.yylloc));
                        break;
                      case 2:
                        if (
                          ((_ = this.productions_[x[1]][1]),
                          (A.$ = n[n.length - _]),
                          (A._$ = {
                            first_line: o[o.length - (_ || 1)].first_line,
                            last_line: o[o.length - 1].last_line,
                            first_column: o[o.length - (_ || 1)].first_column,
                            last_column: o[o.length - 1].last_column,
                          }),
                          m &&
                            (A._$.range = [
                              o[o.length - (_ || 1)].range[0],
                              o[o.length - 1].range[1],
                            ]),
                          void 0 !==
                            (k = this.performAction.apply(
                              A,
                              [a, l, s, d.yy, x[1], n, o].concat(p)
                            )))
                        )
                          return k;
                        _ &&
                          ((r = r.slice(0, -1 * _ * 2)),
                          (n = n.slice(0, -1 * _)),
                          (o = o.slice(0, -1 * _))),
                          r.push(this.productions_[x[1]][0]),
                          n.push(A.$),
                          o.push(A._$),
                          (j = i[r[r.length - 2]][r[r.length - 1]]),
                          r.push(j);
                        break;
                      case 3:
                        return !0;
                    }
                  }
                  return !0;
                },
              },
              h = {
                EOF: 1,
                parseError: function (e, t) {
                  if (!this.yy.parser) throw new Error(e);
                  this.yy.parser.parseError(e, t);
                },
                setInput: function (e, t) {
                  return (
                    (this.yy = t || this.yy || {}),
                    (this._input = e),
                    (this._more = this._backtrack = this.done = !1),
                    (this.yylineno = this.yyleng = 0),
                    (this.yytext = this.matched = this.match = ""),
                    (this.conditionStack = ["INITIAL"]),
                    (this.yylloc = {
                      first_line: 1,
                      first_column: 0,
                      last_line: 1,
                      last_column: 0,
                    }),
                    this.options.ranges && (this.yylloc.range = [0, 0]),
                    (this.offset = 0),
                    this
                  );
                },
                input: function () {
                  var e = this._input[0];
                  return (
                    (this.yytext += e),
                    this.yyleng++,
                    this.offset++,
                    (this.match += e),
                    (this.matched += e),
                    e.match(/(?:\r\n?|\n).*/g)
                      ? (this.yylineno++, this.yylloc.last_line++)
                      : this.yylloc.last_column++,
                    this.options.ranges && this.yylloc.range[1]++,
                    (this._input = this._input.slice(1)),
                    e
                  );
                },
                unput: function (e) {
                  var t = e.length,
                    r = e.split(/(?:\r\n?|\n)/g);
                  (this._input = e + this._input),
                    (this.yytext = this.yytext.substr(0, this.yytext.length - t)),
                    (this.offset -= t);
                  var n = this.match.split(/(?:\r\n?|\n)/g);
                  (this.match = this.match.substr(0, this.match.length - 1)),
                    (this.matched = this.matched.substr(0, this.matched.length - 1)),
                    r.length - 1 && (this.yylineno -= r.length - 1);
                  var o = this.yylloc.range;
                  return (
                    (this.yylloc = {
                      first_line: this.yylloc.first_line,
                      last_line: this.yylineno + 1,
                      first_column: this.yylloc.first_column,
                      last_column: r
                        ? (r.length === n.length ? this.yylloc.first_column : 0) +
                          n[n.length - r.length].length -
                          r[0].length
                        : this.yylloc.first_column - t,
                    }),
                    this.options.ranges &&
                      (this.yylloc.range = [o[0], o[0] + this.yyleng - t]),
                    (this.yyleng = this.yytext.length),
                    this
                  );
                },
                more: function () {
                  return (this._more = !0), this;
                },
                reject: function () {
                  return this.options.backtrack_lexer
                    ? ((this._backtrack = !0), this)
                    : this.parseError(
                        "Lexical error on line " +
                          (this.yylineno + 1) +
                          ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" +
                          this.showPosition(),
                        { text: "", token: null, line: this.yylineno }
                      );
                },
                less: function (e) {
                  this.unput(this.match.slice(e));
                },
                pastInput: function () {
                  var e = this.matched.substr(0, this.matched.length - this.match.length);
                  return (e.length > 20 ? "..." : "") + e.substr(-20).replace(/\n/g, "");
                },
                upcomingInput: function () {
                  var e = this.match;
                  return (
                    e.length < 20 && (e += this._input.substr(0, 20 - e.length)),
                    (e.substr(0, 20) + (e.length > 20 ? "..." : "")).replace(/\n/g, "")
                  );
                },
                showPosition: function () {
                  var e = this.pastInput(),
                    t = new Array(e.length + 1).join("-");
                  return e + this.upcomingInput() + "\n" + t + "^";
                },
                test_match: function (e, t) {
                  var r, n, o;
                  if (
                    (this.options.backtrack_lexer &&
                      ((o = {
                        yylineno: this.yylineno,
                        yylloc: {
                          first_line: this.yylloc.first_line,
                          last_line: this.last_line,
                          first_column: this.yylloc.first_column,
                          last_column: this.yylloc.last_column,
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done,
                      }),
                      this.options.ranges &&
                        (o.yylloc.range = this.yylloc.range.slice(0))),
                    (n = e[0].match(/(?:\r\n?|\n).*/g)) && (this.yylineno += n.length),
                    (this.yylloc = {
                      first_line: this.yylloc.last_line,
                      last_line: this.yylineno + 1,
                      first_column: this.yylloc.last_column,
                      last_column: n
                        ? n[n.length - 1].length -
                          n[n.length - 1].match(/\r?\n?/)[0].length
                        : this.yylloc.last_column + e[0].length,
                    }),
                    (this.yytext += e[0]),
                    (this.match += e[0]),
                    (this.matches = e),
                    (this.yyleng = this.yytext.length),
                    this.options.ranges &&
                      (this.yylloc.range = [this.offset, (this.offset += this.yyleng)]),
                    (this._more = !1),
                    (this._backtrack = !1),
                    (this._input = this._input.slice(e[0].length)),
                    (this.matched += e[0]),
                    (r = this.performAction.call(
                      this,
                      this.yy,
                      this,
                      t,
                      this.conditionStack[this.conditionStack.length - 1]
                    )),
                    this.done && this._input && (this.done = !1),
                    r)
                  )
                    return r;
                  if (this._backtrack) {
                    for (var i in o) this[i] = o[i];
                    return !1;
                  }
                  return !1;
                },
                next: function () {
                  if (this.done) return this.EOF;
                  var e, t, r, n;
                  this._input || (this.done = !0),
                    this._more || ((this.yytext = ""), (this.match = ""));
                  for (var o = this._currentRules(), i = 0; i < o.length; i++)
                    if (
                      (r = this._input.match(this.rules[o[i]])) &&
                      (!t || r[0].length > t[0].length)
                    ) {
                      if (((t = r), (n = i), this.options.backtrack_lexer)) {
                        if (!1 !== (e = this.test_match(r, o[i]))) return e;
                        if (this._backtrack) {
                          t = !1;
                          continue;
                        }
                        return !1;
                      }
                      if (!this.options.flex) break;
                    }
                  return t
                    ? !1 !== (e = this.test_match(t, o[n])) && e
                    : "" === this._input
                    ? this.EOF
                    : this.parseError(
                        "Lexical error on line " +
                          (this.yylineno + 1) +
                          ". Unrecognized text.\n" +
                          this.showPosition(),
                        { text: "", token: null, line: this.yylineno }
                      );
                },
                lex: function () {
                  var e = this.next();
                  return e || this.lex();
                },
                begin: function (e) {
                  this.conditionStack.push(e);
                },
                popState: function () {
                  return this.conditionStack.length - 1 > 0
                    ? this.conditionStack.pop()
                    : this.conditionStack[0];
                },
                _currentRules: function () {
                  return this.conditionStack.length &&
                    this.conditionStack[this.conditionStack.length - 1]
                    ? this.conditions[this.conditionStack[this.conditionStack.length - 1]]
                        .rules
                    : this.conditions.INITIAL.rules;
                },
                topState: function (e) {
                  return (e = this.conditionStack.length - 1 - Math.abs(e || 0)) >= 0
                    ? this.conditionStack[e]
                    : "INITIAL";
                },
                pushState: function (e) {
                  this.begin(e);
                },
                stateStackSize: function () {
                  return this.conditionStack.length;
                },
                options: {},
                performAction: function (e, t, r, n) {
                  switch (r) {
                    case 0:
                      break;
                    case 1:
                      return 6;
                    case 2:
                      return (t.yytext = t.yytext.substr(1, t.yyleng - 2)), 4;
                    case 3:
                      return 17;
                    case 4:
                      return 18;
                    case 5:
                      return 23;
                    case 6:
                      return 24;
                    case 7:
                      return 22;
                    case 8:
                      return 21;
                    case 9:
                      return 10;
                    case 10:
                      return 11;
                    case 11:
                      return 8;
                    case 12:
                      return 14;
                    case 13:
                      return "INVALID";
                  }
                },
                rules: [
                  /^(?:\s+)/,
                  /^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/,
                  /^(?:"(?:\\[\\"bfnrt/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/,
                  /^(?:\{)/,
                  /^(?:\})/,
                  /^(?:\[)/,
                  /^(?:\])/,
                  /^(?:,)/,
                  /^(?::)/,
                  /^(?:true\b)/,
                  /^(?:false\b)/,
                  /^(?:null\b)/,
                  /^(?:$)/,
                  /^(?:.)/,
                ],
                conditions: {
                  INITIAL: {
                    rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                    inclusive: !0,
                  },
                },
              };
            function d() {
              this.yy = {};
            }
            return (p.lexer = h), (d.prototype = p), (p.Parser = d), new d();
          })();
          (t.parser = r),
            (t.Parser = r.Parser),
            (t.parse = function () {
              return r.parse.apply(r, arguments);
            });
        });
        Yr.parser, Yr.Parser, Yr.parse;
        function $r(e) {
          if (e instanceof String || "string" == typeof e || e instanceof n)
            try {
              return Yr.parse(e.toString());
            } catch (e) {
              throw new kr(e);
            }
          return e;
        }
        function Hr(e, t) {
          void 0 === t && (t = o);
          var r = e;
          try {
            r = $r(r);
          } catch (e) {
            return [e];
          }
          return Wr(r, t);
        }
        var Kr = {
            StyleExpression: Yt,
            isExpression: $t,
            createExpression: Ht,
            createPropertyExpression: Zt,
            normalizePropertyExpression: function (e, t) {
              if (Ft(e)) return new Qt(e, t);
              if ($t(e)) {
                var r = Zt(e, t);
                if ("error" === r.result)
                  throw new Error(
                    r.value
                      .map(function (e) {
                        return e.key + ": " + e.message;
                      })
                      .join(", ")
                  );
                return r.value;
              }
              var n = e;
              return (
                "string" == typeof e && "color" === t.type && (n = J.parse(e)),
                {
                  kind: "constant",
                  evaluate: function () {
                    return n;
                  },
                }
              );
            },
            ZoomConstantExpression: Kt,
            ZoomDependentExpression: Xt,
            StylePropertyFunction: Qt,
          },
          Xr = { convertFunction: tr, createFunction: Bt, isFunction: Ft };
        (Hr.parsed = Hr), (Hr.latest = Hr);
      }.call(this, r(15), r(23).Buffer));
    },
    function (t, r) {
      t.exports = e;
    },
    function (e, r) {
      e.exports = t;
    },
    function (e, t) {
      e.exports = r;
    },
    function (e, t) {
      e.exports = n;
    },
    function (e, t) {
      var r = {
          thin: 100,
          hairline: 100,
          "ultra-light": 100,
          "extra-light": 100,
          light: 200,
          book: 300,
          regular: 400,
          normal: 400,
          plain: 400,
          roman: 400,
          standard: 400,
          medium: 500,
          "semi-bold": 600,
          "demi-bold": 600,
          bold: 700,
          heavy: 800,
          black: 800,
          "extra-bold": 800,
          "ultra-black": 900,
          "extra-black": 900,
          "ultra-bold": 900,
          "heavy-black": 900,
          fat: 900,
          poster: 900,
        },
        n = /(italic|oblique)$/i,
        o = {};
      e.exports = function (e, t, i) {
        var a = o[e];
        if (!a) {
          Array.isArray(e) || (e = [e]);
          for (var s = 400, l = "normal", u = [], c = 0, p = e.length; c < p; ++c) {
            var h = e[c].split(" "),
              d = h[h.length - 1].toLowerCase();
            for (var f in ("normal" == d || "italic" == d || "oblique" == d
              ? ((l = d), h.pop(), (d = h[h.length - 1].toLowerCase()))
              : n.test(d) &&
                ((d = d.replace(n, "")), (l = h[h.length - 1].replace(d, ""))),
            r))
              if (d == f || d == f.replace("-", "") || d == f.replace("-", " ")) {
                (s = r[f]), h.pop();
                break;
              }
            "number" == typeof d && (s = d);
            var y = h.join(" ").replace("Klokantech Noto Sans", "Noto Sans");
            -1 !== y.indexOf(" ") && (y = '"' + y + '"'), u.push(y);
          }
          a = o[e] = [l, s, u];
        }
        return a[0] + " " + a[1] + " " + t + "px" + (i ? "/" + i : "") + " " + a[2];
      };
    },
    function (e, t) {
      e.exports = o;
    },
    function (e, t) {
      e.exports = i;
    },
    function (e, t) {
      e.exports = a;
    },
    function (e, t) {
      e.exports = s;
    },
    function (e, t) {
      e.exports = l;
    },
    function (e, t) {
      e.exports = u;
    },
    function (e, t) {
      e.exports = c;
    },
    function (e, t) {
      e.exports = p;
    },
    function (e, t) {
      e.exports = h;
    },
    function (e, t) {
      var r;
      r = (function () {
        return this;
      })();
      try {
        r = r || new Function("return this")();
      } catch (e) {
        "object" == typeof window && (r = window);
      }
      e.exports = r;
    },
    function (e, t) {
      e.exports = d;
    },
    function (e, t) {
      (function () {
        var t;
        (e.exports = {
          icon: "icons/google.svg",
          name: "google",
          title: "Google Fonts",
          link: "google.com/fonts",
          getNames: function () {
            return t;
          },
          getLink: function (e) {
            return "https://fonts.google.com/specimen/" + e.replace(/( )/g, "+");
          },
          normalizeName: function (e) {
            return e;
          },
        }),
          (t = [
            "ABeeZee",
            "Abel",
            "Abril Fatface",
            "Aclonica",
            "Acme",
            "Actor",
            "Adamina",
            "Advent Pro",
            "Aguafina Script",
            "Akronim",
            "Aladin",
            "Aldrich",
            "Alef",
            "Alegreya",
            "Alegreya SC",
            "Alegreya Sans",
            "Alegreya Sans SC",
            "Alex Brush",
            "Alfa Slab One",
            "Alice",
            "Alike",
            "Alike Angular",
            "Allan",
            "Allerta",
            "Allerta Stencil",
            "Allura",
            "Almendra",
            "Almendra Display",
            "Almendra SC",
            "Amarante",
            "Amaranth",
            "Amatic SC",
            "Amethysta",
            "Amiri",
            "Amita",
            "Anaheim",
            "Andada",
            "Andika",
            "Angkor",
            "Annie Use Your Telescope",
            "Anonymous Pro",
            "Antic",
            "Antic Didone",
            "Antic Slab",
            "Anton",
            "Arapey",
            "Arbutus",
            "Arbutus Slab",
            "Architects Daughter",
            "Archivo Black",
            "Archivo Narrow",
            "Arimo",
            "Arizonia",
            "Armata",
            "Artifika",
            "Arvo",
            "Arya",
            "Asap",
            "Asar",
            "Asset",
            "Astloch",
            "Asul",
            "Atomic Age",
            "Aubrey",
            "Audiowide",
            "Autour One",
            "Average",
            "Average Sans",
            "Averia Gruesa Libre",
            "Averia Libre",
            "Averia Sans Libre",
            "Averia Serif Libre",
            "Bad Script",
            "Balthazar",
            "Bangers",
            "Basic",
            "Battambang",
            "Baumans",
            "Bayon",
            "Belgrano",
            "Belleza",
            "BenchNine",
            "Bentham",
            "Berkshire Swash",
            "Bevan",
            "Bigelow Rules",
            "Bigshot One",
            "Bilbo",
            "Bilbo Swash Caps",
            "Biryani",
            "Bitter",
            "Black Ops One",
            "Bokor",
            "Bonbon",
            "Boogaloo",
            "Bowlby One",
            "Bowlby One SC",
            "Brawler",
            "Bree Serif",
            "Bubblegum Sans",
            "Bubbler One",
            "Buda",
            "Buenard",
            "Butcherman",
            "Butterfly Kids",
            "Cabin",
            "Cabin Condensed",
            "Cabin Sketch",
            "Caesar Dressing",
            "Cagliostro",
            "Calligraffitti",
            "Cambay",
            "Cambo",
            "Candal",
            "Cantarell",
            "Cantata One",
            "Cantora One",
            "Capriola",
            "Cardo",
            "Carme",
            "Carrois Gothic",
            "Carrois Gothic SC",
            "Carter One",
            "Catamaran",
            "Caudex",
            "Caveat",
            "Caveat Brush",
            "Cedarville Cursive",
            "Ceviche One",
            "Changa One",
            "Chango",
            "Chau Philomene One",
            "Chela One",
            "Chelsea Market",
            "Chenla",
            "Cherry Cream Soda",
            "Cherry Swash",
            "Chewy",
            "Chicle",
            "Chivo",
            "Chonburi",
            "Cinzel",
            "Cinzel Decorative",
            "Clicker Script",
            "Coda",
            "Coda Caption",
            "Codystar",
            "Combo",
            "Comfortaa",
            "Coming Soon",
            "Concert One",
            "Condiment",
            "Content",
            "Contrail One",
            "Convergence",
            "Cookie",
            "Copse",
            "Corben",
            "Courgette",
            "Cousine",
            "Coustard",
            "Covered By Your Grace",
            "Crafty Girls",
            "Creepster",
            "Crete Round",
            "Crimson Text",
            "Croissant One",
            "Crushed",
            "Cuprum",
            "Cutive",
            "Cutive Mono",
            "Damion",
            "Dancing Script",
            "Dangrek",
            "Dawning of a New Day",
            "Days One",
            "Dekko",
            "Delius",
            "Delius Swash Caps",
            "Delius Unicase",
            "Della Respira",
            "Denk One",
            "Devonshire",
            "Dhurjati",
            "Didact Gothic",
            "Diplomata",
            "Diplomata SC",
            "Domine",
            "Donegal One",
            "Doppio One",
            "Dorsa",
            "Dosis",
            "Dr Sugiyama",
            "Droid Sans",
            "Droid Sans Mono",
            "Droid Serif",
            "Duru Sans",
            "Dynalight",
            "EB Garamond",
            "Eagle Lake",
            "Eater",
            "Economica",
            "Eczar",
            "Ek Mukta",
            "Electrolize",
            "Elsie",
            "Elsie Swash Caps",
            "Emblema One",
            "Emilys Candy",
            "Engagement",
            "Englebert",
            "Enriqueta",
            "Erica One",
            "Esteban",
            "Euphoria Script",
            "Ewert",
            "Exo",
            "Exo 2",
            "Expletus Sans",
            "Fanwood Text",
            "Fascinate",
            "Fascinate Inline",
            "Faster One",
            "Fasthand",
            "Fauna One",
            "Federant",
            "Federo",
            "Felipa",
            "Fenix",
            "Finger Paint",
            "Fira Mono",
            "Fira Sans",
            "Fjalla One",
            "Fjord One",
            "Flamenco",
            "Flavors",
            "Fondamento",
            "Fontdiner Swanky",
            "Forum",
            "Francois One",
            "Freckle Face",
            "Fredericka the Great",
            "Fredoka One",
            "Freehand",
            "Fresca",
            "Frijole",
            "Fruktur",
            "Fugaz One",
            "GFS Didot",
            "GFS Neohellenic",
            "Gabriela",
            "Gafata",
            "Galdeano",
            "Galindo",
            "Gentium Basic",
            "Gentium Book Basic",
            "Geo",
            "Geostar",
            "Geostar Fill",
            "Germania One",
            "Gidugu",
            "Gilda Display",
            "Give You Glory",
            "Glass Antiqua",
            "Glegoo",
            "Gloria Hallelujah",
            "Goblin One",
            "Gochi Hand",
            "Gorditas",
            "Goudy Bookletter 1911",
            "Graduate",
            "Grand Hotel",
            "Gravitas One",
            "Great Vibes",
            "Griffy",
            "Gruppo",
            "Gudea",
            "Gurajada",
            "Habibi",
            "Halant",
            "Hammersmith One",
            "Hanalei",
            "Hanalei Fill",
            "Handlee",
            "Hanuman",
            "Happy Monkey",
            "Headland One",
            "Henny Penny",
            "Herr Von Muellerhoff",
            "Hind",
            "Hind Siliguri",
            "Hind Vadodara",
            "Holtwood One SC",
            "Homemade Apple",
            "Homenaje",
            "IM Fell DW Pica",
            "IM Fell DW Pica SC",
            "IM Fell Double Pica",
            "IM Fell Double Pica SC",
            "IM Fell English",
            "IM Fell English SC",
            "IM Fell French Canon",
            "IM Fell French Canon SC",
            "IM Fell Great Primer",
            "IM Fell Great Primer SC",
            "Iceberg",
            "Iceland",
            "Imprima",
            "Inconsolata",
            "Inder",
            "Indie Flower",
            "Inika",
            "Inknut Antiqua",
            "Irish Grover",
            "Istok Web",
            "Italiana",
            "Italianno",
            "Itim",
            "Jacques Francois",
            "Jacques Francois Shadow",
            "Jaldi",
            "Jim Nightshade",
            "Jockey One",
            "Jolly Lodger",
            "Josefin Sans",
            "Josefin Slab",
            "Joti One",
            "Judson",
            "Julee",
            "Julius Sans One",
            "Junge",
            "Jura",
            "Just Another Hand",
            "Just Me Again Down Here",
            "Kadwa",
            "Kalam",
            "Kameron",
            "Kantumruy",
            "Karla",
            "Karma",
            "Kaushan Script",
            "Kavoon",
            "Kdam Thmor",
            "Keania One",
            "Kelly Slab",
            "Kenia",
            "Khand",
            "Khmer",
            "Khula",
            "Kite One",
            "Knewave",
            "Kotta One",
            "Koulen",
            "Kranky",
            "Kreon",
            "Kristi",
            "Krona One",
            "Kurale",
            "La Belle Aurore",
            "Laila",
            "Lakki Reddy",
            "Lancelot",
            "Lateef",
            "Lato",
            "League Script",
            "Leckerli One",
            "Ledger",
            "Lekton",
            "Lemon",
            "Libre Baskerville",
            "Life Savers",
            "Lilita One",
            "Lily Script One",
            "Limelight",
            "Linden Hill",
            "Lobster",
            "Lobster Two",
            "Londrina Outline",
            "Londrina Shadow",
            "Londrina Sketch",
            "Londrina Solid",
            "Lora",
            "Love Ya Like A Sister",
            "Loved by the King",
            "Lovers Quarrel",
            "Luckiest Guy",
            "Lusitana",
            "Lustria",
            "Macondo",
            "Macondo Swash Caps",
            "Magra",
            "Maiden Orange",
            "Mako",
            "Mallanna",
            "Mandali",
            "Marcellus",
            "Marcellus SC",
            "Marck Script",
            "Margarine",
            "Marko One",
            "Marmelad",
            "Martel",
            "Martel Sans",
            "Marvel",
            "Mate",
            "Mate SC",
            "Maven Pro",
            "McLaren",
            "Meddon",
            "MedievalSharp",
            "Medula One",
            "Megrim",
            "Meie Script",
            "Merienda",
            "Merienda One",
            "Merriweather",
            "Merriweather Sans",
            "Metal",
            "Metal Mania",
            "Metamorphous",
            "Metrophobic",
            "Michroma",
            "Milonga",
            "Miltonian",
            "Miltonian Tattoo",
            "Miniver",
            "Miss Fajardose",
            "Modak",
            "Modern Antiqua",
            "Molengo",
            "Molle",
            "Monda",
            "Monofett",
            "Monoton",
            "Monsieur La Doulaise",
            "Montaga",
            "Montez",
            "Montserrat",
            "Montserrat Alternates",
            "Montserrat Subrayada",
            "Moul",
            "Moulpali",
            "Mountains of Christmas",
            "Mouse Memoirs",
            "Mr Bedfort",
            "Mr Dafoe",
            "Mr De Haviland",
            "Mrs Saint Delafield",
            "Mrs Sheppards",
            "Muli",
            "Mystery Quest",
            "NTR",
            "Neucha",
            "Neuton",
            "New Rocker",
            "News Cycle",
            "Niconne",
            "Nixie One",
            "Nobile",
            "Nokora",
            "Norican",
            "Nosifer",
            "Nothing You Could Do",
            "Noticia Text",
            "Noto Sans",
            "Noto Serif",
            "Nova Cut",
            "Nova Flat",
            "Nova Mono",
            "Nova Oval",
            "Nova Round",
            "Nova Script",
            "Nova Slim",
            "Nova Square",
            "Numans",
            "Nunito",
            "Odor Mean Chey",
            "Offside",
            "Old Standard TT",
            "Oldenburg",
            "Oleo Script",
            "Oleo Script Swash Caps",
            "Open Sans",
            "Open Sans Condensed",
            "Oranienbaum",
            "Orbitron",
            "Oregano",
            "Orienta",
            "Original Surfer",
            "Oswald",
            "Over the Rainbow",
            "Overlock",
            "Overlock SC",
            "Ovo",
            "Oxygen",
            "Oxygen Mono",
            "PT Mono",
            "PT Sans",
            "PT Sans Caption",
            "PT Sans Narrow",
            "PT Serif",
            "PT Serif Caption",
            "Pacifico",
            "Palanquin",
            "Palanquin Dark",
            "Paprika",
            "Parisienne",
            "Passero One",
            "Passion One",
            "Pathway Gothic One",
            "Patrick Hand",
            "Patrick Hand SC",
            "Patua One",
            "Paytone One",
            "Peddana",
            "Peralta",
            "Permanent Marker",
            "Petit Formal Script",
            "Petrona",
            "Philosopher",
            "Piedra",
            "Pinyon Script",
            "Pirata One",
            "Plaster",
            "Play",
            "Playball",
            "Playfair Display",
            "Playfair Display SC",
            "Podkova",
            "Poiret One",
            "Poller One",
            "Poly",
            "Pompiere",
            "Pontano Sans",
            "Poppins",
            "Port Lligat Sans",
            "Port Lligat Slab",
            "Pragati Narrow",
            "Prata",
            "Preahvihear",
            "Press Start 2P",
            "Princess Sofia",
            "Prociono",
            "Prosto One",
            "Puritan",
            "Purple Purse",
            "Quando",
            "Quantico",
            "Quattrocento",
            "Quattrocento Sans",
            "Questrial",
            "Quicksand",
            "Quintessential",
            "Qwigley",
            "Racing Sans One",
            "Radley",
            "Rajdhani",
            "Raleway",
            "Raleway Dots",
            "Ramabhadra",
            "Ramaraja",
            "Rambla",
            "Rammetto One",
            "Ranchers",
            "Rancho",
            "Ranga",
            "Rationale",
            "Ravi Prakash",
            "Redressed",
            "Reenie Beanie",
            "Revalia",
            "Rhodium Libre",
            "Ribeye",
            "Ribeye Marrow",
            "Righteous",
            "Risque",
            "Roboto",
            "Roboto Condensed",
            "Roboto Mono",
            "Roboto Slab",
            "Rochester",
            "Rock Salt",
            "Rokkitt",
            "Romanesco",
            "Ropa Sans",
            "Rosario",
            "Rosarivo",
            "Rouge Script",
            "Rozha One",
            "Rubik",
            "Rubik Mono One",
            "Rubik One",
            "Ruda",
            "Rufina",
            "Ruge Boogie",
            "Ruluko",
            "Rum Raisin",
            "Ruslan Display",
            "Russo One",
            "Ruthie",
            "Rye",
            "Sacramento",
            "Sahitya",
            "Sail",
            "Salsa",
            "Sanchez",
            "Sancreek",
            "Sansita One",
            "Sarala",
            "Sarina",
            "Sarpanch",
            "Satisfy",
            "Scada",
            "Scheherazade",
            "Schoolbell",
            "Seaweed Script",
            "Sevillana",
            "Seymour One",
            "Shadows Into Light",
            "Shadows Into Light Two",
            "Shanti",
            "Share",
            "Share Tech",
            "Share Tech Mono",
            "Shojumaru",
            "Short Stack",
            "Siemreap",
            "Sigmar One",
            "Signika",
            "Signika Negative",
            "Simonetta",
            "Sintony",
            "Sirin Stencil",
            "Six Caps",
            "Skranji",
            "Slabo 13px",
            "Slabo 27px",
            "Slackey",
            "Smokum",
            "Smythe",
            "Sniglet",
            "Snippet",
            "Snowburst One",
            "Sofadi One",
            "Sofia",
            "Sonsie One",
            "Sorts Mill Goudy",
            "Source Code Pro",
            "Source Sans Pro",
            "Source Serif Pro",
            "Special Elite",
            "Spicy Rice",
            "Spinnaker",
            "Spirax",
            "Squada One",
            "Sree Krushnadevaraya",
            "Stalemate",
            "Stalinist One",
            "Stardos Stencil",
            "Stint Ultra Condensed",
            "Stint Ultra Expanded",
            "Stoke",
            "Strait",
            "Sue Ellen Francisco",
            "Sumana",
            "Sunshiney",
            "Supermercado One",
            "Sura",
            "Suranna",
            "Suravaram",
            "Suwannaphum",
            "Swanky and Moo Moo",
            "Syncopate",
            "Tangerine",
            "Taprom",
            "Tauri",
            "Teko",
            "Telex",
            "Tenali Ramakrishna",
            "Tenor Sans",
            "Text Me One",
            "The Girl Next Door",
            "Tienne",
            "Tillana",
            "Timmana",
            "Tinos",
            "Titan One",
            "Titillium Web",
            "Trade Winds",
            "Trocchi",
            "Trochut",
            "Trykker",
            "Tulpen One",
            "Ubuntu",
            "Ubuntu Condensed",
            "Ubuntu Mono",
            "Ultra",
            "Uncial Antiqua",
            "Underdog",
            "Unica One",
            "UnifrakturCook",
            "UnifrakturMaguntia",
            "Unkempt",
            "Unlock",
            "Unna",
            "VT323",
            "Vampiro One",
            "Varela",
            "Varela Round",
            "Vast Shadow",
            "Vesper Libre",
            "Vibur",
            "Vidaloka",
            "Viga",
            "Voces",
            "Volkhov",
            "Vollkorn",
            "Voltaire",
            "Waiting for the Sunrise",
            "Wallpoet",
            "Walter Turncoat",
            "Warnes",
            "Wellfleet",
            "Wendy One",
            "Wire One",
            "Work Sans",
            "Yanone Kaffeesatz",
            "Yantramanav",
            "Yellowtail",
            "Yeseva One",
            "Yesteryear",
            "Zeyada",
          ]);
      }.call(this));
    },
    function (e, t) {
      e.exports = f;
    },
    function (e, t) {
      e.exports = y;
    },
    function (e, t) {
      e.exports = m;
    },
    function (e, t) {
      e.exports = g;
    },
    function (e, t) {
      e.exports = v;
    },
    function (e, t, r) {
      "use strict";
      (function (e) {
        /*!
         * The buffer module from node.js, for the browser.
         *
         * @author   Feross Aboukhadijeh <http://feross.org>
         * @license  MIT
         */
        var n = r(24),
          o = r(25),
          i = r(26);
        function a() {
          return l.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
        }
        function s(e, t) {
          if (a() < t) throw new RangeError("Invalid typed array length");
          return (
            l.TYPED_ARRAY_SUPPORT
              ? ((e = new Uint8Array(t)).__proto__ = l.prototype)
              : (null === e && (e = new l(t)), (e.length = t)),
            e
          );
        }
        function l(e, t, r) {
          if (!(l.TYPED_ARRAY_SUPPORT || this instanceof l)) return new l(e, t, r);
          if ("number" == typeof e) {
            if ("string" == typeof t)
              throw new Error(
                "If encoding is specified then the first argument must be a string"
              );
            return p(this, e);
          }
          return u(this, e, t, r);
        }
        function u(e, t, r, n) {
          if ("number" == typeof t)
            throw new TypeError('"value" argument must not be a number');
          return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer
            ? (function (e, t, r, n) {
                if ((t.byteLength, r < 0 || t.byteLength < r))
                  throw new RangeError("'offset' is out of bounds");
                if (t.byteLength < r + (n || 0))
                  throw new RangeError("'length' is out of bounds");
                t =
                  void 0 === r && void 0 === n
                    ? new Uint8Array(t)
                    : void 0 === n
                    ? new Uint8Array(t, r)
                    : new Uint8Array(t, r, n);
                l.TYPED_ARRAY_SUPPORT ? ((e = t).__proto__ = l.prototype) : (e = h(e, t));
                return e;
              })(e, t, r, n)
            : "string" == typeof t
            ? (function (e, t, r) {
                ("string" == typeof r && "" !== r) || (r = "utf8");
                if (!l.isEncoding(r))
                  throw new TypeError('"encoding" must be a valid string encoding');
                var n = 0 | f(t, r),
                  o = (e = s(e, n)).write(t, r);
                o !== n && (e = e.slice(0, o));
                return e;
              })(e, t, r)
            : (function (e, t) {
                if (l.isBuffer(t)) {
                  var r = 0 | d(t.length);
                  return 0 === (e = s(e, r)).length ? e : (t.copy(e, 0, 0, r), e);
                }
                if (t) {
                  if (
                    ("undefined" != typeof ArrayBuffer &&
                      t.buffer instanceof ArrayBuffer) ||
                    "length" in t
                  )
                    return "number" != typeof t.length || (n = t.length) != n
                      ? s(e, 0)
                      : h(e, t);
                  if ("Buffer" === t.type && i(t.data)) return h(e, t.data);
                }
                var n;
                throw new TypeError(
                  "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
                );
              })(e, t);
        }
        function c(e) {
          if ("number" != typeof e)
            throw new TypeError('"size" argument must be a number');
          if (e < 0) throw new RangeError('"size" argument must not be negative');
        }
        function p(e, t) {
          if ((c(t), (e = s(e, t < 0 ? 0 : 0 | d(t))), !l.TYPED_ARRAY_SUPPORT))
            for (var r = 0; r < t; ++r) e[r] = 0;
          return e;
        }
        function h(e, t) {
          var r = t.length < 0 ? 0 : 0 | d(t.length);
          e = s(e, r);
          for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
          return e;
        }
        function d(e) {
          if (e >= a())
            throw new RangeError(
              "Attempt to allocate Buffer larger than maximum size: 0x" +
                a().toString(16) +
                " bytes"
            );
          return 0 | e;
        }
        function f(e, t) {
          if (l.isBuffer(e)) return e.length;
          if (
            "undefined" != typeof ArrayBuffer &&
            "function" == typeof ArrayBuffer.isView &&
            (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)
          )
            return e.byteLength;
          "string" != typeof e && (e = "" + e);
          var r = e.length;
          if (0 === r) return 0;
          for (var n = !1; ; )
            switch (t) {
              case "ascii":
              case "latin1":
              case "binary":
                return r;
              case "utf8":
              case "utf-8":
              case void 0:
                return B(e).length;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return 2 * r;
              case "hex":
                return r >>> 1;
              case "base64":
                return U(e).length;
              default:
                if (n) return B(e).length;
                (t = ("" + t).toLowerCase()), (n = !0);
            }
        }
        function y(e, t, r) {
          var n = !1;
          if (((void 0 === t || t < 0) && (t = 0), t > this.length)) return "";
          if (((void 0 === r || r > this.length) && (r = this.length), r <= 0)) return "";
          if ((r >>>= 0) <= (t >>>= 0)) return "";
          for (e || (e = "utf8"); ; )
            switch (e) {
              case "hex":
                return M(this, t, r);
              case "utf8":
              case "utf-8":
                return T(this, t, r);
              case "ascii":
                return O(this, t, r);
              case "latin1":
              case "binary":
                return E(this, t, r);
              case "base64":
                return j(this, t, r);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return z(this, t, r);
              default:
                if (n) throw new TypeError("Unknown encoding: " + e);
                (e = (e + "").toLowerCase()), (n = !0);
            }
        }
        function m(e, t, r) {
          var n = e[t];
          (e[t] = e[r]), (e[r] = n);
        }
        function g(e, t, r, n, o) {
          if (0 === e.length) return -1;
          if (
            ("string" == typeof r
              ? ((n = r), (r = 0))
              : r > 2147483647
              ? (r = 2147483647)
              : r < -2147483648 && (r = -2147483648),
            (r = +r),
            isNaN(r) && (r = o ? 0 : e.length - 1),
            r < 0 && (r = e.length + r),
            r >= e.length)
          ) {
            if (o) return -1;
            r = e.length - 1;
          } else if (r < 0) {
            if (!o) return -1;
            r = 0;
          }
          if (("string" == typeof t && (t = l.from(t, n)), l.isBuffer(t)))
            return 0 === t.length ? -1 : v(e, t, r, n, o);
          if ("number" == typeof t)
            return (
              (t &= 255),
              l.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf
                ? o
                  ? Uint8Array.prototype.indexOf.call(e, t, r)
                  : Uint8Array.prototype.lastIndexOf.call(e, t, r)
                : v(e, [t], r, n, o)
            );
          throw new TypeError("val must be string, number or Buffer");
        }
        function v(e, t, r, n, o) {
          var i,
            a = 1,
            s = e.length,
            l = t.length;
          if (
            void 0 !== n &&
            ("ucs2" === (n = String(n).toLowerCase()) ||
              "ucs-2" === n ||
              "utf16le" === n ||
              "utf-16le" === n)
          ) {
            if (e.length < 2 || t.length < 2) return -1;
            (a = 2), (s /= 2), (l /= 2), (r /= 2);
          }
          function u(e, t) {
            return 1 === a ? e[t] : e.readUInt16BE(t * a);
          }
          if (o) {
            var c = -1;
            for (i = r; i < s; i++)
              if (u(e, i) === u(t, -1 === c ? 0 : i - c)) {
                if ((-1 === c && (c = i), i - c + 1 === l)) return c * a;
              } else -1 !== c && (i -= i - c), (c = -1);
          } else
            for (r + l > s && (r = s - l), i = r; i >= 0; i--) {
              for (var p = !0, h = 0; h < l; h++)
                if (u(e, i + h) !== u(t, h)) {
                  p = !1;
                  break;
                }
              if (p) return i;
            }
          return -1;
        }
        function b(e, t, r, n) {
          r = Number(r) || 0;
          var o = e.length - r;
          n ? (n = Number(n)) > o && (n = o) : (n = o);
          var i = t.length;
          if (i % 2 != 0) throw new TypeError("Invalid hex string");
          n > i / 2 && (n = i / 2);
          for (var a = 0; a < n; ++a) {
            var s = parseInt(t.substr(2 * a, 2), 16);
            if (isNaN(s)) return a;
            e[r + a] = s;
          }
          return a;
        }
        function w(e, t, r, n) {
          return G(B(t, e.length - r), e, r, n);
        }
        function x(e, t, r, n) {
          return G(
            (function (e) {
              for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
              return t;
            })(t),
            e,
            r,
            n
          );
        }
        function k(e, t, r, n) {
          return x(e, t, r, n);
        }
        function S(e, t, r, n) {
          return G(U(t), e, r, n);
        }
        function _(e, t, r, n) {
          return G(
            (function (e, t) {
              for (var r, n, o, i = [], a = 0; a < e.length && !((t -= 2) < 0); ++a)
                (r = e.charCodeAt(a)), (n = r >> 8), (o = r % 256), i.push(o), i.push(n);
              return i;
            })(t, e.length - r),
            e,
            r,
            n
          );
        }
        function j(e, t, r) {
          return 0 === t && r === e.length
            ? n.fromByteArray(e)
            : n.fromByteArray(e.slice(t, r));
        }
        function T(e, t, r) {
          r = Math.min(e.length, r);
          for (var n = [], o = t; o < r; ) {
            var i,
              a,
              s,
              l,
              u = e[o],
              c = null,
              p = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
            if (o + p <= r)
              switch (p) {
                case 1:
                  u < 128 && (c = u);
                  break;
                case 2:
                  128 == (192 & (i = e[o + 1])) &&
                    (l = ((31 & u) << 6) | (63 & i)) > 127 &&
                    (c = l);
                  break;
                case 3:
                  (i = e[o + 1]),
                    (a = e[o + 2]),
                    128 == (192 & i) &&
                      128 == (192 & a) &&
                      (l = ((15 & u) << 12) | ((63 & i) << 6) | (63 & a)) > 2047 &&
                      (l < 55296 || l > 57343) &&
                      (c = l);
                  break;
                case 4:
                  (i = e[o + 1]),
                    (a = e[o + 2]),
                    (s = e[o + 3]),
                    128 == (192 & i) &&
                      128 == (192 & a) &&
                      128 == (192 & s) &&
                      (l =
                        ((15 & u) << 18) |
                        ((63 & i) << 12) |
                        ((63 & a) << 6) |
                        (63 & s)) > 65535 &&
                      l < 1114112 &&
                      (c = l);
              }
            null === c
              ? ((c = 65533), (p = 1))
              : c > 65535 &&
                ((c -= 65536),
                n.push(((c >>> 10) & 1023) | 55296),
                (c = 56320 | (1023 & c))),
              n.push(c),
              (o += p);
          }
          return (function (e) {
            var t = e.length;
            if (t <= A) return String.fromCharCode.apply(String, e);
            var r = "",
              n = 0;
            for (; n < t; ) r += String.fromCharCode.apply(String, e.slice(n, (n += A)));
            return r;
          })(n);
        }
        (t.Buffer = l),
          (t.SlowBuffer = function (e) {
            +e != e && (e = 0);
            return l.alloc(+e);
          }),
          (t.INSPECT_MAX_BYTES = 50),
          (l.TYPED_ARRAY_SUPPORT =
            void 0 !== e.TYPED_ARRAY_SUPPORT
              ? e.TYPED_ARRAY_SUPPORT
              : (function () {
                  try {
                    var e = new Uint8Array(1);
                    return (
                      (e.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function () {
                          return 42;
                        },
                      }),
                      42 === e.foo() &&
                        "function" == typeof e.subarray &&
                        0 === e.subarray(1, 1).byteLength
                    );
                  } catch (e) {
                    return !1;
                  }
                })()),
          (t.kMaxLength = a()),
          (l.poolSize = 8192),
          (l._augment = function (e) {
            return (e.__proto__ = l.prototype), e;
          }),
          (l.from = function (e, t, r) {
            return u(null, e, t, r);
          }),
          l.TYPED_ARRAY_SUPPORT &&
            ((l.prototype.__proto__ = Uint8Array.prototype),
            (l.__proto__ = Uint8Array),
            "undefined" != typeof Symbol &&
              Symbol.species &&
              l[Symbol.species] === l &&
              Object.defineProperty(l, Symbol.species, {
                value: null,
                configurable: !0,
              })),
          (l.alloc = function (e, t, r) {
            return (function (e, t, r, n) {
              return (
                c(t),
                t <= 0
                  ? s(e, t)
                  : void 0 !== r
                  ? "string" == typeof n
                    ? s(e, t).fill(r, n)
                    : s(e, t).fill(r)
                  : s(e, t)
              );
            })(null, e, t, r);
          }),
          (l.allocUnsafe = function (e) {
            return p(null, e);
          }),
          (l.allocUnsafeSlow = function (e) {
            return p(null, e);
          }),
          (l.isBuffer = function (e) {
            return !(null == e || !e._isBuffer);
          }),
          (l.compare = function (e, t) {
            if (!l.isBuffer(e) || !l.isBuffer(t))
              throw new TypeError("Arguments must be Buffers");
            if (e === t) return 0;
            for (var r = e.length, n = t.length, o = 0, i = Math.min(r, n); o < i; ++o)
              if (e[o] !== t[o]) {
                (r = e[o]), (n = t[o]);
                break;
              }
            return r < n ? -1 : n < r ? 1 : 0;
          }),
          (l.isEncoding = function (e) {
            switch (String(e).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "latin1":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return !0;
              default:
                return !1;
            }
          }),
          (l.concat = function (e, t) {
            if (!i(e)) throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === e.length) return l.alloc(0);
            var r;
            if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
            var n = l.allocUnsafe(t),
              o = 0;
            for (r = 0; r < e.length; ++r) {
              var a = e[r];
              if (!l.isBuffer(a))
                throw new TypeError('"list" argument must be an Array of Buffers');
              a.copy(n, o), (o += a.length);
            }
            return n;
          }),
          (l.byteLength = f),
          (l.prototype._isBuffer = !0),
          (l.prototype.swap16 = function () {
            var e = this.length;
            if (e % 2 != 0)
              throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t = 0; t < e; t += 2) m(this, t, t + 1);
            return this;
          }),
          (l.prototype.swap32 = function () {
            var e = this.length;
            if (e % 4 != 0)
              throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t = 0; t < e; t += 4) m(this, t, t + 3), m(this, t + 1, t + 2);
            return this;
          }),
          (l.prototype.swap64 = function () {
            var e = this.length;
            if (e % 8 != 0)
              throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t = 0; t < e; t += 8)
              m(this, t, t + 7),
                m(this, t + 1, t + 6),
                m(this, t + 2, t + 5),
                m(this, t + 3, t + 4);
            return this;
          }),
          (l.prototype.toString = function () {
            var e = 0 | this.length;
            return 0 === e
              ? ""
              : 0 === arguments.length
              ? T(this, 0, e)
              : y.apply(this, arguments);
          }),
          (l.prototype.equals = function (e) {
            if (!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === l.compare(this, e);
          }),
          (l.prototype.inspect = function () {
            var e = "",
              r = t.INSPECT_MAX_BYTES;
            return (
              this.length > 0 &&
                ((e = this.toString("hex", 0, r).match(/.{2}/g).join(" ")),
                this.length > r && (e += " ... ")),
              "<Buffer " + e + ">"
            );
          }),
          (l.prototype.compare = function (e, t, r, n, o) {
            if (!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            if (
              (void 0 === t && (t = 0),
              void 0 === r && (r = e ? e.length : 0),
              void 0 === n && (n = 0),
              void 0 === o && (o = this.length),
              t < 0 || r > e.length || n < 0 || o > this.length)
            )
              throw new RangeError("out of range index");
            if (n >= o && t >= r) return 0;
            if (n >= o) return -1;
            if (t >= r) return 1;
            if (this === e) return 0;
            for (
              var i = (o >>>= 0) - (n >>>= 0),
                a = (r >>>= 0) - (t >>>= 0),
                s = Math.min(i, a),
                u = this.slice(n, o),
                c = e.slice(t, r),
                p = 0;
              p < s;
              ++p
            )
              if (u[p] !== c[p]) {
                (i = u[p]), (a = c[p]);
                break;
              }
            return i < a ? -1 : a < i ? 1 : 0;
          }),
          (l.prototype.includes = function (e, t, r) {
            return -1 !== this.indexOf(e, t, r);
          }),
          (l.prototype.indexOf = function (e, t, r) {
            return g(this, e, t, r, !0);
          }),
          (l.prototype.lastIndexOf = function (e, t, r) {
            return g(this, e, t, r, !1);
          }),
          (l.prototype.write = function (e, t, r, n) {
            if (void 0 === t) (n = "utf8"), (r = this.length), (t = 0);
            else if (void 0 === r && "string" == typeof t)
              (n = t), (r = this.length), (t = 0);
            else {
              if (!isFinite(t))
                throw new Error(
                  "Buffer.write(string, encoding, offset[, length]) is no longer supported"
                );
              (t |= 0),
                isFinite(r)
                  ? ((r |= 0), void 0 === n && (n = "utf8"))
                  : ((n = r), (r = void 0));
            }
            var o = this.length - t;
            if (
              ((void 0 === r || r > o) && (r = o),
              (e.length > 0 && (r < 0 || t < 0)) || t > this.length)
            )
              throw new RangeError("Attempt to write outside buffer bounds");
            n || (n = "utf8");
            for (var i = !1; ; )
              switch (n) {
                case "hex":
                  return b(this, e, t, r);
                case "utf8":
                case "utf-8":
                  return w(this, e, t, r);
                case "ascii":
                  return x(this, e, t, r);
                case "latin1":
                case "binary":
                  return k(this, e, t, r);
                case "base64":
                  return S(this, e, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return _(this, e, t, r);
                default:
                  if (i) throw new TypeError("Unknown encoding: " + n);
                  (n = ("" + n).toLowerCase()), (i = !0);
              }
          }),
          (l.prototype.toJSON = function () {
            return {
              type: "Buffer",
              data: Array.prototype.slice.call(this._arr || this, 0),
            };
          });
        var A = 4096;
        function O(e, t, r) {
          var n = "";
          r = Math.min(e.length, r);
          for (var o = t; o < r; ++o) n += String.fromCharCode(127 & e[o]);
          return n;
        }
        function E(e, t, r) {
          var n = "";
          r = Math.min(e.length, r);
          for (var o = t; o < r; ++o) n += String.fromCharCode(e[o]);
          return n;
        }
        function M(e, t, r) {
          var n = e.length;
          (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
          for (var o = "", i = t; i < r; ++i) o += D(e[i]);
          return o;
        }
        function z(e, t, r) {
          for (var n = e.slice(t, r), o = "", i = 0; i < n.length; i += 2)
            o += String.fromCharCode(n[i] + 256 * n[i + 1]);
          return o;
        }
        function C(e, t, r) {
          if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
          if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
        }
        function I(e, t, r, n, o, i) {
          if (!l.isBuffer(e))
            throw new TypeError('"buffer" argument must be a Buffer instance');
          if (t > o || t < i) throw new RangeError('"value" argument is out of bounds');
          if (r + n > e.length) throw new RangeError("Index out of range");
        }
        function P(e, t, r, n) {
          t < 0 && (t = 65535 + t + 1);
          for (var o = 0, i = Math.min(e.length - r, 2); o < i; ++o)
            e[r + o] = (t & (255 << (8 * (n ? o : 1 - o)))) >>> (8 * (n ? o : 1 - o));
        }
        function R(e, t, r, n) {
          t < 0 && (t = 4294967295 + t + 1);
          for (var o = 0, i = Math.min(e.length - r, 4); o < i; ++o)
            e[r + o] = (t >>> (8 * (n ? o : 3 - o))) & 255;
        }
        function N(e, t, r, n, o, i) {
          if (r + n > e.length) throw new RangeError("Index out of range");
          if (r < 0) throw new RangeError("Index out of range");
        }
        function q(e, t, r, n, i) {
          return i || N(e, 0, r, 4), o.write(e, t, r, n, 23, 4), r + 4;
        }
        function L(e, t, r, n, i) {
          return i || N(e, 0, r, 8), o.write(e, t, r, n, 52, 8), r + 8;
        }
        (l.prototype.slice = function (e, t) {
          var r,
            n = this.length;
          if (
            ((e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
            (t = void 0 === t ? n : ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
            t < e && (t = e),
            l.TYPED_ARRAY_SUPPORT)
          )
            (r = this.subarray(e, t)).__proto__ = l.prototype;
          else {
            var o = t - e;
            r = new l(o, void 0);
            for (var i = 0; i < o; ++i) r[i] = this[i + e];
          }
          return r;
        }),
          (l.prototype.readUIntLE = function (e, t, r) {
            (e |= 0), (t |= 0), r || C(e, t, this.length);
            for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256); )
              n += this[e + i] * o;
            return n;
          }),
          (l.prototype.readUIntBE = function (e, t, r) {
            (e |= 0), (t |= 0), r || C(e, t, this.length);
            for (var n = this[e + --t], o = 1; t > 0 && (o *= 256); )
              n += this[e + --t] * o;
            return n;
          }),
          (l.prototype.readUInt8 = function (e, t) {
            return t || C(e, 1, this.length), this[e];
          }),
          (l.prototype.readUInt16LE = function (e, t) {
            return t || C(e, 2, this.length), this[e] | (this[e + 1] << 8);
          }),
          (l.prototype.readUInt16BE = function (e, t) {
            return t || C(e, 2, this.length), (this[e] << 8) | this[e + 1];
          }),
          (l.prototype.readUInt32LE = function (e, t) {
            return (
              t || C(e, 4, this.length),
              (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) +
                16777216 * this[e + 3]
            );
          }),
          (l.prototype.readUInt32BE = function (e, t) {
            return (
              t || C(e, 4, this.length),
              16777216 * this[e] +
                ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
            );
          }),
          (l.prototype.readIntLE = function (e, t, r) {
            (e |= 0), (t |= 0), r || C(e, t, this.length);
            for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256); )
              n += this[e + i] * o;
            return n >= (o *= 128) && (n -= Math.pow(2, 8 * t)), n;
          }),
          (l.prototype.readIntBE = function (e, t, r) {
            (e |= 0), (t |= 0), r || C(e, t, this.length);
            for (var n = t, o = 1, i = this[e + --n]; n > 0 && (o *= 256); )
              i += this[e + --n] * o;
            return i >= (o *= 128) && (i -= Math.pow(2, 8 * t)), i;
          }),
          (l.prototype.readInt8 = function (e, t) {
            return (
              t || C(e, 1, this.length),
              128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
            );
          }),
          (l.prototype.readInt16LE = function (e, t) {
            t || C(e, 2, this.length);
            var r = this[e] | (this[e + 1] << 8);
            return 32768 & r ? 4294901760 | r : r;
          }),
          (l.prototype.readInt16BE = function (e, t) {
            t || C(e, 2, this.length);
            var r = this[e + 1] | (this[e] << 8);
            return 32768 & r ? 4294901760 | r : r;
          }),
          (l.prototype.readInt32LE = function (e, t) {
            return (
              t || C(e, 4, this.length),
              this[e] | (this[e + 1] << 8) | (this[e + 2] << 16) | (this[e + 3] << 24)
            );
          }),
          (l.prototype.readInt32BE = function (e, t) {
            return (
              t || C(e, 4, this.length),
              (this[e] << 24) | (this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3]
            );
          }),
          (l.prototype.readFloatLE = function (e, t) {
            return t || C(e, 4, this.length), o.read(this, e, !0, 23, 4);
          }),
          (l.prototype.readFloatBE = function (e, t) {
            return t || C(e, 4, this.length), o.read(this, e, !1, 23, 4);
          }),
          (l.prototype.readDoubleLE = function (e, t) {
            return t || C(e, 8, this.length), o.read(this, e, !0, 52, 8);
          }),
          (l.prototype.readDoubleBE = function (e, t) {
            return t || C(e, 8, this.length), o.read(this, e, !1, 52, 8);
          }),
          (l.prototype.writeUIntLE = function (e, t, r, n) {
            ((e = +e), (t |= 0), (r |= 0), n) ||
              I(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var o = 1,
              i = 0;
            for (this[t] = 255 & e; ++i < r && (o *= 256); ) this[t + i] = (e / o) & 255;
            return t + r;
          }),
          (l.prototype.writeUIntBE = function (e, t, r, n) {
            ((e = +e), (t |= 0), (r |= 0), n) ||
              I(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var o = r - 1,
              i = 1;
            for (this[t + o] = 255 & e; --o >= 0 && (i *= 256); )
              this[t + o] = (e / i) & 255;
            return t + r;
          }),
          (l.prototype.writeUInt8 = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 1, 255, 0),
              l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
              (this[t] = 255 & e),
              t + 1
            );
          }),
          (l.prototype.writeUInt16LE = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 2, 65535, 0),
              l.TYPED_ARRAY_SUPPORT
                ? ((this[t] = 255 & e), (this[t + 1] = e >>> 8))
                : P(this, e, t, !0),
              t + 2
            );
          }),
          (l.prototype.writeUInt16BE = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 2, 65535, 0),
              l.TYPED_ARRAY_SUPPORT
                ? ((this[t] = e >>> 8), (this[t + 1] = 255 & e))
                : P(this, e, t, !1),
              t + 2
            );
          }),
          (l.prototype.writeUInt32LE = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 4, 4294967295, 0),
              l.TYPED_ARRAY_SUPPORT
                ? ((this[t + 3] = e >>> 24),
                  (this[t + 2] = e >>> 16),
                  (this[t + 1] = e >>> 8),
                  (this[t] = 255 & e))
                : R(this, e, t, !0),
              t + 4
            );
          }),
          (l.prototype.writeUInt32BE = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 4, 4294967295, 0),
              l.TYPED_ARRAY_SUPPORT
                ? ((this[t] = e >>> 24),
                  (this[t + 1] = e >>> 16),
                  (this[t + 2] = e >>> 8),
                  (this[t + 3] = 255 & e))
                : R(this, e, t, !1),
              t + 4
            );
          }),
          (l.prototype.writeIntLE = function (e, t, r, n) {
            if (((e = +e), (t |= 0), !n)) {
              var o = Math.pow(2, 8 * r - 1);
              I(this, e, t, r, o - 1, -o);
            }
            var i = 0,
              a = 1,
              s = 0;
            for (this[t] = 255 & e; ++i < r && (a *= 256); )
              e < 0 && 0 === s && 0 !== this[t + i - 1] && (s = 1),
                (this[t + i] = (((e / a) >> 0) - s) & 255);
            return t + r;
          }),
          (l.prototype.writeIntBE = function (e, t, r, n) {
            if (((e = +e), (t |= 0), !n)) {
              var o = Math.pow(2, 8 * r - 1);
              I(this, e, t, r, o - 1, -o);
            }
            var i = r - 1,
              a = 1,
              s = 0;
            for (this[t + i] = 255 & e; --i >= 0 && (a *= 256); )
              e < 0 && 0 === s && 0 !== this[t + i + 1] && (s = 1),
                (this[t + i] = (((e / a) >> 0) - s) & 255);
            return t + r;
          }),
          (l.prototype.writeInt8 = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 1, 127, -128),
              l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
              e < 0 && (e = 255 + e + 1),
              (this[t] = 255 & e),
              t + 1
            );
          }),
          (l.prototype.writeInt16LE = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 2, 32767, -32768),
              l.TYPED_ARRAY_SUPPORT
                ? ((this[t] = 255 & e), (this[t + 1] = e >>> 8))
                : P(this, e, t, !0),
              t + 2
            );
          }),
          (l.prototype.writeInt16BE = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 2, 32767, -32768),
              l.TYPED_ARRAY_SUPPORT
                ? ((this[t] = e >>> 8), (this[t + 1] = 255 & e))
                : P(this, e, t, !1),
              t + 2
            );
          }),
          (l.prototype.writeInt32LE = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 4, 2147483647, -2147483648),
              l.TYPED_ARRAY_SUPPORT
                ? ((this[t] = 255 & e),
                  (this[t + 1] = e >>> 8),
                  (this[t + 2] = e >>> 16),
                  (this[t + 3] = e >>> 24))
                : R(this, e, t, !0),
              t + 4
            );
          }),
          (l.prototype.writeInt32BE = function (e, t, r) {
            return (
              (e = +e),
              (t |= 0),
              r || I(this, e, t, 4, 2147483647, -2147483648),
              e < 0 && (e = 4294967295 + e + 1),
              l.TYPED_ARRAY_SUPPORT
                ? ((this[t] = e >>> 24),
                  (this[t + 1] = e >>> 16),
                  (this[t + 2] = e >>> 8),
                  (this[t + 3] = 255 & e))
                : R(this, e, t, !1),
              t + 4
            );
          }),
          (l.prototype.writeFloatLE = function (e, t, r) {
            return q(this, e, t, !0, r);
          }),
          (l.prototype.writeFloatBE = function (e, t, r) {
            return q(this, e, t, !1, r);
          }),
          (l.prototype.writeDoubleLE = function (e, t, r) {
            return L(this, e, t, !0, r);
          }),
          (l.prototype.writeDoubleBE = function (e, t, r) {
            return L(this, e, t, !1, r);
          }),
          (l.prototype.copy = function (e, t, r, n) {
            if (
              (r || (r = 0),
              n || 0 === n || (n = this.length),
              t >= e.length && (t = e.length),
              t || (t = 0),
              n > 0 && n < r && (n = r),
              n === r)
            )
              return 0;
            if (0 === e.length || 0 === this.length) return 0;
            if (t < 0) throw new RangeError("targetStart out of bounds");
            if (r < 0 || r >= this.length)
              throw new RangeError("sourceStart out of bounds");
            if (n < 0) throw new RangeError("sourceEnd out of bounds");
            n > this.length && (n = this.length),
              e.length - t < n - r && (n = e.length - t + r);
            var o,
              i = n - r;
            if (this === e && r < t && t < n)
              for (o = i - 1; o >= 0; --o) e[o + t] = this[o + r];
            else if (i < 1e3 || !l.TYPED_ARRAY_SUPPORT)
              for (o = 0; o < i; ++o) e[o + t] = this[o + r];
            else Uint8Array.prototype.set.call(e, this.subarray(r, r + i), t);
            return i;
          }),
          (l.prototype.fill = function (e, t, r, n) {
            if ("string" == typeof e) {
              if (
                ("string" == typeof t
                  ? ((n = t), (t = 0), (r = this.length))
                  : "string" == typeof r && ((n = r), (r = this.length)),
                1 === e.length)
              ) {
                var o = e.charCodeAt(0);
                o < 256 && (e = o);
              }
              if (void 0 !== n && "string" != typeof n)
                throw new TypeError("encoding must be a string");
              if ("string" == typeof n && !l.isEncoding(n))
                throw new TypeError("Unknown encoding: " + n);
            } else "number" == typeof e && (e &= 255);
            if (t < 0 || this.length < t || this.length < r)
              throw new RangeError("Out of range index");
            if (r <= t) return this;
            var i;
            if (
              ((t >>>= 0),
              (r = void 0 === r ? this.length : r >>> 0),
              e || (e = 0),
              "number" == typeof e)
            )
              for (i = t; i < r; ++i) this[i] = e;
            else {
              var a = l.isBuffer(e) ? e : B(new l(e, n).toString()),
                s = a.length;
              for (i = 0; i < r - t; ++i) this[i + t] = a[i % s];
            }
            return this;
          });
        var F = /[^+\/0-9A-Za-z-_]/g;
        function D(e) {
          return e < 16 ? "0" + e.toString(16) : e.toString(16);
        }
        function B(e, t) {
          var r;
          t = t || 1 / 0;
          for (var n = e.length, o = null, i = [], a = 0; a < n; ++a) {
            if ((r = e.charCodeAt(a)) > 55295 && r < 57344) {
              if (!o) {
                if (r > 56319) {
                  (t -= 3) > -1 && i.push(239, 191, 189);
                  continue;
                }
                if (a + 1 === n) {
                  (t -= 3) > -1 && i.push(239, 191, 189);
                  continue;
                }
                o = r;
                continue;
              }
              if (r < 56320) {
                (t -= 3) > -1 && i.push(239, 191, 189), (o = r);
                continue;
              }
              r = 65536 + (((o - 55296) << 10) | (r - 56320));
            } else o && (t -= 3) > -1 && i.push(239, 191, 189);
            if (((o = null), r < 128)) {
              if ((t -= 1) < 0) break;
              i.push(r);
            } else if (r < 2048) {
              if ((t -= 2) < 0) break;
              i.push((r >> 6) | 192, (63 & r) | 128);
            } else if (r < 65536) {
              if ((t -= 3) < 0) break;
              i.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
            } else {
              if (!(r < 1114112)) throw new Error("Invalid code point");
              if ((t -= 4) < 0) break;
              i.push(
                (r >> 18) | 240,
                ((r >> 12) & 63) | 128,
                ((r >> 6) & 63) | 128,
                (63 & r) | 128
              );
            }
          }
          return i;
        }
        function U(e) {
          return n.toByteArray(
            (function (e) {
              if (
                (e = (function (e) {
                  if (e.trim) return e.trim();
                  return e.replace(/^\s+|\s+$/g, "");
                })(e).replace(F, "")).length < 2
              )
                return "";
              for (; e.length % 4 != 0; ) e += "=";
              return e;
            })(e)
          );
        }
        function G(e, t, r, n) {
          for (var o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o)
            t[o + r] = e[o];
          return o;
        }
      }.call(this, r(15)));
    },
    function (e, t, r) {
      "use strict";
      (t.byteLength = function (e) {
        var t = u(e),
          r = t[0],
          n = t[1];
        return (3 * (r + n)) / 4 - n;
      }),
        (t.toByteArray = function (e) {
          var t,
            r,
            n = u(e),
            a = n[0],
            s = n[1],
            l = new i(
              (function (e, t, r) {
                return (3 * (t + r)) / 4 - r;
              })(0, a, s)
            ),
            c = 0,
            p = s > 0 ? a - 4 : a;
          for (r = 0; r < p; r += 4)
            (t =
              (o[e.charCodeAt(r)] << 18) |
              (o[e.charCodeAt(r + 1)] << 12) |
              (o[e.charCodeAt(r + 2)] << 6) |
              o[e.charCodeAt(r + 3)]),
              (l[c++] = (t >> 16) & 255),
              (l[c++] = (t >> 8) & 255),
              (l[c++] = 255 & t);
          2 === s &&
            ((t = (o[e.charCodeAt(r)] << 2) | (o[e.charCodeAt(r + 1)] >> 4)),
            (l[c++] = 255 & t));
          1 === s &&
            ((t =
              (o[e.charCodeAt(r)] << 10) |
              (o[e.charCodeAt(r + 1)] << 4) |
              (o[e.charCodeAt(r + 2)] >> 2)),
            (l[c++] = (t >> 8) & 255),
            (l[c++] = 255 & t));
          return l;
        }),
        (t.fromByteArray = function (e) {
          for (
            var t, r = e.length, o = r % 3, i = [], a = 0, s = r - o;
            a < s;
            a += 16383
          )
            i.push(c(e, a, a + 16383 > s ? s : a + 16383));
          1 === o
            ? ((t = e[r - 1]), i.push(n[t >> 2] + n[(t << 4) & 63] + "=="))
            : 2 === o &&
              ((t = (e[r - 2] << 8) + e[r - 1]),
              i.push(n[t >> 10] + n[(t >> 4) & 63] + n[(t << 2) & 63] + "="));
          return i.join("");
        });
      for (
        var n = [],
          o = [],
          i = "undefined" != typeof Uint8Array ? Uint8Array : Array,
          a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
          s = 0,
          l = a.length;
        s < l;
        ++s
      )
        (n[s] = a[s]), (o[a.charCodeAt(s)] = s);
      function u(e) {
        var t = e.length;
        if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var r = e.indexOf("=");
        return -1 === r && (r = t), [r, r === t ? 0 : 4 - (r % 4)];
      }
      function c(e, t, r) {
        for (var o, i, a = [], s = t; s < r; s += 3)
          (o = ((e[s] << 16) & 16711680) + ((e[s + 1] << 8) & 65280) + (255 & e[s + 2])),
            a.push(
              n[((i = o) >> 18) & 63] + n[(i >> 12) & 63] + n[(i >> 6) & 63] + n[63 & i]
            );
        return a.join("");
      }
      (o["-".charCodeAt(0)] = 62), (o["_".charCodeAt(0)] = 63);
    },
    function (e, t) {
      (t.read = function (e, t, r, n, o) {
        var i,
          a,
          s = 8 * o - n - 1,
          l = (1 << s) - 1,
          u = l >> 1,
          c = -7,
          p = r ? o - 1 : 0,
          h = r ? -1 : 1,
          d = e[t + p];
        for (
          p += h, i = d & ((1 << -c) - 1), d >>= -c, c += s;
          c > 0;
          i = 256 * i + e[t + p], p += h, c -= 8
        );
        for (
          a = i & ((1 << -c) - 1), i >>= -c, c += n;
          c > 0;
          a = 256 * a + e[t + p], p += h, c -= 8
        );
        if (0 === i) i = 1 - u;
        else {
          if (i === l) return a ? NaN : (1 / 0) * (d ? -1 : 1);
          (a += Math.pow(2, n)), (i -= u);
        }
        return (d ? -1 : 1) * a * Math.pow(2, i - n);
      }),
        (t.write = function (e, t, r, n, o, i) {
          var a,
            s,
            l,
            u = 8 * i - o - 1,
            c = (1 << u) - 1,
            p = c >> 1,
            h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
            d = n ? 0 : i - 1,
            f = n ? 1 : -1,
            y = t < 0 || (0 === t && 1 / t < 0) ? 1 : 0;
          for (
            t = Math.abs(t),
              isNaN(t) || t === 1 / 0
                ? ((s = isNaN(t) ? 1 : 0), (a = c))
                : ((a = Math.floor(Math.log(t) / Math.LN2)),
                  t * (l = Math.pow(2, -a)) < 1 && (a--, (l *= 2)),
                  (t += a + p >= 1 ? h / l : h * Math.pow(2, 1 - p)) * l >= 2 &&
                    (a++, (l /= 2)),
                  a + p >= c
                    ? ((s = 0), (a = c))
                    : a + p >= 1
                    ? ((s = (t * l - 1) * Math.pow(2, o)), (a += p))
                    : ((s = t * Math.pow(2, p - 1) * Math.pow(2, o)), (a = 0)));
            o >= 8;
            e[r + d] = 255 & s, d += f, s /= 256, o -= 8
          );
          for (
            a = (a << o) | s, u += o;
            u > 0;
            e[r + d] = 255 & a, d += f, a /= 256, u -= 8
          );
          e[r + d - f] |= 128 * y;
        });
    },
    function (e, t) {
      var r = {}.toString;
      e.exports =
        Array.isArray ||
        function (e) {
          return "[object Array]" == r.call(e);
        };
    },
    function (e, t, r) {
      "use strict";
      r.r(t);
      var n = r(5),
        o = r.n(n),
        i = r(1),
        a = r.n(i),
        s = r(2),
        l = r.n(s),
        u = r(3),
        c = r.n(u),
        p = r(7),
        h = r.n(p),
        d = (function () {
          function e(e) {
            var t = e || {};
            this.color_ = void 0 !== t.color ? t.color : null;
          }
          return (
            (e.prototype.clone = function () {
              var t = this.getColor();
              return new e({ color: Array.isArray(t) ? t.slice() : t || void 0 });
            }),
            (e.prototype.getColor = function () {
              return this.color_;
            }),
            (e.prototype.setColor = function (e) {
              this.color_ = e;
            }),
            e
          );
        })(),
        f = { POINT: "point", LINE: "line" },
        y = "#333",
        m = (function () {
          function e(e) {
            var t = e || {};
            (this.font_ = t.font),
              (this.rotation_ = t.rotation),
              (this.rotateWithView_ = t.rotateWithView),
              (this.scale_ = t.scale),
              (this.text_ = t.text),
              (this.textAlign_ = t.textAlign),
              (this.textBaseline_ = t.textBaseline),
              (this.fill_ = void 0 !== t.fill ? t.fill : new d({ color: y })),
              (this.maxAngle_ = void 0 !== t.maxAngle ? t.maxAngle : Math.PI / 4),
              (this.placement_ = void 0 !== t.placement ? t.placement : f.POINT),
              (this.overflow_ = !!t.overflow),
              (this.stroke_ = void 0 !== t.stroke ? t.stroke : null),
              (this.offsetX_ = void 0 !== t.offsetX ? t.offsetX : 0),
              (this.offsetY_ = void 0 !== t.offsetY ? t.offsetY : 0),
              (this.backgroundFill_ = t.backgroundFill ? t.backgroundFill : null),
              (this.backgroundStroke_ = t.backgroundStroke ? t.backgroundStroke : null),
              (this.padding_ = void 0 === t.padding ? null : t.padding);
          }
          return (
            (e.prototype.clone = function () {
              return new e({
                font: this.getFont(),
                placement: this.getPlacement(),
                maxAngle: this.getMaxAngle(),
                overflow: this.getOverflow(),
                rotation: this.getRotation(),
                rotateWithView: this.getRotateWithView(),
                scale: this.getScale(),
                text: this.getText(),
                textAlign: this.getTextAlign(),
                textBaseline: this.getTextBaseline(),
                fill: this.getFill() ? this.getFill().clone() : void 0,
                stroke: this.getStroke() ? this.getStroke().clone() : void 0,
                offsetX: this.getOffsetX(),
                offsetY: this.getOffsetY(),
                backgroundFill: this.getBackgroundFill()
                  ? this.getBackgroundFill().clone()
                  : void 0,
                backgroundStroke: this.getBackgroundStroke()
                  ? this.getBackgroundStroke().clone()
                  : void 0,
                padding: this.getPadding(),
              });
            }),
            (e.prototype.getOverflow = function () {
              return this.overflow_;
            }),
            (e.prototype.getFont = function () {
              return this.font_;
            }),
            (e.prototype.getMaxAngle = function () {
              return this.maxAngle_;
            }),
            (e.prototype.getPlacement = function () {
              return this.placement_;
            }),
            (e.prototype.getOffsetX = function () {
              return this.offsetX_;
            }),
            (e.prototype.getOffsetY = function () {
              return this.offsetY_;
            }),
            (e.prototype.getFill = function () {
              return this.fill_;
            }),
            (e.prototype.getRotateWithView = function () {
              return this.rotateWithView_;
            }),
            (e.prototype.getRotation = function () {
              return this.rotation_;
            }),
            (e.prototype.getScale = function () {
              return this.scale_;
            }),
            (e.prototype.getStroke = function () {
              return this.stroke_;
            }),
            (e.prototype.getText = function () {
              return this.text_;
            }),
            (e.prototype.getTextAlign = function () {
              return this.textAlign_;
            }),
            (e.prototype.getTextBaseline = function () {
              return this.textBaseline_;
            }),
            (e.prototype.getBackgroundFill = function () {
              return this.backgroundFill_;
            }),
            (e.prototype.getBackgroundStroke = function () {
              return this.backgroundStroke_;
            }),
            (e.prototype.getPadding = function () {
              return this.padding_;
            }),
            (e.prototype.setOverflow = function (e) {
              this.overflow_ = e;
            }),
            (e.prototype.setFont = function (e) {
              this.font_ = e;
            }),
            (e.prototype.setMaxAngle = function (e) {
              this.maxAngle_ = e;
            }),
            (e.prototype.setOffsetX = function (e) {
              this.offsetX_ = e;
            }),
            (e.prototype.setOffsetY = function (e) {
              this.offsetY_ = e;
            }),
            (e.prototype.setPlacement = function (e) {
              this.placement_ = e;
            }),
            (e.prototype.setRotateWithView = function (e) {
              this.rotateWithView_ = e;
            }),
            (e.prototype.setFill = function (e) {
              this.fill_ = e;
            }),
            (e.prototype.setRotation = function (e) {
              this.rotation_ = e;
            }),
            (e.prototype.setScale = function (e) {
              this.scale_ = e;
            }),
            (e.prototype.setStroke = function (e) {
              this.stroke_ = e;
            }),
            (e.prototype.setText = function (e) {
              this.text_ = e;
            }),
            (e.prototype.setTextAlign = function (e) {
              this.textAlign_ = e;
            }),
            (e.prototype.setTextBaseline = function (e) {
              this.textBaseline_ = e;
            }),
            (e.prototype.setBackgroundFill = function (e) {
              this.backgroundFill_ = e;
            }),
            (e.prototype.setBackgroundStroke = function (e) {
              this.backgroundStroke_ = e;
            }),
            (e.prototype.setPadding = function (e) {
              this.padding_ = e;
            }),
            e
          );
        })(),
        g = r(16),
        v = r.n(g);
      function b(e, t) {
        return e > t ? 1 : e < t ? -1 : 0;
      }
      function w(e, t) {
        for (var r = Array.isArray(t) ? t : [t], n = r.length, o = 0; o < n; o++)
          e[e.length] = r[o];
      }
      var x = 0;
      function k(e) {
        return e.ol_uid || (e.ol_uid = String(++x));
      }
      var S,
        _ = "6.1.1",
        j =
          ((S = function (e, t) {
            return (S =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (e, t) {
                  e.__proto__ = t;
                }) ||
              function (e, t) {
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
              })(e, t);
          }),
          function (e, t) {
            function r() {
              this.constructor = e;
            }
            S(e, t),
              (e.prototype =
                null === t ? Object.create(t) : ((r.prototype = t.prototype), new r()));
          }),
        T = (function (e) {
          function t(t) {
            var r = this,
              n =
                "Assertion failed. See https://openlayers.org/en/" +
                ("latest" === _ ? _ : "v" + _.split("-")[0]) +
                "/doc/errors/#" +
                t +
                " for details.";
            return (
              ((r = e.call(this, n) || this).code = t),
              (r.name = "AssertionError"),
              (r.message = n),
              r
            );
          }
          return j(t, e), t;
        })(Error);
      function A(e, t) {
        if (!e) throw new T(t);
      }
      function O(e, t, r, n, o) {
        return o ? ((o[0] = e), (o[1] = t), (o[2] = r), (o[3] = n), o) : [e, t, r, n];
      }
      function E(e) {
        return O(1 / 0, 1 / 0, -1 / 0, -1 / 0, e);
      }
      function M(e, t, r, n, o) {
        return (function (e, t, r, n, o) {
          for (; r < n; r += o) z(e, t[r], t[r + 1]);
          return e;
        })(E(o), e, t, r, n);
      }
      function z(e, t, r) {
        (e[0] = Math.min(e[0], t)),
          (e[1] = Math.min(e[1], r)),
          (e[2] = Math.max(e[2], t)),
          (e[3] = Math.max(e[3], r));
      }
      function C(e) {
        return e[3] - e[1];
      }
      var I = {
        POINT: "Point",
        LINE_STRING: "LineString",
        LINEAR_RING: "LinearRing",
        POLYGON: "Polygon",
        MULTI_POINT: "MultiPoint",
        MULTI_LINE_STRING: "MultiLineString",
        MULTI_POLYGON: "MultiPolygon",
        GEOMETRY_COLLECTION: "GeometryCollection",
        CIRCLE: "Circle",
      };
      function P(e, t, r, n, o, i) {
        for (var a = 0, s = e[r - n], l = e[r - n + 1]; t < r; t += n) {
          var u = e[t],
            c = e[t + 1];
          l <= i
            ? c > i && (u - s) * (i - l) - (o - s) * (c - l) > 0 && a++
            : c <= i && (u - s) * (i - l) - (o - s) * (c - l) < 0 && a--,
            (s = u),
            (l = c);
        }
        return 0 !== a;
      }
      function R(e, t, r, n, o, i) {
        if (0 === r.length) return !1;
        if (!P(e, t, r[0], n, o, i)) return !1;
        for (var a = 1, s = r.length; a < s; ++a)
          if (P(e, r[a - 1], r[a], n, o, i)) return !1;
        return !0;
      }
      function N(e, t, r, n, o, i, a) {
        for (
          var s, l, u, c, p, h, d, f = o[i + 1], y = [], m = 0, g = r.length;
          m < g;
          ++m
        ) {
          var v = r[m];
          for (c = e[v - n], h = e[v - n + 1], s = t; s < v; s += n)
            (p = e[s]),
              (d = e[s + 1]),
              ((f <= h && d <= f) || (h <= f && f <= d)) &&
                ((u = ((f - h) / (d - h)) * (p - c) + c), y.push(u)),
              (c = p),
              (h = d);
        }
        var w = NaN,
          x = -1 / 0;
        for (y.sort(b), c = y[0], s = 1, l = y.length; s < l; ++s) {
          p = y[s];
          var k = Math.abs(p - c);
          k > x && R(e, t, r, n, (u = (c + p) / 2), f) && ((w = u), (x = k)), (c = p);
        }
        return isNaN(w) && (w = o[i]), a ? (a.push(w, f, x), a) : [w, f, x];
      }
      var q =
        "cosh" in Math
          ? Math.cosh
          : function (e) {
              var t = Math.exp(e);
              return (t + 1 / t) / 2;
            };
      function L(e, t, r) {
        return e + r * (t - e);
      }
      function F(e, t, r, n, o, i) {
        var a = NaN,
          s = NaN,
          l = (r - t) / n;
        if (1 === l) (a = e[t]), (s = e[t + 1]);
        else if (2 == l)
          (a = (1 - o) * e[t] + o * e[t + n]),
            (s = (1 - o) * e[t + 1] + o * e[t + n + 1]);
        else if (0 !== l) {
          for (var u = e[t], c = e[t + 1], p = 0, h = [0], d = t + n; d < r; d += n) {
            var f = e[d],
              y = e[d + 1];
            (p += Math.sqrt((f - u) * (f - u) + (y - c) * (y - c))),
              h.push(p),
              (u = f),
              (c = y);
          }
          var m = o * p,
            g = (function (e, t, r) {
              for (var n, o, i = r || b, a = 0, s = e.length, l = !1; a < s; )
                (o = +i(e[(n = a + ((s - a) >> 1))], t)) < 0
                  ? (a = n + 1)
                  : ((s = n), (l = !o));
              return l ? a : ~a;
            })(h, m);
          if (g < 0) {
            var v = (m - h[-g - 2]) / (h[-g - 1] - h[-g - 2]),
              w = t + (-g - 2) * n;
            (a = L(e[w], e[w + n], v)), (s = L(e[w + 1], e[w + n + 1], v));
          } else (a = e[t + g * n]), (s = e[t + g * n + 1]);
        }
        return i ? ((i[0] = a), (i[1] = s), i) : [a, s];
      }
      var D = {
          DEGREES: "degrees",
          FEET: "ft",
          METERS: "m",
          PIXELS: "pixels",
          TILE_PIXELS: "tile-pixels",
          USFEET: "us-ft",
        },
        B = {};
      (B[D.DEGREES] = (2 * Math.PI * 6370997) / 360),
        (B[D.FEET] = 0.3048),
        (B[D.METERS] = 1),
        (B[D.USFEET] = 1200 / 3937);
      var U = D,
        G = (function () {
          function e(e) {
            (this.code_ = e.code),
              (this.units_ = e.units),
              (this.extent_ = void 0 !== e.extent ? e.extent : null),
              (this.worldExtent_ = void 0 !== e.worldExtent ? e.worldExtent : null),
              (this.axisOrientation_ =
                void 0 !== e.axisOrientation ? e.axisOrientation : "enu"),
              (this.global_ = void 0 !== e.global && e.global),
              (this.canWrapX_ = !(!this.global_ || !this.extent_)),
              (this.getPointResolutionFunc_ = e.getPointResolution),
              (this.defaultTileGrid_ = null),
              (this.metersPerUnit_ = e.metersPerUnit);
          }
          return (
            (e.prototype.canWrapX = function () {
              return this.canWrapX_;
            }),
            (e.prototype.getCode = function () {
              return this.code_;
            }),
            (e.prototype.getExtent = function () {
              return this.extent_;
            }),
            (e.prototype.getUnits = function () {
              return this.units_;
            }),
            (e.prototype.getMetersPerUnit = function () {
              return this.metersPerUnit_ || B[this.units_];
            }),
            (e.prototype.getWorldExtent = function () {
              return this.worldExtent_;
            }),
            (e.prototype.getAxisOrientation = function () {
              return this.axisOrientation_;
            }),
            (e.prototype.isGlobal = function () {
              return this.global_;
            }),
            (e.prototype.setGlobal = function (e) {
              (this.global_ = e), (this.canWrapX_ = !(!e || !this.extent_));
            }),
            (e.prototype.getDefaultTileGrid = function () {
              return this.defaultTileGrid_;
            }),
            (e.prototype.setDefaultTileGrid = function (e) {
              this.defaultTileGrid_ = e;
            }),
            (e.prototype.setExtent = function (e) {
              (this.extent_ = e), (this.canWrapX_ = !(!this.global_ || !e));
            }),
            (e.prototype.setWorldExtent = function (e) {
              this.worldExtent_ = e;
            }),
            (e.prototype.setGetPointResolution = function (e) {
              this.getPointResolutionFunc_ = e;
            }),
            (e.prototype.getPointResolutionFunc = function () {
              return this.getPointResolutionFunc_;
            }),
            e
          );
        })(),
        W = (function () {
          var e = function (t, r) {
            return (e =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (e, t) {
                  e.__proto__ = t;
                }) ||
              function (e, t) {
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
              })(t, r);
          };
          return function (t, r) {
            function n() {
              this.constructor = t;
            }
            e(t, r),
              (t.prototype =
                null === r ? Object.create(r) : ((n.prototype = r.prototype), new n()));
          };
        })(),
        V = 6378137,
        J = Math.PI * V,
        Y = [-J, -J, J, J],
        $ = [-180, -85, 180, 85],
        H = (function (e) {
          function t(t) {
            return (
              e.call(this, {
                code: t,
                units: U.METERS,
                extent: Y,
                global: !0,
                worldExtent: $,
                getPointResolution: function (e, t) {
                  return e / q(t[1] / V);
                },
              }) || this
            );
          }
          return W(t, e), t;
        })(G),
        K = [
          new H("EPSG:3857"),
          new H("EPSG:102100"),
          new H("EPSG:102113"),
          new H("EPSG:900913"),
          new H("urn:ogc:def:crs:EPSG:6.18:3:3857"),
          new H("urn:ogc:def:crs:EPSG::3857"),
          new H("http://www.opengis.net/gml/srs/epsg.xml#3857"),
        ];
      function X(e, t, r) {
        var n = e.length,
          o = r > 1 ? r : 2,
          i = t;
        void 0 === i && (i = o > 2 ? e.slice() : new Array(n));
        for (var a = J, s = 0; s < n; s += o) {
          i[s] = (a * e[s]) / 180;
          var l = V * Math.log(Math.tan((Math.PI * (+e[s + 1] + 90)) / 360));
          l > a ? (l = a) : l < -a && (l = -a), (i[s + 1] = l);
        }
        return i;
      }
      function Z(e, t, r) {
        var n = e.length,
          o = r > 1 ? r : 2,
          i = t;
        void 0 === i && (i = o > 2 ? e.slice() : new Array(n));
        for (var a = 0; a < n; a += o)
          (i[a] = (180 * e[a]) / J),
            (i[a + 1] = (360 * Math.atan(Math.exp(e[a + 1] / V))) / Math.PI - 90);
        return i;
      }
      var Q = (function () {
          var e = function (t, r) {
            return (e =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (e, t) {
                  e.__proto__ = t;
                }) ||
              function (e, t) {
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
              })(t, r);
          };
          return function (t, r) {
            function n() {
              this.constructor = t;
            }
            e(t, r),
              (t.prototype =
                null === r ? Object.create(r) : ((n.prototype = r.prototype), new n()));
          };
        })(),
        ee = [-180, -90, 180, 90],
        te = (6378137 * Math.PI) / 180,
        re = (function (e) {
          function t(t, r) {
            return (
              e.call(this, {
                code: t,
                units: U.DEGREES,
                extent: ee,
                axisOrientation: r,
                global: !0,
                metersPerUnit: te,
                worldExtent: ee,
              }) || this
            );
          }
          return Q(t, e), t;
        })(G),
        ne = [
          new re("CRS:84"),
          new re("EPSG:4326", "neu"),
          new re("urn:ogc:def:crs:EPSG::4326", "neu"),
          new re("urn:ogc:def:crs:EPSG:6.6:4326", "neu"),
          new re("urn:ogc:def:crs:OGC:1.3:CRS84"),
          new re("urn:ogc:def:crs:OGC:2:84"),
          new re("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
          new re("urn:x-ogc:def:crs:EPSG:4326", "neu"),
        ];
      "function" == typeof Object.assign && Object.assign;
      function oe(e) {
        for (var t in e) delete e[t];
      }
      "function" == typeof Object.values && Object.values;
      var ie = {};
      function ae(e, t, r) {
        var n = e.getCode(),
          o = t.getCode();
        n in ie || (ie[n] = {}), (ie[n][o] = r);
      }
      var se = {};
      function le(e, t, r) {
        var n;
        if (void 0 !== t) {
          for (var o = 0, i = e.length; o < i; ++o) t[o] = e[o];
          n = t;
        } else n = e.slice();
        return n;
      }
      function ue(e) {
        !(function (e, t) {
          se[e] = t;
        })(e.getCode(), e),
          ae(e, e, le);
      }
      function ce(e) {
        return "string" == typeof e ? se[e] || null : e || null;
      }
      function pe(e) {
        !(function (e) {
          e.forEach(ue);
        })(e),
          e.forEach(function (t) {
            e.forEach(function (e) {
              t !== e && ae(t, e, le);
            });
          });
      }
      var he, de, fe;
      pe(K),
        pe(ne),
        (he = K),
        (de = X),
        (fe = Z),
        ne.forEach(function (e) {
          he.forEach(function (t) {
            ae(e, t, de), ae(t, e, fe);
          });
        });
      new Array(6);
      var ye = [1, 0, 0, 1, 0, 0],
        me = (function () {
          function e(e, t, r, n, o) {
            this.extent_,
              (this.id_ = o),
              (this.type_ = e),
              (this.flatCoordinates_ = t),
              (this.flatInteriorPoints_ = null),
              (this.flatMidpoints_ = null),
              (this.ends_ = r),
              (this.properties_ = n);
          }
          return (
            (e.prototype.get = function (e) {
              return this.properties_[e];
            }),
            (e.prototype.getExtent = function () {
              var e, t, r, n;
              return (
                this.extent_ ||
                  (this.extent_ =
                    this.type_ === I.POINT
                      ? ((e = this.flatCoordinates_),
                        (r = e[0]),
                        (n = e[1]),
                        O(r, n, r, n, t))
                      : M(this.flatCoordinates_, 0, this.flatCoordinates_.length, 2)),
                this.extent_
              );
            }),
            (e.prototype.getFlatInteriorPoint = function () {
              if (!this.flatInteriorPoints_) {
                var e = [((t = this.getExtent())[0] + t[2]) / 2, (t[1] + t[3]) / 2];
                this.flatInteriorPoints_ = N(
                  this.flatCoordinates_,
                  0,
                  this.ends_,
                  2,
                  e,
                  0
                );
              }
              var t;
              return this.flatInteriorPoints_;
            }),
            (e.prototype.getFlatInteriorPoints = function () {
              if (!this.flatInteriorPoints_) {
                var e = (function (e, t, r, n) {
                  for (
                    var o = [], i = [1 / 0, 1 / 0, -1 / 0, -1 / 0], a = 0, s = r.length;
                    a < s;
                    ++a
                  ) {
                    var l = r[a];
                    (i = M(e, t, l[0], n)),
                      o.push((i[0] + i[2]) / 2, (i[1] + i[3]) / 2),
                      (t = l[l.length - 1]);
                  }
                  return o;
                })(this.flatCoordinates_, 0, this.ends_, 2);
                this.flatInteriorPoints_ = (function (e, t, r, n, o) {
                  for (var i = [], a = 0, s = r.length; a < s; ++a) {
                    var l = r[a];
                    (i = N(e, t, l, n, o, 2 * a, i)), (t = l[l.length - 1]);
                  }
                  return i;
                })(this.flatCoordinates_, 0, this.ends_, 2, e);
              }
              return this.flatInteriorPoints_;
            }),
            (e.prototype.getFlatMidpoint = function () {
              return (
                this.flatMidpoints_ ||
                  (this.flatMidpoints_ = F(
                    this.flatCoordinates_,
                    0,
                    this.flatCoordinates_.length,
                    2,
                    0.5
                  )),
                this.flatMidpoints_
              );
            }),
            (e.prototype.getFlatMidpoints = function () {
              if (!this.flatMidpoints_) {
                this.flatMidpoints_ = [];
                for (
                  var e = this.flatCoordinates_,
                    t = 0,
                    r = this.ends_,
                    n = 0,
                    o = r.length;
                  n < o;
                  ++n
                ) {
                  var i = r[n],
                    a = F(e, t, i, 2, 0.5);
                  w(this.flatMidpoints_, a), (t = i);
                }
              }
              return this.flatMidpoints_;
            }),
            (e.prototype.getId = function () {
              return this.id_;
            }),
            (e.prototype.getOrientedFlatCoordinates = function () {
              return this.flatCoordinates_;
            }),
            (e.prototype.getGeometry = function () {
              return this;
            }),
            (e.prototype.getSimplifiedGeometry = function (e) {
              return this;
            }),
            (e.prototype.simplifyTransformed = function (e, t) {
              return this;
            }),
            (e.prototype.getProperties = function () {
              return this.properties_;
            }),
            (e.prototype.getStride = function () {
              return 2;
            }),
            (e.prototype.getStyleFunction = function () {}),
            (e.prototype.getType = function () {
              return this.type_;
            }),
            (e.prototype.transform = function (e, t) {
              var r,
                n,
                o,
                i,
                a,
                s,
                l,
                u,
                c,
                p,
                h = (e = ce(e)).getExtent(),
                d = e.getWorldExtent(),
                f = C(d) / C(h);
              (r = ye),
                (n = d[0]),
                (o = d[3]),
                (i = f),
                (a = -f),
                (s = 0),
                (l = 0),
                (u = 0),
                (c = Math.sin(s)),
                (p = Math.cos(s)),
                (r[0] = i * p),
                (r[1] = a * c),
                (r[2] = -i * c),
                (r[3] = a * p),
                (r[4] = l * i * p - u * i * c + n),
                (r[5] = l * a * c + u * a * p + o),
                (function (e, t, r, n, o, i) {
                  for (var a = i || [], s = 0, l = t; l < r; l += n) {
                    var u = e[l],
                      c = e[l + 1];
                    (a[s++] = o[0] * u + o[2] * c + o[4]),
                      (a[s++] = o[1] * u + o[3] * c + o[5]);
                  }
                  i && a.length != s && (a.length = s);
                })(
                  this.flatCoordinates_,
                  0,
                  this.flatCoordinates_.length,
                  2,
                  ye,
                  this.flatCoordinates_
                );
            }),
            e
          );
        })();
      (me.prototype.getEnds = function () {
        return this.ends_;
      }),
        (me.prototype.getEndss = me.prototype.getEnds),
        (me.prototype.getFlatCoordinates = me.prototype.getOrientedFlatCoordinates);
      var ge = me,
        ve = r(0);
      function be(e, t, r, n, o) {
        if ((n && n !== e && (r = r.bind(n)), o)) {
          var i = r;
          r = function () {
            e.removeEventListener(t, r), i.apply(this, arguments);
          };
        }
        var a = { target: e, type: t, listener: r };
        return e.addEventListener(t, r), a;
      }
      var we = "clear",
        xe = (function () {
          var e,
            t = {};
          return function (r) {
            if ((e || (e = document.createElement("div").style), !(r in t))) {
              e.font = r;
              var n = e.fontFamily,
                o = e.fontWeight,
                i = e.fontStyle;
              if (((e.font = ""), !n)) return null;
              var a = n.split(/,\s?/);
              t[r] = { families: a, weight: o, style: i };
            }
            return t[r];
          };
        })();
      var ke = (function () {
        function e() {
          this.disposed_ = !1;
        }
        return (
          (e.prototype.dispose = function () {
            this.disposed_ || ((this.disposed_ = !0), this.disposeInternal());
          }),
          (e.prototype.disposeInternal = function () {}),
          e
        );
      })();
      function Se() {}
      var _e = (function () {
          function e(e) {
            this.propagationStopped, (this.type = e), (this.target = null);
          }
          return (
            (e.prototype.preventDefault = function () {
              this.propagationStopped = !0;
            }),
            (e.prototype.stopPropagation = function () {
              this.propagationStopped = !0;
            }),
            e
          );
        })(),
        je = (function () {
          var e = function (t, r) {
            return (e =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (e, t) {
                  e.__proto__ = t;
                }) ||
              function (e, t) {
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
              })(t, r);
          };
          return function (t, r) {
            function n() {
              this.constructor = t;
            }
            e(t, r),
              (t.prototype =
                null === r ? Object.create(r) : ((n.prototype = r.prototype), new n()));
          };
        })(),
        Te = (function (e) {
          function t(t) {
            var r = e.call(this) || this;
            return (
              (r.eventTarget_ = t),
              (r.pendingRemovals_ = {}),
              (r.dispatching_ = {}),
              (r.listeners_ = {}),
              r
            );
          }
          return (
            je(t, e),
            (t.prototype.addEventListener = function (e, t) {
              if (e && t) {
                var r = this.listeners_[e];
                r || ((r = []), (this.listeners_[e] = r)),
                  -1 === r.indexOf(t) && r.push(t);
              }
            }),
            (t.prototype.dispatchEvent = function (e) {
              var t = "string" == typeof e ? new _e(e) : e,
                r = t.type;
              t.target || (t.target = this.eventTarget_ || this);
              var n,
                o = this.listeners_[r];
              if (o) {
                r in this.dispatching_ ||
                  ((this.dispatching_[r] = 0), (this.pendingRemovals_[r] = 0)),
                  ++this.dispatching_[r];
                for (var i = 0, a = o.length; i < a; ++i)
                  if (!1 === o[i].call(this, t) || t.propagationStopped) {
                    n = !1;
                    break;
                  }
                if ((--this.dispatching_[r], 0 === this.dispatching_[r])) {
                  var s = this.pendingRemovals_[r];
                  for (delete this.pendingRemovals_[r]; s--; )
                    this.removeEventListener(r, Se);
                  delete this.dispatching_[r];
                }
                return n;
              }
            }),
            (t.prototype.disposeInternal = function () {
              oe(this.listeners_);
            }),
            (t.prototype.getListeners = function (e) {
              return this.listeners_[e];
            }),
            (t.prototype.hasListener = function (e) {
              return e ? e in this.listeners_ : Object.keys(this.listeners_).length > 0;
            }),
            (t.prototype.removeEventListener = function (e, t) {
              var r = this.listeners_[e];
              if (r) {
                var n = r.indexOf(t);
                -1 !== n &&
                  (e in this.pendingRemovals_
                    ? ((r[n] = Se), ++this.pendingRemovals_[e])
                    : (r.splice(n, 1), 0 === r.length && delete this.listeners_[e]));
              }
            }),
            t
          );
        })(ke),
        Ae = (function () {
          var e = function (t, r) {
            return (e =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (e, t) {
                  e.__proto__ = t;
                }) ||
              function (e, t) {
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
              })(t, r);
          };
          return function (t, r) {
            function n() {
              this.constructor = t;
            }
            e(t, r),
              (t.prototype =
                null === r ? Object.create(r) : ((n.prototype = r.prototype), new n()));
          };
        })(),
        Oe = (function (e) {
          function t(t) {
            var r = e.call(this) || this;
            return (
              (r.highWaterMark = void 0 !== t ? t : 2048),
              (r.count_ = 0),
              (r.entries_ = {}),
              (r.oldest_ = null),
              (r.newest_ = null),
              r
            );
          }
          return (
            Ae(t, e),
            (t.prototype.canExpireCache = function () {
              return this.getCount() > this.highWaterMark;
            }),
            (t.prototype.clear = function () {
              (this.count_ = 0),
                (this.entries_ = {}),
                (this.oldest_ = null),
                (this.newest_ = null),
                this.dispatchEvent(we);
            }),
            (t.prototype.containsKey = function (e) {
              return this.entries_.hasOwnProperty(e);
            }),
            (t.prototype.forEach = function (e) {
              for (var t = this.oldest_; t; ) e(t.value_, t.key_, this), (t = t.newer);
            }),
            (t.prototype.get = function (e, t) {
              var r = this.entries_[e];
              return (
                A(void 0 !== r, 15),
                r === this.newest_
                  ? r.value_
                  : (r === this.oldest_
                      ? ((this.oldest_ = this.oldest_.newer), (this.oldest_.older = null))
                      : ((r.newer.older = r.older), (r.older.newer = r.newer)),
                    (r.newer = null),
                    (r.older = this.newest_),
                    (this.newest_.newer = r),
                    (this.newest_ = r),
                    r.value_)
              );
            }),
            (t.prototype.remove = function (e) {
              var t = this.entries_[e];
              return (
                A(void 0 !== t, 15),
                t === this.newest_
                  ? ((this.newest_ = t.older),
                    this.newest_ && (this.newest_.newer = null))
                  : t === this.oldest_
                  ? ((this.oldest_ = t.newer),
                    this.oldest_ && (this.oldest_.older = null))
                  : ((t.newer.older = t.older), (t.older.newer = t.newer)),
                delete this.entries_[e],
                --this.count_,
                t.value_
              );
            }),
            (t.prototype.getCount = function () {
              return this.count_;
            }),
            (t.prototype.getKeys = function () {
              var e,
                t = new Array(this.count_),
                r = 0;
              for (e = this.newest_; e; e = e.older) t[r++] = e.key_;
              return t;
            }),
            (t.prototype.getValues = function () {
              var e,
                t = new Array(this.count_),
                r = 0;
              for (e = this.newest_; e; e = e.older) t[r++] = e.value_;
              return t;
            }),
            (t.prototype.peekLast = function () {
              return this.oldest_.value_;
            }),
            (t.prototype.peekLastKey = function () {
              return this.oldest_.key_;
            }),
            (t.prototype.peekFirstKey = function () {
              return this.newest_.key_;
            }),
            (t.prototype.pop = function () {
              var e = this.oldest_;
              return (
                delete this.entries_[e.key_],
                e.newer && (e.newer.older = null),
                (this.oldest_ = e.newer),
                this.oldest_ || (this.newest_ = null),
                --this.count_,
                e.value_
              );
            }),
            (t.prototype.replace = function (e, t) {
              this.get(e), (this.entries_[e].value_ = t);
            }),
            (t.prototype.set = function (e, t) {
              A(!(e in this.entries_), 16);
              var r = { key_: e, newer: null, older: this.newest_, value_: t };
              this.newest_ ? (this.newest_.newer = r) : (this.oldest_ = r),
                (this.newest_ = r),
                (this.entries_[e] = r),
                ++this.count_;
            }),
            (t.prototype.setSize = function (e) {
              this.highWaterMark = e;
            }),
            t
          );
        })(Te),
        Ee = (function () {
          var e = function (t, r) {
            return (e =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (e, t) {
                  e.__proto__ = t;
                }) ||
              function (e, t) {
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
              })(t, r);
          };
          return function (t, r) {
            function n() {
              this.constructor = t;
            }
            e(t, r),
              (t.prototype =
                null === r ? Object.create(r) : ((n.prototype = r.prototype), new n()));
          };
        })(),
        Me = new ((function (e) {
          function t(t) {
            var r = e.call(this, t) || this;
            return (r.consumers = {}), r;
          }
          return (
            Ee(t, e),
            (t.prototype.clear = function () {
              (this.consumers = {}), e.prototype.clear.call(this);
            }),
            (t.prototype.get = function (t, r) {
              var n = e.prototype.get.call(this, t),
                o = k(r);
              return (
                o in this.consumers || (this.consumers[o] = {}),
                (this.consumers[o][t] = !0),
                n
              );
            }),
            (t.prototype.prune = function () {
              e: for (; this.canExpireCache(); ) {
                var e = this.peekLastKey();
                for (var t in this.consumers) if (e in this.consumers[t]) break e;
                var r = this.pop();
                for (var t in ((r.width = 0), (r.height = 0), this.consumers))
                  delete this.consumers[t][e];
              }
            }),
            (t.prototype.release = function (e) {
              delete this.consumers[k(e)];
            }),
            t
          );
        })(Oe))(),
        ze = {},
        Ce = null,
        Ie = {};
      !(function () {
        var e,
          t,
          r = 100,
          n = ze,
          o = "32px ",
          i = ["monospace", "serif"],
          a = i.length,
          s = "wmytzilWMYTZIL@#/&?$%10";
        function l(e, r, n) {
          for (var l = Pe(), u = !0, c = 0; c < a; ++c) {
            var p = i[c];
            if (((l.font = e + " " + r + " " + o + p), l.measureText(s).width, n != p)) {
              l.font = e + " " + r + " " + o + n + "," + p;
              var h = l.measureText(s).width;
              u && h != t;
            }
          }
          return !!u;
        }
        function u() {
          var t = !0;
          for (var o in n)
            n[o] < r &&
              (l.apply(this, o.split("\n"))
                ? ((n[o] = r), oe(Ie), null, void 0, Me.getCount() && Me.clear())
                : (++n[o], !1));
          t && (clearInterval(e), void 0);
        }
      })();
      function Pe() {
        var e, t, r;
        return (
          Ce ||
            (1,
            1,
            document.createElement("canvas"),
            e && (r.width = e),
            t && (r.height = t),
            r.getContext("2d")),
          Ce
        );
      }
      var Re, Ne;
      Ne = Ie;
      function qe(e) {
        return (e * Math.PI) / 180;
      }
      var Le = (function () {
        for (var e = [], t = 78271.51696402048; e.length <= 24; t /= 2) e.push(t);
        return e;
      })();
      function Fe(e, t) {
        if (
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          "undefined" != typeof OffscreenCanvas
        )
          return new OffscreenCanvas(e, t);
        var r = document.createElement("canvas");
        return (r.width = e), (r.height = t), r;
      }
      var De,
        Be = Array(256).join(" ");
      function Ue(e, t) {
        if (t >= 0.05) {
          for (
            var r = "",
              n = e.split("\n"),
              o = Be.slice(0, Math.round(t / 0.1)),
              i = 0,
              a = n.length;
            i < a;
            ++i
          )
            i > 0 && (r += "\n"), (r += n[i].split("").join(o));
          return r;
        }
        return e;
      }
      function Ge() {
        return De || (De = Fe(1, 1).getContext("2d")), De;
      }
      function We(e, t) {
        return Ge().measureText(e).width + (e.length - 1) * t;
      }
      var Ve = {};
      function Je(e, t, r, n) {
        if (-1 !== e.indexOf("\n")) {
          for (var o = e.split("\n"), i = [], a = 0, s = o.length; a < s; ++a)
            i.push(Je(o[a], t, r, n));
          return i.join("\n");
        }
        var l = r + "," + t + "," + e + "," + n,
          u = Ve[l];
        if (!u) {
          var c = e.split(" ");
          if (c.length > 1) {
            var p = Ge();
            p.font = t;
            for (
              var h = p.measureText("M").width * r, d = "", f = [], y = 0, m = c.length;
              y < m;
              ++y
            ) {
              var g = c[y],
                v = d + (d ? " " : "") + g;
              We(v, n) <= h ? (d = v) : (d && f.push(d), (d = g));
            }
            d && f.push(d);
            for (var b = 0; b < f.length; ++b) {
              var w = f[b];
              if (We(w, n) < 0.35 * h) {
                var x = b > 0 ? We(f[b - 1], n) : 1 / 0,
                  k = b < f.length - 1 ? We(f[b + 1], n) : 1 / 0;
                f.splice(b, 1),
                  x < k ? ((f[b - 1] += " " + w), (b -= 1)) : (f[b] = w + " " + f[b]),
                  (f.length -= 1);
              }
            }
            for (var S = 0, _ = f.length - 1; S < _; ++S) {
              var j = f[S],
                T = f[S + 1];
              if (We(j, n) > 0.7 * h && We(T, n) < 0.6 * h) {
                var A = j.split(" "),
                  O = A.pop();
                We(O, n) < 0.2 * h && ((f[S] = A.join(" ")), (f[S + 1] = O + " " + T)),
                  (_ -= 1);
              }
            }
            u = f.join("\n");
          } else u = e;
          (u = Ue(u, n)), (Ve[l] = u);
        }
        return u;
      }
      Me &&
        be(Me, we, function () {
          Ve = {};
        });
      var Ye,
        $e,
        He = ve.e.isFunction,
        Ke = ve.e.convertFunction,
        Xe = ve.c.isExpression,
        Ze = ve.c.createPropertyExpression,
        Qe = {
          Point: 1,
          MultiPoint: 1,
          LineString: 2,
          MultiLineString: 2,
          Polygon: 3,
          MultiPolygon: 3,
        },
        et = {
          center: [0.5, 0.5],
          left: [0, 0.5],
          right: [1, 0.5],
          top: [0.5, 0],
          bottom: [0.5, 1],
          "top-left": [0, 0],
          "top-right": [1, 0],
          "bottom-left": [0, 1],
          "bottom-right": [1, 1],
        },
        tt = function (e, t) {
          var r = Ze(e, t);
          if ("error" === r.result)
            throw new Error(
              r.value
                .map(function (e) {
                  return e.key + ": " + e.message;
                })
                .join(", ")
            );
          return r.value;
        },
        rt = {},
        nt = { zoom: 0 },
        ot = {};
      function it(e, t, r, n, o) {
        var i = e.id;
        ot[i] || (ot[i] = {});
        var a = ot[i];
        if (!a[r]) {
          var s = (e[t] || rt)[r],
            l = ve.f[t + "_" + e.type][r];
          void 0 === s && (s = l.default);
          var u = Xe(s);
          if ((!u && He(s) && ((s = Ke(s, l)), (u = !0)), u)) {
            var c = tt(s, l);
            a[r] = c.evaluate.bind(c);
          } else
            "color" == l.type && (s = ve.a.parse(s)),
              (a[r] = function () {
                return s;
              });
        }
        return (nt.zoom = n), a[r](nt, o);
      }
      var at = {};
      function st(e, t, r, n) {
        return e in at || (at[e] = Object(ve.d)(t).filter), (nt.zoom = n), at[e](nt, r);
      }
      function lt(e, t) {
        if (e) {
          if (0 === e.a || 0 === t) return;
          var r = e.a;
          return (
            (t = void 0 === t ? 1 : t),
            "rgba(" +
              Math.round((255 * e.r) / r) +
              "," +
              Math.round((255 * e.g) / r) +
              "," +
              Math.round((255 * e.b) / r) +
              "," +
              r * t +
              ")"
          );
        }
        return e;
      }
      var ut = /^([^]*)\{(.*)\}([^]*)$/;
      function ct(e, t) {
        var r;
        do {
          if ((r = e.match(ut))) {
            var n = t[r[2]] || "";
            e = r[1] + n + r[3];
          }
        } while (r);
        return e;
      }
      var pt,
        ht = function (e, t, r, n, i, s, u) {
          if (
            (void 0 === n && (n = Le),
            "string" == typeof t && (t = JSON.parse(t)),
            8 != t.version)
          )
            throw new Error("glStyle version 8 required.");
          var p, d;
          if (s)
            if ("undefined" != typeof Image) {
              var f = new Image();
              (f.crossOrigin = "anonymous"),
                (f.onload = function () {
                  (p = f), (d = [f.width, f.height]), e.changed(), (f.onload = null);
                }),
                (f.src = s);
            } else if (
              "undefined" != typeof WorkerGlobalScope &&
              self instanceof WorkerGlobalScope
            ) {
              var y = self;
              y.postMessage({ action: "loadImage", src: s }),
                y.addEventListener("message", function (e) {
                  "imageLoaded" === e.data.action &&
                    e.data.src === s &&
                    ((p = e.data.image), (d = [p.width, p.height]));
                });
            }
          for (
            var g, b = Object(ve.b)(t.layers), w = {}, x = [], k = 0, S = b.length;
            k < S;
            ++k
          ) {
            var _ = b[k],
              j = _.id;
            if (("string" == typeof r && _.source == r) || -1 !== r.indexOf(j)) {
              var T = _["source-layer"];
              if (!g) {
                g = _.source;
                var A = t.sources[g];
                if (!A) throw new Error('Source "' + g + '" is not defined');
                var O = A.type;
                if ("vector" !== O && "geojson" !== O)
                  throw new Error(
                    'Source "' +
                      g +
                      '" is not of type "vector" or "geojson", but "' +
                      O +
                      '"'
                  );
              }
              var E = w[T];
              E || (E = w[T] = []), E.push({ layer: _, index: k }), x.push(j);
            }
            delete ot[j], delete at[j];
          }
          var M = new c.a(),
            z = new l.a(),
            C = {},
            I = {},
            P = [],
            R = function (e, t) {
              var r = e.getProperties(),
                s = w[r.layer];
              if (s) {
                var f = n.indexOf(t);
                -1 == f &&
                  (f = (function (e, t) {
                    for (var r = 0, n = t.length; r < n; ++r) {
                      if (t[r] < e && r + 1 < n) {
                        var o = t[r] / t[r + 1];
                        return r + Math.log(t[r] / e) / Math.log(o);
                      }
                    }
                    return n - 1;
                  })(t, n));
                for (
                  var y = Qe[e.getGeometry().getType()],
                    g = { properties: r, type: y },
                    b = -1,
                    x = 0,
                    k = s.length;
                  x < k;
                  ++x
                ) {
                  var S = s[x],
                    _ = S.layer,
                    j = _.id,
                    T = _.layout || rt,
                    A = _.paint || rt;
                  if (
                    !(
                      "none" === T.visibility ||
                      ("minzoom" in _ && f < _.minzoom) ||
                      ("maxzoom" in _ && f >= _.maxzoom)
                    )
                  ) {
                    var O = _.filter;
                    if (!O || st(j, O, g, f)) {
                      var E = void 0,
                        R = void 0,
                        N = void 0,
                        q = void 0,
                        L = void 0,
                        F = void 0,
                        D = S.index;
                      if (3 == y && "fill" == _.type)
                        if (
                          ((R = it(_, "paint", "fill-opacity", f, g)),
                          "fill-pattern" in A)
                        ) {
                          var B = it(_, "paint", "fill-pattern", f, g);
                          if (B) {
                            var U = "string" == typeof B ? ct(B, r) : B.toString();
                            if (p && i && i[U]) {
                              ++b,
                                ((F = P[b]) &&
                                  F.getFill() &&
                                  !F.getStroke() &&
                                  !F.getText()) ||
                                  (F = P[b] =
                                    new a.a({
                                      fill: new l.a(),
                                    })),
                                (N = F.getFill()),
                                F.setZIndex(D);
                              var G = U + "." + R,
                                W = I[G];
                              if (!W) {
                                var V = i[U],
                                  J = Fe(V.width, V.height),
                                  Y = J.getContext("2d");
                                (Y.globalAlpha = R),
                                  Y.drawImage(
                                    p,
                                    V.x,
                                    V.y,
                                    V.width,
                                    V.height,
                                    0,
                                    0,
                                    V.width,
                                    V.height
                                  ),
                                  (W = Y.createPattern(J, "repeat")),
                                  (I[G] = W);
                              }
                              N.setColor(W);
                            }
                          }
                        } else
                          (E = lt(it(_, "paint", "fill-color", f, g), R)) &&
                            ("fill-outline-color" in A &&
                              (L = lt(it(_, "paint", "fill-outline-color", f, g), R)),
                            L || (L = E),
                            ++b,
                            ((F = P[b]) &&
                              F.getFill() &&
                              F.getStroke() &&
                              !F.getText()) ||
                              (F = P[b] =
                                new a.a({
                                  fill: new l.a(),
                                  stroke: new c.a(),
                                })),
                            (N = F.getFill()).setColor(E),
                            (q = F.getStroke()).setColor(L),
                            q.setWidth(1),
                            F.setZIndex(D));
                      if (1 != y && "line" == _.type) {
                        E =
                          !("line-pattern" in A) && "line-color" in A
                            ? lt(
                                it(_, "paint", "line-color", f, g),
                                it(_, "paint", "line-opacity", f, g)
                              )
                            : void 0;
                        var $ = it(_, "paint", "line-width", f, g);
                        E &&
                          $ > 0 &&
                          (++b,
                          ((F = P[b]) && F.getStroke() && !F.getFill() && !F.getText()) ||
                            (F = P[b] = new a.a({ stroke: new c.a() })),
                          (q = F.getStroke()).setLineCap(
                            it(_, "layout", "line-cap", f, g)
                          ),
                          q.setLineJoin(it(_, "layout", "line-join", f, g)),
                          q.setMiterLimit(it(_, "layout", "line-miter-limit", f, g)),
                          q.setColor(E),
                          q.setWidth($),
                          q.setLineDash(
                            A["line-dasharray"]
                              ? it(_, "paint", "line-dasharray", f, g).map(function (e) {
                                  return e * $;
                                })
                              : null
                          ),
                          F.setZIndex(D));
                      }
                      var H = !1,
                        K = null,
                        X = 0,
                        Z = void 0,
                        Q = void 0,
                        ee = void 0;
                      if ((1 == y || 2 == y) && "icon-image" in T) {
                        var te = it(_, "layout", "icon-image", f, g);
                        if (te) {
                          Z = "string" == typeof te ? ct(te, r) : te.toString();
                          var re = void 0;
                          if (p && i && i[Z]) {
                            var ne = it(_, "layout", "icon-rotation-alignment", f, g);
                            if (2 == y) {
                              var oe = e.getGeometry();
                              if (oe.getFlatMidpoint) {
                                var ie = oe.getExtent();
                                if (
                                  Math.sqrt(
                                    Math.max(
                                      Math.pow((ie[2] - ie[0]) / t, 2),
                                      Math.pow((ie[3] - ie[1]) / t, 2)
                                    )
                                  ) > 150
                                ) {
                                  var ae = oe.getFlatMidpoint();
                                  if (
                                    ($e ||
                                      ($e = new ge(
                                        "Point",
                                        (Ye = [NaN, NaN]),
                                        [],
                                        {},
                                        null
                                      )),
                                    (re = $e),
                                    (Ye[0] = ae[0]),
                                    (Ye[1] = ae[1]),
                                    "line" ===
                                      it(_, "layout", "symbol-placement", f, g) &&
                                      "map" === ne)
                                  )
                                    for (
                                      var se = oe.getStride(),
                                        le = oe.getFlatCoordinates(),
                                        ue = 0,
                                        ce = le.length - se;
                                      ue < ce;
                                      ue += se
                                    ) {
                                      var pe = le[ue],
                                        he = le[ue + 1],
                                        de = le[ue + se],
                                        fe = le[ue + se + 1],
                                        ye = Math.min(pe, de),
                                        me = Math.min(he, fe),
                                        ve = Math.max(pe, de),
                                        be = Math.max(he, fe);
                                      if (
                                        ae[0] >= ye &&
                                        ae[0] <= ve &&
                                        ae[1] >= me &&
                                        ae[1] <= be
                                      ) {
                                        X = Math.atan2(he - fe, de - pe);
                                        break;
                                      }
                                    }
                                }
                              }
                            }
                            if (2 !== y || re) {
                              ++b,
                                ((F = P[b]) &&
                                  F.getImage() &&
                                  !F.getFill() &&
                                  !F.getStroke()) ||
                                  (F = P[b] = new a.a()),
                                F.setGeometry(re);
                              var we = it(_, "layout", "icon-size", f, g),
                                xe =
                                  void 0 !== A["icon-color"]
                                    ? it(_, "paint", "icon-color", f, g)
                                    : null,
                                ke = Z + "." + we;
                              if ((null !== xe && (ke += "." + xe), !(Q = C[ke]))) {
                                var Se = i[Z];
                                if (null !== xe) {
                                  var _e = Fe(Se.width, Se.height),
                                    je = _e.getContext("2d");
                                  je.drawImage(
                                    p,
                                    Se.x,
                                    Se.y,
                                    Se.width,
                                    Se.height,
                                    0,
                                    0,
                                    Se.width,
                                    Se.height
                                  );
                                  for (
                                    var Te = je.getImageData(0, 0, _e.width, _e.height),
                                      Ae = 0,
                                      Oe = Te.data.length;
                                    Ae < Oe;
                                    Ae += 4
                                  ) {
                                    var Ee = xe.a;
                                    0 !== Ee &&
                                      ((Te.data[Ae] = (255 * xe.r) / Ee),
                                      (Te.data[Ae + 1] = (255 * xe.g) / Ee),
                                      (Te.data[Ae + 2] = (255 * xe.b) / Ee)),
                                      (Te.data[Ae + 3] = Ee);
                                  }
                                  je.putImageData(Te, 0, 0),
                                    (Q = C[ke] =
                                      new h.a({
                                        img: _e,
                                        imgSize: [_e.width, _e.height],
                                        scale: we / Se.pixelRatio,
                                      }));
                                } else
                                  Q = C[ke] = new h.a({
                                    img: p,
                                    imgSize: d,
                                    size: [Se.width, Se.height],
                                    offset: [Se.x, Se.y],
                                    rotateWithView: "map" === ne,
                                    scale: we / Se.pixelRatio,
                                  });
                              }
                              Q.setRotation(X + qe(it(_, "layout", "icon-rotate", f, g))),
                                Q.setOpacity(it(_, "paint", "icon-opacity", f, g)),
                                Q.setAnchor(et[it(_, "layout", "icon-anchor", f, g)]),
                                F.setImage(Q),
                                (K = F.getText()),
                                F.setText(void 0),
                                F.setZIndex(D),
                                (H = !0),
                                (ee = !1);
                            } else ee = !0;
                          }
                        }
                      }
                      if (1 == y && "circle-radius" in A) {
                        ++b,
                          ((F = P[b]) &&
                            F.getImage() &&
                            !F.getFill() &&
                            !F.getStroke()) ||
                            (F = P[b] = new a.a());
                        var Me = it(_, "paint", "circle-radius", f, g),
                          ze = lt(
                            it(_, "paint", "circle-stroke-color", f, g),
                            it(_, "paint", "circle-stroke-opacity", f, g)
                          ),
                          Ce = lt(
                            it(_, "paint", "circle-color", f, g),
                            it(_, "paint", "circle-opacity", f, g)
                          ),
                          Ie = it(_, "paint", "circle-stroke-width", f, g),
                          Pe = Me + "." + ze + "." + Ce + "." + Ie;
                        (Q = C[Pe]) ||
                          (Q = C[Pe] =
                            new v.a({
                              radius: Me,
                              stroke:
                                ze && Ie > 0
                                  ? new c.a({
                                      width: Ie,
                                      color: ze,
                                    })
                                  : void 0,
                              fill: Ce ? new l.a({ color: Ce }) : void 0,
                            })),
                          F.setImage(Q),
                          (K = F.getText()),
                          F.setText(void 0),
                          F.setGeometry(void 0),
                          F.setZIndex(D),
                          (H = !0);
                      }
                      var Re = void 0;
                      if ("text-field" in T)
                        (Re = ct(
                          it(_, "layout", "text-field", f, g).toString(),
                          r
                        ).trim()),
                          (R = it(_, "paint", "text-opacity", f, g));
                      if (Re && R && !ee) {
                        H ||
                          (++b,
                          ((F = P[b]) && F.getText() && !F.getFill() && !F.getStroke()) ||
                            (F = P[b] = new a.a()),
                          F.setImage(void 0),
                          F.setGeometry(void 0)),
                          F.getText() || F.setText(K || new m({ padding: [2, 2, 2, 2] })),
                          (K = F.getText());
                        var Ne = Math.round(it(_, "layout", "text-size", f, g)),
                          Le = it(_, "layout", "text-font", f, g),
                          De = it(_, "layout", "text-line-height", f, g),
                          Be = o()(u ? u(Le) : Le, Ne, De),
                          Ge = T["text-transform"];
                        "uppercase" == Ge
                          ? (Re = Re.toUpperCase())
                          : "lowercase" == Ge && (Re = Re.toLowerCase());
                        var We = it(_, "layout", "text-max-width", f, g),
                          Ve = it(_, "layout", "text-letter-spacing", f, g),
                          He = 2 == y ? Ue(Re, Ve) : Je(Re, Be, We, Ve);
                        K.setText(He),
                          K.setFont(Be),
                          K.setRotation(qe(it(_, "layout", "text-rotate", f, g)));
                        var Ke = it(_, "layout", "text-anchor", f, g),
                          Xe =
                            H || 1 == y
                              ? "point"
                              : it(_, "layout", "symbol-placement", f, g);
                        K.setPlacement(Xe);
                        var Ze = it(_, "paint", "text-halo-width", f, g),
                          tt = it(_, "layout", "text-offset", f, g),
                          nt = it(_, "paint", "text-translate", f, g),
                          ot = 0,
                          at = 0;
                        if ("point" == Xe) {
                          var ut = "center";
                          -1 !== Ke.indexOf("left")
                            ? ((ut = "left"), (at = Ze))
                            : -1 !== Ke.indexOf("right") && ((ut = "right"), (at = -Ze)),
                            K.setTextAlign(ut);
                          var pt = it(_, "layout", "text-rotation-alignment", f, g);
                          K.setRotateWithView("map" == pt);
                        } else
                          K.setMaxAngle(
                            (qe(it(_, "layout", "text-max-angle", f, g)) * Re.length) /
                              He.length
                          ),
                            K.setTextAlign(),
                            K.setRotateWithView(!1);
                        var ht = "middle";
                        0 == Ke.indexOf("bottom")
                          ? ((ht = "bottom"), (ot = -Ze - 0.5 * (De - 1) * Ne))
                          : 0 == Ke.indexOf("top") &&
                            ((ht = "top"), (ot = Ze + 0.5 * (De - 1) * Ne)),
                          K.setTextBaseline(ht),
                          K.setOffsetX(tt[0] * Ne + at + nt[0]),
                          K.setOffsetY(tt[1] * Ne + ot + nt[1]),
                          z.setColor(lt(it(_, "paint", "text-color", f, g), R)),
                          K.setFill(z);
                        var dt = lt(it(_, "paint", "text-halo-color", f, g), R);
                        if (dt) {
                          M.setColor(dt), (Ze *= 2);
                          var ft = 0.5 * Ne;
                          M.setWidth(Ze <= ft ? Ze : ft), K.setStroke(M);
                        } else K.setStroke(void 0);
                        var yt = it(_, "layout", "text-padding", f, g),
                          mt = K.getPadding();
                        yt !== mt[0] && (mt[0] = mt[1] = mt[2] = mt[3] = yt),
                          F.setZIndex(D);
                      }
                    }
                  }
                }
                return b > -1 ? ((P.length = b + 1), P) : void 0;
              }
            };
          return e.setStyle(R), e.set("mapbox-source", g), e.set("mapbox-layers", x), R;
        },
        dt = r(17),
        ft = r.n(dt),
        yt = r(6),
        mt = r(18),
        gt = r(8),
        vt = r.n(gt),
        bt = r(9),
        wt = r.n(bt),
        xt = r(19),
        kt = r.n(xt),
        St = r(20),
        _t = r.n(St),
        jt = r(21),
        Tt = r.n(jt),
        At = r(4),
        Ot = r(22),
        Et = r.n(Ot),
        Mt = r(10),
        zt = r.n(Mt),
        Ct = r(11),
        It = r.n(Ct),
        Pt = r(12),
        Rt = r.n(Pt),
        Nt = r(13),
        qt = r.n(Nt),
        Lt = r(14),
        Ft = r.n(Lt),
        Dt = {},
        Bt = /font-family: ?([^;]*);/,
        Ut = /("|')/g;
      function Gt(e) {
        if (!pt) {
          pt = {};
          for (var t = document.styleSheets, r = 0, n = t.length; r < n; ++r) {
            var o = t[r];
            try {
              var i = o.rules || o.cssRules;
              if (i)
                for (var a = 0, s = i.length; a < s; ++a) {
                  var l = i[a];
                  if (5 == l.type) {
                    var u = l.cssText.match(Bt);
                    pt[u[1].replace(Ut, "")] = !0;
                  }
                }
            } catch (e) {}
          }
        }
        return e in pt;
      }
      var Wt = {},
        Vt = ft.a.getNames();
      function Jt(e) {
        var t = e.toString();
        if (t in Wt) return e;
        for (
          var r = e.map(function (e) {
              var t = o()(e, 1).split(" ");
              return [t.slice(3).join(" ").replace(/"/g, ""), t[1] + t[0]];
            }),
            n = 0,
            i = r.length;
          n < i;
          ++n
        ) {
          var a = r[n],
            s = a[0];
          if (!Gt(s) && -1 !== Vt.indexOf(s)) {
            var l =
              "https://fonts.googleapis.com/css?family=" +
              s.replace(/ /g, "+") +
              ":" +
              a[1];
            if (!document.querySelector('link[href="' + l + '"]')) {
              var u = document.createElement("link");
              (u.href = l), (u.rel = "stylesheet"), document.head.appendChild(u);
            }
          }
        }
        return (Wt[t] = !0), e;
      }
      var Yt = /^(.*)(\?.*)$/;
      function $t(e, t) {
        return t && e.startsWith(".") && (e = t + e), e;
      }
      function Ht(e, t, r) {
        var n = (e = $t(e, t)).match(Yt);
        return n ? n[1] + r + (n.length > 2 ? n[2] : "") : e + r;
      }
      function Kt(e, t, r, n, o) {
        return new Promise(function (i, a) {
          if (("object" != typeof t && (t = JSON.parse(t)), 8 != t.version))
            return a(new Error("glStyle version 8 required."));
          if (!(e instanceof zt.a || e instanceof It.a))
            return a(new Error("Can only apply to VectorLayer or VectorTileLayer"));
          var s, l, u;
          function c() {
            u || (t.sprite && !s)
              ? u
                ? (e.setStyle(u), i())
                : a(new Error("Something went wrong trying to apply style."))
              : ((u = ht(e, t, r, o, s, l, Jt)),
                e.getStyle()
                  ? i()
                  : a(new Error("Nothing to show for source [" + r + "]")));
          }
          if (t.sprite) {
            var p = 0.5 == (window.devicePixelRatio >= 1.5 ? 0.5 : 1) ? "@2x" : "",
              h = Ht(t.sprite, n, p + ".json");
            fetch(h, { credentials: "same-origin" })
              .then(function (e) {
                return e.ok || "" === p
                  ? e
                  : ((h = Ht(t.sprite, n, ".json")),
                    fetch(h, { credentials: "same-origin" }));
              })
              .then(function (e) {
                if (e.ok) return e.json();
                a(new Error("Problem fetching sprite from " + h + ": " + e.statusText));
              })
              .then(function (e) {
                if (void 0 === e || 0 === Object.keys(e).length)
                  return a(new Error("No sprites found."));
                (s = e), (l = Ht(t.sprite, n, p + ".png")), c();
              })
              .catch(function (e) {
                a(new Error("Sprites cannot be loaded: " + h + ": " + e.message));
              });
          } else c();
        });
      }
      var Xt = {};
      function Zt(e, t) {
        var r = { type: t.type };
        function n() {
          var n = e.getTargetElement();
          if (n) {
            var o = t.layout || {},
              i = t.paint || {};
            (r.paint = i),
              (r.id = "olms-bg-" + i["background-opacity"] + i["background-color"]);
            var a = e.getView().getZoom();
            if (void 0 !== i["background-color"]) {
              var s = it(r, "paint", "background-color", a, Xt);
              n.style.background = ve.a.parse(s).toString();
            }
            void 0 !== i["background-opacity"] &&
              (n.style.opacity = it(r, "paint", "background-opacity", a, Xt)),
              "none" == o.visibility &&
                ((n.style.backgroundColor = ""), (n.style.opacity = ""));
          }
        }
        e.getTargetElement() && n(), e.on(["change:resolution", "change:target"], n);
      }
      function Qt(e, t) {
        var r;
        return (
          e.some(function (e) {
            if (e.id == t) return (r = e.source), !0;
          }),
          r
        );
      }
      function er(e) {
        var t = e.bounds;
        if (t) {
          var r = Object(yt.fromLonLat)([t[0], t[1]]),
            n = Object(yt.fromLonLat)([t[2], t[3]]);
          return [r[0], r[1], n[0], n[1]];
        }
      }
      function tr(e, t, r) {
        e = Object.assign({}, e);
        var n = new It.a({ declutter: !0, visible: !1 }),
          o = JSON.stringify(e),
          i = Dt[o];
        i ||
          (i = Dt[o] =
            new Rt.a({ url: e.tiles ? void 0 : r, tileJSON: e.tiles ? e : void 0 }));
        var a = i.on("change", function () {
          var t = i.getState();
          if ("ready" === t) {
            var r = i.getTileJSON(),
              o = Array.isArray(r.tiles) ? r.tiles : [r.tiles];
            if (e.url)
              for (var s = 0, l = o.length; s < l; ++s) {
                var u = o[s];
                0 != u.indexOf("http") && (o[s] = e.url + u);
              }
            var c = i.getTileGrid(),
              p = er(r),
              h = r.minzoom || 0,
              d = r.maxzoom || 22,
              f = i.get("ol-source");
            void 0 === f &&
              ((f = new Ft.a({
                attributions: i.getAttributions(),
                format: new Tt.a(),
                tileGrid: new vt.a({
                  origin: c.getOrigin(0),
                  extent: p || c.getExtent(),
                  minZoom: h,
                  resolutions: Le.slice(0, d + 1),
                  tileSize: 512,
                }),
                urls: o,
              })),
              i.set("ol-source", f)),
              Object(At.unByKey)(a),
              n.setSource(f);
          } else "error" === t && (i.set("ol-source", null), Object(At.unByKey)(a), n.setSource(void 0));
        });
        return "ready" === i.getState() && i.changed(), n;
      }
      function rr(e, t) {
        var r = new Et.a(),
          n = new Rt.a({
            transition: 0,
            url: e.tiles ? void 0 : t,
            tileJSON: e.tiles ? e : void 0,
            crossOrigin: "anonymous",
          }),
          o = n.on("change", function () {
            var t = n.getState();
            if ("ready" === t) {
              Object(At.unByKey)(o);
              var i = n.getTileJSON(),
                a = er(i),
                s = n.getTileGrid(),
                l = e.tileSize || i.tileSize || 512,
                u = i.minzoom || 0,
                c = i.maxzoom || 22;
              (n.tileGrid = new vt.a({
                origin: s.getOrigin(0),
                extent: a || s.getExtent(),
                minZoom: u,
                resolutions: Object(mt.createXYZ)({
                  maxZoom: c,
                  tileSize: l,
                }).getResolutions(),
                tileSize: l,
              })),
                r.setSource(n);
            } else "error" === t && (Object(At.unByKey)(o), r.setSource(void 0));
          });
        return (
          n.setTileLoadFunction(function (e, t) {
            if (-1 != t.indexOf("{bbox-epsg-3857}")) {
              var r = n.getTileGrid().getTileCoordExtent(e.getTileCoord());
              t = t.replace("{bbox-epsg-3857}", r.toString());
            }
            e.getImage().src = t;
          }),
          r
        );
      }
      var nr = new _t.a();
      function or(e, t) {
        var r,
          n,
          o = e.data;
        return (
          "string" == typeof o
            ? (n = $t(o, t))
            : (r = nr.readFeatures(o, { featureProjection: "EPSG:3857" })),
          new zt.a({
            source: new qt.a({
              attributions: e.attribution,
              features: r,
              format: nr,
              url: n,
            }),
            visible: !1,
          })
        );
      }
      function ir(e, t, r) {
        var n = it(e, "paint", "raster-opacity", r.getZoom(), Xt);
        t.setOpacity(n);
      }
      function ar(e, t, r, n, o, i) {
        var a = [],
          s = t.getView();
        s.isDef() ||
          s.getRotation() ||
          s.getResolutions() ||
          ((s = new kt.a({ maxResolution: Le[0] })), t.setView(s)),
          "center" in e && !s.getCenter() && s.setCenter(Object(yt.fromLonLat)(e.center)),
          "zoom" in e &&
            void 0 === s.getZoom() &&
            s.setResolution(Le[0] / Math.pow(2, e.zoom)),
          (s.getCenter() && void 0 !== s.getZoom()) ||
            s.fit(s.getProjection().getExtent(), { nearest: !0, size: t.getSize() }),
          e.sprite &&
            (0 == e.sprite.indexOf("mapbox://")
              ? (e.sprite = r + "/sprite" + i)
              : 0 != e.sprite.indexOf("http") &&
                (e.sprite = (n ? n + o : "") + e.sprite + i));
        for (
          var l, u, c, p, h, d, f = e.layers, y = [], m = 0, g = f.length;
          m < g;
          ++m
        ) {
          var v = (l = f[m]).type;
          if ("heatmap" == v || "fill-extrusion" == v || "hillshade" == v);
          else if ("background" == v) Zt(t, l);
          else {
            if ((p = l.source || Qt(f, l.ref)) != c) {
              if (
                (y.length && (a.push(lr(h, y, e, o, t)), (y = [])),
                (d = (u = e.sources[p]).url) && 0 == (d = $t(d, o)).indexOf("mapbox://"))
              ) {
                var b = d.replace("mapbox://", "");
                u.tiles = ["a", "b", "c", "d"].map(function (e) {
                  return (
                    "https://" +
                    e +
                    ".tiles.mapbox.com/v4/" +
                    b +
                    "/{z}/{x}/{y}." +
                    ("vector" == u.type ? "vector.pbf" : "png") +
                    i
                  );
                });
              }
              "vector" == u.type
                ? (h = tr(u, 0, d))
                : "raster" == u.type
                ? ((h = rr(u, d)).setVisible(!l.layout || "none" !== l.layout.visibility),
                  s.on("change:resolution", ir.bind(this, l, h, s)),
                  ir(l, h, s))
                : "geojson" == u.type && (h = or(u, o)),
                (c = p),
                h && h.set("mapbox-source", c);
            }
            y.push(l.id);
          }
        }
        return a.push(lr(h, y, e, o, t)), t.set("mapbox-style", e), Promise.all(a);
      }
      function sr(e, t) {
        var r, n, o, i, a;
        if (
          ((r = n = o = i = ""),
          ("string" == typeof e || e instanceof HTMLElement) &&
            (e = new wt.a({ target: e })),
          "string" == typeof t)
        ) {
          var s = t.match(Yt);
          s && ((n = s[1]), (r = s.length > 2 ? s[2] : "")),
            (a = new Promise(function (a, s) {
              fetch(t, { credentials: "same-origin" })
                .then(function (e) {
                  return e.json();
                })
                .then(function (l) {
                  var u = document.createElement("A");
                  u.href = t;
                  var c = u.href;
                  (i = u.pathname.split("/").slice(0, -1).join("/") + "/"),
                    (o = c.substr(0, c.indexOf(i))),
                    ar(l, e, n, o, i, r)
                      .then(function () {
                        a(e);
                      })
                      .catch(s);
                })
                .catch(function (e) {
                  s(new Error("Could not load " + t + ": " + e.message));
                });
            }));
        } else
          a = new Promise(function (r, n) {
            ar(t, e)
              .then(function () {
                r(e);
              })
              .catch(n);
          });
        return a;
      }
      function lr(e, t, r, n, o) {
        for (var i = 24, a = 0, s = r.layers, l = 0, u = s.length; l < u; ++l) {
          var c = s[l];
          -1 !== t.indexOf(c.id) &&
            ((i = Math.min("minzoom" in c ? c.minzoom : 0, i)),
            (a = Math.max("maxzoom" in c ? c.maxzoom : 24, a)));
        }
        return new Promise(function (s, l) {
          var u = function () {
            var o = e.getSource();
            if (o && "error" !== o.getState()) {
              if ("function" == typeof o.getTileGrid) {
                var u = o.getTileGrid();
                if (u) {
                  var c = u.getMinZoom();
                  (i > 0 || c > 0) &&
                    e.setMaxResolution(Math.min(Le[i], u.getResolution(c)) + 1e-9),
                    a < 24 && e.setMinResolution(Le[a] + 1e-9);
                }
              }
              o instanceof qt.a || o instanceof Ft.a
                ? Kt(e, r, t, n).then(
                    function () {
                      e.setVisible(!0), s();
                    },
                    function (e) {
                      l(e);
                    }
                  )
                : s();
            } else
              l(new Error("Error accessing data for source " + e.get("mapbox-source")));
          };
          e.set("mapbox-layers", t),
            -1 === o.getLayers().getArray().indexOf(e) && o.addLayer(e),
            e.getSource() ? u() : e.once("change:source", u);
        });
      }
      Object.assign(sr, {
        apply: function (e, t) {
          return (
            ("string" == typeof e || e instanceof HTMLElement) &&
              (e = new wt.a({ target: e })),
            setTimeout(function () {
              sr(e, t);
            }, 0),
            e
          );
        },
        applyBackground: function (e, t) {
          t.layers.some(function (t) {
            if ("background" == t.type) return Zt(e, t), !0;
          });
        },
        applyStyle: Kt,
        stylefunction: ht,
      });
      t.default = sr;
    },
  ]).default;
});
//# sourceMappingURL=olms.js.map
