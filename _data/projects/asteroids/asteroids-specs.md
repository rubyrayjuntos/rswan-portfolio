# Technical and Functional Specification for a JavaScript-based Asteroids Game

## 1.0 Functional Specification: Gameplay and Mechanics

This section outlines the functional requirements of the game, defining the core rules, entity behaviors, and overall player experience. The specification is designed to faithfully recreate the essential mechanics of the classic 1979 arcade game, Asteroids.

### 1.1 Game Concept and Core Loop

The game is a multi-directional shooter set in a two-dimensional, wrap-around space environment. The player pilots a triangular spaceship, navigating a perilous asteroid field while fending off hostile flying saucers. The fundamental objective is to survive for as long as possible while achieving the highest score.

The core gameplay loop is composed of four continuous actions:

- **Navigating**: The player rotates the ship left and right and applies forward thrust to move through the environment.  
- **Shooting**: The player fires projectiles to destroy asteroids and enemy UFOs.  
- **Dodging**: The player must actively maneuver to avoid colliding with asteroids, UFOs, and incoming enemy fire.  
- **Advancing**: Clearing the screen of all asteroids and their subsequent fragments completes the current level and advances the player to the next, more challenging wave.

### 1.2 State Management and Screen Flow

The application will be governed by a state machine managing the flow between distinct game screens. For this initial implementation, two primary screens will be developed: the Start Screen and the Gameplay Screen.

#### 1.2.1 Start Screen

This screen serves as the game’s entry point. It will feature a minimalist design consistent with the retro aesthetic, displaying the game’s title and a prominent “Start Game” button. Upon a user’s click or tap of this button, the game’s state will transition from `START_SCREEN` to `GAMEPLAY`, triggering the initialization of the first level.

#### 1.2.2 Gameplay Screen (Active State)

This is the main interactive view where the core game loop executes. The screen will render all active game entities, including the player’s ship, asteroids of varying sizes, enemy UFOs, and all projectiles. A persistent Heads-Up Display (HUD) will be visible, showing the player’s current score and remaining lives.

#### 1.2.3 Game Over Condition

The game concludes when the player’s final ship is destroyed. At this point, the game state transitions to `GAME_OVER`. All gameplay will halt, and a “Game Over” message will be displayed alongside the player’s final score. A “Play Again” button will allow the user to reset the game and re-enter the `GAMEPLAY` state, starting a new session from level one.

### 1.3 Game Entities: Attributes and Behaviors

All entities in the game world share common properties such as position, velocity, and the ability to wrap around the screen edges.

#### 1.3.1 The Player Ship

- **Appearance**: The ship is represented by a simple, unfilled isosceles triangle, an iconic design that pays homage to the original’s vector graphics.  
- **Controls**: The ship’s movement is controlled by four distinct actions: rotate left, rotate right, thrust forward, and fire. The “hyperspace” function from the original game, which teleported the ship to a random location, is excluded from this initial scope to align with the specified four-button mobile control scheme.  
- **Physics**: The ship’s movement is a defining characteristic of the game’s feel and is governed by inertia. Applying thrust adds acceleration to the ship’s current velocity vector. When thrust is disengaged, the ship does not stop immediately but continues to drift along its trajectory, gradually decelerating due to a simulated friction force. This physics model compels players to anticipate movements and plan their trajectories, distinguishing it from typical arcade shooters.  
- **Screen Wrap**: When the ship travels beyond a screen boundary, it seamlessly reappears on the opposite edge, preserving its velocity and orientation.  
- **Destruction**: The ship is destroyed by a single collision with an asteroid or UFO, or by a hit from a UFO projectile. When destroyed, one life is deducted from the player’s total. If lives remain, the ship respawns at the center of the screen after a brief delay, enjoying a few seconds of invulnerability to allow the player to reorient.

#### 1.3.2 Asteroids (Large, Medium, Small)

- **Appearance**: Asteroids are rendered as irregular, convex polygons to emulate the “space rock” aesthetic. Several shape variations for each size will be used to create visual diversity.  
- **Movement**: Asteroids drift across the screen at a constant velocity on a random vector determined at the start of each level. They also adhere to the screen-wrap rule.  
- **Fragmentation**: The fragmentation mechanic is a central element of gameplay.  
  - A **Large Asteroid**, when shot, breaks into two Medium Asteroids. These fragments inherit a portion of the parent’s velocity but are given additional, divergent velocity, and they move faster than the original.  
  - A **Medium Asteroid**, when shot, breaks into two Small Asteroids, which are faster still.  
  - A **Small Asteroid** is destroyed completely when shot.

