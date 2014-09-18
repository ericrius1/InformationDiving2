G.TracerSpline = function() {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200
  this._spawnInterval = 100;
  this._subdivisions = 100
  this._dotDensity = .1 //approximately every 10% of units create a dot
  this._numSteps = 100;
  this._step = 1/this._numSteps;
  var dotGeo = new THREE.SphereGeometry(0.5);
  this._dot = new THREE.Mesh(dotGeo, _.sample(this._materials));

}
 

G.TracerSpline.$menuItem =  $('<div>').addClass('item').text("4: Tracer Spline").appendTo($('#menu'));

G.TracerSpline.prototype = Object.create(G.Primitive.prototype);

G.TracerSpline.prototype.constructor = G.TracerSpline;


G.TracerSpline.prototype.spawn = function(){
  console.log("SPAWN")

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


  var strandGeometry = new THREE.Geometry()
  var points = [];
  points.push(new THREE.Vector3(0, 1, 0))
  points.push(new THREE.Vector3(G.rf(1,2), 0, 0))
  points.push(new THREE.Vector3(G.rf(2,3), 1, 0))
  points.push(new THREE.Vector3(G.rf(3, 4), 0, 0))
  points.push(new THREE.Vector3(G.rf(4, 5), 1, 0))
  var tracerPath = new THREE.SplineCurve3(points);


  var opacity = strandMat.attributes.opacity.value
  for (var j = 0; j < 1; j+=this._step) {
    var point = tracerPath.getPoint(j)
    strandGeometry.vertices.push(point.clone())
    opacity.push(0.0);
  }
  strandGeometry.dynamic = false
  var strand = new THREE.Line(strandGeometry, strandMat)
  strand.material.linewidth = 2
  strand.scale.set(G.rf(50, 100), G.rf(10, 100), 1)
  G.scene.add(strand)

  //We need to encapsulate dot growing and shrinking


  //positioning
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateY(10)
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  strand.position.copy(this._fakeObj.position);
  strand.lookAt(G.controlObject.position);

  strand.material.attributes.opacity.needsUpdate = true

  //To keep things simple, lets grow the strand immediately upon creation.
  setTimeout(function(){
    growStrand(strand, 0)
  }.bind(this), 0); 
  
  var growStrand = function(strand, vertexIndex) {
    var opacity = strand.material.attributes.opacity;

    if(Math.random() < this._dotDensity){
      var worldPos = strand.geometry.vertices[vertexIndex].clone();
      worldPos.applyMatrix4(strand.matrixWorld)
      var newDot = this._dot.clone()
      newDot.position.copy(worldPos);
      G.scene.add(newDot);
      
    }

    opacity.value[vertexIndex++] = 1;
    opacity.needsUpdate = true
    if (vertexIndex === opacity.value.length) return

    setTimeout(function() {
      growStrand(strand, vertexIndex);
    }.bind(this), 30);
  }.bind(this)
};
