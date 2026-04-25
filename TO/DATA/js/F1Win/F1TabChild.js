// Child class of F1Tab, adding a row with fields for IP address and port number
class F1TabChild extends F1Tab {
  constructor(tabListId, tabContentId, tabId, contentId, tabName, content, isActive = false) {
    super(tabListId, tabContentId, tabId, contentId, tabName, content, isActive);
    this.addIpPortName(); // Add additional row with fields
    this.addJSON2Send(); // Add additional row with fields
    this.addJSONLogs(); // Add additional row with fields
    this.initWebSocket();
  }

  // Initialize WebSocket event handlers
  initWebSocket() {
    const ipAddress = window.settings.ipAddress;
    const portNumber = window.settings.portNumber;
    let netAddress = `ws://${ipAddress}:${portNumber}`;
    // let netAddress = 'ws://localhost:8080';
    console.log('netAddress: ', netAddress)

    // this.ws = new WebSocket(`ws://${ipAddress}:${portNumber}`);
    this.ws = new WebSocket(netAddress);
    // this.ws = new WebSocket('ws://localhost:8080');

    // Handle incoming WebSocket messages
    this.ws.onmessage = async (event) => {
      const message = await this.getMessageData(event);
      const name = $(`#blockName${this.tabId}`).val() || 'Anonymous';
      this.handleMessage(message, name);
    }
  }

  // Extract message data from the WebSocket event, converting Blob to text if necessary
  async getMessageData(event) {
    return event.data instanceof Blob ? await event.data.text() : event.data;
  }

  // Handle the received message
  handleMessage(message, name) {
    try {
      // Parse the received message as JSON
      const parsedMessage = JSON.parse(message);
      this.appendMessage('log', parsedMessage);

      // If the message is a connection or disconnection event, just log it
      if (this.isConnectionEvent(parsedMessage)) {
        return;
      }

      // If the message is intended for this client, display it in 'Received Messages'
      if (this.isMessageForClient(parsedMessage, name)) {
        this.displayReceivedMessage(parsedMessage);
        this.parseReceivedMessage(parsedMessage);
      }
    } catch (error) {
      this.logError(error);
    }
  }

  // Log an error message if the received message could not be parsed
  logError(error) {
    this.appendMessage('log', `Error parsing received message: ${error.message}`);
  }

  // Display the received message in the 'Received Messages' area
  displayReceivedMessage(parsedMessage) {
    const recipient = parsedMessage.recipient ? `To ${parsedMessage.recipient}` : 'To All';
    this.appendMessage('receivedMessages', `From ${parsedMessage.sender} to ${recipient}: ${JSON.stringify(parsedMessage.json)}`);
  }

  parseReceivedMessage(parsedMessage) {
    if (!parsedMessage.json.list) {
      console.log('!parsedMessage.list');
      console.log('parsedMessage: ', parsedMessage);
      return;
    }

    if (!Array.isArray(parsedMessage.json.list)) {
      console.log('!Array.isArray(parsedMessage.list)');
      console.log('parsedMessage: ', parsedMessage);
      return;
    }

    parsedMessage.json.list.forEach(item => {
      console.log(`Parsed item Name: ${item.name}, Params: ${item.params}`);
      // You can add additional processing logic here if needed
    });
  }

  // Determine if the message is intended for this client
  isMessageForClient(parsedMessage, name) {
    return !parsedMessage.recipient || parsedMessage.recipient === name;
  }

  // Check if the message is a connection or disconnection event
  isConnectionEvent(parsedMessage) {
    return parsedMessage.type === 'connected' || parsedMessage.type === 'disconnected';
  }

  // Method to add a row with fields for IP address and port number
  addIpPortName() {
    const rowHtml = `
      <div class="row ">
        <div class="col-md-6 ">
          <div class="row p-2 border m-2" style="border-color:darkgreen!important">
              <div class="col-md-3">
                <label for="ipAddress${this.tabId}" class="form-label">IP Address</label>
                <input type="text" class="form-control" id="ipAddress${this.tabId}" placeholder="Enter IP address">
              </div> 
              <div class="col-md-3">
                <label for="portNumber${this.tabId}" class="form-label">Port Number</label>
                <input type="text" class="form-control" id="portNumber${this.tabId}" placeholder="Enter port number">
              </div>
              <div class="col-md-4">
                <label for="blockName${this.tabId}" class="form-label">Name of this block</label>
                <input type="text" class="form-control" id="blockName${this.tabId}" placeholder="Enter the blockname">
              </div>
            <div class="col-md-2">
                <label for="updateSettingsButton${this.tabId}" class="form-label">&nbsp; </label><br>
                <button id="updateSettingsButton${this.tabId}" class="btn btn-primary">Update</button>
            </div >
          </div>
        </div>
        <div class="col-md-6 ">
          <label class="form-label">Example of JSON: </label>
          <p>
          {"name":"ExampleName",
              "list":[{"name":"Item1","params":"paramValue1"},{"name":"Item2","params":"paramValue2"}]}
          </p>
        </div>
      </div >
      `;
    $(`#${this.contentId} `).append(rowHtml);

    this.bindIndividualSettings(); // Bind individual settings
    this.bindUpdateButton(); // Bind the update button
  }

