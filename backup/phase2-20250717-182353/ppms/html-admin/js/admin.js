/**
 * PPMS Dashboard - Portfolio Project Management System
 * Complete JavaScript implementation for the admin dashboard
 */

class PPMSDashboard {
    constructor() {
        this.data = {
            lookups: [],
            projects: [],
            config: [],
            audit_log: []
        };
        this.currentProject = null;
        this.currentTab = 'dashboard';
        this.nextId = 1;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.updateStats();
        this.showNotification('Dashboard loaded successfully', 'success');
    }

    async loadData() {
        try {
            const response = await fetch('data/portfolio-data.json');
            if (response.ok) {
                this.data = await response.json();
                this.calculateNextId();
            } else {
                // Load sample data if file doesn't exist
                this.loadSampleData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.loadSampleData();
        }
    }

    loadSampleData() {
        // Load sample data from the schema
        this.data = {
            version: "1.0.0",
            last_updated: new Date().toISOString(),
            lookups: [],
            projects: [],
            config: [],
            audit_log: []
        };
    }

    calculateNextId() {
        const allIds = [
            ...this.data.lookups.map(l => l.id),
            ...this.data.projects.map(p => p.id)
        ];
        this.nextId = Math.max(...allIds, 0) + 1;
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Dashboard actions
        document.getElementById('saveBtn').addEventListener('click', () => this.saveAllData());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());

        // Project management
        document.getElementById('addProjectBtn').addEventListener('click', () => this.addNewProject());
        document.getElementById('saveProjectBtn').addEventListener('click', () => this.saveProject());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.cancelEdit());

        // Lookup management
        document.getElementById('addLookupBtn').addEventListener('click', () => this.showAddLookupModal());
        document.getElementById('saveLookupBtn').addEventListener('click', () => this.saveLookup());
        document.getElementById('cancelLookupBtn').addEventListener('click', () => this.closeLookupModal());
        document.getElementById('closeLookupModal').addEventListener('click', () => this.closeLookupModal());

        // Export/Import
        document.getElementById('exportManifestBtn').addEventListener('click', () => this.exportManifest());
        document.getElementById('exportProjectsBtn').addEventListener('click', () => this.exportProjects());
        document.getElementById('exportLookupsBtn').addEventListener('click', () => this.exportLookups());
        document.getElementById('exportPortfolioBtn')?.addEventListener('click', () => this.exportToPortfolio());
        document.getElementById('importBtn').addEventListener('click', () => this.importData());
        document.getElementById('bulkImportBtn').addEventListener('click', () => this.triggerBulkImport());
        document.getElementById('bulkImportFiles').addEventListener('change', (e) => this.handleBulkImport(e));

        // Form field changes
        document.getElementById('projectMedium').addEventListener('change', (e) => {
            this.updateMediumContent(e.target.value);
        });

        // Modal backdrop click
        document.getElementById('addLookupModal').addEventListener('click', (e) => {
            if (e.target.id === 'addLookupModal') {
                this.closeLookupModal();
            }
        });

        // --- Enhanced Medium-Specific Content ---
        document.getElementById('closeGalleryModal').addEventListener('click', () => this.closeGalleryModal());
        document.getElementById('cancelGalleryBtn').addEventListener('click', () => this.closeGalleryModal());
        document.getElementById('saveGalleryBtn').addEventListener('click', () => this.saveGalleryModal());
        document.getElementById('closeArtifactModal').addEventListener('click', () => this.closeArtifactModal());
        document.getElementById('cancelArtifactBtn').addEventListener('click', () => this.closeArtifactModal());
        document.getElementById('saveArtifactBtn').addEventListener('click', () => this.saveArtifactModal());
        document.getElementById('closeJourneyModal').addEventListener('click', () => this.closeJourneyModal());
        document.getElementById('cancelJourneyBtn').addEventListener('click', () => this.closeJourneyModal());
        document.getElementById('saveJourneyBtn').addEventListener('click', () => this.saveJourneyModal());

        // --- Add Project Modal ---
        document.getElementById('closeAddProjectModal').addEventListener('click', () => this.closeAddProjectModal());
        document.getElementById('startFreshBtn').addEventListener('click', () => this.startFreshProject());
        document.getElementById('loadFromJsonBtn').addEventListener('click', () => this.triggerJsonFileSelect());
        document.getElementById('projectJsonFile').addEventListener('change', (e) => this.handleJsonFileSelect(e));
        document.getElementById('cancelJsonBtn').addEventListener('click', () => this.cancelJsonLoad());
        document.getElementById('confirmJsonBtn').addEventListener('click', () => this.confirmJsonLoad());

        // Modal backdrop click for add project modal
        document.getElementById('addProjectModal').addEventListener('click', (e) => {
            if (e.target.id === 'addProjectModal') {
                this.closeAddProjectModal();
            }
        });

        // --- Image Upload Functionality ---
        document.getElementById('uploadImageBtn').addEventListener('click', () => this.triggerImageUpload());
        document.getElementById('galleryImageFile').addEventListener('change', (e) => this.handleImageUpload(e));
        document.getElementById('closeImageUploadModal').addEventListener('click', () => this.closeImageUploadModal());
        document.getElementById('cancelImageUploadBtn').addEventListener('click', () => this.closeImageUploadModal());
        document.getElementById('confirmImageUploadBtn').addEventListener('click', () => this.confirmImageUpload());
        document.getElementById('selectImagesBtn').addEventListener('click', () => this.triggerBulkImageSelect());
        document.getElementById('bulkImageUpload').addEventListener('change', (e) => this.handleBulkImageSelect(e));

