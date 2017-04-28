mviewer.customControls.sample = (function() {
    /*
     * Private
     */
    var _idlayer = 'sample';
    
    
        
    return {
        /*
         * Public
         */

                
        handle: function (features) {
            //optional - code executed when mouse is over vector features of this layer
            console.log(features);
        },  
        
        init: function () {
            // mandatory - code executed when panel is opened
        
        },
        
        destroy: function () {
            // mandatory - code executed when panel is closed           
        }
     }; 	

}());
