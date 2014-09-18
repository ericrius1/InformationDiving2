G.TextBox = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 50

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
  var text = G.text.createTextParticles(G.rf(1, 10).toString().substr(0, 4))
  text.position.copy(this._fakeObj.position);
  text.lookAt(G.controlObject.position)
  G.scene.add(text);
}