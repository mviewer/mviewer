
/** On rajoute a jquery une fonction de test de présence de l'élement par le selecteru $(#maDiv)**/
$.fn.exists = function () {
    return this.length !== 0;
}


function TPLBackgroundlayerstoolbar (option) {
	this.option = option;
}

TPLBackgroundlayerstoolbar.prototype.init = function(){
	if (this.option === "default") {
		$("#backgroundlayerstoolbar").attr('data-type', 'horizontal').attr('data-iconpos', 'left');		
	}
	if (this.option === "gallery") {
		$("#backgroundlayerstoolbar").attr('data-role', 'collapsible').attr('data-theme', 'b');		
		$("#backgroundlayerstoolbar").append('<h4>Fonds de plan</h4><ul id="basemapslist" data-role="listview" ></ul>');
	}
	if (this.option === "gallery_simple") {
		$(".ui-grid-a").toggle();
		$("#backgroundlayerstoolbar").remove();		
		$("#holderRep").append('<div id="backgroundlayerstoolbar"><h4>Fonds de plan</h4><ul id="basemapslist" data-role="listview" ></ul></div>');
		$("#backgroundlayerstoolbar").attr('data-role', 'collapsible').attr('data-theme', 'b');		
		$("#backgroundlayerstoolbar").toggle();
		$("#datalist").css("display", "none !important;");
	}
	if (this.option === "tab") {
		$(".ui-grid-a").toggle();
		$("#holderRep").attr('data-role', 'collapsible').attr('data-theme', 'b');		
		$("#backgroundlayerstoolbar").remove();		
		$("#holderRep").append('<div id="backgroundlayerstoolbar"><h4>Fonds de plan</h4><ul id="basemapslist" data-role="listview" ></ul></div>');
		$("#backgroundlayerstoolbar").toggle();
	}
	return this;	
}

