// Class representing a tab in the F1 window
class F1Tab {
  constructor(tabListId, tabContentId, tabId, contentId, tabName, content, isActive = false) {
    // Store references to the tab list and tab content container
    this.tabList = $(`#${tabListId}`);
    this.tabContent = $(`#${tabContentId}`);
    this.tabId = tabId;
    this.contentId = contentId;
    this.tabName = tabName;
    this.content = content;
    this.isActive = isActive;
    this.createTab(); // Create the tab and its content
    this.applyInitialStyles(); // Apply initial styles to the active tab
  }

  applyInitialStyles() {
    if (this.isActive) {
      $(`#${this.tabId}`).css('border', '1px solid darkgreen');
    }
  }

  // Method to create the tab and add it to the UI
  createTab() {
    const activeClass = this.isActive ? 'active' : ''; // Set active class if the tab should be active initially
    const showClass = this.isActive ? 'show active' : ''; // Set show class for the tab content if active

    // Create the tab button HTML
    const tabHtml = `
    <li class="nav-item" role="presentation">
      <button class="nav-link ${activeClass}" id="${this.tabId}" data-bs-toggle="tab" data-bs-target="#${this.contentId}" type="button" role="tab" aria-controls="${this.contentId}" aria-selected="${this.isActive}" style="background-color: lightgray; color: darkgreen;">${this.tabName}</button>
    </li>
  `;

    // Create the tab content HTML
    const contentHtml = `
    <div class="tab-pane fade ${showClass} " id="${this.contentId}" role="tabpanel" aria-labelledby="${this.tabId}" style="background-color: lightgray; color: darkgreen; border-color: darkgreen !important;">${this.content}</div>
  `;

    // Append the tab button and content to their respective containers
    this.tabList.append(tabHtml);
    this.tabContent.append(contentHtml);

    // Add event listener to change the border color of the active tab
    $(`#${this.tabId}`).on('shown.bs.tab', (e) => {
      $('.nav-link').css('border', ''); // Reset border for all tabs
      $(e.target).css('border', '1px solid darkgreen'); // Set border for the active tab
    });
  }
}
