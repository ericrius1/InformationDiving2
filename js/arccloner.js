
function ArcCloner() {

  var colorPalette = [0xfeee40, 0x17a1d2, 0xf22a5b, 0x9f0a5c];
  var strands = []
  var distanceFromPlayer = 200
  var fakeObj = new THREE.Object3D()
  G.emitter.on('arc', function(){
    console.log('dd')
    this.createStrand()
    
  }.bind(this)
  )

  this.createStrand = function(){
    //get cam direction

    var strandMat = new THREE.ShaderMaterial({
      uniforms: {
        color: {type: 'c', value: new THREE.Color(_.sample(colorPalette))}
      },
      attributes: {
        opacity: {type: 'f', value: []},
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

    curve.v0 = new THREE.Vector3(0,0,0);
    curve.v1 = new THREE.Vector3(1, 2, 0);
    curve.v2 = new THREE.Vector3(2, 0, 0);

    var opacity = strandMat.attributes.opacity.value
    for(var j = 0; j < SUBDIVISIONS; j++){
      strandGeometry.vertices.push(curve.getPoint(j/SUBDIVISIONS))
      opacity[j] = 0.0;
    }
    strandGeometry.dynamic = false
    var strand = new THREE.Line(strandGeometry, strandMat)
    strand.scale.set(G.rf(10, 100), G.rf(10, 100), 1)
    strand.rotation.set(0, G.rf(0, Math.PI *2), 0 )
    G.scene.add(strand)

    //positioning
    fakeObj.position.copy(G.controlObject.position)
    var direction = G.fpsControls.getDirection()
    fakeObj.translateX(direction.x * distanceFromPlayer)
    fakeObj.translateY(-10)
    fakeObj.translateZ(direction.z * distanceFromPlayer)
    strand.position.copy(fakeObj.position);

    strand.material.attributes.opacity.needsUpdate = true

    //To keep things simple, lets grow the strand immediately upon creation. 
    growStrand(strand, 0)

  }


  function growStrand(strand, vertexIndex){
    var opacity = strand.material.attributes.opacity;
    opacity.value[vertexIndex++] = 1;
    opacity.needsUpdate = true
    if(vertexIndex === opacity.value.length)return

    setTimeout(function(){
      growStrand(strand, vertexIndex); 
    }, 30)

  }

}