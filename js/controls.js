var Controls = function() {
  activePrimitive = G.primitives['49'];
  var timeoutId;
  var firstTime = true;
  G.fpsControls = new THREE.PointerLockControls(G.camera);
  G.controlObject = G.fpsControls.getObject();
  // G.controlObject.position.z = -100;
  G.scene.add(G.fpsControls.getObject());
  var mouseTimeoutId;
  var pLockEnabled = false;

  function teleport(point) {
    G.controlObject.position.set(point);
  }

  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function(event) {
      if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

        G.fpsControls.enabled = true;
        if(!pLockEnabled){
          $('#cursor').addClass('active')
          $(document).on('mousedown', mouseDown);
          $(document).on('mouseup', mouseRelease);

          $(document).on('keydown', keyPressed);
          pLockEnabled = true
        }




      } else {
        pLockEnabled = false;
        G.fpsControls.enabled = false;
        $('#cursor').removeClass('active')
        $(document).off('mousedown');
        $(document).off('mouseup');

        $(document).off('keydown');


      }

    };

    var pointerlockerror = function(event) {


    };
    // Hook pointer lock state change events
    // document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    document.addEventListener('click', function(event) {



      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

      if (/Firefox/i.test(navigator.userAgent)) {

        var fullscreenchange = function(event) {

          if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

            document.removeEventListener('fullscreenchange', fullscreenchange);
            document.removeEventListener('mozfullscreenchange', fullscreenchange);

            element.requestPointerLock();
          }

        }

        document.addEventListener('fullscreenchange', fullscreenchange, false);
        document.addEventListener('mozfullscreenchange', fullscreenchange, false);

        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

        element.requestFullscreen();

      } else {
        element.requestPointerLock();

      }

    }, false);

  }

  this.update = function() {
    G.fpsControls.update();
  }


  function mouseDown() {
    activePrimitive.spawn();
    $('#cursor').addClass('held');
    timeoutId = setInterval(function(){
      activePrimitive.spawn();
    }, activePrimitive._spawnInterval);

  }

  function mouseRelease() {
    $('#cursor').removeClass('held');
    window.clearInterval(timeoutId)
  }

  function keyPressed(event) {
    if (event.keyCode in G.primitives) {
      _.each(G.primitives, function(primitive){
        primitive.constructor.$menuItem.removeClass('active')
      })

      activePrimitive = G.primitives[event.keyCode];
      activePrimitive.constructor.$menuItem.addClass('active');

     }
  };


}