#### 1.3.3 UFOs (Large and Small Saucers)

Enemy flying saucers, known internally at Atari as “drones,” appear periodically to increase the challenge.

- **Large UFO (“Sluggo”)**: This saucer is larger and moves more slowly. Its AI is rudimentary; it fires shots in random directions with poor accuracy, posing more of a stray threat than a targeted one.  
- **Small UFO (“Mr. Bill”)**: This saucer is smaller, faster, and significantly more dangerous. Its AI is designed to actively target the player’s ship. A key feature of the original game’s dynamic difficulty is that this UFO’s aiming accuracy improves as the player’s score increases, eventually becoming deadly precise.

The design of the UFO AI is informed by the history of the original game itself. Early versions of Asteroids had an AI that was not capable of aiming across screen boundaries, which led to players discovering a low-risk “lurking” strategy where they could hide near a screen edge and pick off UFOs with impunity. This exploit diminished the challenge and reportedly impacted arcade operator revenue. In response, Atari’s developers specifically designed the sequel, Asteroids Deluxe, with a more advanced AI to eliminate this “camping” behavior. This historical iteration demonstrates the critical feedback loop between player behavior and game design. For this project, the initial implementation of the small UFO will feature moderately accurate targeting, with the potential for a more advanced “anti-lurking” AI as a future enhancement to increase the challenge for skilled players.

#### 1.3.4 Projectiles (Player Bullets)

Player projectiles are rendered as simple lines or small rectangles to mimic the bright “plasma fireball” look of the vector display. They are fired from the apex of the ship’s triangle and travel in a straight line along the ship’s orientation at the moment of firing. To prevent screen clutter, projectiles have a limited lifetime and will be removed from the game world after traveling a set distance.

### 1.4 Scoring, Lives, and Level Progression

**Scoring**: Points are awarded based on the difficulty of the target destroyed. The scoring system is based on values from authentic retro gaming sources.

- Large Asteroid: 20 points  
- Medium Asteroid: 50 points  
- Small Asteroid: 100 points  
- Large UFO: 200 points  
- Small UFO: 1,000 points

**Lives**: The player begins the game with three lives. An additional life is granted for every 10,000 points scored, rewarding skilled play.

**Level Progression**: A level is completed once all asteroids and their fragments have been cleared. The next level begins with a new wave of large asteroids, with the quantity increasing to raise the difficulty.

## 2.0 Asset Specification: Visuals and Audio

This section details the specifications for all creative assets, including graphics and sound effects, designed to capture the minimalist and iconic sensory experience of the original arcade game.

### 2.1 Visual Design: Emulating Classic Vector Graphics

The game’s visual identity will strictly adhere to the monochrome vector graphic style of the 1979 original. All game objects will be rendered as clean, sharp, glowing white outlines against a pure black background. This aesthetic choice is not merely stylistic but is fundamental to the game’s identity. Modern vector art tools like Inkscape or Adobe Illustrator will be used to create the base shapes, which will be exported as SVG files to ensure scalability and crispness at any resolution. To simulate the characteristic glow of a cathode-ray vector monitor, a subtle bloom effect will be applied programmatically during canvas rendering.

### 2.2 Art Asset Production Guide

All visual assets will be created as simple, geometric line art. Complex textures, gradients, and raster-style details are to be avoided to maintain authenticity. The following table serves as a master checklist for all required visual assets.

