/*
 * 
 * This file is part of mviewer
 *
 * mviewer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with mviewer.  If not, see <http://www.gnu.org/licenses/>.
 */
function TPLBackgroundlayerstoolbar (option) {
	this.option = option;
}

TPLBackgroundlayerstoolbar.prototype.init = function(){
	if (this.option === "default") {
        $("#backgroundlayerstoolbar-gallery").remove();	
	}
	
	if (this.option === "gallery") {
        $("#backgroundlayerstoolbar-default").remove();
		$("#backgroundlayerstoolbar-gallery").append(['<div class="bglt-btn" onclick="mviewer.bgtoogle();">',
            '<i class="fa fa-chevron-circle-right"></i>',
            '</div><ul id="basemapslist" class="list-inline" ></ul>'].join(""));
	}
	return this;	
}


function TPLBackgroundLayerControl (layer, option) {
	this.option = option;
	this.layer = layer;
}

TPLBackgroundLayerControl.prototype.html = function(){
	var template = "";
	if (this.option === "gallery") {
		template = ['<li style="background:url(\''+this.layer.attr('thumbgallery')+'\') center bottom/80px no-repeat;" ',
        'onclick="mviewer.setBaseLayer(\'' +  this.layer.attr("id") + '\')">',			
            '<a id="' + this.layer.attr("id") + '_btn" href="#" ><p>'+  this.layer.attr("label"),
            '</p></a></li>'].join(" ");
		$("#basemapslist").append(template);
	}
}

function TPLLayergroupGroup(title, grouplist, id, icon){   
   this.title = title;  
   this.grouplist = grouplist;
   this.id = id;
   this.icon = icon;
}

TPLLayergroupGroup.prototype.html = function(){
    var htmlGroups = [];
    $.each(this.grouplist, function (id, group) {        
        htmlGroups.push(['<li class="level-2">',
                '<a href="#">'+group.title+'</a>',
                    '<ul class="nav-pills nav-stacked" style="list-style-type:none;">',                        
                       group.layers.join(""),
                   '</ul>',
                '</li>'].join(""));
    });
    
                
                
    var faicon = (this.icon)?"fa-"+this.icon:"fa-flag";
    return ['<li class="level-1" id="theme-layers-'+this.id+'" >',
        '<a href="#"><span class="fa-stack fa-lg pull-left"><i class="fa '+faicon+' fa-stack-1x "></i></span>'+this.title+'</a>',
           '<ul class="nav-pills nav-stacked" style="list-style-type:none;">',
                htmlGroups.join(""),
           '</ul>',
    '</li>'].join(" ");
}

function TPLLayergroup(title, layerlist, id, icon){   
   this.title = title;   
   this.layerlist = layerlist;
   this.id = id;
   this.icon = icon;
}

TPLLayergroup.prototype.html = function(){
    var faicon = (this.icon)?"fa-"+this.icon:"fa-flag";
    return ['<li class="" id="theme-layers-'+this.id+'" >',
                    '<a href="#"><span class="fa-stack fa-lg pull-left"><i class="fa '+faicon+' fa-stack-1x "></i></span>'+this.title+'</a>',
                       '<ul class="nav-pills nav-stacked" style="list-style-type:none;">',                        
                        this.layerlist,
                       '</ul>',
                '</li>'].join(" ");
}

function TPLLayercontrol(layer){
   this.data = {
       layerid : layer.layerid,
       title : layer.title,   
       queryable : layer.queryable,
       draggable : layer.draggable,
       legendurl : layer.legendurl,
       checked : layer.checked,
       crossorigin : layer.crossorigin,
       searchable : layer.searchable,
       opacity : layer.opacity,
       styles : layer.styles,
       stylesalias : layer.stylesalias,
       attributefilter : layer.attributefilter,
       attributefield : layer.attributefield,
       attributevalues : layer.attributevalues,
       attributefilterenabled : layer.attributefilterenabled,
       attributestylesync : layer.attributestylesync,
       attributelabel : layer.attributelabel,
       timefilter : layer.timefilter,
       timeinterval : layer.timeinterval,
       timecontrol : layer.timecontrol,
       timemin : layer.timemin,
       timemax : layer.timemax,
       attribution : layer.attribution,
       metadata : layer.metadata,
       customcontrols : layer.customcontrols
   }
}

TPLLayercontrol.prototype.html = function(){
         var data = [];
         $.each(this.data, function (attr, value) {
            data.push('data-' + attr + '="'+value+'"');
         });         
         return  ['<li class="mv-nav-item" onclick="mviewer.toggleLayer(this);" ',
                data.join(" ") + '>',
                '<a href="#" ><span class="state-icon fa mv-unchecked"></span>',     
                this.data.title,
                '<input type="checkbox" class="hidden" value="false" ></a></li>'].join( " ");
         
}

