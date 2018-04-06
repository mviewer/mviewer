var utils = (function () {
    /**
     * Public Method: lonlat2osmtile
     * from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Zoom_levels
     *
     */
    //Not used but great
    var _lonlat2osmtile = function (lon, lat, zoom) {
        var x = Math.floor((lon+180)/360*Math.pow(2,zoom));
        var y = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
        var osmtile = 'http://tile.openstreetmap.org/' +zoom+'/'+x + '/'+y+'.png';
        return osmtile;
    };
    
    /**
     * _testConfig
     * @param {xml} config xml to test
     */

    var _testConfiguration = function (xml) {
        var score = 0;
        var nbtests = 2;
        //test doublon name layers
        var test = [];
        var doublons = 0;
        $('layer',xml).each(function() {
            var name = $(this).attr("name");
            if ($.inArray(name, test)) {
                test.push(name);
            } else {
                doublons = 1;
                console.log("doublon " + name + " in layers");
            }
        });
        score+=(doublons === 0);
        //test = 1 baselayer visible
        test = $(xml).find( 'baselayer[visible="true"]').length;
        if (test === 1) {
            score+=1;
        } else {
            console.log(test + " baselayer(s) visible(s)");
        }
        //Résultats tests
        console.log("tests config :" + ((score/nbtests)===1));
    };
    
    return {
        lonlat2osmtile: _lonlat2osmtile,
        testConfiguration: _testConfiguration
    };
    
})();