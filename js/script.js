document.addEventListener('DOMContentLoaded', () => {
    // Scroll Position Save/Restore with error handling.
    try {
        const hash = window.location.hash;
        let scrollPosition = hash ? parseInt(hash.substring(1), 10) : parseInt(localStorage.getItem('savedScroll'), 10);
        if (!isNaN(scrollPosition)) window.scrollTo(0, scrollPosition);
    } catch (e) {
        console.error('Scroll restore error:', e);
    }

    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const scrollY = window.scrollY;
            history.replaceState(null, null, '#' + scrollY);
            localStorage.setItem('savedScroll', scrollY);
        }, 150);
    });

    // Register GSAP plugins.
    if (typeof gsap === 'undefined' || !gsap.registerPlugin) {
        console.error('GSAP is not available.');
        return;
    }
    if (window.ScrollTrigger && window.ScrollToPlugin) {
        gsap.registerPlugin(window.ScrollTrigger, window.ScrollToPlugin);
    }

    // Setup a simple GSAP-powered cursor follower for non-touch devices.
    if (!('ontouchstart' in window)) {
        const follower = document.createElement('div');
        follower.id = 'gsap-follower';
        Object.assign(follower.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.7)',
            pointerEvents: 'none',
            zIndex: '9999',
            transformOrigin: 'center center',
            opacity: '1'  // visible initially
        });
        document.body.appendChild(follower);
    
        let lastX = 0, lastY = 0, lastTime = performance.now(), mouseStopTimer;
    
        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            const dt = now - lastTime || 16;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const vx = dx / dt;
            const vy = dy / dt;
            const factorVal = 25;
    
            const skewX = Math.max(Math.min(vx * factorVal, 25), -25);
            const skewY = Math.max(Math.min(vy * factorVal, 25), -25);
    
            gsap.to(follower, {
                duration: 0.3,
                x: e.clientX - 15,
                y: e.clientY - 15,
                skewX: skewX,
                skewY: skewY,
                ease: "power2.out",
                opacity: 1  // ensure it’s visible when moving
            });
    
            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = now;
    
            if (mouseStopTimer) clearTimeout(mouseStopTimer);
            mouseStopTimer = setTimeout(() => {
                gsap.to(follower, { duration: 0.5, opacity: 0 });
            }, 200);
        });
    }
    
    // Complex GSAP ScrollTrigger text animations.
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
    
    // Smooth scrolling to sections on link click.
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
});


// Replace native smooth scrolling with GSAP-powered smooth scrolling for anchor navigation,
// ensuring it works on both desktop and mobile devices.
// Add a loading animation for the navbar component coming in from the bottom,
// with each element (and each character in the heading, if wrapped in spans)
// animating in a beautiful, responsive way.
const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

// Animate the navbar container sliding up from the bottom
tl.from(".navbar", {
    duration: 0.8,
    y: 50,
    opacity: 0,
    delay: 0.2
});

// Animate each character in the navbar heading (make sure each character is wrapped in a span)
tl.from(".navbar h2 span", {
    duration: 0.5,
    y: 20,
    opacity: 0,
    ease: "back.out(1.7)",
    stagger: 0.05
}, "-=0.5");

// Animate each navbar list item coming from bottom
tl.from(".navbar ul li", {
    duration: 0.8,
    y: 20,
    opacity: 0,
    ease: "back.out(1.7)",
    stagger: 0.1
}, "-=0.7");
// done upper
// Enhanced Split Text effect for the h2 inside .holder with each character wrapped and animated from below.
const holderH2 = document.querySelector('.holder h2');
if (holderH2) {
    // Set a letter-spacing to ensure space between characters.
    holderH2.style.letterSpacing = '2px';
    // Prepare the element for animation from below.
    gsap.set(holderH2, { opacity: 0, y: 20 });
    
    // Animate the whole text line, sliding up from below.
    gsap.to(holderH2, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    });
}
// done form thier 

// Animate the form container sliding up from the bottom
document.addEventListener('DOMContentLoaded', () => {
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
});
