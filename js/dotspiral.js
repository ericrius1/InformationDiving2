G.DotSpiral = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._spawnInterval = 5;
  this._colorPalette = [0xffffff, 0x923e8c]
  this._material = new THREE.PointCloudMaterial({
    color: 0x923e8c
  })
  this._beginningSpawn = true;

  this._radius = 20
  this._numCircleSegments = 100
  this._currentVertexIndex = 0;

}

G.DotSpiral.$menuItem = $('<div>').addClass('item').text("8 : DotSpiral").appendTo($('#menu'));

G.DotSpiral.prototype = Object.create(G.Primitive.prototype);

G.DotSpiral.prototype.constructor = G.DotSpiral;

G.DotSpiral.prototype.spawn = function() {
  if (this._beginningSpawn) {
    this.geometry = new THREE.Geometry();
    for (var i = 0; i < 10000; i++) {
      this.geometry.vertices.push(new THREE.Vector3(0, 0, -10000000));
    }
    this._pointCloud = new THREE.PointCloud(this.geometry, this._material);
    G.scene.add(this._pointCloud);
    this._fakeObj.position.copy(G.controlObject.position)
    this._direction = G.fpsControls.getDirection()
    this._fakeObj.translateX(this._direction.x * this._distanceFromPlayer)
    this._fakeObj.translateZ(this._direction.z * this._distanceFromPlayer)
    this._fakeObj.translateY(this._direction.y * this._distanceFromPlayer)
    this._pointCloud.position.copy(this._fakeObj.position);
    this._pointCloud.lookAt(G.controlObject.position);
    this._beginningSpawn = false;
  }
  if(this._currentVertexIndex >= this._pointCloud.geometry.vertices.length) {
    return;
  }
  var vertex = this._pointCloud.geometry.vertices[this._currentVertexIndex++]
  var currentSegment = this._currentVertexIndex % this._numCircleSegments;
  var theta = currentSegment/this._numCircleSegments * Math.PI * 2;
  vertex.x = this._radius * Math.cos(theta);
  vertex.y = this._radius * Math.sin(theta);
  vertex.z =  -this._currentVertexIndex
  this._pointCloud.geometry.verticesNeedUpdate = true;

}

G.DotSpiral.prototype.unspawn = function() {
  this._beginningSpawn = true;
  this._currentVertexIndex = 0;
  this._material = this._material.clone();
  this._material.color.setHex(_.sample(this._colorPalette));


}