# Personal Portfolio Website

A clean, responsive portfolio website built with vanilla HTML, CSS, and JavaScript to showcase my professional work, projects, and recent activities.

## Features

- **Home Page**: Professional introduction, skills, and contact information
- **Projects Page**: Showcase of completed and ongoing development projects
- **Updates/Blog Page**: Recent activities, learnings, and professional updates

## Technology Stack

- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: Custom styling with responsive design principles
  - Flexbox and CSS Grid for layouts
  - CSS Variables for consistent theming
  - Media queries for responsive design
- **JavaScript**: Vanilla JS for interactive elements
  - No frameworks or libraries to ensure fast loading times
  - DOM manipulation for dynamic content
  - Fetch API for any data operations

## Project Structure

```
/
├── index.html              # Home page
├── projects.html           # Projects showcase page
├── updates.html            # Recent activities/blog page
├── css/
│   ├── style.css           # Main stylesheet
│   ├── responsive.css      # Responsive design rules
│   └── animations.css      # CSS animations
├── js/
│   ├── main.js             # Main JavaScript functionality
│   ├── projects.js         # Projects page functionality
│   └── updates.js          # Updates page functionality
└── assets/
    ├── images/             # Image resources
    ├── icons/              # Icon files
    └── documents/          # Downloadable files (e.g., resume)
```

## Setup and Installation

This is a static website that requires no special installation:

1. Clone this repository
2. Open the project in your favorite code editor
3. Use a local development server for testing:
   - You can use the Live Server extension in VSCode
   - Or run `python -m http.server` in the project directory
4. Open your browser and navigate to the local server address

## Deployment

The website can be deployed to any static site hosting service:

- GitHub Pages
- Netlify
- Vercel
- Amazon S3
- Any traditional web hosting service

## Customization

### Styling

All styling variables are located in the `css/style.css` file. You can easily modify:

- Color scheme
- Typography
- Spacing
- Animation timing

### Content

- Update personal information in `index.html`
- Add new projects by modifying the projects array in `js/projects.js`
- Add new updates/blog posts by editing the updates array in `js/updates.js`

## Browser Compatibility

This website is designed to work on all modern browsers including:

- Chrome (and Chromium-based browsers)
- Firefox
- Safari
- Edge

## Performance Considerations

- Images are optimized for web
- Minimal JavaScript to ensure fast loading times
- No external dependencies
- CSS is organized to minimize repaints and reflows

## License

This project is open source and available under the [MIT License](LICENSE). 