# Supabase Keep Alive Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://developer.chrome.com/docs/extensions/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)

A Chrome extension that prevents your Supabase free-tier projects from automatically pausing after 7 days of inactivity by sending periodic keep-alive pings.

[Chrome web store link](https://chromewebstore.google.com/detail/supabase-keep-alive/fblgjapnnnbmcegmgapkbfgaejfhplhn)

## 🎯 Why This Extension?

Supabase free-tier projects pause after **7 days of inactivity**. This extension keeps your projects alive by:

- ⏰ Sending periodic HTTP requests to your Supabase endpoints
- 📊 Monitoring success/failure rates with real-time feedback
- 🔧 Supporting multiple projects with custom configurations
- 🛡️ Operating securely with minimal permissions

## ✨ Features

### Core Functionality
- **🔄 Automated Pings**: Configurable intervals from 1 hour to 1 week
- **📱 Multiple Projects**: Manage unlimited Supabase projects
- **🔐 Authentication**: Support for per-URL Supabase anon keys
- **📊 Real-time Monitoring**: Live status updates and failure tracking
- **🎯 Smart Notifications**: Badge alerts for failed pings

### User Interface
- **⚡ Quick Popup**: Instant status overview and manual ping triggers
- **⚙️ Comprehensive Settings**: Full configuration with live testing
- **🎨 Clean Design**: Intuitive interface matching modern web standards
- **📱 Responsive Layout**: Works seamlessly across different screen sizes

### Technical Features
- **🏗️ Manifest V3**: Latest Chrome extension standards
- **💾 Efficient Storage**: Smart use of Chrome sync and local storage
- **🛡️ Security First**: Minimal permissions and secure request handling
- **🔧 Error Handling**: Robust error management and recovery

## 📦 Quick Start

### Option 1: Chrome Web Store (Recommended)
*Coming soon - extension will be published to Chrome Web Store*

### Option 2: Developer Installation
1. **Clone Repository**:
   ```bash
   git clone https://github.com/josphatmuteru/supabase-keep-alive.git
   cd supabase-keep-alive
   ```

2. **Load Extension**:
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked" → Select `extension/` folder

3. **Configure**:
   - Click extension icon → "⚙️ Settings"
   - Add your Supabase project URLs
   - Set ping interval (24 hours recommended)
   - Enable automatic pings

## 🔧 Configuration

### Basic Setup
1. **Extension Status**: Enable/disable automatic pings
2. **Ping Interval**: Choose frequency:
   - 1 hour (frequent)
   - 6 hours (regular)
   - 24 hours (recommended)
   - 3 days (conservative)
   - 1 week (minimal)

3. **Project URLs**: Add Supabase endpoints:
   ```
   https://your-project.supabase.co/rest/v1/
   https://your-project.supabase.co/rest/v1/users
   ```

### Advanced Options
- **Supabase Anon Keys**: Add per-URL authentication keys for protected endpoints
- **Custom Names**: Label projects for easy identification
- **Real-time Validation**: URLs are validated as you type
- **Manual Testing**: Test pings immediately from settings

## 📊 Monitoring & Status

### Popup Interface
- **📈 Status Overview**: Extension state, URL count, interval, last ping
- **📊 Results Summary**: Success/failure counts with detailed breakdown
- **⚡ Quick Actions**: Manual ping, toggle, settings access

### Badge Notifications
- **Green**: All pings successful
- **Red with Number**: Failed ping count
- **No Badge**: Extension disabled or no recent pings

## 🛠️ Development

### Project Structure
```
supabase-keep-alive/
├── extension/              # Chrome extension files
│   ├── manifest.json      # Extension configuration
│   ├── background.js      # Service worker (main logic)
│   ├── popup.html/js      # Extension popup interface
│   ├── options.html/js    # Settings page
│   └── icons/             # Extension icons (multiple sizes)
├── docs/
│   ├── DEPLOYMENT.md      # Deployment guide
│   ├── EXTENSION_GUIDE.md # Architecture & development guide
│   └── CONTRIBUTING.md    # Contribution guidelines
├── LICENSE                # MIT License
└── README.md             # This file
```

### Architecture Overview
```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│   Popup     │    │   Background    │    │  Supabase   │
│ Interface   │◄──►│ Service Worker  │───►│ API Servers │
└─────────────┘    └─────────────────┘    └─────────────┘
       │                      │
       ▼                      ▼
┌─────────────┐    ┌─────────────────┐
│  Options    │    │ Chrome Storage  │
│    Page     │◄──►│   & Alarms      │
└─────────────┘    └─────────────────┘
```

### Key Components
- **Background Service Worker**: Manages alarms and HTTP requests
- **Popup Interface**: Quick status and actions
- **Options Page**: Full configuration interface
- **Chrome Storage**: Settings synchronization and result persistence

## 📚 Documentation

- **[🚀 Deployment Guide](DEPLOYMENT.md)**: Step-by-step deployment instructions
- **[🏗️ Architecture Guide](EXTENSION_GUIDE.md)**: Technical architecture and development details
- **[🤝 Contributing Guide](CONTRIBUTING.md)**: Contribution guidelines and development setup
- **[📄 License](LICENSE)**: MIT License details

## 🔒 Security & Privacy

### Security Measures
- ✅ **Minimal Permissions**: Only requests necessary Chrome APIs
- ✅ **HTTPS Only**: All requests use secure connections
- ✅ **No Eval**: No dynamic code execution
- ✅ **CSP Compliant**: Content Security Policy enforced
- ✅ **Input Validation**: All user inputs properly validated

### Privacy Protection
- 🔐 **No Data Collection**: Extension doesn't collect personal information
- 💾 **Local Storage**: All settings stored locally in browser
- 🌍 **No External Services**: No third-party analytics or tracking
- 🔍 **Open Source**: All code available for audit

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute
- 🐛 **Bug Reports**: Help us identify and fix issues
- ✨ **Feature Requests**: Suggest new functionality
- 📝 **Documentation**: Improve guides and explanations
- 💻 **Code Contributions**: Submit bug fixes and enhancements
- 🧪 **Testing**: Help test new features and releases

### Development Setup
```bash
# Clone and setup
git clone https://github.com/josphatmuteru/supabase-keep-alive.git
cd supabase-keep-alive

# Load in Chrome for development
# chrome://extensions/ → Developer mode → Load unpacked → extension/
```

## 📋 Roadmap

### Upcoming Features
- [ ] **Chrome Web Store Publication**
- [ ] **Edge/Firefox Support**
- [ ] **Custom HTTP Methods** (POST, PUT)
- [ ] **Request Body Configuration**
- [ ] **Webhook Notifications**
- [ ] **Export/Import Settings**
- [ ] **Advanced Scheduling**
- [ ] **Statistics Dashboard**

### Long-term Goals
- [ ] **Team/Organization Features**
- [ ] **Integration with Supabase CLI**
- [ ] **Custom Ping Strategies**
- [ ] **Performance Analytics**

## ❓ FAQ

### General Questions

**Q: Does this extension work with all Supabase plans?**
A: Yes, but it's designed primarily for free-tier projects that pause after 7 days of inactivity.

**Q: Will this affect my Supabase usage limits?**
A: The extension sends minimal GET requests that typically don't count against most usage limits, but check your Supabase plan details.

**Q: Can I use this with custom domains?**
A: Yes, you can add any HTTPS URL, not just *.supabase.co domains.

### Technical Questions

**Q: How does the extension handle Chrome being closed?**
A: Chrome extensions with alarms can run even when the browser is closed, ensuring continuous monitoring.

**Q: What happens if my internet connection is unstable?**
A: The extension includes error handling and will retry on the next scheduled ping cycle.

## 🛠️ Troubleshooting

### Common Issues

1. **Extension not pinging automatically**
   - ✅ Check extension is enabled in settings
   - ✅ Verify URLs are correct (must include `https://`)
   - ✅ Ensure Chrome allows background activity

2. **Pings failing consistently**
   - ✅ Test URLs manually in browser
   - ✅ Check Supabase project is active
   - ✅ Verify API key if using authentication
   - ✅ Review Row Level Security settings

3. **Badge not updating**
   - ✅ Badge updates after each ping cycle
   - ✅ Refresh popup to see latest status
   - ✅ Check if notifications are blocked

### Getting Help
- 📝 **GitHub Issues**: Report bugs and request features
- 💬 **Discussions**: Ask questions and share ideas
- 📚 **Documentation**: Check guides for detailed information

## 📊 Stats & Recognition

### Project Stats
- 🏗️ **Architecture**: Modern Chrome Extension (Manifest V3)
- 📦 **Size**: Lightweight (~50KB total)
- 🔧 **Dependencies**: Zero external dependencies
- 🧪 **Testing**: Comprehensive manual testing suite

### Contributors
Thanks to all contributors who help make this extension better! 🙏

*Contributions welcome - see [CONTRIBUTING.md](CONTRIBUTING.md)*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This extension is not affiliated with Supabase Inc. Use at your own discretion. While designed to prevent project pausing, Supabase's policies may change, and this extension's effectiveness is not guaranteed.

---

<div align="center">
  
**🚀 Keep Your Supabase Projects Alive! 🚀**

[⭐ Star this repo](https://github.com/josphatmuteru/supabase-keep-alive) • [🐛 Report Bug](https://github.com/josphatmuteru/supabase-keep-alive/issues) • [💡 Request Feature](https://github.com/josphatmuteru/supabase-keep-alive/issues)

Made with ❤️ by [Josphat Muteru](https://github.com/josphatmuteru)

[![Buy Me A Coffee](https://img.shields.io/badge/-Buy%20Me%20A%20Coffee-orange?style=flat&logo=buy-me-a-coffee&logoColor=white)](https://buymeacoffee.com/josphatmuteru)

</div>
