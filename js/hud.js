var Hud = function(){
  this._textSpawner = new TextCreator(5);
  var size = 90 //100 takes up full screen
  this._sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16));
  G.scene.add(this._sphere);

  var hudDistance = 10
  var geo = new THREE.PlaneGeometry(size, size, 10, 10)
  var mat = new THREE.MeshBasicMaterial({
    wireframe: true
  })
  G.overlay = new THREE.Mesh(geo, mat);
  G.overlay.translateZ(-10)
  // G.camera.add(G.overlay)
  this._currentVertexIndex = 0;



  var textMesh = this._textSpawner.createMesh('hello world', {});
  // G.camera.add(textMesh)
  textMesh.translateZ(-10);

}

Hud.prototype.addSphere = function(){
  var vertex = G.overlay.geometry.vertices[this._currentVertexIndex++]
  this._sphere.position.copy(vertex)
  setTimeout(function(){
    this.addSphere()
  }.bind(this), 500);
}