|Asset ID       |Description                                      |Source File Format|In-Game Representation|Notes                                                          |  
|---------------|-------------------------------------------------|------------------|----------------------|---------------------------------------------------------------|  
|ship_default   |The player’s triangular spaceship.               |SVG               |Polygon               |The apex of the triangle defines the forward direction.        |  
|ship_thrust    |Ship with a flame/exhaust graphic at the rear.   |SVG               |Polygon + Line Art    |Displayed when the thrust control is active.                   |  
|asteroid_lg_1-3|3 variations of large, irregular asteroid shapes.|SVG               |Polygon               |All polygons must be convex for simplified collision detection.|  
|asteroid_md_1-3|3 variations of medium asteroid shapes.          |SVG               |Polygon               |Visibly smaller than large asteroids.                          |  
|asteroid_sm_1-3|3 variations of small asteroid shapes.           |SVG               |Polygon               |Visibly smaller than medium asteroids.                         |  
|ufo_lg         |The large flying saucer (“Sluggo”).              |SVG               |Polygon               |A simple, wide saucer shape.                                   |  
|ufo_sm         |The small flying saucer (“Mr. Bill”).            |SVG               |Polygon               |A smaller, more compact saucer shape.                          |  
|ui_button_up   |Up arrow icon for the mobile D-pad.              |SVG               |Image                 |Represents the “Thrust” action.                                |  
|ui_button_down |Fire icon for the mobile D-pad.                  |SVG               |Image                 |Represents the “Fire” action.                                  |  
|ui_button_left |Left arrow icon for the mobile D-pad.            |SVG               |Image                 |Represents the “Rotate Left” action.                           |  
|ui_button_right|Right arrow icon for the mobile D-pad.           |SVG               |Image                 |Represents the “Rotate Right” action.                          |

### 2.3 Audio Design and Sound Effects

The game’s audio will consist of synthesized sound effects that evoke the 8-bit era. To manage simultaneous sounds without latency—a common requirement in games—the Web Audio API is mandated for all audio playback. Sounds will be generated using a digital synthesizer or sourced from royalty-free libraries and encoded in web-friendly formats such as .wav or .mp3.

|SFX ID          |Triggering Event                            |Description                                           |Notes                                                                 |  
|----------------|--------------------------------------------|------------------------------------------------------|----------------------------------------------------------------------|  
|sfx_fire        |Player fires a bullet.                      |A sharp, high-frequency “pew” sound.                  |Must have extremely low latency for responsive feedback.              |  
|sfx_thrust      |Player activates thrust.                    |A low-frequency, continuous rumbling hum.             |Should loop while thrust is active and cease immediately upon release.|  
|sfx_explode_sm  |A small asteroid is destroyed.              |A brief, crisp explosive sound.                       |                                                                      |  
|sfx_explode_md  |A medium asteroid or large UFO is destroyed.|A deeper, more substantial explosion.                 |                                                                      |  
|sfx_explode_lg  |The player’s ship is destroyed.             |A large, bass-heavy explosion to signify player death.|                                                                      |  
|sfx_ufo_lg_spawn|The large UFO appears on-screen.            |A classic, two-tone siren sound with a slow tempo.    |Loops while the UFO is present.                                       |  
|sfx_ufo_sm_spawn|The small UFO appears on-screen.            |A higher-pitched, more urgent siren with a fast tempo.|Loops while the UFO is present.                                       |

## 3.0 Technical Specification: Architecture and Implementation

This section details the technical architecture, algorithms, and APIs that will be used to implement the functional requirements. The project will be built using pure HTML5, CSS3, and modern JavaScript (ES6+), without reliance on external game engines or frameworks, to ensure a foundational understanding of web game development principles. The only third-party library will be SAT.js for handling complex collision detection.

### 3.1 Project Structure and Technology Stack

A modular and well-organized project structure is paramount for maintainability and future expansion.

**Technology Stack:**

- HTML5: For the document structure and canvas element.  
- CSS3: For styling, layout, and responsive design.  
- JavaScript (ES6+): For all game logic, utilizing classes for object-oriented design.  
- SAT.js: A lightweight library for Separating Axis Theorem-based collision detection.

**File and Directory Layout:**

```  
/project-asteroids  
|-- index.html  
|-- /css  
|   |-- style.css  
|-- /js  
|   |-- main.js          # Application entry point, game initialization  
|   |-- game.js          # Main Game class, state machine, game loop  
|   |-- input.js         # Input handler for keyboard and touch  
|   |-- audio.js         # Web Audio API manager  
|   |-- /entities  
|   |   |-- ship.js  
|   |   |-- asteroid.js  
|   |   |-- ufo.js  
|   |   |-- projectile.js  
|   |-- /lib  
|   |   |-- sat.js       # Collision detection library  
|-- /assets  
|   |-- /images  
|   |   |-- (all SVG assets from asset list)  
|   |-- /audio  
|       |-- (all WAV/MP3 assets from sound list)  
```