        // Drag and drop functionality
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Modal backdrop click for image upload modal
        document.getElementById('imageUploadModal').addEventListener('click', (e) => {
            if (e.target.id === 'imageUploadModal') {
                this.closeImageUploadModal();
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
        this.renderTabContent(tabName);
    }

    renderTabContent(tabName) {
        switch (tabName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'projects':
                this.renderProjects();
                break;
            case 'lookups':
                this.renderLookups();
                break;
            case 'files':
                this.renderFiles();
                break;
            case 'export':
                this.renderExport();
                break;
            case 'settings':
                this.renderSettings();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
        }
    }

    renderDashboard() {
        this.updateStats();
        this.updateRecentActivity();
        this.updateValidationIssues();
    }

    updateStats() {
        const stats = this.calculateStats();
        
        document.getElementById('totalProjects').textContent = stats.projects;
        document.getElementById('totalGenres').textContent = stats.genres;
        document.getElementById('totalStyles').textContent = stats.styles;
        document.getElementById('totalMediums').textContent = stats.mediums;
    }

    calculateStats() {
        const genres = this.data.lookups.filter(l => l.type === 'genre').length;
        const styles = this.data.lookups.filter(l => l.type === 'style').length;
        const mediums = new Set(this.data.projects.map(p => p.medium)).size;

        return {
            projects: this.data.projects.length,
            genres,
            styles,
            mediums
        };
    }

    updateRecentActivity() {
        const recentActivity = this.data.audit_log
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        const activityList = document.getElementById('recentActivity');
        activityList.innerHTML = '';

        recentActivity.forEach(activity => {
            const activityItem = this.createActivityItem(activity);
            activityList.appendChild(activityItem);
        });
    }

    createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'activity-item';

        const icon = document.createElement('i');
        icon.className = `fas ${this.getActivityIcon(activity.action)} activity-icon`;

        const content = document.createElement('div');
        content.className = 'activity-content';

        const text = document.createElement('div');
        text.className = 'activity-text';
        text.textContent = this.getActivityText(activity);

        const time = document.createElement('div');
        time.className = 'activity-time';
        time.textContent = this.formatTimeAgo(activity.timestamp);

        content.appendChild(text);
        content.appendChild(time);
        item.appendChild(icon);
        item.appendChild(content);

        return item;
    }

    getActivityIcon(action) {
        const icons = {
            'create': 'fa-plus',
            'update': 'fa-edit',
            'delete': 'fa-trash',
            'export': 'fa-download',
            'import': 'fa-upload',
            'validate': 'fa-check'
        };
        return icons[action] || 'fa-info-circle';
    }

    getActivityText(activity) {
        switch (activity.action) {
            case 'create':
                return `Created new ${activity.table_name}`;
            case 'update':
                return `Updated ${activity.table_name}`;
            case 'delete':
                return `Deleted ${activity.table_name}`;
            case 'export':
                return `Exported ${activity.table_name}`;
            case 'import':
                return `Imported ${activity.table_name}`;
            default:
                return activity.action;
        }
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    updateValidationIssues() {
        const issues = this.validateAllData();
        const issuesList = document.getElementById('validationIssues');
        issuesList.innerHTML = '';

        if (issues.errors.length > 0) {
            const errorItem = this.createValidationItem('error', `${issues.errors.length} projects missing required fields`);
            issuesList.appendChild(errorItem);
        }

        if (issues.warnings.length > 0) {
            const warningItem = this.createValidationItem('warning', `${issues.warnings.length} broken image links`);
            issuesList.appendChild(warningItem);
        }

        if (issues.info.length > 0) {
            const infoItem = this.createValidationItem('info', `${issues.info.length} outdated technology references`);
            issuesList.appendChild(infoItem);
        }
    }

    createValidationItem(type, text) {
        const item = document.createElement('div');
        item.className = `validation-item ${type}`;
        
        const icon = document.createElement('i');
        icon.className = `fas ${this.getValidationIcon(type)}`;
        
        const span = document.createElement('span');
        span.textContent = text;

        item.appendChild(icon);
        item.appendChild(span);
        return item;
    }

    getValidationIcon(type) {
        const icons = {
            'error': 'fa-times-circle',
            'warning': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    renderProjects() {
        this.renderProjectList();
        this.renderProjectEditor();
        this.populateLookupSelects();
    }

    renderProjectList() {
        const projectList = document.getElementById('projectList');
        projectList.innerHTML = '';

        this.data.projects.forEach(project => {
            const projectItem = this.createProjectItem(project);
            projectList.appendChild(projectItem);
        });
    }

    createProjectItem(project) {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.dataset.projectId = project.id;

        const title = document.createElement('h4');
        title.textContent = project.title;

        const medium = document.createElement('span');
        medium.className = 'project-medium';
        medium.textContent = project.medium;

        const status = document.createElement('span');
        status.className = `project-status ${project.status}`;
        status.textContent = project.status;

        const actions = document.createElement('div');
        actions.className = 'project-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-secondary';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editBtn.addEventListener('click', () => this.editProject(project.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-secondary';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteBtn.addEventListener('click', () => this.deleteProject(project.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(title);
        item.appendChild(medium);
        item.appendChild(status);
        item.appendChild(actions);

        return item;
    }

    renderProjectEditor() {
        const editor = document.getElementById('projectEditor');
        if (!this.currentProject) {
            editor.style.display = 'none';
            return;
        }

        editor.style.display = 'block';
        this.populateProjectForm();
    }

    populateProjectForm() {
        const project = this.currentProject;
        if (!project) return;

        document.getElementById('editorTitle').textContent = `Project: ${project.title}`;
        document.getElementById('projectTitle').value = project.title || '';
        document.getElementById('projectDescription').value = project.description || '';
        document.getElementById('projectMedium').value = project.medium || '';
        document.getElementById('projectYear').value = project.year || '';
        document.getElementById('projectRole').value = project.role || '';
        document.getElementById('projectMood').value = project.mood || '';
        document.getElementById('projectStatus').value = project.status || 'completed';
        document.getElementById('projectPitch').value = project.pitch || '';
        document.getElementById('projectChallenge').value = project.challenge || '';
        document.getElementById('projectDevelopment').value = project.development || '';
        document.getElementById('projectOutcome').value = project.outcome || '';

        this.updateMediumContent(project.medium);
        this.populateTagSelectors(project);
    }

    populateLookupSelects() {
        this.populateSelect('projectRole', 'role');
        this.populateSelect('projectMood', 'mood');
    }

    populateSelect(selectId, type) {
        const select = document.getElementById(selectId);
        const options = this.data.lookups.filter(l => l.type === type);
        
        select.innerHTML = '<option value="">Select...</option>';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.value;
            select.appendChild(opt);
        });
    }

    populateTagSelectors(project) {
        this.populateTagSelector('genreSelector', 'genre', project.genres || []);
        this.populateTagSelector('styleSelector', 'style', project.styles || []);
        this.populateTagSelector('techSelector', 'technology', project.technologies || []);
        
        // Add clear all buttons if there are selected tags
        this.addClearAllButtons(project);
    }

    addClearAllButtons(project) {
        const selectors = [
            { id: 'genreSelector', type: 'genres', label: 'Genres' },
            { id: 'styleSelector', type: 'styles', label: 'Styles' },
            { id: 'techSelector', type: 'technologies', label: 'Technologies' }
        ];

        selectors.forEach(selector => {
            const container = document.getElementById(selector.id).parentElement;
            const existingButton = container.querySelector('.clear-all-btn');
            if (existingButton) {
                existingButton.remove();
            }

            const selectedCount = project[selector.type] ? project[selector.type].length : 0;
            if (selectedCount > 0) {
                const clearButton = document.createElement('button');
                clearButton.type = 'button';
                clearButton.className = 'btn btn-sm btn-secondary clear-all-btn';
                clearButton.style.marginTop = '8px';
                clearButton.innerHTML = `<i class="fas fa-times"></i> Clear All ${selector.label}`;
                clearButton.onclick = () => this.clearAllTags(selector.id, selector.type);
                container.appendChild(clearButton);
            }
        });
    }

    clearAllTags(selectorId, type) {
        if (confirm(`Are you sure you want to remove all ${type}?`)) {
            const tags = document.querySelectorAll(`#${selectorId} .tag.selected`);
            tags.forEach(tag => {
                const tagId = parseInt(tag.dataset.id);
                this.toggleTag(selectorId, tagId);
            });
            
            // Update the current project
            if (this.currentProject) {
                this.currentProject[type] = [];
                this.addClearAllButtons(this.currentProject);
            }
            
            this.showNotification(`Cleared all ${type}`, 'success');
        }
    }

    populateTagSelector(selectorId, type, selectedIds) {
        const selector = document.getElementById(selectorId);
        selector.innerHTML = '';

        const options = this.data.lookups.filter(l => l.type === type);
        options.forEach(option => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.dataset.id = option.id;
            tag.dataset.selected = selectedIds.includes(option.id);

            if (selectedIds.includes(option.id)) {
                tag.classList.add('selected');
            }

            tag.innerHTML = `
                ${option.value}
                <span class="remove-tag" onclick="dashboard.toggleTag('${selectorId}', ${option.id})" title="Click to ${selectedIds.includes(option.id) ? 'remove' : 'add'} this ${type}">×</span>
            `;
            
            // Add click handler to the entire tag
            tag.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-tag')) {
                    e.stopPropagation();
                } else {
                    this.toggleTag(selectorId, option.id);
                }
            });
            
            selector.appendChild(tag);
        });
    }

