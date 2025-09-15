var mviewer = mviewer || {};
mviewer.templates = {};

mviewer.templates.tooltip = `<div class="tooltip mv-tooltip" role="tooltip">
    <div class="mv-tooltip tooltip-arrow"></div>
    <div class="mv-tooltip tooltip-inner popover-content"></div>
</div>`;

mviewer.templates.popover = `
  <div class="popover bs-popover-top mv-tooltip mv-popover" role="tooltip">
    <div class="popover-arrow mv-tooltip"></div>
    <h3 class="popover-header d-none"></h3>
    <div class="popover-body mv-tooltip popover-content tooltip-inner"></div>
  </div>
`;

let locationHref = location.hash || "#";
mviewer.templates.themeLayer = `<li class="mv-nav-item" onclick="mviewer.toggleLayer(this);" data-layerid="{{layerid}}"">
    <a href="${locationHref}" >
        <span class="state-icon far mv-unchecked"></span> <div i18n="layers.{{layerid}}">{{title}}</div>
        <input type="checkbox" class="hidden" value="false" >
    </a>
</li>`;

mviewer.templates.theme = `
<li class="{{cls}}" id="theme-layers-{{id}}" >
    <a href="#">
        <div class="menu-theme-layers-name">
        <span class="fa-stack">
            <i class="{{icon}} fa-stack-1x "></i>
        </span><span i18n="themes.{{id}}">{{name}}</span></div>
    {{#toggleAllLayers}}
        <div class="toggle-theme-layers">
            <span class="badge" title="Afficher/Masquer toutes les couches de la thématique" i18n="theme.display.layers">0/1</span>
        </div>
    {{/toggleAllLayers}}
    </a>
    <ul class="nav-pills nav-stacked" style="list-style-type:none;">
        {{#groups}}
            <li class="level-2">
                <a href="#" i18n="{{title}}">{{title}}</a>
                <ul class="nav-pills nav-stacked" style="list-style-type:none;">
                {{#layers}}
                    ${mviewer.templates.themeLayer}
                {{/layers}}
                </ul>
            </li>
        {{/groups}}
        {{#layers}}
            ${mviewer.templates.themeLayer}
        {{/layers}}
    </ul>
</li>`;

