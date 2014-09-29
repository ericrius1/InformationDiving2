G.Boids = function() {
  G.Primitive.apply(this, arguments);
  this.boids = [];
  this._numBoids = 50;
  this._particleCount = 100000
  this.spheres = []
  this._currentVertexIndex = 0;

  //Set up boids
  for (var i = 0; i < this._numBoids; i++) {
    var boid = new Boid()
    boid.position.x = Math.random() * 400 - 200;
    boid.position.y = Math.random() * 100 + 50
    boid.position.z = Math.random() * 400 - 200;
    boid.velocity.x = Math.random() * 2 - 1;
    boid.velocity.y = Math.random() * 2 - 1;
    boid.velocity.z = Math.random() * 2 - 1;
    boid.setGoal(new THREE.Vector3(0, 50, -1000))
    this.boids.push(boid);
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16))
    this.spheres.push(sphere);
    G.scene.add(sphere);
  }

  var geo = new THREE.Geometry()
  //Create particle pool
  for(var i = 0; i < this._particleCount; i++){
    geo.vertices.push(new THREE.Vector3(0, 0, 1e11));
  }
  this._pointCloud = new THREE.PointCloud(geo);
  G.scene.add(this._pointCloud)
}

G.Boids.$menuItem = $('<div>').addClass('item').text('9 : Boids').appendTo($('#menu'));
G.Boids.prototype = Object.create(G.Primitive.prototype);
G.Boids.prototype.constructor = G.Boids;

G.Boids.prototype.spawn = function() {
  console.log('spawn');
}

G.Boids.prototype.update = function() {
  for (var i = 0, il = this.spheres.length; i < il; i++) {
    this.boids[i].run(this.boids);
    this.spheres[i].position.copy(this.boids[i].position);
    this._pointCloud.geometry.vertices[this._currentVertexIndex++].copy(this.boids[i].position)
    this._pointCloud.geometry.verticesNeedUpdate = true;
  }
}



var Boid = function() {

  var vector = new THREE.Vector3(),
    _acceleration, _width = 500,
    _height = 500,
    _depth = 200,
    _goal, _neighborhoodRadius = 100,
    _maxSpeed = 2,
    _maxSteerForce = 0.1,
    _avoidWalls = false;

  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  _acceleration = new THREE.Vector3();

  this.setGoal = function(target) {

    _goal = target;

  }

  this.setAvoidWalls = function(value) {

    _avoidWalls = value;

  }

  this.setWorldSize = function(width, height, depth) {

    _width = width;
    _height = height;
    _depth = depth;

  }

  this.run = function(boids) {

    if (_avoidWalls) {

      vector.set(-_width, this.position.y, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(_width, this.position.y, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(this.position.x, -_height, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(this.position.x, _height, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(this.position.x, this.position.y, -_depth);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(this.position.x, this.position.y, _depth);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

    }
    /* else {

            this.checkBounds();

          }
          */

    if (Math.random() > 0.5) {

      this.flock(boids);

    }

    this.move();

  }

  this.flock = function(boids) {

    if (_goal) {
      _acceleration.add(this.reach(_goal, 0.005));

    }
    _acceleration.add(this.alignment(boids));
    _acceleration.add(this.cohesion(boids));
    _acceleration.add(this.separation(boids));

  }

  this.move = function() {

    this.velocity.add(_acceleration);

    var l = this.velocity.length();

    if (l > _maxSpeed) {

      this.velocity.divideScalar(l / _maxSpeed);

    }

    this.position.add(this.velocity);
    _acceleration.set(0, 0, 0);

  }

  this.checkBounds = function() {

    if (this.position.x > _width) this.position.x = -_width;
    if (this.position.x < -_width) this.position.x = _width;
    if (this.position.y > _height) this.position.y = -_height;
    if (this.position.y < -_height) this.position.y = _height;
    if (this.position.z > _depth) this.position.z = -_depth;
    if (this.position.z < -_depth) this.position.z = _depth;

  }

  //

  this.avoid = function(target) {

    var steer = new THREE.Vector3();

    steer.copy(this.position);
    steer.sub(target);

    steer.multiplyScalar(1 / this.position.distanceToSquared(target));

    return steer;

  }

  this.repulse = function(target) {

    var distance = this.position.distanceTo(target);

    if (distance < 150) {

      var steer = new THREE.Vector3();

      steer.subVectors(this.position, target);
      steer.multiplyScalar(0.5 / distance);

      _acceleration.add(steer);

    }

  }

  this.reach = function(target, amount) {

    var steer = new THREE.Vector3();

    steer.subVectors(target, this.position);
    steer.multiplyScalar(amount);

    return steer;

  }

  this.alignment = function(boids) {

    var boid, velSum = new THREE.Vector3(),
      count = 0;

    for (var i = 0, il = boids.length; i < il; i++) {

      if (Math.random() > 0.6) continue;

      boid = boids[i];

      distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {

        velSum.add(boid.velocity);
        count++;

      }

    }

    if (count > 0) {

      velSum.divideScalar(count);

      var l = velSum.length();

      if (l > _maxSteerForce) {

        velSum.divideScalar(l / _maxSteerForce);

      }

    }

    return velSum;

  }

  this.cohesion = function(boids) {

    var boid, distance,
      posSum = new THREE.Vector3(),
      steer = new THREE.Vector3(),
      count = 0;

    for (var i = 0, il = boids.length; i < il; i++) {

      if (Math.random() > 0.6) continue;

      boid = boids[i];
      distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {

        posSum.add(boid.position);
        count++;

      }

    }

    if (count > 0) {

      posSum.divideScalar(count);

    }


    steer.subVectors(posSum, this.position);

    var l = steer.length();

    if (l > _maxSteerForce) {

      steer.divideScalar(l / _maxSteerForce);

    }

    return steer;

  }

  this.separation = function(boids) {

    var boid, distance,
      posSum = new THREE.Vector3(),
      repulse = new THREE.Vector3();

    for (var i = 0, il = boids.length; i < il; i++) {

      if (Math.random() > 0.6) continue;

      boid = boids[i];
      distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {

        repulse.subVectors(this.position, boid.position);
        repulse.normalize();
        repulse.divideScalar(distance);
        posSum.add(repulse);

      }

    }

    return posSum;

  }

}