
function Lines() {

  var colorPalette = [0xfeee40, 0x17a1d2, 0xf22a5b, 0x9f0a5c];
  var strands = []
  var curVertexIndex = 0;
  var curStrandIndex = 0;


  // var material = new THREE.LineBasicMaterial({
  //   vertexColors: THREE.VertexColors,


  setTimeout(function(){
    createStrand() 

  }, G.looptime)

  function createStrand(){
    //get cam direction
    var t = (G.time % G.looptime) / G.looptime
    var pos = G.pathGeo.parameters.path.getPointAt((t + G.rf(80, 120) / G.pathGeo.parameters.path.getLength()) % 1)

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
    var dir = new THREE.Vector3().add(pos)
    var newPos = new THREE.Vector3().addVectors(dir, pos).normalize().multiplyScalar(G.ringRadius + G.rf(20, 50))
   
    var pos1 = new THREE.Vector3(pos.x, pos.y - G.rf(17, 20), pos.z)
    var pos2 = new THREE.Vector3(pos.x, pos.y + G.rf(11,15), pos.z)
    var dirVec1 = new THREE.Vector3().add(pos1)
    var dirVec2 = new THREE.Vector3().add(pos2)
    var pos1a = new THREE.Vector3().addVectors(pos1, dirVec1).normalize().multiplyScalar(G.sphereRadius)
    var pos2a = new THREE.Vector3().addVectors(pos2, dirVec2).normalize().multiplyScalar(G.sphereRadius)
    var SUBDIVISIONS = 100;

    var strandGeometry = new THREE.Geometry()
    var curve = new THREE.QuadraticBezierCurve3();

    curve.v0 = pos1a;
    curve.v1 = newPos;
    curve.v2 = pos2a;

    var opacity = strandMat.attributes.opacity.value
    for(var j = 0; j < SUBDIVISIONS; j++){
      strandGeometry.vertices.push(curve.getPoint(j/SUBDIVISIONS))
      opacity[j] = 0.0;
    }
    strandGeometry.dynamic = false
    var strand = new THREE.Line(strandGeometry, strandMat)
    G.scene.add(strand)
    strand.material.attributes.opacity.needsUpdate = true

    //To keep things simple, lets grow the strand immediately upon creation. 
    growStrand(strand, 0)

    if(Math.random() < 0.2){
      var text = G.text.createTextParticles(  (G.rf(4, 23) + '').substring(0, 4))
      text.position.copy(pos);
      text.rotation.copy(G.splineCamera.rotation)
      text.position.y -= G.rf(0, 14)
      G.scene.add(text);
    }



    setTimeout(function(){
      createStrand()
    }, G.looptime)


  }


  function growStrand(strand, vertexIndex){
    var opacity = strand.material.attributes.opacity;
    console.log(opacity.value[vertexIndex])
    opacity.value[vertexIndex++] = 1;
    opacity.needsUpdate = true
    if(vertexIndex === opacity.value.length)return

    setTimeout(function(){
      growStrand(strand, vertexIndex); 
    }, 30)

  }


  this.update = function() {
  //   if(curStrandIndex === strands.length){
  //     return;
  //   }

  //   activeAttribute.opacity.value[curVertexIndex++] = 1.0;
  //   activeAttribute.opacity.needsUpdate = true;
    
  //   //Were done growing this strand, move onto the next one
  //   if (curVertexIndex === strand.geometry.vertices.length) {
  //     curVertexIndex = 0;
  //     activeAttribute = strands[++curStrandIndex].material.attributes;
  //   }
  //   strands[curStrandIndex].geometry.colorsNeedUpdate = true;
  }


}