    toggleTag(selectorId, tagId) {
        const tag = document.querySelector(`#${selectorId} [data-id="${tagId}"]`);
        const wasSelected = tag.classList.contains('selected');
        
        if (wasSelected) {
            tag.classList.remove('selected');
            tag.dataset.selected = 'false';
            this.showNotification(`Removed ${tag.textContent.trim().replace('×', '')}`, 'info');
        } else {
            tag.classList.add('selected');
            tag.dataset.selected = 'true';
            this.showNotification(`Added ${tag.textContent.trim().replace('×', '')}`, 'success');
        }
        
        // Update the tooltip
        const removeTag = tag.querySelector('.remove-tag');
        const type = selectorId.replace('Selector', '');
        removeTag.title = `Click to ${tag.classList.contains('selected') ? 'remove' : 'add'} this ${type}`;
    }

    updateMediumContent(medium) {
        const content = document.getElementById('mediumContent');
        content.innerHTML = '';

        switch (medium) {
            case 'code':
                content.innerHTML = this.getCodeContent();
                break;
            case 'art':
                content.innerHTML = this.getArtContent();
                break;
            case 'writing':
                content.innerHTML = this.getWritingContent();
                break;
            default:
                content.innerHTML = '<p>Select a medium to see specific content options.</p>';
        }
    }

