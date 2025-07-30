/**
 * Asteroids Game Portfolio Integration
 * Easy-to-integrate JavaScript module for embedding the Asteroids game in any portfolio
 * 
 * Usage:
 * 1. Include this script in your portfolio
 * 2. Add the CSS to your stylesheet
 * 3. Call AsteroidsGame.init() to set up the modal
 * 4. Use AsteroidsGame.open() to show the game
 */

class AsteroidsGame {
    constructor() {
        this.modal = null;
        this.iframe = null;
        this.isInitialized = false;
        this.gamePath = './index.html'; // Update this path to your game location
    }

    /**
     * Initialize the game modal system
     * @param {string} gamePath - Path to your index.html file
     * @param {Object} options - Configuration options
     */
    init(gamePath = './index.html', options = {}) {
        this.gamePath = gamePath;
        
        // Create modal HTML
        this.createModal();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Add CSS styles
        this.addStyles();
        
        this.isInitialized = true;
        console.log('🎮 Asteroids Game Modal initialized');
    }

    /**
     * Create the modal HTML structure
     */
    createModal() {
        const modalHTML = `
            <div id="asteroids-modal" class="asteroids-modal-overlay">
                <div class="asteroids-modal-content">
                    <div class="asteroids-modal-header">
                        <div class="asteroids-modal-title">🎮 Asteroids Game</div>
                        <button class="asteroids-close-button" onclick="AsteroidsGame.close()">×</button>
                    </div>
                    <div class="asteroids-game-container">
                        <iframe id="asteroids-game-frame" src="${this.gamePath}" 
                                width="800" height="600" frameborder="0"></iframe>
                    </div>
                    <div class="asteroids-modal-footer">
                        <div class="asteroids-controls-info">
                            <strong>Controls:</strong> 
                            <span class="desktop-controls">Arrow Keys / WASD + Space</span>
                            <span class="mobile-controls">Touch Controls</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('asteroids-modal');
        this.iframe = document.getElementById('asteroids-game-frame');
    }

    /**
     * Add CSS styles for the modal
     */
    addStyles() {
        const styles = `
            .asteroids-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                backdrop-filter: blur(8px);
                animation: asteroids-fadeIn 0.3s ease;
            }

            .asteroids-modal-content {
                background: #000;
                border-radius: 15px;
                padding: 20px;
                position: relative;
                max-width: 95vw;
                max-height: 95vh;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                animation: asteroids-slideIn 0.3s ease;
            }

            .asteroids-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                color: white;
            }

            .asteroids-modal-title {
                font-size: 1.5rem;
                font-weight: bold;
                color: #fff;
            }

            .asteroids-close-button {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                transition: background 0.3s ease;
            }

            .asteroids-close-button:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .asteroids-game-container {
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                background: #000;
            }

            .asteroids-modal-footer {
                margin-top: 15px;
                text-align: center;
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
            }

            .asteroids-controls-info {
                display: flex;
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
            }

            .desktop-controls {
                display: inline;
            }

            .mobile-controls {
                display: none;
            }

            @media (max-width: 768px) {
                .asteroids-modal-content {
                    margin: 10px;
                    padding: 15px;
                }
                
                .asteroids-game-container iframe {
                    width: 100%;
                    height: 400px;
                }
                
                .desktop-controls {
                    display: none;
                }
                
                .mobile-controls {
                    display: inline;
                }
            }

            @keyframes asteroids-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes asteroids-slideIn {
                from { 
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to { 
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            /* Portfolio button styles */
            .asteroids-play-button {
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                text-decoration: none;
                display: inline-block;
            }

            .asteroids-play-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
                text-decoration: none;
                color: white;
            }

            .asteroids-loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: asteroids-spin 1s ease-in-out infinite;
            }

            @keyframes asteroids-spin {
                to { transform: rotate(360deg); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * Set up event listeners for the modal
     */
    setupEventListeners() {
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.close();
            }
        });

        // Handle iframe load
        this.iframe.addEventListener('load', () => {
            console.log('🎮 Game loaded successfully');
        });

        // Handle iframe errors
        this.iframe.addEventListener('error', () => {
            console.error('❌ Failed to load game');
            this.showError('Failed to load game. Please check the game path.');
        });
    }

    /**
     * Open the game modal
     */
    open() {
        if (!this.isInitialized) {
            console.error('❌ AsteroidsGame not initialized. Call AsteroidsGame.init() first.');
            return;
        }

        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus the iframe for better UX
        setTimeout(() => {
            this.iframe.focus();
        }, 100);

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('asteroidsGameOpened'));
    }

    /**
     * Close the game modal
     */
    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('asteroidsGameClosed'));
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: asteroids-slideIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Create a play button element
     * @param {string} text - Button text
     * @param {string} className - Additional CSS classes
     * @returns {HTMLElement} Button element
     */
    createPlayButton(text = '🎮 Play Asteroids', className = '') {
        const button = document.createElement('button');
        button.className = `asteroids-play-button ${className}`;
        button.textContent = text;
        button.addEventListener('click', () => this.open());
        return button;
    }

    /**
     * Create a play link element
     * @param {string} text - Link text
     * @param {string} className - Additional CSS classes
     * @returns {HTMLElement} Link element
     */
    createPlayLink(text = '🎮 Play Asteroids', className = '') {
        const link = document.createElement('a');
        link.className = `asteroids-play-button ${className}`;
        link.textContent = text;
        link.href = '#';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            this.open();
        });
        return link;
    }
}

// Make it globally available
window.AsteroidsGame = AsteroidsGame;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AsteroidsGame.init();
    });
} else {
    AsteroidsGame.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsteroidsGame;
} 