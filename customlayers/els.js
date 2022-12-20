{
  mviewer.customLayers.els = {};
  var els = mviewer.customLayers.els;
  els.filter = false;
  els.mode = "AND"; /*AND | OR*/
  var els2GeoJSON = function (data) {
    var geojson = {
      type: "FeatureCollection",
      features: [],
    };
    var getProperties = function (source) {
      var properties = {};
      for (var propertyName in source) {
        if (!["geometry", "@timestamp", "@version"].includes(propertyName)) {
          properties[propertyName] = source[propertyName];
        }
      }
      return properties;
    };
    data.hits.hits.forEach(function (item) {
      var properties = getProperties(item._source);
      var prop = {};
      if (item._type === "etude_patrimoine_simple") {
        prop.source = "dossiers d'études complets";
      } else {
        prop.source = "recensement avant étude";
      }
      properties.type = item._type;
      properties.source = prop.source;
      var feature = {
        type: "Feature",
        id: item._id,
        geometry: item._source.geometry,
        properties: properties,
      };
      geojson.features.push(feature);
    });
    return JSON.stringify(geojson);
  };

  var elsLoader = function (extent, resolution, projection) {
    var filter = {
      match_all: {},
    };
    if (mviewer.customLayers.els.filter) {
      var matchQueries = [];
      mviewer.customLayers.els.filter.forEach(function (text) {
        var matchQuery = {
          match: {
            _all: {
              query: text,
              operator: "and",
            },
          },
        };
        matchQueries.push(matchQuery);
      });
      filter = {
        bool: {
          should: matchQueries,
          minimum_should_match: els.mode === "AND" ? matchQueries.length : 1,
        },
      };
    }
    var proj = projection.getCode();
    var e = ol.proj.transformExtent(extent, proj, "EPSG:4326");
    var url = "https://ows.region-bretagne.fr/kartenn/_search?";
    var geofilter = JSON.stringify({
      from: 0,
      size: 5000,
      query: {
        bool: {
          must: [
            filter,
            {
              bool: {
                should: [
                  {
                    type: {
                      value: "etude_patrimoine_simple",
                    },
                  },
                  {
                    type: {
                      value: "recensement_patrimoine",
                    },
                  },
                ],
              },
            },
          ],
          filter: {
            geo_shape: {
              geometry: {
                shape: {
                  type: "envelope",
                  coordinates: [
                    [e[0], e[1]],
                    [e[2], e[3]],
                  ],
                },
              },
            },
          },
        },
      },
    });
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    var onError = function () {
      vectorSource.removeLoadedExtent(extent);
    };
    xhr.onerror = onError;
    xhr.onload = function () {
      if (xhr.status == 200) {
        vectorSource.addFeatures(
          new ol.format.GeoJSON().readFeatures(
            els2GeoJSON(JSON.parse(xhr.responseText)),
            {
              dataProjection: "EPSG:4326",
              featureProjection: proj,
            }
          )
        );
      } else {
        onError();
      }
    };
    xhr.send(geofilter);
  };

  els.legend = {
    items: [],
  };
  var styleEtude = [
    new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: "rgba(255, 118, 117,1.0)",
        }),
        stroke: new ol.style.Stroke({
          color: "#ffffff",
          width: 4,
        }),
        radius: 9,
      }),
    }),
  ];

  var styleRecensement = [
    new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: "rgba(99, 110, 114,1.0)",
        }),
        stroke: new ol.style.Stroke({
          color: "#ffffff",
          width: 4,
        }),
        radius: 9,
      }),
    }),
  ];

  els.legend.items.push({ styles: styleEtude, label: "Etudes", geometry: "Point" });
  els.legend.items.push({
    styles: styleRecensement,
    label: "Recensement",
    geometry: "Point",
  });

  var typeStyle = function (feature) {
    var stl;
    if (feature.get("type") === "recensement_patrimoine") {
      stl = styleRecensement;
    } else if (feature.get("type") === "etude_patrimoine_simple") {
      stl = styleEtude;
    }
    return stl;
  };

  var vectorSource = new ol.source.Vector({
    loader: elsLoader,
    strategy: ol.loadingstrategy.bbox,
  });

  mviewer.customLayers.els.layer = new ol.layer.Vector({
    source: vectorSource,
    style: typeStyle,
  });
  els.handle = function (features, views) {
    var extraTemplate = [
      "{{#lien_image}}",
      '<img src="{{lien_image}}" class="img-responsive" />',
      "{{/lien_image}}",
      "{{#photo_1}}",
      '<img src="{{photo_1}}" class="img-responsive" />',
      "{{/photo_1}}",
      '<p class="text-feature">',
      "{{#datation_principale}}",
      "<span > Datation :</span> {{datation_principale}}<br/>",
      "{{/datation_principale}}",
      "<span > Commune : </span>{{commune}}<br/>",
      "{{#localisation}}",
      "<span> Localisation :</span> {{localisation}}<br/>",
      "{{/localisation}}",
      "{{^localisation}}",
      "<span > Localisation :</span> {{adresse}} {{lieudit}} {{commune}}<br/>",
      "{{/localisation}}",
      "{{#cadre_etude}}",
      "<span > Enquête(s) :</span> {{cadre_etude}}<br/>",
      "{{/cadre_etude}}",
      "{{#date_bordereau}}",
      "<span > Date(s) de bordereau  :</span> {{date_bordereau}}<br/>",
      "{{/date_bordereau}}",
      "{{#lien_dossier}}",
      '<div class="but_link">',
      '<p> <a href="{{lien_dossier}}" target=_blank"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> Lien vers dossier</a>',
      "</p>",
      "</div>",
      "{{/lien_dossier}}",
      "{{#url}}",
      '<div class="but_link">',
      '<p> <a href="{{url}}" target=_blank"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> Lien vers notice</a>',
      "</p>",
      "</div>",
      "{{/url}}",
      "</p>",
    ].join(" ");
    var extendHTML = function (wfsfeatures) {
      wfsfeatures.forEach(function (wfsfeature, i) {
        var html = Mustache.render(extraTemplate, wfsfeature.properties);
        $(document.getElementById(wfsfeature.properties.search_id)).append(html);
      });
    };

    var renderHTML = function (elements) {
      var l = mviewer.getLayer("els");
      var html;
      if (l.template) {
        html = info.templateHTMLContent(elements, l);
      } else {
        html = info.formatHTMLContent(elements, l);
      }
      var view = views["right-panel"];
      view.layers.push({
        id: view.layers.length + 1,
        firstlayer: true,
        manyfeatures: features.length > 1,
        nbfeatures: features.length,
        name: l.name,
        layerid: "els",
        theme_icon: l.icon,
        html: html,
      });
    };
    // Get additional infos via wfs for each feature
    var search_ids = [];
    var featuretypes = [];
    features.forEach(function (feature, i) {
      if (feature.properties && feature.properties.search_id) {
        search_ids.push("'" + feature.properties.search_id + "'");
        if (featuretypes.indexOf(feature.properties.type) === -1) {
          featuretypes.push(feature.properties.type);
        }
      }
    });
    if (search_ids.length > 0) {
      var wfs_url = "http://ows.region-bretagne.fr/geoserver/rb/wfs";
      var wfs_params = {
        REQUEST: "getFeature",
        TYPENAME: featuretypes.join(","),
        VERSION: "2.0.0",
        SERVICE: "WFS",
        outputFormat: "application/json",
        CQL_FILTER: "search_id IN (" + search_ids.join(",") + ")",
      };

      $.ajax({
        type: "GET",
        async: true,
        url: wfs_url,
        data: wfs_params,
        dataType: "json",
        success: function (data) {
          extendHTML(data.features);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(thrownError);
        },
      });
    }
    renderHTML(features);
  };
}