**HTML Structure (index.html)**: The primary HTML file will be minimal, providing a scaffold for the game. It will include a main container div, a `<canvas>` element for game rendering, and a separate div to serve as a UI layer. This layering strategy allows for leveraging the DOM for UI elements like scores and buttons, which is often more performant and easier to manage than drawing text and interactive elements directly onto the canvas every frame.

**CSS Architecture (style.css)**: The stylesheet will manage the visual presentation of all non-canvas elements. This includes centering the game container, styling UI text and buttons, and implementing the responsive on-screen controls for mobile devices.

### 3.2 Core Engine: The Game Loop and State Management

#### 3.2.1 Implementing a requestAnimationFrame Game Loop

The heart of the game is its main loop, which will be driven by `window.requestAnimationFrame()`. This browser API synchronizes the game’s rendering cycle with the display’s refresh rate, resulting in the most efficient and smoothest possible animation. It is vastly superior to older methods like `setInterval`, which can cause visual stuttering by running out of sync with the browser’s repaint schedule.

The loop will separate logic updates from rendering operations, a fundamental practice in game development. A `deltaTime` value, calculated from the high-resolution timestamp provided by `requestAnimationFrame`, will be passed to all update functions. Using `deltaTime` for all movement and time-based calculations ensures that the game’s speed is independent of the frame rate, providing a consistent experience across devices with different refresh rates (e.g., 60Hz vs 144Hz).

```javascript  
// A simplified representation in game.js  
let lastTime = 0;  
function gameLoop(timestamp) {  
    const deltaTime = timestamp - lastTime;  
    lastTime = timestamp;

    update(deltaTime); // Update all game logic based on elapsed time  
    render();          // Draw the current state of the game world

    window.requestAnimationFrame(gameLoop);  
}  
window.requestAnimationFrame(gameLoop); // Initiates the loop  
```

#### 3.2.2 Managing Game State

A state machine within the main Game class will manage the application’s flow. A property, `this.state`, will track the current game state (e.g., ‘START’, ‘PLAYING’, ‘GAME_OVER’). The main update and render functions will use this property to delegate control to the appropriate logic for the active screen.

### 3.3 Rendering Engine

#### 3.3.1 Canvas Context and Clearing Strategy

The game will be rendered on a single HTML5 `<canvas>` element. The 2D rendering context will be obtained once during initialization via `canvas.getContext('2d')`. At the beginning of each render cycle within the game loop, the entire canvas will be cleared using `context.clearRect(0, 0, canvas.width, canvas.height)`. This “paint-and-clear” approach is straightforward and sufficient for a game of this complexity, ensuring no artifacts are left from previous frames.

#### 3.3.2 Drawing Vector-Style Graphics

All game entities will be rendered using the canvas path-drawing API. The vertices for each shape (ship, asteroids, etc.) will be defined relative to the entity’s origin (0,0). The `context.save()`, `context.translate(x, y)`, and `context.rotate(angle)` methods will be used to transform the canvas context before drawing each entity. This ensures objects are positioned and oriented correctly in the game world without altering their base vertex data.

### 3.4 Physics and Collision Engine

#### 3.4.1 Implementing Ship Physics: Rotation, Thrust, and Inertia

The unique “feel” of Asteroids is a direct product of its physics simulation. Replicating this is a top priority. The ship’s motion is determined by a set of carefully tuned constants. The centralization of these values is critical, as it allows for rapid iteration and fine-tuning of the game’s handling without searching through disparate parts of the codebase. A small change to friction or thrust can dramatically alter the game from feeling “sluggish” to “uncontrollable.”

- **Rotation**: The ship’s angle is updated based on a constant rotation speed and the deltaTime.  
- **Thrust**: When thrust is active, an acceleration vector is calculated based on the ship’s current angle and added to its velocity vector. The trigonometric functions `cos(θ)` and `sin(θ)` are used to resolve the force into its x and y components.  
- **Inertia & Friction**: The ship’s position is updated by its velocity each frame. A friction coefficient is applied to the velocity, causing the ship to slow down gradually when not under thrust, eventually coming to a stop.  
- **Max Speed**: The ship’s velocity is capped to prevent it from accelerating indefinitely.

