/**
 * Class representing the drag handler for azimuth angle adjustment.
 * Extends from HorizontalDrag class.
 */
class Joystick extends Drag {

  /**
   * Create an AzimuthDrag instance.
   * 
   * @param {BlockTOPanel} block - The block to which the azimuth angle is applied.
   */
  constructor(block) {
    // Call the parent constructor with the drag-specific configuration
    super({
      dragId: 'joystick_drag_id',
      containerId: 'block_to_panel_id',
      block: block,
      top: 1442,
      left: 2251,
      width: 222,
      height: 223,
    });

    /**
     * @type {BlockTOPanel} - Reference to the block where azimuth will be adjusted.
     */
    this.block = block;
  }


  // setAngle(angle_) {
  //   super.setAngle(angle_);
  //   // this.block.setAzimuth(angle_);
  //   this.block.azimuthUpdate(angle_);
  // }
  addDelta(x, y) {
    super.addDelta(x, y);
    // this.block.setAzimuth(angle_);
    this.block.joystickUpdate(x, y);
  }

  addTracker() {
    super.addTracker();
    // this.block.setAzimuth(angle_);
    this.block.joystickAddTracker();
  }

}
