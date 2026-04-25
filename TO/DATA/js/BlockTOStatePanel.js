/** this class represents the block with power switches */
class BlockTOStatePanel extends Root {
  /** @type {ControllerAdp} */
  controller = null;

  constructor(id, block) {
    super(id);
    this.block = block;
    this.init();
  }

  init() {
    this.initImg()
    // this.controller = new ControllerAdp('', '', this);
    // this.armSafeTest = new ArmSafeTest();
    this.rangePPI = new RangePPI(this);
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

  switchRange(position) {
    this.block.switchRange(position);
  }

  initImg() {
    // console.log('initImg: ', `#${this.id}`)
    // $(`#${this.id}`).append('<img id="bg-img" src="DATA/img/to_state_panel.jpg" alt="to_state_panel bg img">');
    $(`#${this.id}`).css('min-height', '1px');
    $(`#${this.id}`).css('min-width', '1px');
  }
}

