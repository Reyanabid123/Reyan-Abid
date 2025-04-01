// ============================================================================
// GSAP & ScrollTrigger Interactive Animations and Effects
// Author: [Your Name]
// Description: Enhancing user experience with smooth scrolling, interactive cursor,
// text animations and dynamic navbar animations using GSAP and ScrollTrigger.
// Optimized for performance and SEO.
// ============================================================================

// Wrap all initialization code in a single DOMContentLoaded callback.
document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------------
    // Restore Previously Saved Scroll Position with Fallbacks
    // ----------------------------------------------------------------------------
    try {
        const hash = window.location.hash;
        let scrollPosition = hash 
            ? parseInt(hash.substring(1), 10) 
            : parseInt(localStorage.getItem('savedScroll'), 10);
        if (!isNaN(scrollPosition)) {
            window.scrollTo(0, scrollPosition);
        }
    } catch (e) {
        console.error('Scroll restore error:', e);
    }

    // ----------------------------------------------------------------------------
    // Save Scroll Position on User Scroll with a Debounce
    // ----------------------------------------------------------------------------
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const scrollY = window.scrollY;
            history.replaceState(null, null, '#' + scrollY);
            localStorage.setItem('savedScroll', scrollY);
        }, 150);
    });

    // ----------------------------------------------------------------------------
    // Register GSAP Plugins: Ensure GSAP and its Plugins are Available
    // ----------------------------------------------------------------------------
    if (typeof gsap === 'undefined' || !gsap.registerPlugin) {
        console.error('GSAP is not available.');
        return;
    }
    if (window.ScrollTrigger && window.ScrollToPlugin) {
        gsap.registerPlugin(window.ScrollTrigger, window.ScrollToPlugin);
    }

    // ----------------------------------------------------------------------------
    // Mouse Follower Implementation Based on Device Type
    // ----------------------------------------------------------------------------
    if (!('ontouchstart' in window)) {
        if (window.Shery && Shery.mouseFollower) {
            Shery.mouseFollower({
                skew: true,
                ease: "cubic-bezier(0.23, 1, 0.320, 1)",
                duration: 0.1,
            });
        }
    } else {
        const follower = document.createElement('div');
        follower.id = 'gsap-follower-mobile';
        Object.assign(follower.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
            zIndex: '9999',
            transformOrigin: 'center center',
            opacity: '1'
        });
        document.body.appendChild(follower);

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            gsap.to(follower, {
                duration: 0.3,
                x: touch.clientX - 7.5,
                y: touch.clientY - 7.5,
                ease: "power2.out"
            });
        });
    }

    // ----------------------------------------------------------------------------
    // Complex ScrollTrigger-based Text Animations
    // ----------------------------------------------------------------------------
    gsap.utils.toArray('.animate-text').forEach(elem => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play pause resume reset",
                onEnter: () => console.log('Starting animation for', elem),
                onLeaveBack: () => console.log('Reversing animation for', elem)
            }
        });

        tl.from(elem, {
            opacity: 0,
            y: 80,
            skewY: 15,
            scale: 0.7,
            duration: 0.8,
            ease: "power4.out"
        })
        .to(elem, {
            duration: 0.5,
            scale: 1.05,
            ease: "power2.inOut"
        })
        .to(elem, {
            duration: 0.5,
            scale: 1,
            ease: "power2.inOut"
        });
    });
    
    // ----------------------------------------------------------------------------
    // Smooth Scrolling for Anchor Links via GSAP ScrollToPlugin
    // ----------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElem = document.getElementById(targetId);
            if (targetElem) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: targetElem, offsetY: 50 },
                    ease: "power2.out"
                });
            }
        });
    });

    // ----------------------------------------------------------------------------
    // Additional Global GSAP Animations and Page Elements Loading Effects
    // ----------------------------------------------------------------------------

    // Navbar Entrance Animation: Slide and Fade In
    const navTL = gsap.timeline({ defaults: { ease: "power4.out" } });
    navTL.from(".navbar", {
        duration: 0.8,
        y: 50,
        opacity: 0,
        delay: 0.2
    });
    if (document.querySelector('.navbar h2 span')) {
        navTL.from(".navbar h2 span", {
            duration: 0.5,
            y: 20,
            opacity: 0,
            ease: "back.out(1.7)",
            stagger: 0.05
        }, "-=0.5");
    }
    navTL.from(".navbar ul li", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: "back.out(1.7)",
        stagger: 0.1
    }, "-=0.7");

    // Headline Animation for .holder h2 Element
    const holderH2 = document.querySelector('.holder h2');
    if (holderH2) {
        holderH2.style.letterSpacing = '2px';
        gsap.set(holderH2, { opacity: 0, y: 20 });
        gsap.to(holderH2, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    // Scroll-Triggered Animation for the Form Section (Left Box)
    const leftBoxHeading = document.querySelector('.left-box h2');
    if (leftBoxHeading) {
        gsap.fromTo(
            leftBoxHeading,
            { y: 50, opacity: 0 },
            { 
                duration: 1,
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: leftBoxHeading,
                    start: "top 85%",
                    end: "top 60%",
                    toggleActions: "play pause resume reset"
                }
            }
        );
    }

    // ----------------------------------------------------------------------------
    // Initialize Shery Effects for Big Images and Mouse Followers
    // ----------------------------------------------------------------------------
    window.addEventListener('load', () => {
        const images = document.querySelectorAll('.BigImage img, .SmallImages img');
        let loadedCount = 0;
        const totalImages = images.length;
        
        function triggerShery() {
            if (window.Shery && Shery.imageEffect) {
                Shery.imageEffect('.BigImage img, .SmallImages img', {
                    style: 3,
                    // debug: true,
                });
            }
            if (window.Shery && Shery.makeMagnet) {
                Shery.makeMagnet(".magnet", {
                    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
                    duration: 1,
                });
            }
        }
        
        if (totalImages === 0) {
            triggerShery();
            return;
        }
        
        images.forEach((img) => {
            // Ensure the image is fully loaded by checking naturalWidth
            if (img.complete && img.naturalWidth !== 0) {
                loadedCount++;
                if (loadedCount === totalImages) {
                    triggerShery();
                }
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        triggerShery();
                    }
                });
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        triggerShery();
                    }
                });
            }
        });
    });

    // ----------------------------------------------------------------------------
    // Drawing Canvas Implementation for .testYou Div
    // ----------------------------------------------------------------------------
    const testYouDiv = document.querySelector('.testYou');
    if (testYouDiv) {
        // Create a canvas that covers the .testYou div only
        const canvas = document.createElement('canvas');
        canvas.width = testYouDiv.clientWidth;
        canvas.height = testYouDiv.clientHeight;
        Object.assign(canvas.style, {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '9999',
            pointerEvents: 'auto'
        });
        testYouDiv.style.position = 'relative'; // Ensure proper positioning context
        testYouDiv.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // Low-opacity black
        ctx.lineWidth = 3; // Default pen size (for desktop)
        ctx.lineCap = 'round';

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let totalDistance = 0; // Accumulate drawn distance

        // Resize the canvas when the container size changes.
        window.addEventListener('resize', () => {
            canvas.width = testYouDiv.clientWidth;
            canvas.height = testYouDiv.clientHeight;
        });

        // Start drawing; cancel any pending fade-out.
        function startDrawing(e) {
            isDrawing = true;
            totalDistance = 0;
            ctx.lineWidth = e.type === 'mousedown' ? 5 : 10;
            const rect = canvas.getBoundingClientRect();
            lastX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            lastY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        }

        // Draw on the canvas and accumulate drawn distance.
        function draw(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            totalDistance += Math.hypot(x - lastX, y - lastY);
            lastX = x;
            lastY = y;
        }

        // Stop drawing. If a significant shape was drawn, snapshot and animate it dropping with a bounce.
        // Otherwise, fade out and clear after 1.5 sec.
        function stopDrawing() {
            isDrawing = false;
            // Determine if the user drew something (threshold can be adjusted).
            if (totalDistance > 50) {
                // Capture the current drawing as an image
                const dataUrl = canvas.toDataURL();
                const img = document.createElement('img');
                img.src = dataUrl;
                Object.assign(img.style, {
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    width: canvas.offsetWidth + 'px',
                    height: canvas.offsetHeight + 'px',
                    pointerEvents: 'none'
                });
                testYouDiv.appendChild(img);
                // Clear the canvas immediately
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Animate the image falling like a ball with a bounce effect.
                gsap.to(img, {
                    duration: 1,
                    y: testYouDiv.clientHeight - canvas.getBoundingClientRect().top,
                    ease: "bounce.out",
                    onComplete: () => {
                        img.remove();
                    }
                });
            } else {
                // Fade-out removal after 1.5 sec of inactivity.
                gsap.to(canvas, {
                    duration: 1.5,
                    opacity: 0,
                    delay: 1.5,
                    onComplete: () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        canvas.style.opacity = 1;
                    }
                });
            }
        }

        // Desktop events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Mobile/touch events
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
    }
    if (testYouDiv) {
        // Create a canvas that covers the .testYou div only
        const canvas = document.createElement('canvas');
        canvas.width = testYouDiv.clientWidth;
        canvas.height = testYouDiv.clientHeight;
        Object.assign(canvas.style, {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '9999',
            pointerEvents: 'auto'
        });
        testYouDiv.style.position = 'relative'; // Ensure positioning context
        testYouDiv.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(219, 219, 219, 0.75)'; // More opaque black stroke style
        ctx.lineWidth = 5; // Default pen size (desktop)
        ctx.lineCap = 'round';

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let fadeTimeout;

        // Resize canvas when .testYou div size changes (on window resize as a proxy)
        window.addEventListener('resize', () => {
            canvas.width = testYouDiv.clientWidth;
            canvas.height = testYouDiv.clientHeight;
        });

        // Start drawing; cancel any pending canvas fade-out
        function startDrawing(e) {
            if (fadeTimeout) {
                clearTimeout(fadeTimeout);
                fadeTimeout = null;
                gsap.killTweensOf(canvas);
                canvas.style.opacity = 1;
            }
            isDrawing = true;
            ctx.lineWidth = e.type === 'mousedown' ? 5 : 10;
            const rect = canvas.getBoundingClientRect();
            lastX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            lastY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        }

        // Draw on canvas
        function draw(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            lastX = x;
            lastY = y;
        }

        // Stop drawing and trigger a fade-out removal after 2.5 sec of inactivity
        function stopDrawing() {
            isDrawing = false;
            fadeTimeout = setTimeout(() => {
                gsap.to(canvas, {
                    duration: 2.5,
                    opacity: 0,
                    onComplete: () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        canvas.style.opacity = 1;
                    }
                });
            }, 2500);
        }

        // Desktop events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Mobile/touch events
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
    }
});
