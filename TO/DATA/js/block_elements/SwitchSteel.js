class SwitchSteel extends RotateButton {
  constructor(block) {
    // Define an array of image URLs
    const imagesArray = [
      'DATA/img/switch_steel_down.png',
      'DATA/img/switch_steel_top.png',
    ];

    // Call the parent constructor with the parameters
    super({
      switchId: 'SwitchSteel_id',
      containerId: 'powerBlockId',
      block: null,
      top: 80,
      left: 450,
      width: 43,
      height: 62,
      images: imagesArray,
      currentPosition: 0, // Set initial position here
    });

    /** @type {BlockTOPanel} */
    this.block = block;
    this.updateSwitch();

    // Set the onClickCallback using the setter method
    this.setOnClickCallback(this.handleSwitchChange.bind(this));
  }

  // Define the method to handle switch changes
  handleSwitchChange(position) {
    // console.log(`Btn TrackDataBtn is now at position ${position}`);
    this.block.trackDataBtnClick(position);
    // Additional logic can be added here, such as updating the UI or triggering other actions
  }
}
