G.Primitive = function() {
  this.spawnInterval = 50
  this.timeoutId = null;
  G.emitter.on('spawn', this.spawn.bind(this));
  G.emitter.on('unspawn', this.unspawn.bind(this)); 
}

G.Primitive.prototype.update = function(){
}

G.Primitive.prototype = {
  constructor: G.Primitive,
  spawn: function() {
    console.log('doug knows');

    this.timeoutId = setTimeout(function(){
      this.spawn();  
    }.bind(this), this.spawnInterval);
  },
  unspawn: function(){
     window.clearTimeout(this.timeoutId);
   },
  update: function(){
  }
}