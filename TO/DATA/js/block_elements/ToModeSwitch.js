class ToModeSwitch extends MultiSwitch {
  constructor() {
    // Define an array of image URLs
    const imagesArray = [
      'DATA/img/to_mode_1.png',
      'DATA/img/to_mode_2.png',
      'DATA/img/to_mode_3.png',
      'DATA/img/to_mode_4.png',
    ];

    // Call the parent constructor with the parameters
    super({
      switchId: 'ToModeSwitch_id',
      containerId: 'block_to_panel_id',
      block: null,
      top: 1088,
      left: 1216,
      width: 71,
      height: 77,
      images: imagesArray,
      currentPosition: 2, // Set initial position here
    });

    this.updateSwitch();

    // Set the onClickCallback using the setter method
    this.setOnClickCallback(this.handleSwitchChange.bind(this));
  }

  // Define the method to handle switch changes
  handleSwitchChange(position) {
    console.log(`Switch is now at position ${position}`);
    // Additional logic can be added here, such as updating the UI or triggering other actions
  }
}
