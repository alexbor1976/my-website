/**
 * Example of a simple function.
 * @param {string} name - The name of the person.
 * @param {number} age - The age of the person.
 * @returns {string} A greeting message.
 */
function greet(name, age) {
  return `Hello ${name}, you are ${age} years old.`;
}

/**
* Example of an async function.
* @async
* @function fetchData
* @param {string} url - The URL to fetch data from.
* @returns {Promise<Object>} The response data.
*/
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

/**
* Example of a class with constructor and methods.
*/
class Person {
  /**
   * Creates an instance of Person.
   * @constructor
   * @param {string} name - The person's name.
   * @param {number} age - The person's age.
   */
  constructor(name, age) {
    /** @private {string} */
    this.name = name;

    /** @protected {number} */
    this.age = age;
  }

  /**
   * Gets the person's name.
   * @returns {string} The person's name.
   */
  getName() {
    return this.name;
  }

  /**
   * Sets the person's name.
   * @param {string} newName - The new name.
   */
  setName(newName) {
    this.name = newName;
  }

  /**
   * Event handler example.
   * @event onBirthday
   * @type {function}
   */
  onBirthday() {
    this.age++;
    console.log(`Happy birthday, ${this.name}!`);
  }
}

/**
* Example of an object type definition.
* @typedef {Object} Address
* @property {string} street - The street name.
* @property {string} city - The city name.
* @property {string} zip - The postal code.
*/

/**
* Example of a function that takes a typedef object.
* @param {Address} address - The address object.
* @returns {string} A formatted address.
*/
function formatAddress(address) {
  return `${address.street}, ${address.city}, ${address.zip}`;
}

/**
* Example of using an enum-like object.
* @enum {string}
*/
const Colors = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
};

/**
* Example of a function with default parameter and optional parameter.
* @param {string} [message='Hello'] - Optional message.
* @param {boolean} [isUppercase] - Whether to convert the message to uppercase.
* @returns {string} The formatted message.
*/
function sayMessage(message = 'Hello', isUppercase) {
  return isUppercase ? message.toUpperCase() : message;
}

/**
* Example of a generic function.
* @template T
* @param {T} item - The item to process.
* @returns {T} The processed item.
*/
function identity(item) {
  return item;
}

/**
* Example of a module export (for Node.js or ES6 modules).
* @module myModule
*/

/**
* Example of an inline callback function.
* @callback MathOperation
* @param {number} a - First number.
* @param {number} b - Second number.
* @returns {number} The result of the operation.
*/

/**
* Example of a function accepting a callback.
* @param {MathOperation} operation - The math operation to perform.
* @returns {number} The result of the operation.
*/
function executeOperation(operation) {
  return operation(5, 3);
}
