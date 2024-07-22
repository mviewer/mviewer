var mviewer = mviewer || {};
mviewer.templates = {};

mviewer.templates.tooltip = `<div class="tooltip mv-tooltip" role="tooltip">
    <div class="mv-tooltip tooltip-arrow"></div>
    <div class="mv-tooltip tooltip-inner popover-content"></div>
</div>`;

let locationHref = location.hash || "#";
mviewer.templates.themeLayer = `<li class="mv-nav-item" onclick="mviewer.toggleLayer(this);" data-layerid="{{layerid}}"">
    <a href="${locationHref}" >
        <span class="state-icon far mv-unchecked"></span> {{title}}
        <input type="checkbox" class="hidden" value="false" >
    </a>
</li>`;

mviewer.templates.theme = `
<li class="{{cls}}" id="theme-layers-{{id}}" >
    <a href="#">
        <span class="fa-stack fa-lg pull-left col-sm-3">
            <i class="{{icon}} fa-stack-1x "></i>
        </span>{{name}}
    {{#toggleAllLayers}}
        <div class="toggle-theme-layers">
            <span class="badge" title="Afficher/Masquer toutes les couches de la thématique" i18n="theme.display.layers">0/1</span>
        </div>
    {{/toggleAllLayers}}
    </a>
    <ul class="nav-pills nav-stacked" style="list-style-type:none;">
        {{#groups}}
            <li class="level-2">
                <a href="#">{{title}}</a>
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

const sensorThingsControl = `
<div class="row">
    <div class="col-md-12">
        <div class="form-group form-group-timer ">
            <label for="{{layerid}}-layer-sensorthings" i18n="legend.label.sensorthings">SensorThings</label>
            <span class="fas fa-satellite-dish" data-layerid="{{layerid}}" style="margin-left: 3px;"></span>
            <div class="panel panel-default">
                <div class="panel-body list-streams" id="sensorthings-list-{{layerid}}">
                    Veuillez sélectionner un capteur...
                </div>
            </div>
        </div>
    </div>
