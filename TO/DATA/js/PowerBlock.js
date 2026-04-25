/** this class represents the block with power switches */
class PowerBlock extends Root {
  /** @type {ControllerAdp} */
  controller = null;

  constructor(id) {
    super(id);
    this.init();
  }

  init() {
    this.applyStyles();
    this.initImg();
    this.powerLamp = new PowerLamp(this);
    this.powerTripleSwitch = new PowerTripleSwitch(this);
    this.powerSingleSwitch = new PowerSingleSwitch(this);
    this.switchSteel = new SwitchSteel(this);
    this.powerIndicator = new PowerIndicator(this);
    this.powerIndicator = new PowerIndicatorStick(this);
    this.externalPowerOn();
  }

  externalPowerOn() {
    setInterval(() => {
      this.powerLamp.lampOn();
    }, 2000); // 2000 ms interval
  }


  initImg() {
    const containerImg = $(`
      <div id="powerBlockBgImgId" style="background-color: #aac4b9; width: 1065px;height:479px;">
        <img src="DATA/img/bgPowerBlock.jpg" alt="to_panel bg img" style="display: block;">
      </div>
    `);
    const containerDrawnImg = $(`
      <div id="powerBlockBgImgId" style="background-color: #aac4b9; width: 1065px;height:479px;">
        <img src="DATA/img/powerBlockDrawnBg.jpg" alt="to_panel bg img" style="display: block;">
      </div>
    `);
    let containerBg = $(`
      <div id="powerBlockBgImgId" style="background-color: #aac4b9; width: 1065px;height:479px;">
      </div>
    `);

    // Append container to the parent div
    containerBg = containerImg;
    containerBg = containerDrawnImg;
    $(`#${this.id}`).append(containerBg);

  }

  // Apply embedded CSS styles
  applyStyles() {
    const styles = {
      position: 'relative',
      // fontSize: '88%',
      // letterSpacing: '0.16em',
      width: `1065px`,
      height: `479px`,
      'background-color': `#aac4b9`,
      // 'border-style': 'solid',
      'border-color': `${this.color}%`,
      'border-width': `1px`,
    };
    $(`#${this.id}`).css(styles);
    // $(`#${this.id} span`).css({ position: 'absolute', });
    $(`#${this.id} div`).css({ position: 'absolute', });
  }
}