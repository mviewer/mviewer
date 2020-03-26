mviewer.customControls.swipe = (function() {
    /*
        * Private
        */
       var _idlayer = 'swipe';

       return {
           /*
            * Public
            */

           init: function() {
               // mandatory - code executed when panel is opened
               var _map = mviewer.getMap();
               var html = '<input id="swipe" type="range" style="width: 100%;position: fixed;bottom: 75px;">';
               var _swipeElement = document.getElementById('swipe');
               if (!_swipeElement) {
                   $("#map").append(html);
                   _swipeElement = document.getElementById('swipe');
                   _swipeElement.addEventListener('input', function() {
                        console.log("render swipe");
                        _map.render();
                   }, false);
               }


           },

           destroy: function() {
               // mandatory - code executed when panel is closed
               $("#swipe").remove();

           }
       };

   }());