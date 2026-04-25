// Class representing application settings, including IP address and port
class Settings {
  constructor() {
    // Initialize settings with default values
    // this.ipAddress = '192.168.0.1';
    this.ipAddress = '127.0.0.1';
    this.portNumber = '8080';
    this.blockName = 'TO';
  }

  // Method to update settings
  updateSettings(newIpAddress, newPortNumber, blockName) {
    this.ipAddress = newIpAddress;
    this.portNumber = newPortNumber;
    this.blockName = blockName;
    console.log(`Settings updated: IP Address = ${this.ipAddress}, Port Number = ${this.portNumber}, blockName = ${this.blockName}`);
  }
}

// Export the Settings class instance as a singleton
const settings = new Settings();
window.settings = settings; // Make it globally accessible
