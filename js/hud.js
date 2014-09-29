var Hud = function(){
  this._textSpawner = new TextCreator(5);

  var hudDistance = 10
  var geo = new THREE.PlaneGeometry(100, 100)
  G.overlay = new THREE.Mesh(geo);

  // G.camera.add(G.overlay);
  G.overlay.translateZ(-10)


  // var textMesh = this._textSpawner.createMesh('hello world', {});
  // G.camera.add(textMesh)
  // textMesh.translateZ(-10);

}