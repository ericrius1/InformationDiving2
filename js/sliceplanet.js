G.SlicePlanet = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200
  this._startRadius = 20;
  this._currentRadius = this._startRadius;
  this._numSegments = 100;
  this._spawnInterval = 100

  this._material = new THREE.PointCloudMaterial({
    color: _.sample(this._colorPalette)
  });

}

G.SlicePlanet.$menuItem = $('<div>').addClass('item').text("6 : Slice Planets").appendTo($('#menu'));

G.SlicePlanet.prototype = Object.create(G.Primitive.prototype);

G.SlicePlanet.prototype.constructor = G.SlicePlanet;

G.SlicePlanet.prototype.spawn = function() {

  var numSegments = this._numSegments;
  var geometry = new THREE.Geometry();
  for (var i = 0; i < this._numSegments; i++) {
    var theta = i / this._numSegments * Math.PI * 2;
    var x = this._currentRadius * Math.cos(theta);
    var y = this._currentRadius * Math.sin(theta);
    geometry.vertices.push(new THREE.Vector3(x, y, 0));
  }
  var pointCloud = new THREE.PointCloud(geometry, this._material);
  G.scene.add(pointCloud)

  //positioning
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateY(-10)
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  pointCloud.position.copy(this._fakeObj.position);
  pointCloud.lookAt(G.controlObject.position);

  this._currentRadius += 5
}

G.SlicePlanet.prototype.unspawn = function(){
  this._currentRadius = this._startRadius;
  this._material = this._material.clone()
  this._material.color.setHex(_.sample(this._colorPalette));
}