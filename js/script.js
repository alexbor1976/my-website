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
                            <a href="model_rls.html" class="btn btn-primary fs-4 custom-mobile-btn">Модель РЛС</a>
                        </li>
                        <li class="nav-item ms-3 my-0 py-1 py-lg-0">
                            <a href="TO/TDECC_TO_start.html" target="_blank" class="btn btn-primary fs-4 custom-mobile-btn">Модель </a>
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

// the draggable stick
class DraggableKnob {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.stick = this.container.querySelector('img');

        this.isDragging = false;
        this.currentAngle = 0;

        // NEW: We need to remember where the mouse was a millisecond ago
        this.previousX = 0;

        // NEW: Adjust this number to make it spin faster or slower!
        this.sensitivity = 1.5;

        this.initEvents();
    }

    initEvents() {
        this.stick.ondragstart = () => false;
        this.container.ondragstart = () => false;

        // 1. POINTER DOWN
        this.container.addEventListener('pointerdown', (e) => {
            this.isDragging = true;
            this.container.classList.add('dragging');

            // Record the exact X position where the user clicked
            this.previousX = e.clientX;

            this.container.setPointerCapture(e.pointerId);
        });

        // 2. POINTER MOVE
        document.addEventListener('pointermove', (e) => {
            if (!this.isDragging) return;

            // Calculate the "Delta" (how far the mouse moved left or right since the last frame)
            const deltaX = e.clientX - this.previousX;

            // Add that movement to our angle, multiplied by our speed sensitivity
            this.currentAngle += deltaX * this.sensitivity;

            // Rotate the image
            this.stick.style.transform = `rotate(${this.currentAngle}deg)`;

            // IMPORTANT: Update the previous position so the next frame calculates correctly
            this.previousX = e.clientX;
        });

        // 3. POINTER UP / CANCEL
        const onPointerUp = (e) => {
            if (this.isDragging) {
                this.isDragging = false;
                this.container.classList.remove('dragging');

                try {
                    this.container.releasePointerCapture(e.pointerId);
                } catch (err) { }
            }
        };

        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointercancel', onPointerUp);
    }
}

