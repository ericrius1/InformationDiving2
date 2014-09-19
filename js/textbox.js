G.TextBox = function(active, key) {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 50
  this._spawnInterval = 500
  this._textScale = 5;
  this._textSpawner = new TextCreator(this._textScale);
  this._padding = 1
  this._allCaps = false
  this._fadeTime = 500;


}

G.TextBox.$menuItem = $('<div>').addClass('item').text("5 : TextBox").appendTo($('#menu'));

G.TextBox.prototype = Object.create(G.Primitive.prototype);

G.TextBox.prototype.constructor = G.TextBox;

G.TextBox.prototype.spawn = function() {
  //positioning
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)

  function maketext(numChars) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < numChars; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  var string = maketext(_.random(4, 10));
  var string = 'hello'
  if (this._allCaps === true) {
    string.toUpperCase();
  }


  var textMesh = this._textSpawner.createMesh('hello world hahahaha', {});
  textMesh.position.copy(this._fakeObj.position);
  G.scene.add(textMesh);
  var helper = new THREE.BoundingBoxHelper(textMesh, 0xff00ff)
  helper.update()
  textMesh.lookAt(G.controlObject.position);
  // G.scene.add(helper)
  var box = helper.box

  var lineGeo = new THREE.Geometry();
  var width = (box.max.x - box.min.x) + this._padding;
  var height = (box.max.y - box.min.y) + this._padding;
  lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
  lineGeo.vertices.push(new THREE.Vector3(width, 0, 0));
  lineGeo.vertices.push(new THREE.Vector3(width, height, 0));
  lineGeo.vertices.push(new THREE.Vector3(0, height, 0));
  lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));

  var lineMat = new THREE.LineBasicMaterial({
    depthwrite: true,
    depthtest: true,
    linewidth: 2
  });

  var line = new THREE.Line(lineGeo, lineMat);
  line.position.copy(this._fakeObj.position)
  line.lookAt(G.controlObject.position);
  line.translateX(-width / 2)
  line.translateY(-height / 2)
  G.scene.add(line)

  var bsd = {
    scaleX: 0.001,
    scaleY: 0.001,
  }
  var bfd = {
    scaleX: 1,
    scaleY: 1
  }

  var stretchTween = new TWEEN.Tween(bsd).
  to(bfd, this._fadeTime).
  onUpdate(function() {
    line.scale.set(bsd.scaleX, bsd.scaleY, 1);
  }).start().
  yoyo(true).
  delay(500).
  repeat(1);

  stretchTween.onComplete(function() {
    G.scene.remove(line);
  })

  var tsd = {
    scaleX: 0.01,
    scaleY: 0.01
  }

  var ted = {
    scaleX: this._textScale,
    scaleY: this._textScale
  }

  var textTween = new TWEEN.Tween(tsd).
  to(ted, this._fadeTime).
  onUpdate(function() {
    textMesh.scale.set(tsd.scaleX, tsd.scaleY, 1);
  }).start().
  yoyo(true).
  delay(500).
  repeat(1);

  textTween.onComplete(function() {
    G.scene.remove(textMesh);
  })



}