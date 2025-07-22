// Animations JavaScript - Scroll animations and timeline effects

// Setup scroll animations with enhanced section title effects
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger point: 50px before end of viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Special observer for section titles
    const titleObserverOptions = {
        threshold: 0.3, // Trigger when 30% of title is visible
        rootMargin: '0px 0px -100px 0px' // Adjust trigger point
    };

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for each title
                // Note: This relies on the order of .section-title elements in the DOM
                const index = Array.from(document.querySelectorAll('.section-title')).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
            }
        });
    }, titleObserverOptions);

    document.querySelectorAll('.section-title').forEach(el => {
        titleObserver.observe(el);
    });
}

// Setup parallax for specification cards
function setupSpecCardsParallax() {
    const specCards = document.querySelectorAll('.spec-card[data-parallax="true"]');
    
    function updateSpecCardsParallax() {
        if (!window.motionEnabled) return;
        
        specCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const cardCenter = rect.top + rect.height / 2;
            const distanceFromCenter = cardCenter - windowHeight / 2;
            const speed = parseFloat(card.dataset.speed) || 0.1;
            
            // Only apply parallax when card is in viewport
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const translateY = distanceFromCenter * speed;
                const scale = 1 + Math.abs(distanceFromCenter) * 0.0001;
                const opacity = Math.max(0.3, 1 - Math.abs(distanceFromCenter) * 0.001);
                
                card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
                card.style.opacity = opacity;
            }
        });
    }
    
    // Add scroll listener for spec cards parallax
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateSpecCardsParallax);
            ticking = true;
        }
    });
    
    // Initial call
    updateSpecCardsParallax();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Initialize animations
function initAnimations() {
    setupScrollAnimations();
    setupSmoothScrolling();
}

// Export functions for use in other modules
window.setupScrollAnimations = setupScrollAnimations;
window.setupSpecCardsParallax = setupSpecCardsParallax;
window.initAnimations = initAnimations; 