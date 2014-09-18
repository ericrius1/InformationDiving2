G.CurveDots = function() {
  G.Primitive.apply(this, arguments);
  this._distanceFromPlayer = 200
  this._spawnInterval = 50;
  this._fakeObj = new THREE.Object3D() 
  this.dotScale = 0.01;
  this._subdivisions = 100

  this._percentFullScale = .1 //dot will be full scale by 10% of curve

}
 

// G.CurveDots.interval = 200;
G.CurveDots.$menuItem =  $('<div>').addClass('item').text("2 : Curve Dots").appendTo($('#menu'));

G.CurveDots.prototype = Object.create(G.Primitive.prototype);

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
  }.bind(this), 0); 
  
  var growStrand = function(strand, vertexIndex) {
    if(vertexIndex === 0){
      G.scene.add(strand.dot)
    }
    var opacity = strand.material.attributes.opacity;
    var worldPos = strand.geometry.vertices[vertexIndex].clone();
    worldPos.applyMatrix4(strand.matrixWorld)
    strand.dot.position.set(worldPos.x, worldPos.y, worldPos.z);
    if(vertexIndex <= this._subdivisions * this._percentFullScale){
      var scale = G.map(vertexIndex, 0, this._subdivisions * this._percentFullScale, 0.01, 1)
      strand.dot.scale.set(scale, scale, scale);
    }
    opacity.value[vertexIndex++] = 1;
    opacity.needsUpdate = true
    if (vertexIndex === opacity.value.length) return

    setTimeout(function() {
      growStrand(strand, vertexIndex);
    }.bind(this), 30);
  }.bind(this)
};
