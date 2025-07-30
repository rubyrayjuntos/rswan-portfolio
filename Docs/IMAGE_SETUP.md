# Easy Image Management for Your Portfolio

I've created several tools to make it easier for you to add images to your portfolio. Here are your options:

## Option 1: Use the Image Manager (Recommended)

1. **Open the image manager**: Open `image-manager.html` in your browser
2. **Enter a project name**: Use kebab-case (e.g., "ai-tarot", "cyberpunk-art")
3. **Upload images**: Drag and drop or click to select image files
4. **Copy the generated code**: The tool will generate the exact code you need
5. **Paste into your portfolio**: Add the code to the `projects` array in `index.html`
6. **Move images to the correct folder**: Create the folder structure and move your images

### Folder Structure
```
images/uploads/projects/
├── ai-tarot/
│   ├── tarot1.jpg
│   ├── tarot2.png
│   └── tarot3.jpg
├── cyberpunk-art/
│   ├── neon-dreams.jpg
│   └── digital-rain.png
└── papi-chispa/
    └── papi.jpg
```

## Option 2: Use the Command Line Script

If you prefer command line tools:

```bash
# List all project images
node scripts/upload-images.js list

# Create a new project and add images
node scripts/upload-images.js create "ai-tarot" ./temp/tarot1.jpg ./temp/tarot2.png

# Generate HTML for a project
node scripts/upload-images.js html "ai-tarot"

# Generate portfolio data JSON
node scripts/upload-images.js data
```

## Option 3: Manual Setup

1. **Create project folder**: `images/uploads/projects/[project-name]/`
2. **Add your images** to that folder
3. **Update the projects array** in `index.html` with the correct paths

### Example Project Entry
```javascript
{
    id: 5,
    title: "My New Project",
    description: "Description of your project",
    imageUrl: "./images/uploads/projects/my-project/main-image.jpg",
    medium: "code", // or "art", "writing"
    genre: ["web-app"],
    style: ["minimalist"],
    mood: 'energetic',
    year: 2024,
    role: "Full-Stack Developer",
    links: { "Live Site": "https://example.com" },
    pitch: "Your project pitch",
    challenge: "The challenge you solved",
    development: "How you built it",
    outcome: "The results",
    tech: ["React", "Node.js", "MongoDB"],
    gallery: [
        {
            url: "./images/uploads/projects/my-project/screenshot1.jpg",
            title: "Main Interface",
            description: "The main user interface",
            dimensions: "1920x1080"
        }
    ]
}
```

## Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WebP

## Tips for Best Results

1. **Use descriptive filenames**: `main-interface.jpg` instead of `img1.jpg`
2. **Optimize images**: Keep file sizes reasonable (under 1MB for web)
3. **Use consistent dimensions**: Similar aspect ratios work better in the grid
4. **Include alt text**: The system will generate basic alt text, but you can customize it

## Quick Start

1. Open `image-manager.html` in your browser
2. Enter a project name like "my-new-project"
3. Upload 3-5 images
4. Copy the generated code
5. Paste it into your `index.html` projects array
6. Create the folder and move your images
7. Refresh your portfolio page

That's it! Your new project will appear in the gallery with all its images. 