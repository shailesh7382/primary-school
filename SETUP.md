# Quick Setup Guide

## Prerequisites
- Node.js v14 or higher
- npm v6 or higher

## Installation & Running

### 1. Install all dependencies
```bash
npm run install:all
```

This will install dependencies for all 4 modules:
- Container (main app)
- Maths-Science module
- Exam module
- Student Records module

### 2. Start all services
```bash
npm run start:all
```

This will start all services concurrently:
- Container: http://localhost:3000 (Main app - access this one)
- Maths-Science: http://localhost:3001
- Exam: http://localhost:3002
- Student Records: http://localhost:3003

### 3. Access the application
Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Stop all services
Press `Ctrl+C` in the terminal where services are running.

## Building for Production

```bash
npm run build:all
```

Build artifacts will be in the `dist/` directory of each module.

## Cleaning

To remove all node_modules and build artifacts:
```bash
npm run clean
```

## Development Workflow

### Working on individual modules
You can develop each module independently:

```bash
cd maths-science
npm start
# Module will run on http://localhost:3001
```

### Module Federation
Each module exposes its main component through Webpack Module Federation:
- Container consumes remote modules
- Each module can be developed and deployed independently
- Shared dependencies (React, React-DOM) use singleton pattern

## Features to Explore

1. **Home Page** - Overview of the system
2. **Maths & Science** - Interactive lessons for classes 1-5
   - Choose Mathematics or Science
   - Select your class
   - Browse topics and start learning
3. **Exams** - Take online tests
   - Select an exam
   - Answer questions with timer
   - View your score
4. **Student Records** - View performance analytics
   - Browse all students
   - Filter by class
   - View individual student details

## Troubleshooting

### Ports already in use
If you get port errors, check if the ports are already in use:
```bash
netstat -tuln | grep -E ":(3000|3001|3002|3003)"
```

Kill processes on those ports if needed.

### Module Federation errors
If you see shared module errors, ensure all modules are running. The container needs all three remote modules to be available.

### Hot reload not working
Restart the affected module:
```bash
cd <module-name>
npm start
```

## Project Structure

```
primary-school/
├── container/          # Main shell app (Port 3000)
├── maths-science/      # Learning module (Port 3001)
├── exam/               # Exam module (Port 3002)
├── student-records/    # Records module (Port 3003)
├── scripts/            # Build and run scripts
│   ├── install-all.sh
│   ├── build-all.sh
│   ├── start-all.sh
│   └── clean.sh
└── README.md           # Full documentation
```

## Next Steps

1. Explore the application features
2. Review the code structure
3. Customize the UI and content
4. Add more lessons and topics
5. Implement backend APIs
6. Deploy to production

For detailed documentation, see [README.md](README.md)
