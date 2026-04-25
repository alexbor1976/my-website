// Class representing a context menu called by Ctrl + right mouse button
class ContextMenu {
  constructor() {
    this.initContextMenu();
    this.bindMouseEvents();
    this.bindMenuActions();
  }

  // Method to initialize the context menu structure
  initContextMenu() {
    const menuHtml = `
      <ul id="contextMenu" class="position-absolute list-group" style="display: none; z-index: 2000; background-color: lightgray;">
        <li class="list-group-item" id="communicationItem">Communications</li>
        <li class="list-group-item">empty</li>
        <li class="list-group-item">empty</li>
      </ul>
    `;
    $(document.body).append(menuHtml);
    this.contextMenu = $('#contextMenu');
  }

  // Method to bind mouse events for showing the context menu
  bindMouseEvents() {
    $(document).on('contextmenu', (event) => {
      if (event.ctrlKey) {
        event.preventDefault(); // Prevent the default context menu
        this.showMenu(event.pageX, event.pageY); // Show the custom context menu
      }
    });

    $(document).on('click', () => {
      this.hideMenu(); // Hide the context menu when clicking elsewhere
    });
  }

  // Method to show the context menu at the specified position
  showMenu(x, y) {
    this.contextMenu.css({ top: y, left: x }).show();
  }

  // Method to bind actions for context menu items
  bindMenuActions() {
    $('#communicationItem').on('click', () => {
      this.hideMenu();
      if (window.f1WinInstance instanceof F1Win) {
        window.f1WinInstance.show();
      } else {
        console.warn('F1Win instance is not available');
      }
    });
  }

  // Method to hide the context menu
  hideMenu() {
    this.contextMenu.hide();
  }
}

// Instantiate the context menu when the document is ready
$(document).ready(function () {
  new ContextMenu();
});