function TPLLayercontrol2(layer){   
   this.layerid = layer.layerid;
   this.title = layer.title;   
   this.queryable = layer.queryable;
   this.draggable = layer.draggable;
   this.legendurl = layer.legendurl;
   this.checked = layer.checked;
   this.crossorigin = layer.crossorigin;
   this.searchable = layer.searchable;
   this.opacity = layer.opacity;
   this.styles = layer.styles;
   this.stylesalias = layer.stylesalias;
   this.attributefilter = layer.attributefilter;
   this.attributefield = layer.attributefield;
   this.attributevalues = layer.attributevalues;
   this.attributefilterenabled = layer.attributefilterenabled;
   this.attributestylesync = layer.attributestylesync;
   this.attributelabel = layer.attributelabel;
   this.timefilter = layer.timefilter;
   this.timeinterval = layer.timeinterval;
   this.timecontrol = layer.timecontrol;
   this.timemin = layer.timemin;
   this.timemax = layer.timemax;
   this.timevalues = layer.timevalues;   
   this.attribution = layer.attribution;
   this.metadata = layer.metadata;
   this.summary = layer.summary;
   this.type = layer.type;
   this.tooltip = layer.tooltip;
   this.tooltipenabled = layer.tooltipenabled;
   this.customcontrols = layer.customcontrols;
}

