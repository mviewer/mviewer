const key = "get_your_own_D6rA4zTHduk6KOKTXzGB";
const aerial = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20
  })
});
class Swipe extends CustomLayer {
  constructor(id, layer, legend, handle = false) {
    super(id, layer, legend, handle);
    aerial.on('precompose', function (event) {
      var ctx = event.context;
      var width = ctx.canvas.width * (swipe.value / 100);
      ctx.save();
      ctx.beginPath();
      ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
      ctx.clip();
    });

    aerial.on('postcompose', function (event) {
      var ctx = event.context;
      ctx.restore();
    });
  }
}
new Swipe("swipe",aerial);