TPLBackgroundlayerstoolbar.prototype.create = function(){
	if (this.option === "default") {		
		$("#backgroundlayerstoolbar").controlgroup();
		$("#backgroundlayerstoolbar").trigger("create");
		$("#backgroundlayerstoolbar").controlgroup("refresh");
		//hack jquerymobile 1.3.2
		$("#backgroundlayerstoolbar").navbar();
		
		$("#tab_selec_mixed").css( "display", "none" );
		$("#datalist").css( "margin-top", "40px" );
	}
	if (this.option === "gallery") {
		$("#basemapslist").trigger("create");
		$("#basemapslist").listview();
		$("#backgroundlayerstoolbar").collapsible();
        $("#backgroundlayerstoolbar a:first").attr("tabindex","3").attr("accesskey","3");	
		
		$("#tab_selec_mixed").css( "display", "none" );
		$("#datalist").css( "margin-top", "40px" );
	}
	if (this.option === "integrated") {
		
		$("#datalist").css( "margin-top", "40px" );
		$("#tab_selec_mixed").css( "display", "none" );
	}
	if (this.option === "gallery_simple") {
		$("#holderRep").trigger("create");
		$("#holderRep").listview();
		$("#backgroundlayerstoolbar").collapsible();
		$("#basemapslist").trigger("create");
		$("#basemapslist").listview();
		$("#backgroundlayerstoolbar").collapsible();
        $("#backgroundlayerstoolbar a:first").attr("tabindex","3").attr("accesskey","3");	
		$("#backgroundlayerstoolbar").css( "position", "relative" );
		$("#backgroundlayerstoolbar").css( "float", "none" );
		$("#backgroundlayerstoolbar").css( "top", "0px" );
		$("#backgroundlayerstoolbar").css( "left", "0px" );
        $("#backgroundlayerstoolbar a:first").attr("tabindex","3").attr("accesskey","3");		
		$("#backgroundlayerstoolbar a:first").click();
		$("#backgroundlayerstoolbar a:first").attr( "href", "#" );
		$("#backgroundlayerstoolbar li").css( "height", "58px" );
		$("#backgroundlayerstoolbar img").css( "height", "58px" );
		$("#backgroundlayerstoolbar a.ui-icon-carat-r").css( "height", "58px" );
		$("#backgroundlayerstoolbar a.ui-icon-carat-r").css( "max-height", "58px" );
		$("#backgroundlayerstoolbar a.ui-icon-carat-r").css( "padding-top", "1px" );
		$("#backgroundlayerstoolbar a.ui-icon-carat-r").css( "padding-bottom", "1px" );
		$("#backgroundlayerstoolbar h3").css( "height", "18px" );
		$("#backgroundlayerstoolbar h3").css( "font-size", "16px" );
		$("#backgroundlayerstoolbar h3").css( "margin-top", "10px" );
		$("#backgroundlayerstoolbar h3").css( "margin-bottom", "3px" );
		$("#backgroundlayerstoolbar p").css( "height", "18px" );
		$("#backgroundlayerstoolbar p").css( "font-size", "13px" );
		$("#backgroundlayerstoolbar p").css( "margin-top", "3px" );
		$("#backgroundlayerstoolbar h3").css( "margin-bottom", "0px" );
		
		
		
		$("#holderRep").css( "display", "none" );
		$("#backgroundlayerstoolbar h4").css( "display", "none" );
		$("#backgroundlayerstoolbar ul").css( "margin-right", "0px" );
		$("#backgroundlayerstoolbar").css( "margin-right", "0px" );
		$("#backgroundlayerstoolbar ul").css( "margin-left", "0px" );
		$("#backgroundlayerstoolbar").css( "margin-left", "0px" );
		$("#backgroundlayerstoolbar").css( "width", "345px" );
		$("#datalist").css( "margin-top", "10px" );
		$("#datalist").css( "margin-bottom", "30px" );
		$("#myButtonFond").click();
		$("#datalist").css( "display", "none" );
		$("#tab_selec_mixed").css( "display", "none" );
	}
	if (this.option === "tab") {
	
	
		$("#basemapslist").trigger("create");
		$("#basemapslist").listview();
		$("#backgroundlayerstoolbar").collapsible();
		$("#backgroundlayerstoolbar").css( "position", "relative" );
		$("#backgroundlayerstoolbar").css( "float", "none" );
		$("#backgroundlayerstoolbar").css( "top", "0px" );
		$("#backgroundlayerstoolbar").css( "left", "0px" );
		$("#backgroundlayerstoolbar").css( "right", "0px" );
		$("#backgroundlayerstoolbar").css( "bottom", "0px" );
		$("#backgroundlayerstoolbar").css( "padding-top", "0px" );
		$("#backgroundlayerstoolbar").css( "padding-left", "0px" );
		$("#backgroundlayerstoolbar").css( "padding-right", "0px" );
		$("#backgroundlayerstoolbar").css( "padding-bottom", "0px" );
		$("#backgroundlayerstoolbar li").css( "padding-left", "0px" );
		$("#backgroundlayerstoolbar li").css( "padding-right", "0px" );
        $("#backgroundlayerstoolbar a:first").attr("tabindex","3").attr("accesskey","3");		
		$("#backgroundlayerstoolbar a:first").click();
		$("#backgroundlayerstoolbar a:first").attr( "href", "#" );
		$("#backgroundlayerstoolbar li").css( "height", "58px" );
		$("#backgroundlayerstoolbar img").css( "height", "58px" );
		$("#backgroundlayerstoolbar a.ui-icon-carat-r").css( "height", "58px" );
		$("#backgroundlayerstoolbar a.ui-icon-carat-r").css( "max-height", "58px" );
		$("#backgroundlayerstoolbar a.ui-icon-carat-r").css( "padding-top", "1px" );
		$("#backgroundlayerstoolbar a.ui-icon-carat-r").css( "padding-bottom", "1px" );
		$("#backgroundlayerstoolbar h3").css( "height", "18px" );
		$("#backgroundlayerstoolbar h3").css( "font-size", "16px" );
		$("#backgroundlayerstoolbar h3").css( "margin-top", "10px" );
		$("#backgroundlayerstoolbar h3").css( "margin-bottom", "3px" );
		$("#backgroundlayerstoolbar p").css( "height", "18px" );
		$("#backgroundlayerstoolbar p").css( "font-size", "13px" );
		$("#backgroundlayerstoolbar p").css( "margin-top", "3px" );
		$("#backgroundlayerstoolbar h3").css( "margin-bottom", "0px" );
		
		$("#backgroundlayerstoolbar h4:first").remove();
		
		$("#myButtonFond").click();
		$("#datalist").css( "top", "230px" );
		$("#holderRep").css( "top", "230px" );
		$("#holderRep").css( "width", "345px" );
		$("#tab_selec_mixed ul").css( "display", "block" );
	}
	
	
	
	

	$("#searchtool").css( "z-index", "3000" );
	$("#searchresults").css( "width", "295px" );
	$("#searchresults li").css( "width", "295px" );
	$("#searchresults li a").css( "width", "295px" );
	$("#holderRep").css( "z-index", "1500" );
	$("#tab_selec_mixed").css( "z-index", "1500" );
	$("#tab_selec_mixed").css( "position", "relative" );
	$("#tab_selec_mixed").css( "margin-top", "5px" );
	
	
	
}
// Temps d'affichage des elements derriere le blanc : 1 sec
// $( window ).load(function() {
	// setTimeout(function () {
		var newTopValue ;
		if($("#themepanel > #searchtool")[0]){
			newTopValue = (getSizeToTheTop("searchtool", this.option))+"px";
			$("#searchtool").css( "top", newTopValue, 'important');
		}
	
	// On preserve les mode de base
	// if(this.option != "default" && this.option !== "gallery" && this.option !== "integrated"){
	

		newTopValue = getSizeToTheTop("tab_selec_mixed", this.option)+"px";
		if($("#themepanel #tab_selec_mixed") && ($("#tab_selec_mixed").css( "display") == "block")){ 
			newTopValue = (getSizeToTheTop("tab_selec_mixed", this.option))+"px ";
			$("#tab_selec_mixed").css( "margin-top", newTopValue, 'important');
		}
		
		newTopValue = getSizeToTheTop("holderRep", this.option);
		
		
		newTopValue = newTopValue +"px "; 
		$("#holderRep").css( "top", newTopValue, 'important');
		$("#datalist").css( "top", newTopValue, 'important');	
	// }
	
	// }, 3000);
