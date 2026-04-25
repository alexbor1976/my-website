class PPI extends Root {
  constructor({
    ppiId,
    containerId,
    baseImage,
    width = 400,
    height = 400,
    top = 0,
    left = 0,
  }) {
    super(ppiId, containerId);
    this.startTime = Date.now();
    this.ppiId = ppiId;
    this.containerId = containerId;
    this.baseImage = baseImage;
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
    this.color = '#ceffec';
    this.blur = 0;
    this.lineWidth = 1;
    this.shadowColor = this.getShadowColor();
    this.azimuthAngle = 0;
    this.joystickX = 0;
    this.joystickY = 0;
    this.currentSpanInKm = 80; //40,80,120
    this.updateInterval = 300;
    /** @type {TestTarget []} */
    this.testTargets = [];
    this.maxRadius = 100; //in px, the max drawing area
    this.maxRadiusForRings = 100; //in px, the max drawing area for the rings
    this.crossLineY = 100; //in px, if the tracked target below - the trackDataLabels flips upstairs
    this.trackLabelsFlippedDown = true;//the tracked labels are drawn below
    this.joystickSign = new JoystickSign();
    this.trackDataLabel = null; //for tracked data table on the PPI
    this.timeAzimuth = null;

    this.initPPI();
    this.startIntervalPPIUpdate();
    this.initTestTargets();

    // testDraw();
  }

  initTestTargets() {
    const tt1 = new TestTarget({ course: 150, x: 100, y: -70, v: 300, h: 1000, max: 100, name: 'tt1' });
    this.testTargets.push(tt1);
    const tt2 = new TestTarget({ course: 60, x: -20, y: -100, v: 500, h: 3000, max: 100, name: 'tt2' });
    this.testTargets.push(tt2);

    // const tt3 = new TestTarget({ course: 45, x: 0.1, y: 0.1, v: 500, h: 3000, max: 119, name: 'ne19' });
    const tt3 = new TestTarget({ course: 45, x: 10, y: 10, v: 500, h: 3000, max: 119, name: 'ne19' });
    this.testTargets.push(tt3);
    const tt4 = new TestTarget({ course: 45 + 90, x: -10, y: 10, v: 500, h: 3000, max: 120, name: 'se20' });
    this.testTargets.push(tt4);
    const tt5 = new TestTarget({ course: 45 + 90 + 90, x: -10, y: -10, v: 500, h: 3000, max: 121, name: 'sw21' });
    this.testTargets.push(tt5);
    const tt6 = new TestTarget({ course: 45 + 90 + 90 + 90, x: 10, y: -10, v: 500, h: 3000, max: 122, name: 'nw22' });
    this.testTargets.push(tt6);
    const rr = new TestTarget({ course: 0, x: -70, y: -10, v: 2000, h: 7000, max: 122, name: 'rr' });
    this.testTargets.push(rr);
    const rr2 = new TestTarget({ course: 180, x: +20, y: 10, v: 2000, h: 7000, max: 122, name: 'rr2' });
    this.testTargets.push(rr2);

    // const target = new TestTarget({
    //   course: 45, // 45 degrees (Northeast)
    //   // course: 135, // 45 degrees (Northeast)
    //   x: 0,
    //   y: 0,
    //   v: 300, // 300 m/s
    //   h: 0, // No vertical velocity needed
    //   max_distance_of_living: 100, // Max range 100 km
    // });
    // this.testTargets.push(target);
  }

  switchRange(position) {
    if (position === 0) {
      this.currentSpanInKm = 40;
    }
    if (position === 1) {
      this.currentSpanInKm = 80;
    }
    if (position === 2) {
      this.currentSpanInKm = 120;
    }
    console.log('PPI, this.range: ', this.currentSpanInKm);
    // this.updatePPI();
  }

  //in radians, X to up, Y to the right;
  calculateAzimuth(x, y) {
    // Calculate the angle in radians with your custom coordinate system
    let radians = Math.atan2(y, x); // Order: y (horizontal), x (vertical)
    return radians;
  }




  trackDataBtnClick(position) {
    if (position === 0) {
      this.trackDataLabel.show(false);
    }
    if (position === 1) {
      this.trackDataLabel.show(true);
    }

    // console.log('PPI, this.range: ', this.currentSpanInKm);
    // this.updatePPI();
  }

  getShadowColor() {
    // Convert the input color to RGB
    const rgbColor = this.parseColor(this.color); // Convert "red" or "#FF0000" to RGB format

    // Use the darkenColor method to create a darker version of the color
    const shadowColor = this.darkenColor(rgbColor, 0.001); // Darken by 30%

    return this.color;
    // return shadowColor;
  }

  // Method to calculate time passed since the program started
  calculateElapsedTime() {
    const currentTime = Date.now();
    const elapsedTimeMs = currentTime - this.startTime; // Time in milliseconds

    // Convert the elapsed time to seconds
    const elapsedTimeSeconds = Math.floor(elapsedTimeMs / 1000);

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(elapsedTimeSeconds / 3600);
    const minutes = Math.floor((elapsedTimeSeconds % 3600) / 60);
    const seconds = elapsedTimeSeconds % 60;

    return { hours, minutes, seconds };
  }

  // Method to format and draw the time
  updateTimeDisplay() {
    // Calculate elapsed time
    const { hours, minutes, seconds } = this.calculateElapsedTime();

    // Call the draw method with formatted time
    // this.drawTimeInSingleRectangle(hours, minutes, seconds);
    this.timeAzimuth.updateTime(hours, minutes, seconds);
  }

  // Initialize the PPI and append it to the container
  initPPI() {
    if (!this.containerId) {
      console.error("Container ID is undefined.");
      return;
    }

    const $container = $(`#${this.containerId}`);
    if ($container.length === 0) {
      console.error(`Container with id '${this.containerId}' not found.`);
      return;
    }

    const $ppiElement = $('<div>', { id: this.ppiId, class: 'ppi_container' });
    $container.append($ppiElement);
    this.applyStyles();
    this.createCanvas();

    this.trackDataLabel = new TrackDataLabel({ containerId: this.ppiId });
    this.timeAzimuth = new PPITimeAzimuth({ containerId: this.ppiId });
  }

  // initTrackData() {
  //   if (!this.containerId) {
  //     console.error("Container ID is undefined.");
  //     return;
  //   }

  //   const $container = $(`#${this.containerId}`);
  //   if ($container.length === 0) {
  //     console.error(`Container with id '${this.containerId}' not found.`);
  //     return;
  //   }

  //   const $ppiElement = $('<div>', { id: this.ppiId, class: 'ppi_container' });
  //   $container.append($ppiElement);
  //   this.applyStyles();
  //   this.createCanvas();
  // }

  // Apply embedded CSS styles
  applyStyles() {
    const styles = {
      position: 'absolute',
      top: `${this.top}px`,
      left: `${this.left}px`,
      width: `${this.width}px`,
      height: `${this.height}px`,
      'background-image': `url(${this.baseImage})`,
      'background-size': 'cover',
    };
    $(`#${this.ppiId}`).css(styles);
  }

  // Create a canvas for rendering the PPI indicators
  createCanvas() {
    const canvasId = `${this.ppiId}_canvas`;
    const $ppiElement = $(`#${this.ppiId}`);

    if ($ppiElement.length === 0) {
      console.error(`PPI element with id '${this.ppiId}' not found.`);
      return;
    }

    const $canvasElement = $('<canvas>', { id: canvasId, width: this.width, height: this.height });

    // const $canvasElement = $('<canvas>', { id: canvasId, width: this.width, height: this.height })
    //   .css({
    //     border: '2px solid white' // You can adjust the border style as needed
    //   });

    $ppiElement.append($canvasElement);

    // Log to check if canvas is properly appended
    // console.log(`Canvas appended with id: ${canvasId}`);

    this.canvas = document.getElementById(canvasId);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      // console.log('Canvas context initialized in createCanvas:', this.ctx);
    } else {
      console.error('Canvas element could not be found or created.');
    }

    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.maxRadius = rect.width / 2 * 0.80;
    this.crossLineY = - this.maxRadius * 0.5;
    // this.maxRadius = rect.width / 2 * 0.82;
    this.maxRadiusForRings = this.maxRadius * .999;
    // this.maxRadiusForRings = this.maxRadius * .99;
    // console.log('Canvas width:', this.canvas.width);
    // console.log('Canvas height:', this.canvas.height);
    // console.log('Max radius (in pixels):', this.maxRadius);
  }


  rotateLine({ color = this.color, width = this.lineWidth, blur = this.blur, speed = 0.020 } = {}) {
    if (this.ctx) {
      let currentAngle = 0;

      // Save reference to the class context
      const ctx = this.ctx;
      const canvas = this.canvas;

      const drawRotatingLine = () => {
        // Clear the entire canvas to prepare for redrawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the line with the updated angle
        this.drawLineFromCenter({
          color: color,
          width: width,
          blur: blur,
          angle: currentAngle,
        });

        // Increment the angle by the speed value
        currentAngle += speed;

        // Keep the angle between 0 and 2*PI
        if (currentAngle >= 2 * Math.PI) {
          currentAngle = 0;
        }

        // Repeat this process at a set interval
        requestAnimationFrame(drawRotatingLine);
      };

      // Start the rotation animation
      drawRotatingLine();
    } else {
      console.error('Canvas context not found. Cannot rotate the line.');
    }
  }


  // Clear the canvas for redrawing
  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  // Method to draw an indicator at given coordinates (x, y)
  drawIndicator(x, y, color = 'red', radius = 5) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  drawCanvasBoundary() {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 1;

      // Draw a boundary rectangle around the canvas
      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.width, this.height);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  azimuthUpdate(angle_) {
    // this.clearCanvas();
    this.azimuthAngle = this.azimuthAngle + angle_ / 400;
    this.updatePPI();
    return this.azimuthAngle;
    // this.drawLineFromCenter({ angle: this.azimuthAngle });
  }
  joystickUpdate(x, y) {
    // this.clearCanvas();
    const mult = 3;
    const joystickXtemp = this.joystickX + x * mult;
    const joystickYtemp = this.joystickY - y * mult;

    if (this.isJoystickInBounds(joystickXtemp, joystickYtemp)) {
      this.joystickX = joystickXtemp;
      this.joystickY = joystickYtemp;
      this.updatePPI();
    }
    // this.drawLineFromCenter({ angle: this.azimuthAngle });
  }

  joystickAddTracker() {
    //find the closest target on the screen
    this.getClosestTarget(this.joystickX, this.joystickY);

    //check the distance on the screen
    this.updatePPI();
  }
  // calculateDistance(x1, y1, x2, y2) {
  //   return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  // }

  // // Example usage:
  // const distance = calculateDistance(3, 4, 7, 1);
  // console.log(`Distance: ${distance}`);  // Output: Distance: 5

  getClosestTarget(mouseX, mouseY) {
    let closestTarget = null;
    let minDistance = Infinity;
    const absX1 = this.joystickSign.getAbsXPx();
    const absY1 = this.joystickSign.getAbsYPx();
    this.clearAllTargetsTracking();  // Clear tracking state for all targets

    // console.log(`Mouse Click - X: ${mouseX}, Y: ${mouseY}`); // Log mouse click position

    this.testTargets.forEach((target) => {
      // const { x, y } = target.getCurrentCoordinates();  // Get target's current coordinates
      const absX2 = target.getAbsXPx();
      const absY2 = target.getAbsYPx();
      // console.log(`Target: ${target.name}, X: ${x}, Y: ${y}`); // Log target position
      // Calculate the Euclidean distance
      const distance = Math.sqrt(Math.pow(absX1 - absX2, 2) + Math.pow(absY1 - absY2, 2));
      // console.log(`Distance to ${target.name}: ${distance}`); // Log calculated distance

      if (distance < minDistance) {
        minDistance = distance;
        closestTarget = target;
      }
    });

    if (closestTarget) {
      if (minDistance < 10) {
        closestTarget.setTracked(true);  // Set the closest target as tracked

        console.log(
          `Target to track: ${closestTarget.name}, Distance: ${minDistance.toFixed(2)}, X: ${closestTarget.x}, Y: ${closestTarget.y}`
        );
      }

    } else {
      console.warn('No targets found.');
    }

    return closestTarget;
  }




  getTargetPixelCoordinates(target) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const pixelsPerKm = this.maxRadiusForRings / this.currentSpanInKm;

    const xPx = centerX + (target.y * pixelsPerKm);  // y → horizontal
    const yPx = centerY - (target.x * pixelsPerKm);  // x → vertical (inverted)

    return { x: xPx, y: yPx };
  }

  clearAllTargetsTracking() {
    this.testTargets.forEach((target) => { target.setTracked(false) })
  }

  isJoystickInBounds(x, y) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    if (dist < this.maxRadius)
      return true;
    return false;
  }

  startIntervalPPIUpdate() {
    setInterval(() => {
      this.updatePPI();
    }, this.updateInterval);
    // setTimeout(() => {
    //   this.updatePPI();
    // }, this.updateInterval);
  }

  updatePPI() {
    this.clearCanvas();
    this.drawLineFromCenter({ angle: this.azimuthAngle });
    this.drawCirclesUpToSpan(this.maxRadiusForRings);
    // this.drawPlus({ x: 75, y: 75, size: 10, lineWidth: 1 });
    // this.drawPlus({ x: 75, y: 0, size: 10, lineWidth: 1 });
    this.drawPlus({ x: this.joystickX, y: this.joystickY, size: 20, lineWidth: 1 });
    // this.drawSquareBrackets({ x: 0, y: 0 });
    // this.drawSquareBrackets({      x: 30, y: -20, color: 'black', bracketHeight: 40, gap: 15    });
    this.updateTargets();
    this.updateTimeDisplay();
  }

  drawSquareBrackets({
    x = 0,  // X-offset from the canvas center
    y = 0,  // Y-offset from the canvas center
    bracketHeight = 20,  // Height of each bracket
    bracketWidth = 5,  // Width of the bracket arms
    gap = 10,  // Gap between the brackets (inside spacing)
    color = this.color,
    lineWidth = 1  // Thickness of the bracket lines
  } = {}) {
    if (!this.ctx) {
      console.error('Canvas context not found. Cannot draw square brackets.');
      return;
    }

    const scale = .6;
    bracketHeight = bracketHeight * scale;
    bracketWidth = bracketWidth * scale;
    gap = gap * scale;

    // Calculate the absolute center coordinates
    const centerX = this.canvas.width / 2 + x;
    const centerY = this.canvas.height / 2 + y;

    this.ctx.save();  // Save the current context state
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;

    // Left bracket
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - gap / 2, centerY - bracketHeight / 2);  // Top arm
    this.ctx.lineTo(centerX - gap / 2 - bracketWidth, centerY - bracketHeight / 2);
    this.ctx.lineTo(centerX - gap / 2 - bracketWidth, centerY + bracketHeight / 2);  // Vertical arm
    this.ctx.lineTo(centerX - gap / 2, centerY + bracketHeight / 2);  // Bottom arm
    this.ctx.stroke();

    // Right bracket
    this.ctx.beginPath();
    this.ctx.moveTo(centerX + gap / 2, centerY - bracketHeight / 2);  // Top arm
    this.ctx.lineTo(centerX + gap / 2 + bracketWidth, centerY - bracketHeight / 2);
    this.ctx.lineTo(centerX + gap / 2 + bracketWidth, centerY + bracketHeight / 2);  // Vertical arm
    this.ctx.lineTo(centerX + gap / 2, centerY + bracketHeight / 2);  // Bottom arm
    this.ctx.stroke();

    this.ctx.restore();  // Restore the context to avoid affecting other drawings
  }


  drawPlus({
    x = 0,  // X-coordinate relative to the canvas center
    y = 0,  // Y-coordinate relative to the canvas center
    color = this.color,
    size = 10,  // Length of each arm of the plus
    lineWidth = 2  // Thickness of the lines
  } = {}) {
    if (!this.ctx) {
      console.error('Canvas context not found. Cannot draw the plus.');
      return;
    }

    // Calculate the absolute coordinates based on the canvas center
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const absoluteX = centerX + x;
    this.joystickSign.setAbsXPx(absoluteX);
    const absoluteY = centerY - y;
    this.joystickSign.setAbsYPx(absoluteY);
    // console.log(`joystick, absoluteX: ${absoluteX}, x: ${x}, centerX: ${centerX};;; absoluteY: ${absoluteY}, y: ${y}, centerY: ${centerY}`);

    this.ctx.save();  // Save the current context state
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;

    // Draw horizontal line of the plus
    this.ctx.beginPath();
    this.ctx.moveTo(absoluteX - size / 2, absoluteY);
    this.ctx.lineTo(absoluteX + size / 2, absoluteY);
    this.ctx.stroke();

    // Draw vertical line of the plus
    this.ctx.beginPath();
    this.ctx.moveTo(absoluteX, absoluteY - size / 2);
    this.ctx.lineTo(absoluteX, absoluteY + size / 2);
    this.ctx.stroke();

    this.ctx.restore();  // Restore the context to avoid affecting other drawings
  }


  updateTargets() {
    // this.drawSmallCircle(80, 0, this.color, 1.5); // 60 km North-East from center
    // this.drawSmallCircle(60, 60, 'blue', 3); // 60 km North-East from center
    this.trackDataLabel.updateUnits();

    this.testTargets.forEach((target) => {
      target.update();
      this.printTarget(target);
      // this.printTarget(x, y, target.isTracked());
    });

    this.scanAndFilterTargets();
  }

  scanAndFilterTargets() {
    const livingTargets = [];

    for (const target of this.testTargets) {
      if (target.isAway() && target.isOutOfRange()) {
        // console.log(`the target ${ target.name } is OFF at x = ${ target.x } km; y = ${ target.y } km; `);
        console.log(`OFF:  ${target.toString()} !!!`);

        //returning the track data labels to the default state
        if (target.isTracked()) {
          this.flipTrackLabelsDown();
        }
      } else {
        livingTargets.push(target); // Keep the target if it's still alive
        // console.log(`________${ target.toString() } `);
        // console.log(`the target ${ target.toString() } flies at x = ${ target.x } km; y = ${ target.y } km; `);
      }
    }

    /** @type {TestTarget []} */
    this.testTargets = livingTargets;
  }

  /**
  * Prints the provided target.
  * @param {TestTarget} target - The target object to be printed.
  */
  printTarget(target) {
    const { x, y } = target.getCurrentCoordinates(); // Destructuring the object
    // this.drawTarget(x, y);
    this.drawTarget(x, y, target);

    if (target.isTracked()) {
      this.flipTrackLabels(target);

      //x,y in km, the H is in meters
      let range = this.calculateRangeKm(x, y, target.getH() * 0.001);
      // range = 10;//should be 5.40 NMI
      this.trackDataLabel.updateRange(range);

      const azimuth = this.calculateAzimuth(x, y);
      this.trackDataLabel.updateAzimuth(azimuth);

      const velocity = target.getV();
      this.trackDataLabel.updateVelocity(velocity);

      const heading = target.getHeading();
      this.trackDataLabel.updateHeading(heading);

      const altitude = target.getAltitude();
      this.trackDataLabel.updateAltitude(altitude);

      // const rangeRate = target.getRangeRate();
      const rangeRateMPS = this.calculateRangeRate(velocity, azimuth, target.getHeading());
      this.trackDataLabel.updateRangeRate(rangeRateMPS);

      const elevation = this.calculateElevation(altitude, range);
      // console.log('elevation: ', elevation, ' in deg: ', unitsConverter.radiansToDegrees(elevation));

      const targetPackage2Ro = new TargetPackage2Ro({ range: range, rangeRate: rangeRateMPS, speed: velocity, azimuth: azimuth, altitude: altitude, elevation: elevation });
      // console.log('targetPackage2Ro: ', targetPackage2Ro.toString());
    }
  }

  flipTrackLabels(target) {
    if (this.hasCrossedLine(target.getAbsYPx())) {
      //to flip data label upstairs
      if (this.trackLabelsFlippedDown) {
        this.flipTrackLabelsUp();
      } else {
        //already up
      }
    } else {
      //to flip data label down
      if (this.trackLabelsFlippedDown) {
        //already down
      } else {
        this.flipTrackLabelsDown();
      }
    }
  }

  flipTrackLabelsDown() {
    this.trackLabelsFlippedDown = true;
    this.trackDataLabel.flipDown();
    this.timeAzimuth.flipDown();
  }

  flipTrackLabelsUp() {
    this.trackLabelsFlippedDown = false;
    this.trackDataLabel.flipUp();
    this.timeAzimuth.flipUp();
  }

  /**
   * Checks if the target has crossed a specified horizontal line.
   * @param {number} targetY - The Y-coordinate of the target.
   * @returns {boolean} - True if the target crosses the line, otherwise false.
   */
  hasCrossedLine(targetYabs) {
    const centerY = this.canvas.height / 2;
    const targetYrel = centerY - targetYabs;
    // console.log('hasCrossedLine: targetYrel=', targetYrel, '; this.crossLineY=', this.crossLineY);

    if (targetYrel < this.crossLineY) {
      return true;//true if below the cross line
    } else {
      return false;
    }
  }

  //meters, km; return radians
  calculateElevation(altitude, range) {
    const el = Math.atan2(altitude, range * 1000);
    return el;
  }

  calculateRangeRate(velocity, azimuth, heading) {
    const cos_ = Math.cos(heading - azimuth);
    const rr = velocity * cos_;
    return -rr;
  }

  //all in KM
  // calculateDistance(x, y, h) {
  //   return Math.sqrt(x ** 2 + y ** 2 + h ** 2);
  // }

  calculateRangeKm(x, y, h) {
    return Math.sqrt(x ** 2 + y ** 2 + h ** 2);
  }

  drawTarget(xKm, yKm, target) {
    if (this.ctx) {
      const color = this.color;
      const radius = 1.5;
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // Calculate pixels per km based on maxRadius and current span in km
      const pixelsPerKm = this.maxRadiusForRings / this.currentSpanInKm;
      // const pixelsPerKm = this.maxRadius / this.currentSpanInKm;

      // Convert km coordinates to pixel coordinates
      const xPx = centerX + (yKm * pixelsPerKm);  // +yKm → Right, -yKm → Left
      target.setAbsXPx(xPx);
      const yPx = centerY - (xKm * pixelsPerKm);  // +xKm → Up, -xKm → Down (inverted y-axis)
      target.setAbsYPx(yPx);

      if (target.isTracked()) {
        // console.log(`TT: ${target.toString()}`);
        // console.log(`TT: ${target.toString()}, xKm: ${xKm.toFixed(2)}, xPx: ${xPx.toFixed(2)},  centerX: ${centerX.toFixed(2)};;; yKm: ${yKm.toFixed(2)}, yPx: ${yPx.toFixed(2)}, centerY: ${centerY.toFixed(2)}`);
      }
      // Calculate the distance from the center in pixels and kilometers
      const distancePx = Math.sqrt(Math.pow(xPx - centerX, 2) + Math.pow(yPx - centerY, 2));
      const distanceKm = distancePx / pixelsPerKm;

      // Debugging logs to inspect the values
      // console.log('Input coordinates in km:', { xKm, yKm });
      // console.log('Current span in km:', this.currentSpanInKm);
      // console.log(`Pixels per km: ${ pixelsPerKm } `);
      // console.log(`Converted pixel coordinates: (${ xPx }, ${ yPx })`);
      // console.log(`Distance from center: ${ distancePx.toFixed(2) } px(${ distanceKm.toFixed(2) } km)`);
      // console.log(`Circle color: ${ color }, Radius: ${ radius } `);
      // console.log(`Input coord, km(xKm: ${ xKm }, yKm: ${ yKm }), Current span: ${ this.currentSpanInKm } km, Pixels per km: ${ pixelsPerKm }, Converted pixel coords: (${ xPx }, ${ yPx }), Distance from center: ${ distancePx.toFixed(2) } px(${ distanceKm.toFixed(2) } km)`);

      // Ensure the coordinates are within canvas bounds before drawing
      if (distancePx <= this.maxRadius) {
        this.drawFilledCircle(xPx, yPx, radius, color);
        if (target.isTracked()) {
          // this.drawSquareBrackets({ x: 0, y: 0 });
          this.drawSquareBrackets({ x: xPx - centerX, y: yPx - centerY });
        }
      } else {
        // console.warn('Circle position is out of canvas bounds.');
      }
      // if (xPx >= 0 && xPx <= this.canvas.width && yPx >= 0 && yPx <= this.canvas.height) {
      //   this.drawFilledCircle(xPx, yPx, radius, color);
      // } else {
      //   console.warn('Circle position is out of canvas bounds.');
      // }
    } else {
      console.error('Canvas context not found. Cannot draw the small circle.');
    }
  }

  drawSmallCircle(xKm, yKm, color = this.color, radius = 1.5) {
    if (this.ctx) {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // Calculate pixels per km based on maxRadius and current span in km
      const pixelsPerKm = this.maxRadiusForRings / this.currentSpanInKm;
      // const pixelsPerKm = this.maxRadius / this.currentSpanInKm;

      // Convert km coordinates to pixel coordinates
      const xPx = centerX + (yKm * pixelsPerKm);  // +yKm → Right, -yKm → Left
      const yPx = centerY - (xKm * pixelsPerKm);  // +xKm → Up, -xKm → Down (inverted y-axis)

      // Calculate the distance from the center in pixels and kilometers
      const distancePx = Math.sqrt(Math.pow(xPx - centerX, 2) + Math.pow(yPx - centerY, 2));
      const distanceKm = distancePx / pixelsPerKm;

      // Debugging logs to inspect the values
      // console.log('Input coordinates in km:', { xKm, yKm });
      // console.log('Current span in km:', this.currentSpanInKm);
      // console.log(`Pixels per km: ${ pixelsPerKm } `);
      // console.log(`Converted pixel coordinates: (${ xPx }, ${ yPx })`);
      // console.log(`Distance from center: ${ distancePx.toFixed(2) } px(${ distanceKm.toFixed(2) } km)`);
      // console.log(`Circle color: ${ color }, Radius: ${ radius } `);
      // console.log(`Input coord, km(xKm: ${ xKm }, yKm: ${ yKm }), Current span: ${ this.currentSpanInKm } km, Pixels per km: ${ pixelsPerKm }, Converted pixel coords: (${ xPx }, ${ yPx }), Distance from center: ${ distancePx.toFixed(2) } px(${ distanceKm.toFixed(2) } km)`);

      // Ensure the coordinates are within canvas bounds before drawing
      if (distancePx <= this.maxRadius) {
        this.drawFilledCircle(xPx, yPx, radius, color);
      } else {
        // console.warn('Circle position is out of canvas bounds.');
      }
      // if (xPx >= 0 && xPx <= this.canvas.width && yPx >= 0 && yPx <= this.canvas.height) {
      //   this.drawFilledCircle(xPx, yPx, radius, color);
      // } else {
      //   console.warn('Circle position is out of canvas bounds.');
      // }
    } else {
      console.error('Canvas context not found. Cannot draw the small circle.');
    }
  }












  drawFilledCircle(x, y, radius = 1.25, color = this.color) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill(); // Fills the circle with the specified color
    } else {
      console.error('Canvas context not found. Cannot draw the filled circle.');
    }
  }



  logAngleInDegrees(angle) {
    const angleInRadians = angle + Math.PI / 2;
    let angleInDegrees = angleInRadians * (180 / Math.PI);

    // Ensure the angle doesn't exceed 360 degrees
    angleInDegrees = angleInDegrees % 360;

    // Handle negative angles by adding 360 to bring them into the 0-360 range
    if (angleInDegrees < 0) {
      angleInDegrees += 360;
    }

    // console.log('Angle in degrees:', angleInDegrees);
    // console.log('Formatted angle:', this.formatAngleToDMS(angleInDegrees));

    // Get just degrees
    const degrees = Math.floor(angleInDegrees);
    this.drawNumberWithRectangle(degrees);
  }

  angle2justDegrees(angleInDegrees) {
    // Ensure the angle is within 0-360 degrees
    angleInDegrees = angleInDegrees % 360;
    if (angleInDegrees < 0) {
      angleInDegrees += 360;
    }

    // Get the degrees
    const degrees = Math.floor(angleInDegrees);
    return degrees;
  }

  formatAngleToDMS(angleInDegrees) {
    // Ensure the angle is within 0-360 degrees
    angleInDegrees = angleInDegrees % 360;
    if (angleInDegrees < 0) {
      angleInDegrees += 360;
    }

    // Get the degrees
    const degrees = Math.floor(angleInDegrees);

    // Get the minutes
    const decimalMinutes = (angleInDegrees - degrees) * 60;
    const minutes = Math.floor(decimalMinutes);

    // Get the seconds
    const seconds = Math.round((decimalMinutes - minutes) * 60);

    // Return formatted angle as DMS
    return `${degrees}° ${minutes} ' ${seconds}"`;
  }

  // logAngleInDegrees(angleInRadians) {
  //   const angleInDegrees = angleInRadians * (180 / Math.PI);
  //   console.log('Angle in degrees:', angleInDegrees);
  // }

  // drawNumberWithRectangle(number) {
  //   if (this.ctx) {
  //     const rectWidth = 21; // Fixed width of the rectangle
  //     const rectHeight = 11;  // Fixed height of the rectangle
  //     // const centerX = this.canvas.width / 2;
  //     const centerX = this.canvas.width / 2 - this.canvas.width / 20;
  //     const centerY = this.canvas.height * 0.9 - 5;
  //     // const centerY = this.canvas.height / 2;

  //     // Calculate the top-left corner of the rectangle
  //     const startX = centerX - rectWidth / 2;
  //     const startY = centerY - rectHeight / 2;

  //     // Set the stroke style to green for the outline
  //     this.ctx.strokeStyle = this.color;
  //     this.ctx.lineWidth = 1; // Set the outline width

  //     // Draw the outlined rectangle
  //     this.ctx.strokeRect(startX, startY, rectWidth, rectHeight);

  //     // Set font and color for the text (3-digit number)
  //     this.ctx.fillStyle = this.color; // White text color
  //     this.ctx.font = '8px Arial'; // Font size and type
  //     // this.ctx.textAlign = 'right';
  //     this.ctx.textAlign = 'center';
  //     this.ctx.textBaseline = 'middle';

  //     // Draw the number in the center of the rectangle
  //     this.ctx.fillText(number.toString(), centerX, centerY + 1);
  //     // this.ctx.fillText(number.toString() + '°', centerX, centerY);
  //     // this.ctx.fillText(number.toString().padStart(3, '0'), centerX, centerY);

  //     // console.log(`Number ${number} drawn with an outlined rectangle at (${startX}, ${startY})`);
  //   } else {
  //     console.error('Canvas context not found. Cannot draw the number and rectangle.');
  //   }
  // }
  drawNumberWithRectangle(number, xOffset = 0) {
    if (this.ctx) {
      const rectWidth = 21; // Fixed width of the rectangle
      const rectHeight = 11;  // Fixed height of the rectangle
      const centerX = this.canvas.width / 2 - this.canvas.width / 20 + xOffset;
      const centerY = this.canvas.height * 0.9 - 5;

      // Calculate the top-left corner of the rectangle
      const startX = centerX - rectWidth / 2;
      const startY = centerY - rectHeight / 2;

      // Set the stroke style for the rectangle
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 1; // Set the outline width

      // Draw the outlined rectangle
      this.ctx.strokeRect(startX, startY, rectWidth, rectHeight);

      // Set font and color for the text (2-digit number)
      this.ctx.fillStyle = this.color;
      this.ctx.font = '8px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // Draw the number inside the rectangle
      const formattedNumber = number.toString(); // Ensure 2 digits
      // const formattedNumber = number.toString().padStart(2, '0'); // Ensure 2 digits
      this.ctx.fillText(formattedNumber, centerX, centerY + 1);
    } else {
      console.error('Canvas context not found. Cannot draw the number and rectangle.');
    }
  }

  drawTimeInSingleRectangle(hours, minutes, seconds) {
    if (this.ctx) {
      const rectWidth = 14 * 3;  // Adjust the width for two-digit fields (hours, minutes, seconds)
      const rectHeight = 11;     // Same height as in drawNumberWithRectangle
      const centerX = this.canvas.width / 2 + 12;
      const centerY = this.canvas.height * 0.9 - 5;

      // Calculate the top-left corner of the rectangle
      const startX = centerX - rectWidth / 2;
      const startY = centerY - rectHeight / 2;

      // Draw the outer rectangle
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 1; // Set the outline width
      this.ctx.strokeRect(startX, startY, rectWidth, rectHeight);

      // Draw vertical lines to separate hours, minutes, and seconds
      const sectionWidth = rectWidth / 3;
      const line1X = startX + sectionWidth;
      const line2X = startX + 2 * sectionWidth;

      // Draw the vertical lines
      this.ctx.beginPath();
      // this.ctx.moveTo(line1X, startY);  // First vertical line
      this.ctx.lineTo(line1X, startY + rectHeight);
      // this.ctx.moveTo(line2X, startY);  // Second vertical line
      this.ctx.lineTo(line2X, startY + rectHeight);
      this.ctx.stroke();

      // Set the font and text alignment using the same style as 'drawNumberWithRectangle'
      this.ctx.fillStyle = this.color;
      this.ctx.font = '8px Arial';  // Same font size
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // Draw hours, minutes, and seconds inside the rectangle
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      // Place the numbers in their respective sections
      this.ctx.fillText(formattedHours, startX + sectionWidth / 2, centerY + 1);
      this.ctx.fillText(formattedMinutes, startX + sectionWidth + sectionWidth / 2, centerY + 1);
      this.ctx.fillText(formattedSeconds, startX + 2 * sectionWidth + sectionWidth / 2, centerY + 1);
    } else {
      console.error('Canvas context not found. Cannot draw the time rectangle.');
    }
  }

  drawCirclesUpToSpan(drawingAreaRadiusPx, currentSpanInKm = this.currentSpanInKm,) {
    const kmStep = 20; // Step size in kilometers

    // Calculate pixels per km based on the current span, 
    const pixelsPerKm = drawingAreaRadiusPx / currentSpanInKm;

    // Loop through each 20 km step and draw a circle, up to the current span in km
    for (let kmValue = kmStep; kmValue <= currentSpanInKm; kmValue += kmStep) {
      const radiusInPx = kmValue * pixelsPerKm; // Convert km to pixel radius based on current span

      // Call the drawCircleFromCenter method to draw the circle
      this.drawCircleFromCenter({
        radius: radiusInPx,
        color: this.color,  // Default color is 'this.color' from the class
        lineWidth: 1,  // Customize line width as needed
      });
    }
  }

  // drawCirclesUpToSpan(currentSpanInKm, drawingAreaRadiusPx) {
  //   const kmStep = 20; // Step size in kilometers

  //   // Calculate pixels per km based on the current span, not the maximum 120 km
  //   const pixelsPerKm = drawingAreaRadiusPx / currentSpanInKm;

  //   // Loop through each 20 km step and draw a circle, up to the current span in km
  //   for (let kmValue = kmStep; kmValue <= currentSpanInKm; kmValue += kmStep) {
  //     const radiusInPx = kmValue * pixelsPerKm; // Convert km to pixel radius based on current span

  //     // Call the drawCircleFromCenter method to draw the circle
  //     this.drawCircleFromCenter({
  //       radius: radiusInPx,
  //       color: 'blue', // Customize color as needed
  //       lineWidth: 2,  // Customize line width as needed
  //     });
  //   }
  // }

  // drawCirclesUpToSpan(currentSpanInKm, drawingAreaRadiusPx) {
  //   const maxKm = 120; // Maximum range in km for scaling
  //   const kmStep = 20; // Step size in kilometers
  //   const pixelsPerKm = drawingAreaRadiusPx / maxKm; // Conversion factor: pixels per km

  //   // Loop through each 20 km step and draw a circle, up to the current span in km
  //   for (let kmValue = kmStep; kmValue <= currentSpanInKm; kmValue += kmStep) {
  //     const radiusInPx = kmValue * pixelsPerKm; // Convert km to pixel radius

  //     // Call the drawCircleFromCenter method to draw the circle
  //     this.drawCircleFromCenter({
  //       radius: radiusInPx,
  //       color: this.color, // Customize color as needed
  //       lineWidth: 1,  // Customize line width as needed
  //     });
  //   }
  // }

  drawConcentricCirclesFromKmSpans(drawingAreaRadiusPx) {
    const maxKm = 120; // Maximum range in km
    const kmStep = 20; // Step size in kilometers
    const pixelsPerKm = drawingAreaRadiusPx / maxKm; // Conversion factor: pixels per km

    // Loop through each 20 km step and draw a circle
    for (let kmValue = kmStep; kmValue <= maxKm; kmValue += kmStep) {
      const radiusInPx = kmValue * pixelsPerKm; // Convert km to pixel radius

      // Call the drawCircleFromCenter method to draw the circle
      this.drawCircleFromCenter({
        radius: radiusInPx,
        color: 'blue', // You can customize color if needed
        lineWidth: 2,  // Customize line width if needed
      });
    }
  }

  drawCircleFromCenter({ radius = 50, color = this.color, lineWidth = this.lineWidth } = {}) {
    if (this.ctx) {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // Save the current context state
      this.ctx.save();

      // Set the line styles
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth;

      // Begin a new path and draw the circle
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.stroke();

      // Restore the context to avoid affecting other drawings
      this.ctx.restore();
    } else {
      console.error('Canvas context not found. Cannot draw the circle.');
    }
  }


  drawLineFromCenter({ color = this.color, width = this.lineWidth, blur = this.blur, angle = 0, length = this.maxRadius } = {}) {
    if (this.ctx) {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // Calculate the endpoint based on the given angle
      const newAngleRad = angle - Math.PI / 2;
      const endX = centerX + length * Math.cos(newAngleRad);
      const endY = centerY + length * Math.sin(newAngleRad);

      this.logAngle(newAngleRad);
      // this.logAngleInDegrees(newAngleRad);

      // Save the current context state
      this.ctx.save();

      // Set the line styles
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;

      if (blur > 0) {
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = this.shadowColor; // Darken by 30%;
      }

      // Begin a new path and draw the line from the center to the calculated endpoint
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();

      // Restore the context to avoid affecting other drawings
      this.ctx.restore();
    } else {
      console.error('Canvas context not found. Cannot draw the line.');
    }
  }
  logAngle(angle) {
    const angleInRadians = angle + Math.PI / 2;
    const value = unitsConverter.convertAzimuth(angleInRadians);
    const rounded = Math.round(value);
    // Get just degrees
    // this.drawNumberWithRectangle(rounded);
    this.timeAzimuth.setAzimuthValue(rounded);
  }

  // Method to draw a rectangle centered on the canvas
  drawRectangleFromCenter({ color = 'blue', width = 100, height = 50 }) {
    if (this.ctx) {
      // Calculate the center point of the canvas
      const centerX = this.width / 2;
      const centerY = this.height / 2;

      // Calculate the top-left corner of the rectangle
      const startX = centerX - (width / 2);
      const startY = centerY - (height / 2);

      // Set the rectangle style
      this.ctx.fillStyle = color;

      // Draw the rectangle
      this.ctx.fillRect(startX, startY, width, height);

      console.log(`Rectangle drawn from (${startX}, ${startY}) with width ${width} and height ${height}`);
    } else {
      console.error('Canvas context not found. Cannot draw the rectangle.');
    }
  }

  // Utility method to convert RGB to HSL
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;

    l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [h, s, l];
  }

  // Utility method to convert HSL to RGB
  hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Utility method to darken an RGB color
  darkenColor(rgb, amount) {
    // Convert RGB to HSL
    let [r, g, b] = rgb;
    let [h, s, l] = this.rgbToHsl(r, g, b);

    // Reduce the lightness by the specified amount
    l = Math.max(0, l - amount);

    // Convert back to RGB
    [r, g, b] = this.hslToRgb(h, s, l);

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Utility method to parse CSS color strings (like "red", "#FF0000", etc.) to RGB
  parseColor(color) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    const computedColor = ctx.fillStyle; // will be in RGB format
    const rgbValues = computedColor.match(/\d+/g);
    return rgbValues ? rgbValues.map(Number) : [0, 0, 0];
  }

}

