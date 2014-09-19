G.TextBox = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 50
  this._textSpawner = new TextParticles({
    vertexShader: G.shaders.vs.text,
    fragmentShader: G.shaders.fs.text,
    lineLength: 50,
    lineHeight: 1,
    letterWidth: 1
  });
  this._text = this._textSpawner.createTextParticles(G.rf(1, 10).toString().substr(0, 4))

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
  this._text.position.copy(this._fakeObj.position);
  this._text.lookAt(G.controlObject.position)
  this._text.material.opacity = 0.0
  G.scene.add(this._text);

  var csd = {
    opacity: 0
  }

  var fsd = {
    opacity: 1
  }

  var fadeTween = new TWEEN.Tween(csd).
  to(fsd, 2000).
  onUpdate(function() {
    this._text.material.uniforms.opacity.value = csd.opacity
    console.log
  }.bind(this)).start()
}