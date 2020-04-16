// This function has been mainly copied from appendParams from OpenLayers
function appendParams(uri, params) {
  const keyParams = [];
  // Skip any null or undefined parameter values
  Object.keys(params).forEach(function(k) {
    if (params[k] !== null && params[k] !== undefined) {
      keyParams.push(k + '=' + params[k]);
    }
  });
  const qs = keyParams.join('&');
  // remove any trailing ? or &
  uri = uri.replace(/[?&]$/, '');
  // append ? or & depending on whether uri has existing parameters
  uri = uri.indexOf('?') === -1 ? uri + '?' : uri + '&';
  return uri + qs;
}

function getParamsFromOwsOptionsString(owsOptionsString) {
    if (owsOptionsString === undefined) {
      return undefined;
    }

    var params = {};
    var kvArray = owsOptionsString.split(",")

    kvArray.forEach( function (kv) {
        if (kv.includes(":")) {
            var [key, value] = kv.split(":");
            if (key !== "") {
                params[key] = value;
            }
        }
    });

    return params;
}

function getCapUrl(serviceUri, params) {
    if (serviceUri === undefined) {
      return undefined;
    }

    // transform to uppercase param keys
    var uppercaseParams = {};
    for (var key in params) {
        var upperKey = key.toUpperCase();
        uppercaseParams[ upperKey ] = params[key];
    }

    const defaultParams = {
      'SERVICE': 'WMS',
      'VERSION': '1.3.0',
      'REQUEST': 'GetCapabilities',
    };

    if (params !== undefined) {
        Object.assign(defaultParams, uppercaseParams);
    }

    return appendParams(serviceUri, defaultParams);
}

function getLegendGraphicUrl(serviceUri, params) {
    if (serviceUri === undefined) {
      return undefined;
    }

    // transform to uppercase param keys
    var uppercaseParams = {};
    for (var key in params) {
        var upperKey = key.toUpperCase();
        uppercaseParams[ upperKey ] = params[key];
    }

    const defaultParams = {
      'SERVICE': 'WMS',
      'VERSION': '1.3.0',
      'REQUEST': 'GetLegendGraphic',
      'SLD_VERSION': '1.1.0',
      'FORMAT': encodeURIComponent('image/png'),
      'WIDTH': '30',
      'HEIGHT': '20',
      'LEGEND_OPTIONS': encodeURIComponent('fontName:Open Sans;fontAntiAliasing:true;fontColor:0x777777;fontSize:10;dpi:96'),
      'TRANSPARENT': true
    };

    if (params !== undefined) {
        Object.assign(defaultParams, uppercaseParams);
    }

    return appendParams(serviceUri, defaultParams);
}