TPLLayercontrol2.prototype.html = function(){
    var styles_selector = "";
    var attributes_selector ="";
    var time_selector ="";
    var attribution_text = "";
    var custom_controls = '';
    var summary = '';
    var tooltip_control = '';
    var stylelabel = "";
    var draggable = ""    
    
    if (this.draggable) {
        draggable = "draggable";
    } else {
        draggable = "toplayer";
    }
    if (this.customcontrols && mviewer.customControls[this.layerid]) {
        custom_controls = mviewer.customControls[this.layerid].form;
    }
    
    if (this.type === 'hook' && this.tooltip) {
        tooltip_control = ['<div class="row"><div class="col-md-12">',
            '<a data-layerid="'+this.layerid+'" class="layer-tooltip" ',
            'onclick="mviewer.toggleTooltip(this);" id="'+this.layerid+'-layer-tooltip" href="#">',
            '<span class="state-icon fa mv-unchecked"></span>Afficher les infobulles',
            '<input type="checkbox" class="hidden" value="false"></a></div></div>'].join("");
    }
    
    //if (this.summary && this.summary.length>=3) {
    if (this.metadata || this.summary) {
        summary = ['<a href="#" role="button" id="'+this.layerid+'-layer-summary" tabindex="10" data-trigger="focus"',
            ' data-toggle="popover" class="mv-layer-summary" data-html="true"',
            ' title="Résumé" data-content=""><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></a>'].join ("");
    }
    
    if (this.attribution && this.attribution != "undefined") {
         attribution_text = ['<div class="row">',
                            '<div class="col-md-12">',
                            '<p>'+this.attribution+summary+'</p>',
                            /*'<a href="'+this.metadata+'" target="_blank">Métadonnées</a>',
                            summary,*/
                            '</div></div>'].join(" ");
    }
    if (this.timefilter) {
        time_selector = ['<div class="row">',
                        '<div class="col-md-12">',
                        '<div class="form-group form-group-timer ">',
                              '<label for="'+this.layerid+'-layer-timefilter">Temporalité</label>',
                              '<span class="fa mv-time-player" data-layerid="'+this.layerid+'" ></span>',
                              '<span class="mv-time-player-selection" data-layerid="'+this.layerid+'" ></span>',
                              '<input type="text" id="'+this.layerid+'-layer-timefilter"',
                                    ' name="'+this.layerid+'" >',                              
                          '</div>',
                          '</div>',
                         '</div>'].join (" ");
    }
    if (this.styles && this.styles != "undefined") {
        var styles_array = this.styles.split(",");
        var label_array = this.stylesalias.split(",");
        stylelabel = label_array[0];        
        var options_styles = [];
        for (var i=0; i<styles_array.length; i++) { 
            options_styles.push('<option label="'+label_array[i]+'" value="'+styles_array[i]+'">'+label_array[i]+'</option>');
        }
        styles_selector = ['<div class="row">',
                        '<div class="col-md-12">',
                        '<div class="form-group form-group-analyses">',
                              '<label for="'+this.layerid+'-styles-selector">Analyses</label>',
                              '<select class="form-control" name="'+this.layerid+'" id="'+this.layerid+'-styles-selector"',
                              ' onchange="mviewer.setLayerStyle(this.name ,this.value, this);">',
                              options_styles.join(" "),
                              '</select>',
                          '</div>',
                          '</div>',
                         '</div>'].join (" ");
    }
    
    if (this.attributefilter && this.attributevalues != "undefined" && this.attributefield != "undefined") {
        var attributes_array = this.attributevalues;
        var options_attributes = [];        
        if (this.attributefilterenabled === false) {
            options_attributes.push('<option label="Par défaut" value="all">Par défaut</option>');
        }
        for (var i=0; i<attributes_array.length; i++) { 
            options_attributes.push('<option label="'+attributes_array[i]+'" value="'+attributes_array[i]+'">'+attributes_array[i]+'</option>');
        }
        attributes_selector = ['<div class="row">',
                        '<div class="col-md-12">',
                        '<div class="form-group form-group-attributes">', 
                              '<label for="'+this.layerid+'-attributes-selector">'+this.attributelabel+'</label>', 
                              '<select class="form-control" name="'+this.layerid+'" id="'+this.layerid+'-attributes-selector"',
                              ' onchange="mviewer.setLayerAttribute(this.name ,this.value, this);">',
                              options_attributes.join(" "),
                              '</select>',
                          '</div>',
                          '</div>',
                         '</div>'].join (" ");
    
    }
	return  ['<li class="list-group-item mv-layer-details '+draggable+'" data-layerid="'+this.layerid+'" data-title="'+this.title+'" >',
						'<div class="row layerdisplay-title" >',
						 '<a href="#" aria-label="Options" onclick="mviewer.toggleLayerOptions(this);" title="Options" >',
                         '<span class="state-icon glyphicon glyphicon-plus"></span>',
                         this.title+'</a>',                         
                         '<a href="#" class="close" aria-label="close" onclick="mviewer.removeLayer(this)" title="Supprimer" >×</a>',
                         '</div>',                         
                         '<div class="layerdisplay-subtitle">',
                            '<div class="selected-sld fa"><span>'+stylelabel+'</span></div>',
                            '<div class="selected-attribute fa"><span></span></div>',
                         '</div>',
                         '<div class="mv-custom-controls" data-layerid="'+this.layerid+'" >',
                         custom_controls,
                         '</div>',
                         '<div class="row layerdisplay-legend">',
                              '<div id="loading-'+this.layerid+'" class="mv-layer-indicator" style="display:none">',
                                 '<div class="loader">Loading...</div>',
                             '</div>',
                             '<img class="mv-legend" '+this.crossorigin+' id="legend-'+this.layerid+'" src="'+this.legendurl+'" ',
                             'alt="Légende non disponible" onError="this.onerror=null;this.src=\'img/nolegend.png\';"/>',                             
                         '</div>',
                         '<div class="mv-layer-options" style="display: none;" data-layerid="'+this.layerid+'" >',
                           '<div class="row">',
                            '<div class="col-md-12">',
                             ' <div class="form-group form-group-opacity">',
                                '<label for="'+this.layerid+'-layer-opacity">Opacité</label>',
                                '<input type="text" class="mv-slider" id="'+this.layerid+'-layer-opacity" name="'+this.layerid+'" value="'+this.opacity+'"',
                                ' data-provide="slider" data-slider-value="'+this.opacity+'" data-slider-max="1" data-slider-min="0" data-slider-step=".1"',
                                ' onchange="mviewer.changeLayerOpacity(this.name, this.value)">',
                              '</div>',                      
                            '</div>',
                            '</div>',
                            tooltip_control,
                            attribution_text,
                            styles_selector,
                            attributes_selector,                            
                            time_selector,                            
                        '</div>',                       
					'</li>'].join( " ");
     
}

function TPLInfopanel( panel, id_tab ){   
   this.panel = panel;   
   this.id_tab = id_tab;
}

TPLInfopanel.prototype.html = function () {
    return ['<div  role="tabpanel" class="tab-pane" id="slide-'+this.panel+'-'+this.id_tab[this.panel]+'" >',
                '<div id="carousel-'+this.panel+'-'+this.id_tab[this.panel]+'" div class="carousel slide" data-interval="false">',
                '<ul class="carousel-inner" role="listbox"></ul>',
                '<a class="left carousel-control" href="#carousel-'+this.panel+'-'+this.id_tab[this.panel]+'" role="button" data-slide="prev">',
                '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>',
                '<span class="sr-only">Previous</span>',
                '</a>',
                  '<a class="right carousel-control" href="#carousel-'+this.panel+'-'+this.id_tab[this.panel]+'" role="button" data-slide="next">',
                    '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>',
                    '<span class="sr-only">Next</span>',
                  '</a>',
                '</div> </div>'].join(" ");
}