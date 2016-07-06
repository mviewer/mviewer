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

function TPLLayergroup(title, layerlist, collapsed, id){   
   this.title = title;
   this.collapsed = collapsed;// not used here
   this.layerlist = layerlist;
   this.id = id;
}

TPLLayergroup.prototype.html = function(){
    return ['<li class="" id="theme-layers-'+this.id+'" >',
                    '<a href="#"><span class="fa-stack fa-lg pull-left"><i class="fa fa-flag fa-stack-1x "></i></span>'+this.title+'</a>',
                       '<ul class="nav-pills nav-stacked" style="list-style-type:none;">',                        
                        this.layerlist,
                       '</ul>',
                '</li>'].join(" ");
}

function TPLLayercontrol(layerid, title, legendurl, queryable, checked, crossorigin, searchable){   
   this.layerid = layerid;
   this.title = title;   
   this.queryable = queryable;
   this.legendurl = legendurl;
   this.checked = checked;
   this.crossorigin = crossorigin;
   this.searchable = searchable;
}

TPLLayercontrol.prototype.html = function(){                    
     return  ['<li class="mv-nav-item" data-layerid="'+this.layerid+'" data-title="'+this.title+'" data-queryable="'+this.queryable+'" ',
     'onclick="mviewer.toggleLayer(this);" ',
     ' data-legendurl="'+this.legendurl+'" data-checked="'+this.checked+'" data-crossorigin="'+this.crossorigin+'" data-searchable="'+this.searchable+'" >',
     '<a href="#" ><span class="state-icon glyphicon glyphicon-unchecked"></span>',     
					this.title,	
					'<input type="checkbox" class="hidden" value="false" ></a></li>'].join( " ");
}

function TPLLayercontrol2(layerid, title, legendurl, queryable, checked, crossorigin, searchable){   
   this.layerid = layerid;
   this.title = title;   
   this.queryable = queryable;
   this.legendurl = legendurl;
   this.checked = checked;
   this.crossorigin = crossorigin;
   this.searchable = searchable;
}

TPLLayercontrol2.prototype.html = function(){
	return  ['<li class="list-group-item mv-layer-options" data-layerid="'+this.layerid+'" data-title="'+this.title+'" >',
						'<div class="row layerdisplay-title" >',
						this.title, 
                         '<a href="#" class="close" aria-label="close" onclick="mviewer.removeLayer(this)" title="Supprimer" >×</a>',
                         '</div class="row">',
                         '<img class="mv-legend" '+this.crossorigin+' id="legend-'+this.layerid+'" src="'+this.legendurl+'" ',
                         'alt="Légende non disponible" onError="this.onerror=null;this.src=\'img/nolegend.png\';">',										
                         '<div>',                         
					'</div></li>'].join( " ");
     
}

