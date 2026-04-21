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

class PowerIndicatorStick {
    constructor(css_img_id, css_dial_id) {
        //css id of the img to rotate
        this.$stickElement = $(`#${css_img_id}`);
        this.$dialElement = $(`#${css_dial_id}`);
        this.start = true;

        // Add the click listener
        this.$dialElement.click(() => {
            this.switchAnimation();
        });
    }

    switchAnimation() {
        this.start = !this.start;
    }

    run() {
        this.startSmoothOscillatingRotation();
    }

    /**
   * Starts continuous rotation within a ±30-degree range in small increments.
   */
    startSmoothOscillatingRotation() {
        let angle = 0;
        let increment = 1; // Small step increment

        this.oscillationIntervalId = setInterval(() => {
            if (this.start) {
                //inr the angle only if the rotation is enabled
                angle += increment;
            }

            this.rotateStick(angle);

            // Reverse direction when reaching ±30 degrees
            if (angle >= 35 || angle <= -35) {
                increment = -increment;
            }
        }, 20); // Adjust interval time for smoothness (20ms for a smooth transition)
    }

    /**
     * Stops the smooth oscillating rotation.
     */
    stopSmoothOscillatingRotation() {
        if (this.oscillationIntervalId) {
            clearInterval(this.oscillationIntervalId);
            this.oscillationIntervalId = null;
        }
    }

    /**
     * Rotates the stick to a specific angle.
     * @param {number} angle The angle to set the rotation within ±30 degrees.
     */
    rotateStick(angle) {
        // .length checks if the element actually exists on the page
        if (this.$stickElement.length) {
            // Apply multiple CSS properties at once using an object
            this.$stickElement.css({
                'transform-origin': '50% 90%',
                'transform': `rotate(${angle}deg)`
            });
        }
    }

}

class RadarDisplay {
    constructor(containerId, canvasId) {
        this.$container = $(`#${containerId}`);
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.angle = 0; // Starting azimuth angle
        this.animationId = null;

        // Make sure the canvas resolution matches its display size
        this.resizeCanvas();
        
        // If the user resizes the browser window, redraw the canvas to fix distortion
        $(window).resize(() => this.resizeCanvas());
    }

    resizeCanvas() {
        // Match the internal canvas pixels to the actual visual size of the Bootstrap column
        this.canvas.width = this.$container.width();
        this.canvas.height = this.$container.height();
        this.draw();
    }

    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Make the line length 45% of the width so it stays inside the circle
        const radius = Math.min(centerX, centerY) * 0.80; 

        // 1. Clear the old frame
        this.ctx.clearRect(0, 0, width, height);

        // 2. Save the blank state
        this.ctx.save();

        // 3. Move our drawing origin to the exact center of the image
        this.ctx.translate(centerX, centerY);

        // 4. Rotate the canvas. (We subtract 90 degrees so 0 points UP)
        const radians = (this.angle - 90) * (Math.PI / 180);
        this.ctx.rotate(radians);

        // 5. Draw the radar line
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0); // Start at the center
        this.ctx.lineTo(radius, 0); // Draw outwards
        
        // 6. Style the line (Classic radar green with a glow effect)
        this.ctx.strokeStyle = '#00FF00'; 
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00FF00';
        this.ctx.stroke();

        // 7. Restore the state for the next frame
        this.ctx.restore();
    }

    // Call this manually to set a specific angle
    setAngle(newAngle) {
        this.angle = newAngle;
        this.draw();
    }

    // Call this to make it spin endlessly
    startSweep(speed = 1) {
        const animate = () => {
            this.angle += speed;
            if (this.angle >= 360) this.angle = 0; // Reset after a full circle
            this.draw();
            // requestAnimationFrame is the smoothest way to animate in JS
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    // Call this to pause the spinning
    stopSweep() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}


function buttons3DInteraction() {
    // Listen for a click on the model3 button
    $('#model1-btn').click(function () {
        // Toggle the 'd-none' class on both images inside this specific button
        $(this).find('.switch-off').toggleClass('d-none');
        $(this).find('.switch-on').toggleClass('d-none');
    });

    // Listen for a click on the model1 button
    $('#model3-btn').click(function () {
        // Toggle the 'd-none' class on both images inside this specific button
        $(this).find('.switch-off').toggleClass('d-none');
        $(this).find('.switch-on').toggleClass('d-none');
    });

    // Listen for a click on the steel button
    $('#model_steel-btn').click(function () {
        // Toggle the 'd-none' class on both images inside this specific button
        $(this).find('.switch-off').toggleClass('d-none');
        $(this).find('.switch-on').toggleClass('d-none');
    });
}

// ---------------------------------------------------------
// 2. Main Execution (This runs when the page loads)
// ---------------------------------------------------------
const powerIndicatorStick = new PowerIndicatorStick('PowerIndicatorStick_id', 'PowerIndicatorDial_id');
const myRadar = new RadarDisplay('ppi_id', 'ppi-canvas');

$(document).ready(function () {
    // Create a new instance of our class and tell it where to inject the menu
    const myMenu = new MenuBuilder('#header-placeholder');

    // Tell it to render!
    myMenu.render();

    // ---------------------------------------------------------
    // 3D Page Interactions
    // ---------------------------------------------------------
    buttons3DInteraction();
    powerIndicatorStick.run();
    myRadar.startSweep(1);
});