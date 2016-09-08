mviewer.customControls.ref_trace_OD_2013_2016 = (function() {
    /*
     * Private
     */
    var _idlayer = 'ref_trace_OD_2013_2016';
    _layerDefinition = mviewer.getLayer(_idlayer);
    _source = _layerDefinition.layer.getSource();
        
    return {
        /*
         * Public
         */

        msg: function (val) {
            mviewer.alert(val, "alert-info");
        },
        
        getDestinations: function (origine) {
            $.ajax({
                   url: 'http://kartenn.region-bretagne.fr/ws/transports/train.php?obj=destination&origine='+origine,
                   element: _idlayer,
                   success : function (data) {
                        $("#ref_trace_OD_2013_2016-custom-controls-s2 option").remove();
                        var options = ['<option value="" >Destination</option>'];                         
                        $.each(data, function (id, item) {                            
                            options.push('<option label="'+item.destinatio+'" value="'+item.destinatio+'">'+item.destinatio+'</option>');
                        });
                        $("#ref_trace_OD_2013_2016-custom-controls-s2").append(options.join(""));
                   },
                   error: function () {alert( "error ajax" );}
            });      
        },
        
        getTrains: function () {
            var origine = $("#ref_trace_OD_2013_2016-custom-controls-s1").val();
            var destination = $("#ref_trace_OD_2013_2016-custom-controls-s2").val();
            $.ajax({
                   url: 'http://kartenn.region-bretagne.fr/ws/transports/train.php?obj=train&origine='+origine+'&destination='+destination,
                   element: _idlayer,
                   success : function (data) {
                        $("#ref_trace_OD_2013_2016-custom-controls-s3 option").remove();
                        var options = ['<option value="" >Train</option>'];              
                        $.each(data, function (id, item) {                            
                            options.push('<option label="'+item.train+'" value="'+item.od_uic+'">'+item.train+'</option>');
                        });
                        $("#ref_trace_OD_2013_2016-custom-controls-s3").append(options.join(""));
                   },
                   error: function () {alert( "error ajax" );}
            });      
        },
        
        filterTrain: function (val) {
             var cql_filter = "od_a='"+val+"' OR od_b='"+val+"'";
             console.log(cql_filter);
             _source.getParams()['CQL_FILTER'] = cql_filter;
            _source.changed();
        },
        
        init: function () {            
            $.ajax({
                   url: 'http://kartenn.region-bretagne.fr/ws/transports/train.php?obj=origine',
                   element: _idlayer,
                   success : function (data) {
                        var options = [];
                        $.each(data, function (id, item) {                            
                            options.push('<option label="'+item.origine+'" value="'+item.origine+'">'+item.origine+'</option>');
                        });
                        $("#ref_trace_OD_2013_2016-custom-controls-s1").append(options.join(""));
                   },
                   error: function () {alert( "error ajax" );}
            });      
        
        }
     }; // fin return	

}());
