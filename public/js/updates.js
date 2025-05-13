/**
 * Portfolio Website - Updates
 * Manages the updates display section
 */

// Function to fetch updates from the server
async function fetchUpdates() {
    try {
        console.log('Fetching updates from server...');
        const response = await fetch('/api/updates');
        if (!response.ok) {
            throw new Error(`Failed to fetch updates: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Updates fetched successfully:', data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching updates:', error);
        throw error;
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

// Function to render a single update with appropriate styling
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
    
    // Add animation class
    updateElement.classList.add('reveal');
    
    return updateElement;
}

// Function to render all updates
async function renderUpdates() {
    console.log('Rendering updates...');
    const updatesList = document.getElementById('updates-list');
    
    if (!updatesList) {
        console.error('Could not find updates-list element in the DOM');
        return;
    }

    // Show loading indicator
    updatesList.innerHTML = `
        <div class="text-center" style="padding: 20px;">
            <div class="loading-spinner"></div>
            <p>Loading updates...</p>
        </div>
    `;

    try {
        const updates = await fetchUpdates();
        
        if (!updates || updates.length === 0) {
            console.log('No updates found');
            updatesList.innerHTML = '<p class="text-center updates-empty">No updates available yet. Check back later for new content.</p>';
            return;
        }
        
        updatesList.innerHTML = ''; // Clear existing content
        
        // Sort updates by date (newest first)
        const sortedUpdates = [...updates].sort((a, b) => {
            return new Date(b.date || 0) - new Date(a.date || 0);
        });
        
        console.log(`Rendering ${sortedUpdates.length} updates`);
        sortedUpdates.forEach((update, index) => {
            const updateElement = renderUpdate(update);
            // Add animation delay
            updateElement.style.animationDelay = `${index * 0.15}s`;
            updateElement.style.transitionDelay = `${index * 0.15}s`;
            updatesList.appendChild(updateElement);
        });
        
        // Initialize animations after a brief delay
        setTimeout(() => {
            console.log('Initializing animations for updates');
            const animatedElements = updatesList.querySelectorAll('.update-item');
            animatedElements.forEach(element => {
                element.classList.add('active');
            });
        }, 100);
    } catch (error) {
        console.error('Error rendering updates:', error);
        updatesList.innerHTML = '<p class="text-center updates-empty">Error loading updates. Please try again later.</p>';
    }
}

// For featured updates on home page
async function renderFeaturedUpdates() {
    console.log('Rendering featured updates...');
    const featuredUpdatesList = document.getElementById('featured-updates');
    if (!featuredUpdatesList) {
        console.log('No featured-updates container found (might not be home page)');
        return;
    }

    // Show loading indicator for featured updates
    featuredUpdatesList.innerHTML = `
        <div class="text-center" style="padding: 20px;">
            <div class="loading-spinner"></div>
            <p>Loading updates...</p>
        </div>
    `;

    try {
        const updates = await fetchUpdates();
        if (!updates || updates.length === 0) {
            console.log('No updates found');
            featuredUpdatesList.innerHTML = '<p class="text-center updates-empty">No updates available yet.</p>';
            return;
        }
        
        featuredUpdatesList.innerHTML = ''; // Clear existing content
        
        // Sort updates by date (newest first) and take first 4
        const recentUpdates = [...updates]
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
            .slice(0, 4);
        
        console.log(`Rendering ${recentUpdates.length} featured updates`);
        recentUpdates.forEach((update, index) => {
            const updateElement = renderUpdate(update);
            // Add animation delay
            updateElement.style.animationDelay = `${index * 0.15}s`;
            updateElement.style.transitionDelay = `${index * 0.15}s`;
            featuredUpdatesList.appendChild(updateElement);
        });
        
        // Initialize animations after a brief delay
        setTimeout(() => {
            const animatedElements = featuredUpdatesList.querySelectorAll('.update-item');
            animatedElements.forEach(el => el.classList.add('active'));
        }, 100);
    } catch (error) {
        console.error('Error rendering featured updates:', error);
        featuredUpdatesList.innerHTML = '<p class="text-center updates-empty">Error loading updates. Please try again later.</p>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing updates...');
    const updatesList = document.getElementById('updates-list');
    const featuredUpdates = document.getElementById('featured-updates');
    
    if (updatesList) {
        console.log('Found updates-list, rendering all updates');
        renderUpdates();
    }
    
    if (featuredUpdates) {
        console.log('Found featured-updates, rendering featured updates');
        renderFeaturedUpdates();
    }
});

/**
 * Portfolio Website - Updates/Blog
 * Manages the updates/blog section for recent activities
 */

// Sample updates data
// Replace with your actual updates and activities
const updates = [
  {
    id: 1,
    title: "Completed Advanced JavaScript Certification",
    content: "I recently completed an advanced JavaScript certification, focusing on modern ES6+ features, asynchronous programming patterns, and performance optimization techniques. This knowledge has allowed me to write cleaner, more efficient code and implement complex functionality with ease.",
    date: "2023-02-15",
    category: "certification",
    link: "#",
    featured: true
  },
  {
    id: 2,
    title: "Launched New Project: E-Commerce Platform",
    content: "Excited to announce the launch of my latest project - a fully functional e-commerce platform built with vanilla JavaScript. The project features shopping cart functionality, user authentication, and payment processing integration. Check out the live demo in my projects section!",
    date: "2023-01-20",
    category: "project",
    link: "/projects.html#ecommerce",
    featured: true
  },
  {
    id: 3,
    title: "Contributed to Open Source: Bug Fix for Popular Library",
    content: "Proud to have contributed a critical bug fix to a widely-used open source JavaScript library. The issue was related to event handling in nested components, and my solution improved the performance by approximately 15% in certain scenarios. This experience taught me a lot about large-scale codebase management and collaborative development.",
    date: "2022-12-05",
    category: "open-source",
    link: "https://github.com/examplerepo/pull/123",
    featured: true
  },
  {
    id: 4,
    title: "Attended Web Development Conference",
    content: "I recently attended the annual WebDev Summit where I participated in workshops on progressive web apps, Web Assembly, and the latest CSS features. Networking with other developers provided valuable insights into industry best practices and emerging technologies to watch.",
    date: "2022-11-18",
    category: "event",
    link: "#",
    featured: false
  },
  {
    id: 5,
    title: "Mastered CSS Grid and Flexbox Layouts",
    content: "After focused study and practice, I've gained advanced proficiency in CSS Grid and Flexbox. I've implemented these techniques in my recent projects, resulting in responsive layouts that maintain integrity across all device sizes without relying on external frameworks.",
    date: "2022-10-12",
    category: "learning",
    link: "/projects.html",
    featured: false
  },
  {
    id: 6,
    title: "Created Tutorial Series on Vanilla JavaScript",
    content: "I've published a series of tutorial articles covering fundamental and advanced JavaScript concepts without relying on frameworks. Topics include DOM manipulation, event handling, async/await, and building custom components. The tutorials emphasize writing clean, maintainable code while explaining the underlying principles.",
    date: "2022-09-05",
    category: "article",
    link: "#blog",
    featured: false
  }
];

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const updatesContainer = document.getElementById('updates-container');
  const categoryFilters = document.getElementById('category-filters');
  
  if (updatesContainer) {
    // Check if we're on updates page or home page
    const isUpdatesPage = document.body.classList.contains('updates-page');
    
    // On home page, only show featured updates
    if (!isUpdatesPage) {
      const featuredUpdates = updates.filter(update => update.featured);
      renderUpdates(featuredUpdates, updatesContainer);
    } else {
      // On updates page, render all updates and set up filtering
      renderUpdates(updates, updatesContainer);
      
      if (categoryFilters) {
        setupCategoryFilters(categoryFilters);
      }
    }
  }
});

/**
 * Render updates to the container
 * @param {Array} updatesToRender - Array of update objects
 * @param {HTMLElement} container - Container to render updates into
 */
function renderUpdates(updatesToRender, container) {
  // Clear existing content
  container.innerHTML = '';
  
  if (updatesToRender.length === 0) {
    container.innerHTML = '<p class="no-updates">No updates match your filter criteria.</p>';
    return;
  }
  
  // Create updates list
  const updatesList = document.createElement('div');
  updatesList.className = 'updates-list';
  
  // Add each update
  updatesToRender.forEach(update => {
    const updateCard = document.createElement('div');
    updateCard.className = 'update-card reveal';
    updateCard.id = `update-${update.id}`;
    
    // Create update header
    const updateHeader = document.createElement('div');
    updateHeader.className = 'update-header';
    
    // Create update date
    const dateObj = new Date(update.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const updateDate = document.createElement('div');
    updateDate.className = 'update-date';
    updateDate.textContent = formattedDate;
    
    // Create update category badge
    const categoryBadge = document.createElement('span');
    categoryBadge.className = `category-badge ${update.category}`;
    categoryBadge.textContent = update.category.charAt(0).toUpperCase() + update.category.slice(1);
    
    updateHeader.appendChild(updateDate);
    updateHeader.appendChild(categoryBadge);
    
    // Create update title
    const updateTitle = document.createElement('h3');
    updateTitle.className = 'update-title';
    
    if (update.link) {
      const titleLink = document.createElement('a');
      titleLink.href = update.link;
      titleLink.textContent = update.title;
      titleLink.className = 'animated-underline';
      
      // If external link, add target blank
      if (update.link.startsWith('http')) {
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
      }
      
      updateTitle.appendChild(titleLink);
    } else {
      updateTitle.textContent = update.title;
    }
    
    // Create update content
    const updateContent = document.createElement('div');
    updateContent.className = 'update-content';
    updateContent.textContent = update.content;
    
    // Assemble update card
    updateCard.appendChild(updateHeader);
    updateCard.appendChild(updateTitle);
    updateCard.appendChild(updateContent);
    
    updatesList.appendChild(updateCard);
  });
  
  container.appendChild(updatesList);
}

/**
 * Setup category filtering functionality
 * @param {HTMLElement} filterContainer - Container for filter buttons
 */
function setupCategoryFilters(filterContainer) {
  // Get unique categories from all updates
  const allCategories = [];
  updates.forEach(update => {
    if (!allCategories.includes(update.category)) {
      allCategories.push(update.category);
    }
  });
  
  // Create "All" button
  const allButton = document.createElement('button');
  allButton.className = 'filter-btn active';
  allButton.textContent = 'All Updates';
  allButton.dataset.filter = 'all';
  filterContainer.appendChild(allButton);
  
  // Create button for each category
  allCategories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.textContent = category.charAt(0).toUpperCase() + category.slice(1) + 's';
    button.dataset.filter = category;
    filterContainer.appendChild(button);
  });
  
  // Add event listeners to filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  const updatesContainer = document.getElementById('updates-container');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      
      if (filter === 'all') {
        // Show all updates
        renderUpdates(updates, updatesContainer);
      } else {
        // Filter updates by category
        const filteredUpdates = updates.filter(update => 
          update.category === filter
        );
        renderUpdates(filteredUpdates, updatesContainer);
      }
    });
  });
}

/**
 * Search updates functionality
 */
function initUpdateSearch() {
  const searchForm = document.getElementById('update-search-form');
  const searchInput = document.getElementById('update-search');
  const updatesContainer = document.getElementById('updates-container');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const searchTerm = searchInput.value.trim().toLowerCase();
      
      if (searchTerm === '') {
        renderUpdates(updates, updatesContainer);
        return;
      }
      
      // Filter updates by search term
      const searchResults = updates.filter(update => 
        update.title.toLowerCase().includes(searchTerm) || 
        update.content.toLowerCase().includes(searchTerm) ||
        update.category.toLowerCase().includes(searchTerm)
      );
      
      renderUpdates(searchResults, updatesContainer);
    });
  }
} 