mviewer.templates.layerControl = `
<li class="{{cls}}" data-layerid="{{layerid}}" data-title=" {{title}}">
    <div class="layerdisplay-title" >
        <div class="layerdisplay-titleLabel">
            <i class="mv-grip ri-draggable" title="Déplacer" aria-hidden="true" i18n="theme.layers.move"></i></i><div i18n="{{layerid}}.legend.title">{{title}}</div>
        {{#secure_layer}}
        <a data-bs-toggle="modal"
                data-bs-target="#loginpanel"'
                onclick="mviewer.setLoginInfo(this);"'
                id="ar#{{layerid}}"'
                title="Données accès restreint"'
                i18n="theme.layers.restricted
                tabindex="111" accesskey="11" class="btn__login">
            <i class="ri-lock-line"></i>
        </a>
        {{/secure_layer}}
        </div>
        <a href="${locationHref}" class="mv-layer-remove" aria-label="close" onclick="mviewer.removeLayer(this)" title="Supprimer" i18n="theme.layers.remove">
            <i class="ri-close-large-line"></i>
        </a>
    </div>
    <div class="layerdisplay-subtitle">
    {{#styleControl}}
        <div class="selected-sld layerdisplay-badge"><span></span></div>
    {{/styleControl}}
    {{#attributeControl}}
        <div class="selected-attribute layerdisplay-badge"><span>Par défaut</span></div>
    {{/attributeControl}}
    </div>
    <div class="layerdisplay-legend">
        <div id="loading-{{layerid}}" class="mv-layer-indicator" style="display:none">
            <i class="ri-loader-4-line"></i>
        </div>
        <canvas class="vector-legend" id="vector-legend-{{layerid}}" width="0" height="0"/>
        <img class="mv-legend" {{crossorigin}} id="legend-{{layerid}}" i18n="{{layerid}}.legend.image" src="{{legendurl}}"
                alt="Légende non disponible" onload="mviewer.legendSize(this)"
                onError="this.onerror=null;this.src=\'img/nolegend.png\';"/>
    </div>
    <div class="mv-layer-options" style="display: none;" data-layerid="{{layerid}}" >
        <div class="row mv-layer-options-opacity my-1">
            <div class="col-md-12">
                <div class="form-group form-group-opacity">
                    <label for="{{layerid}}-layer-opacity" i18n="legend.label.opacity">Opacité</label>
                    <input type="text" class="mv-slider" id="{{layerid}}-layer-opacity"
                            name="{{layerid}}" value="{{opacity}}"
                            data-provide="slider" data-slider-value="{{opacity}}" data-slider-max="1"
                            data-slider-min="0" data-slider-step=".1"
                            onchange="mviewer.changeLayerOpacity(this.name, this.value)">
                </div>
            </div>
        </div>
    {{#tooltipControl}}
        <div class="row mv-layer-options-tooltips mb-3">
            <div class="col-md-12">
                <a data-layerid="{{layerid}}" class="layer-tooltip"
                        onclick="info.toggleTooltipLayer(this);" id="{{layerid}}-layer-tooltip" href="#">
                    <span class="state-icon far mv-unchecked"></span><div style="display:inline;" i18n="legend.radio.tooltips">Afficher les infobulles</div>
                    <input type="checkbox" class="hidden" value="false" style="display:none;">
                </a>
            </div>
        </div>
    {{/tooltipControl}}
    {{#attribution}}
        <div class="row mv-layer-options-attribution my-1 mb-2">
            <div class="col-md-12">
                <div>
                    <span i18n="{{layerid}}.legend.attribution" id="{{layerid}}-attribution">{{{attribution}}}</span>
                    {{#metadata}}
                        <a href="#" tabindex="0" role="button" id="{{layerid}}-layer-summary" tabindex="10" data-bs-trigger="focus"
                                data-bs-custom-class="popover-layer-summary" data-bs-title="Popover title" data-bs-toggle="popover" data-bs-container="body" class="mv-layer-summary" data-bs-html="true"
                                data-bs-content="g">
                                <i title="Afficher les informations" i18n="theme.layers.infos" class="ri-information-line"></i>
                        </a>
                    {{/metadata}}
                </div> 
                <div>  
                    <span id="{{layerid}}-date" class="mv-layer-options-attribution-date">{{modifiedDate}}</span>
                </div> 
            </div>
        </div>
    {{/attribution}}
    {{#styleControl}}
        <div class="row mv-layer-options-styles my-1">
            <div class="col-md-12">
                <div class="form-group form-group-analyses">
                    {{#styleTitle }}
                        <label for="{{layerid}}-styles-selector">{{styleTitle}}</label>
                    {{/styleTitle}}
                    {{^styleTitle}}
                        <label for="{{layerid}}-styles-selector" i18n="style.control.analyses">Analyse</label>
                    {{/styleTitle}}
                    <select class="form-select form-select-sm my-1" name="{{layerid}}" id="{{layerid}}-styles-selector"
                            onchange="mviewer.setLayerStyle(this.name ,this.value, this);">
                    {{#styles}}
                        <option label="{{label}}" value="{{style}}">{{label}}</option>
                    {{/styles}}
                    </select>
                </div>
            </div>
        </div>
    {{/styleControl}}
    {{#attributeControl}}
        <div class="row mv-layer-options-attribute my-1">
            <div class="col-md-12">
                <div class="form-group form-group-attributes">
                    {{#attributeLabel}}
                        <label for="{{layerid}}-attributes-selector">{{attributeLabel}}</label>
                    {{/attributeLabel}}
                    {{^attributeLabel}}
                        <label for="{{layerid}}-attributes-selector" i18n="attribute.control.filter">Attributs</label>
                    {{/attributeLabel}}
                    <select class="form-select form-select-sm my-1" name="{{layerid}}" id="{{layerid}}-attributes-selector"
                        onchange="mviewer.setLayerAttribute(this.name ,this.value, this);">
                    {{#attributes}}
                        <option label="{{label}}" value="{{attribute}}">{{label}}</option>
                    {{/attributes}}
                    </select>
                </div>
            </div>
        </div>
    {{/attributeControl}}
    {{#timeControl}}
        <div class="row mv-layer-options-time my-2">
            <div class="col-md-12">
                <div class="form-group form-group-timer ">
                    <div class="mv-layer-options-time-header">
                        <label for="{{layerid}}-layer-timefilter" i18n="control.time.time">Temporalité</label>
                        <div>                        
                            <span class="mv-time-player-selection" data-layerid="{{layerid}}"></span>
                            <span class="mv-time-player" data-layerid="{{layerid}}"></span>
                        </div>
                    </div>
                    <input type="text" id="{{layerid}}-layer-timefilter" name="{{layerid}}" >
                </div>
            </div>
        </div>
    {{/timeControl}}
    {{#sensorthings}}
    <div class="row mv-layer-options-sensor my-2">
        <div class="col-md-12">
            <div class="form-group">        
                <span class="fas fa-satellite-dish" data-layerid="{{layerid}}" style="margin-left: 3px;"></span>
                <label for="{{layerid}}-layer-sensorthings" i18n="legend.label.sensorthings">SensorThings</label>
                <div class="list-streams" id="sensorthings-list-{{layerid}}">
                    <span>Sélectionnez un capteur sur la carte</span>
                </div>
            </div>
        </div>
    </div>
    {{/sensorthings}}
    <div class="mv-custom-controls" data-layerid="{{layerid}}"></div>
    </div>
    <a href="#" aria-label="Options" onclick="mviewer.toggleLayerOptions(this);" title="Options" i18n="theme.layers.options" class="icon-options">
        <i class="state-icon ri-arrow-down-line"></i>
    </a>
</li>`;