// });


function getMargin(elt){
	var divMarge = 0;
	var obj;
	if(obj = document.getElementById(elt)){
			divMarge+=parseInt(obj.style.marginTop);
			divMarge+=parseInt(obj.style.marginBottom);
	}
	return parseInt(divMarge);
}
function getSizeToTheTop(divCible, opt){
	var topValue = 0;
	
	if((divCible == "holderRep")||(divCible == "tab_selec_mixed")){
		// On teste la présence de la recherche 
		if($("#themepanel > #searchresults")[0]){
			topValue += $("#themepanel > #searchresults").height();
		}
	}
	
	if((divCible == "holderRep")){
		// On teste la présence des tabulations
		if($("#themepanel #tab_selec_mixed")){
			if(($("#tab_selec_mixed").css( "display") == "block")){
				topValue += $("#themepanel #tab_selec_mixed").height();
			}	
		}
	}
	
	
	//Le Logo
	if(divCible != "tab_selec_mixed") topValue += $("#panel-header").height();
	
	if(divCible == "searchtool") topValue += 15;
	if(divCible == "tab_selec_mixed") topValue += 12;
	if((divCible == "holderRep") && (($("#tab_selec_mixed").css( "display") == "block") ||  (opt == "gallery_simple"))) topValue += 40;
	// console.log(divCible + " ("+opt+") : " + topValue);
	return topValue;
	
}

function TPLBackgroundLayerControl (layer, option) {
        this.option = option;
        this.layer = layer;
}

