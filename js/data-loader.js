// js/data-loader.js
// Centralized loader for projects and documents for the library page
async function loadAllData() {
    try {
        const manifestResponse = await fetch('library-manifest.json');
        const docManifest = await manifestResponse.json();
        const allDocuments = [];
        // Each entry in docManifest should have: title, category, tags, date, description, path, project
        docManifest.forEach(doc => {
            allDocuments.push({
                ...doc,
                url: `document-reader.html?doc=${encodeURIComponent(doc.path)}`
            });
        });
        // For library, we only need allDocuments
        return { allProjects: [], allDocuments };
    } catch (error) {
        console.error('Failed to load and process library data:', error);
        return { allProjects: [], allDocuments: [] };
    }
}
