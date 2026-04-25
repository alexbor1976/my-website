class PowerLamp extends RotateButton {
  constructor(block) {
    // Define an array of image URLs
    const imagesArray = [
      'DATA/img/power_lamp_off.png',
      'DATA/img/power_lamp_on.png',
    ];

    // Call the parent constructor with the parameters
    super({
      switchId: 'PowerLamp_id',
      containerId: 'powerBlockId',
      block: null,
      top: 289,
      left: 47,
      width: 74,
      height: 74,
      images: imagesArray,
      currentPosition: 0, // Set initial position here
    });

    /** @type {BlockTOPanel} */
    this.block = block;
    this.updateSwitch();

    this.lampOff();
    // Set the onClickCallback using the setter method
    // this.setOnClickCallback(this.handleSwitchChange.bind(this));
  }

  lampOn() {
    this.currentPosition = 1;
    this.updateSwitch();
  }

  lampOff() {
    this.currentPosition = 0;
    this.updateSwitch();
  }
  // Define the method to handle switch changes
  // handleSwitchChange(position) {
  //   // console.log(`Btn TrackDataBtn is now at position ${position}`);
  //   this.block.trackDataBtnClick(position);
  //   // Additional logic can be added here, such as updating the UI or triggering other actions
  // }
}
