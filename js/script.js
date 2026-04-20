$(document).ready(function() {
    // 1. Store the entire menu HTML in a variable using backticks (`)
    const menuHtml = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav py-1 py-lg-0">
                    <li class="nav-item ms-3 my-0 py-1 py-lg-0">
                        <a href="index.html" class="btn btn-primary fs-4 custom-mobile-btn">Головна</a>
                    </li>
                    <li class="nav-item ms-3 my-0 py-1 py-lg-0">
                        <a href="3d.html" class="btn btn-primary fs-4 custom-mobile-btn">Зразки 3D-моделей</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    // 2. Inject the menu into the placeholder on the page
    $('#header-placeholder').html(menuHtml);

    // 3. Figure out which page we are currently on
    let currentUrl = window.location.pathname.split('/').pop();
    if (currentUrl === '') {
        currentUrl = 'index.html'; // Default to index.html if no file is shown in the URL
    }

    // 4. Find the matching link in our injected menu and make it look "clicked"
    $('a[href="' + currentUrl + '"]').addClass('active').attr('aria-pressed', 'true');

    // ---------------------------------------------------------
    // Your other jQuery code goes below here
    // ---------------------------------------------------------
    $('#clickMeBtn').click(function() {
        alert("jQuery is working locally!");
    });
});