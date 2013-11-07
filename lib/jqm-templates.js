function TPLLayergroup(title, layerlist, collapsed){   
   this.title = title;
   this.collapsed = collapsed;
   this.layerlist = layerlist;
}

function TPLLayercontrol(layerid, title, legendurl, queryable, checked, enabled){   
   this.layerid = layerid;
   this.title = title;   
   this.queryable = queryable;
   this.legendurl = legendurl;
   this.checked = checked;
   this.enabled = enabled;   
}

TPLLayergroup.prototype.html = function(){
	return ['<div data-role="collapsible" data-collapsed="'+this.collapsed+'">',
						'<h2>'+this.title+'</h2>',    
						'<ul data-role="listview" data-split-icon="gear" data-split-theme="d" data-inset="true" data-mini="true">',		
						this.layerlist,
						'</ul>',
					'</div>'].join(" ");
}


TPLLayercontrol.prototype.html = function(){
	return  ['<li data-theme="d" data-icon="false"><a href="#">',
						'<h3 class="layerdisplay-title">',
							'<table style="width:100%;" >',
									'<tbody>',
										'<tr>',
											'<td>'+this.title+'</td>',                                  
											'<td><div data-role="controlgroup" data-type="horizontal" data-mini="true" class="ui-btn-right" style="float:right;">',
												'<a class="opacity-btn" id ="opacity-btn-'+this.layerid+'" name="'+this.layerid+'" href="#" data-role="button" data-iconpos="notext" data-icon="gear" data-theme="d">Opacité de la couche</a>',
												'<a class="metadata-btn" id="metadata-btn-'+this.layerid+'" name="'+this.layerid+'" href="#" data-role="button" data-iconpos="notext" data-icon="grid" data-theme="d">Plus d\'information sur cette couche de données</a>',												
											'</div></td>',		
										 '</tr>',
									'</tbody>',
							 '</table>',
						'</h3>',						
						'<p><form class="layer-display" title="Afficher/masquer cette couche">',
						'<input data-theme="d" class="togglelayer" type="checkbox"  data-mini="true" name="'+this.layerid+'" id="checkbox-mini-'+this.layerid+'"',
							(this.checked===true)?' checked="checked"':'',
						'>',
						'<label for="checkbox-mini-'+this.layerid+'">',
							'<table style="width:100%;" >',
								'<tbody>',
									'<tr>',
										'<td><img src="'+this.legendurl+'"></td>',
										(this.queryable===true)?'<td><img class="infoicon" src="img/info/info.png"></td>':'',
									'</tr>',                            
								'</tbody>',
							'</table>',                
						'</label>',
						'</form></p>',						
						'</a>',             
					'</li>'].join( " ");
}
