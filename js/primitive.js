G.Primitive = function() {
  this._spawnInterval = 1000
  this._colorPalette = [0xEF2D5E, 0xFCED49, 0x1BA0D1, 0xA00B5F, 0x93B75E];
  this._materials = []
  _.each(this._colorPalette, function(colorValue) {
    this._materials.push(new THREE.MeshBasicMaterial({
      color: colorValue
    }));
  }.bind(this))

  this.$menuElement = $('<div>').addClass('item').attr('id', Object.keys(G.primitives).length ).text(this.name).appendTo($('#menu'));

  if (this.active) {
    this.$menuElement.addClass('active');
  }
}


G.Primitive.active = null;

// G.Primitive.prototype.update = function() {}

G.Primitive.prototype = {
  constructor: G.Primitive,
  spawn: function() {}
};