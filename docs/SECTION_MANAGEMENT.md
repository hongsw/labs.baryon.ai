# Section-Based File Management System

**Baryon Labs Homepage Architecture Documentation**

## Overview

The Baryon Labs homepage uses a modular, section-based file management system that promotes maintainability, performance, and developer experience. This architecture separates concerns by organizing content into discrete sections that are dynamically loaded using HTMX.

## Architecture Overview

```
baryon_labs_homepage/
├── index.html                 # Main entry point
├── sections/                  # Section HTML files
│   ├── home.html             # Hero section
│   ├── concept.html          # Concept cards
│   ├── team.html             # Team members
│   ├── services.html         # Services showcase
│   ├── careers.html          # Job listings & application
│   └── contact.html          # Contact form
├── json/                     # Data files
│   ├── team.json            # Team member data
│   └── careers.json         # Job listings data
├── main.js                   # Core JavaScript
├── languages.js             # Internationalization
└── main.css                 # Global styles
```

## Core Concepts

### 1. Section-Based Architecture

Each major section of the website is maintained as a separate HTML file in the `sections/` directory. This approach provides:

- **Modularity**: Each section can be developed and maintained independently
- **Performance**: Sections are loaded on-demand using lazy loading
- **Maintainability**: Easier to locate and modify specific content
- **Team Collaboration**: Multiple developers can work on different sections simultaneously

### 2. Dynamic Loading with HTMX

The main `index.html` file uses HTMX attributes to load sections dynamically:

```html
<!-- Immediate loading for above-the-fold content -->
<div hx-get="sections/home.html" hx-trigger="load" hx-swap="innerHTML"></div>

<!-- Lazy loading for below-the-fold content -->
<div id="team-container" hx-get="sections/team.html" hx-trigger="revealed" hx-swap="innerHTML"></div>
```

**Benefits:**
- Faster initial page load
- Reduced bandwidth usage
- Better user experience on slower connections

### 3. Data-Driven Content

Dynamic sections use JSON data files to separate content from presentation:

```javascript
// In sections/team.html
async function loadTeamData() {
    const response = await fetch('./json/team.json');
    const teamData = await response.json();
    renderTeam();
}
```

## Section File Structure

### Standard Section Template

Each section file follows this structure:

```html
<section id="section-name" class="section-class">
    <div class="container">
        <!-- Section content -->
    </div>
</section>

<script>
// Section-specific JavaScript
// - Data loading
// - Event handlers
// - Internationalization
</script>
```

### Required Elements

1. **Section ID**: Unique identifier for navigation
2. **Container Div**: Consistent layout wrapper
3. **Internationalization**: Support for multiple languages
4. **Error Handling**: Graceful fallbacks for data loading failures

## Data Management

### JSON Structure

Data files follow a consistent internationalization pattern:

```json
{
    "title": {
        "en": "English Title",
        "ko": "한국어 제목"
    },
    "items": [
        {
            "id": "unique-identifier",
            "property": {
                "en": "English value",
                "ko": "한국어 값"
            }
        }
    ]
}
```

### Data Loading Pattern

```javascript
let sectionData = null;

async function loadSectionData() {
    try {
        const response = await fetch('./json/section.json');
        sectionData = await response.json();
        renderSection();
        updateSectionLanguage();
    } catch (error) {
        console.error('Data loading failed:', error);
        createFallbackContent();
    }
}
```

## Internationalization System

### Language Support

The system supports multiple languages through:

1. **Global Language State**: Managed in `languages.js`
2. **Section-Level Updates**: Each section handles its own language switching
3. **Event-Driven Updates**: Language changes trigger custom events

### Implementation

```javascript
// Language change event listener
document.addEventListener('languageChanged', function(event) {
    updateSectionLanguage();
});

// Language update function
function updateSectionLanguage() {
    const currentLang = window.currentLanguage || localStorage.getItem('language') || 'ko';
    
    // Update text content based on current language
    document.querySelectorAll('[data-title-en]').forEach(element => {
        const titleEn = element.getAttribute('data-title-en');
        const titleKo = element.getAttribute('data-title-ko');
        element.textContent = currentLang === 'ko' ? titleKo : titleEn;
    });
}
```

## Performance Optimizations

### 1. Lazy Loading Strategy

