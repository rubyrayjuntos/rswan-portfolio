# Template Usage Guidelines & Validation Rules

## 📋 Overview

This document provides comprehensive guidelines for using the three project templates (`_SYSTEMS_TEMPLATE.md`, `_VISIONS_TEMPLATE.md`, `_WORDS_TEMPLATE.md`) and ensures consistent, high-quality project documentation.

---

## 🎯 **Template Selection Guide**

### **Choose _SYSTEMS_TEMPLATE.md for:**
- Software applications and tools
- Web applications and platforms
- APIs and backend systems
- Mobile applications
- Game development projects
- Automation and workflow systems
- Technical documentation projects

### **Choose _VISIONS_TEMPLATE.md for:**
- Visual art projects and series
- Digital illustrations and paintings
- Photography projects
- Graphic design work
- Concept art and character designs
- Art installations and exhibitions
- Creative visual storytelling

### **Choose _WORDS_TEMPLATE.md for:**
- Novels and short stories
- Poetry collections
- Creative writing projects
- Screenplays and scripts
- Non-fiction writing
- Academic papers and research
- Content creation projects

---

## 📝 **Required Fields by Template**

### **All Templates (Core Information)**
```json
{
  "id": "unique_number",
  "title": "Project Title",
  "description": "One-paragraph description for portfolio grid",
  "imageUrl": "card-hero.jpg",
  "medium": "code|art|writing",
  "genre": ["array", "of", "genres"],
  "style": ["array", "of", "styles"],
  "tech": ["array", "of", "technologies"],
  "mood": "mood_for_theme_mapping",
  "year": 2024,
  "role": "Primary role description",
  "variant": "wide|featured|system|series",
  "status": "development|live|completed|in-progress",
  "links": {
    "github": "url",
    "demo": "url",
    "live": "url"
  },
  "pitch": "One-sentence hook",
  "challenge": "Primary challenge description",
  "development": "Development process description",
  "outcome": "Final result description",
  "gallery": [
    {
      "url": "image.jpg",
      "title": "Image Title",
      "description": "Image description"
    }
  ],
  "journey": [
    {
      "title": "Journey Step Title",
      "description": "Journey step description"
    }
  ],
  "specs": [
    {
      "title": "Spec Title",
      "description": "Spec description"
    }
  ]
}
```

### **Code Projects (_SYSTEMS_TEMPLATE.md)**
```json
{
  "artifacts": [
    {
      "name": "Document Name",
      "description": "Document description",
      "url": "path_or_url",
      "icon": "🏗️"
    }
  ]
}
```

### **Art Projects (_VISIONS_TEMPLATE.md)**
```json
{
  "process": "<h3>Process Title</h3><p>Process content with HTML formatting</p>",
  "inspiration": "<h3>Inspiration Title</h3><p>Inspiration content with HTML formatting</p>",
  "gallery": [
    {
      "url": "image.jpg",
      "title": "Image Title",
      "description": "Image description",
      "hotspots": [
        {
          "x": 50,
          "y": 40,
          "title": "Hotspot Title",
          "description": "Hotspot description"
        }
      ]
    }
  ]
}
```

### **Writing Projects (_WORDS_TEMPLATE.md)**
```json
{
  "excerpts": "<h3>Scene Title</h3><p>Excerpt content</p><blockquote>Important quote</blockquote>",
  "themesAnalysis": "<h3>Central Themes</h3><p>Thematic analysis with HTML formatting</p>"
}
```

---

## 🔒 **HTML Content Validation Rules**

### **Allowed HTML Tags**
- `<p>` - Paragraphs
- `<h1>` through `<h6>` - Headings
- `<br>` - Line breaks
- `<strong>` - Bold text
- `<em>` - Italic text
- `<u>` - Underlined text
- `<blockquote>` - Quotations
- `<ul>`, `<ol>`, `<li>` - Lists
- `<span>` - Inline styling
- `<div>` - Block containers

### **Allowed CSS Properties**
- `color` - Text color
- `background-color` - Background color
- `font-size` - Font size
- `font-weight` - Font weight
- `font-style` - Font style
- `text-align` - Text alignment
- `margin` - Margins
- `padding` - Padding
- `border` - Borders
- `border-radius` - Border radius
- `line-height` - Line height
- `text-decoration` - Text decoration
- `display` - Display property
- `position` - Position
- `top`, `left`, `right`, `bottom` - Positioning
- `width`, `height` - Dimensions
- `opacity` - Opacity
- `transform` - Transforms
- `transition` - Transitions
- `animation` - Animations

### **Security Restrictions**
- No `<script>` tags
- No `<iframe>` tags
- No `javascript:` URLs
- No `expression()` CSS functions
- No external resource loading
- No event handlers

---

## 🎨 **Content Guidelines**

