/*
 *
 * Ce script modifie l'affichage des boutons de fonction.
 * En incluant ce script dans la page, les boutons viennent se coller au panneau.
 *
 */
function slideIconMenu(direction){
	if(direction == "right") setTimeout( "TimedslideIconMenu('"+direction+"')",200 );
	if(direction == "left") setTimeout( "TimedslideIconMenu('"+direction+"')",1 );
	$('#themepanel').panel('toggle');
}

function TimedslideIconMenu(direction){
	
	if(direction == "left"){
		$("#tick-button").css("display" , "none");
		$("#toolstoolbar").css("left" , "0px");
		$("#zoomtoolbar").css("left" , "0px");
	}else{
		$("#tick-button").css("display" , "block");
		$("#toolstoolbar").css("left" , "365px");
		$("#zoomtoolbar").css("left" , "365px");
	}
	
}

// Lancement de fonction aprÃ¨s ouverture de la page
$( window ).load(function() {
	// Temps d'affichage des elements derriere le blanc : 1 sec
	setTimeout(function () {
		$("#tick-button").attr("onclick","slideIconMenu('left')");
		$("#tick-button2").attr("onclick","slideIconMenu('right')");


		$("#tick-button").css( "padding-left", "15px" );
		$("#tick-button").css( "padding-right", "0px" );
		$("#tick-button").css( "right", "-45px" );
		$("#tick-button").css( "padding-left", "18px" );


		$("#zoomtoolbar").css( "position", "absolute" );
		$("#zoomtoolbar").css( "left", "365px" );
		$("#zoomtoolbar").css( "right", "inherit" );
		$("#zoomtoolbar").css( "right", "initial" );
		$("#toolstoolbar").css( "position", "absolute" );
		$("#toolstoolbar").css( "left", "365px" );
		$("#toolstoolbar").css( "right", "inherit" );
		$("#toolstoolbar").css( "right", "initial" );

		if(document.getElementById("tab_selec_mixed")){
		$( "#tab_selec_mixed" ).before($( "#searchtool" ).html());
		}else{
		$( "#datalist" ).before($( "#searchtool" ).html());
		}
		$( "#searchtool" ).remove();
		
		
		
		var newTopValue ;
		newTopValue = (getSizeToTheTop("searchtool", config.blstyle))+"px";
		$("#searchtool").css( "top", newTopValue, 'important');
		

		// On preserve les mode de base
		// if(config.blstyle != "default" && config.blstyle !== "gallery" && config.blstyle !== "integrated"){


		newTopValue = getSizeToTheTop("tab_selec_mixed", config.blstyle)+"px";
		if($("#themepanel #tab_selec_mixed") && ($("#tab_selec_mixed").css( "display") == "block")){ 
			newTopValue = (getSizeToTheTop("tab_selec_mixed", config.blstyle))+"px ";
			$("#tab_selec_mixed").css( "margin-top", newTopValue, 'important');
		}
		
		newTopValue = getSizeToTheTop("holderRep", config.blstyle);
		
		
		newTopValue = (newTopValue+45) +"px "; 
		$("#holderRep").css( "top", newTopValue, 'important');
		$("#datalist").css( "top", newTopValue, 'important');	
	}, 1000);
});