```javascript
// HTMX integration for performance
document.addEventListener('htmx:afterSettle', function(event) {
    // Initialize components only after content loads
    initializeD3Backgrounds();
    initializeBaryonParticles();
    initializeContactForm();
});
```

### 2. Memory Management

```javascript
// Cleanup functions for animations and event listeners
function handlePageUnload() {
    cleanupMemory();
    if (window.baryonCleanupFunctions) {
        window.baryonCleanupFunctions.forEach(cleanup => cleanup());
    }
}

window.addEventListener('beforeunload', handlePageUnload);
```

## Form Integration

### Contact Forms

Forms use the Form2AI2Email service for backend processing:

```javascript
// Form submission to external service
const response = await fetch('https://form2ai2email-worker.kilos-network.workers.dev/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        form_id: 'unique-form-identifier',
        data: formData
    })
});
```

### Form Features

- **Client-side validation**
- **Loading states with spinners**
- **Inline error/success messages**
- **Internationalized feedback**
- **File upload via URL links**

## Development Workflow

### Adding a New Section

1. **Create Section File**:
   ```bash
   touch sections/new-section.html
   ```

2. **Add to Main HTML**:
   ```html
   <div id="new-section-container" 
        hx-get="sections/new-section.html" 
        hx-trigger="revealed" 
        hx-swap="innerHTML"></div>
   ```

3. **Create Data File** (if needed):
   ```bash
   touch json/new-section.json
   ```

4. **Add Navigation Link**:
   ```html
   <li><a href="#new-section" data-i18n="nav.newSection">New Section</a></li>
   ```

5. **Update Language Files**:
   ```javascript
   // In languages.js
   nav: {
       newSection: 'New Section' // English
   }
   ```

### Section Development Guidelines

1. **Follow the Template**: Use the standard section structure
2. **Implement Error Handling**: Always provide fallback content
3. **Support Internationalization**: Include language switching logic
4. **Clean Up Resources**: Implement proper cleanup for animations/listeners
5. **Test Responsiveness**: Ensure mobile compatibility

## API Integration

### External Services

- **Form2AI2Email**: Contact and career form processing
- **D3.js**: Data visualization and animations
- **HTMX**: Dynamic content loading

### Service Integration Pattern

```javascript
// Service wrapper for external APIs
async function submitToService(endpoint, data) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Service error:', error);
        throw error;
    }
}
```

## Debugging and Monitoring

### HTMX Debug Events

```javascript
// Debug event listeners
document.addEventListener('htmx:beforeRequest', function(event) {
    console.log('📤 HTMX request:', event.detail.requestConfig.path);
});

document.addEventListener('htmx:afterRequest', function(event) {
    console.log('📥 HTMX response:', event.detail.xhr.status);
});
```

### Error Handling

```javascript
// Global error handling
document.addEventListener('htmx:responseError', function(event) {
    console.error('❌ HTMX error:', event.detail);
    // Implement fallback content loading
});
```

## Best Practices

### 1. Code Organization

- Keep section-specific logic within section files
- Use consistent naming conventions
- Implement proper error boundaries
- Document complex functionality

### 2. Performance

- Minimize DOM queries
- Use event delegation when possible
- Clean up resources on page unload
- Optimize animation performance

### 3. Accessibility

- Include proper ARIA labels
- Ensure keyboard navigation
- Provide alternative text for images
- Test with screen readers

### 4. Internationalization

- Use semantic keys for translations
- Test all languages thoroughly
- Handle text expansion/contraction
- Support RTL languages (future consideration)

## Troubleshooting

### Common Issues

1. **Section Not Loading**:
   ```javascript
   // Check HTMX debug console for request failures
   // Verify file paths and permissions
   ```

2. **Language Switching Issues**:
   ```javascript
   // Ensure languageChanged event is properly dispatched
   // Check currentLanguage global variable
   ```

3. **Data Loading Failures**:
   ```javascript
   // Implement fallback content
   // Check JSON file syntax and accessibility
   ```

## Future Enhancements

- **Component Library**: Reusable UI components
- **Build Process**: Automated optimization and bundling
- **Testing Framework**: Unit and integration tests
- **Performance Monitoring**: Real-time performance tracking
- **Content Management**: CMS integration for non-technical updates

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintainer**: Baryon Labs Development Team 