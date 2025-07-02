
# Baryon Labs Homepage

**Building the future of AI from first principles**

A modern, modular website built with section-based architecture, featuring dynamic loading, internationalization, and integrated AI services.

## 🚀 Live Sites

- **Main Site**: [labs.baryon.ai](https://labs.baryon.ai)
- **Dev Environment**: [fdb532e9.labs-baryon-ai.pages.dev](https://fdb532e9.labs-baryon-ai.pages.dev)
- **Mirror**: [d4710f50.www-baryon-ai.pages.dev](https://d4710f50.www-baryon-ai.pages.dev)

## 🏗️ Architecture

This website uses a **modular, section-based architecture** that promotes:
- **Performance**: Lazy loading with HTMX
- **Maintainability**: Separate files for each section
- **Internationalization**: Korean/English support
- **Developer Experience**: Independent section development

## 📁 Project Structure

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
├── docs/                     # Documentation
│   └── SECTION_MANAGEMENT.md # Architecture documentation
├── main.js                   # Core JavaScript
├── languages.js             # Internationalization
└── main.css                 # Global styles
```

## 🔧 Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Dynamic Loading**: HTMX
- **Animations**: D3.js for data visualizations
- **Forms**: Form2AI2Email integration
- **Deployment**: Cloudflare Pages
- **Languages**: Korean, English

## 📚 Documentation

### **[Section Management System](./docs/SECTION_MANAGEMENT.md)**
Comprehensive guide to the modular architecture, including:
- Section-based file organization
- Dynamic loading with HTMX
- Data management patterns
- Internationalization system
- Development workflow
- Best practices

## 🌐 Features

### **Multi-language Support**
- Seamless Korean/English switching
- Persistent language preference
- Section-level language updates

### **Dynamic Content Loading**
- HTMX-powered lazy loading
- Improved performance
- Better mobile experience

### **Interactive Elements**
- D3.js powered animations
- Responsive baryon particle effects
- Smooth section transitions

### **Form Integration**
- Contact form with validation
- Career application system
- AI-powered email processing via Form2AI2Email

### **Team Management**
- JSON-driven team profiles
- Dynamic role updates
- Social media integration

## 🚀 Quick Start

### Development
```bash
# Clone the repository
git clone <repository-url>
cd baryon_labs_homepage

# Serve locally (any HTTP server)
python3 -m http.server 8000
# or
npx serve .
```

### Deployment
```bash
# Deploy to Cloudflare Pages
wrangler pages deploy ./ --project-name labs-baryon-ai
```

## 🔄 Development Workflow

1. **Section Development**: Work on individual sections in `sections/` folder
2. **Data Updates**: Modify JSON files in `json/` folder
3. **Language Updates**: Add translations in `languages.js`
4. **Testing**: Test both languages and responsive design
5. **Deploy**: Push to main branch for auto-deployment

## 🎯 Current Team

1. **Jean Paul** - AI Master & Edu Expert
2. **H. Jeung** - CMO and Offline Master
3. **Simon (HJ MOON)** - Cloud Educator · Full-Stack Developer
4. **Ben Lim** - AI Agent Master & n8n Expert

## 📞 Contact

- **Email**: admin@baryon.ai
- **Website**: [labs.baryon.ai](https://labs.baryon.ai)
- **GitHub**: [github.com/Baryon-ai](https://github.com/Baryon-ai)

---

**Claude AI Development Session**: [View Session](https://claude.ai/chat/c7486276-2a78-4c00-8140-0b3ec7a93a8f)