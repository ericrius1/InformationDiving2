G.SlicePlanet = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200
  this._startRadius = 10;
  this._currentRadius = this._startRadius;
  this._numStartingSegments = 50
  this._numSegments = this._numStartingSegments;
  this._spawnInterval = 100
  this._mergedGeo = new THREE.Geometry()
  this._tempSlices = [];
  this._planetSlices = []

  this._material = new THREE.PointCloudMaterial({
    color: _.sample(this._colorPalette)
  });

}

G.SlicePlanet.$menuItem = $('<div>').addClass('item').text("6 : Slice Planets").appendTo($('#menu'));

G.SlicePlanet.prototype = Object.create(G.Primitive.prototype);

G.SlicePlanet.prototype.constructor = G.SlicePlanet;

G.SlicePlanet.prototype.spawn = function() {

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
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  this._fakeObj.translateY(direction.y * this._distanceFromPlayer)
  pointCloud.position.copy(this._fakeObj.position);

  pointCloud.lookAt(G.controlObject.position);
  pointCloud.updateMatrix()
  this._tempSlices.push(pointCloud);
  this._mergedGeo.merge(pointCloud.geometry);


  this._currentRadius += 5
  this._numSegments *= 1.1
}

G.SlicePlanet.prototype.unspawn = function() {

  //replace slices with one mesh for performance and ease of manipulation
  var pointCloud = new THREE.PointCloud(this._mergedGeo, this._material);
  for (var i = 0; i < this._tempSlices.length; i++) {
    G.scene.remove(this._tempSlices[i]);
  }
  G.scene.add(pointCloud);
  pointCloud.position.copy(this._fakeObj.position);

  pointCloud.lookAt(G.controlObject.position);
  this._planetSlices.push(pointCloud);


  //reset vars
  this._currentRadius = this._startRadius;
  this._numSegments = this._numStartingSegments;
  this._material = this._material.clone()
  this._material.color.setHex(_.sample(this._colorPalette));
  this._mergedGeo = new THREE.Geometry();
}

G.SlicePlanet.prototype.update = function() {
  for (var i = 0; i < this._planetSlices.length; i++) {
    this._planetSlices[i].rotation.y += G.dT.value * .1
  }
}