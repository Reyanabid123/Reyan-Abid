// filepath: e:/Profilo/js/script.js

// Wait for DOM to be ready.
document.addEventListener('DOMContentLoaded', () => {
    // Scroll handling: prioritize URL hash then localStorage.
    const scrollPosition = window.location.hash
        ? parseInt(window.location.hash.substring(1), 10)
        : parseInt(localStorage.getItem('savedScroll'), 10);
    if (!isNaN(scrollPosition)) window.scrollTo(0, scrollPosition);
});

// Save scroll position using debounced updates.
let scrollTimer;
window.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        const scrollY = window.scrollY;
        history.replaceState(null, null, '#' + scrollY);
        localStorage.setItem('savedScroll', scrollY);
    }, 150);
});

(() => {
    // Create mouse follower with basic styling; using black as background.
    const follower = document.createElement('div');
    Object.assign(follower.style, {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: '2px solid black',
        background: 'black',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'width 0.2s, height 0.2s',
        willChange: 'transform, width, height, background'
    });
    document.body.appendChild(follower);

    // Create a container for trail elements.
    const trailContainer = document.createElement('div');
    Object.assign(trailContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
    });
    document.body.appendChild(trailContainer);

    const baseSize = 10;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const sizeFactor = isMobile ? 0.7 : 1;

    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let currentX = targetX, currentY = targetY;
    let lastX = targetX, lastY = targetY;

    // Update target on mousemove (with a slight blur change based on element under pointer)
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        follower.style.filter = (el && el !== follower && el !== document.documentElement && el !== document.body)
            ? 'blur(4px)' : 'blur(2px)';
    });

    // Animation loop using requestAnimationFrame.
    let lastTrailTime = 0;
    const animate = (time) => {
        // Calculate speed for dynamic effects.
        const dx = targetX - lastX;
        const dy = targetY - lastY;
        const speed = Math.hypot(dx, dy);
        // Increase size with speed if needed.
        const newSize = baseSize * sizeFactor + Math.min(speed, 50) / 5;

        // Optional: adjust color intensity based on speed if desired
        // Here we keep follower background black.
        follower.style.width = newSize + 'px';
        follower.style.height = newSize + 'px';

        // Create a trail dot every 30ms (to avoid flooding)
        if (time - lastTrailTime > 30) {
            const trail = document.createElement('div');
            Object.assign(trail.style, {
                position: 'fixed',
                left: (currentX - newSize / 2) + 'px',
                top: (currentY - newSize / 2) + 'px',
                width: newSize + 'px',
                height: newSize + 'px',
                borderRadius: '50%',
                background: 'black',
                opacity: '0.5',
                pointerEvents: 'none'
            });
            trailContainer.appendChild(trail);
            // Fade out and remove trail.
            requestAnimationFrame(() => {
                trail.style.transition = 'opacity 1s';
                trail.style.opacity = '0';
                trail.addEventListener('transitionend', () => trail.remove());
            });
            lastTrailTime = time;
        }

        // Smooth interpolation.
        currentX += (targetX - currentX) * 0.2;
        currentY += (targetY - currentY) * 0.2;
        follower.style.transform = `translate(${currentX - newSize / 2}px, ${currentY - newSize / 2}px)`;

        lastX = currentX;
        lastY = currentY;
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    // Drop ball effect on click.
    function spawnDropBall(x, y) {
        const ball = document.createElement('div');
        Object.assign(ball.style, {
            position: 'fixed',
            left: (x - 10) + 'px',
            top: (y - 10) + 'px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#000',
            pointerEvents: 'none',
            zIndex: 9998,
            transition: 'transform 1s ease-in, opacity 1s'
        });
        document.body.appendChild(ball);
        // Trigger after a short delay.
        setTimeout(() => {
            const endY = window.innerHeight - ball.offsetHeight - 5;
            ball.style.transform = `translateY(${endY - y}px)`;
            ball.style.opacity = '0';
        }, 1000);
        ball.addEventListener('transitionend', () => ball.remove());
    }

    // Use mousedown for desktops.
    document.addEventListener('mousedown', (e) => {
        spawnDropBall(e.clientX, e.clientY);
        e.preventDefault();
    }, { passive: false });

    // Touch events.
    let touchStartX = 0, touchStartY = 0, touchStartTime = 0, touchMoved = false;
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length) {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            targetX = touch.clientX;
            targetY = touch.clientY;
            touchMoved = false;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length) {
            const touch = e.touches[0];
            targetX = touch.clientX;
            targetY = touch.clientY;
            if (Math.abs(touch.clientX - touchStartX) > 5 || Math.abs(touch.clientY - touchStartY) > 5) {
                touchMoved = true;
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        if (!touchMoved && (Date.now() - touchStartTime) < 300) {
            spawnDropBall(targetX, targetY);
        }
    });
})();