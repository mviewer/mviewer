// Generated with https://www.cssportal.com/style-input-range/
const _css = `input[type=range] {
  height: 1px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 1px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 1px 1px 1px #FFFFFF;
  background: #3071A9;
  border-radius: 0px;
  border: 0px solid #2E5367;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 2px solid #FFFFFF;
  height: 30px;
  width: 30px;
  border-radius: 20px;
  background: #2E5367;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -15.5px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #3071A9;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 1px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 1px 1px 1px #FFFFFF;
  background: #3071A9;
  border-radius: 0px;
  border: 0px solid #2E5367;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 2px solid #FFFFFF;
  height: 30px;
  width: 30px;
  border-radius: 20px;
  background: #2E5367;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 1px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #3071A9;
  border: 0px solid #2E5367;
  border-radius: 0px;
  box-shadow: 1px 1px 1px #FFFFFF;
}
input[type=range]::-ms-fill-upper {
  background: #3071A9;
  border: 0px solid #2E5367;
  border-radius: 0px;
  box-shadow: 1px 1px 1px #FFFFFF;
}
input[type=range]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 0px 0px 0px #000000;
  border: 2px solid #FFFFFF;
  height: 30px;
  width: 30px;
  border-radius: 20px;
  background: #2E5367;
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: #3071A9;
}
input[type=range]:focus::-ms-fill-upper {
  background: #3071A9;
}
`;

//Classe qui etend la classe abstraite et decrit le custom Control
class Swipe extends AdvancedCustomControl {
  // Initialize the Custom Component
  constructor(id) {
    // Initialize CustomControl superClass
    super(id);

  }
  // Mandatory - code executed when panel is opened
  init() {
    var _map = mviewer.getMap();
    var html = '<div><style>' + _css + '</style><input id="swipe" type="range" style="width: 100%;position: fixed;bottom: 60px;"></div>';
    var _swipeElement = document.getElementById('swipe');
    if (!_swipeElement) {
      $("#map").append(html);
      _swipeElement = document.getElementById('swipe');
      _swipeElement.addEventListener('input', function () {
        _map.render();
      }, false);
    }

    $("#swipe-select").click(function () {
      mviewer.setBaseLayer(this.value);
    });

  }
  // Mandatory - code executed when panel is closed
  destroy() {
    $("#swipe").remove();

  }

}
// Create The Swipe CustomControl
new Swipe("swipe");