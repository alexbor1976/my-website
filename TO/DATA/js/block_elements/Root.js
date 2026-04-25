class Root {
  constructor(id = 'absent_id', containerId = 'absent_id') {
    this.id = id;
    this.containerId = containerId;
    this.powered = false;
  }

  isPwr() {
    return this.powered;
  }
  setPwrOn() {
    this.powered = true;
  }
  setPwrOff() {
    this.powered = false;
  }
}