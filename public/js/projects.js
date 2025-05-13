/**
 * Portfolio Website - Projects
 * Manages the projects showcase section
 */

// Function to fetch projects from the server
async function fetchProjects() {
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
        console.error('Error fetching projects:', error);
        // Return an empty array to prevent further errors
        return [];
    }
}

// Function to render a single project card
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

// Function to render all projects
async function renderProjects() {
    console.log('Rendering projects...');
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) {
        console.error('Could not find projects-list element in the DOM');
        return;
    }

    try {
        const projects = await fetchProjects();
        if (!projects || !Array.isArray(projects)) {
            console.error('Invalid projects data:', projects);
            projectsList.innerHTML = '<p class="text-center">Error loading projects. Please try again later.</p>';
            return;
        }
        
        projectsList.innerHTML = ''; // Clear existing content
        
        if (projects.length === 0) {
            console.log('No projects found');
            projectsList.innerHTML = '<p class="text-center">No projects available yet.</p>';
            return;
        }
        
        console.log(`Rendering ${projects.length} projects`);
        projects.forEach(project => {
            const card = renderProjectCard(project);
            projectsList.appendChild(card);
        });
    } catch (error) {
        console.error('Error rendering projects:', error);
        projectsList.innerHTML = '<p class="text-center">Error loading projects. Please try again later.</p>';
    }
}

// For featured projects on home page
async function renderFeaturedProjects() {
    console.log('Rendering featured projects...');
    const featuredProjectsList = document.getElementById('featured-projects');
    if (!featuredProjectsList) {
        console.log('No featured-projects container found (might not be home page)');
        return;
    }

    try {
        const projects = await fetchProjects();
        if (!projects || !Array.isArray(projects)) {
            console.error('Invalid projects data for featured projects:', projects);
            featuredProjectsList.innerHTML = '<p class="text-center">Error loading featured projects.</p>';
            return;
        }
        
        featuredProjectsList.innerHTML = ''; // Clear existing content
        
        // Filter featured projects and limit to 3
        const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
        
        if (featuredProjects.length === 0) {
            console.log('No featured projects found');
            featuredProjectsList.innerHTML = '<p class="text-center">No featured projects available yet.</p>';
            return;
        }
        
        console.log(`Rendering ${featuredProjects.length} featured projects`);
        featuredProjects.forEach(project => {
            const card = renderProjectCard(project);
            featuredProjectsList.appendChild(card);
        });
    } catch (error) {
        console.error('Error rendering featured projects:', error);
        featuredProjectsList.innerHTML = '<p class="text-center">Error loading featured projects.</p>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing projects...');
    const projectsList = document.getElementById('projects-list');
    const featuredProjects = document.getElementById('featured-projects');
    
    if (projectsList) {
        console.log('Found projects-list, rendering all projects');
        renderProjects();
        // Refresh projects every 10 seconds
        setInterval(renderProjects, 10000);
    }
    
    if (featuredProjects) {
        console.log('Found featured-projects, rendering featured projects');
        renderFeaturedProjects();
        // Refresh featured projects every 10 seconds
        setInterval(renderFeaturedProjects, 10000);
    }
});

/**
 * Setup filtering functionality
 * @param {HTMLElement} filterContainer - Container for filter buttons
 */
function setupFilters(filterContainer) {
  // Get unique technologies from all projects
  const allTechnologies = [];
  projects.forEach(project => {
    project.technologies.forEach(tech => {
      if (!allTechnologies.includes(tech)) {
        allTechnologies.push(tech);
      }
    });
  });
  
  // Create "All" button
  const allButton = document.createElement('button');
  allButton.className = 'filter-btn active';
  allButton.textContent = 'All';
  allButton.dataset.filter = 'all';
  filterContainer.appendChild(allButton);
  
  // Create button for each technology
  allTechnologies.forEach(tech => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.textContent = tech;
    button.dataset.filter = tech;
    filterContainer.appendChild(button);
  });
  
  // Add event listeners to filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectsContainer = document.getElementById('projects-container');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      
      if (filter === 'all') {
        // Show all projects
        renderProjects(projects, projectsContainer);
      } else {
        // Filter projects by technology
        const filteredProjects = projects.filter(project => 
          project.technologies.includes(filter)
        );
        renderProjects(filteredProjects, projectsContainer);
      }
    });
  });
} 