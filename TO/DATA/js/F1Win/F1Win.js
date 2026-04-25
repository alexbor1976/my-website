// Class representing the main F1 window with tabs, draggable functionality, and additional UI controls
class F1Win {
  constructor(parentDivId) {
    // Store the parent div element where the tabbed window will be added
    this.parentDiv = $(`#${parentDivId}`);
    this.initUI(); // Initialize the user interface
    this.bindKeyEvents(); // Bind global key events for F1 and Escape keys
  }



  // Method to initialize the UI components of the F1 window
  initUI() {

    // Create the HTML structure for the tabbed window
    const tabHtml = `
      <div class="position-absolute" style="width: 90%; height: 90%; top: 5%; left:5%; z-index: 1050; display: none; background-color: lightgray;border-width:1px;border-color:darkgreen;border-style:solid" id="f1TabbedWindow">
        <div class="d-flex align-items-center p-2" style="background-color: lightgray;">
          <ul class="nav nav-tabs flex-grow-1" id="myTab" role="tablist" style="border-color: darkgreen;"></ul>
          <div>
            <button id="closeButton" class="btn btn-sm btn-outline-dark">&times;</button>
            <button id="resizeButton" class="btn btn-sm btn-outline-dark">Resize</button>
          </div>
        </div>
        <div class="tab-content" id="myTabContent"></div>
      </div>
    `;

    // Add the tabbed window to the parent div
    this.parentDiv.html(tabHtml);
    this.f1TabbedWindow = $('#f1TabbedWindow');
    this.closeButton = $('#closeButton');
    this.resizeButton = $('#resizeButton');

    // Add individual tabs to the window
    new F1TabChild('myTab', 'myTabContent', 'tab3', 'content3', 'Network Settings', '', true);
    // new F1Tab('myTab', 'myTabContent', 'tab1', 'content1', 'Empty', 'Content for Tab 1', false);
    // new F1Tab('myTab', 'myTabContent', 'tab2', 'content2', 'Empty', 'Content for Tab 2', false);

    this.bindUIActions(); // Bind UI button actions
  }

  // Method to bind key events for showing/hiding the window
  bindKeyEvents() {
    $(document).on('keydown', (event) => {
      if (event.ctrlKey && event.key === 'F1') {
        event.preventDefault(); // Prevent default F1 action (help)
        console.log('Ctrl + F1 pressed'); // Debugging line to confirm key detection
        this.show(); // Show the window
      } else if (event.key === 'Escape') {
        this.hide(); // Hide the window
      }
    });
  }

  // Method to bind UI actions such as close and resize
  bindUIActions() {
    this.closeButton.on('click', () => this.hide()); // Hide the window when the close button is clicked
    this.resizeButton.on('click', () => this.toggleSize()); // Toggle the window size when the resize button is clicked

    // Make the window draggable with the header as the handle
    if (typeof $.fn.draggable === 'function') {
      this.f1TabbedWindow.draggable({ handle: '.d-flex', containment: false });
    } else {
      console.warn('jQuery UI is not loaded, draggable functionality will not work.');
    }
  }

  // Method to show the F1 window with an animation from the bottom of the screen
  show() {
    this.f1TabbedWindow.css({ bottom: '-100%', display: 'block' }).animate({ bottom: '0' }, 300);
  }

  // Method to hide the F1 window with an animation to the bottom of the screen
  hide() {
    this.f1TabbedWindow.animate({ bottom: '-100%' }, 300, () => {
      this.f1TabbedWindow.hide();
    });
  }

  // Method to toggle the size of the F1 window between full and half size
  toggleSize() {
    if (this.f1TabbedWindow.hasClass('small')) {
      this.f1TabbedWindow.removeClass('small').animate({ width: '90%', height: '90%' }, 300);
    } else {
      this.f1TabbedWindow.addClass('small').animate({ width: '45%', height: '45%' }, 300);
    }
  }
}

// No module export to maintain compatibility without modules