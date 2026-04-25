class UnitsConverter {
  //takes Kilometers, return Kilometers/NMI (naval miles)
  convertRange(km) {
    if (RANGE_UNITS === 'KM') {
      return km;
    } else {
      //nmi
      const nmi = this.kmToNmi(km);
      return nmi;
    }
  }

  kmToNmi(kilometers) {
    return kilometers / 1.852;
  }

  convertAzimuth(radians) {
    if (AZIMUTH_UNITS === 'DEGREES') {
      // DEGREES
      return this.radiansToDegrees(radians);
    } else {
      //MILS
      return this.radiansToMils(radians);
    }
  }

  convertHeading(heading) {
    if (AZIMUTH_UNITS === 'DEGREES') {
      return this.radiansToDegrees(heading);
    } else {
      return this.radiansToMils(heading);
    }
  }

  convertAltitude(altitude) {
    if (ALTITUDE_UNITS === 'KM') {
      //from m to km
      return altitude / 1000;
    } else {
      //kilofeet
      return this.meterToKilofeet(altitude);
    }
  }

  meterToKilofeet(meters) {
    const METERS_TO_KILOF_CONVERSION = 0.00328084; // 1 meter to kft factor
    const kf = (meters * METERS_TO_KILOF_CONVERSION);
    return Math.round(kf);
  }

  convertVelocity(metersPerSeconds) {
    if (VELOCITY_UNITS === 'MPS') {
      return metersPerSeconds;
    } else {
      return this.mpsToKnots(metersPerSeconds);
    }
  }

  convertRangeRate(rangeRateMPS) {
    if (VELOCITY_UNITS === 'MPS') {
      // meters per seconds
      return Math.round(rangeRateMPS);
      // return this.metersPerSecondToMilesPerSecond(metersPerSeconds);
    } else {
      //KNOTS
      return this.mpsToKnots(rangeRateMPS);
    }
  }

  mpsToKnots(mps) {
    const KNOT_CONVERSION_FACTOR = 1 / 0.514444;
    const knots = mps * KNOT_CONVERSION_FACTOR;
    return Math.round(knots);
  }

  formatWithSign(value) {
    const text = value.toFixed(0); // Convert the number to string with 0 decimals
    const sign = value < 0 ? '-' : ' '; // Use '-' for negative and ' ' (space) for positive
    return `${sign}${Math.abs(text)}`;  // Ensure the absolute value is used after prefixing the sign
  }

  radiansToDegrees(angleInRadians) {
    let angleInDegrees = angleInRadians * (180 / Math.PI);

    // Ensure the angle doesn't exceed 360 degrees
    angleInDegrees = angleInDegrees % 360;

    // Handle negative angles by adding 360 to bring them into the 0-360 range
    if (angleInDegrees < 0) {
      angleInDegrees += 360;
    }

    return angleInDegrees;
  }

  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  radiansToMils(angleInRadians) {
    let angleInDegrees = angleInRadians * (3200 / Math.PI);

    angleInDegrees = angleInDegrees % 6400;

    if (angleInDegrees < 0) {
      angleInDegrees += 6400;
    }

    return angleInDegrees;
  }

  metersPerSecondToMilesPerSecond(metersPerSecond) {
    const milesPerMeter = 0.000621371;
    return metersPerSecond * milesPerMeter;
  }
}

const unitsConverter = new UnitsConverter();

// function radiansToMils(radians) {
//   return radians * (3200 / Math.PI);
// }

// // Conversion from radians to degrees
// function radiansToDegrees(radians) {
//   return radians * (180 / Math.PI);
// let degrees = radians * (180 / Math.PI); // Convert to degrees

//     // Normalize to 0-360°
//     if (degrees < 0) {
//       degrees += 360;
//     }

// }

// // Conversion from radians to mils (NATO standard: 6400 mils = 360 degrees)
// function radiansToMils(radians) {
//   return radians * (3200 / Math.PI);
// }

// // Example usage
// const radiansInput = Math.PI / 4; // 45 degrees in radians

// console.log(`${radiansInput} radians = ${radiansToDegrees(radiansInput).toFixed(2)} degrees`);
// console.log(`${radiansInput} radians = ${radiansToMils(radiansInput).toFixed(2)} mils`);


// /**
//    * Convert radians to degrees.
//    * @param {number} radians - Angle in radians.
//    * @returns {number} - Angle in degrees.
//    */
// radiansToDegrees(radians) {
//   return radians * (180 / Math.PI);
// }

// /**
//  * Convert radians to mils (NATO standard: 1 circle = 6400 mils).
//  * @param {number} radians - Angle in radians.
//  * @returns {number} - Angle in mils.
//  */
// radiansToMils(radians) {
//   const milsPerCircle = 6400;
//   return radians * (milsPerCircle / (2 * Math.PI));
// }
