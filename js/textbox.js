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

}

G.TextBox.$menuItem = $('<div>').addClass('item').text("5 : TextBox").appendTo($('#menu'));

G.TextBox.prototype = Object.create(G.Primitive.prototype);

G.TextBox.prototype.constructor = G.TextBox;

G.TextBox.prototype.spawn = function() {
  var text = this._textSpawner.createTextParticles(G.rf(1, 10).toString().substr(0, 4))
  //positioning
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateY(G.rf(5, 15))
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  text.position.copy(this._fakeObj.position);
  text.lookAt(G.controlObject.position)
  G.scene.add(text);

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
    console.log
  }.bind(this)).start()
}