class TargetPackage2Ro {
  constructor({
    range,
    rangeRate,
    speed, // 
    azimuth, // 
    altitude, // 
    elevation, // in radians
    name = 'no name'
  }) {
    this.range = range;
    this.rangeRate = rangeRate;//km/s
    this.speed = speed;//km/s
    this.azimuth = azimuth;//km/s
    this.altitude = altitude;//km/s
    this.elevation = elevation;//km/s
    this.name = name;//km/s
  }



  toString() {
    return `Target ${this.name}:
      - Range: ${this.range} km
      - Range Rate: ${this.rangeRate} km/s
      - Speed: ${this.speed} km/s
      - Azimuth: ${this.azimuth}°
      - Altitude: ${this.altitude} km
      - Elevation: ${this.elevation.toFixed(2)} radians`;
  }
}
