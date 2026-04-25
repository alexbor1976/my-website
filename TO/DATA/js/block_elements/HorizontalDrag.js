class HorizontalDrag extends Root {
  constructor({
    dragId,
    containerId,
    block,
    top = 0,
    left = 0,
    width = 100,
    height = 100,
  }) {
    super(dragId);
    this.dragId = dragId;
    this.containerId = containerId;

    /**
     * @type {BlockTOPanel} - Reference to the block where azimuth will be adjusted.
     */
    this.block = block;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.isDragging = false; // Track if dragging
    this.startX = 0; // Store initial mouse X position
    this.prevDeltaX = 0; // Track previous delta for comparison

    this.initDrag();
  }

  // Initialize the drag element and append it to the container
  initDrag() {
    const $bgElement = $('<div>', { id: 'azimuth_stick' });
    const $dragElement = $('<div>', { id: this.dragId, class: 'basic_drag' });
    $(`#${this.containerId}`).append($bgElement);  // Add background first
    $(`#${this.containerId}`).append($dragElement);

    this.applyStyles();

    // Mouse down event to start dragging
    $(`#${this.dragId}`).on('mousedown', (event) => {
      event.preventDefault();
      this.isDragging = true;
      this.startX = event.pageX; // Initial X coordinate
      this.prevDeltaX = 0; // Reset previous delta when starting to drag
    });

    // Mouse move event to log the difference between deltas
    $(document).on('mousemove', (event) => {
      if (this.isDragging) {
        const currentDeltaX = event.pageX - this.startX;
        const deltaDifference = currentDeltaX - this.prevDeltaX; // Calculate the difference with the previous delta
        this.setAngle(deltaDifference);
        this.prevDeltaX = currentDeltaX; // Update previous delta for the next movement
      }
    });

    // Mouse up event to stop dragging
    $(document).on('mouseup', () => {
      this.isDragging = false; // Stop dragging when mouse is released
    });
  }

  //radians
  setAngle(azimuthAngle) {
    let degrees = azimuthAngle * (180 / Math.PI); // Convert radians to degrees
    degrees = degrees * (180 / 22);
    $('#azimuth_stick').css({
      transform: `rotate(${degrees}deg)`,
    });
    // console.log('azimuthAngle:', degrees);
  }


  // Apply embedded CSS styles (gray background)
  applyStyles() {
    const bgStyles = {
      position: 'absolute',
      top: `${this.top}px`,
      left: `${this.left}px`,
      width: `${this.width}px`,
      height: `${this.height}px`,
      'background-image': 'url("DATA/img/azimuth_stick.png")',
      'background-size': 'cover',
      'transform-origin': 'center center',
      // 'z-index': 0, // Ensure it's behind
    };

    const dragStyles = {
      position: 'absolute',
      top: `${this.top}px`,
      left: `${this.left}px`,
      width: `${this.width}px`,
      height: `${this.height}px`,
      'background-color': 'rgba(0, 128, 0, 0)', // Transparent background
      cursor: 'pointer',
      // 'z-index': 1, // Ensure it's on top
    };

    // Apply styles
    $('#azimuth_stick').css(bgStyles);
    $(`#${this.dragId}`).css(dragStyles);
  }
}
