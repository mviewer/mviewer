const layerfilter = (function() {

  let _input;
  let _layerfilter = function (e) {
      const term = $("#layerfilter-field").val().toLowerCase().trim();
      $("#menu li").hide().filter(function() {
        const occurs = $(this).text().toLowerCase().trim().indexOf(term) !== -1;
        if (occurs && term !== "") {
          // open and display themes and groupes
          if ($(this).parent("#menu") || $(this).parent().parent("#menu")) {
            $(this).addClass("opened");
            $(this).show();
            $(this).children("ul").show();
            $(this).children().children("li").show();
          }
        } else {
          $(this).removeClass("opened");
          $(this).children("ul").hide();
        }
        return occurs;
      }).show();
  };

  return {
      init : function () {
          _input = document.getElementById("layerfilter-field");
          _input.addEventListener('keyup', _layerfilter);
      }
  };

})();

new CustomComponent("layerfilter", layerfilter.init);