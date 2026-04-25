/**
 * Class representing the drag handler for azimuth angle adjustment.
 * Extends from HorizontalDrag class.
 */
class AzimuthDrag extends HorizontalDrag {

  /**
   * Create an AzimuthDrag instance.
   * 
   * @param {BlockTOPanel} block - The block to which the azimuth angle is applied.
   */
  constructor(block) {
    // Call the parent constructor with the drag-specific configuration
    super({
      dragId: 'azimuth_drag_id',
      containerId: 'block_to_panel_id',
      block: block,
      top: 1481,
      left: 447,
      width: 280,
      height: 280,
    });

    /**
     * @type {BlockTOPanel} - Reference to the block where azimuth will be adjusted.
     */
    this.block = block;
  }

  /**
   * Set the angle and apply it to the block's azimuth.
   *
   * @param {number} angle_ - The angle in degrees to set for the block's azimuth.
   */
  setAngle(angle_) {
    // this.block.setAzimuth(angle_);
    const azimuthAngle = this.block.azimuthUpdate(angle_);
    super.setAngle(azimuthAngle);
  }
}
