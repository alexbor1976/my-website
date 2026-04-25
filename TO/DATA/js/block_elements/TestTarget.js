class TestTarget {
  constructor({
    course, //or heading, in degrees
    x, // initial x in km
    y, // initial y in km
    v, // velocity in m/s
    h, // height, in m
    // max_distance_of_living = 20, // in km
    max = 100, // in km, max distance of living
    name = 'no name'
  }) {
    this.course = course;
    this.oldX = this.x = x; // Current x in km
    this.oldY = this.y = y; // Current y in km
    this.v = v; // Velocity in m/s
    this.h = h; // Not used for 2D movement
    this.name = name; // Not used for 2D movement
    this.lastUpdateTime = Date.now(); // Track the last update time

    //for valid check
    this.max = max;
    this.previousDistance = 0; // Initialize the previous distance as 0
    this.movingAway = false; // Flag to track if the target has started moving away
    this.tracked = false;//not tracked
    this.absXPx = 0;
    this.absXPy = 0;
    this.rangeRate = 0;//km/s
  }

  //in radians
  getHeading() {
    const heading = unitsConverter.degreesToRadians(this.course);
    return heading;
  }

  //in m
  getAltitude() {
    return this.h;
  }

  //km/s
  getRangeRate() {
    return this.rangeRate;
  }

  getH() {
    return this.h;
  }

  // Velocity in m/s
  getV() {
    return this.v;
  }

  setAbsXPx(absXPx) {
    this.absXPx = absXPx;
  }

  getAbsXPx() {
    return this.absXPx;
  }

  setAbsYPx(absYPx) {
    this.absYPx = absYPx;
  }

  getAbsYPx() {
    return this.absYPx;
  }

  setTracked(tracked) {
    this.tracked = tracked;
  }

  isTracked() {
    return this.tracked;
  }

  update() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdateTime) / 1000; // Time step in seconds
    this.lastUpdateTime = now; // Update the last timestamp

    const distancePerUpdate = (this.v * deltaTime) / 1000; // Distance moved in km

    // Correct angle conversion for PPI's clockwise system
    // const angleInRadians = (360 - this.course) * (Math.PI / 180);
    const angleInRadians = (this.course) * (Math.PI / 180);
    // const angleInRadians = (this.course - 90) * (Math.PI / 180);

    // Calculate the change in X and Y (in km)
    const deltaX = distancePerUpdate * Math.cos(angleInRadians); // X-axis movement (East-West)
    const deltaY = distancePerUpdate * Math.sin(angleInRadians); // Y-axis movement (North-South)



    // Update the position
    this.oldX = this.x; this.oldY = this.y;
    this.x += deltaX; // Move horizontally (East/West)
    this.y += deltaY; // Move vertically (North/South)

    //
    this.calculateRangeRate(deltaTime);

    // Check if the target is moving away and update the previous distance
    // this.checkMovingAway();

    // Consolidated log for debugging
    // console.log({
    //   course: this.course,
    //   angleInRadians,
    //   deltaTime,
    //   distancePerUpdate,
    //   deltaX,
    //   deltaY,
    //   updatedX: this.x.toFixed(2),
    //   updatedY: this.y.toFixed(2),
    // });
  }

  //km, s
  calculateRangeRate(deltaTime) {
    const currentDistance = Math.sqrt(
      Math.pow(this.x, 2) + Math.pow(this.y, 2)
    );
    const prevDistance = Math.sqrt(
      Math.pow(this.oldX, 2) + Math.pow(this.oldY, 2)
    );

    this.rangeRate = (prevDistance - currentDistance) / deltaTime;
  }

  isAway() {
    const currentDistance = Math.sqrt(
      Math.pow(this.x, 2) + Math.pow(this.y, 2)
    );
    const prevDistance = Math.sqrt(
      Math.pow(this.oldX, 2) + Math.pow(this.oldY, 2)
    );

    if (currentDistance > prevDistance)
      return true;//the target is moving away

    return false;
  }

  isOutOfRange() {
    const currentDistance = Math.sqrt(
      Math.pow(this.x, 2) + Math.pow(this.y, 2)
    );

    if (currentDistance > this.max) {
      return true; //the target is out of range
    }

    return false; //the target is in range
  }


  getCurrentCoordinates() {
    // Return the current coordinates as an object
    return { x: this.x, y: this.y };
  }

  toString() {
    const currentDistance = Math.sqrt(
      Math.pow(this.x, 2) + Math.pow(this.y, 2)
    );

    let str = `the target ${this.name} is at distance = ${currentDistance} km;  (x = ${this.x} km; y = ${this.y} km;)`;
    return str;
  }
}
