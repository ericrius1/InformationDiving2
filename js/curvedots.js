G.CurveDots = function() {
  this.name = 'CurveDots';
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200
  this._fakeObj = new THREE.Object3D() 
}

G.CurveDots.interval = 200;

G.CurveDots.prototype = Object.create(G.Primitive.prototype);

console.log(G.CurveDots.prototype.constructor)
G.CurveDots.prototype.constructor = G.CurveDots;
G.CurveDots.prototype.spawn = function(){
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
  G.scene.add(strand)

  //We need to encapsulate dot growing and shrinking
  var dotGeo = new THREE.SphereGeometry(2, 12, 10)
  var dot = new THREE.Mesh(dotGeo, _.sample(this._materials));
  strand.dot = dot;
  // G.scene.add(dot);

  //positioning
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateY(-10)
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  strand.position.copy(this._fakeObj.position);

  strand.material.attributes.opacity.needsUpdate = true

  //To keep things simple, lets grow the strand immediately upon creation.
  setTimeout(function(){
    growStrand(strand, 0)
  }, 0) 
  
  function growStrand(strand, vertexIndex) {
    if(vertexIndex === 0){
      G.scene.add(strand.dot)
    }
    var opacity = strand.material.attributes.opacity;
    var worldPos = strand.geometry.vertices[vertexIndex].clone();
    worldPos.applyMatrix4(strand.matrixWorld)
    // if(worldPos.y > strand.dot.geometry.boundingSphere.radius){
      strand.dot.position.set(worldPos.x, worldPos.y, worldPos.z);
    // }
    opacity.value[vertexIndex++] = 1;
    opacity.needsUpdate = true
    if (vertexIndex === opacity.value.length) return

    setTimeout(function() {
      growStrand(strand, vertexIndex);
    }, 30)

  }
}
