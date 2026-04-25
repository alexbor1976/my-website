class ZoomPan {
  constructor($container, $content, initialScale = 1) {
    this.$container = $container;
    this.$content = $content;
    this.scale = initialScale;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;

    this.init();
    this.applyTransform();  // Apply the initial transform with centered panX
  }

  init() {
    // Bind mouse wheel to zoom
    this.$container.on('wheel', (e) => this.handleZoom(e));

    // Bind mouse down, move, and up for panning
    this.$container.on('mousedown', (e) => this.handleMouseDown(e));
    $(document).on('mousemove', (e) => this.handleMouseMove(e));
    $(document).on('mouseup', (e) => this.handleMouseUp(e));
  }

  handleMouseDown(event) {
    event.preventDefault();

    // Only allow dragging if the middle mouse button is pressed (event.which === 2)
    if (event.which === 2) {
      this.isDragging = true;
      this.startX = event.clientX - this.panX;
      this.startY = event.clientY - this.panY;
    }
  }

  handleMouseMove(event) {
    // Only move if dragging is active (started with middle mouse button)
    if (!this.isDragging) return;

    // Calculate new pan position
    this.panX = event.clientX - this.startX;
    this.panY = event.clientY - this.startY;

    this.applyTransform();  // Apply the updated transform
  }

  handleMouseUp(event) {
    // Stop dragging when the mouse button is released
    if (this.isDragging) {
      this.isDragging = false;
    }
  }

  handleZoom(event) {
    event.preventDefault();

    const zoomFactor = 0.1;
    const delta = event.originalEvent.deltaY > 0 ? -zoomFactor : zoomFactor;

    // Get the mouse position relative to the container
    const rect = this.$container[0].getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the scale change
    const oldScale = this.scale;
    this.scale += delta;
    this.scale = Math.min(Math.max(0.05, this.scale), 3); // Limit the zoom range

    // Calculate the scaling factor
    const scaleDiff = this.scale / oldScale;

    // Adjust the panX and panY to zoom around the mouse pointer
    this.panX = mouseX - scaleDiff * (mouseX - this.panX);
    this.panY = mouseY - scaleDiff * (mouseY - this.panY);

    this.applyTransform();  // Apply the updated transform
  }

  applyTransform() {
    // Apply pan and zoom transformation
    this.$content.css('transform', `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`);
  }
}
