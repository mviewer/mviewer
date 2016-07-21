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
        //TODO			
	}
	
	if (this.option === "gallery") {				
		$("#backgroundlayerstoolbar").append('<button class="btn btn-default btn-xs" onclick="mviewer.bgtoogle();"><span class="glyphicon glyphicon-chevron-left"></span></button><ul id="basemapslist" class="list-inline" ></ul>');
	}
	return this;	
}

TPLBackgroundlayerstoolbar.prototype.create = function(){
	if (this.option === "default") {		
		//TODO
	}
	if (this.option === "gallery") {
    
	}
}

function TPLBackgroundLayerControl (layer, option) {
	this.option = option;
	this.layer = layer;
}

TPLBackgroundLayerControl.prototype.html = function(){
	var template = "";
	if (this.option === "default") {
		template = ['<a href="#" id="' + this.layer.attr("id") + '_btn" title="' + this.layer.attr("title"),
			'" onclick="mviewer.setBaseLayer(\'' + this.layer.attr("id") + '\')"',
			'data-theme="b" data-role="button">' + this.layer.attr("label") + '</a>'].join(" ");        
		$("#backgroundlayerstoolbar").append(template);
	}
	if (this.option === "gallery") {
		template = ['<li style="background:url(\''+this.layer.attr('thumbgallery')+'\') center bottom no-repeat;" ',
        'onclick="mviewer.setBaseLayer(\'' +  this.layer.attr("id") + '\')">',			
            '<a id="' + this.layer.attr("id") + '_btn" href="#" ><p>'+  this.layer.attr("label"),
            '</p></a></li>'].join(" ");
		$("#basemapslist").append(template);
	}
	
}

function TPLLayergroup(title, layerlist, collapsed, id, icon){   
   this.title = title;
   this.collapsed = collapsed;// not used here
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

function TPLLayercontrol(layerid, title, legendurl, queryable, checked, crossorigin, searchable, opacity, styles, timefilter, attribution, metadata){   
   this.layerid = layerid;
   this.title = title;   
   this.queryable = queryable;
   this.legendurl = legendurl;
   this.checked = checked;
   this.crossorigin = crossorigin;
   this.searchable = searchable;
   this.opacity = opacity;
   this.styles = styles;
   this.timefilter = timefilter;
   this.attribution = attribution;
   this.metadata = metadata;
}

TPLLayercontrol.prototype.html = function(){                    
     return  ['<li class="mv-nav-item" data-layerid="'+this.layerid+'" data-title="'+this.title+'" data-queryable="'+this.queryable+'" ',
     'onclick="mviewer.toggleLayer(this);" ',
     ' data-legendurl="'+this.legendurl+'" data-checked="'+this.checked+'" data-crossorigin="'+this.crossorigin+'" data-timefilter="'+this.timefilter+'" data-styles="'+this.styles+'" data-opacity="'+this.opacity+'" data-searchable="'+this.searchable+'" >',
     '<a href="#" ><span class="state-icon glyphicon glyphicon-unchecked"></span>',     
					this.title,	
					'<input type="checkbox" class="hidden" value="false" ></a></li>'].join( " ");
}

function TPLLayercontrol2(layerid, title, legendurl, queryable, checked, crossorigin, searchable, opacity, styles, timefilter, attribution, metadata){   
   this.layerid = layerid;
   this.title = title;   
   this.queryable = queryable;
   this.legendurl = legendurl;
   this.checked = checked;
   this.crossorigin = crossorigin;
   this.searchable = searchable;
   this.opacity = opacity;
   this.styles = styles;
   this.timefilter = timefilter;
   this.attribution = attribution;
   this.metadata = metadata;
}

TPLLayercontrol2.prototype.html = function(){
    var styles_selector = "";
    var time_selector ="";
    var attribution_text = "";
    if (this.attribution && this.attribution != "undefined") {
         attribution_text = ['<div class="row">',
                            '<div class="col-md-12">',
                            '<p>'+this.attribution+'</p>',
                            '<a href="'+this.metadata+'" target="_blank">Métadonnées</a>',
                            '</div></div>'].join(" ");
    }
    if (this.timefilter) {
        time_selector = ['<div class="row">',
                        '<div class="col-md-12">',
                        '<div class="form-group">',
                              '<label for="'+this.layerid+'-layer-timefilter">Temporalité</label>',
                              '<input type="'+this.timefilter+'" min="" max="" class="" id="'+this.layerid+'-layer-timefilter" name="'+this.layerid+'" onchange="mviewer.setLayerTime(this.name, this.value)">',                              
                          '</div>',
                          '</div>',
                         '</div>'].join (" ");
    }
    if (this.styles && this.styles != "undefined") {
        var styles_array = this.styles.split(",");
        var options = [];
        for (var i=0; i<styles_array.length; i++) { 
            options.push('<option label="'+styles_array[i]+'" value="'+styles_array[i]+'">'+styles_array[i]+'</option>');
        }
        styles_selector = ['<div class="row">',
                        '<div class="col-md-12">',
                        '<div class="form-group">',
                              '<label for="'+this.layerid+'-styles-selector">Analyses</label>',
                              '<select class="form-control" name="'+this.layerid+'" id="'+this.layerid+'-styles-selector" onchange="mviewer.setLayerStyle(this.name ,this.value);">',
                              options.join(" "),
                              '</select>',
                          '</div>',
                          '</div>',
                         '</div>'].join (" ");
    }
	return  ['<li class="list-group-item mv-layer-details" data-layerid="'+this.layerid+'" data-title="'+this.title+'" >',
						'<div class="row layerdisplay-title" >',
						 '<a href="#" aria-label="Options" onclick="mviewer.toggleLayerOptions(this);" title="Options" >',
                         '<span class="state-icon glyphicon glyphicon-triangle-bottom"></span>',
                         this.title+'</a>',                         
                         '<a href="#" class="close" aria-label="close" onclick="mviewer.removeLayer(this)" title="Supprimer" >×</a>',
                         '</div>',
                         '<div class="row">',
                             '<img class="mv-legend" '+this.crossorigin+' id="legend-'+this.layerid+'" src="'+this.legendurl+'" ',
                             'alt="Légende non disponible" onError="this.onerror=null;this.src=\'img/nolegend.png\';">',										
                         '</div>',
                         '<div class="mv-layer-options" style="display: none;" data-layerid="'+this.layerid+'" >',
                           '<div class="row">',
                            '<div class="col-md-12">',
                             ' <div class="form-group">',
                                '<label for="'+this.layerid+'-layer-opacity">Opacité</label>',
                                '<input type="range" class="" id="'+this.layerid+'-layer-opacity" name="'+this.layerid+'" value="'+this.opacity+'" max="1" min="0" step=".1" onchange="mviewer.changeLayerOpacity(this.name, this.value)">',
                              '</div>',                      
                            '</div>',
                            '</div>',
                            attribution_text,
                            styles_selector,  
                            time_selector,                            
                        '</div>',                       
					'</li>'].join( " ");
     
}

function TPLInfopanel( panel, id_tab ){   
   this.panel = panel;   
   this.id_tab = id_tab;
}

TPLInfopanel.prototype.html = function () {
    console.log(this.panel);
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

