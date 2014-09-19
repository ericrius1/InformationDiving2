G.TextBox = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 50
  this._spawnInterval = 100
  this._textSpawner = new TextParticles({
    vertexShader: G.shaders.vs.text,
    fragmentShader: G.shaders.fs.text,
    lineLength: 50,
    lineHeight: 1,
    letterWidth: 1
  });
  this._padding = 1


}

G.TextBox.$menuItem = $('<div>').addClass('item').text("5 : TextBox").appendTo($('#menu'));

G.TextBox.prototype = Object.create(G.Primitive.prototype);

G.TextBox.prototype.constructor = G.TextBox;

G.TextBox.prototype.spawn = function() {
  //positioning
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateY(G.rf(5, 15))
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)

  function maketext(numChars) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < numChars; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  var string = maketext(_.random(4, 10));

  var lineGeo = new THREE.Geometry();
  lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
  lineGeo.vertices.push(new THREE.Vector3(1, 0, 0));
  lineGeo.vertices.push(new THREE.Vector3(1, 1, 0));
  lineGeo.vertices.push(new THREE.Vector3(0, 1, 0));
  lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));

  var text = this._textSpawner.createTextParticles(string)
  text.material.uniforms.opacity.value = 0;
  text.position.copy(this._fakeObj.position);
  text.lookAt(G.controlObject.position)
  text.translateX(1.5)
  G.scene.add(text);

  var lineMat = new THREE.LineBasicMaterial();

  var line = new THREE.Line(lineGeo, lineMat);
  line.position.copy(this._fakeObj.position);
  line.position.y -= 2;
  line.lookAt(G.controlObject.position);
  G.scene.add(line)

  var bsd = {
    scaleX: line.scale.x,
    scaleY: line.scale.y,
  }
  var bfd = {
    scaleX: this._padding + string.length,
    scaleY: 2
  }

  var stretchTween = new TWEEN.Tween(bsd).
  to(bfd, 500).
  onUpdate(function() {
    line.scale.set(bsd.scaleX, bsd.scaleY, 1);
  }).start();

  stretchTween.onComplete(function() {
    var csd = {
      opacity: 0
    }

    var fsd = {
      opacity: 1
    }
    var fadeTween = new TWEEN.Tween(csd).
    to(fsd, 2000).
    easing(TWEEN.Easing.Cubic.Out).
    onUpdate(function() {
      text.material.uniforms.opacity.value = csd.opacity
    }.bind(this)).start()
  }.bind(this))

}