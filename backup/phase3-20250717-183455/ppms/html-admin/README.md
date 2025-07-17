# Portfolio Project Management System (PPMS) - HTML Admin

A comprehensive HTML/CSS/JavaScript solution for managing portfolio projects with robust validation, lookup management, and export capabilities.

## 🚀 Features

### Core Functionality
- **Project Management**: Create, edit, and delete portfolio projects
- **Comprehensive Validation**: JSON schema validation with business rules
- **Lookup Management**: Manage genres, styles, technologies, and moods
- **Export/Import**: Generate validated JSON files and manifest
- **Medium-Specific Content**: Support for code, art, and writing projects
- **Real-time Validation**: Instant feedback on form inputs
- **Responsive Design**: Works on desktop, tablet, and mobile

### Validation Engine
- **Schema Validation**: Ensures all required fields are present
- **Type Checking**: Validates data types and constraints
- **Business Rules**: Medium-specific validation requirements
- **Cross-field Validation**: Ensures data consistency
- **URL Validation**: Checks all links and image URLs

### Lookup System
- **Dynamic Management**: Add, edit, and delete lookup values
- **Usage Tracking**: Tracks how often each lookup is used
- **Category Support**: Organize lookups by medium type
- **Auto-completion**: Suggests existing values in forms

## 📁 File Structure

```
ppms/html-admin/
├── index.html              # Main admin interface
├── css/
│   └── admin.css           # Complete styling system
├── js/
│   └── admin.js            # Core functionality
├── data/
│   ├── schema.json         # JSON schema definition
│   └── sample-projects.json # Example project data
└── README.md               # This documentation
```

## 🛠️ Installation & Setup

### Quick Start
1. **No installation required** - Just open `index.html` in your browser
2. **Local Storage**: Data is stored in browser localStorage by default
3. **File System**: Export JSON files to integrate with your portfolio

### Integration with Portfolio
1. Export projects using the "Export All" button
2. Copy generated JSON files to your portfolio's `_data/projects/` directory
3. Update your portfolio's project loader to use the new files

## 📋 Usage Guide

### Adding a New Project

1. **Click "New Project"** to start with a clean form
2. **Fill in Basic Information**:
   - Title, description, image URL
   - Medium (code/art/writing)
   - Year, role, mood
3. **Add Arrays**: Enter comma-separated values for genre, style, tech
4. **Add JSON Content**: Use proper JSON format for links and gallery
5. **Medium-Specific Content**: Add artifacts (code), excerpts (writing), or process content (art)
6. **Save**: Click "Save Project" to validate and store

### Managing Lookups

1. **View Current Lookups**: See all genres, styles, technologies, and moods
2. **Add New Values**: Click "Add [type]" buttons
3. **Edit Existing**: Click "Edit" on any lookup item
4. **Track Usage**: See how often each lookup is used across projects

### Validation

1. **Real-time Feedback**: Form shows validation errors as you type
2. **Comprehensive Checks**: Validates schema, business rules, and cross-field logic
3. **Medium-Specific**: Ensures projects have appropriate content for their type
4. **Bulk Validation**: Use "Validate All" to check all projects at once

### Export/Import

1. **Export All**: Generates individual JSON files and manifest
2. **Import JSON**: Drag and drop JSON files to import projects
3. **Validation**: All imported projects are validated automatically

## 🎨 Project Types & Content

### Code Projects
**Required Content:**
- Artifacts (documents, code, designs)
- Technologies used
- Technical specifications

**Example Artifacts:**
```json
{
  "name": "System Architecture",
  "description": "Technical documentation",
  "url": "https://docs.example.com",
  "icon": "🏗️",
  "artifactType": "document"
}
```

### Writing Projects
**Required Content:**
- Excerpts from the work
- Themes analysis
- Character development notes

**Example Excerpt:**
```json
{
  "title": "Opening Scene",
  "content": "The story begins with...",
  "chapter": "Chapter 1",
  "pageNumber": 1
}
```

### Art Projects
**Required Content:**
- Process documentation
- Inspiration sources
- Gallery with optional hotspots

**Example Process Content:**
```json
{
  "phase": "Research",
  "description": "Gathered reference materials...",
  "images": ["url1.jpg", "url2.jpg"]
}
```

