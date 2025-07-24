const _idlayer = "lycee";

mviewer.customControls.lycee = (function () {
  /*
   * Private
   */
  const _layer = mviewer.getLayer(_idlayer);
  let noFilterLabel = "All";
  let logicalOperator = "AND";

  return {
    /*
     * Public
     */

    init: function () {
      // mandatory - code executed when panel is opened
      const _html = [];
      //Check for xml config ccfilters
      let filters = [];
      if (_layer.ccfilters && _layer.ccfilters.filter) {
        //Convert filter to Array if is not Array (Fix one filter bug)
        if (!Array.isArray(_layer.ccfilters.filter)) {
          _layer.ccfilters.filter = [_layer.ccfilters.filter];
        }
        //Configuration
        if (_layer.ccfilters.logicaloperator) {
          logicalOperator = _layer.ccfilters.logicaloperator;
        }
        if (_layer.ccfilters.nofilterlabel) {
          noFilterLabel = _layer.ccfilters.nofilterlabel;
        }
        filters = _layer.ccfilters.filter.map(function (f) {
          return {
            label: f.label,
            field: f.field,
            values: f.values.split(","),
            multiple: f.multiselection && f.multiselection == "true",
          };
        });
      } else {
        console.log(
          `Le customcontrol ${_idlayer} n'a pu être initialisé car la conf xml est incomplète (propriété ccfilters)`
        );
      }
      filters.forEach(function (f) {
        const options = f.values.map(function (v) {
          return `<option ${f.multiple ? "selected" : ""}>${v}</option>`;
        });
        if (!f.multiple) {
          options.unshift(`<option>${noFilterLabel}</option>`);
        }
        const select = `<div class="form-group mb-2">
        <label for="${_idlayer}-${f.field}">${f.label} :</label>
        <div>
          <select ${f.multiple ? "multiple" : ""} placeholder="${
          f.label
        }" id="${_idlayer}-${f.field}" data-source="${
          f.field
        }" class="form-select cql-filter" onchange="mviewer.customControls.${_idlayer}.filter(this);">
            ${options.join("")}
          </select>
        </div>
      </div>`;
        _html.push(select);
      });
      document
        .querySelector(".cql-filter-list>style")
        .insertAdjacentHTML("afterend", _html.join("\n"));
    },

    filter: function (element) {
      const _filter = [];
      element
        .closest(".cql-filter-list")
        .querySelectorAll(".cql-filter")
        .forEach(function (q) {
          const values = Array.from(q.selectedOptions).map(({ value }) => value);
          if (values.length == 1) {
            // Filtres avec choix unique
            const value = values[0];
            if (value != noFilterLabel) {
              _filter.push(`${q.dataset.source} = '${value.replace(/'/g, "''")}'`);
            }
          } else {
            // Filtres avec choix multiple
            const list = [];
            values.forEach(function (value) {
              list.push(`'${value.replace(/'/g, "''")}'`);
            });
            _filter.push(`${q.dataset.source} in (${list.join(",")})`);
          }
        });
      console.log(_filter);
      const layer = _layer.layer;
      const _source = layer.getSource();
      const params = _source.getParams();
      params.t = new Date().getMilliseconds();
      if (_filter.length > 0) {
        const cql_filter = _filter.join(` ${logicalOperator} `);
        params.CQL_FILTER = cql_filter;
      } else {
        params.CQL_FILTER = "1=1";
      }
      _source.updateParams(params);
    },

    destroy: function () {
      // mandatory - code executed when panel is closed
    },
  };
})();