class SoundController {
    constructor() {
        // PASTE YOUR MASSIVE BASE64 STRING HERE, inside the quotes
        this.base64String = "//vQRAADNTZ7wYEpNfKoT5hAPSZ+Vxn3FIek1cMtvuIU9hs5EhG9hffNGqKydumIZ6haNuoQhWUgsjexaByNtcVk7a4YYUcjfC9bUQIAoGGUchW3aOSBBhGCDCiBizhJNA4LmyBj0oK0e+0bfmxBAxPzUcguSDN66MUEi7yBjoyeM5QukEIbhGT75pCgn3N86xINpIEFo5+8SQJt0oxz7u2w9OCZMBhe/uTQyIiI/h773d3l7EGIXSfc+9iEN93EPdvdpsQho1iEMpFY9FfBzj/hRGBQK9D1ezv7//+10c53NjKQYowRk8EEFEGdRiZGKxWjIxWFw2wgFDCiCEGJzRtkBgjC4JhgEBQgIEDEWzCCERHPJhEGEMtsv/ve+IbsQQMw8mAAjO0ODheGEJswgABnBwtPDye5BAAEJup3SGX2iHiz09iPvghH7n78PJk78OEIGEEMjNTbL8Zd4TJp7z041siIjO0Z2hz9v/+IjtEQhkcltuJgF5PdLCfjGPETc7CSFhiptVGkyx8anyrdSYo8zCYHjfcFhGbkZcuI5issyjJXsmEozFBx+vaLoVzZhroFuwhMI1W0eMlioYKHUBZ80DaU1qTkSg3V2gSZQXA+him8njCbE+N8ojjFDTKVmzBuvNsjZOE8qBzKAjUyZiUFAQdnVyolElI2iZxpDSss6FEqg3GqDFc/2Yh5uE0J3DPDms4+GN9WuU2WU1p6bV3mbP7FX4f0TPtysDoaqZFJQYQpPK4/oRf0Y378ffrrfa41mp/aZxiKdMrovrLmdzwzX75gfKwgZWMobbpcK5udtmYlwq24XzgkDuVTQxgWLYTyJaoPYkjymPnEOvLatIqoj/FJER0oeWbRrVi8vHcmBVcrUvnjrentUlT5ESyQWyo2tTtvFI71gyNEkDpylPMZSCjnG3vYhZPedskhvVh6Cx5xwysV1Q4oqexpi7bKIfWOUJGudzHnZoU4iB6SBoonVIJ7Dz9pVfDeBbZk0nsn+iBNhp8NqgNOAABvaFuKQQ8VoEKTiAQKwGwcO31jz+3nkOjRcUVqZEzzoyRogJv2bHtcwZEgrEkRyQO58aCeWh7OC2rSnzbjpqaUPmyAdV5WUf/70kQlgRa4fsRDCWGQzg+4iD2JXhf5xResJHtLEL7ibYSauTpETTpG0XjVCB4/ZXITnL2LXWsl04Lp+SkE+gaaEg5SUbaMC9bamdET3VUJykflSlzAtISlxLKiq9hYjE6ExTMLMQjla6eQO/aVkbCw7m/LaNwPPKVsb5m5DWjzvs0jQ0uO7du9DRatyXjjegeVPuPZi7lCbG0TUzeX25+91i1dSOzxg8suyw1BSnO2CbpAADaU5dSdDARBBbFK0G6ohpVpnb2vP2dYuro4eqGzs6R0aD9ShF0SkRYXEwwQDQAhbTFU/jXoDWjhsGliiyyHORem0RoFlBTRAgKGGAsPohAUTWogJzUmBSbI3DCpPEINojJEEXNjQmQDJNRIQj8RtAZRICMREZwnWcoo4lIDI+yjobGw6oiQVFJ1QVJJEiXaRFVV0M3WSRgT6xBA2snvkrmqIWlw2qk+DSUVy6SGePUpfKpFqWIVkC1an5I5s+SrMc7sO5uaoyxvmewOyOuxwkGDqqHiSh7m09gRFao15vYEiy5JVY39DHYHj8Wf9vY3hDkapI6ultGGNea5QyqlrTkep4i71qHpLPV4BsSeadee2KWu9VWbkjLRkAY7ZLnIyhgf7aEuu9UjpTL9Fg8xTiAMYQ9FOrdPzfc6FLDDZ6J45BuC9WnOJBqI5Jhh+MpChlASDBgxS5IaK6sbaJKraVklH6OLQl1mYkkBhq6UaA8g7q1CAMKzqkRLkRhUkFxCDTZTxMVvXOjPJCAHESmzB7ZTDUJlqDhjAsK90i5hnLa13X5WrUirzdWCZZjJewCEXKD0D4PYPuTSIWptHW5CtFAjH0agB1xUoIotlFkSAhQo1NMIkKOhQQTRsp0RrztCjcTFGyYk16qBgkoYMCAwgV1BplgnJShADIkQkInFCGaNPBW3p9snbv0fD6S5REwgQkzBRytIWaTND7quB0gH0ZaZVU8xWFU+5lqQDEGRo72ukceqgMj3tPfm1taUulQQ0OVFhjZWrWvepJnRnEuxCBDSjcJ29BMEKCnW6u1KtvO4l6TWs6+r8MamYdjMrVw11sNXriw7D9PJZa0wvgePEjREOS8VtLL13lpB4qloe6uC//vSRCEBNoN8RSMMNfDQz9iYYYluGHHfF2wxJ8sNPCKRhiU5pluzmLB/OiudwcUy4emRyVV0CswnrHMT5tAneOSslTFc2Oz1PcwdXJjiMfDRk6fLyQwOWT4qDwWFqckQqiqhiHzqHCaKaL7n90MvDFB9M4dnVTex8dJseOWb1i2i2N1+LHTtM6y8uedJ7IQUvkC90lCDZOodfKj4gZxBCS7mnznqusKvDpwrP2ln3ZzoOQXldIAPlQugCmgQECpprWkc/OUbg0lhXXGeZUUJp7mrUo/mpzp28HoHF4VJDAnEiNqUMfScmTPoY8Kxey3Y3OYz84O0h2mTkZIOGdPEhdUieTk7BekJAiExclE5plUREMJnjKbYge4gFDKZPIMEZQwQClNMiCjAhihFIYTIycUHSFENrl32fsToTwQzgyXPEoqIxOKDCNREuSLJwWi9spaycy2Xk09QdbL9ecL2ranu3C4rMTY8nKyaXpB7hWIvDY7c92dRZgSLsyWYje0x/Gk3iSFuSiEJmkPU9yKxcxZC76HiGI6+7B3jbRIJVhkWyLSBM3U0HNhKmKZkDqDis2WMIV10KNtciEsGUPojbtsrkyNY6tbZ84suMRFKNMlYuCqNGUIiEisI5QmIsIBYiPr4gUWWUNtSREI8tEGTRUovZ1JBDmzkNSRkBCZMLWVFjJVEcFzhG3CJwlQTOENznRDd3JCyKFWNnBRNKDMVX4l2Zvu8gx61K5ec1MXinOS0J2rCcX/LbvWfqi6q9PjO27w3m00awDC1HGITUjbCRAErZQQ2xBzTYV0HJvrwoRwmdfWkE1u4nQ8LrZZMCq6njRGodrnJVbOEoTZUDIw44iRCKBs0SldTbVGFpoMeSIBSQiOM5KlkDJGRPEqkyRyhE08FhQiNKvdkCJGKYKmYlaoEDpK4hlZiaGU5UVJipRt5BGTAqFIH0UIcsbPoEDckI3iWKLMi7a85WNTPMJyZR3a/NSk+qX2c9uKzNxpJWpSjGKss6so3m78lOpyg3CO+LrgglWtbCHnT5DFZK7A+UtXSAqiPq9QO5FYevmpg26qESlNe/jFWXzLwQYyhr0av2aOemOJxQRh4qYFRI2gOPB4VCkX/+9JEHQAGFXhFowk1cs0PiJRhiT4ZLYMl7WDTCzA0JL2WG1DTQhtggQDpg/Eif9Qk5OlAiIix5G6FH0DKNJZyO7aJUKkDxbRVBvTwhKxk4hTRJqZBdVz8NKkCk9J3yJmhRyWysyXE2ZDxy7I6FAc4UBkIGkDmB8UBInNMwiWJMPSCSp83umnIznWyUjWs56iy6MvE/HZaWWkVsYdcwhhUy8Z41mq7/9nz2tssqE2UVGXskiG8bHNwFLkjkM+BBcXl6pb7p6O8JwQSkX27NMj/ZGDdgL0IuoQkUfIsMDCSA24jAsJngYMBEewOemAoG0TKZohUpcUlCqRgIjzKxIeWPLxJEnITcTWI3KomZm3CEZDUHpTYUUJ7E5AdUQEZh8rZDxK0RniVjEIpk84w4+Mli/HwdFS5gPEGHYMIjBrUQkeQ0wjYmVW6VI1e9TXdeSmMrOVym4suik9aDB5eSyONo2RTsNapZTK83WsgqRhZ7/CMZbdRmlBOcNmqO0REwsaaJAMJny5iiqVKQ4NcGELmCXGbJGuDgkEgBWegIjKghdMMRHGeI7lvICIggFMmDeDdAeASeBiFo1DF6oZA4oOkcTAKJFNHlOZO+OMCQGNMYPE3gaPHJLMRx5l4tefGmqyinuSGVQ5TjE0LAg4G5cMKIsSe5hRyk84zSTv4p73S3ZU7Vk0GJ5NPEUTaKIaxkFIcu93zlzOwg2metTY16R0/xNby9d+hBWXrtjv727iOf1FZtutIk96QTRf7b3/vvPfXIEA0RYaHh3sbTIJkFtnHrhSHFTAsGFLg2pea+FKVdukzV4HbTDMyAWBjTd1oEAZgnAeQ3CgMuZxxjjhYRS1OYtiAjjLCCARYtPVP5ENwF5BAjkMHg1sinb/R39OcAkdhPN3ILpyqVh0eML849c5xt5syUvn626zXWj0nvJTxtdy1xdS+/aogoox04j+ceN0/WXHKjdQw/eTwvbkmTsIMA0jDh4WchdI0ahBtZb7B8Rn9/x7vb/8M149n3jF7HP0xZykoKANe3WA01RgQOBiYZlqbuFLEjjkHhBDiTpC1AjFN+cH9maAXnbKX7Bhw8KFhggmkMZQ1zzUlMOYw3VRKUoJwiP/70mQagAgnaMt7L2ZSh60Zb2Bm2h+FtyXMvZjKL7Dl/ZSOyIcfS5JUUAbJigaGYkuygXQn2oiFSQEO0NgpAEz1r5Y36rcYz1skh8TouB/CkK5keksS4+Aw0JOI5VKzv1Wdji2OsotycGHD9Rvoen7FGNxKbjOdYajniJ9xPNhJQrlIQo5D/NBwONTk7Zoh4M9z1bzjN1BllFTp/HKaJ7OCmXZgISpFe3uMFaPSYVQ9EZKeo193jtby1bRManxNPYeM0OjNinE+0VFUa5K6qgMtadjqtijOasFo+Q4UItLWkyCmfBglmds0ZEcrcLkq5U8ljbqQyVEyyOESiSZ9OKCS9U3R/YPaAVzJ9DisPFo8qvI4BSTnWUU0Ywik7G466c1AsQwwwwnJ+TvG/8P09ynp43bt49z1rP84pnl69886fTqXyzp/zIi6cKEhLITj1z/O5neF01MysoCKmly0Z/9Fp9/4Zcr/MJM9Q/y7OhzZX4tq3XCTfjzWSip2hSSHYgAAACT4LAJhMmIACmTK8RiAhy1yeAIGOwdJYWbIUnwABAYvGxpx2M5fAjNExgccsddrFEMIaQqQRNyUaAAClw6FGRYELkwEn+lUHErgW47CCCCGSM9YNAoxDlCLUfjsnioL6QkbRqSxKzL6yZBgLBP1cspZIKxlho1kXMjYVqsVTcX00z8ZYiP1h7QRSqHLZqXAmuBYCg0C0BDAzdJ8Y4BKP5V9cWSMhBGLC/2jyZlw0HFIpXrhIiODwrvqMToCONg8OX21l2/pTv6UKy1E442b3qrQ51xOf7GpmjK5J1Td7a/N1j/bNOq3MG/ClqMTnYmJmN//ZQ/TVMzWM4hQigCpqUtLEASCUUqTqHEgqaH6mOOBkEjUuRCDHKV72tFBt59e3rudNvG9ZfqHG6aTIVkeRQUi+KxNJtiiBMfxZwzxELVXacJ6efuX+RXT5P9YZGXtzM0/EJKZT6+yAwWkI0zVXeiYlu5VTiIFNy/p23ZAd4YrePeEriAP6CCAIoAgsG2//opaaFqZUDAABmzRsX4AN4WMOkZBsVAFYA5FlQaO7bJWXJWmOMEDMMKu30h7mniFSExnlRET/UeuOal215GpNGC5//vSZCAACFhySnVnAAKUi/mvrEgAYAoZTfmpAAJEKOj3HtAAK/zYEtlLY4slkDU1OJQzCCXWYdAcZa3LY5E52inXmiMNpmQLK8r1DJZQx1TRUr+M6lDVnYv3KKz76UtDyTt0bixGPNyaK1/s/MY0j6u/KM60bfR44EgmTQAjzNUl+pafR7Wtz9HEnEguKW4nMsnbWIsglsYdmCIKo5icfKRPLuHr8ZqbpJ+GXffeL3J6xvedHlrtyXV7c1c3ncqS6hyxs3JRhbldiOSuxKd1al+ipc+Ut6b1zf63btW8+759TDmXNVPAJDUPP2502JRb3L252StQIBU/QkBQYk0benIabj8L0JhAqM48U/uHpOH5A/wkQZaIaQYZ4IANkDRReKQ+zVh3itSbGVJEtE8YDqJksGyCjiZkZPsq3WdVXt7oqUzfb7ran1dTVb0qje1kFJupBWZmiaZcTcum1NdSKkzhuiyTo1qTTOpm9abO9NNmTdBBSbNdToqSSWo3jDTnb7fRLdvbbOrYWYWCPtarVxiQ/prDTIQTBhUaaualVRU6ZxELYBI5xKxk5mjAkIGUHUITilw+ghGILD+K3F6BlAW0Dow2YG0BsDIlwTqeFvNhxkQEERAcUsK1J8WMkC4OAcaIzaQjgXOQMdwuAmiVIm5BhwlwliuoixXYWQTiY55PjeMjUwIoNMrmZAzc1Mh0EXGGLnK5OD+fJ53NThZSMCKrRSJxNM2lNKpkiyM2UzI0J83LpcLhdNDpo5YKzjNl4ixaJ6eRNRWgyCkCYLjoIIO5MGB9NA0NjiakWUoiJOIm5ock8gs8Yrc1Yn0GJxnTUgaLcrnP////////9BTOyc3OR6P//h/v5jkeBAqQgCRmJH23NdhA8XiM4qhif3o4T1GxcAkBgUk0ysxJYzSQOEFIrPDnNlMO0pj0YtJdM3vTjkMy+S5ukydaqvOF8zNyUZ2Uxi9+gi6BcRNymh992+11KRclzA8QCTKaS3d7+1SlUPL5vJQ89TIMiXETIHYwRV2d6QfNHwATHGD/////gQABsLBiy5WIusR3QRIiSVjSYCTacJdmu6DK5KWC0pnucZmz+042oQTeNHF3XKD/mwrg5zr/+9JEF4AGSWpV/mJAAsZNao7MPABZWhNX+PaAAy5Cqv8w0ABhjQEsBRBjimarpEGC10MCCcSkXicJ42KSyJksKREHBxw5hPGwypmxxSS3GCRAWSQAhSRJ4yNhzBkDNy6gZJulMRxixDYHs1PKIaxcNiOOnDEnxmFUSfIEPkZQiI5RNrQRXdV3OoFI+teQ4dZgQ0oHUkkTE8yLJmLdSkVNr+bGBudpoNoplw1J67rV96ldq/2rskdQWyRkO6IK5dvFTeIqkAgBJTKgArDiwhEOrB0rSS8wdZG9GoRJXOiUW5WiBmscacGyriqV2YJKAQwiBvN72tKrZdSCEsx3DLtXRUu1KkixSlbPOwy1Ys2gyqBSq1saVLfEZkQiDhveRnz5cTKYSdRnAzzXswvXB8+pDmU6csw2Oc6iUjIcB6m3MKDnH+czwdN0+q/KuQ1dH62Nv8RhbMYtv49f9d97fX//V7luvi2tarDlsbFXr/////6x/nGq//+v+PEka4EGBHfQaUwSuZlTGTMziIqkWu0bjSDYrLwhKkLavLsfLUJuXEfKaY0PFxZZmUYQmHB0ABOUDUkCTEvHiRhwjJNiCWqIZkTCTMnPMakogPM0JAtHgRHKhPy4PQuDgJA0PF4lUC8maHjY3WfOGjlypBAulBTHpONRvPGqBiZzEposploGyCZmorRU6TumpAoGZuOc4UDU+g6boXQQLiRrSN2QSUmS6CKakHQYuHiUPrdkEE+t84XTI6tB7dSDuWEmbl9Ogg3Tf/////////Y3MEDQMc/mZlVkzc26MyJdnG22xEdDefmknLEdHDxZc6nC5U8WHw2xHHk6F0DkFY4Ab45DUqCpjjHiRigJSXiA5EHeSRUVktLDQ1JR2JQnEMcgzHzIvmBID0JRBCkZJGTzBA2Rc4gkXDFkDQxJRSj1SJLsarRPGhfNzRBIsTUbGhmSaRNLqSdI2TUo1JM3EzJhKFiZo7OhNDY0QTNd2UqiS5oimgYILTmZ01UpnQP7JqQWYGCSKKnbXSMlm5fdk9t1MpD/////////ZIuMXGKHMMWqqqqqqodndETuIkgAAAAFgM1cKGG3DmJ+RJ0sR/uSTHcxRDoUobg7Tv/70mQUgAe9dlZ+PwAAjE0K/8YgAGCiKWP5l4ACLMStNxRwAaRx32IM7awhyl8ZfF+I8xN3VyMDZVHb7vWJikmmTIBmUw0svVyNUFLXrzGsbMneaUr3fqU40sZlMZyu/rnGmO80zO48LbWca1utVjOe8M7n4U8WlrIYEZE3RHpWDKvcrWqaUxhh2fLT7S2URy0/BVEnymvCIHuz/3q7x34g/8PX8MccbGdLPVKPW/5T5yZ9JtyL+NHu7cvYW/n5rVX9fzHW9fvHHGelV7vO7t71rLe97gqH4jKZXjW5vD7d+te////////1WpvPAqRSLjP4tmZmZmZeVMwhtbymSQAAADQ/gHwrnBXCM9Lb/K42tpBlCQhD8kShIHpI8yD2pv2o5BQPypGHrLWtjYD49IShgecFHFFfdW7h4axQuHllNd9VNX+fBdrRtHr/HDRzCXSw4iC8B/GMYSixpR9Sv9zSz/8w1CYRREHzFRz2nBUN1XH//Uf/f8fxJ2mdvogTMzMrMzMPLk5D2YQSAAgCBjdtygQlnWznFYYe+G2RRe80yHIusAr1cSMxwkIMpJHGyrk0RxvCFksSCjdHhOQcTM40cnBMAWS22OoifPMWQhgh90mGWX87B92j2rmeysppkYELM1jRqEEx3umoDJiIcd2A6EeoDHesxezOAPxIaYpNFzis4MQuDWZCVWh2IFsL6OcMHY9B/lIZqPbYeH9nm6V1l2hbhBniIW1qtuVKkLghjtnYk+yqVWN2923vH+//96W0wlHltxH+L7rItQVAYClOdvVUyyOssBJDnPxCFX//////////////u8k1feWfWd//f/////+3+s7hs+WN3R+3KvDIP/4Px33OBwAAQAAgCBzxmDlUOC8EJrBvFvNKHuzmY0PAUg4zMx554+RCMcZ5cwxr2OV3/M8yOs6F/ZZmeo8aqkHUke3+N0Z10YFwqGouEcmXH6ojGfq5/GjGHHkCDjQSBoN1Pvf/+ZPMux7mdXVgnF7nklGxpEePNf////9j+c3//9zp6zHYxDCDiKqqqqqqmkNSEkWlCUAgCChFOQALlj9zprpP0lbnCrUvR5uym5MgPoy4SldvVYN0m9G6PdyV//vSRBqABiVuWP5l4ADLLatPzDwAWZYNX/j2gArxsyw/MPAApeydF3Hyy5bW17mPhsS5CD+FPia1S73FI84sKdskGBznzqSz5/E2+eOVXuLp4oim1rW4u4cb19IWHNlNF7RuxGtXNK/fzvUzdL/4NKuhhJ1OoTEfPoVon3jON794MHWcarr6x21POW4LYaXlXjl1JvWIeaVtWE+bqZ/9/vHxqBi2q4z61kd23nMFW5iwqwo17u7u7uZrM6q1ulyTBZKSaWpvZIHXmq5tiqYtLCYVt6VhbMM6mQhx1yHSh70+CClvmP5Tx5VKYy+SEbKNjJlcqlxcpVYfYpDIULBBdOCkPG0SiOJypVaoGJmaX0SIi3U7LJOpG6HT3Q4T4m0Ce2ousz51C+JI7Cy1wntWV2fjecZviaJ7Xxl7AXK8czaaKE4fRoT7OqWmti9fV7B29i/etWs178sJPKJinPZW0T0HG4suJqZkhRs/49b0zi1/i9r/7tnEa2843SuoOJs3Mvd3cqZp0VFK5k4SkkoNpZkiLZoGyWBGxRJArFfMiXZ3ljRC6l0WBcC1jiYuEuI0MMPMJuSSZ86VDqseA1GCKxkGzGZeOnTUyWiNo7DxoxQQZaZsVqOVmI8DUYcvDADWizoIGZNSo0UWUPAk0j47C+oyc2nE1GKCSkHdI+sfzY0NUx7rH8hF4wsZmh1MxMkDNFTubTJJkBvdzM+opMeGENUkG7uyBdbUmomGjoGSJimy2dTzNx7m6ZfSQTdlm//////////N3iNPLGSde52Z3b2xNsiyWyFsABFsxCR59dRHdsryQJYV+Cn3b0rizXmmMJ9JQLUPMm2E9Bf0hnIdKETq5hbnPsSu3VTslOwwmF/mJpqZ2xUMkByVz6ZvnzjONTxIEePMn8/dtVlvT4xLSPnMkBWP9WzbyfwdY3bd7bzDhRKz3lhz2h0+ffNc13EzrdbWjTYVe6S31CrVwg4pe8HGMyywdb/1aNa9MfWc/FdR49IjPvUeSJHtqHH////8E0BEDmhACDnd7Jnv/sxUQyJySQlEFFEhAiZMCeqtFhyTyIXeChmXLprgY1A5VdVGHqcAyIHxArwfkRouxnB9ALAKJNH/+9JEHgAGPG1Y/mZgANINyv/MSAAZnZ89/YeAAyO0J3uw8AAGUs4QUQBFJEBIk5MlU/ZInyKEDGiOckTRPGRkhNUVjyJ1IwpkBJ0mjJzc1WzVvMymThXIEYkwtlLpG2lookFGOFnkPHgvEyVRyknoskt1/7EMJciBOmhLkCKZFTMc0vF44pVbL0i7qevmBqgOURY2J4miLLQMjchpQ6Kv3f//5WSSWkYoGKDpF46ku7yYne66tEUyJytwhAEAgBDobBrSWljLBSCApHJ/lS2SmUqYG9MMxcR6AvRDjImRuojLBaIQE4XjJROjQD5RTkCDFEc0kTd0FFYhwvxskSNiaPlJ0Dcu2GAJRTWM6RUyMjZSJig04dSNimQwh45xDRZiNLSSdSddZVFJD7HSQwrj+OQQZ5ktFa2bWqk9y4Og+RMdBFyaKJaICOaYOitqLVObGqSjZFbcmiaJonyLF4kxzi8icPmBMkC69aKKldfV/83MjI6sumSJeMUD5Mux3+zclrx33KmCKJYJUs3EfLyKxrUFZHtwBK/xnYiEztkhdlDWHWsl2SzmSphAlVGavgxHE52FkTpytr+rYd5yvH08VnrRdMNtszNWSAzSN96Q0jEf7g+E1MTCnZmJ6+9X2rYzEhXth1LZibrW89m+afwaSPbT6niRJ2GJNBreDhPMz5QwXFcIphbk8xaamyBCcnkWBD1I33fvYmMQpH0sr2Lre3GAzSsMLvVS3VxMqoGZ3t9UmewbZq9gq2JuO2x2GC9khWgK4FUccHXuunfJPa0Y8btShwCA1my1hlQXYF8KVHHAj7CwUQaIhzZypajjeaySJLMSHNqa2frj1dCTMdGNpKX6lTrMiT9cokJVQbSYZdK6MzuDNHq9eR7dWxYrM2wm9ub0wqmZ9BfbiQbRrR5/NZ1IxK6fdIUDU1ZqPZmasKV5GvXUWsFye5xnOG1OvmVPzNSHM17WYWzEPWXl40XvbQ2WtbafRsXhR8bYXGuaR2JVG6yPXUVmYozLCvjeY+r0pEli1rJr0zWuLagagnXe2dUJhRmYapU5mamqdSBBRBcvW26IPFiAlIDuKMHEQCq12XwGtwWM28jlRwHQuEE6FYnHqP/70kQWAAYcaMx7DEvwwE0pfmGGrhlJnR9sPNXLFrQkMZYluZa+vMyFg5FqjBPBiB4pmhOeUGLkLtf6pVMiSkMnDZLN7qrS0S0K4UwxrFuXYXNddyBZEi1EYfaHJsKqrCJFiZlqKGFmbxbxcmIWGlUCPRSCwJMFgTaBkWabIpLNEsUSSB4PBolguglupKSIXY+kUhTJg8JicGxCyStyPAloyQmUQySy9RJfUFpNKMNLPgyxRYQs9ybX306SaViZmEERACve8D4FxjLhY4KiOkCKu03kXbAkFD8nlUOMybO/NqLuk07GzBsao0yoejbIAbhCOy9QTkamJg5oSkbRyTUbpkhOFa7z8I5CUWqrfeXF4+qqplpi/y04rUms/zB9St/ouZvdiy6ylhK66iozq0mwmBa1dHV7IHjkGykrpoIX6pkrLsHrglEAhI04ijM5/WxDPLzOI/omiVJYPQSApUyRfp8N3ZijYmW5F3kkRP6ZKTqPOJS0elQiFrBcJxOvEADOalClajcOoEgcWVwfDliA+vzqt/aZ85ZXdmafOlr3ZKrCME4S0QSleHeXlOZVTef9YDhd85J1lXj+irDOTlQ7gtEipTEA6V0hTD30KK+Y4F7UaoLDJZmW9qZq0yMMXXh10woasNrDlZozQ2ZJK5HobCjtzOcMCFD1KlLK5yXCeKahcrTwpmJ69Vrh4+kajRxaiZa90q/qV4o6bJDjPCAVQoUvXUcVthONBrzulSiSUGEqrokE1Ep7mBqalRD0Fs6XpJmbuib9NeyCADUVJaeuDAwJCaTimiIXrt3LkSip1HLwdFFhwSRObUtOXLBBLIwBmJ5+OJEHIpt1OcTHkRGOnT2rQmniUk3Pn1jRgJVltJEaJB01KNGj/bW0M40YXTpHRYs1KOTiKSVlo6JZ0uVQmWEnyIjvbImmxSywjChKQismAyOuXMFQRzGElZKociVOH3krMV4YyifNERLKc6cRokbI6tEMoVkJLpMs5NpptZErBdCVZvXwltotaWdzrakX5zvd1uVt+tKfSgpHG4gMQATswtKXg00PBgxwUCqmXDTY01Ja/mOPZe06NRnd47Sph+QBKAyKROsKjw/cSE89qdLh//vSRBwBFbRwxuMMNHK4rLjrYelqVx3tFyek2wrtuuLs9I85DBossND/UmF5wx9JddaCx0fxlcxX/jaWCJml0zdNuVVNVlb2pd5XAvVHEKSQiTIRMmHQuxZocoQREwmgSs2ExQUJmRRIMXBkkTdU/IISjFsaT3TjWxPJInIK68mEX2shyn+mu0tsvkf/D2lJnN1sdszMtl3Cdrx+yFJhpaVwsOWXOxLjOXIAVrZuoei6IiOilcy2PO+u54p9+DEY1GzbJ8ZdlJDX2GA4o5lScFgdk1Y30WRWQvslmINoQVFLKomMJuIIMKji0BCvq4MtlF0yWmJIEij1U00NGV4t1DUlpWk9kx12NQ4kkiihxmGEPRZjaPQsGkSMh8dMmUR+C6hdptBNZKZepMoWIL3G5tZl525HCZljFpJIEpvZg7pppPRxUymZbB07/qJF+xeozy8OeLUjtK9evKILXvISJqh2DSLqFssJMXsQdSAcojDm+c7eN8PDgpZTIckraCuWBM9QIS7fvI6pxh45KgtzxmUsKycPilUfbPGUJ1s04zUmoto1SV7Uoo5IG/OL7Mk70YpJbRHXbmqprsWdcjshdORqK5ZtqxCXNkUU9pVGQoWJuQtTXUUieMSkhocegUOgoUVmhcHKzx9/1WlLSKowtVesNNZKWdou6uNNrIZ2Roup1EyJfHhPoPnxUP8z52yM9FWCJwCWilEVKQjkO1ZeLuMDhP9mi21DpfP8lVzBMgnL5uXT5pXbC6VEZ6nHq5dM8WE7JSMmROEaTLlJLolZA1RkgI2QrBCNE75kJK88tYgIZihvyKLui22G2UJnItM+7ndpHjxWQy+w85VCskigGYnRWkvSS8qXPE5GzUqfmK4dcslTdLWehTZlNGk07Mg20TU/US1vSkbEpMajKMHZdLNWgQ4hpRH0af3cUhA4RbXHf2YFxF88w4yuW6InHJMVBVbbjVSwDFMoNeGLwkCDSreSBYtLprdTLWfb+VL9+Fx+xVsymB5x9HccbOVMlQHaWXQGBPAP0TBkduYqeWDymCPHDMTV1BSEWEZaJLTKWcyTG3NIDaEgTmqmUT21evLKpqcUN2xS2K1c7iaZxdCibyqqMo//+9JEOgAVRnvG4wkd4q5OmLw9I75V0dkZh7DPyqo94rGEjnmTs3P5SjgjYvZhide1a7KFPTGUWooUPGDXpQjJ6BsJduSUXsOv43/3h9O9zsPmbbUyWCDamBbKSMTKgAmm4fB1BzErE1DSdQV6E5Yx9ax8YiKFKo6iNy8nmeHJp8uxQYE6yuiYESBGcFa6I4UD7AhbesIleQ+kdoWpNG2EyBpYOvEEer5Q6HIlorp9nE5Id2S1JIrdKdVNK9bcgaLG7SZJASR1CSeyiZZcltqxSjiiBSCLUKyyaeocfeylatVnQUEoo1cNmdC7S8V3llilhRuyxhX1wfvayFmE4IYlSExgzbGWpwy4opE3KIrKfCPCLjjL0F2E8Xg8k64RnF9rG06GoSiUdlgSFbi8rEw68shFZ0qO0bbN+aLhbPyivbIUaXjuThD9plxKViSsyx+bXip8rj2Do5OJkKSQZIUtEiqSJlNdeDv0kDqdgLam/VRBE84Yc1mFlQgQdrJHJFvG1uRLy7v7lLaeOuv0txaVZVW789N/XcqKMSPxOkM17V1dvttL/d8+ezxr129wX1T4OyxgXmCKRZcDAQmI3Ax7jw9TQpwYZl96Iu3M/v8sKW9DjnUUt0+ugJiALzE8BCTkZEFxCOmG9RPIC/MvojZbTQMsiKajydJNxUqraVrbN8qxy0NQl1mIMLtrrqlofULBHVKqRWTVWUisr9PARBAjIMMY5rnSMoNxyJxBoJWOGoMszaOgImo3K5wxfBnZFU03ccGZjo1zk6HM8lsCGHUSa0qkctUnUIY63OGCHcfEABvYvZVQIOjsCuIiOTKTua+7Djy+7OzOv//vZclDoReItLWBE2F0JS0Oitb1UE8GkpkV4rXgM061Iy31U5LKEdWTBb13HTHDte2870KAjZeWLm4UNc80hn1fslSn5wv8nZePq19yl2tnIYGIkyYwMWyWotuIxuxFqQbC1vFxmHY+pXv8h/Ht20xexM1d23m0vX3MZB9e3s7ZIftbtuPdoYzw3bcak9euvN31cTvYzc56gS024AgbmynBD1UlcK1vJhNLVIdnJZQjVccFQsrEhccKv3NBkdII5pzSFlNHE+WmsBySeP/70ERyADWDfMXLDDTypU94qD2GTlXZxRuMJNWKwL3iYPYZuSZYoHOgYRMLgBg4+SKZujZjbe0bTOvX1NClZqogwiecYsSC3OaV4RIGtJmbNCMHQe5MGZTloYdZySTIz6QVTmO++Nr1hTm3m56aC7jCs+z373LpZ0ot/lp3LxLuR2mLyd2/GotlYNzL/aq8/Mdm19kbUG4m5Le6pmcrprJjDSUV2GMhsW68Uq85P16lP25KJ+lnoepIy06DKVh4LgyHmhSgZG2F2kDxQ0QkwZOikkWZULraUH2V6xRe1nkijRA2bQqLCJzCFd7iBVtbVU6SgWHyFbroKnakEtRspQarIvToe7o43EjnuZbdjNYuVtMkmem1aBRMVsSVL20mPnS3cmcQJs2tuV9Z96K2ds3O7Tk/W/p2vGenxL1G/4sSyU9F0aCrt6hSKcMYWwV9EL6QP2AxHi/f7TL1UUVrYD85J5qYlahVGkcHVp6VCCTnTmKnMKz2NpxutH1yc4WoZKcYWrV0O5chSRgmythI0QekNmUbSwvkLSBB5EcRcqno8fo0KJFmJ9bHL9NZHTF6ayLaycokkR0hKJL0ivSFyitF4q6SY2YdkqK3Srx7U6tRPMne5sqdvWmoXqHeTndqa0mj+Oy6iWtjfXQ071bF5sHTalSZBUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMAuxLihGKI8a5k0YYaho+tbcF7aFlJH/+9JEC4/1THlAiekz8o2pyDYkw+RAAAGkAAAAIAAANIAAAARK0LOkJmSJEqS4qhwifmkLApcRNRpMlSQwInkLiKYpmKWSImTQsrMoSwaTQspEREoBLBQkoBXrErIolAI9L0aidstJRJyOHazVTkcJLI3Laaolst+blPmnWi2y1etNUSsjjThyTkZYlBLfOUxIUsjnb/+YotRK0XRrcZ8OiqeW37WzlP9N01E7Z/ejc5yyODLSm8Aq1UgET1RSNCZDFCuhxZFcY5bMJb/aFNnxWJiolInWcEwhdsETKJqRUlIiZMinEhYAMTgZGnItQwS00iWElBRpFiTuUOBVaxJ3KWRMWRFLJb3ROSsjZFrz1pF0Yf/8Pqw9qWTUmh+ziQQqCqbklmKu/8d+a7KKN/Uv/xLC6aKyCSQLkcKGcOBYWT/+xVEqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";

        this.audioBuffer = null;
        
        // Initialize the Web Audio API
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();

        // Immediately start decoding the text back into sound
        this.loadBase64Audio();
    }

