var Controls = function() {

  G.fpsControls = new THREE.PointerLockControls(G.camera);
  G.controlObject = G.fpsControls.getObject();
  // G.controlObject.position.z = -100;
  G.scene.add(G.fpsControls.getObject());

  function teleport(point) {
    G.controlObject.position.set(point);
  }

  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function(event) {

      if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

        G.fpsControls.enabled = true;



      } else {

        G.fpsControls.enabled = false;

      }

    }

    var pointerlockerror = function(event) {


    }

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
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

  $(document).on('mousedown', function(){
    console.log('sd')
    G.emitter.trigger('arc');
  })
}