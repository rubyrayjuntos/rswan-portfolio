// Animations JavaScript - Scroll animations and timeline effects

// Setup scroll animations with enhanced section title effects
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for each title
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
            
            // Special sunset parallax effect
            const isSunsetTheme = document.body.classList.contains('theme-sunset');
            if (isSunsetTheme) {
                const sun = document.querySelector('.sunset-sun');
                const clouds = document.querySelectorAll('.sunset-cloud');
                const rays = document.querySelectorAll('.sunset-ray');
                
                if (sun) {
                    // Sun sets as you scroll down
                    const sunSetProgress = Math.min(scrolled / heroHeight, 1);
                    const sunY = 20 - (sunSetProgress * 40); // Move sun down
                    const sunScale = 1 - (sunSetProgress * 0.3); // Sun gets smaller
                    const sunOpacity = 1 - (sunSetProgress * 0.5); // Sun fades
                    
                    sun.style.transform = `translateX(-50%) translateY(${sunY}vh) scale(${sunScale})`;
                    sun.style.opacity = sunOpacity;
                    
                    // Adjust sun glow based on scroll
                    const glowIntensity = 1 - sunSetProgress;
                    sun.style.boxShadow = `
                        0 0 ${60 * glowIntensity}px rgba(255, 107, 53, ${0.8 * glowIntensity}),
                        0 0 ${120 * glowIntensity}px rgba(255, 215, 0, ${0.6 * glowIntensity}),
                        0 0 ${180 * glowIntensity}px rgba(255, 107, 53, ${0.4 * glowIntensity})
                    `;
                }
                
                // Clouds move at different speeds for parallax
                clouds.forEach((cloud, index) => {
                    const cloudSpeed = 0.2 + (index * 0.1);
                    const cloudY = scrolled * cloudSpeed * 0.1;
                    cloud.style.transform = `translateY(${cloudY}px) scale(1)`;
                });
                
                // Light rays fade as sun sets
                rays.forEach((ray, index) => {
                    const rayFadeProgress = Math.min(scrolled / heroHeight, 1);
                    const rayOpacity = 0.6 * (1 - rayFadeProgress);
                    ray.style.opacity = rayOpacity;
                });
            }
            
            // Special forest parallax effect
            const isForestTheme = document.body.classList.contains('theme-forest');
            if (isForestTheme) {
                const trees = document.querySelectorAll('.forest-tree');
                const leaves = document.querySelectorAll('.forest-leaf');
                const mist = document.querySelectorAll('.forest-mist');
                
                // Trees move at different speeds for depth parallax
                trees.forEach((tree, index) => {
                    const treeSpeed = 0.1 + (index * 0.05); // Different speeds for depth
                    const treeY = scrolled * treeSpeed * 0.2;
                    tree.style.transform = `translateY(${treeY}px) rotate(0deg)`;
                });
                
                // Leaves float more as you scroll
                leaves.forEach((leaf, index) => {
                    const leafFloat = scrolled * 0.1;
                    const leafY = -leafFloat + (index * 2);
                    leaf.style.transform = `translateY(${leafY}px) rotate(${index * 5}deg) scale(1)`;
                });
                
                // Mist becomes more visible as you scroll
                mist.forEach((mistElement, index) => {
                    const mistOpacity = 0.4 + (scrolled / heroHeight) * 0.3;
                    mistElement.style.opacity = mistOpacity;
                });
            }
            
            // Special dark theme parallax effect
            const isDarkTheme = document.body.classList.contains('theme-dark');
            if (isDarkTheme) {
                const nebulas = document.querySelectorAll('.cosmic-nebula');
                const stars = document.querySelectorAll('.cosmic-star');
                const auroras = document.querySelectorAll('.cosmic-aurora');
                const dust = document.querySelectorAll('.cosmic-dust');
                
                // Nebulas move slowly for deep space effect
                nebulas.forEach((nebula, index) => {
                    const nebulaSpeed = 0.05 + (index * 0.02);
                    const nebulaY = scrolled * nebulaSpeed * 0.3;
                    nebula.style.transform = `translateY(${nebulaY}px) scale(1) rotate(0deg)`;
                });
                
                // Stars twinkle more intensely as you scroll
                stars.forEach((star, index) => {
                    const starIntensity = 1 + (scrolled / heroHeight) * 0.5;
                    const starScale = 1 + (scrolled / heroHeight) * 0.2;
                    star.style.transform = `scale(${starScale})`;
                    star.style.filter = `brightness(${starIntensity})`;
                });
                
                // Auroras wave more dramatically
                auroras.forEach((aurora, index) => {
                    const auroraWave = scrolled * 0.1;
                    const auroraY = Math.sin(auroraWave + index) * 10;
                    aurora.style.transform = `translateX(-10%) translateY(${auroraY}px) scaleY(1)`;
                });
                
                // Cosmic dust moves faster for space travel effect
                dust.forEach((dustElement, index) => {
                    const dustSpeed = 0.3 + (index * 0.05);
                    const dustY = scrolled * dustSpeed * 0.4;
                    dustElement.style.transform = `translateY(${dustY}px) scale(1)`;
                });
            }
            
            // Special twilight parallax effect
            const isTwilightTheme = document.body.classList.contains('theme-twilight');
            if (isTwilightTheme) {
                const buildings = document.querySelectorAll('.twilight-building');
                const windows = document.querySelectorAll('.building-window');
                const streetLights = document.querySelectorAll('.street-light');
                const particles = document.querySelectorAll('.twilight-particle');
                
                // Buildings move at different speeds for urban depth
                buildings.forEach((building, index) => {
                    const buildingSpeed = 0.1 + (index * 0.03);
                    const buildingY = scrolled * buildingSpeed * 0.2;
                    building.style.transform = `translateY(${buildingY}px)`;
                });
                
                // Windows flicker more as you scroll
                windows.forEach((window, index) => {
                    const windowIntensity = 1 + (scrolled / heroHeight) * 0.3;
                    window.style.filter = `brightness(${windowIntensity})`;
                });
                
                // Street lights pulse more dramatically
                streetLights.forEach((light, index) => {
                    const lightPulse = scrolled * 0.05;
                    const lightY = Math.sin(lightPulse + index) * 5;
                    light.style.transform = `translateY(${lightY}px)`;
                });
                
                // Particles move faster for urban atmosphere
                particles.forEach((particle, index) => {
                    const particleSpeed = 0.2 + (index * 0.02);
                    const particleY = scrolled * particleSpeed * 0.3;
                    particle.style.transform = `translateY(${particleY}px) scale(1)`;
                });
            }
            
            // Special lavender parallax effect
            const isLavenderTheme = document.body.classList.contains('theme-lavender');
            if (isLavenderTheme) {
                const flowers = document.querySelectorAll('.lavender-flower');
                const petals = document.querySelectorAll('.flower-petal');
                const floatingPetals = document.querySelectorAll('.floating-petal');
                const glows = document.querySelectorAll('.ethereal-glow');
                const breeze = document.querySelectorAll('.breeze-particle');
                
                // Flowers sway more gently as you scroll
                flowers.forEach((flower, index) => {
                    const flowerSway = scrolled * 0.02;
                    const flowerY = Math.sin(flowerSway + index) * 8;
                    flower.style.transform = `translateY(${flowerY}px) rotate(0deg) scale(1)`;
                });
                
                // Petals move more dramatically
                petals.forEach((petal, index) => {
                    const petalSway = scrolled * 0.03;
                    const petalY = Math.sin(petalSway + index) * 12;
                    petal.style.transform = `translate(-50%, -50%) rotate(calc(var(--petal-angle) + ${petalY}deg)) scale(1)`;
                });
                
                // Floating petals drift more as you scroll
                floatingPetals.forEach((petal, index) => {
                    const petalDrift = scrolled * 0.1;
                    const petalY = -petalDrift + (index * 3);
                    petal.style.transform = `translateY(${petalY}px) rotate(${index * 15}deg) scale(1)`;
                });
                
                // Ethereal glows pulse more intensely
                glows.forEach((glow, index) => {
                    const glowIntensity = 1 + (scrolled / heroHeight) * 0.4;
                    const glowScale = 1 + (scrolled / heroHeight) * 0.3;
                    glow.style.transform = `scale(${glowScale})`;
                    glow.style.opacity = 0.2 * glowIntensity;
                });
                
                // Breeze particles move faster for dreamy effect
                breeze.forEach((particle, index) => {
                    const breezeSpeed = 0.15 + (index * 0.02);
                    const breezeY = scrolled * breezeSpeed * 0.25;
                    particle.style.transform = `translateY(${breezeY}px) scale(1)`;
                });
            }
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