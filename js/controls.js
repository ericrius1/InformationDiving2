var Controls = function() {
  activePrimitive = G.primitives['49'];
  var timeoutId;
  var firstTime = true;
  var controlArray = [];
  G.fpsControls = new THREE.PointerLockControls(G.camera);
  G.fpsControls.name = 'fps';
  G.controlObject = G.fpsControls.getObject();
  G.scene.add(G.fpsControls.getObject());

  G.orbitControls = new THREE.OrbitControls(G.camera, G.renderer.domElement);
  // G.orbitControls.enabled = false;
  G.orbitControls.name = 'orbit';
  controlArray.push(G.orbitControls)
  controlArray.push(G.fpsControls)
  var activeControls = controlArray[0];
  G.camera.position.z = -30

  var currentControlsIndex = 0;

  var mouseTimeoutId;
  var pLockEnabled = false;

  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  // Ask the browser to release the pointer
  document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock ||
    document.webkitExitPointerLock;


  if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function(event) {
      if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
        G.fpsControls.enabled = true;


      } else {
        console.log('disable controls')
        G.fpsControls.enabled = false;
      }

    };

    var pointerlockerror = function(event) {
      console.log("POINTER LOCK ERROR")

    };

    var requestPointerLock = function() {


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
    }
  }
  // Hook pointer lock state change events
  document.addEventListener('pointerlockchange', pointerlockchange, false);
  document.addEventListener('mozpointerlockchange', pointerlockchange, false);
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

  document.addEventListener('pointerlockerror', pointerlockerror, false);
  document.addEventListener('mozpointerlockerror', pointerlockerror, false);
  document.addEventListener('webkitpointerlockerror', pointerlockerror, false);



  this.update = function() {
    activeControls.update();
  }


  function mouseDown() {
    if(activeControls.name!=='fps')return
    activePrimitive.spawn();
    $('#cursor').addClass('held');
    timeoutId = setInterval(function() {
      activePrimitive.spawn();
    }, activePrimitive._spawnInterval);

  }

  function mouseRelease() {
    $('#cursor').removeClass('held');
    window.clearInterval(timeoutId)
    activePrimitive.unspawn();
  }

  function keyPressed(event) {
    if (event.keyCode in G.primitives) {
      _.each(G.primitives, function(primitive) {
        primitive.constructor.$menuItem.removeClass('active')
      })

      activePrimitive = G.primitives[event.keyCode];
      activePrimitive.constructor.$menuItem.addClass('active');

    }

    //Toggle controls!
    if (event.keyCode === 67) {
      toggleControls()
    }
  };

  function toggleControls() {
    currentControlsIndex++;
    if (currentControlsIndex === controlArray.length) {
      currentControlsIndex = 0;
    }
    activeControls = controlArray[currentControlsIndex];
    if(activeControls.name === 'fps') {
      requestPointerLock();
      G.camera.position.set(0, 0, 0)
      G.camera.rotation.set(0, 0, 0)
      $('#cursor').css('width', '15px')
    } 
    else {
      G.camera.position.set(0, 0, 30)
      $('#cursor').css('width', '100px')
    }
  }



  $(document).on('keydown', keyPressed);
  $(document).on('mousedown', mouseDown);
  $(document).on('mouseup', mouseRelease);


}