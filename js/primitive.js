G.Primitive = function(active, menuId) {
  this._spawnInterval = 50
  this._timeoutId = null;
  this.active = active || false;
  this.$menuElement = $('#' + menuId);
  if (this.active) {
    this.$menuElement.addClass('active');
  }
  G.emitter.on('spawn', this.startSpawn.bind(this));
  G.emitter.on('unspawn', this.unspawn.bind(this));
  G.emitter.on('toggleActivate', this.toggleActivate.bind(this));
}

G.Primitive.prototype.update = function() {}

G.Primitive.prototype = {
  constructor: G.Primitive,
  startSpawn: function() {
    if (this.active) {
      this.spawn();
    }
  },
  spawn: function() {
    if (this.active) {
      this._timeoutId = setTimeout(function() {
        this.spawn();
      }.bind(this), this._spawnInterval);

    }
  },
  unspawn: function() {
    window.clearTimeout(this._timeoutId);
  },

  toggleActivate: function(keyCode) {
    if(this.key === G.keyMapping[keyCode]){
     this.$menuElement.addClass('active');
    }
    else{
      this.$menuElement.removeClass('active');
    }
  },
  update: function() {}
}