G.DotSpiral = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._spawnInterval = 5;
  this._material = new THREE.PointCloudMaterial({
    depthWrite: false,
    depthTest: false
  })
  this._beginningSpawn = true;



  this._currentVertexIndex = 0;

}

G.DotSpiral.$menuItem = $('<div>').addClass('item').text("8 : DotSpiral").appendTo($('#menu'));

G.DotSpiral.prototype = Object.create(G.Primitive.prototype);

G.DotSpiral.prototype.constructor = G.DotSpiral;

G.DotSpiral.prototype.spawn = function() {
  if (this._beginningSpawn) {
    this.geometry = new THREE.Geometry();
    for (var i = 0; i < 1000; i++) {
      this.geometry.vertices.push(new THREE.Vector3(0, 0, -10000000));
    }
    this._pointCloud = new THREE.PointCloud(this.geometry);
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
    console.log("PARTICLE POOL IS DEPLETED")
    return;
  }
  var vertex = this._pointCloud.geometry.vertices[this._currentVertexIndex++]
  vertex.z =  -this._currentVertexIndex
  this._pointCloud.geometry.verticesNeedUpdate = true;

}

G.DotSpiral.prototype.unspawn = function() {
  this._beginningSpawn = true;
  this._currentVertexIndex = 0;


}