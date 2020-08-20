const fullscreen = (function() {

    var _btn;
    var _state = 0;
    var _IFrame = false;
    var element = document.getElementById("main");
    var _fullscreen = function (e) {
        if (_state === 0) {
            element.requestFullscreen();
        } else {
            document.exitFullscreen();
        }

    };

    var _toggleMouseWheelZoom = function (bol) {
        if (_IFrame) {
            mviewer.getMap().getInteractions().forEach((interaction) => {
                if (interaction instanceof ol.interaction.MouseWheelZoom) {
                    interaction.setActive(bol);
                }
            });
        }
    };

    return {

        init : function () {
            _btn = document.getElementById("fullscreen-btn");
            document.addEventListener('fullscreenchange', (event) => {
              // document.fullscreenElement will point to the element that
              // is in fullscreen mode if there is one. If there isn't one,
              // the value of the property is null.
              if (document.fullscreenElement) {
                console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
                _btn.querySelector("span").classList.remove("fa-expand-arrows-alt");
                _btn.querySelector("span").classList.add("fa-expand");
                _btn.title = "Quitter le mode plein-écran plein écran"
                _toggleMouseWheelZoom(true);
                _state = 1;
              } else {
                console.log('Leaving full-screen mode.');
                _btn.querySelector("span").classList.remove("fa-expand");
                _btn.querySelector("span").classList.add("fa-expand-arrows-alt");
                _btn.title = "Afficher en plein-écran";
                _toggleMouseWheelZoom(false);
                _state = 0;
              }
            });
            _btn.addEventListener('click', _fullscreen);
            // remove MouseWheelZoom if Iframe
            if ( window.location !== window.parent.location ) {
                _IFrame = true;
                console.log("MVIEWER IFRAME");
               _toggleMouseWheelZoom(false);
            }
        }
    };

})();

new CustomComponent("fullscreen", fullscreen.init);