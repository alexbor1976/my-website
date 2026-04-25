class TrackDataLabel extends Root {
  constructor({
    containerId,
    cssId = 'track_data_label_id',
  } = {}) {
    super(cssId, containerId);
    this.cssId = cssId;
    this.containerId = containerId;
    this.baseImage = 'DATA/img/track_data_screen.png';
    this.width = 90;//%
    this.height = 11;//%

    // this.top = 20.5;//%
    // this.top = 72.5;//%
    // this.top = 20.5;//%

    this.left = 29;//%
    // this.right = 100 - 14;//%
    this.width = 42.5;
    // this.minWidth = 42.5;
    // this. = 200;
    this.color = '#ceffec';
    this.lineWidth = 1;
    this.zIndex = 100;
    this.state = false; //invisible

    this.init();
    this.flipDown();
    this.updateUnits();
  }

  show(state) {
    this.state = state;
    if (this.state) {
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
    $(`#${this.cssId}`).css('top', '20.5%');
  }

  flipDown_() {
    $(`#${this.cssId}`).css('top', '72.5%');
  }

  updateAzimuth(azimuth) {
    const value = unitsConverter.convertAzimuth(azimuth);
    this.setAzimuthValue(value);

    // $('#TrackDataLabel_MILS_value').text(`${text}`);
    // console.log($('#TrackDataLabel_MILS_value').text()); // Should print 'MILS'
  }

  updateRange(range) {
    const value = unitsConverter.convertRange(range);
    this.setRangeValue(value);
  }

  updateVelocity(velocity) {
    const value = unitsConverter.convertVelocity(velocity);
    this.setVelocityValue(value);
    // const value = unitsConverter.convertAzimuth(azimuth);
    // this.setDistanceValue(distance);

    // $('#TrackDataLabel_MILS_value').text(`${text}`);
    // console.log($('#TrackDataLabel_MILS_value').text()); // Should print 'MILS'
  }

  updateRangeRate(rangeRate) {
    const value = unitsConverter.convertRangeRate(rangeRate);
    this.setRangeRateValue(value);
    // const value = unitsConverter.convertAzimuth(azimuth);
    // this.setDistanceValue(distance);

    // $('#TrackDataLabel_MILS_value').text(`${text}`);
    // console.log($('#TrackDataLabel_MILS_value').text()); // Should print 'MILS'
  }

  updateHeading(heading) {
    const value = unitsConverter.convertHeading(heading);
    this.setHeadingValue(value);
    // const value = unitsConverter.convertAzimuth(azimuth);
    // this.setDistanceValue(distance);

    // $('#TrackDataLabel_MILS_value').text(`${text}`);
    // console.log($('#TrackDataLabel_MILS_value').text()); // Should print 'MILS'
  }
  updateAltitude(altitude) {
    const value = unitsConverter.convertAltitude(altitude);
    this.setAltitudeValue(value);
    // const value = unitsConverter.convertAzimuth(azimuth);
    // this.setDistanceValue(distance);

    // $('#TrackDataLabel_MILS_value').text(`${text}`);
    // console.log($('#TrackDataLabel_MILS_value').text()); // Should print 'MILS'
  }

  updateUnits() {
    this.setAzimuthUnits();
    this.setRangeUnits();
    this.setRangeRateUnits();
    this.setHeadingUnits();
    this.setVelocityUnits();
    this.setAltitudeUnits();

    this.setAzimuthValue(null);
    this.setRangeValue(null);
    this.setVelocityValue(null);
    this.setRangeRateValue(null);
    this.setHeadingValue(null);
    this.setAltitudeValue(null);
    // $('#TrackDataLabel_MILS_units').text(`${units}`);
    // console.log($('#TrackDataLabel_MILS_units').text()); // Should print 'MILS'
  }

  setAzimuthUnits() {
    let units = '';
    if (AZIMUTH_UNITS === 'DEGREES') {
      // DEGREES
      units = 'DEG'
    } else {
      //MILS
      units = 'MILS'
    }

    $('#TrackDataLabel_MILS_units').text(`${units}`);
  }

  setVelocityUnits() {
    let units = '';
    if (VELOCITY_UNITS === 'KNOTS') {
      units = 'KNOTS'
    } else {
      units = 'MPS'
    }

    $('#TrackDataLabel_SPEED_units').text(`${units}`);
  }

  setAltitudeUnits() {
    let units = '';
    if (ALTITUDE_UNITS === 'KILOFEET') {
      units = 'KFT'
    } else {
      units = 'KM'
    }

    $('#TrackDataLabel_ALT_units').text(`${units}`);
  }

  setHeadingUnits() {
    let units = '';
    if (AZIMUTH_UNITS === 'DEGREES') {
      // DEGREES
      units = 'DEG'
    } else {
      //MILS
      units = 'MILS'
    }

    $('#TrackDataLabel_Heading_units').text(`${units}`);
  }

  setRangeUnits() {
    let units = '';
    if (RANGE_UNITS === 'KM') {
      units = 'KM'
    } else {
      units = 'NMI'
    }
    $('#TrackDataLabel_RANGE_units').text(`${units}`);
  }

  setRangeRateUnits() {
    let units = '';
    if (VELOCITY_UNITS === 'MPS') {
      units = 'MPS'
    } else {
      units = 'KNOTS'
    }
    $('#TrackDataLabel_RangeRate_units').text(`${units}`);
  }

  setAzimuthValue(value) {
    if (value === null) {
      $('#TrackDataLabel_MILS_value').text(``);
    } else {
      const text = Math.round(value);
      $('#TrackDataLabel_MILS_value').text(`${text}`);
    }
  }

  setRangeValue(value) {

    if (value === null) {
      $('#TrackDataLabel_RANGE_value').text(``);
    } else {
      const text = Math.round(value);
      // $('#TrackDataLabel_RANGE_value').text(`${'xxx'}`);
      $('#TrackDataLabel_RANGE_value').text(`${text}`);
    }
  }
  setVelocityValue(value) {
    if (value === null) {
      $('#TrackDataLabel_SPEED_value').text(``);
    } else {
      const text = value.toFixed(0);
      $('#TrackDataLabel_SPEED_value').text(`${text}`);
    }
  }
  setRangeRateValue(value) {
    if (value === null) {
      $('#TrackDataLabel_RangeRate_value').text(``);
    } else {
      const text = value.toFixed(0);
      // const text = unitsConverter.formatWithSign(value);
      $('#TrackDataLabel_RangeRate_value').text(`${text}`);
    }
  }
  setHeadingValue(value) {
    if (value === null) {
      $('#TrackDataLabel_Heading_value').text(``);
    } else {
      const text = value.toFixed(0);
      $('#TrackDataLabel_Heading_value').text(`${text}`);
    }
  }

  setAltitudeValue(value) {
    if (value === null) {
      $('#TrackDataLabel_ALT_value').text(``);
    } else {
      const text = value.toFixed(0);
      $('#TrackDataLabel_ALT_value').text(`${text}`);
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
        <div class='w-100 h-100' style='background-color:rgb(0 0 0 / 0%)'>
          <span style='left:43.5%;top:4%'>TRACK DATA</span>

          <div class='w-100 h-100' style='right:78%;top:20%'>
            <span style='right:0;top:0'>LTN:</span>
            <span style='right:0;top:8%'>ATN:</span>
            <span style='right:0;top:16%'>GTN:</span>
          </div>
          <div class='w-100 h-100' style='right:46%;top:20%'>
            <span style='right:0;top:0%'>ID:</span>
            <span style='right:0;top:8%'>REMOTE ID:</span>
            <span style='right:0;top:16%'>GBDL ID:</span>
          </div>
          <div class='w-100 h-100' style='right:12.5%;top:20%'>
            <span style='right:0;top:0%'>SOURCE:</span>
            <span style='right:0;top:8%'>RAID SIZE:</span>
            <span style='right:0;top:16%'>TON:</span>
            <span style='right:0;top:24%'>COMTIM:</span>
          </div>

          <div class='w-100 h-100' style='right:79%;top:54%'>
            <span style='right:0;top:0%'>ENGAGE STATUS:</span>
          </div>
          <div class='w-100 h-100' style='right:86%;top:62%'>
            <span style='right:0;top:0%'>IFF MODE:</span>
          </div>
          <div class='w-100 h-100' style='right:24.5%;top:54%'>
            <span style='right:0;top:0%'>POSITION:</span>
          </div>

          <div class='w-100 h-100' style='right:83%;top:70.2%'>
            <span style='right:0;top:0%'>RANGE:</span>
            <span id='TrackDataLabel_RANGE_value' style='right:-10%;top:0%;width: 50px; text-align: left;'>xxxx</span>
            <span id='TrackDataLabel_RANGE_units' style='right:-14%;top:0%;width: 50px; text-align: left;'>KM</span>

            <span style='right:0;top:8%'>RANGE RATE:</span>
            <span id='TrackDataLabel_RangeRate_value' style='right:-8%;top:8%;width: 50px; text-align: left;'>xxx</span>
            <span id='TrackDataLabel_RangeRate_units' style='right:-14%;top:8%;width: 50px; text-align: left;'>MPS</span>
          </div>

          <div class='w-100 h-100' style='right:49%;top:70.2%'>
            <span style='right:0;top:0%'>HEADING:</span>
            <span id='TrackDataLabel_Heading_value' style='right:-10%;top:0%;width: 50px; text-align: left;'>xxxx</span>
            <span id='TrackDataLabel_Heading_units' style='right:-16%;top:0%;width: 50px; text-align: left;'>DEG</span>

            <span style='right:0;top:8%'>SPEED:</span>
            <span id='TrackDataLabel_SPEED_value' style='right:-10%;top:8%;width: 50px; text-align: left;'>xxxx</span>
            <span id='TrackDataLabel_SPEED_units' style='right:-16%;top:8%;width: 50px; text-align: left;'>MPS</span>
          </div>

          <div class='w-100 h-100' style='right:16%;top:70.2%'>
            <span style='right:0;top:0%'>AZIMUTH:</span>
            <span id='TrackDataLabel_MILS_value' style='right:-10%;top:0%;width: 50px; text-align: left;'>xxxx</span>
            <span id='TrackDataLabel_MILS_units' style='right:-16%;top:0%;width: 50px; text-align: left;'>MILS</span>

            <span style='right:0;top:8%'>ALT (MSL):</span>
            <span id='TrackDataLabel_ALT_value' style='right:-10%;top:8%;width: 50px; text-align: left;'>xxxx</span>
            <span id='TrackDataLabel_ALT_units' style='right:-16%;top:8%;width: 50px; text-align: left;'>KM</span>
          </div>

          <div class='w-100 h-100' style='right:75.5%;top:87.5%'>
            <span style='right:0;top:0%'>FOLLOWER SOURCE</span>

            <span style='right:-10.5%;top:0%;width: 50px; text-align: left;'>1.</span>
            <span></span>

            <span style='right:-24.5%;top:0%;width: 50px; text-align: left;'>2.</span>
            <span></span>

            <span style='right:-38.5%;top:0%;width: 50px; text-align: left;'>3.</span>
            <span></span>

            <span style='right:-52.5%;top:0%;width: 50px; text-align: left;'>4.</span>
            <span></span>

            <span style='right:-66.5%;top:0%;width: 50px; text-align: left;'>5.</span>
            <span></span>
          </div>
        <div>
      </div>
      `);
    $container.append($ppiElement);
    this.applyStyles();
  }


  // Apply embedded CSS styles
  applyStyles() {
    const styles = {
      display: 'none',
      position: 'absolute',
      fontSize: '70%',
      letterSpacing: '0.16em',
      color: `${this.color}%`,
      top: `${this.top}%`,
      left: `${this.left}%`,
      width: `${this.width}%`,
      height: `${this.height}%`,
      // 'background-image': `url(${this.baseImage})`,
      'background-size': '100% 100%', // Stretch the image to fill the container
      'background-repeat': 'no-repeat', // Prevents duplication
      'background-position': 'center', // Centers the image
      'border-style': 'solid',
      'border-color': `${this.color}%`,
      'border-width': `1px`,
    };
    $(`#${this.cssId}`).css(styles);
    $(`#${this.cssId} span`).css({ position: 'absolute', });
    $(`#${this.cssId} div`).css({ position: 'absolute', });
  }

}
