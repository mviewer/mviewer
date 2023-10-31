var print = (function () {   
    /**
     * Public Method: _initTool exported as init
     *
     */
    var _initTool = function () {      
        //Add button to toolstoolbar
        var button = `
        <button id="printBtn" class="btn btn-default btn-raised"
          onclick="print.toggle();"  title="Imprimer la carte" i18n=""
          tabindex="116" accesskey="f">
          <span class="glyphicon glyphicon-print" aria-hidden="true">
          </span>
        </button>`;
        $("#toolstoolbar").append(button);      
    };
  
    /**
     * Private Method: _toggle
     *
     * Open modal
     **/
    var _toggle = function () {
      // show or hide print panel
      if ($("#printModal").is(":visible")) {
        $("#printBtn").blur();
        $("#printBtn").removeClass("active");
        $('#printModal').modal('hide'); 
      } else {
        $("#printBtn").addClass("active");
        $('#printModal').modal('show'); 
      }
    };
  
    return {
      init: _initTool,
      toggle: _toggle,
    };
  })();
  
  new CustomComponent("print", print.init);
  