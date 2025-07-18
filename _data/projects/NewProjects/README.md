# 🌍 Interactive 3D Gallery Sphere

A cutting-edge 3D interactive gallery built with React, React Three Fiber, and Cannon.js physics. Experience images in a revolutionary hybrid 2D/3D environment where users can explore a physics-driven sphere, position images with precision, and seamlessly transition between immersive 3D exploration and detailed 2D viewing for in-depth analysis.

!
Screenshot: gallery-sphere/interactive-3d-gallery/gallerisphere

## ✨ Features

### 🎮 **Interactive 3D Sphere**
- **Physics-Driven Rotation**: Smooth, realistic sphere rotation using Cannon.js physics engine
- **Custom Drag Controls**: Intuitive mouse/touch interaction for sphere manipulation
- **Responsive Physics**: Configurable sensitivity and physics parameters
- **Manual Control Override**: Precise positioning that overrides physics when needed
- **Camera Distance Control**: Keyboard/mouse combination for camera zoom for optimal viewing.

### 🖼️ **Advanced Image System**
- **Texture Atlas Rendering**: Efficient instanced rendering of multiple images
- **Dynamic Positioning**: Images wrap and move naturally with sphere rotation
- **Z-Axis Control**: Mouse wheel precision control for image depth positioning
- **Hybrid 2D/3D Viewing**: Seamless transition from the immersive 3D sphere to a dedicated 2D detail viewport for in-depth image examination and manipulation.

### 🎯 **User Experience**
- **Focus System**: Click to focus images for precise Z-axis control
- **Smooth Animations**: Tween.js powered transitions and positioning
- **Intuitive Controls**: Clear visual feedback and powerful keyboard + mouse wheel combinations for precise manipulation.
- **Performance Optimized**: Efficient rendering with instanced meshes
- **Dynamic Instance Hiding**: Automatically hides the 3D image instance when its detailed 2D view is active, preventing visual clutter.

### 🔧 **Technical Excellence**
- **Physics Integration**: Cannon.js for realistic sphere physics
- **Event Management**: Sophisticated event handling and propagation
- **State Management**: React Context for global state coordination
- **Modular Architecture**: Clean, maintainable code structure
- **Physics Override/Enforcement**: Continuous manual control over image Z-depth that robustly overrides physics simulation for precise positioning. This addresses potential conflicts between declarative animations and physics updates, ensuring stable visual outcomes.
- **Dynamic Physics Pausing**: Temporarily pauses the physics simulation during specific image interactions to prevent conflicts with visual animations, ensuring smooth transitions.
- **Efficient Texture Management**: Proper disposal and cleanup of generated textures to optimize memory usage.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd interactive-3d-gallery

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration
The gallery is configured via `public/config.json`:

```json
{
  "appSettings": {
    "sphereRadius": 5,
    "imagePlaneSize": 1.2,
    "dragSensitivity": 25,
    "wobbleIntensity": 0.1,
    "imagePopOutDistance": 2,
    "initialSphereTextureId": "sphere_textured",
    "initialCatalogId": "nature"
  },
  "spheres": [...],
  "catalogs": [...]
}
```

## 🎮 Controls

| Action | Control |
|---|---|
| Rotate Sphere | Drag sphere with mouse/touch |
| Select Image for Z-Control | Click on any image (after closing 2D panel) |
| Adjust Image Distance (Z-axis) | Hold 'Z' key + Mouse wheel (when image is focused) |
| Adjust Camera Distance | Hold 'C' key + Mouse wheel |
| View Image Details | Click on image |
| Close Detail Viewport | Click outside the panel or Press Escape |

## 🏗️ Architecture

### Core Components

```
src/
├── components/
│   ├── SphereGallery.jsx      # Main 3D scene orchestrator
│   ├── ImagePlane.jsx         # Instanced image rendering
│   ├── UIControls.jsx         # User interface controls
│   └── DetailViewport.jsx     # 2D detail view overlay
├── hooks/
│   ├── useSpherePhysics.js    # Cannon.js physics integration
│   ├── useSphereInteraction.js # Sphere drag controls
│   ├── useImageInteractions.js # Comprehensive system for image selection, drag-and-drop on the sphere, Z-axis manipulation, and triggering the 2D detail view.
│   └── useTextureLoader.js    # Texture loading utilities
└── utils/
    ├── dataLoader.js          # Configuration loading
    └── textureAtlas.js        # Texture atlas generation
```

### Key Technical Features

#### Physics Integration
- **Cannon.js Body**: Sphere physics body with realistic mass and inertia
- **Physics Stepper**: Global physics world management
- **Manual Override**: Tween.js animations and continuous useFrame enforcement override physics to maintain precise image positions and Z-depth.

#### Image Rendering
- **Texture Atlas**: Efficient single texture for multiple images
- **Instanced Meshes**: High-performance rendering of multiple image planes
- **Dynamic Positioning**: Real-time position updates based on sphere transformation

#### Event System
- **Raycasting**: Precise image selection and interaction
- **Event Propagation**: Sophisticated handling of sphere vs image interactions
- **Focus Management**: Tracks the currently selected image for contextual interactions like Z-axis depth adjustment.

## 🎨 Customization

### Adding New Image Catalogs

1. **Create Image Folder**: Add images to `public/images/catalog_[name]/`
2. **Update Config**: Add catalog entry to `config.json`:

```json
{
  "id": "abstract",
  "name": "Abstract Art",
  "folderName": "catalog_abstract",
  "images": [
    {
      "name": "abstract1",
      "file": "abstract1.jpg"
    }
  ]
}
```

