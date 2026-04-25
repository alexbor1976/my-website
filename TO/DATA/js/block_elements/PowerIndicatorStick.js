class PowerIndicatorStick extends RotateButton {
  constructor(block) {
    // Define an array of image URLs
    const imagesArray = [
      'DATA/img/power_indicator_stick.png',
      'DATA/img/power_indicator_stick.png',
    ];

    // Call the parent constructor with the parameters
    super({
      switchId: 'PowerIndicatorStick_id',
      containerId: 'powerBlockId',
      block: null,
      top: 301,
      left: 194,
      width: 170,
      height: 170,
      images: imagesArray,
      currentPosition: 0, // Set initial position here
    });

    /** @type {BlockTOPanel} */
    this.block = block;
    this.updateSwitch();

    // Set the onClickCallback using the setter method
    this.setOnClickCallback(this.handleSwitchChange.bind(this));
    this.startSmoothOscillatingRotation();
  }

  // Define the method to handle switch changes
  handleSwitchChange(position) {
    // console.log(`Btn TrackDataBtn is now at position ${position}`);
    // this.block.trackDataBtnClick(position);
    // Additional logic can be added here, such as updating the UI or triggering other actions
  }

  /**
 * Starts continuous rotation within a ±30-degree range in small increments.
 */
  startSmoothOscillatingRotation() {
    let angle = 0;
    let increment = 1; // Small step increment

    this.oscillationIntervalId = setInterval(() => {
      angle += increment;
      this.rotateStick(angle);

      // Reverse direction when reaching ±30 degrees
      if (angle >= 35 || angle <= -35) {
        increment = -increment;
      }
    }, 20); // Adjust interval time for smoothness (20ms for a smooth transition)
  }

  /**
   * Stops the smooth oscillating rotation.
   */
  stopSmoothOscillatingRotation() {
    if (this.oscillationIntervalId) {
      clearInterval(this.oscillationIntervalId);
      this.oscillationIntervalId = null;
    }
  }

  /**
   * Rotates the stick to a specific angle.
   * @param {number} angle The angle to set the rotation within ±30 degrees.
   */
  rotateStick(angle) {
    this.currentRotation = angle;
    const stickElement = document.getElementById(this.switchId);
    if (stickElement) {
      // Adjust the rotation center to be slightly down (e.g., center and 70% down vertically)
      stickElement.style.transformOrigin = '48.5% 79%'; // Adjust these values as needed
      stickElement.style.transform = `rotate(${this.currentRotation}deg)`;
    }
  }

}