    async loadBase64Audio() {
        try {
            // 1. Clean the string just in case it has a data URI prefix
            const cleanBase64 = this.base64String.split(',')[1] || this.base64String;

            // 2. Convert the Base64 text back into raw binary bytes
            const binaryString = window.atob(cleanBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // 3. Decode the binary bytes into a zero-latency Web Audio buffer
            this.audioBuffer = await this.audioCtx.decodeAudioData(bytes.buffer);
            console.log("Base64 Audio successfully buffered into RAM!");

        } catch (error) {
            console.error("Error decoding base64 audio:", error);
        }
    }

    play() {
        // If the browser suspended the audio engine, wake it up
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        // If you click before the decoding is finished, just ignore it safely
        if (!this.audioBuffer) return;

        // Create the instant sound source
        const source = this.audioCtx.createBufferSource();
        source.buffer = this.audioBuffer;

        // Set the volume
        const gainNode = this.audioCtx.createGain();
        gainNode.gain.value = 0.4; 

        // Connect to speakers and play instantly
        source.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        source.start(0);
    }
}


// ---------------------------------------------------------
// 2. Main Execution (This runs when the page loads)
// ---------------------------------------------------------
$(document).ready(function () {
    // Create a new instance of our class and tell it where to inject the menu
    const myMenu = new MenuBuilder('#header-placeholder');
    myMenu.render();

    // 2. 3D WIDGETS: Only run these if we are actually on the 3D page!
    // We check if the canvas exists. If length > 0, it means we found it.
    if ($('#ppi-canvas').length > 0) {
        
        buttons3DInteraction();
        
        const powerIndicatorStick = new PowerIndicatorStick('PowerIndicatorStick_id', 'PowerIndicatorDial_id');
        powerIndicatorStick.run();
        
        const myRadar = new RadarDisplay('ppi_id', 'ppi-canvas');
        myRadar.startSweep(1);
        
        const azimuthKnob = new DraggableKnob('azimuth-btn');
        
        const clickAudio = new SoundController();
        $('.custom-image-btn').on('pointerdown', function() {
            clickAudio.play();
        });
    }
});