### Sphere Textures

Add sphere textures to `public/textures/` and reference in config:

```json
{
  "id": "sphere_metal",
  "name": "Metal Sphere",
  "texture": "sphere_metal.jpg",
  "materialProps": {
    "metalness": 0.8,
    "roughness": 0.2
  }
}
```

### Physics Tuning

Adjust physics parameters in `config.json`:

```json
{
  "appSettings": {
    "dragSensitivity": 25,    // Higher = more responsive
    "wobbleIntensity": 0.1,   // Physics wobble effect
    "sphereRadius": 5         // Sphere size
  }
}
```

## 🔧 Development

### Project Structure
```
interactive-3d-gallery/
├── public/
│   ├── config.json           # Application configuration
│   ├── images/               # Image catalogs
│   └── textures/             # Sphere textures
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── App.jsx              # Main application
├── package.json
└── vite.config.js
```

### Key Dependencies
- **React Three Fiber**: 3D rendering framework
- **Cannon.js**: Physics engine
- **Tween.js**: Animation library
- **Vite**: Build tool and dev server

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🚧 TODO: Future Enhancements

### 🎯 **High Priority**

#### **Multi-Catalog System**
- [ ] **Catalog Switcher UI**: Dropdown or carousel to switch between image catalogs
- [ ] **Dynamic Catalog Loading**: Load catalogs on-demand to reduce initial bundle size
- [ ] **Catalog Metadata**: Add descriptions, tags, and metadata for each catalog
- [ ] **Favorite Catalogs**: User preference system for frequently used catalogs

#### **Enhanced Image Interactions**
- [ ] **Image Filtering**: Search and filter images within catalogs
- [ ] **Image Tagging**: Add tags and categories to images
- [ ] **Image Collections**: Group related images together
- [ ] **Image Metadata Display**: Show image information in 2D viewport

#### **Advanced Physics**
- [ ] **Gravity Effects**: Add subtle gravity to pull images toward sphere
- [ ] **Collision Detection**: Prevent images from overlapping
- [ ] **Physics Presets**: Different physics modes (floaty, heavy, bouncy)
- [ ] **Physics Visualization**: Debug mode to show physics bodies

### 🎨 **Medium Priority**

#### **Visual Enhancements**
- [ ] **Particle Effects**: Add ambient particles around the sphere
- [ ] **Lighting Effects**: Dynamic lighting that responds to sphere rotation
- [ ] **Post-Processing**: Bloom, depth of field, and other visual effects
- [ ] **Custom Shaders**: Advanced material shaders for unique visual effects
- [ ] **Animation Presets**: Pre-defined sphere rotation patterns

#### **User Experience**
- [ ] **Tutorial System**: Interactive tutorial for new users
- [ ] **Keyboard Shortcuts**: Additional keyboard controls for power users
- [ ] **Gesture Support**: Touch gestures for mobile devices
- [ ] **Accessibility**: Screen reader support and keyboard navigation
- [ ] **Performance Settings**: Quality/performance toggle for different devices

#### **Social Features**
- [ ] **Image Sharing**: Share specific images or views via URL
- [ ] **User Collections**: Save and share custom image arrangements
- [ ] **Collaborative Viewing**: Real-time shared viewing sessions
- [ ] **Comments System**: Add comments to images

### 🔮 **Future Vision**

#### **Advanced 3D Features**
- [ ] **VR/AR Support**: Virtual and augmented reality integration
- [ ] **3D Models**: Support for 3D models alongside images
- [ ] **Environmental Effects**: Weather, time of day, and atmospheric effects
- [ ] **Custom Geometries**: Different sphere shapes and geometries

#### **AI Integration**
- [ ] **Auto-Tagging**: AI-powered image tagging and categorization
- [ ] **Smart Arrangement**: AI-suggested image positioning
- [ ] **Content Recognition**: Automatic content-based grouping
- [ ] **Personalization**: AI-driven personalized gallery experiences

#### **Enterprise Features**
- [ ] **Multi-User Support**: User accounts and authentication
- [ ] **Cloud Storage**: Integration with cloud storage services
- [ ] **Analytics Dashboard**: Usage analytics and insights
- [ ] **API Integration**: REST API for external integrations

### 🛠️ **Technical Improvements**

#### **Performance Optimization**
- [ ] **Lazy Loading**: Progressive loading of images and textures
- [ ] **Level of Detail**: Dynamic quality adjustment based on distance
- [ ] **WebGL Optimization**: Advanced rendering optimizations
- [ ] **Memory Management**: Better memory usage and garbage collection

#### **Code Quality**
- [ ] **TypeScript Migration**: Convert to TypeScript for better type safety
- [ ] **Unit Tests**: Comprehensive test coverage
- [ ] **E2E Tests**: End-to-end testing with Playwright
- [ ] **Documentation**: API documentation and code comments

#### **Build & Deployment**
- [ ] **Docker Support**: Containerized deployment
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **CDN Integration**: Content delivery network for assets
- [ ] **PWA Support**: Progressive web app features

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Three Fiber** team for the amazing 3D framework
- **Cannon.js** developers for the physics engine
- **Three.js** community for the foundational 3D library
- **Vite** team for the fast build tool
- **React Spring** team for delightful UI animations.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/rubyrayjuntos/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rubyrayjuntos/discussions)
- **Email**: support@rswan.org

---

**Built with ❤️ and lots of coffee ☕**

*This project represents the future of interactive digital galleries - where art meets technology in an immersive, engaging experience.*
