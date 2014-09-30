G.pHeight = 10


G.bloom = 1.1


G.texturesToLoad = [
  ['ubuntuMono', 'img/ubuntuMono.png'],
  ['dot', 'img/dot.png']
]

G.TEXTURES = {};

G.shaders = new ShaderLoader('shaders')
G.loader = new Loader()

G.loader.onStart = function() {
  this.onResize();
  this.init()
  this.animate()
}.bind(G);

G.NEAR = 0.01
G.FAR = 1e27;
G.w = window.innerWidth;
G.h = window.innerHeight;
G.ratio = G.w / G.h;
G.scene = new THREE.Scene();
G.position = new THREE.Vector3()
G.windowSize = new THREE.Vector2(G.w, G.h);
G.camera = new THREE.PerspectiveCamera(45, G.w / G.h, G.NEAR, G.FAR);
G.scene.add(G.camera)
G.renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true});
G.clock = new THREE.Clock();
G.time = G.clock.getElapsedTime()



G.stats = new Stats();
G.gui = new dat.GUI({
  autoplace: false
});
G.guiContainer = document.getElementById('GUI');
G.guiContainer.appendChild(G.gui.domElement);
G.rf = THREE.Math.randFloat;

// Align top-left
G.stats.domElement.style.position = 'absolute';
G.stats.domElement.style.left = '0px';
G.stats.domElement.style.top = '0px';

document.body.appendChild(G.stats.domElement);
G.glContainer = document.getElementById('glContainer');
//POST PROCESSING
var postFolder = G.gui.addFolder('PostProcessing');
var postParams = {
  blur: 1.1
}
postFolder.add(postParams, 'blur').name('blur').onChange(function() {
  G.effectBloom.copyUniforms.opacity.value = postParams.blur;

});
G.renderer.autoClear = false;
G.renderModel = new THREE.RenderPass(G.scene, G.animating === true ? G.splineCamera : G.camera);
G.effectBloom = new THREE.BloomPass(G.bloom);
G.effectCopy = new THREE.ShaderPass(THREE.CopyShader);
G.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
G.effectFXAA.uniforms['resolution'].value.set(1 / G.w, 1 / G.h);
G.effectCopy.renderToScreen = true;

G.composer = new THREE.EffectComposer(G.renderer)
G.composer.addPass(G.renderModel);
G.composer.addPass(G.effectFXAA);
G.composer.addPass(G.effectBloom);
G.composer.addPass(G.effectCopy);

G.primitives = {};



G.dT = {
  type: 'f',
  value: 0
}
G.timer = {
  type: 'f',
  value: 0
}
G.dpr = {
  type: 'f',
  value: window.devicePixelRatio || 1
}

G.renderer.setSize(G.w, G.h);
G.glContainer.appendChild(G.renderer.domElement)


G.startArray = [];

G.emitter = new EventEmitter();

G.init = function() {
  this.createPrimitives();
  G.controls = new Controls();
  G.hud = new Hud();
  G.hud.addSphere();

  //Skydome
  var skyParams = {
    offset: {
      type: 'f',
      // value: 2111
      value: 1877
    },
    exponent: {
      type: 'f',
      value: 0.2
    }
  }
  var skyGeo = new THREE.SphereGeometry(4000, 32, 32);
  var skyMat = new THREE.ShaderMaterial({
    vertexShader: this.shaders.vs.sky,
    fragmentShader: this.shaders.fs.sky,
    uniforms: {
      topColor: {
        type: 'c',
        value: new THREE.Color(0x000000)
      },
      bottomColor: {
        type: 'c',
        value: new THREE.Color(0x55072f)
      },
      offset: skyParams.offset,
      exponent: skyParams.exponent

    },
    side: THREE.BackSide
  });


  var sky = new THREE.Mesh(skyGeo, skyMat);
  sky.rotation.x = Math.PI / 2
  // G.scene.add(sky)

  var skyFolder = G.gui.addFolder('Sky Params');
  skyFolder.add(skyParams.offset, 'value').name('offset');
  skyFolder.add(skyParams.exponent, 'value').name('exponent');

  //PRIMITIVE PARAMS
  G.primitiveParams = {
    scale: 1
  }
  var primitiveFolder = G.gui.addFolder('Primitive Params');
  primitiveFolder.add(G.primitiveParams, 'scale').step(10).min(1).max(G.FAR/1000).listen()
  primitiveFolder.open();



  var groundGeo = new THREE.PlaneGeometry(10000, 10000, 32, 32)
  var groundMat = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.1,
    wireframe: true
  })
  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2
  G.scene.add(ground)

  G.onResize()

}

G.animate = function() {
  //Be careful with calling getElapsedTime and delta together. Will fuck up delta
  this.dT.value = this.clock.getDelta();
  this.timer.value += this.dT.value
  this.controls.update()
  G.primitives['54'].update();
  G.primitives['57'].update();
  TWEEN.update()
  this.stats.update()
  requestAnimationFrame(this.animate);
  G.renderer.clear();
  G.composer.render();

}.bind(G)

G.loadTextures = function() {
  for (var i = 0; i < G.texturesToLoad.length; i++) {
    var t = G.texturesToLoad[i];
    this.loadTexture(t[0], t[1]);
  }
}

G.loadTexture = function(name, file) {
  var cb = function() {
    this.loader.onLoad();
  }.bind(this);

  var m = THREE.UVMapping;
  var l = THREE.ImageUtils.loadTexture;

  G.loader.addLoad();
  G.TEXTURES[name] = l(file, m, cb);
  G.TEXTURES[name].wrapS = THREE.RepeatWrapping;
  G.TEXTURES[name].wrapT = THREE.RepeatWrapping;
}

G.onResize = function() {
  if(G.overlay){
    G.overlay.scale.set( G.w/1000, G.h/1000, 1);
    G.overlay.position.z = -G.h*0.1 /(2*Math.tan( G.camera.fov*(Math.PI/360)) );

  }
  this.w = window.innerWidth;
  this.h = window.innerHeight;
  this.ratio = this.w / this.h

  this.camera.aspect = this.ratio;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(this.w, this.h);

  G.effectFXAA.uniforms['resolution'].value.set(1 / this.w, 1 / this.h);

  G.composer.reset();
}

G.createPrimitives = function() {
  G.primitives['49'] = new G.ArcCloner();
  // G.primitives['49'].constructor.$menuItem.addClass('active');
  G.primitives['50'] = new G.CurveDot();
  G.primitives['51'] = new G.DottedLine();
  G.primitives['52'] = new G.TracerSpline();
  G.primitives['53'] = new G.TextBox();
  G.primitives['54'] = new G.SlicePlanet();
  G.primitives['55'] = new G.FresnalShader();
  G.primitives['56'] = new G.DotSpiral();
  G.primitives['57'] = new G.Boids();
}

window.addEventListener('resize', G.onResize.bind(G), false);