|Constant           |Value (Example)|Unit            |Description                                      |Source/Rationale                                                 |  
|-------------------|---------------|----------------|-------------------------------------------------|-----------------------------------------------------------------|  
|SHIP_ROTATION_SPEED|3.5            |Radians/second  |Defines the turning rate of the ship.            |Tuned for responsive but deliberate control; provides a baseline.|  
|SHIP_THRUST        |5              |Pixels/second²  |The magnitude of the ship’s acceleration.        |Provides a baseline.                                             |  
|SHIP_MAX_SPEED     |7              |Pixels/second   |The terminal velocity of the ship.               |Provides a baseline.                                             |  
|SHIP_FRICTION      |0.97           |Multiplier/frame|Rate of velocity decay (1.0 = no friction).      |Essential for replicating the classic “drifting” feel.           |  
|BULLET_SPEED       |500            |Pixels/second   |The velocity of player projectiles.              |Tuned for gameplay balance.                                      |  
|BULLET_LIFETIME    |1000           |Milliseconds    |Duration a bullet exists before self-destructing.|Prevents screen clutter and performance degradation.             |

#### 3.4.2 Implementing Collision Detection with SAT.js

Because the game involves rotated, non-rectangular polygons, simple collision detection methods like Axis-Aligned Bounding Box (AABB) or circle-to-circle checks are inadequate. The correct and robust solution is the Separating Axis Theorem (SAT), which can accurately determine collisions between any two convex polygons. To avoid the complexity of implementing this algorithm from scratch, the lightweight SAT.js library will be utilized.

The implementation will follow these steps:

1. **Shape Creation**: At initialization, each game entity (ship, asteroids, UFOs) will have a corresponding SAT.Polygon object created, defined by a set of vertices relative to its center.  
1. **State Synchronization**: In each frame of the game loop, the position and angle of each SAT.Polygon will be updated to match the state of its corresponding game entity.  
1. **Collision Testing**: The system will iterate through all logical pairs of objects (e.g., player bullets against all asteroids, the ship against all asteroids and UFOs) and perform a collision check using `SAT.testPolygonPolygon(poly1, poly2)`.  
1. **Response**: If a collision is detected, the game will trigger the appropriate event, such as destroying the involved entities and awarding points.

### 3.5 Audio Engine

#### 3.5.1 Structuring the Web Audio API Manager

An `AudioManager` class will encapsulate all audio operations. This class will be responsible for creating a single, persistent `AudioContext`. To comply with modern browser autoplay policies, this context will be initialized or resumed upon the first user gesture, such as clicking the “Start Game” button.

#### 3.5.2 Loading and Triggering Sound Effects

The `AudioManager` will pre-load all required sound effects during game initialization. It will use the `fetch` API to retrieve audio files as `ArrayBuffers`, then decode them into `AudioBuffers` using `audioContext.decodeAudioData`. These buffers will be stored in a dictionary for instant access.

A public `playSound(id)` method will handle playback. When called, this method will create a new `AudioBufferSourceNode`, assign the appropriate pre-loaded buffer to it, connect it to the audio context’s destination, and start playback immediately. Creating a new source node for each sound instance is a critical feature of the Web Audio API. It allows for multiple instances of the same sound effect to be played simultaneously and overlap correctly, a necessity for effects like rapid weapon fire, which would be impossible to achieve reliably with a single `<audio>` HTML element.

## 4.0 User Interface (UI) and Controls Specification

This section defines the user-facing display elements and the input mechanisms for both desktop and mobile platforms.

### 4.1 On-Screen Display (HUD)

The HUD will be implemented as a standard HTML div layered on top of the game canvas. This approach leverages the browser’s highly optimized DOM rendering for text and static elements, which is more efficient than redrawing text on the canvas every frame. The HUD will display:

- **Current Score**: Positioned in the top-left corner.  
- **Lives Remaining**: Positioned in the top-right corner, visually represented by small icons of the player’s ship.

The game’s logic will update the `textContent` of these HTML elements only when the corresponding values (score, lives) change.

### 4.2 Input Handling

A dedicated `InputHandler` class will centralize all input management. It will listen for keyboard and touch events and maintain an internal state object that tracks which actions are currently active (e.g., `{ thrust: true, fire: false }`). Game entities will query this handler each frame to determine their behavior, decoupling the input source from the game logic.

