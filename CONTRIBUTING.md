# Contributing to Supabase Keep-Alive Extension

Thank you for your interest in contributing to the Supabase Keep-Alive Extension! This document provides guidelines and information for contributors.

## 🚀 Quick Start

### Prerequisites
- **Chrome Browser** (latest version)
- **Git** for version control
- **Text Editor** (VS Code recommended)
- **Basic Knowledge** of JavaScript, HTML, CSS, and Chrome Extensions

### Development Setup

1. **Fork & Clone Repository**
   ```bash
   git clone https://github.com/josphatmuteru/supabase-keep-alive.git
   cd supabase-keep-alive
   ```

2. **Load Extension in Development Mode**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked" and select the `extension/` folder

3. **Make Changes**
   - Edit files in the `extension/` directory
   - Reload extension after changes (click reload button in `chrome://extensions/`)

4. **Test Your Changes**
   - Configure test URLs in extension options
   - Test all functionality thoroughly
   - Use Chrome DevTools for debugging

## 📋 Contribution Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment
- Follow the project's goals and vision

### What We Welcome
- 🐛 **Bug fixes**
- ✨ **New features** (discuss first in issues)
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- 🧪 **Test improvements**
- 🔧 **Performance optimizations**
- 🌐 **Internationalization (i18n)**

### What to Discuss First
- Major architectural changes
- Breaking changes
- New dependencies
- Significant UI changes
- Security-related modifications

## 🛠 Development Workflow

### 1. Create an Issue
Before working on significant changes:
- Search existing issues first
- Create a new issue describing the problem/feature
- Wait for maintainer feedback on approach
- Get assignment to avoid duplicate work

### 2. Development Process

#### Branch Naming Convention
```bash
git checkout -b feature/short-description
git checkout -b bugfix/issue-number-description
git checkout -b docs/what-you-are-documenting
```

#### Commit Message Format
Follow conventional commits:
```
type(scope): short description

Longer description if needed

Closes #123
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build process or auxiliary tool changes

**Examples:**
```
feat(options): add custom ping endpoint support
fix(background): handle network timeout errors properly
docs(readme): add troubleshooting section
```

### 3. Pull Request Process

#### Before Submitting PR
- [ ] Code follows project style guidelines
- [ ] All tests pass (if applicable)
- [ ] Extension loads without errors
- [ ] Features work as expected
- [ ] Documentation updated (if needed)
- [ ] No console errors in background script

#### PR Requirements
1. **Descriptive Title**: Clear summary of changes
2. **Detailed Description**: 
   - What changes were made?
   - Why were they necessary?
   - How to test the changes?
3. **Linked Issues**: Reference related issues
4. **Screenshots**: For UI changes
5. **Testing**: Describe how you tested

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Extension loads correctly
- [ ] All existing features work
- [ ] New features work as expected
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Extension installs/loads correctly
- [ ] Options page saves settings properly
- [ ] Popup displays current status
- [ ] Background script creates alarms
- [ ] HTTP requests work with/without API key
- [ ] Error handling works for invalid URLs
- [ ] Enable/disable functionality works
- [ ] Badge updates correctly
- [ ] Multiple Supabase URLs supported
- [ ] All ping intervals work (test with short intervals)

### Test Scenarios
1. **Fresh Install**: Test with no prior settings
2. **Invalid URLs**: Test error handling
3. **Network Issues**: Test offline/connectivity problems
4. **Large URL Lists**: Test with many configured URLs
5. **API Authentication**: Test with valid/invalid API keys
6. **Storage Limits**: Test edge cases

### Browser Testing
Test in different Chrome-based browsers:
- Google Chrome
- Microsoft Edge
- Brave Browser

## 📝 Code Style Guidelines

### JavaScript
- Use modern ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions where appropriate
- Add JSDoc comments for functions
- Handle promises with async/await
- Always include error handling

### HTML/CSS
- Use semantic HTML elements
- Follow BEM naming convention for CSS classes
- Responsive design principles
- Accessibility best practices (ARIA labels, etc.)
- Consistent spacing and indentation

### Chrome Extension Best Practices
- Minimal permissions (only request what you need)
- Efficient background script (avoid unnecessary work)
- Proper storage usage (sync vs local)
- Content Security Policy compliance
- Manifest V3 compliance

## 🐛 Bug Reports

### Before Reporting
- Check if the issue already exists
- Try to reproduce the bug consistently
- Test in a fresh Chrome profile
- Identify minimum steps to reproduce

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Chrome Version: 
- Extension Version:
- Operating System:

**Screenshots/Logs**
Add any relevant screenshots or console logs
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Problem/Use Case**
What problem does this solve?

**Proposed Solution**
How do you envision this working?

**Alternatives Considered**
Any alternative solutions you've thought of?

**Additional Context**
Screenshots, mockups, or examples
```

## 🏗 Architecture Overview

### File Structure
```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (main logic)
├── popup.html/js          # Extension popup
├── options.html/js        # Settings page
└── icons/                 # Extension icons
```

### Key Components
- **Background Service Worker**: Handles alarms and HTTP requests
- **Popup Interface**: Quick status and actions
- **Options Page**: Full configuration interface
- **Chrome Storage**: Settings (sync) and results (local)

### Data Flow
```
User Actions → Options/Popup → Chrome Storage → Background Script → HTTP Requests → Supabase APIs
```

## 🔒 Security Guidelines

### Code Security
- Never commit API keys or secrets
- Validate all user inputs
- Use HTTPS for all requests
- Follow principle of least privilege
- Sanitize data before storage

### Extension Security
- Minimal permissions in manifest
- Content Security Policy (CSP)
- No eval() or unsafe operations
- Proper error handling
- Secure storage practices

## 📚 Resources

### Chrome Extension Development
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome APIs Reference](https://developer.chrome.com/docs/extensions/reference/)

### Web Standards
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [Web.dev](https://web.dev/)

### Tools
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Extension DevTools](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)

## 🏆 Recognition

### Contributors
All contributors will be recognized in:
- README.md contributors section
- Release notes for their contributions
- Special thanks for major contributions

### Types of Contributions Recognized
- Code contributions
- Bug reports
- Feature suggestions
- Documentation improvements
- User support
- Testing and QA
- Design contributions

## ❓ Getting Help

### Where to Ask Questions
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and ideas
- **Code Review**: In pull request comments

### Response Times
- **Bug Reports**: Within 48 hours
- **Feature Requests**: Within 1 week
- **Pull Requests**: Within 1 week
- **Questions**: Within 72 hours

## 🚀 Release Process

### Version Numbering
We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

### Release Cycle
- Regular minor releases every 2-4 weeks
- Patch releases as needed for critical bugs
- Major releases when breaking changes are necessary

---

Thank you for contributing to Supabase Keep-Alive Extension! Your contributions help keep Supabase projects alive and make the developer experience better for everyone. 🚀