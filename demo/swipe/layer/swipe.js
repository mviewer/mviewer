let key = "get_your_own_D6rA4zTHduk6KOKTXzGB";
let aerial = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20
  })
});

aerial.on('precompose', function(event) {
    var ctx = event.context;
    var width = ctx.canvas.width * (swipe.value / 100);
    ctx.save();
    ctx.beginPath();
    ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
    ctx.clip();
});

aerial.on('postcompose', function(event) {
    var ctx = event.context;
    ctx.restore();
});

/* convert this lock code to mviewer customLayer */
new CustomLayer("swipe", aerial);