|Game Action |Keyboard Key|Touch Control Button ID|InputHandler State Key|  
|------------|------------|-----------------------|----------------------|  
|Rotate Left |ArrowLeft   |touch-left             |rotateLeft            |  
|Rotate Right|ArrowRight  |touch-right            |rotateRight           |  
|Thrust      |ArrowUp     |touch-up               |thrust                |  
|Fire        |Space       |touch-down             |fire                  |

### 4.3 Implementation of the Responsive Diamond Control Pad

To ensure a high-quality mobile experience, a custom on-screen control pad is required.

#### 4.3.1 HTML and CSS for the Control Pad Layout

The control pad will consist of a container div with four child `<button>` elements, arranged in the specified diamond pattern. This layout will be achieved using modern CSS techniques like Flexbox or CSS Grid, which provide the necessary control over alignment and positioning. The entire control pad will be fixed to a corner of the viewport (e.g., bottom-right) for easy thumb access.

A critical aspect of the implementation is making the controls appear only when needed. Instead of relying on screen-width breakpoints, which can be unreliable for distinguishing between a small laptop and a large tablet, the CSS `pointer` media feature will be used. This feature detects the user’s primary input mechanism. The controls will be hidden by default and only displayed when the primary input is coarse (i.e., a finger on a touch screen).

```css  
#touch-controls {  
    display: none; /* Hidden by default for mouse/keyboard users */  
    position: fixed;  
    bottom: 20px;  
    right: 20px;  
    /* ... additional grid or flexbox styles for diamond layout... */  
}

/* This media query targets devices where the primary input is touch */  
@media (pointer: coarse) {  
    #touch-controls {  
        display: grid; /* Or 'flex', making it visible */  
    }  
}  
```

#### 4.3.2 JavaScript for Touch Event Handling

The `InputHandler` will attach `touchstart` and `touchend` event listeners to each of the four control buttons. These listeners will update the central input state object, toggling the boolean flags for thrust, fire, rotateLeft, and rotateRight. This ensures that the game logic responds to on-screen button presses in exactly the same way it responds to keyboard presses.

## 5.0 Conclusion and Future Development Roadmap

### 5.1 Summary of Phase One Implementation

This document provides a comprehensive technical and functional specification for the development of a web-based, mobile-responsive game inspired by the 1979 arcade classic Asteroids. It details the requirements for building the Start and Gameplay screens, defining all core mechanics, assets, and controls. The specified architecture leverages modern web standards—HTML5 Canvas, CSS3, ES6+ JavaScript, and the Web Audio API—to create a performant and authentic retro gaming experience from fundamental principles.

### 5.2 Recommendations for Next Features

Upon successful completion of the initial scope, the following features are recommended for future development phases to enhance gameplay depth and replayability:

- **Hyperspace Functionality**: Implement the classic “hyperspace” button, a high-risk/high-reward mechanic that teleports the player to a random, and potentially dangerous, location on the screen.  
- **Persistent High Scores**: Utilize the browser’s localStorage API to create a persistent high score table, a key feature that drove competition and replayability in the original arcades.  
- **Game Over Screen Enhancements**: Expand the Game Over screen to allow players to enter their initials next to their score, further emulating the arcade experience.  
- **Advanced UFO AI**: Evolve the small UFO’s behavior to incorporate “anti-lurking” logic, making it a more intelligent and persistent threat for experienced players.  
- **New Enemy Types**: Introduce the “Killer Satellites” from the sequel Asteroids Deluxe, which fragment into smaller, homing projectiles when destroyed, adding a new strategic layer to combat.

-----

### Works Cited

