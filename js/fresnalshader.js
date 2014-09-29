G.FresnalShader = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 400

  this._spawnInterval = 100
  this._dTheta = 0.01;



  this._material = new THREE.PointCloudMaterial({
    color: _.sample(this._colorPalette)
  });

}

G.FresnalShader.$menuItem = $('<div>').addClass('item').text("7 : FresnalShader").appendTo($('#menu'));

G.FresnalShader.prototype = Object.create(G.Primitive.prototype);

G.FresnalShader.prototype.constructor = G.FresnalShader;

G.FresnalShader.prototype.spawn = function() {
  var geometry = new THREE.Geometry();
  var R = 100

  for (var y = 0; y < 100; y += 1) {
    for (var theta = 0; theta < Math.PI / 2;) {
      var radius = Math.sqrt(R * R - y * y);
      var x = radius * Math.cos(theta);
      var z = radius * Math.sin(theta);
      // geometry.vertices.push(new THREE.Vector3(x, y, z))

      //probabilties decrease as we move towards sphere edges in relation to camera
      
      var p1 = G.map(theta, 0, Math.PI/2, .5, 1);
      var p2 = G.map(y, 0, 100, 1, 0.5);
      if(p1 < Math.random() && p2 < Math.random()){

        geometry.vertices.push(new THREE.Vector3(x, -y, -z));
        geometry.vertices.push(new THREE.Vector3(-x, -y, -z));

        geometry.vertices.push(new THREE.Vector3(x, -y, z));
        geometry.vertices.push(new THREE.Vector3(-x, -y, z));

        geometry.vertices.push(new THREE.Vector3(x, y, -z));
        geometry.vertices.push(new THREE.Vector3(-x, y, -z));

        geometry.vertices.push(new THREE.Vector3(x, y, z));
        geometry.vertices.push(new THREE.Vector3(-x, y, z));
      }


      theta += this._dTheta

    }
  }
  var pCloud = new THREE.PointCloud(geometry, this._material)
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  this._fakeObj.translateY(direction.y * this._distanceFromPlayer)
  pCloud.position.copy(this._fakeObj.position);
  pCloud.lookAt(G.controlObject.position);
  pCloud.scale.multiplyScalar(G.primitiveParams.scale);
  G.scene.add(pCloud);


}

G.FresnalShader.prototype.unspawn = function() {
  this._material = this._material.clone()
  this._material.color.setHex(_.sample(this._colorPalette));

}