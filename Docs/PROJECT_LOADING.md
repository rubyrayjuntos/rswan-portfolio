# Dynamic Project Loading System

This portfolio now uses a dynamic project loading system that automatically discovers and loads all project JSON files from the `_data/projects/` directory.

## 🚀 How It Works

### 1. **Automatic Discovery**
- The system scans the `_data/projects/` directory for all `.json` files
- Uses a manifest file (`_data/projects/manifest.json`) for faster loading and better organization
- Falls back to dynamic discovery if no manifest is found

### 2. **Smart Loading**
- Loads projects in parallel for better performance
- Maintains consistent project IDs across sessions
- Handles missing files gracefully
- Provides detailed logging for debugging

### 3. **No More Hardcoding**
- No need to manually update the project list in code
- Simply add new JSON files to `_data/projects/` and they'll be automatically included
- The manifest is automatically updated when you run the update script

## 📁 File Structure

```
_data/projects/
├── manifest.json              # Auto-generated project index
├── echoes-of-lumina.json      # Writing project
├── nova-writers-conspiracy.json # Code project
├── henri-ruben.json           # Art project
└── ... (other project files)

js/
├── project-loader.js          # Dynamic loading logic
└── ...

scripts/
└── update-manifest.js         # Manifest update script
```

## 🛠️ Usage

### Adding New Projects

1. **Create a new JSON file** in `_data/projects/` with your project data
2. **Run the manifest update script**:
   ```bash
   # Windows
   update-manifest.bat
   
   # Or directly with Node.js
   node scripts/update-manifest.js
   ```
3. **Refresh your portfolio** - the new project will appear automatically!

### Project JSON Structure

Each project file should follow this structure:

```json
{
  "id": 20,
  "title": "Your Project Title",
  "description": "Project description...",
  "imageUrl": "images/projects/your-project/cover.jpg",
  "medium": "code|art|writing",
  "genre": ["Category 1", "Category 2"],
  "style": ["Style 1", "Style 2"],
  "tech": ["Technology 1", "Technology 2"],
  "mood": "mood-type",
  "year": 2025,
  "role": "Your Role",
  "links": {
    "Demo": "https://demo.url",
    "GitHub": "https://github.com/..."
  },
  "pitch": "Project pitch...",
  "challenge": "Project challenge...",
  "development": "Development process...",
  "outcome": "Project outcome..."
}
```

### Updating Existing Projects

1. **Edit the JSON file** directly
2. **Run the manifest update script** to refresh the manifest
3. **Refresh your portfolio** to see changes

## 🔧 Technical Details

### ProjectLoader Class

The `ProjectLoader` class provides these methods:

- `loadAllProjects()` - Load all projects dynamically
- `getProjectById(id)` - Get a specific project by ID
- `getProjectsByMedium(medium)` - Filter projects by medium
- `getUniqueMediums()` - Get all available mediums
- `reload()` - Reload all projects

### Manifest File

The manifest file (`_data/projects/manifest.json`) contains:

- **Version tracking** - Track manifest format changes
- **Last updated** - When the manifest was last generated
- **Project list** - All discovered projects with metadata

### Error Handling

The system handles various error scenarios:

- **Missing files** - Gracefully skips missing project files
- **Invalid JSON** - Logs errors and continues loading other projects
- **Network issues** - Falls back to cached data when possible
- **No projects found** - Shows fallback content

## 🎯 Benefits

### For Developers
- **No more hardcoded lists** - Add projects without touching code
- **Consistent IDs** - Project IDs are preserved across updates
- **Better performance** - Manifest-based loading is faster
- **Easier maintenance** - Centralized project management

### For Content Creators
- **Simple workflow** - Just add JSON files and run update script
- **No technical knowledge required** - JSON format is straightforward
- **Immediate updates** - Changes appear instantly after refresh
- **Reliable** - System handles errors gracefully

## 🐛 Troubleshooting

### Projects Not Appearing
1. Check that the JSON file is in `_data/projects/`
2. Verify the JSON syntax is valid
3. Run the manifest update script
4. Check browser console for errors

### Wrong Project Loading
1. Ensure project IDs are unique
2. Run the manifest update script to refresh IDs
3. Clear browser cache and refresh

### Performance Issues
1. Check that the manifest file exists
2. Verify all project files are accessible
3. Check browser console for loading errors

## 📝 Future Enhancements

Potential improvements for the future:

- **Auto-reload on file changes** - Watch for file system changes
- **Caching system** - Cache project data for better performance
- **Validation schema** - Enforce project JSON structure
- **Image optimization** - Auto-optimize project images
- **Search indexing** - Build search index for better filtering 