## 🔧 Configuration

### Schema Customization
Edit `data/schema.json` to:
- Add new fields to projects
- Modify validation rules
- Change required fields
- Add new lookup types

### Styling
Modify `css/admin.css` to:
- Change color scheme
- Adjust layout
- Add custom animations
- Modify responsive breakpoints

### Functionality
Extend `js/admin.js` to:
- Add new validation rules
- Implement file uploads
- Add data persistence options
- Integrate with external APIs

## 📊 Data Structure

### Project Schema
```json
{
  "id": 1,
  "title": "Project Title",
  "description": "Project description",
  "imageUrl": "path/to/image.jpg",
  "medium": "code|art|writing",
  "genre": ["genre1", "genre2"],
  "style": ["style1", "style2"],
  "tech": ["tech1", "tech2"],
  "mood": "energetic|serene|dark|mystical|innovative|playful|professional|experimental",
  "year": 2025,
  "role": "Your Role",
  "links": {"GitHub": "https://github.com/..."},
  "pitch": "Project pitch",
  "challenge": "Project challenge",
  "development": "Development process",
  "outcome": "Project outcome",
  "gallery": [...],
  "artifacts": [...], // Code projects
  "excerpts": [...], // Writing projects
  "processContent": [...] // Art projects
}
```

### Lookup Schema
```json
{
  "id": 1,
  "name": "Lookup Name",
  "description": "Description",
  "category": "code|art|writing|universal",
  "usageCount": 5,
  "website": "https://example.com", // Technologies only
  "createdAt": "2025-01-01T00:00:00Z"
}
```

## 🔍 Validation Rules

### Required Fields
- All projects must have: id, title, description, imageUrl, medium, genre, style, tech, mood, year, role, links, pitch, challenge, development, outcome, gallery

### Medium-Specific Requirements
- **Code**: Must have artifacts and technologies
- **Art**: Must have process content and inspiration content
- **Writing**: Must have excerpts and themes analysis

### Business Rules
- Year must be between 2000-2030
- All URLs must be valid
- Completed projects must have detailed outcomes
- Gallery images must have valid URLs

## 🚀 Advanced Features

### File Management
- **Image Processing**: Automatic resizing and optimization (planned)
- **File Organization**: Structured directory creation (planned)
- **Backup System**: Automatic project backups (planned)

### Analytics
- **Usage Statistics**: Track lookup popularity
- **Project Metrics**: Monitor project completion rates
- **Validation Reports**: Identify common validation issues

### Integration
- **API Support**: REST API for external integration (planned)
- **Database**: SQLite/PostgreSQL support (planned)
- **Cloud Storage**: AWS S3 integration (planned)

## 🐛 Troubleshooting

### Common Issues

**Validation Errors:**
- Check that all required fields are filled
- Ensure URLs are properly formatted
- Verify JSON syntax in complex fields

**Import Problems:**
- Ensure JSON files are valid
- Check that imported projects match the schema
- Verify file encoding is UTF-8

**Performance Issues:**
- Large datasets may slow down the interface
- Consider using the export feature to manage data
- Clear browser cache if needed

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Responsive design supported

## 📈 Future Enhancements

### Planned Features
1. **File Upload System**: Drag-and-drop image and document uploads
2. **Advanced Search**: Full-text search across all projects
3. **Bulk Operations**: Edit multiple projects at once
4. **Templates**: Pre-built project templates
5. **Collaboration**: Multi-user editing support
6. **Version Control**: Track project changes over time

### Technical Improvements
1. **Database Integration**: Replace localStorage with proper database
2. **API Development**: RESTful API for external access
3. **Real-time Sync**: WebSocket-based real-time updates
4. **Offline Support**: Service worker for offline functionality
5. **Advanced Validation**: Custom validation rule builder

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Use ES6+ JavaScript features
- Follow consistent naming conventions
- Add comments for complex logic
- Ensure responsive design
- Test across multiple browsers

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with vanilla HTML/CSS/JavaScript for maximum compatibility
- Inspired by modern admin interfaces and portfolio management needs
- Designed for seamless integration with existing portfolio systems

---

**Ready to manage your portfolio projects like a pro?** 🚀

Open `index.html` in your browser and start creating amazing projects! 