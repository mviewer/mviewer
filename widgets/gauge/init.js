    $(document).ready(function () {
    
        ///////////////
        widgets.gauge = (function() {
        /* private */
        var _test=null;
        var _testFn = function (value) {
            return value;
        };
        
        /*
         * Public
         */

        return {

           init: function () {        
            var widget = '<div id="widget1" style="height: 150px;"><div>Température</div><div id="gauge" style="margin-left: 10px; float: left; padding: 5px; margin-top: 10px;"></div></div>';
            $("#widgetcontainer").prepend(widget);
            $("#widget1").addClass("widget");

             var theme = 'black';
                $('#docking').jqxDocking({theme:'black',orientation: 'horizontal', width: 333, mode: 'floating' });
                $("#docking").css({ "position": "absolute", "top": "100px", "right": "100px"});                   
                $('#docking').jqxDocking('widget1');                    
                $('#docking').jqxDocking('showAllCollapseButtons');
                
                // widget gauge
                 var majorTicks = { size: '10%', interval: 10 };
                 var minorTicks = { size: '5%', interval: 2.5, style: { 'stroke-width': 1, stroke: '#aaaaaa'} };
                 var labels = { interval: 20 };
                
                $('#gauge').jqxLinearGauge({
                    orientation: 'horizontal',
                    labels: labels,
                    ticksMajor: majorTicks,
                    ticksMinor: minorTicks,
                    max: 60,
                    value: -60,
                    pointer: { size: '6%' },
                    colorScheme: 'scheme05',
                    ranges: [
                    { startValue: -10, endValue: 10, style: { fill: '#FFF157', stroke: '#FFF157'} },
                    { startValue: 10, endValue: 35, style: { fill: '#FFA200', stroke: '#FFA200'} },
                    { startValue: 35, endValue: 60, style: { fill: '#FF4800', stroke: '#FF4800'}}]
                });
                $('#gauge').jqxLinearGauge('height', '100px');
                $('#gauge').jqxLinearGauge('width', '300px');
                $('#gauge').jqxLinearGauge('orientation', 'horizontal');
                $('#gauge').jqxLinearGauge('value', 3);
                
                $('#widget1').bind('expand', function () {                                             
                    $('#gauge').jqxLinearGauge('value', 3);                        
                 });
                 
                 $('#widget1').bind('collapse', function () {                       
                    $('#gauge').jqxLinearGauge('value', -60);                       
                 });
                
                $('#docking').jqxDocking('hideAllCloseButtons');
            }
        }
    })();
        
        /////////////
        widgets.gauge.init();
    });
    
    