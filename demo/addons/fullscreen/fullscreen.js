const fullscreen = (function() {

    var _btn;
    var _fullscreen = function (e) {
        document.getElementById("map").requestFullscreen();
    };

    return {

        init : function () {
            _btn = document.getElementById("fullscreen-btn");
            _btn.addEventListener('click', _fullscreen);
        }
    };

})();

new CustomComponent("fullscreen", fullscreen.init);