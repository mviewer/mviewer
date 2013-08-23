/*
 Copyright (c) 2012, GéoMetzMetropole, Metz Métropole - D.S.C.I / S.I.G.
 http://geo.metzmetropole.fr
*/

// ***************************************************************************************************************
// JQuery extend
// ***************************************************************************************************************
$.extend({
	getTime: function() {
		return (new Date()).getTime();
	},	
	postJSON: function (url, data, callback) {
		return $.post(url, data, callback, 'json');
	},
	addSlashes: function(ch) {
		ch = ch.replace(/\\/g,"\\\\");
		ch = ch.replace(/\'/g,"\\'");
		ch = ch.replace(/\"/g,"\\\"");
		return ch;
	},
	stripSlashes: function(ch){ 
		ch = ch.replace(/\\/gi,"");
		return ch;
	},
	isPopupOpen: function(popup) {
		return $(popup + '-popup').hasClass('ui-popup-active');
	}
});

$.extend(jQuery.validator.messages, {
  required: "Ce champ est requis !",
  remote: "votre message",
  email: "Veuillez enter une adresse mail valide !",
  url: "votre message",
  date: "votre message",
  dateISO: "votre message",
  number: "votre message",
  digits: "votre message",
  creditcard: "votre message",
  equalTo: "votre message",
  accept: "votre message",
  maxlength: jQuery.validator.format("votre message {0} caractéres."),
  minlength: jQuery.validator.format("votre message {0} caractéres."),
  rangelength: jQuery.validator.format("votre message  entre {0} et {1} caractéres."),
  range: jQuery.validator.format("votre message  entre {0} et {1}."),
  max: jQuery.validator.format("votre message  inférieur ou égal à {0}."),
  min: jQuery.validator.format("votre message  supérieur ou égal à {0}.")
});