mviewer.templates.backgroundLayerControlGallery = `
<li data-original-title="{{label}}"
    title="{{label}}"
    style="background:url(\'{{thumbgallery}}\') center bottom/60px no-repeat;"
    onclick="mviewer.setBaseLayer(\'{{id}}\')">
    <a id="{{id}}_btn" href="#" aria-label="{{label}}"></a>
</li>`;

mviewer.templates.featureInfo = {};
mviewer.templates.featureInfo.default = `
<div id="{{panel}}-selector">
    <div class="row featureInfo__default">
        <div class="col-md-12">
            <div class="tabs-left">
                <ul class="nav nav-tabs flex-column">
                {{#layers}}
                    <li title="{{name}}" class="{{#firstlayer}}active{{/firstlayer}} nav-item" data-layerid="{{layerid}}">
                        <a class="{{#firstlayer}}active{{/firstlayer}} nav-link" onclick="mviewer.setInfoPanelTitle(this,\'{{panel}}\',\'layers.{{layerid}}\');" title="{{name}}" i18n="layers.{{layerid}}" href="#slide-{{panel}}-{{id}}" data-bs-toggle="tab">
                            <span class="fa {{theme_icon}}"></span>
                        </a>
                    </li>
                {{/layers}}
                </ul>
                <div class="tab-content">
                {{#layers}}
                    <div  role="tabpanel" class="{{#firstlayer}}active in {{/firstlayer}}tab-pane" id="slide-{{panel}}-{{id}}" >
                        <div id="carousel-{{panel}}-{{id}}" class="carousel slide carousel-dark" data-bs-interval="false">
                        <ul class="carousel-inner" role="listbox">
                        {{{html}}}
                        </ul>
                        {{#manyfeatures}}
                            <a class="carousel-control-prev" data-bs-target="#carousel-{{panel}}-{{id}}" 
                            role="button" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only" i18n="carousel.control.previous">Previous</span>
                            </a>
                            <a class="carousel-control-next" data-bs-target="#carousel-{{panel}}-{{id}}" 
                            role="button" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only" i18n="carousel.control.next">Next</span>
                            </a>
                            <div><span class="badge counter-slide">1/{{nbfeatures}}</span></div>
                        {{/manyfeatures}}
                        </div>
                    </div>
                {{/layers}}
                </div>
                </div>
        </div>
    </div>
</div>`;

mviewer.templates.featureInfo.brut = `
<div id="{{panel}}-selector">
    <div class="row featureInfo__brut">
        <div class="col-md-12">
            <div class="list-group">
            {{#layers}}
                <div class="card">
                <div class="card-header"> <h6 class="panel-title m-0">{{name}}</h6> </div>
                <ul class="list-group card-body" data-layerid="{{layerid}}">
                {{{html}}}
                </ul>
                </div>
            {{/layers}}
            </div>
        </div>
    </div>
</div>`;

