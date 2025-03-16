// email sending script starts here 


document.addEventListener('DOMContentLoaded', () => {
    const email = 'reyan.webdev@gmail.com';
    const emailCopy = document.getElementById('emailCopy');
    const notification = document.getElementById('copyNotification');
    
    let emailClickedOnce = false;

    if (emailCopy) {
        emailCopy.addEventListener('click', (event) => {
            event.preventDefault();

            if (!emailClickedOnce) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(email)
                        .then(() => {
                            notification.style.opacity = '1';
                            setTimeout(() => {
                                notification.style.opacity = '0';
                            }, 2000);
                        })
                        .catch((error) => console.error('Clipboard error:', error));
                } else {
                    // Provide a fallback if Clipboard API is not supported.
                    console.warn('Clipboard API not supported');
                }
                emailClickedOnce = true;
            } else {
                window.open(`mailto:${email}?subject=Hi%20reyan`);
            }
        });
    }
});
// email sending script ends here

document.addEventListener('DOMContentLoaded', () => {
    // Clean caches and local storage to remove outdated data
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => caches.delete(cacheName));
        });
    }
    localStorage.clear();

    // Lazy load images to speed up your website:
    // Make sure your <img> tags use the "lazy" class and store the real URL in data-src.
    const lazyImages = document.querySelectorAll('img.lazy');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback: load all images right away if IntersectionObserver isn't supported.
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
});