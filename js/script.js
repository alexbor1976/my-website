// the class of the MENU
class MenuBuilder {
    // The constructor runs when we create a new instance of this class
    constructor(placeholderSelector) {
        this.placeholderSelector = placeholderSelector;
    }

    // Method to store and return our HTML template
    getMenuHtml() {
        return `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav pt-2 py-lg-0">
                        <li class="nav-item ms-3 my-0 py-1 py-lg-0">
                            <a href="index.html" class="btn btn-primary fs-4 custom-mobile-btn">Головна</a>
                        </li>
                        <li class="nav-item ms-3 my-0 py-1 py-lg-0">
                            <a href="3d.html" class="btn btn-primary fs-4 custom-mobile-btn">Зразки 3D-моделей</a>
                        </li>
                        <li class="nav-item ms-3 my-0 py-1 py-lg-0">
                            <a href="temp.html" class="btn btn-primary fs-4 custom-mobile-btn">Temp</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `;
    }

    // Method to highlight the correct button based on the URL
    setActiveState() {
        let currentUrl = window.location.pathname.split('/').pop();
        if (currentUrl === '') {
            currentUrl = 'index.html'; // Default to index.html
        }

        // Find the link and add the active classes
        $('a[href="' + currentUrl + '"]').addClass('active').attr('aria-pressed', 'true');
    }

    // Method to actually execute the building process
    render() {
        // Inject the HTML
        $(this.placeholderSelector).html(this.getMenuHtml());
        // Set the active state
        this.setActiveState();
    }
}

// ---------------------------------------------------------
// 2. Main Execution (This runs when the page loads)
// ---------------------------------------------------------
$(document).ready(function() {
    
    // Create a new instance of our class and tell it where to inject the menu
    const myMenu = new MenuBuilder('#header-placeholder');
    
    // Tell it to render!
    myMenu.render();

    // ---------------------------------------------------------
    // 3D Page Interactions
    // ---------------------------------------------------------
    
    // Listen for a click on the model1 button
    $('#model1-btn').click(function() {
        // Toggle the 'd-none' class on both images inside this specific button
        $(this).find('.switch-off').toggleClass('d-none');
        $(this).find('.switch-on').toggleClass('d-none');
    });

});