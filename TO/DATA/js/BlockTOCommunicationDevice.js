/** this class represents the block with power switches */
class BlockTOCommunicationDevice extends Root {
  /** @type {ControllerAdp} */
  controller = null;

  constructor(id) {
    super(id);
    this.init();
  }

  init() {
    this.initImg()
    // this.controller = new ControllerAdp('', '', this);
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
    $(`#${this.id}`).append('<img id="bg-img" src="DATA/img/to_communication_device.jpg" alt="to_communication_device bg img">');
  }
}

