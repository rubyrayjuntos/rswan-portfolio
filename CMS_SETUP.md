# Decap CMS Setup Guide

## Overview
This guide walks you through setting up Decap CMS (formerly Netlify CMS) for your portfolio site to manage content without touching code.

## What's Been Set Up

### 1. CMS Files Created
- `admin/index.html` - The CMS admin interface
- `admin/config.yml` - CMS configuration and content structure
- `_data/` directory - Where your content will be stored
- `images/uploads/` - Media upload directory

### 2. Content Structure
The CMS is configured to manage:

**Portfolio Projects** (`_data/` folder)
- Title, description, image URL
- Medium (code/art/writing)
- Categories (genres, styles, technologies, moods)
- Year, role, links
- Detailed content (pitch, challenge, development, outcome)

**Site Settings** (`_data/site-settings.json`)
- Site title and description
- Contact information
- About text
- Social media links

**Categories** (`_data/categories.json`)
- Predefined filter options for genres, styles, technologies, and moods

## Local Development Setup

### Prerequisites
- Node.js installed on your system
- Git repository initialized

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Local Development Server** (Terminal 1)
   ```bash
   npm run serve
   ```

3. **Start Local CMS Server** (Terminal 2)
   ```bash
   npm run cms-local
   ```

4. **Access the CMS**
   - Open your browser to `http://localhost:8080/admin-local/`
   - You'll see the Decap CMS interface without authentication

5. **Test the CMS Locally**
   - You can create, edit, and delete content directly
   - Changes are saved to your local files
   - No authentication required for local development

**Important**: Both servers must be running simultaneously:
- HTTP Server: `http://localhost:8080` (serves your site)
- Decap Proxy: `http://localhost:8081` (handles CMS operations)

**Note**: For local development, use the `admin-local/` path which uses the local backend. The `admin/` path is configured for production deployment with Netlify Identity.

## Production Deployment

### Option 1: Netlify (Recommended)

1. **Connect to Netlify**
   - Push your code to GitHub
   - Connect your repository to Netlify
   - Deploy automatically

2. **Enable Identity**
   - In Netlify dashboard, go to Site Settings > Identity
   - Click "Enable Identity"
   - Configure registration (invite-only recommended)

3. **Configure Git Gateway**
   - In Identity settings, enable Git Gateway
   - This allows the CMS to commit changes to your repository

4. **Set Up Authentication**
   - Go to Identity > Registration
   - Set to "Invite only" for security
   - Invite yourself as the first user

### Option 2: Other Hosting Providers

For other hosting providers, you'll need to:
1. Set up OAuth authentication
2. Configure webhook endpoints
3. Ensure proper CORS settings

## Using the CMS

### Adding New Projects

1. **Access Admin Panel**
   - Go to `yourdomain.com/admin/`
   - Log in with your credentials

2. **Create New Project**
   - Click "New Portfolio Projects"
   - Fill in all required fields
   - Upload images using the media library
   - Save and publish

3. **Project Fields Explained**
   - **Title**: Project name
   - **Description**: Brief overview
   - **Image URL**: Hero image for the project
   - **Medium**: Code, Art, or Writing
   - **Categories**: Select from predefined options
   - **Links**: Live site, GitHub, demo URLs
   - **Content**: Detailed case study sections

### Managing Site Settings

1. **Site Configuration**
   - Edit site title, description, and contact info
   - Update about text and social links
   - Changes appear immediately on your site

### Managing Categories

1. **Filter Options**
   - Add/remove genres, styles, technologies, moods
   - These populate the filter sidebar on your site
   - Keep them organized and relevant

## Integration with Your Site

### Loading CMS Data

You'll need to modify your JavaScript to load data from the CMS files. Here's a basic approach:

```javascript
// Load projects from CMS
async function loadProjectsFromCMS() {
  try {
    const response = await fetch('/_data/projects.json');
    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// Load site settings
async function loadSiteSettings() {
  try {
    const response = await fetch('/_data/site-settings.json');
    const settings = await response.json();
    return settings;
  } catch (error) {
    console.error('Error loading site settings:', error);
    return {};
  }
}
```

### Updating Your HTML

You'll need to update your `index_new.html` to:
1. Load data from the CMS files
2. Dynamically populate content
3. Handle the new data structure

## Security Considerations

1. **Authentication**: Always use invite-only registration
2. **Backups**: Your content is stored in Git, so it's version controlled
3. **Media Files**: Large files should be stored externally (CDN recommended)
4. **API Keys**: Keep sensitive information in environment variables

## Troubleshooting

### Common Issues

1. **CMS Not Loading**
   - Check that `admin/index.html` exists
   - Verify `admin/config.yml` is properly formatted
   - Ensure all required scripts are loaded

2. **Authentication Problems**
   - Verify Identity is enabled in Netlify
   - Check Git Gateway configuration
   - Ensure proper CORS settings

3. **Content Not Updating**
   - Check Git Gateway permissions
   - Verify file paths in config.yml
   - Check browser console for errors

### Getting Help

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity/)
- [Git Gateway Documentation](https://docs.netlify.com/visitor-access/git-gateway/)

## Next Steps

1. **Test Locally**: Use `npm run dev` to test the CMS
2. **Deploy**: Set up hosting with Netlify or your preferred provider
3. **Customize**: Modify the config.yml to match your specific needs
4. **Integrate**: Update your site code to load from CMS data
5. **Optimize**: Add custom widgets and workflows as needed

## File Structure After Setup

```
rswan-portfolio/
├── admin/
│   ├── index.html          # CMS admin interface
│   └── config.yml          # CMS configuration
├── _data/
│   ├── site-settings.json  # Site configuration
│   ├── categories.json     # Filter categories
│   └── [project files]     # Individual project data
├── images/
│   └── uploads/            # Media uploads
├── index_new.html          # Your main site
├── package.json            # Development dependencies
└── CMS_SETUP.md           # This guide
```

Your portfolio is now ready for content management through Decap CMS! 