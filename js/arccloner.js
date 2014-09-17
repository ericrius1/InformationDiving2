G.ArcCloner = function() {
  G.Primitive.call(this);
  this._colorPalette = [0xfeee40, 0x17a1d2, 0xf22a5b, 0x9f0a5c];
  this._distanceFromPlayer = 200
  this._fakeObj = new THREE.Object3D() 
  this.spawnInterval = 100;
}

G.ArcCloner.prototype = Object.create(G.Primitive.prototype);

G.ArcCloner.prototype.spawn = function(){

  //So we have out update loop
  G.Primitive.prototype.spawn.apply(this, arguments);

  var strandMat = new THREE.ShaderMaterial({
    uniforms: {
      color: {
        type: 'c',
        value: new THREE.Color(_.sample(this._colorPalette))
      }
    },
    attributes: {
      opacity: {
        type: 'f',
        value: []
      },
    },
    vertexShader: G.shaders.vs.strand,
    fragmentShader: G.shaders.fs.strand,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });

  var SUBDIVISIONS = 100;

  var strandGeometry = new THREE.Geometry()
  var curve = new THREE.QuadraticBezierCurve3();

  curve.v0 = new THREE.Vector3(0, 0, 0);
  curve.v1 = new THREE.Vector3(1, 2, 0);
  curve.v2 = new THREE.Vector3(2, 0, 0);

  var opacity = strandMat.attributes.opacity.value
  for (var j = 0; j < SUBDIVISIONS; j++) {
    strandGeometry.vertices.push(curve.getPoint(j / SUBDIVISIONS))
    opacity[j] = 0.0;
  }
  strandGeometry.dynamic = false
  var strand = new THREE.Line(strandGeometry, strandMat)
  strand.scale.set(G.rf(10, 100), G.rf(10, 100), 1)
  strand.rotation.set(0, G.rf(0, Math.PI * 2), 0)
  G.scene.add(strand)

  //positioning
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateY(-10)
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  strand.position.copy(this._fakeObj.position);

  strand.material.attributes.opacity.needsUpdate = true

  //To keep things simple, lets grow the strand immediately upon creation. 
  growStrand(strand, 0)
  
  function growStrand(strand, vertexIndex) {
    var opacity = strand.material.attributes.opacity;
    opacity.value[vertexIndex++] = 1;
    opacity.needsUpdate = true
    if (vertexIndex === opacity.value.length) return

    setTimeout(function() {
      growStrand(strand, vertexIndex);
    }, 30)

  }
}
