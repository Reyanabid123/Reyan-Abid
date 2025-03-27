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
    })
    .from(".navbar h2 span", {
        duration: 0.5,
        y: 20,
        opacity: 0,
        ease: "back.out(1.7)",
        stagger: 0.05
    }, "-=0.5")
    .from(".navbar ul li", {
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
        if (window.Shery && Shery.imageEffect) {
            Shery.imageEffect('.BigImage img,.SmallImages img', {
                style: 3,
                debug: true,
            });
        }
        if (window.Shery && Shery.makeMagnet) {
            Shery.makeMagnet(".magnet", {
                ease: "cubic-bezier(0.23, 1, 0.320, 1)",
                duration: 1,
            });
        }
    });
});
