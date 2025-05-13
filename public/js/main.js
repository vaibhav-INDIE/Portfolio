/**
 * Portfolio Website - Main JavaScript
 * Handles core functionalities across all pages
 */

// Function to handle responsive navigation
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    
    if (navToggle && nav) {
        // Toggle navigation when hamburger is clicked
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
        
        // Close navigation when links are clicked
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
        
        // Highlight current page in navigation
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === '/' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// Function to initialize animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right, .reveal');
    
    if (animatedElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Uncomment to stop observing after animation is triggered
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    console.log(`Initialized animations for ${animatedElements.length} elements`);
}

// Handle smooth scrolling for anchor links
function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Update footer year
function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Apply animated text classes to hero
function initHeroAnimation() {
    const heroElements = document.querySelectorAll('.fade-in');
    
    heroElements.forEach((element, index) => {
        element.classList.add(`fade-in-${index + 1}`);
        element.style.animationDelay = `${index * 0.2}s`;
    });
}

// Initialize contact form if it exists
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded - initializing portfolio website...');
    initNavigation();
    initAnimations();
    initSmoothScroll();
    updateFooterYear();
    initHeroAnimation();
    initContactForm();
    
    // Set up a MutationObserver to watch for dynamically added content
    const updatesList = document.getElementById('updates-list') || document.getElementById('featured-updates');
    if (updatesList) {
        const observer = new MutationObserver((mutations) => {
            console.log('Content changes detected in updates list - reinitializing animations');
            initAnimations();
        });
        
        observer.observe(updatesList, { childList: true, subtree: true });
    }
    
    // Call again after a short delay to ensure dynamically loaded content is animated
    setTimeout(() => {
        initAnimations();
    }, 1000);
    
    console.log('Portfolio website initialization complete!');
});

/**
 * Scroll Animations - Reveal elements as they enter viewport
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  // Function to check if element is in viewport
  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  }
  
  // Check on initial load
  checkReveal();
  
  // Check on scroll
  window.addEventListener('scroll', checkReveal);
}

/**
 * Typing Animation Effect for Hero Heading
 */
function typeAnimation() {
  const headingElement = document.querySelector('.hero-heading');
  const fullText = headingElement.textContent;
  
  // Clear original text
  headingElement.textContent = '';
  
  // Create typing elements
  const typingText = document.createElement('span');
  typingText.classList.add('typing-text');
  
  const typingCursor = document.createElement('span');
  typingCursor.classList.add('typing-cursor');
  
  headingElement.appendChild(typingText);
  headingElement.appendChild(typingCursor);
  
  // Start typing animation
  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < fullText.length) {
      typingText.textContent += fullText.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
      
      // Remove cursor blinking after a delay
      setTimeout(() => {
        typingCursor.style.animation = 'none';
        typingCursor.style.opacity = '0';
      }, 3000);
    }
  }, 100);
}

// Function to add 'active' class to elements when they come into view
function initViewAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up');

  function checkAnimations() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  }

  // Check on initial load
  checkAnimations();

  // Check on scroll
  window.addEventListener('scroll', checkAnimations);
}

// Initialize view animations
initViewAnimations();

// Fetch featured projects from server
async function fetchFeaturedProjects() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const projects = await response.json();
    return projects.filter(project => project.featured);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// Render featured projects
async function renderFeaturedProjects() {
  const projects = await fetchFeaturedProjects();
  const projectsList = document.getElementById('featured-projects');
  if (!projectsList) return;
  
  projectsList.innerHTML = '';
  
  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <div class="project-image">
        <img src="${project.image || 'images/placeholder.jpg'}" alt="${project.title}">
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="project-links">
          ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn glow-on-hover">Live Demo</a>` : ''}
          ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank" class="btn glow-on-hover">View Code</a>` : ''}
        </div>
      </div>
    `;
    projectsList.appendChild(projectCard);
  });
} 