### **Description Field**
- **Length**: 2-4 sentences maximum
- **Purpose**: Portfolio grid display
- **Style**: Clear, engaging, professional
- **HTML**: Limited formatting allowed

### **Pitch Field**
- **Length**: One sentence
- **Purpose**: Hook for project detail page
- **Style**: Compelling, specific, benefit-focused

### **Challenge Field**
- **Length**: 1-2 sentences
- **Purpose**: Show problem-solving skills
- **Style**: Specific, technical, authentic

### **Development Field**
- **Length**: 2-3 sentences
- **Purpose**: Show process and methodology
- **Style**: Technical, systematic, results-oriented

### **Outcome Field**
- **Length**: 1-2 sentences
- **Purpose**: Show results and impact
- **Style**: Measurable, specific, achievement-focused

---

## 🖼️ **Image Guidelines**

### **Gallery Images**
- **Format**: JPG, PNG, WebP
- **Dimensions**: 1200x800px recommended
- **File Size**: < 500KB per image
- **Naming**: descriptive-filename.jpg
- **Path**: images/projects/project-id/filename.jpg

### **Card Hero Image**
- **File**: card-hero.jpg
- **Purpose**: Portfolio grid thumbnail
- **Style**: Representative of project
- **Quality**: High resolution, good composition

### **Hotspots (Art Projects)**
- **Coordinates**: Percentage values (0-100)
- **Position**: Meaningful image locations
- **Content**: Descriptive, engaging
- **Count**: 2-5 hotspots per image recommended

---

## 🔧 **Technical Specifications**

### **Mood-to-Theme Mapping**
```javascript
const moodThemeMap = {
  'ethereal': 'twilight',
  'mystical': 'lavender',
  'energetic': 'sunset',
  'technical': 'dark',
  'romantic': 'ocean',
  'bold': 'forest',
  'calm': 'original'
};
```

### **Required File Structure**
```
_data/projects/
├── project-name.json
├── _SYSTEMS_TEMPLATE.md
├── _VISIONS_TEMPLATE.md
└── _WORDS_TEMPLATE.md

images/projects/
└── project-id/
    ├── card-hero.jpg
    ├── image-1.jpg
    └── image-2.jpg
```

### **JSON Validation**
- Valid JSON syntax
- Required fields present
- Correct data types
- Proper nesting structure
- Valid URLs and paths

---

## ✅ **Quality Checklist**

### **Before Submission**
- [ ] All required fields completed
- [ ] HTML content validated
- [ ] Images optimized and uploaded
- [ ] Links tested and working
- [ ] JSON syntax validated
- [ ] Template compliance verified
- [ ] Content reviewed for accuracy
- [ ] Spelling and grammar checked

### **Content Review**
- [ ] Description fits portfolio grid
- [ ] Pitch is compelling and specific
- [ ] Challenge shows problem-solving
- [ ] Development shows methodology
- [ ] Outcome shows measurable results
- [ ] Journey tells a coherent story
- [ ] Specs highlight key strengths
- [ ] Gallery images are high quality

### **Technical Review**
- [ ] File paths are correct
- [ ] Image dimensions are appropriate
- [ ] Hotspot coordinates are accurate
- [ ] Theme mapping is appropriate
- [ ] HTML formatting is clean
- [ ] No broken links
- [ ] No missing assets

---

## 🚀 **Best Practices**

### **Content Creation**
1. **Start with the template** - Use the appropriate template as your foundation
2. **Write for your audience** - Consider who will be viewing your portfolio
3. **Be specific** - Avoid generic descriptions and claims
4. **Show, don't tell** - Use concrete examples and results
5. **Keep it concise** - Respect the character limits and guidelines

### **Technical Implementation**
1. **Follow naming conventions** - Use consistent file and folder naming
2. **Optimize images** - Compress images for web performance
3. **Test thoroughly** - Verify all links and functionality
4. **Validate content** - Use the HTML validation rules
5. **Document changes** - Keep track of updates and modifications

### **Maintenance**
1. **Regular updates** - Keep project information current
2. **Link checking** - Periodically verify external links
3. **Image optimization** - Update images as needed
4. **Content review** - Refresh descriptions and outcomes
5. **Template compliance** - Ensure ongoing adherence to guidelines

---

## 📞 **Support & Resources**

### **Template Files**
- `_SYSTEMS_TEMPLATE.md` - Code project template
- `_VISIONS_TEMPLATE.md` - Art project template
- `_WORDS_TEMPLATE.md` - Writing project template

### **Validation Tools**
- HTML content validation (built into ParallaxThemes.html)
- JSON syntax validation
- Image optimization tools
- Link checking utilities

### **Examples**
- `brand-identity-workflow.json` - Excellent code project example
- `archetypes-at-rest.json` - Excellent art project example
- `henri-ruben.json` - Excellent writing project example

---

*Last Updated: January 2025*
*Version: 1.0* 