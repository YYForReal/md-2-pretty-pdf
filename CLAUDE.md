# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based Markdown to PDF converter that allows users to input Markdown content and export it as a styled PDF document. The application runs entirely in the browser without requiring a backend server - users can simply open `index.html` directly.

## Key Features

- **Real-time preview**: Markdown content is parsed and displayed instantly as users type
- **7 built-in themes**: Default, Academic, Modern, Elegant, Minimal, Eye-care, and Classic
- **Font customization**: Support for multiple Chinese and English fonts
- **PDF generation**: Direct browser printing with optimized styles
- **Responsive design**: Works on desktop and mobile devices

## Development Setup

No build process or server setup required. The application runs directly in the browser:

```bash
# Open directly in browser
open index.html

# OR use a local server (optional)
npx serve .
python -m http.server 8000
php -S localhost:8000
```

## Architecture

### Core Components

**Main Application (`js/app.js`)**:
- `MarkdownToPDFApp` class manages the entire application
- Handles real-time preview updates with debouncing (150ms delay)
- Manages theme switching, font selection, and PDF generation
- Contains keyboard shortcuts: `Ctrl+R` (refresh preview), `Ctrl+P` (print), `Ctrl+S` (download PDF)

**Theme Manager (`js/themeManager.js`)**:
- `ThemeManager` class handles all theme-related operations
- Manages 7 predefined themes with CSS custom properties
- Supports custom theme creation and local storage persistence
- Applies themes via CSS variables and body classes

**PDF Generator (`js/pdfGenerator.js`)**:
- `PDFGenerator` class handles PDF export functionality
- Uses browser's native `window.print()` API (not jsPDF/html2canvas)
- Implements direct printing by temporarily replacing page content
- Preserves theme styles and custom formatting in print output

### Theme System Architecture

The application uses a dual theme system:
1. **CSS Classes**: Body classes like `theme-default`, `theme-academic` for base theme styling
2. **CSS Variables**: Dynamic variables applied to `:root` for real-time customization

**Custom Styles Flow**:
- User selects font/size → stored in `app.customStyles`
- `applyCustomStylesToPreview()` converts camelCase to kebab-case CSS variables
- Variables applied to `document.documentElement` with `!important` precedence

### Print Architecture

The PDF generation uses a sophisticated print workflow:
1. **Content Preparation**: Clone preview content, preserve theme styles
2. **Page Replacement**: Temporarily replace entire body with print-optimized content
3. **Style Application**: Apply custom styles as CSS variables with print media queries
4. **Print Execution**: Call `window.print()` with timeout handling
5. **Content Restoration**: Restore original page content and trigger re-initialization

**Key Print Methods**:
- `directPrint()`: Main print orchestration method
- `preparePrintContent()`: Creates print-optimized HTML structure
- `executePrintWithFallback()`: Handles print dialog with timeout recovery
- `restoreOriginalContent()`: Restores page and triggers `pageRestored` event

## CSS Architecture

**Main Stylesheet (`styles/main.css`)**:
- CSS custom properties for consistent theming
- Grid-based responsive layout (`grid-template-columns: 1fr 1fr 320px`)
- Component-based styling for editor, preview, and control panels

**Theme Stylesheet (`styles/themes.css`)**:
- Theme-specific CSS variable overrides
- Print media queries for each theme
- Supports both class-based and variable-based theming

## Key Development Patterns

### Event-Driven Architecture
- Uses `CustomEvent` for theme changes (`themechange`) and page restoration (`pageRestored`)
- Page restoration event allows re-binding of DOM elements after print operations

### Debounced Updates
- Input events use 150ms debounce to prevent excessive re-rendering
- Window resize events use 300ms debounce

### State Management
- Application state stored in instance properties (`currentTheme`, `customStyles`, etc.)
- Theme preferences persisted to localStorage
- No external state management libraries used

## Font Support

The application includes comprehensive font support for Chinese text:
- Chinese fonts: SimSun (宋体), KaiTi (楷体), SimHei (黑体), FangSong (仿宋)
- English fonts: Times New Roman, Arial, Inter, Georgia
- Fallback to system fonts for cross-platform compatibility

## Common Development Tasks

### Adding a New Theme
1. Add theme definition to `initializeThemePresets()` in `themeManager.js`
2. Add corresponding CSS class styles in `themes.css`
3. Add option to `<select id="themeSelect">` in `index.html`

### Modifying Print Styles
- Edit print media queries in `themes.css`
- Modify `preparePrintContent()` method for structural changes
- Update `applyPrintOptimizations()` for style adjustments

### Debugging PDF Generation
- Enable console logs (search for "🖨️" emoji markers)
- Check `validatePrintContent()` for content verification
- Monitor `pageRestored` event for successful recovery

## File Dependencies

- **marked.js**: Markdown parsing library (v11.1.1, bundled locally)
- **jsPDF**: PDF generation library (loaded from CDN, but currently unused)
- **html2canvas**: Canvas generation (loaded from CDN, but currently unused)

The application previously used jsPDF + html2canvas for PDF generation but now uses the browser's native print API for better reliability and theme preservation.