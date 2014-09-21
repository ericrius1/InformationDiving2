G.FresnalShader = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200

  this._spawnInterval = 100



  this._material = new THREE.PointCloudMaterial({
    color: _.sample(this._colorPalette)
  });

}

G.FresnalShader.$menuItem = $('<div>').addClass('item').text("7 : FresnalShader").appendTo($('#menu'));

G.FresnalShader.prototype = Object.create(G.Primitive.prototype);

G.FresnalShader.prototype.constructor = G.FresnalShader;

G.FresnalShader.prototype.spawn = function() {
  var dTheta = 0.5
  var geometry = new THREE.Geometry();
  var R = 100
  for (var y = 0; y < 100; y+=5) {
    for (var theta = 0; theta < Math.PI;) {
      var radius = Math.sqrt(R*R - y*y);
      var x = radius * Math.cos(theta);
      var z = -radius * Math.sin(theta);
      geometry.vertices.push(new THREE.Vector3(x, y, z))
    

      // geometry.vertices.push(new THREE.Vector3(x, -y, z))
      // geometry.vertices.push(new THREE.Vector3(x, - y, -z))
      console.log('y', y)
      console.log(radius - y)

      theta += dTheta
      dTheta = Math.max(0.05, dTheta - .05)
    }
    dTheta = 0.5
  }
  var pCloud = new THREE.PointCloud(geometry)
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  this._fakeObj.translateY(direction.y * this._distanceFromPlayer)
  pCloud.position.copy(this._fakeObj.position);
  pCloud.lookAt(G.controlObject.position);
  G.scene.add(pCloud);


}

G.FresnalShader.prototype.unspawn = function() {

}