</div>
`;

mviewer.templates.layerControl = `
<li class="{{cls}}" data-layerid="{{layerid}}" data-title=" {{title}}">
    <div class="row layerdisplay-title" >
        <i class="mv-grip fas fa-grip-vertical" title="Déplacer" i18n="theme.layers.move"></i><a>{{title}}</a>
        {{#secure_layer}}
        <button data-toggle="modal"
                data-target="#loginpanel"'
                onclick="mviewer.setLoginInfo(this);"'
                id="ar#{{layerid}}"'
                title="Données accès restreint"'
                i18n="theme.layers.restricted
                tabindex="111" accesskey="11" class="btn btn-default btn-raised">
            <span class="lock-icon glyphicon glyphicon-lock" aria-hidden="true"></span>
        </button>
        {{/secure_layer}}
        <a href="${locationHref}" class="mv-layer-remove" aria-label="close" onclick="mviewer.removeLayer(this)" title="Supprimer" i18n="theme.layers.remove">
            <span class="glyphicon glyphicon-remove"></span>
        </a>
    </div>
    <div class="layerdisplay-subtitle">
    {{#styleControl}}
        <div class="selected-sld fas"><span></span></div>
    {{/styleControl}}
    {{#attributeControl}}
        <div class="selected-attribute fas"><span>Par défaut</span></div>
    {{/attributeControl}}
    </div>
    <div class="row layerdisplay-legend">
        <div id="loading-{{layerid}}" class="mv-layer-indicator" style="display:none">
            <div class="loader">Loading...</div>
        </div>
        <canvas class="vector-legend" id="vector-legend-{{layerid}}" width="0" height="0"/>
        <img class="mv-legend" {{crossorigin}} id="legend-{{layerid}}" src="{{legendurl}}"
                alt="Légende non disponible" onload="mviewer.legendSize(this)"
                onError="this.onerror=null;this.src=\'img/nolegend.png\';"/>
    </div>
    <div class="mv-layer-options" style="display: none;" data-layerid="{{layerid}}" >
        <div class="row">
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
        <div class="row">
            <div class="col-md-12">
                <a data-layerid="{{layerid}}" class="layer-tooltip"
                        onclick="info.toggleTooltipLayer(this);" id="{{layerid}}-layer-tooltip" href="#">
                    <span class="state-icon far mv-unchecked"></span><div style="display:inline;" i18n="legend.radio.tooltips">Afficher les infobulles</div>
                    <input type="checkbox" class="hidden" value="false">
                </a>
            </div>
        </div>
    {{/tooltipControl}}
    {{#attribution}}
        <div class="row">
            <div class="col-md-12">
                <p>
                    <span id="{{layerid}}-attribution">{{{attribution}}}</span>
                    {{#metadata}}
                        <a href="#" role="button" id="{{layerid}}-layer-summary" tabindex="10" data-trigger="focus"
                                data-toggle="popover" class="mv-layer-summary" data-html="true"
                                data-content="">
                                <span title="Afficher les informations" i18n="theme.layers.infos" class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                        </a>
                    {{/metadata}}
                    <span id="{{layerid}}-date" style="float:right;">{{modifiedDate}}</span>
                </p>
            </div>
        </div>
    {{/attribution}}
    {{#styleControl}}
        <div class="row">
            <div class="col-md-12">
                <div class="form-group form-group-analyses">
                    {{#styleTitle }}
                        <label for="{{layerid}}-styles-selector">{{styleTitle}}</label>
                    {{/styleTitle}}
                    {{^styleTitle}}
                        <label for="{{layerid}}-styles-selector" i18n="style.control.analyses">Analyse</label>
                    {{/styleTitle}}
                    <select class="form-control" name="{{layerid}}" id="{{layerid}}-styles-selector"
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
        <div class="row">
            <div class="col-md-12">
                <div class="form-group form-group-attributes">
                    {{#attributeLabel}}
                        <label for="{{layerid}}-attributes-selector">{{attributeLabel}}</label>
                    {{/attributeLabel}}
                    {{^attributeLabel}}
                        <label for="{{layerid}}-attributes-selector" i18n="attribute.control.filter">Attributs</label>
                    {{/attributeLabel}}
                    <select class="form-control" name="{{layerid}}" id="{{layerid}}-attributes-selector"
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
        <div class="row">
            <div class="col-md-12">
                <div class="form-group form-group-timer ">
                    <label for="{{layerid}}-layer-timefilter" i18n="control.time.time">Temporalité</label>
                    <span class="fa mv-time-player" data-layerid="{{layerid}}" style="margin-left: 3px;"></span>
                    <span class="mv-time-player-selection" data-layerid="{{layerid}}" style="margin-left: 3px;"></span>
                    <input type="text" id="{{layerid}}-layer-timefilter" name="{{layerid}}" >
                </div>
            </div>
        </div>
    {{/timeControl}}
    {{#sensorthings}}
        ${sensorThingsControl}
    {{/sensorthings}}
        <div class="mv-custom-controls" data-layerid="{{layerid}}"></div>
        </div>
        <a href="#" aria-label="Options" onclick="mviewer.toggleLayerOptions(this);" title="Options" i18n="theme.layers.options" class="icon-options">
            <span class="state-icon glyphicon glyphicon-chevron-down"></span>
        </a>
</li>`;

mviewer.templates.backgroundLayerControlGallery = `
<li data-original-title="{{label}}"
    title="{{label}}"
    style="background:url(\'{{thumbgallery}}\') center bottom/60px no-repeat;"
    onclick="mviewer.setBaseLayer(\'{{id}}\')">
    <a id="{{id}}_btn" href="#"></a>
</li>`;

mviewer.templates.featureInfo = {};
mviewer.templates.featureInfo.default = `
<div id="{{panel}}-selector">
    <div class="row">
        <div class="col-md-12">
            <div class="tabs-left">
                <ul class="nav nav-tabs">
                {{#layers}}
                    <li title="{{name}}" class="{{#firstlayer}}active{{/firstlayer}}" data-layerid="{{layerid}}">
                        <a onclick="mviewer.setInfoPanelTitle(this,\'{{panel}}\');" title="{{name}}" href="#slide-{{panel}}-{{id}}" data-toggle="tab">
                            <span class="fa {{theme_icon}}"></span>
                        </a>
                    </li>
                {{/layers}}
                </ul>
                <div class="tab-content">
                {{#layers}}
                    <div  role="tabpanel" class="{{#firstlayer}}active in {{/firstlayer}}tab-pane" id="slide-{{panel}}-{{id}}" >
                        <div id="carousel-{{panel}}-{{id}}" div class="carousel slide" data-interval="false">
                        <ul class="carousel-inner" role="listbox">
                        {{{html}}}
                        </ul>
                        {{#manyfeatures}}
                            <a class="left carousel-control" href="#carousel-{{panel}}-{{id}}" 
                            role="button" data-slide="prev">
                            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                            <span class="sr-only" i18n="carousel.control.previous">Previous</span>
                            </a>
                            <a class="right carousel-control" href="#carousel-{{panel}}-{{id}}" 
                            role="button" data-slide="next">
                            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                            <span class="sr-only" i18n="carousel.control.next">Next</span>
                            </a>
                            <span class="badge counter-slide">1/{{nbfeatures}}</span>
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
    <div class="row">
        <div class="col-md-12">
            <div class="list-group" style="height:100%;width:100%;overflow-y: scroll;padding-bottom: 82px;">
            {{#layers}}
                <div class="panel panel-primary">
                <div class="panel-heading"> <h3 class="panel-title">{{name}}</h3> </div>
                <div class="panel-body">
                <ul class="list-group-item" data-layerid="{{layerid}}" style="padding-right:0px;">
                {{{html}}}
                </ul>
                </div></div>
            {{/layers}}
            </div>
        </div>
    </div>
</div>`;

mviewer.templates.featureInfo.accordion = `
<div id="{{panel}}-selector">
    <div class="row">
        <div class="col-md-12">
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true" style="list-style: none;">
            {{#layers}}
                <div class="panel">
                <div class="panel-heading mv-theme" role="tab" id="heading-{{panel}}-{{id}}" data-layerid="{{layerid}}">
                    <h4 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#accordion-{{panel}}-{{id}}" aria-expanded="{{#firstlayer}}true{{/firstlayer}}{{^firstlayer}}false{{/firstlayer}}" aria-controls="accordion-{{panel}}-{{id}}">
                    {{name}}
                    </a>
                    </h4>
                </div>
                <div id="accordion-{{panel}}-{{id}}" class="panel-collapse collapse {{#firstlayer}}in{{/firstlayer}}" role="tabpanel" aria-labelledby="heading-{{panel}}-{{id}}">
                    <div class="panel-body">
                            <div id="carousel-{{panel}}-{{id}}" div class="carousel slide" data-interval="false">
                        <ul class="carousel-inner" role="listbox">
                        {{{html}}}
                        </ul>
                        {{#manyfeatures}}
                            <a class="left carousel-control" href="#carousel-{{panel}}-{{id}}" 
                            role="button" data-slide="prev">
                            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                            <span class="sr-only" i18n="carousel.control.previous">Previous</span>
                            </a>
                            <a class="right carousel-control" href="#carousel-{{panel}}-{{id}}" 
                            role="button" data-slide="next">
                            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
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
</div>;`;

mviewer.templates.featureInfo.accordion = [
  '<div id="{{panel}}-selector">',
  '<div class="row">',
  '<div class="col-md-12">',
  '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true" style="list-style: none;">',
  "{{#layers}}",
  '<div class="panel">',
  '<div class="panel-heading mv-theme caret-toggle {{^firstlayer}}collapsed{{/firstlayer}}" id="dataToggleDiv" data-toggle="collapse" data-parent="#accordion" href="#accordion-{{panel}}-{{id}}" role="tab" id="heading-{{panel}}-{{id}}" data-layerid="{{layerid}}">',
  '<h4 class="panel-title text-right">',
  '<a role="button" class="pull-left" aria-expanded="{{#firstlayer}}true{{/firstlayer}}{{^firstlayer}}false{{/firstlayer}}" aria-controls="accordion-{{panel}}-{{id}}">',
  "{{name}}",
  "</a>",
  '{{#firstlayer}}<span class="state-icon glyphicon firstLayer"></span>{{/firstlayer}}',
  '{{^firstlayer}}<span class="state-icon glyphicon notFirstLayer"></span>{{/firstlayer}}',
  "</h4>",
  "</div>",
  '<div id="accordion-{{panel}}-{{id}}" class="panel-collapse collapse {{#firstlayer}}in{{/firstlayer}}" role="tabpanel" aria-labelledby="heading-{{panel}}-{{id}}">',
  '<div class="panel-body">',
  '<div id="carousel-{{panel}}-{{id}}" div class="carousel slide" data-interval="false">',
  '<ul class="carousel-inner" role="listbox">',
  "{{{html}}}",
  "</ul>",
  "{{#manyfeatures}}",
  '<a class="left carousel-control" href="#carousel-{{panel}}-{{id}}" ',
  'role="button" data-slide="prev">',
  '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>',
  '<span class="sr-only" i18n="carousel.control.previous">Previous</span>',
  "</a>",
  '<a class="right carousel-control" href="#carousel-{{panel}}-{{id}}" ',
  'role="button" data-slide="next">',
  '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>',
  '<span class="sr-only" i18n="carousel.control.next">Next</span>',
  "</a>",
  '<span class="badge counter-slide">1/{{nbfeatures}}</span>',
  "{{/manyfeatures}}",
  "</div>",
  "</div>",
  "</div>",
  "</div>",
  "{{/layers}}",
  "</div>",
  "</div>",
  "</div>",
  "</div>",
].join("");

mviewer.templates.featureInfo.allintabs = [
  '<div id="{{panel}}-selector">',
  '<div class="row">',
  '<div class="col-md-12">',
  '<div class="tabs-left">',
  '<ul class="nav nav-tabs">',
  "{{#layers}}",
  '<li title="{{name}}" class="{{#firstlayer}}active{{/firstlayer}}" data-layerid="{{layerid}}" {{#initiallayerid}}initiallayerid="{{initiallayerid}}" {{/initiallayerid}}>',
  '<a onclick="mviewer.setInfoPanelTitle(this,\'{{panel}}\');" title="{{name}}" href="#slide-{{panel}}-{{id}}" data-toggle="tab">',
  '<span class="fa {{theme_icon}}"></span>',
  '{{#multiple}}<span class="item-number">{{index}}</spanclass>{{/multiple}}',
  "</a>",
  "</li>",
  "{{/layers}}",
  "</ul>",
  '<div class="tab-content">',
  "{{#layers}}",
  '<div  role="tabpanel" class="{{#firstlayer}}active in {{/firstlayer}}tab-pane" id="slide-{{panel}}-{{id}}" >',
  '<div id="carousel-{{panel}}-{{id}}" div class="carousel slide" data-interval="false">',
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
<ul class="nav-pills nav-stacked" style="list-style-type:none;">
    {{#datastreams}}
    <li class="datastreams" onclick="mviewer.getLayer('{{idLayer}}').layer.sensorthings.query(this)" data-datastreamid="{{id}}">
        <a href="#">
            <span class="state-icon far mv-unchecked" name='{{name}}' datastream-span-id="{{id}}">
            </span>
            {{name}}
            <input type="checkbox" class="hidden" value="false" datastream-input-id="{{id}}">
        </a>
    </li>
    {{/datastreams}}
    {{#multidatastreams}}
    <li class="datastreams" onclick="mviewer.getLayer('{{idLayer}}').layer.sensorthings.query(this)" data-datastreamid="{{id}}">
        <a href="#">
            <span class="state-icon far mv-unchecked" name='{{name}}' datastream-span-id="{{id}}">
            </span>
            {{name}}
            <input type="checkbox" class="hidden" value="false" datastream-input-id="{{id}}">
        </a>
    </li>
    {{/multidatastreams}}
</ul>
`;