  // Method to add a row with fields for IP address and port number
  addJSON2Send() {
    const rowHtml = `
    <div class="row p-2 border m-2" style="border-color:darkgreen!important">
      <div class="row ">
        <div class="col-md-11">
          <div class="d-flex flex-column">
            <textarea id="jsonInput" class="w-100" style="min-height: 70px;" placeholder="Enter a JSON object to send"></textarea>
            <!-- 
            <label class="form-label">
            Example of JSON: 
            {"name":"ExampleName",
              "list":[{"name":"Item1","params":"paramValue1"},{"name":"Item2","params":"paramValue2"}]}
            </label>
            -->
          </div>
          
        </div>
        <div class="col-md-1">
          <div class="d-flex flex-column">
            <!-- <button id="clear_json_id">Clear JSON</button> -->
            <button id="send_json_id">Send JSON</button>
          </div>
        </div>
      </div>
    </div>
      `;
    $(`#${this.contentId} `).append(rowHtml);

    this.bindJSONButtons(); // Bind the update button
  }

  // Method to add a row with fields for IP address and port number
  addJSONLogs() {
    const rowHtml = `
    <div class="row p-2 border m-2" style="border-color:darkgreen!important">
      <div class="">
        <p class="m-0 mt-2">Sent Messages (<span id="sentMessagesCounter">0</span>)</p>
        <textarea id="sentMessages" class="w-100" style="min-height:90px;"></textarea>
      </div>
      <div class="">
        <p class="m-0 mt-3">Received Messages (<span id="receivedMessagesCounter">0</span>)</p>
        <textarea id="receivedMessages" class="w-100" style="min-height:90px;"></textarea>
      </div>
      <div class="">
        <p class="m-0 mt-3">Common Log (<span id="logCounter">0</span>)</p>
        <textarea id="log" class="w-100" style="min-height:110px;"></textarea>
      </div>
    </div>
      `;
    $(`#${this.contentId} `).append(rowHtml);
  }

  // Method to bind the update button for IP and Port
  bindJSONButtons() {
    $(`#clear_json_id`).on('click', () => {
      $('#jsonInput').val('');
    });

    $(`#send_json_id`).on('click', () => {
      const jsonInput = $('#jsonInput').val().trim();
      const from = $(`#blockName${this.tabId}`).val().trim();
      const to = null;
      this.sendMessage(jsonInput, from, to);
    });
  }

  // Function to send JSON messages
  sendMessage(jsonMsg, from, to) {
    console.log('sendMessage: ', jsonMsg, from, to);

    let messageObject;

    // Parse and send JSON message
    if (jsonMsg) {
      try {
        const parsedJSON = JSON.parse(jsonMsg);
        if (!parsedJSON.name || !Array.isArray(parsedJSON.list)) {
          throw new Error("Invalid JSON format");
        }

        messageObject = {
          sender: from,
          recipient: to || "", // Empty for broadcast
          json: parsedJSON,
          timestamp: new Date().toLocaleString()
        };

        // Log the message being sent
        this.appendMessage('sentMessages', `You -> ${to || 'All'}: ${JSON.stringify(messageObject)}`);

      } catch (error) {
        this.appendMessage('log', `Error: ${error.message}`);
        return;
      }
    }

    // Send the message as JSON string
    this.ws.send(JSON.stringify(messageObject));

    // Clear the input field
    $('#jsonInput').val('');
  }

  // Append message to a textarea
  appendMessage(textareaId, text) {
    let $counter = $(`#${textareaId}Counter`);
    let count = parseInt($counter.text(), 10); // Use .text() to get the value from <span>
    if (isNaN(count)) {
      count = 0; // Set to 0 if the value is not a number
    }
    count++;
    $counter.text(count); // Use .text() to update the value in <span>

    const $textarea = $('#' + textareaId);

    if (typeof text === 'object') {
      text = JSON.stringify(text);
    }
    $textarea.val($textarea.val() + text + '\n' + '--------------------' + '\n');
    $textarea.scrollTop($textarea[0].scrollHeight); // Auto-scroll to bottom
  }


  // Method to bind each setting individually
  bindIndividualSettings() {
    const ipAddressField = $(`#ipAddress${this.tabId} `);
    const portNumberField = $(`#portNumber${this.tabId} `);
    const blockNameField = $(`#blockName${this.tabId} `);

    ipAddressField.val(window.settings.ipAddress);
    portNumberField.val(window.settings.portNumber);
    blockNameField.val(window.settings.blockName);
  }

  // Method to bind the update button for IP and Port
  bindUpdateButton() {
    $(`#updateSettingsButton${this.tabId} `).on('click', () => {
      const newIpAddress = $(`#ipAddress${this.tabId} `).val();
      const newPortNumber = $(`#portNumber${this.tabId} `).val();
      const blockName = $(`#blockName${this.tabId} `).val();
      window.settings.updateSettings(newIpAddress, newPortNumber, blockName);
      // console.log('new newIpAddress is: ', newIpAddress, '; new port number is: ', newPortNumber);
    });
  }
}

// Example instantiation of F1TabChild when document is ready
// $(document).ready(function () {
//   new F1TabChild('myTab', 'myTabContent', 'tab3', 'content3', 'Network Settings', 'Content for Tab 3', false);
// });