    // --- Enhanced Medium-Specific Content ---
    getArtContent() {
        const gallery = (this.currentProject && this.currentProject.gallery) || [];
        let html = `
            <div class="form-group">
                <label>Gallery</label>
                <div class="gallery-list">
        `;
        gallery.forEach((img, idx) => {
            html += `
                <div class="gallery-item" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <img src="${img.url}" alt="${img.title}" class="gallery-thumb" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
                    <div style="flex:1;">
                        <strong>${img.title}</strong><br>
                        <small>${img.description || ''}</small>
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="dashboard.openGalleryModal(${idx})">Edit</button>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="dashboard.deleteGalleryImage(${idx})">Delete</button>
                </div>
            `;
        });
        html += `
                </div>
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <button type="button" class="btn btn-sm btn-primary" onclick="dashboard.openGalleryModal()">
                        <i class="fas fa-plus"></i> Add Image
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="dashboard.openImageUploadModal()">
                        <i class="fas fa-upload"></i> Bulk Upload
                    </button>
                </div>
            </div>
        `;
        return html;
    }
    openGalleryModal(idx = null) {
        this.editingGalleryIndex = idx;
        const modal = document.getElementById('galleryModal');
        const form = document.getElementById('galleryForm');
        const gallery = this.currentProject.gallery || [];
        let data = { url: '', title: '', description: '', dimensions: '' };
        if (idx !== null && gallery[idx]) data = gallery[idx];
        form.galleryImageUrl.value = data.url || '';
        form.galleryImageTitle.value = data.title || '';
        form.galleryImageDescription.value = data.description || '';
        form.galleryImageDimensions.value = data.dimensions || '';
        document.getElementById('galleryModalTitle').textContent = idx === null ? 'Add Gallery Image' : 'Edit Gallery Image';
        modal.classList.add('active');
    }
    closeGalleryModal() {
        document.getElementById('galleryModal').classList.remove('active');
    }
    saveGalleryModal() {
        const form = document.getElementById('galleryForm');
        const gallery = this.currentProject.gallery || [];
        const data = {
            url: form.galleryImageUrl.value,
            title: form.galleryImageTitle.value,
            description: form.galleryImageDescription.value,
            dimensions: form.galleryImageDimensions.value
        };
        if (this.editingGalleryIndex !== null && gallery[this.editingGalleryIndex]) {
            gallery[this.editingGalleryIndex] = { ...gallery[this.editingGalleryIndex], ...data };
        } else {
            gallery.push({ ...data, id: Date.now() });
        }
        this.currentProject.gallery = gallery;
        this.updateMediumContent('art');
        this.closeGalleryModal();
    }
    deleteGalleryImage(idx) {
        if (confirm('Delete this image?')) {
            this.currentProject.gallery.splice(idx, 1);
            this.updateMediumContent('art');
        }
    }

    getCodeContent() {
        const artifacts = (this.currentProject && this.currentProject.artifacts) || [];
        let html = `
            <div class="form-group">
                <label>Artifacts</label>
                <div class="artifact-list">
        `;
        artifacts.forEach((art, idx) => {
            html += `
                <div class="artifact-item" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <div style="flex:1;">
                        <strong>${art.name}</strong><br>
                        <small>${art.description || ''}</small>
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="dashboard.openArtifactModal(${idx})">Edit</button>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="dashboard.deleteArtifact(${idx})">Delete</button>
                </div>
            `;
        });
        html += `
                </div>
                <button type="button" class="btn btn-sm btn-primary" onclick="dashboard.openArtifactModal()">+ Add Artifact</button>
            </div>
        `;
        return html;
    }
    openArtifactModal(idx = null) {
        this.editingArtifactIndex = idx;
        const modal = document.getElementById('artifactModal');
        const form = document.getElementById('artifactForm');
        const artifacts = this.currentProject.artifacts || [];
        let data = { name: '', description: '', url: '', type: '' };
        if (idx !== null && artifacts[idx]) data = artifacts[idx];
        form.artifactName.value = data.name || '';
        form.artifactDescription.value = data.description || '';
        form.artifactUrl.value = data.url || '';
        form.artifactType.value = data.type || '';
        document.getElementById('artifactModalTitle').textContent = idx === null ? 'Add Artifact' : 'Edit Artifact';
        modal.classList.add('active');
    }
    closeArtifactModal() {
        document.getElementById('artifactModal').classList.remove('active');
    }
    saveArtifactModal() {
        const form = document.getElementById('artifactForm');
        const artifacts = this.currentProject.artifacts || [];
        const data = {
            name: form.artifactName.value,
            description: form.artifactDescription.value,
            url: form.artifactUrl.value,
            type: form.artifactType.value
        };
        if (this.editingArtifactIndex !== null && artifacts[this.editingArtifactIndex]) {
            artifacts[this.editingArtifactIndex] = { ...artifacts[this.editingArtifactIndex], ...data };
        } else {
            artifacts.push({ ...data, id: Date.now() });
        }
        this.currentProject.artifacts = artifacts;
        this.updateMediumContent('code');
        this.closeArtifactModal();
    }
    deleteArtifact(idx) {
        if (confirm('Delete this artifact?')) {
            this.currentProject.artifacts.splice(idx, 1);
            this.updateMediumContent('code');
        }
    }

    getWritingContent() {
        const journey = (this.currentProject && this.currentProject.journey) || [];
        let html = `
            <div class="form-group">
                <label>Journey</label>
                <div class="journey-list">
        `;
        journey.forEach((phase, idx) => {
            html += `
                <div class="journey-item" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <div style="flex:1;">
                        <strong>${phase.title}</strong><br>
                        <small>${phase.description || ''}</small>
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="dashboard.openJourneyModal(${idx})">Edit</button>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="dashboard.deleteJourney(${idx})">Delete</button>
                </div>
            `;
        });
        html += `
                </div>
                <button type="button" class="btn btn-sm btn-primary" onclick="dashboard.openJourneyModal()">+ Add Phase</button>
            </div>
        `;
        return html;
    }
    openJourneyModal(idx = null) {
        this.editingJourneyIndex = idx;
        const modal = document.getElementById('journeyModal');
        const form = document.getElementById('journeyForm');
        const journey = this.currentProject.journey || [];
        let data = { title: '', description: '' };
        if (idx !== null && journey[idx]) data = journey[idx];
        form.journeyTitle.value = data.title || '';
        form.journeyDescription.value = data.description || '';
        document.getElementById('journeyModalTitle').textContent = idx === null ? 'Add Journey Phase' : 'Edit Journey Phase';
        modal.classList.add('active');
    }
    closeJourneyModal() {
        document.getElementById('journeyModal').classList.remove('active');
    }
    saveJourneyModal() {
        const form = document.getElementById('journeyForm');
        const journey = this.currentProject.journey || [];
        const data = {
            title: form.journeyTitle.value,
            description: form.journeyDescription.value
        };
        if (this.editingJourneyIndex !== null && journey[this.editingJourneyIndex]) {
            journey[this.editingJourneyIndex] = { ...journey[this.editingJourneyIndex], ...data };
        } else {
            journey.push({ ...data, id: Date.now() });
        }
        this.currentProject.journey = journey;
        this.updateMediumContent('writing');
        this.closeJourneyModal();
    }
    deleteJourney(idx) {
        if (confirm('Delete this phase?')) {
            this.currentProject.journey.splice(idx, 1);
            this.updateMediumContent('writing');
        }
    }

