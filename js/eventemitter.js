function EventEmitter(){
  var events = {}
 
  this.on = function(evt, func){
    var listeners = events[evt] = events[evt]|| [];
    listeners.push(func);

    return this;

  }

  this.trigger = function(evt){
    var listeners = events[evt];
    if(listeners !== undefined){
      for(var i = 0, n = listeners.length; i < n; i++){
        listeners[i].apply(this, Array.prototype.slice.call(arguments, 1));
      }
    }

    return this;
  }

}