# 🏫 Primary School Education System - Microfrontend Architecture

A modern microfrontend application for primary school education (Classes 1-5) built with React, Node.js, and Webpack Module Federation.

## 📋 Overview

This project demonstrates a scalable microfrontend architecture with three independently developed and deployed modules:

1. **Container App** (Port 3000) - Main shell application that orchestrates all modules
2. **Maths & Science Module** (Port 3001) - Interactive lessons for mathematics and science
3. **Exam Module** (Port 3002) - Online examination system
4. **Student Records Module** (Port 3003) - Student score tracking and management

## 🏗️ Architecture

### Microfrontend Approach
- **Module Federation**: Uses Webpack 5's Module Federation for runtime integration
- **Independent Development**: Each module can be developed, tested, and deployed independently
- **Version Independence**: Modules can use different versions of dependencies
- **Runtime Integration**: Modules are loaded dynamically at runtime
- **Shared Dependencies**: Common libraries (React, React-DOM) are shared between modules

### Technology Stack
- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **Build Tool**: Webpack 5.89.0
- **Module Federation**: Webpack's built-in Module Federation Plugin
- **Package Manager**: npm
- **Runtime**: Node.js

## 📁 Project Structure

```
primary-school/
├── container/                 # Main container application (Port 3000)
│   ├── src/
│   │   ├── App.js            # Main app with navigation
│   │   ├── App.css           # Container styles
│   │   ├── index.js          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js     # Module Federation config
│   └── package.json
│
├── maths-science/            # Maths & Science module (Port 3001)
│   ├── src/
│   │   ├── MathsScience.js   # Main component
│   │   ├── MathsScience.css  # Module styles
│   │   └── index.js
│   ├── public/
│   ├── webpack.config.js     # Exposes MathsScience component
│   └── package.json
│
├── exam/                     # Exam module (Port 3002)
│   ├── src/
│   │   ├── Exam.js           # Main component
│   │   ├── Exam.css          # Module styles
│   │   └── index.js
│   ├── public/
│   ├── webpack.config.js     # Exposes Exam component
│   └── package.json
│
├── student-records/          # Student Records module (Port 3003)
│   ├── src/
│   │   ├── StudentRecords.js # Main component
│   │   ├── StudentRecords.css# Module styles
│   │   └── index.js
│   ├── public/
│   ├── webpack.config.js     # Exposes StudentRecords component
│   └── package.json
│
├── scripts/                  # Unified build and run scripts
│   ├── install-all.sh        # Install all dependencies
│   ├── build-all.sh          # Build all modules
│   ├── start-all.sh          # Start all modules
│   ├── stop-all.sh           # Stop all running services
│   ├── check-status.sh       # Check status of all services
│   └── clean.sh              # Clean all modules
│
├── package.json              # Root package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Install all module dependencies
npm run install:all

# Or use the script directly
bash scripts/install-all.sh
```

### Development

Start all services in development mode:

```bash
# Start all modules concurrently
npm run start:all

# Or use the script directly
bash scripts/start-all.sh
```

This will start:
- Container app at http://localhost:3000
- Maths-Science module at http://localhost:3001
- Exam module at http://localhost:3002
- Student Records module at http://localhost:3003

**Access the main application at http://localhost:3000**

### Checking Status

Verify all services are running correctly:

```bash
# Check status of all services
npm run check-status

# Or use the script directly
bash scripts/check-status.sh
```

### Stopping Services

Stop all running services:

```bash
# Stop all services
npm run stop:all

# Or use the script directly
bash scripts/stop-all.sh
```

### Building for Production

```bash
# Build all modules
npm run build:all

# Or use the script directly
bash scripts/build-all.sh
```

Build artifacts will be in the `dist/` directory of each module.

### Cleaning

```bash
# Clean all modules (remove node_modules and dist)
npm run clean

# Or use the script directly
bash scripts/clean.sh
```

## 🎯 Features

### Maths & Science Module
- Interactive lessons for Classes 1-5
- Separate sections for Mathematics and Science
- Topic-wise learning materials
- Practice exercises

### Exam Module
- Online examination system
- Multiple choice questions
- Timer functionality
- Score calculation and grading
- Exam history

### Student Records Module
- Student information management
- Score tracking for all exams
- Performance analytics
- Class-wise filtering
- Individual student details with charts

## 🔧 Module Federation Configuration

Each module exposes its main component through Module Federation:

**Container** (Remote Consumer):
```javascript
remotes: {
  mathsScience: 'mathsScience@http://localhost:3001/remoteEntry.js',
  exam: 'exam@http://localhost:3002/remoteEntry.js',
  studentRecords: 'studentRecords@http://localhost:3003/remoteEntry.js',
}
```

**Modules** (Remote Providers):
```javascript
exposes: {
  './MathsScience': './src/MathsScience',
  './Exam': './src/Exam',
  './StudentRecords': './src/StudentRecords',
}
```

## 🎨 UI Features

- Modern gradient-based design
- Responsive layout
- Interactive components
- Smooth transitions and animations
- Intuitive navigation

## 📝 Development Notes

### Independent Module Development
Each module can be developed independently:
```bash
cd maths-science
npm start
```

### Version Independence
Modules can use different versions of dependencies. The shared dependencies are configured in the Module Federation config to ensure compatibility.

### Adding New Modules
1. Create a new directory for the module
2. Set up webpack.config.js with Module Federation
3. Expose the main component
4. Add remote configuration to the container
5. Update build scripts

## 🔐 Best Practices

- Each module maintains its own dependencies
- Shared dependencies (React, React-DOM) use singleton pattern
- Modules communicate through navigation and URL parameters
- Each module can be deployed independently
- Build outputs are optimized for production

## 🤝 Contributing

When contributing to this project:
1. Maintain module independence
2. Follow the established project structure
3. Update documentation for new features
4. Test modules independently and integrated

## 📄 License

MIT License

## 👥 Authors

Primary School Education System Team

---

**Happy Learning! 🎓**