mviewer.templates.featureInfo.accordion = `
<div id="{{panel}}-selector">
    <div class="row featureInfo__accordion" style="overflow-y:auto;margin:0;">
        <div class="col-md-12" style="overflow:auto;">
            <div class="accordion" id="accordion" role="tablist" aria-multiselectable="true" style="list-style: none;">
            {{#layers}}
                <div class="accordion-item">
                    <h6 class="accordion-header mv-theme" role="tab" id="heading-{{panel}}-{{id}}" data-layerid="{{layerid}}">
                        <a role="button" class="accordion-button {{#firstlayer}}{{/firstlayer}}{{^firstlayer}}collapsed{{/firstlayer}}" i18n="layers.{{layerid}}" data-bs-toggle="collapse" data-bs-parent="#accordion" href="#accordion-{{panel}}-{{id}}" aria-expanded="{{#firstlayer}}true{{/firstlayer}}{{^firstlayer}}false{{/firstlayer}}" aria-controls="accordion-{{panel}}-{{id}}">
                        {{name}}
                        </a>
                    </h6>
                    <div id="accordion-{{panel}}-{{id}}" class="accordion-collapse collapse {{#firstlayer}}show{{/firstlayer}}" role="tabpanel" aria-labelledby="heading-{{panel}}-{{id}}">
                        <div class="accordion-body">
                            <div id="carousel-{{panel}}-{{id}}" class="carousel slide carousel-dark" data-bs-interval="false">
                            <ul class="carousel-inner" role="listbox">
                            {{{html}}}
                            </ul>
                            {{#manyfeatures}}
                                <a class="carousel-control-prev" data-bs-target="#carousel-{{panel}}-{{id}}" 
                                role="button" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only" i18n="carousel.control.previous">Previous</span>
                                </a>
                                <a class="carousel-control-next" data-bs-target="#carousel-{{panel}}-{{id}}" 
                                role="button" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only" i18n="carousel.control.next">Next</span>
                                </a>
                                <span class="badge counter-slide">1/{{nbfeatures}}</span>
                            {{/manyfeatures}}
                            </div>
                        </div>
                    </div>
                </div>
            {{/layers}}
            </div>
        </div>
    </div>
</div>`;

mviewer.templates.featureInfo.allintabs = [
  '<div id="{{panel}}-selector">',
  '<div class="row featureInfo_allintabs">',
  '<div class="col-md-12">',
  '<div class="tabs-left">',
  '<ul class="nav nav-tabs flex-column">',
  "{{#layers}}",
  '<li title="{{name}}" class="nav-item" data-layerid="{{layerid}}" {{#initiallayerid}}initiallayerid="{{initiallayerid}}" {{/initiallayerid}}>',
  '<a class="nav-link {{#firstlayer}}active{{/firstlayer}}" onclick="mviewer.setInfoPanelTitle(this,\'{{panel}}\',\'layers.{{initiallayerid}}\');" title="{{name}}" i18n="layers.{{initiallayerid}}" href="#slide-{{panel}}-{{id}}" data-bs-toggle="tab">',
  '<span class="fa {{theme_icon}}"></span>',
  '{{#multiple}}<span class="item-number">{{index}}</spanclass>{{/multiple}}',
  "</a>",
  "</li>",
  "{{/layers}}",
  "</ul>",
  '<div class="tab-content">',
  "{{#layers}}",
  '<div  role="tabpanel" class="{{#firstlayer}}active in {{/firstlayer}}tab-pane" id="slide-{{panel}}-{{id}}" >',
  '<div id="carousel-{{panel}}-{{id}}" div class="carousel slide" data-bs-interval="false">',
  '<ul class="carousel-inner" role="listbox">',
  "{{{html}}}",
  "</ul>",
  "</div>",
  "</div>",
  "{{/layers}}",
  "</div>",
  "</div>",
  "</div>",
  "</div>",
  "</div>",
].join("");

mviewer.templates.ctrlSensor = `
<ul class="p-0 my-2" style="list-style-type:none;">
    {{#datastreams}}
    <li class="datastreams mb-2" onclick="mviewer.getLayer('{{idLayer}}').layer.sensorthings.query(this)" data-datastreamid="{{id}}">
        <a href="#">
            <span class="state-icon far mv-unchecked" name='{{name}}' datastream-span-id="{{id}}">
            </span>
            {{name}}
            <input type="checkbox" value="false" datastream-input-id="{{id}}">
        </a>
    </li>
    {{/datastreams}}
    {{#multidatastreams}}
    <li class="datastreams mb-2" onclick="mviewer.getLayer('{{idLayer}}').layer.sensorthings.query(this)" data-datastreamid="{{id}}">
        <a href="#">
            <span class="state-icon far mv-unchecked" name='{{name}}' datastream-span-id="{{id}}">
            </span>
            {{name}}
            <input type="checkbox" value="false" datastream-input-id="{{id}}">
        </a>
    </li>
    {{/multidatastreams}}
</ul>
`;