TPLBackgroundLayerControl.prototype.html = function(){
	var template = "";
	if (this.option === "default" || this.option === "integrated") {
		template = ['<a href="#" id="' + this.layer.attr("id") + '_btn" title="' + this.layer.attr("title"),
			'" onclick="mviewer.setBaseLayer(\'' + this.layer.attr("id") + '\')"',
			'data-theme="b" data-role="button">' + this.layer.attr("label") + '</a>'].join(" ");        
		$("#backgroundlayerstoolbar").append(template);
	}
	if (this.option === "gallery" || this.option === "gallery_simple" || this.option === "tab") {
		template = ['<li data-theme="b" onclick="mviewer.setBaseLayer(\'' +  this.layer.attr("id") + '\')">',
			'<a id="' + this.layer.attr("id") + '_btn" href="#"><img src="' +  this.layer.attr("thumbgallery") + '" />',
			'<h3>' +  this.layer.attr("label") + '</h3>',
			'<p>' + this.layer.attr("title") + '</p></a></li>'].join(" ");
		$("#basemapslist").append(template);
	}
	
}

function TPLLayergroup(title, layerlist, collapsed){
   this.title = title;
   this.collapsed = collapsed;
   this.layerlist = layerlist;
}

TPLLayergroup.prototype.html = function(){
	CSSstyle='';
	if(!this.collapsed){
		CSSstyle = "class='menu-different'";
		this.collapsed = true;
	}

	return ['<div data-theme="b" data-role="collapsible" data-collapsed="'+this.collapsed+'">',
						'<h2 '+CSSstyle+'>'+this.title+'</h2>',    
						'<ul data-role="listview" data-split-icon="gear" data-split-theme="b" data-inset="true" data-mini="true" data-theme="a">',		
						this.layerlist,
						'</ul>',
					'</div>'].join(" ");
}

function TPLLayercontrol(layerid, title, legendurl, queryable, checked, enabled){
   this.layerid = layerid;
   this.title = title;
   this.queryable = queryable;
   this.legendurl = legendurl;
   this.checked = checked;
   this.enabled = enabled;
}

TPLLayercontrol.prototype.html = function(){
	return  ['<li data-theme="a" data-icon="false"><a href="#">',
				'<form class="layer-display" title="Afficher/masquer cette couche" style="width : 70%; float : left;">',
				'<input data-theme="a" class="togglelayer" type="checkbox"  data-mini="true" name="'+this.layerid+'" id="checkbox-mini-'+this.layerid+'"',
					(this.checked===true)?' checked="checked"':'',
				'>',
					'<label for="checkbox-mini-'+this.layerid+'">',
						'<table style="width:100%;" >',
							'<tbody>',
								'<tr>',
									'<td><!--<img src="'+this.legendurl+'">--> <span style="position : relative; z-index : 1600; top : 2px;">'+this.title+'</span></td>',
									//(this.queryable===true)?'<td><img class="infoicon" src="img/info/info.png"></td>':'',
								'</tr>',                            
							'</tbody>',
						'</table>',                
					'</label>',
				'</form>',			
				'<table style="width:30%; float : left;" >',
						'<tbody>',
							'<tr>',
								// '<td>'+this.title+'</td>',                               
			   
								'<td><div data-role="controlgroup" data-type="horizontal" data-mini="true" class="ui-btn-right" style="float:right;">',
								'<td><div class="ui-nodisc-icon ui-alt-icon" style="float:right;">',
										'<a class="opacity-btn ui-btn ui-shadow ui-corner-all ui-icon-gear ui-btn-icon-notext ui-btn-a ui-btn-inline" id ="opacity-btn-'+this.layerid+'" name="'+this.layerid+'" href="#"  title="Opacité de la couche" ></a>',
										'<a class="metadata-btn ui-btn ui-shadow ui-corner-all ui-icon-bars ui-btn-icon-notext ui-btn-a ui-btn-inline" id="metadata-btn-'+this.layerid+'" name="'+this.layerid+'" href="#"  title="Plus d\'information sur  : '+this.title+'"  ></a>',												
								'</div></td>',		
							 '</tr>',
						'</tbody>',
				 '</table>',			
				'<div style="clear : both;"></div>',			
				'</a>',             
			'</li>'].join( " ");
}
