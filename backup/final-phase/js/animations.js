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

// Simplified timeline scroll animation using IntersectionObserver
function setupTimelineScrollAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const journeySection = document.querySelector('#journey');
    const journeyHeroBg = document.querySelector('.journey-hero-bg');
    const journeyParticles = document.querySelector('.journey-particles');
    
    // Hero parallax effect
    function updateHeroParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight && window.motionEnabled) {
            const heroContent = document.querySelector('.hero-content');
            const heroBg = document.querySelector('.hero-bg');
            
            heroContent.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
            heroBg.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
        }
    }
    
    // Journey background reveal effect
    function updateJourneyBackground() {
                    if (!journeySection || !window.motionEnabled) return;
        
        const rect = journeySection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the journey section is visible
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const visibleHeight = Math.min(windowHeight, sectionTop + sectionHeight) - Math.max(0, sectionTop);
        const visibilityRatio = Math.max(0, Math.min(1, visibleHeight / windowHeight));
        
        // Reveal background and particles as section comes into view
        if (journeyHeroBg && journeyParticles) {
            journeyHeroBg.style.opacity = visibilityRatio;
            journeyParticles.style.opacity = visibilityRatio;
            
            if (visibilityRatio > 0.1) {
                journeyHeroBg.classList.add('visible');
                journeyParticles.classList.add('visible');
            }
            
            // Debug logging
            console.log('Journey background visibility:', visibilityRatio);
        } else {
            console.log('Journey background elements not found:', { journeyHeroBg, journeyParticles });
        }
    }
    
    // Use IntersectionObserver for timeline items - much more reliable
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay to ensure smooth animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all timeline items
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Add scroll listener for hero parallax and journey background
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeroParallax();
                updateJourneyBackground();
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateJourneyBackground();
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
window.setupTimelineScrollAnimation = setupTimelineScrollAnimation;
window.setupSpecCardsParallax = setupSpecCardsParallax;
window.initAnimations = initAnimations; 