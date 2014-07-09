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


$( "#datalist" ).before($( "#searchtool" ).html());
$( "#searchtool" ).remove();


