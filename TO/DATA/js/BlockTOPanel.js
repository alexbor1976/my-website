/** this class represents the block with power switches */
class BlockTOPanel extends Root {
  /** @type {ControllerAdp} */
  controller = null;

  constructor(id) {
    super(id);
    this.init();
  }

  init() {
    this.initImg()
    // this.controller = new ControllerAdp('', '', this);
    // this.toModeSwitch = new ToModeSwitch();
    // this.ppi = new PPI('ppi_id', 'block_to_panel_id', 'DATA/img/ppi.png');
    this.ppi = new PPI_TO();
    this.azimuthDrag = new AzimuthDrag(this);
    this.joystick = new Joystick(this);
    this.trackDataBtn = new TrackDataBtn(this);
  }

  trackDataBtnClick(position) {
    this.ppi.trackDataBtnClick(position);
  }
  switchRange(position) {
    this.ppi.switchRange(position);
  }

  setAzimuth(angle_) {
    this.ppi.clearCanvas();
    this.ppi.drawLineFromCenter({ angle: angle_ / 100 });
  }

  azimuthUpdate(angle_) {
    return this.ppi.azimuthUpdate(angle_);
  }
  joystickUpdate(x, y) {
    this.ppi.joystickUpdate(x, y);
  }
  joystickAddTracker() {
    this.ppi.joystickAddTracker();
  }


  setPwrOn() {
    // this.controller.setPwrOn();
  }
  setPwrOff() {
    // this.controller.setPwrOff();
  }

  reset() {
    // this.controller.reset();
  }

  initImg() {
    // console.log('initImg: ', `#${this.id}`)
    $(`#${this.id}`).append('<img id="bg-img" src="DATA/img/to_panel.png" alt="to_panel bg img">');
    // $(`#${this.id}`).css('height', '1916px');
    // $(`#${this.id}`).css('width', '2785px');
    // $(`#${this.id}`).css('background-color', 'gray');
  }
}

