G.SplicePlanet = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200

}

G.SplicePlanet.$menuItem =  $('<div>').addClass('item').text("6 : Slice Planets").appendTo($('#menu'));

G.SplicePlanet.prototype = Object.create(G.Primitive.prototype);

G.SplicePlanet.prototype.constructor = G.SplicePlanet;

G.SplicePlanet.prototype.spawn = function(){
  console.log('arr')


}
