G.DottedLine = function() {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200
  this._spawnInterval = 100;
  this._subdivisions = 100
  this._dotDensity = .1 //approximately every 10% of units create a dot
  this._growInterval = 30;
  this.count = 0;


  var dotGeo = new THREE.SphereGeometry(0.5);
  this._dot = new THREE.Mesh(dotGeo, _.sample(this._materials));
  this._dot.matrixAutoUpdate = false;

}
 

G.DottedLine.$menuItem =  $('<div>').addClass('item').text("3 : Dotted Line").appendTo($('#menu'));

G.DottedLine.prototype = Object.create(G.Primitive.prototype);

G.DottedLine.prototype.constructor = G.DottedLine;


G.DottedLine.prototype.spawn = function(){

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
  var curve = new THREE.QuadraticBezierCurve3();

  curve.v0 = new THREE.Vector3(0, 0, 0);
  curve.v1 = new THREE.Vector3(1, 2, 0);
  curve.v2 = new THREE.Vector3(2, 0, 0);

  var opacity = strandMat.attributes.opacity.value
  for (var j = 0; j < this._subdivisions; j++) {
    strandGeometry.vertices.push(curve.getPoint(j / this._subdivisions))
    opacity[j] = 0.0;
  }
  strandGeometry.dynamic = false
  var strand = new THREE.Line(strandGeometry, strandMat)
  strand.scale.set(G.rf(10, 100), G.rf(10, 100), 1)
  G.scene.add(strand)



  //positioning
  this._fakeObj.position.copy(G.controlObject.position)
  var direction = G.fpsControls.getDirection()
  this._fakeObj.translateX(direction.x * this._distanceFromPlayer)
  this._fakeObj.translateY(-10)
  this._fakeObj.translateZ(direction.z * this._distanceFromPlayer)
  strand.position.copy(this._fakeObj.position);

  strand.matrixAutoUpdate = false;
  strand.updateMatrix();

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
      newDot.updateMatrix();
      G.scene.add(newDot);
      
    }

    opacity.value[vertexIndex++] = 1;
    opacity.needsUpdate = true
    if (vertexIndex === opacity.value.length) return

    setTimeout(function() {
      growStrand(strand, vertexIndex);
    }.bind(this), this._growInterval);
  }.bind(this)
};