1. Asteroids (video game) - Wikipedia, https://en.wikipedia.org/wiki/Asteroids_(video_game)  
1. www.museumofplay.org, https://www.museumofplay.org/games/asteroids/  
1. Asteroids Arcade Game – History, Gameplay, and Legacy - Bitvint, https://bitvint.com/pages/asteroids  
1. Gaming Landmarks 1960-1985 - Asteroids (1979) - TechnologyUK, https://www.technologyuk.net/computing/computer-gaming/gaming-landmarks-1960-1985/asteroids.shtml  
1. High Score Saver - e-basteln, https://www.e-basteln.de/arcade/asteroids/highscore/  
1. Asteroids - The Strong National Museum of Play, https://www.museumofplay.org/games/asteroids/  
1. Asteroids-style motion · GitHub, https://gist.github.com/11216544  
1. Asteroids - VecFever, https://www.vecfever.com/faq/asteroids/  
1. Asteroids, http://tips.retrogames.com/gamepage/asteroid.html  
1. Asteroids Deluxe Arcade Game: Atari’s Vector Sequel Challenge (1981) - Bitvint, https://bitvint.com/pages/asteroids-deluxe  
1. Vector Game Art: Principles, Implementation, Challenges & Solutions, https://retrostylegames.com/blog/vector-game-art/  
1. Vector Graphics 101: Game Art Tutorial - YouTube, https://www.youtube.com/watch?v=3NqmAlLp50E  
1. Basic guide to Web Audio API | THEOdocs - THEO Technologies, https://www.theoplayer.com/docs/theoplayer/knowledge-base/playback/basic-guide-web-audio-api/  
1. Web Audio API - GeeksforGeeks, https://www.geeksforgeeks.org/javascript/web-audio-api/  
1. Web Audio API - MDN Web Docs - Mozilla, https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API  
1. JavaScript Game Tutorial with HTML Canvas: Gorillas : r/learnjavascript - Reddit, https://www.reddit.com/r/learnjavascript/comments/1aet28v/javascript_game_tutorial_with_html_canvas_gorillas/  
1. 2D breakout game using pure JavaScript - Game development - MDN Web Docs, https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript  
1. jriecken/sat-js: A simple JavaScript library for performing 2D collision detection - GitHub, https://github.com/jriecken/sat-js  
1. Develop an HTML5 Game - HTML5 Tutorial - Spicy Yoghurt, https://spicyyoghurt.com/tutorials/html5-javascript-game-development/develop-a-html5-javascript-game  
1. Ultimate Guide to JavaScript Game Development - CodeWizardsHQ, https://www.codewizardshq.com/javascript-games/  
1. Best practice? html5 game with canvas - Reddit, https://www.reddit.com/r/html5/comments/vfhe8/best_practice_html5_game_with_canvas/  
1. Create a Proper Game Loop - JavaScript Tutorial | Spicy Yoghurt, https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe  
1. Anatomy of a video game - Game development - MDN Web Docs, https://developer.mozilla.org/en-US/docs/Games/Anatomy  
1. Build a Game with JavaScript and HTML Canvas [RPG Kit series] - YouTube, https://www.youtube.com/watch?v=HmxNrlPx8iY&pp=0gcJCfwAo7VqN5tD  
1. Quick Tip: How to Make a Game Loop in JavaScript - SitePoint, https://www.sitepoint.com/quick-tip-game-loop-in-javascript/  
1. JavaScript Game Development Course for Beginners - YouTube, https://m.youtube.com/watch?v=GFO_txvwK_c&pp=ygUHI2dhbWVqcw%3D%3D  
1. HTML5 Canvas and JavaScript Game Tutorial - YouTube, https://m.youtube.com/watch?v=eI9idPTT0c4  
1. Asteroids Ship Movement - Game Development Stack Exchange, https://gamedev.stackexchange.com/questions/33205/asteroids-ship-movement  
1. 2D collision detection - Game development - MDN Web Docs, https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection  
1. SAT.js | Sat-js - GitHub Pages, http://jriecken.github.io/sat-js/  
1. Introduction to Web Audio API - CSS-Tricks, https://css-tricks.com/introduction-web-audio-api/  
1. Web Audio API best practices - Web APIs - MDN Web Docs - Mozilla, https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices  
1. Loading and Playing Sound Files - audio, https://dobrian.github.io/cmp/topics/sample-recording-and-playback-with-web-audio-api/1.loading-and-playing-sound-files.html  
1. Getting started with Web Audio API | Articles - web.dev, https://web.dev/articles/webaudio-intro  
1. Playing Sounds with the Web Audio API - Apple Developer, https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html  
1. How to rapidly play multiple copies of a soundfile in javascript - Stack Overflow, https://stackoverflow.com/questions/61453760/how-to-rapidly-play-multiple-copies-of-a-soundfile-in-javascript  
1. Handling User Input | gablaxian.com, https://gablaxian.com/articles/creating-a-game-with-javascript/