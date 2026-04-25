class ArmSafeTest extends MultiSwitch {
  constructor() {
    // Define an array of image URLs
    const imagesArray = [
      'DATA/img/0_left.png',
      'DATA/img/1_middle.png',
      'DATA/img/2_right.png',
    ];

    // Call the parent constructor with the parameters
    super({
      switchId: 'multi_switch_id',
      containerId: 'block_to_state_panel_id',
      block: null,
      top: 235,
      left: 524,
      width: 60,
      height: 54,
      images: imagesArray,
      currentPosition: 1, // Set initial position here
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
