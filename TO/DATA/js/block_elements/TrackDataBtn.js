class TrackDataBtn extends RotateButton {
  constructor(block) {
    // Define an array of image URLs
    const imagesArray = [
      'DATA/img/track_data_btn_off.jpg',
      'DATA/img/track_data_btn_on.jpg',
    ];

    // Call the parent constructor with the parameters
    super({
      switchId: 'TrackDataBtn_id',
      containerId: 'block_to_panel_id',
      block: null,
      top: 1187,
      left: 2528,
      width: 110,
      height: 90,
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
