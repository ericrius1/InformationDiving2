G.SlicePlanet = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200

}

G.SlicePlanet.$menuItem =  $('<div>').addClass('item').text("6 : Slice Planets").appendTo($('#menu'));

G.SlicePlanet.prototype = Object.create(G.Primitive.prototype);

G.SlicePlanet.prototype.constructor = G.SlicePlanet;

G.SlicePlanet.prototype.spawn = function(){
  var geometry = new THREE.Geometry();
  for(var i = 0; i < 1000; i++){
    geometry.vertices.push(new THREE.Vector3(G.rf(-10, 10), G.rf(-10, 10), G.rf(-10, 10)));
  }
  var pointCloud = new THREE.PointCloud(geometry);
  G.scene.add(pointCloud)
  



}