    // --- Image Upload Methods ---
    triggerImageUpload() {
        document.getElementById('galleryImageFile').click();
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }

        // Create a preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            document.getElementById('galleryImageUrl').value = imageUrl;
            document.getElementById('previewImage').src = imageUrl;
            document.getElementById('imagePreview').style.display = 'block';
            
            // Auto-fill title from filename
            const title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            document.getElementById('galleryImageTitle').value = title;
        };
        reader.readAsDataURL(file);
    }

    openImageUploadModal() {
        this.uploadedImages = [];
        document.getElementById('imageUploadModal').classList.add('active');
        this.resetImageUploadModal();
    }

    closeImageUploadModal() {
        document.getElementById('imageUploadModal').classList.remove('active');
        this.resetImageUploadModal();
    }

    resetImageUploadModal() {
        document.getElementById('uploadedImages').innerHTML = '';
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('confirmImageUploadBtn').disabled = true;
        document.getElementById('bulkImageUpload').value = '';
        this.uploadedImages = [];
    }

    triggerBulkImageSelect() {
        document.getElementById('bulkImageUpload').click();
    }

    handleBulkImageSelect(event) {
        const files = Array.from(event.target.files);
        this.processImageFiles(files);
    }

    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
        
        const files = Array.from(event.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showNotification('Please drop image files only', 'error');
            return;
        }
        
        this.processImageFiles(imageFiles);
    }

    processImageFiles(files) {
        const uploadedImagesContainer = document.getElementById('uploadedImages');
        
        files.forEach((file, index) => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    file: file,
                    url: e.target.result,
                    name: file.name,
                    size: this.formatFileSize(file.size)
                };

                this.uploadedImages.push(imageData);
                this.displayUploadedImage(imageData, this.uploadedImages.length - 1);
                
                // Enable confirm button if we have images
                if (this.uploadedImages.length > 0) {
                    document.getElementById('confirmImageUploadBtn').disabled = false;
                }
            };
            reader.readAsDataURL(file);
        });
    }

    displayUploadedImage(imageData, index) {
        const uploadedImagesContainer = document.getElementById('uploadedImages');
        
        const imageElement = document.createElement('div');
        imageElement.className = 'uploaded-image-item';
        imageElement.innerHTML = `
            <img src="${imageData.url}" alt="${imageData.name}">
            <div class="image-info">
                <div class="image-name">${imageData.name}</div>
                <div class="image-size">${imageData.size}</div>
            </div>
            <button class="remove-image" onclick="dashboard.removeUploadedImage(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        uploadedImagesContainer.appendChild(imageElement);
    }

    removeUploadedImage(index) {
        this.uploadedImages.splice(index, 1);
        this.refreshUploadedImagesDisplay();
        
        if (this.uploadedImages.length === 0) {
            document.getElementById('confirmImageUploadBtn').disabled = true;
        }
    }

    refreshUploadedImagesDisplay() {
        const uploadedImagesContainer = document.getElementById('uploadedImages');
        uploadedImagesContainer.innerHTML = '';
        
        this.uploadedImages.forEach((imageData, index) => {
            this.displayUploadedImage(imageData, index);
        });
    }

    confirmImageUpload() {
        if (!this.currentProject || this.uploadedImages.length === 0) return;

        const gallery = this.currentProject.gallery || [];
        
        this.uploadedImages.forEach(imageData => {
            const galleryItem = {
                url: imageData.url,
                title: imageData.name.replace(/\.[^/.]+$/, ""), // Remove extension
                description: `Uploaded image: ${imageData.name}`,
                dimensions: 'Auto-detected',
                id: Date.now() + Math.random()
            };
            
            gallery.push(galleryItem);
        });

        this.currentProject.gallery = gallery;
        this.updateMediumContent('art');
        this.closeImageUploadModal();
        this.showNotification(`Added ${this.uploadedImages.length} images to gallery`, 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    renderLookups() {
        this.renderLookupSection('genre', 'genreList', 'genreCount');
        this.renderLookupSection('technology', 'techList', 'techCount');
        this.renderLookupSection('style', 'styleList', 'styleCount');
    }

    renderLookupSection(type, listId, countId) {
        const list = document.getElementById(listId);
        const count = document.getElementById(countId);
        const items = this.data.lookups.filter(l => l.type === type);

        count.textContent = items.length;
        list.innerHTML = '';

        items.forEach(item => {
            const listItem = this.createLookupItem(item);
            list.appendChild(listItem);
        });
    }

    createLookupItem(lookup) {
        const item = document.createElement('div');
        item.className = 'lookup-item';

        const info = document.createElement('div');
        info.className = 'lookup-info';

        const name = document.createElement('div');
        name.className = 'lookup-name';
        name.textContent = lookup.value;

        const count = document.createElement('div');
        count.className = 'lookup-count';
        count.textContent = `${lookup.usage_count} projects`;

        info.appendChild(name);
        info.appendChild(count);

        const actions = document.createElement('div');
        actions.className = 'lookup-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-secondary';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => this.editLookup(lookup.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-secondary';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => this.deleteLookup(lookup.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(info);
        item.appendChild(actions);

        return item;
    }

    renderFiles() {
        const container = document.getElementById('filesContainer');
        container.innerHTML = '<p>File management interface coming soon...</p>';
    }

    renderExport() {
        // Export tab is already rendered in HTML
    }

    renderSettings() {
        const container = document.getElementById('settingsContainer');
        container.innerHTML = '<p>Settings interface coming soon...</p>';
    }

    renderAnalytics() {
        const container = document.getElementById('analyticsContainer');
        container.innerHTML = '<p>Analytics interface coming soon...</p>';
    }

    // Project Management Methods
    addNewProject() {
        // Show the add project modal instead of directly creating a project
        this.showAddProjectModal();
    }

    showAddProjectModal() {
        document.getElementById('addProjectModal').classList.add('active');
        // Reset the modal state
        document.getElementById('jsonPreview').style.display = 'none';
        document.getElementById('add-project-options').style.display = 'grid';
    }

    closeAddProjectModal() {
        document.getElementById('addProjectModal').classList.remove('active');
        // Reset file input
        document.getElementById('projectJsonFile').value = '';
    }

    startFreshProject() {
        this.currentProject = {
            id: this.nextId++,
            title: '',
            description: '',
            medium: 'code',
            year: new Date().getFullYear(),
            status: 'development',
            genres: [],
            styles: [],
            technologies: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        this.closeAddProjectModal();
        this.renderProjectEditor();
        this.showNotification('New project created', 'success');
    }

    triggerJsonFileSelect() {
        document.getElementById('projectJsonFile').click();
    }

    async handleJsonFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);
            
            // Validate that this looks like a project
            if (this.validateProjectJson(jsonData)) {
                // Convert string arrays to IDs if needed
                const convertedData = this.convertStringArraysToIds(jsonData);
                this.previewJsonData(convertedData);
            } else {
                this.showNotification('Invalid project JSON format', 'error');
                event.target.value = '';
            }
        } catch (error) {
            this.showNotification('Error reading JSON file: ' + error.message, 'error');
            event.target.value = '';
        }
    }

    validateProjectJson(data) {
        // Basic validation to ensure this looks like a project
        const requiredFields = ['title', 'description', 'medium'];
        return requiredFields.every(field => data.hasOwnProperty(field));
    }

    convertStringArraysToIds(data) {
        const converted = { ...data };
        
        // Handle different field names and convert string arrays to ID arrays
        const fieldMappings = {
            'genre': 'genres',
            'style': 'styles', 
            'tech': 'technologies'
        };

        for (const [oldField, newField] of Object.entries(fieldMappings)) {
            if (data[oldField] && Array.isArray(data[oldField])) {
                // Convert string array to ID array
                converted[newField] = this.convertStringArrayToIds(data[oldField], oldField);
                delete converted[oldField]; // Remove old field
            }
        }

        return converted;
    }

    convertStringArrayToIds(stringArray, type) {
        const ids = [];
        
        for (const stringValue of stringArray) {
            // Try to find existing lookup
            let lookup = this.data.lookups.find(l => 
                l.type === type && l.value.toLowerCase() === stringValue.toLowerCase()
            );
            
            if (!lookup) {
                // Create new lookup if it doesn't exist
                lookup = {
                    id: this.nextId++,
                    type: type,
                    value: stringValue,
                    description: `Imported from project data`,
                    category: 'universal',
                    usage_count: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                this.data.lookups.push(lookup);
            }
            
            ids.push(lookup.id);
        }
        
        return ids;
    }

    previewJsonData(data) {
        // Hide the options and show the preview
        document.getElementById('add-project-options').style.display = 'none';
        document.getElementById('jsonPreview').style.display = 'block';
        
        // Display the JSON preview
        const previewContent = document.getElementById('previewContent');
        previewContent.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        
        // Store the data for later use
        this.pendingJsonData = data;
    }

    cancelJsonLoad() {
        // Reset the modal to show options again
        document.getElementById('jsonPreview').style.display = 'none';
        document.getElementById('add-project-options').style.display = 'grid';
        document.getElementById('projectJsonFile').value = '';
        this.pendingJsonData = null;
    }

    confirmJsonLoad() {
        if (!this.pendingJsonData) return;

        // Create a new project from the JSON data
        this.currentProject = {
            ...this.pendingJsonData,
            id: this.nextId++,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Ensure arrays exist
        this.currentProject.genres = this.currentProject.genres || [];
        this.currentProject.styles = this.currentProject.styles || [];
        this.currentProject.technologies = this.currentProject.technologies || [];

        // Log activity for the new lookups that were created
        this.logActivity('import', 'projects', this.currentProject.id, null, this.currentProject);

        this.closeAddProjectModal();
        this.renderProjectEditor();
        this.renderLookups(); // Refresh lookups to show newly created ones
        this.showNotification('Project loaded from JSON successfully', 'success');
        
        // Clear the pending data
        this.pendingJsonData = null;
    }

    editProject(projectId) {
        this.currentProject = this.data.projects.find(p => p.id === projectId);
        if (this.currentProject) {
            this.renderProjectEditor();
            this.showNotification(`Editing project: ${this.currentProject.title}`, 'info');
        }
    }

    async saveProject() {
        if (!this.currentProject) return;

        const formData = this.getProjectFormData();
        const validation = this.validateProject(formData);

        if (!validation.isValid) {
            this.showNotification(validation.errors.join(', '), 'error');
            return;
        }

        // Update project data
        Object.assign(this.currentProject, formData);
        this.currentProject.updated_at = new Date().toISOString();

        // Add to projects array if new
        if (!this.data.projects.find(p => p.id === this.currentProject.id)) {
            this.data.projects.push(this.currentProject);
        }

        // Log activity
        this.logActivity('update', 'projects', this.currentProject.id);

        this.renderProjectList();
        this.showNotification('Project saved successfully', 'success');
        this.currentProject = null;
        this.renderProjectEditor();
    }

    getProjectFormData() {
        return {
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            medium: document.getElementById('projectMedium').value,
            year: parseInt(document.getElementById('projectYear').value),
            role: document.getElementById('projectRole').value,
            mood: document.getElementById('projectMood').value,
            status: document.getElementById('projectStatus').value,
            pitch: document.getElementById('projectPitch').value,
            challenge: document.getElementById('projectChallenge').value,
            development: document.getElementById('projectDevelopment').value,
            outcome: document.getElementById('projectOutcome').value,
            genres: this.getSelectedTagIds('genreSelector'),
            styles: this.getSelectedTagIds('styleSelector'),
            technologies: this.getSelectedTagIds('techSelector')
        };
    }

    getSelectedTagIds(selectorId) {
        const selector = document.getElementById(selectorId);
        const selectedTags = selector.querySelectorAll('.tag[data-selected="true"]');
        return Array.from(selectedTags).map(tag => parseInt(tag.dataset.id));
    }

    validateProject(data) {
        const errors = [];

        if (!data.title) errors.push('Title is required');
        if (!data.description) errors.push('Description is required');
        if (!data.medium) errors.push('Medium is required');
        if (!data.year) errors.push('Year is required');
        if (!data.role) errors.push('Role is required');
        if (!data.mood) errors.push('Mood is required');
        if (!data.pitch) errors.push('Pitch is required');
        if (!data.challenge) errors.push('Challenge is required');
        if (!data.development) errors.push('Development is required');
        if (!data.outcome) errors.push('Outcome is required');
        if (!data.genres.length) errors.push('At least one genre is required');
        if (!data.styles.length) errors.push('At least one style is required');

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    cancelEdit() {
        this.currentProject = null;
        this.renderProjectEditor();
        this.showNotification('Edit cancelled', 'info');
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.data.projects = this.data.projects.filter(p => p.id !== projectId);
            this.logActivity('delete', 'projects', projectId);
            this.renderProjectList();
            this.showNotification('Project deleted', 'success');
        }
    }

    // Lookup Management Methods
    showAddLookupModal() {
        document.getElementById('addLookupModal').classList.add('active');
    }

    closeLookupModal() {
        document.getElementById('addLookupModal').classList.remove('active');
        document.getElementById('lookupForm').reset();
    }

    async saveLookup() {
        const formData = this.getLookupFormData();
        
        if (!formData.type || !formData.value) {
            this.showNotification('Type and value are required', 'error');
            return;
        }

        const newLookup = {
            id: this.nextId++,
            ...formData,
            usage_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        this.data.lookups.push(newLookup);
        this.logActivity('create', 'lookups', newLookup.id);

        this.closeLookupModal();
        this.renderLookups();
        this.populateLookupSelects();
        this.showNotification('Lookup added successfully', 'success');
    }

    getLookupFormData() {
        return {
            type: document.getElementById('lookupType').value,
            value: document.getElementById('lookupValue').value,
            description: document.getElementById('lookupDescription').value,
            category: document.getElementById('lookupCategory').value
        };
    }

    editLookup(lookupId) {
        const lookup = this.data.lookups.find(l => l.id === lookupId);
        if (lookup) {
            this.showNotification(`Editing lookup: ${lookup.value}`, 'info');
        }
    }

    deleteLookup(lookupId) {
        const lookup = this.data.lookups.find(l => l.id === lookupId);
        if (lookup && confirm(`Are you sure you want to delete "${lookup.value}"?`)) {
            this.data.lookups = this.data.lookups.filter(l => l.id !== lookupId);
            this.logActivity('delete', 'lookups', lookupId);
            this.renderLookups();
            this.showNotification('Lookup deleted', 'success');
        }
    }

    // Export/Import Methods
    exportManifest() {
        const manifest = {
            version: this.data.version,
            last_updated: new Date().toISOString(),
            total_projects: this.data.projects.length,
            projects: this.data.projects.map(p => ({
                id: p.id,
                title: p.title,
                medium: p.medium,
                status: p.status,
                last_modified: p.updated_at
            }))
        };

        this.downloadJSON(manifest, 'portfolio-manifest.json');
        this.showNotification('Manifest exported successfully', 'success');
    }

    exportProjects() {
        this.downloadJSON(this.data.projects, 'portfolio-projects.json');
        this.showNotification('Projects exported successfully', 'success');
    }

    exportLookups() {
        this.downloadJSON(this.data.lookups, 'portfolio-lookups.json');
        this.showNotification('Lookups exported successfully', 'success');
    }

    exportData() {
        const exportData = {
            ...this.data,
            last_updated: new Date().toISOString()
        };
        this.downloadJSON(exportData, 'portfolio-data.json');
        this.showNotification('All data exported successfully', 'success');
    }

    // New method for exporting to portfolio format
    exportToPortfolio() {
        try {
            // Convert projects to portfolio format
            const portfolioProjects = this.convertToPortfolioFormat(this.data.projects);
            
            // Create manifest for portfolio
            const manifest = this.createPortfolioManifest(portfolioProjects);
            
            // Export individual project files
            portfolioProjects.forEach(project => {
                const filename = `${project.id}-${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
                this.downloadJSON(project, filename);
            });
            
            // Export manifest
            this.downloadJSON(manifest, 'manifest.json');
            
            this.showNotification(`Exported ${portfolioProjects.length} projects in portfolio format`, 'success');
            
        } catch (error) {
            console.error('Error exporting to portfolio format:', error);
            this.showNotification('Error exporting to portfolio format', 'error');
        }
    }

    // Convert PPMS format to portfolio format
    convertToPortfolioFormat(projects) {
        return projects.map(project => {
            // Convert lookup IDs to string arrays
            const genres = this.getLookupsAsStrings(project.genres || [], 'genre');
            const styles = this.getLookupsAsStrings(project.styles || [], 'style');
            const technologies = this.getLookupsAsStrings(project.technologies || [], 'technology');
            
            // Convert mood from string to lookup if needed
            let mood = project.mood;
            if (typeof mood === 'number') {
                const moodLookup = this.data.lookups.find(l => l.id === mood && l.type === 'mood');
                mood = moodLookup ? moodLookup.value : mood;
            }
            
            // Convert role from string to lookup if needed
            let role = project.role;
            if (typeof role === 'number') {
                const roleLookup = this.data.lookups.find(l => l.id === role && l.type === 'role');
                role = roleLookup ? roleLookup.value : role;
            }
            
            // Convert status from string to lookup if needed
            let status = project.status;
            if (typeof status === 'number') {
                const statusLookup = this.data.lookups.find(l => l.id === status && l.type === 'status');
                status = statusLookup ? statusLookup.value : status;
            }
            
            // Convert variant from string to lookup if needed
            let variant = project.variant || 'standard';
            if (typeof variant === 'number') {
                const variantLookup = this.data.lookups.find(l => l.id === variant && l.type === 'variant');
                variant = variantLookup ? variantLookup.value : variant;
            }
            
            // Convert links from PPMS format to portfolio format
            let links = {};
            if (Array.isArray(project.links)) {
                project.links.forEach(link => {
                    const linkTypeLookup = this.data.lookups.find(l => l.id === link.type && l.type === 'link_type');
                    const linkType = linkTypeLookup ? linkTypeLookup.value : 'link';
                    links[linkType] = link.url;
                });
            } else if (typeof project.links === 'object') {
                links = project.links;
            }
            
            // Convert to portfolio format
            return {
                id: project.id,
                title: project.title,
                description: project.description,
                imageUrl: project.image_url,
                medium: project.medium,
                genre: genres,
                style: styles,
                tech: technologies,
                mood: mood,
                year: project.year,
                role: role,
                variant: variant,
                status: status,
                links: links,
                pitch: project.pitch,
                challenge: project.challenge,
                development: project.development,
                outcome: project.outcome,
                gallery: project.gallery || [],
                journey: project.journey || []
            };
        });
    }

    // Helper to convert lookup IDs to string arrays
    getLookupsAsStrings(lookupIds, type) {
        if (!Array.isArray(lookupIds)) return [];
        
        return lookupIds.map(id => {
            const lookup = this.data.lookups.find(l => l.id === id && l.type === type);
            return lookup ? lookup.value : `Unknown ${type} (${id})`;
        });
    }

    // Create portfolio manifest
    createPortfolioManifest(projects) {
        return {
            version: "1.0",
            lastUpdated: new Date().toISOString().split('T')[0],
            projects: projects.map(project => ({
                id: project.id,
                file: `${project.id}-${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`,
                title: project.title,
                medium: project.medium
            }))
        };
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importData() {
        document.getElementById('importFile').click();
        document.getElementById('importFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        this.mergeImportedData(importedData);
                        this.showNotification('Data imported successfully', 'success');
                    } catch (error) {
                        this.showNotification('Invalid JSON file', 'error');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    mergeImportedData(importedData) {
        if (importedData.projects) {
            this.data.projects = [...this.data.projects, ...importedData.projects];
        }
        if (importedData.lookups) {
            this.data.lookups = [...this.data.lookups, ...importedData.lookups];
        }
        this.calculateNextId();
        this.renderTabContent(this.currentTab);
    }

    triggerBulkImport() {
        document.getElementById('bulkImportFiles').click();
    }

    async handleBulkImport(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        this.showNotification(`Starting bulk import of ${files.length} files...`, 'info');

        for (const file of files) {
            try {
                const text = await file.text();
                const jsonData = JSON.parse(text);
                
                if (this.validateProjectJson(jsonData)) {
                    // Convert string arrays to IDs
                    const convertedData = this.convertStringArraysToIds(jsonData);
                    
                    // Create new project
                    const newProject = {
                        ...convertedData,
                        id: this.nextId++,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    // Ensure arrays exist
                    newProject.genres = newProject.genres || [];
                    newProject.styles = newProject.styles || [];
                    newProject.technologies = newProject.technologies || [];

                    this.data.projects.push(newProject);
                    successCount++;
                } else {
                    errorCount++;
                    errors.push(`${file.name}: Invalid project format`);
                }
            } catch (error) {
                errorCount++;
                errors.push(`${file.name}: ${error.message}`);
            }
        }

        // Reset file input
        event.target.value = '';

        // Show results
        if (successCount > 0) {
            this.renderProjects();
            this.renderLookups();
            this.showNotification(`Successfully imported ${successCount} projects`, 'success');
        }
        
        if (errorCount > 0) {
            this.showNotification(`Failed to import ${errorCount} files. Check console for details.`, 'error');
            console.error('Bulk import errors:', errors);
        }
    }

    // Utility Methods
    validateAllData() {
        const errors = [];
        const warnings = [];
        const info = [];

        this.data.projects.forEach(project => {
            const validation = this.validateProject(project);
            if (!validation.isValid) {
                errors.push(`Project "${project.title}": ${validation.errors.join(', ')}`);
            }
        });

        return { errors, warnings, info };
    }

    logActivity(action, tableName, recordId, oldValues = null, newValues = null) {
        const logEntry = {
            id: this.nextId++,
            user_id: 'admin',
            action,
            table_name: tableName,
            record_id: recordId,
            old_values: oldValues,
            new_values: newValues,
            timestamp: new Date().toISOString()
        };

        this.data.audit_log.push(logEntry);
    }

    async saveAllData() {
        try {
            // In a real application, this would save to a server
            // For now, we'll just update the last_updated timestamp
            this.data.last_updated = new Date().toISOString();
            this.showNotification('All data saved successfully', 'success');
        } catch (error) {
            this.showNotification('Error saving data', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        notifications.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize the dashboard when the page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new PPMSDashboard();
}); 