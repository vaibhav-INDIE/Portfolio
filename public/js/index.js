/**
 * Portfolio Website - Index Page 
 * Handles featured projects and updates on the home page
 */

// Function to fetch featured projects
async function fetchFeaturedProjects() {
    try {
        console.log('Fetching projects from server...');
        const response = await fetch('/api/projects');
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Projects fetched successfully:', data);

        // Handle both array and object with projects property
        const projectsArray = Array.isArray(data) ? data : (data.projects || []);
        console.log('Extracted projects array:', projectsArray);
        return projectsArray;
    } catch (error) {
        console.error('Error fetching featured projects:', error);
        return [];
    }
}

// Function to fetch recent updates
async function fetchRecentUpdates() {
    try {
        console.log('Fetching updates from server...');
        const response = await fetch('/api/updates');
        if (!response.ok) {
            throw new Error(`Failed to fetch updates: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Updates fetched successfully:', data);
        
        // Handle both array and object with updates property
        const updatesArray = Array.isArray(data) ? data : (data.updates || []);
        console.log('Extracted updates array:', updatesArray);
        return updatesArray;
    } catch (error) {
        console.error('Error fetching updates:', error);
        return [];
    }
}

// Function to format date
function formatDate(dateString) {
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString || 'Unknown date';
    }
}

// Function to render a project card
function renderProjectCard(project) {
    console.log('Rendering project card:', project);
    const card = document.createElement('div');
    card.className = 'project-card slide-up';
    
    // Add featured badge if applicable
    if (project.featured) {
        const badge = document.createElement('div');
        badge.className = 'project-badge';
        badge.textContent = 'Featured';
        card.appendChild(badge);
    }

    // Project image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-image shine-effect';
    
    if (project.image) {
        console.log('Project has image:', project.image);
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;
        img.onerror = function() {
            console.log('Image failed to load, replacing with placeholder');
            this.parentNode.innerHTML = '<div class="placeholder-icon"><i class="fas fa-code"></i></div>';
        };
        imageContainer.appendChild(img);
    } else {
        console.log('Project has no image, using placeholder');
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-icon';
        placeholder.innerHTML = '<i class="fas fa-code"></i>';
        imageContainer.appendChild(placeholder);
    }
    
    card.appendChild(imageContainer);

    // Project content
    const content = document.createElement('div');
    content.className = 'project-content';

    // Title
    const title = document.createElement('h3');
    title.textContent = project.title || 'Untitled Project';
    content.appendChild(title);

    // Description
    const desc = document.createElement('p');
    desc.className = 'project-desc';
    desc.textContent = project.description || 'No description available';
    content.appendChild(desc);

    // Tags
    if (project.tags && project.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'project-tags';
        project.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'project-tag';
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });
        content.appendChild(tagsContainer);
    }

    // Links
    const linksContainer = document.createElement('div');
    linksContainer.className = 'project-links';
    
    if (project.liveUrl) {
        const liveLink = document.createElement('a');
        liveLink.href = project.liveUrl;
        liveLink.className = 'btn btn-sm';
        liveLink.target = '_blank';
        liveLink.textContent = 'Live Demo';
        linksContainer.appendChild(liveLink);
    }
    
    if (project.codeUrl) {
        const codeLink = document.createElement('a');
        codeLink.href = project.codeUrl;
        codeLink.className = 'btn btn-sm btn-outline';
        codeLink.target = '_blank';
        codeLink.textContent = 'View Code';
        linksContainer.appendChild(codeLink);
    }
    
    content.appendChild(linksContainer);
    card.appendChild(content);
    
    return card;
}

// Function to render an update
function renderUpdate(update) {
    console.log('Rendering update:', update);
    const updateElement = document.createElement('div');
    updateElement.className = 'update-item fade-in';
    
    // Update header
    const header = document.createElement('div');
    header.className = 'update-header';
    
    const title = document.createElement('h3');
    title.textContent = update.title || 'Untitled Update';
    header.appendChild(title);
    
    const date = document.createElement('span');
    date.className = 'update-date';
    date.textContent = formatDate(update.date);
    header.appendChild(date);
    
    updateElement.appendChild(header);
    
    // Update content
    const content = document.createElement('div');
    content.className = 'update-content';
    content.textContent = update.content || 'No content available';
    updateElement.appendChild(content);
    
    // Update category with proper class for styling
    const category = document.createElement('span');
    category.className = `update-category category-badge ${update.category || 'default'}`;
    category.textContent = update.category || 'update';
    updateElement.appendChild(category);
    
    return updateElement;
}

// Function to render featured projects
async function renderFeaturedProjects() {
    console.log('Rendering featured projects...');
    const featuredProjectsContainer = document.getElementById('featured-projects');
    if (!featuredProjectsContainer) {
        console.log('No featured-projects container found (might not be home page)');
        return;
    }

    try {
        const projects = await fetchFeaturedProjects();
        if (!projects || !Array.isArray(projects)) {
            console.error('Invalid projects data for featured projects:', projects);
            featuredProjectsContainer.innerHTML = '<p class="text-center">Error loading featured projects.</p>';
            return;
        }
        
        featuredProjectsContainer.innerHTML = ''; // Clear existing content
        
        // Filter featured projects and limit to 3
        const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
        
        if (featuredProjects.length === 0) {
            console.log('No featured projects found');
            featuredProjectsContainer.innerHTML = '<p class="text-center">No featured projects available yet.</p>';
            return;
        }
        
        console.log(`Rendering ${featuredProjects.length} featured projects`);
        featuredProjects.forEach(project => {
            try {
                const card = renderProjectCard(project);
                featuredProjectsContainer.appendChild(card);
            } catch (error) {
                console.error('Error rendering project card:', error, project);
            }
        });
    } catch (error) {
        console.error('Error rendering featured projects:', error);
        featuredProjectsContainer.innerHTML = '<p class="text-center">Error loading featured projects.</p>';
    }
}

// Function to render recent updates
async function renderRecentUpdates() {
    console.log('Rendering recent updates...');
    const updatesContainer = document.getElementById('featured-updates');
    if (!updatesContainer) {
        console.log('No featured-updates container found (might not be home page)');
        return;
    }

    try {
        const updates = await fetchRecentUpdates();
        if (!updates || !Array.isArray(updates)) {
            console.error('Invalid updates data for recent updates:', updates);
            updatesContainer.innerHTML = '<p class="text-center">Error loading updates.</p>';
            return;
        }
        
        updatesContainer.innerHTML = ''; // Clear existing content
        
        // Sort updates by date (newest first) and take first 2
        const recentUpdates = [...updates]
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
            .slice(0, 2);
        
        if (recentUpdates.length === 0) {
            console.log('No updates found');
            updatesContainer.innerHTML = '<p class="text-center">No updates available yet.</p>';
            return;
        }
        
        console.log(`Rendering ${recentUpdates.length} recent updates`);
        recentUpdates.forEach((update, index) => {
            try {
                const updateElement = renderUpdate(update);
                // Add animation delay
                updateElement.style.animationDelay = `${index * 0.15}s`;
                updatesContainer.appendChild(updateElement);
            } catch (error) {
                console.error('Error rendering update element:', error, update);
            }
        });
    } catch (error) {
        console.error('Error rendering recent updates:', error);
        updatesContainer.innerHTML = '<p class="text-center">Error loading updates.</p>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing homepage...');
    
    // Create a timestamp for debugging
    console.log('Initialization time:', new Date().toISOString());
    
    // Check for featured-projects and featured-updates containers
    const featuredProjects = document.getElementById('featured-projects');
    const featuredUpdates = document.getElementById('featured-updates');
    
    console.log('featured-projects exists:', Boolean(featuredProjects));
    console.log('featured-updates exists:', Boolean(featuredUpdates));
    
    if (featuredProjects) {
        console.log('Found featured-projects, rendering featured projects');
        renderFeaturedProjects();
        // Refresh featured projects every 10 seconds
        setInterval(renderFeaturedProjects, 10000);
    }
    
    if (featuredUpdates) {
        console.log('Found featured-updates, rendering recent updates');
        renderRecentUpdates();
        // Refresh recent updates every 10 seconds
        setInterval(renderRecentUpdates, 10000);
    }
}); 