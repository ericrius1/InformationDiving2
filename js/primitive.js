G.Primitive = function() {
  this._colorPalette = [0xEF2D5E, 0xFCED49, 0x1BA0D1, 0xA00B5F, 0x93B75E];
  this._materials = []
  this._spawnInterval = 100;
  this._distanceFromPlayer = 200;
  this._fakeObj = new THREE.Object3D() 
  _.each(this._colorPalette, function(colorValue) {
    this._materials.push(new THREE.MeshBasicMaterial({
      color: colorValue
    }));
  }.bind(this))

}

// G.Primitive.prototype.update = function() {}

G.Primitive.prototype = {
  constructor: G.Primitive,
  spawn:   function() {},
  unspawn: function() {},
  update:  function() {}
};

// G.Primitive.addComponent = function(component){
//   console.log('yar')
// }