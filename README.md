# A Data-Driven Portfolio & Storytelling Engine

This is not just a portfolio; it's a sophisticated, single-page application (SPA) designed to deliver rich, narrative-driven case studies. Built with pure, high-performance HTML, CSS, and JavaScript, it uses a data-driven architecture to dynamically showcase a diverse range of creative and technical work.

The core of this project is a flexible storytelling engine that tailors the user journey based on the project's medium, offering three distinct experiences:

*   **Visions (Art):** An immersive journey for visual projects, featuring cinematic galleries, high-resolution image viewing, and interactive hotspot-guided tours.
*   **Words (Writing):** A focused reading experience designed for narrative-heavy projects, with clean typography and layouts that emphasize the written word.
*   **Systems (Code):** A technical deep-dive for development projects, showcasing architectures, code artifacts, and detailed specifications.

---

## ✨ Core Features

*   **Client-Side Fuzzy Search:** A lightning-fast, typo-tolerant search powered by **Fuse.js**, allowing users to instantly find projects.
*   **Advanced Filtering System:** A multi-faceted filtering panel with dynamic facet counts that allows users to precisely narrow down projects by medium, genre, technology, style, mood, and year.
*   **Fully Modular UI:** The user interface is built with a modern, component-based CSS architecture, making it easy to maintain and extend.
*   **Automated Project Manifest:** A Node.js script automatically discovers all projects in the `/_data/projects` directory, eliminating the need for manual configuration and making the addition of new projects seamless.
*   **Content-First Workflow:** A powerful workflow that starts with structured Markdown templates, allowing for rich content creation that is then easily translated into the site's data structure.
*   **Immersive "Art Journey":** Art projects feature cinematic galleries with Ken Burns effects, parallax scrolling, and interactive hotspots that provide detailed annotations on high-resolution images.
*   **100% Vanilla JS:** No frameworks, no bloat. Just clean, efficient, and standards-compliant JavaScript for maximum performance and portability.

## 🚀 Getting Started

To run this project locally, you'll need [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install development dependencies:**
    This project uses `http-server` for local development.
    ```bash
    npm install
    ```

3.  **Generate the Project Manifest:**
    This crucial step scans the `/_data/projects` directory and creates a manifest of all available projects. You must run this command whenever you add, remove, or rename a project JSON file.
    ```bash
    npm run manifest
    ```

4.  **Start the development server:**
    This will start a local server, typically on port 8080.
    ```bash
    npm run serve
    ```

You can now open your browser and navigate to `http://localhost:8080` to see the application.

## ✍️ Adding a New Project (Content Workflow)

The portfolio is designed around a "content-first" workflow that makes adding new projects simple and robust.

### Step 1: Write Your Content in Markdown

Choose the template that best fits your project from the `_data/projects/` directory:

*   `_VISIONS_TEMPLATE.md` (for Art)
*   `_WORDS_TEMPLATE.md` (for Writing)
*   `_SYSTEMS_TEMPLATE.md` (for Code)

Copy the appropriate template to a new file and fill it out with your project's content. This is your source of truth.

### Step 2: Create the Project JSON file

Create a new `.json` file in the `/_data/projects/` directory (e.g., `my-new-project.json`). Use the content from your Markdown file to populate the JSON structure.

**Key Fields:**
*   `id`: A unique number for your project.
*   `title`: The project title.
*   `slug`: A URL-friendly version of the title (e.g., "my-new-project"). This is used for image paths.
*   `medium`: Must be one of `art`, `writing`, or `code`.
*   `imageUrl`: **(Convention)** Should almost always be `"card-hero.jpg"`.
*   `gallery`: An array of image objects. The `url` field should only contain the **filename** (e.g., `"my-image.jpg"`), not the full path.

### Step 3: Add Project Images

Create a new folder inside `images/projects/` named after your project's **slug**.

*   **Example:** `images/projects/my-new-project/`

Place all your project images inside this folder.

*   **Card Hero Image:** Ensure you have a `card-hero.jpg` in this folder. This image is used for the project card on the main gallery page.

### Step 4: Regenerate the Manifest

After adding your new JSON file, run the manifest script again to make the application aware of your new project.

```bash
npm run manifest
```

Your new project will now appear on the site.

## 🏗️ Architectural Concepts

*   **Data-Driven Design:** All content is loaded dynamically from JSON files, making the HTML templates clean and reusable.
*   **ProjectLoader Class:** A dedicated JavaScript class (`js/project-loader.js`) is responsible for fetching the `manifest.json` and loading all project data asynchronously.
*   **Modular CSS:** Styles are broken down into a logical BEM-like structure with base styles, components, and page-specific layouts. This prevents style conflicts and makes the CSS easy to maintain.
*   **Session Storage Navigation:** When you click on a project, its data is stored in `sessionStorage`, which is then read by the `ParallaxThemes.html` page to render the detail view. This is a simple and effective way to pass data between pages in a pure JS SPA.

## 📈 Future Enhancements

*   **Enhanced State Management:** For even more complex filtering, a more robust state management pattern could be introduced.
*   **Web Components:** For ultimate modularity, components could be refactored into native Web Components.
*   **Build System:** A build step (e.g., using Vite or Rollup) could be added to bundle assets and optimize for production.
*   **Testing:** While the project has been thoroughly manually tested, a suite of automated tests (e.g., using Jest or Playwright) would be a valuable addition. 