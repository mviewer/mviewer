/*
* jQuery easyDiapo plugin
* Update on 7 july 2010
* Version 1.0
*
* Licensed under GPL <http://en.wikipedia.org/wiki/GNU_General_Public_License>
* Copyright (c) 2008, Stéphane Litou <contact@mushtitude.com>
* All rights reserved.
*
This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function(jQuery) {
	jQuery.fn.easyShare = function(options) {
		var settings = Array();
		var sites = Array();
		var position;
		var url;
		var title;

		// Paramètres des sites
		sites = {
			'bebo': {
				name: 'Bebo',
				target: 'http://bebo.com/c/share?Url={url}&amp;Title={title}',
				icone: 'bebo_16.png',
				icone_big: 'bebo_32.png'
			},
			'bitly': {
				name: 'bit.ly',
				target: 'http://bit.ly/?url={url}',
				icone: 'bitly_16.png',
				icone_big: ''
			},
			'delicious': {
				name: 'del.icio.us',
				target: 'http://del.icio.us/post?url={url}&amp;title={title}',
				icone: 'delicious_16.png',
				icone_big: 'delicious_32.png'
			},			
			'digg': {
				name: 'Digg',
				target: 'http://digg.com/submit?phase=2&amp;url={url}&amp;title={title}',
				icone: 'digg_16.png',
				icone_big: 'digg_32.png'
			},
			'dzone': {
				name: 'DZone',
				target: 'http://www.dzone.com/links/add.html?url={url}&amp;title={title}',
				icone: 'dzone_16.png',
				icone_big: 'dzone_32.png'
			},
			'email': {
				name: 'E-mail',
				target: 'mailto:?subject={title}&body={url}',				
				icone: 'email_16.png',
				icone_big: 'email_32.png'
			},
			'evernote': {
				name: 'Evernote',
				target: 'http://www.evernote.com/clip.action?url={url}&amp;title={title}',
				icone: 'evernote_16.png',
				icone_big: 'evernote_32.png'
			},
			'facebook': {
				name: 'Facebook',
				target: 'http://www.facebook.com/sharer.php?u={url}&amp;t={title}',				
				icone: 'facebook_16.png',
				icone_big: 'facebook_32.png'
			},
			'favoris': {
				name: 'Favoris',
				target: '',				
				icone: 'bookmarks_16.png',
				icone_big: 'bookmarks_32.png'
			},
			'friendfeed': {
				name: 'FriendFeed',
				target: 'http://friendfeed.com/share?url={url}&amp;title={title}',
				icone: 'friendfeed_16.png',
				icone_big: 'friendfeed_32.png'
			},
			'google': {
				name: 'Google',
				target: 'http://www.google.com/bookmarks/mark?op=edit&amp;bkmk={url}&amp;title={title}',				
				icone: 'google_16.png',
				icone_big: 'google_32.png'
			},
			'linkedin': {
				name: 'LinkedIn',
				target: 'http://www.linkedin.com/shareArticle?mini=true&amp;url={url}&amp;title={title}&amp;ro=false&amp;summary=&amp;source=',
				icone: 'linkedin_16.png',
				icone_big: 'linkedin_32.png'
			},
			'live': {
				name: 'Live',
				target: 'https://skydrive.live.com/sharefavorite.aspx/.SharedFavorites?url={url}&amp;title={title}',				
				icone: 'live_16.png',
				icone_big: 'live_32.png'
			},
			'myspace': {
				name: 'MySpace',
				target: 'http://www.myspace.com/Modules/PostTo/Pages/?c={url}&amp;t={title}',				
				icone: 'myspace_16.png',
				icone_big: 'myspace_32.png'
			},
			'netvibes': {
				name: 'Netvibes',
				target: 'http://www.netvibes.com/share?url={url}&amp;title={title}',
				icone: 'netvibes_16.png',
				icone_big: 'netvibes_32.png'
			},
			'ping': {
				name: 'Ping',
				target: 'http://ping.fm/ref/?link={url}&amp;title={title}',
				icone: 'ping_16.png',
				icone_big: ''
			},
			'reddit': {
				name: 'reddit',
				target: 'http://reddit.com/submit?url={url}&amp;title={title}',
				icone: 'reddit_16.png',
				icone_big: 'reddit_32.png'
			},
			'scoopeo': {
				name: 'Scoopeo',
				target: 'http://www.scoopeo.com/scoop/new?newurl={url}&amp;title={title}',				
				icone: 'scoopeo_16.png',
				icone_big: 'scoopeo_32.png'
			},
			'slashdot': {
				name: 'Slashdot',
				target: 'http://slashdot.org/bookmark.pl?url={url}&amp;title={title}',
				icone: 'slashdot_16.png',
				icone_big: 'slashdot_32.png'
			},
			'stumbleupon': {
				name: 'StumbleUpon',
				target: 'http://www.stumbleupon.com/submit?url={url}&amp;title={title}',
				icone: 'stumbleupon_16.png',
				icone_big: 'stumbleupon_32.png'
			},
			'technorati': {
				name: 'Technorati',
				target: 'http://www.technorati.com/faves?add={url}',
				icone: 'technorati_16.png',
				icone_big: 'technorati_32.png'
			},
			'twitter': {
				name: 'Twitter',
				target: 'http://twitter.com/home?status={url}+via+{title}',				
				icone: 'twitter2_16.png',
				icone_big: 'twitter_32.png'
			},			
			'yahoo': {
				name: 'Yahoo!',
				target: 'http://bookmarks.yahoo.com/myresults/bookmarklet?u={url}&amp;t={title}',				
				icone: 'yahoo_16.png',
				icone_big: 'yahoo_32.png'
			},
			'yahoobuzz': {
				name: 'Yahoo Buzz',
				target: 'http://buzz.yahoo.com/submit?submitUrl={url}&amp;submitHeadline={title}',
				icone: 'yahoobuzz_16.png',
				icone_big: 'yahoobuzz_32.png'
			}
		};

		// Paramètres par défaut
		settings = {			
			className: '',
			title: 'easyShare this with...',
			sites: ['bebo', 'bitly', 'delicious', 'digg', 'dzone', 'email', 'evernote', 'facebook', 'favoris', 'friendfeed', 'google', 'linkedin', 'live', 'myspace', 'netvibes', 'ping', 'reddit', 'scoopeo', 'slashdot', 'stumbleupon', 'technorati', 'twitter', 'yahoo', 'yahoobuzz' ],
			imagePath: '',
			mode: 'normal',
			bookmarkText: 'Veuillez presser "Ctrl+D" ou "Cmd+D" pour Mac afin d\'ajouter cette page à vos favoris'
		};
		
		if(options) {
			jQuery.extend(settings, options);
		}
		
		/*bindFavEvent = function(obj, url, title) {
			// Favoris
            $(document).on("click", obj.find('li.favoris a'), function() {
			//obj.find('li.favoris a').live('click', function() {
				if(window.opera) {  
					if ($(this).attr("rel") != ""){ // don't overwrite the rel attrib if already set  
						$(this).attr("rel","sidebar");  
					}  
				} 
			
				if (window.sidebar) { // Firefox 
					window.sidebar.addPanel(title, url,"");  
				} else if( document.all ) { // IE
					window.external.AddFavorite(url, title);  
				} else if(window.opera) { // Opera 7+  		
					return false; // do nothing - the rel="sidebar" should do the trick  
				} else { // Safari, chrome, konqueror et autres navigateurs ne supportant pas l'ajout par javascript
					alert(settings.bookmarkText);  
				}
				return false;
			});
		};*/
		
		setContent = function(obj) {
			url = obj.attr('href') != ''?obj.attr('href'):window.location;
			title = obj.attr('title') != ''?unescape( encodeURIComponent(obj.attr('title'))):'easyShare';
			paddingTop = obj.css('padding-top').replace('px');
			paddingBottom = obj.css('padding-bottom').replace('px');
			elementH = parseInt(obj.height()) + parseInt(paddingTop) + parseInt(paddingBottom);
			elementW = obj.width();
			position = getPosition(obj);
			
			content = '<div class="easyShareContent '+settings.className+'"><div class="title">'+settings.title+'</div><ul>';
			
			for(key in settings.sites) {
				if(key != 'indexOf') {
					lien = sites[settings.sites[key]].target.replace(/{url}/, url).replace(/{title}/, title);
					image = '<img src="'+settings.imagePath+sites[settings.sites[key]].icone+'" alt="'+sites[settings.sites[key]].name+'" />';
					if(settings.mode == 'normal') {
						lienDisplay = image+'<a href="'+lien+'" target="blank">'+sites[settings.sites[key]].name+'</a>';
					}else if(settings.mode == 'compact') {
						lienDisplay = '<a href="'+lien+'" target="blank">'+image+'</a>';
					}else {
						lienDisplay = image+'<a href="'+lien+'" target="blank">'+sites[settings.sites[key]].name+'</a>';
					}
					content += '<li class="'+settings.sites[key]+'">'+lienDisplay+'</li>';
				}
			}
			
			content += '</ul></div>';

			objContent = $(content);

			obj.after(objContent);

			objContent.css({					
				top: parseInt(position.y) + elementH,
				left: position.x,
				position: 'absolute',
				zIndex: 1000
			}).fadeIn();
			
			//bindFavEvent(objContent, url, title);
			
			// Fermeture quand click à l'exterieur
			// On bind l'event à la volée pour de meilleurs performances
			/*$('body').click(function() {bindFavEvent(objContent, url, title);
				if(objContent.length) {
					objContent.fadeOut(function() {
						$(this).remove();
						$('body').unbind('click');
					});
				}
			});*/
		};
		
		getPosition = function(obj) {
			obj = $(obj).get(0);
			curleft = obj.offsetLeft || 0;
			curtop = obj.offsetTop || 0;
			while (obj = obj.offsetParent) {
				curleft += obj.offsetLeft
				curtop += obj.offsetTop
			}
			return {x:curleft,y:curtop};
		};
		
		
		return this.each(function () {
		
			if(settings.mode == 'big') {
				var elementLien = $(this);
				var url = elementLien.attr('href') != ''?elementLien.attr('href'):window.location;			
				var alt = elementLien.attr('alt');
				var title = elementLien.attr('title') != ''?elementLien.attr('title'):'easyShare : ';
			
				content = '<ul class="easyShareBox '+settings.className+'">';
				for(key in settings.sites) {
					if(key != 'indexOf') {
						lien = sites[settings.sites[key]].target.replace(/{url}/, url).replace(/{title}/, title);
						image = '<img src="'+settings.imagePath+sites[settings.sites[key]].icone_big+'" alt="'+sites[settings.sites[key]].name+'" />';				
						lienDisplay = '<a href="'+lien+'" target="blank" title="'+sites[settings.sites[key]].name+'">'+image+'</a>';
						content += '<li class="'+settings.sites[key]+'">'+lienDisplay+'</li>';
					}
				}
				content += '</ul><div class="clear"></div>';
				objContent = $(content);
				elementLien.after(objContent);
				elementLien.remove();
				//bindFavEvent(objContent, url, title);
			}else {
				$(this).click(function() {
					if($(this).next('.easyShareContent').length) {
						$(this).next('.easyShareContent').fadeOut(function() {
							$(this).remove();
							$('body').unbind('click');
						});
					}else {
						setContent($(this));
					}
					return false;
				});
			}
		
			// Fermeture auto après un click
			//$('.easyShareContent a').live('click', function() {
            /*$(document).on("click", $('.easyShareContent a'), function() {
				$(this).parents('.easyShareContent').fadeOut(function() {
					$(this).remove();
					$('body').unbind('click');
				});
			});*/
		});	
	};
})(jQuery);
