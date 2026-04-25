class PPITimeAzimuth extends Root {
  constructor({
    containerId,
    cssId = 'PPITimeAzimuth_id',
  } = {}) {
    super(cssId, containerId);
    this.cssId = cssId;
    this.containerId = containerId;
    this.height = 1.5;//%
    // this.top = 11;//%
    // this.top = 88;//%
    this.left = 44.5;//%
    this.width = 11;
    this.color = '#ceffec';
    this.lineWidth = 1;
    this.zIndex = 100;

    this.init();
    this.flipDown();
  }

  show(state) {
    if (state) {
      $(`#${this.cssId}`).fadeIn(200);  // Make visible
    } else {
      $(`#${this.cssId}`).fadeOut(200);  // Make invisible
    }
  }

  flipUp() {
    if (this.state) {
      $(`#${this.cssId}`).fadeOut(200, () => {
        this.flipUp_();
        $(`#${this.cssId}`).fadeIn(200);  // Make visible
      });
    } else {
      //is invisible
      this.flipUp_();
    }
  }

  flipDown() {
    if (this.state) {
      $(`#${this.cssId}`).fadeOut(200, () => {
        this.flipDown_();
        $(`#${this.cssId}`).fadeIn(200);  // Make visible
      });
    } else {
      //is invisible
      this.flipDown_();
    }
  }

  flipUp_() {
    $(`#${this.cssId}`).css('top', '11%');
  }

  flipDown_() {
    $(`#${this.cssId}`).css('top', '88%');
  }


  updateTime(hours, minutes, seconds) {
    // Draw hours, minutes, and seconds inside the rectangle
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    const time = formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
    this.setTimeValue(time);
  }

  setTimeValue(time) {
    if (time === null) {
      $('#PPITimeAzimuth_time_value').text(``);
    } else {
      // const text = value.toFixed(0);
      $('#PPITimeAzimuth_time_value').text(`${time}`);
    }
  }

  setAzimuthValue(azimuth) {
    if (azimuth === null) {
      $('#PPITimeAzimuth_azimuth_value').text(``);
    } else {
      // const text = value.toFixed(0);
      $('#PPITimeAzimuth_azimuth_value').text(`${azimuth}`);
    }
  }

  // Initialize the PPI and append it to the container
  init() {
    if (!this.containerId) {
      console.error("Container ID is undefined.", this.containerId);
      return;
    }

    const $container = $(`#${this.containerId}`);
    if ($container.length === 0) {
      console.error(`Container with id '${this.containerId}' not found.`);
      return;
    }

    // const $ppiElement = $('<div>', { id: this.cssId, class: 'ppi_caption' });
    const $ppiElement = $(`
      <div id=${this.cssId} class='ppi_caption'>
        <div class='w-100 h-100' style='background-color:rgb(0 0 0 / 0%);'> </div>

        <div class="h-100" style='width:29%;border-style:solid;border-width:1px;left:0%;top:0%;'>
          <div id="PPITimeAzimuth_azimuth_value" class="h-100 w-100 d-flex justify-content-center align-items-center" > 
          XXXX
          </div>
        </div>

        <div class="h-100" style='width:48%;border-style:solid;border-width:1px;right:0%;top:0%;'>
          <div id="PPITimeAzimuth_time_value" class="h-100 w-100 d-flex justify-content-center align-items-center" > 
          XXxXXxXX
          </div>
        </div>
      </div>
      `);
    $container.append($ppiElement);
    this.applyStyles();
    this.show(true);
    this.setAzimuthValue(null);
  }


  // Apply embedded CSS styles
  applyStyles() {
    const styles = {
      display: 'none',
      position: 'absolute',
      fontSize: '88%',
      letterSpacing: '0.16em',
      color: `${this.color}%`,
      top: `${this.top}%`,
      left: `${this.left}%`,
      width: `${this.width}%`,
      height: `${this.height}%`,
      // 'border-style': 'solid',
      'border-color': `${this.color}%`,
      'border-width': `1px`,
    };
    $(`#${this.cssId}`).css(styles);
    $(`#${this.cssId} span`).css({ position: 'absolute', });
    $(`#${this.cssId} div`).css({ position: 'absolute', });
  }

}
