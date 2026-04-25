class Drag extends Root {
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
    this.startY = 0; // Store initial mouse X position
    this.prevDeltaY = 0; // Track previous delta for comparison

    this.initDrag();
  }

  // Initialize the drag element and append it to the container
  initDrag() {
    const $dragElement = $('<div>', { id: this.dragId, class: 'basic_drag' });
    $(`#${this.containerId}`).append($dragElement);

    this.applyStyles();

    // Mouse down event to start dragging
    $(`#${this.dragId}`).on('mousedown', (event) => {
      if (event.which === 1) { // Left mouse button
        event.preventDefault();
        this.isDragging = true;
        this.startX = event.pageX; // Initial X coordinate
        this.prevDeltaX = 0; // Reset previous delta when starting to drag
        this.startY = event.pageY; // Initial X coordinate
        this.prevDeltaY = 0; // Reset previous delta when starting to drag
      }
    });

    // Mouse move event to log the difference between deltas
    $(document).on('mousemove', (event) => {
      if (this.isDragging) {
        const currentDeltaX = event.pageX - this.startX;
        const currentDeltaY = event.pageY - this.startY;
        const deltaDifferenceX = currentDeltaX - this.prevDeltaX; // Calculate the difference with the previous delta
        const deltaDifferenceY = currentDeltaY - this.prevDeltaY; // Calculate the difference with the previous delta
        this.addDelta(deltaDifferenceX, deltaDifferenceY);
        this.prevDeltaX = currentDeltaX; // Update previous delta for the next movement
        this.prevDeltaY = currentDeltaY; // Update previous delta for the next movement
      }
    });

    // Mouse up event to stop dragging
    $(document).on('mouseup', () => {
      if (event.which === 1) { // Left mouse button released
        this.isDragging = false; // Stop dragging when mouse is released
      }
    });

    $(document).on('contextmenu', (event) => {
      if (this.isDragging) { // If left mouse button is still down
        event.preventDefault(); // Prevent the default context menu
        this.reactToRightClick(); // Call custom reaction function
      }
    });
    // $(`#${this.dragId}`).on('contextmenu', (event) => {
    //   if (this.isDragging) { // If left mouse button is still down
    //     event.preventDefault(); // Prevent the default context menu
    //     this.reactToRightClick(); // Call custom reaction function
    //   }
    // });
  }

  reactToRightClick() {
    // console.log('Right-click detected while dragging!');
    // this.beep();
    this.addTracker();
    // Add your custom logic here
  }

  beep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1); // Beep for 100ms
  }

  // setAngle(deltaDifference) {
  //   // console.log('Delta difference:', deltaDifference);
  // }
  addDelta(x, y) {
    // console.log('addDelta:', x, y);
  }
  addTracker() {
    // console.log('addTracker:', x, y);
  }

  // Apply embedded CSS styles (gray background)
  applyStyles() {
    const styles = {
      position: 'absolute',
      top: `${this.top}px`,
      left: `${this.left}px`,
      width: `${this.width}px`,
      height: `${this.height}px`,
      'background-color': 'rgba(0, 128, 0, 0)', // Gray background instead of image
      cursor: 'pointer',
    };
    $(`#${this.dragId}`).css(styles);
  }
}
