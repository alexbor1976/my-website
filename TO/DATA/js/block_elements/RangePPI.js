class RangePPI extends RotateButton {
  constructor(block) {
    // Define an array of image URLs
    const imagesArray = [
      // 'DATA/img/btn_range_off.jpg',
      'DATA/img/btn_range_short.jpg',
      'DATA/img/btn_range_med.jpg',
      'DATA/img/btn_range_long.jpg',
    ];

    // Call the parent constructor with the parameters
    super({
      switchId: 'RangePPI_id',
      containerId: 'block_to_state_panel_id',
      block: null,
      top: -1004,
      left: 55,
      width: 53,
      height: 43,
      images: imagesArray,
      currentPosition: 1, // Set initial position here
    });

    /** @type {BlockTOStatePanel} */
    this.block = block;
    this.updateSwitch();

    // Set the onClickCallback using the setter method
    this.setOnClickCallback(this.handleSwitchChange.bind(this));
  }

  // Define the method to handle switch changes
  handleSwitchChange(position) {
    console.log(`Switch RangePPI is now at position ${position}`);
    this.block.switchRange(position);
    // Additional logic can be added here, such as updating the UI or triggering other actions
  }
}
