class RotateButton extends Root {
  constructor({
    switchId,
    containerId,
    block,
    top = 0,
    left = 0,
    width = 100,
    height = 100,
    images = [],
    currentPosition = 0,
  }) {
    super(switchId);
    this.switchId = switchId;
    this.containerId = containerId;
    this.block = block;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.images = images;
    this.maxPosition = images.length - 1;
    this.currentPosition = currentPosition;

    this.initSwitch();
  }

  // Method to set the onClick callback
  setOnClickCallback(callback) {
    if (typeof callback === 'function') {
      this.onClickCallback = callback;
    } else {
      console.error('onClickCallback must be a function');
    }
  }

  // Initialize the switch and append it to the container
  initSwitch() {
    // Create the switch element and append it to the container
    const $switchElement = $('<div>', { id: this.switchId, class: 'multi_switch' });
    $(`#${this.containerId}`).append($switchElement);

    // Apply embedded CSS styling
    this.applyStyles();

    // Update the switch background
    this.updateSwitch();

    // Bind mouse events for right-click (forward) and left-click (backward)
    $(`#${this.switchId}`).on('mousedown', (event) => {
      event.preventDefault(); // Prevent default context menu on right-click

      const previousPosition = this.currentPosition;
      if (event.which === 1) { // Left-click (backward)
        this.goForward();
      }
      // else if (event.which === 3) { // Right-click (forward)
      //   this.goForward();
      // }

      // Trigger the onClickCallback if the position changes
      if (this.currentPosition !== previousPosition && typeof this.onClickCallback === 'function') {
        this.onClickCallback(this.currentPosition);
      }
    });

    // Disable the context menu for the switch element (optional)
    $(`#${this.switchId}`).on('contextmenu', (event) => {
      event.preventDefault(); // Disable right-click context menu
    });
  }

  // Apply embedded CSS styles
  applyStyles() {
    const styles = {
      position: 'absolute',
      top: `${this.top}px`,
      left: `${this.left}px`,
      width: `${this.width}px`,
      height: `${this.height}px`,
      'background-size': '100% 100%', // Stretch the image to fill the container
      'background-repeat': 'no-repeat', // Prevents duplication
      'background-position': 'center', // Centers the image
      cursor: 'pointer',
    };
    $(`#${this.switchId}`).css(styles);
  }

  getCurrentPosition() {
    return this.currentPosition;
  }

  // Advance to the next image
  goForward() {
    if (this.currentPosition < this.maxPosition) {
      this.currentPosition++;
    } else {
      this.currentPosition = 0;
    }
    this.updateSwitch();
  }

  // Go back to the previous image
  goBackward() {
    if (this.currentPosition > 0) {
      this.currentPosition--;
    } else {
      this.playBeep(); // Play beep when reaching the first image
    }
    this.updateSwitch();
  }

  // Update the switch background based on the current position
  updateSwitch() {
    const imageUrl = this.images[this.currentPosition];
    $(`#${this.switchId}`).css('background-image', `url(${imageUrl})`);

    if (this.isPwr()) {
      this.updateController();
    }
  }

  updateController() {
    this.block.controller.updateMode();
  }

  // Play a beep sound when reaching a limit
  playBeep() {
    return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1); // Beep duration (0.1 seconds)
  }

  setPwrOn() {
    super.setPwrOn();
    this.updateSwitch();
  }
}
