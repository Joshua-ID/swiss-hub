## Project Overview
Swiss-Hub

This is a comprehensive e-learning web application built with React 18, TypeScript, Vite, and Tailwind CSS. The platform features separate admin and student interfaces with course management, content delivery, and progress tracking capabilities.


# Getting Started

This project was built with Vite, TypeScript, and uses the development server provided by Vite.

## Prerequisites

- Node.js (version 22 or higher)
- npm run (version 8.20 or higher)

## Running the Project

1. Clone the repository: `git clone https://github.com/Joshua-ID/swiss-hub.git`
2. Install dependencies: `npm run install`
3. Start the development server: `npm run dev`
4. Open your web browser and navigate to `http://localhost:7030`

## libraries
1. Shadcn `https://ui.shadcn.com/docs`

## Development Workflow

### Build Commands
- **Install dependencies**: `npm install`
- **Build for production**: `npm run build`
- **Build output**: `dist/` directory

## Deployment

This project can be deployed to any hosting service that supports static HTML files.

1. Build the project: `npm run build`
2. The compiled files will be located in the `dist` directory.
3. Upload the contents of the `dist` directory to your hosting service.

The project is now live and can be accessed at the URL provided by your hosting service.


## Project Type

- **Project Type**: React + TypeScript Modern Web Application
- **Entry Point**: `src/main.tsx` (React application entry)
- **Build System**: Vite 7.0.0 (Fast development and build)
- **Styling System**: Tailwind CSS 3.4.17 (Atomic CSS framework)

## Core Architecture

## SCHEMA Supabase table schema 
- file table database schema  

### Directory Structure

```
src/
├── api/                    # API layer and mock data
│   ├── mockData.ts        # Mock courses, lessons, users, progress
│   └── README.md
├── assets/                 # Static assets (images)
├── components/             # Reusable UI components
│   ├── CourseCard.tsx     # Course display card
│   ├── ProgressBadge.tsx  # Progress indicator
│   ├── Modal.tsx          # Reusable modal dialog
│   └── Navbar.tsx         # Navigation bar
├── pages/                  # Page-level components
│   ├── Home.tsx           # Landing page
│   ├── AdminDashboard.tsx # Admin overview
│   ├── AdminCourses.tsx   # Course management
│   ├── CourseForm.tsx     # Create/edit course form
│   ├── StudentDashboard.tsx # Student learning dashboard
│   ├── CourseCatalog.tsx  # Browse courses
│   ├── CourseDetail.tsx   # Course outline and lessons
│   └── LessonView.tsx     # Individual lesson viewer
├── store/                  # State management
│   └── useStore.ts        # Zustand store with localStorage
├── types/                  # TypeScript definitions
│   └── index.ts           # Course, Lesson, Progress types
├── App.tsx                 # Main app with routing
└── main.tsx                # Application entry point
```

### Tech Stack

- **Core**: React 18.3.1, TypeScript 5.8.3, Vite 7.0.0
- **Routing**: React Router DOM 6.30.1
- **State Management**: Zustand 4.4.7 with localStorage persistence
- **Styling**: Tailwind CSS 3.4.17, Headless UI 1.7.18
- **Icons**: Lucide React

## Key Features Implemented

### Admin Interface
- **Dashboard**: Statistics overview (total courses, students, enrollments, completions)
- **Course Management**: Create, edit, delete courses with full CRUD operations
- **Course Form**: 
  - Title, description, thumbnail, category, level, duration
  - Prerequisites selection (courses can require completion of other courses)
  - Validation and error handling

### Student Interface
- **Dashboard**: Personal learning overview with progress statistics
- **Course Catalog**: 
  - Search by title/description
  - Filter by category and level
  - View all available courses
  - Enroll in courses
  - Locked courses based on prerequisites
- **Course Detail**: 
  - View complete course outline with all lessons
  - Lesson status indicators (completed, current, locked)
  - Sequential lesson access control
  - Course progress visualization
- **Lesson Viewer**:
  - Individual lesson page with video player placeholder
  - Course materials download/view
  - Previous/Next lesson navigation
  - Mark lesson as complete/incomplete
  - Progress tracking within course context
- **Progress Tracking**: Visual progress indicators and completion status

### Core Components
- **CourseCard**: Displays course info with enrollment/progress status
- **ProgressBadge**: Circular progress indicator with percentage
- **Modal**: Reusable dialog for forms and content
- **Navbar**: Role-aware navigation with user switcher

### Data Models
- **User**: Admin and student roles
- **Course**: Title, description, category, level, prerequisites, duration
- **Lesson**: Course content with video URLs and materials
- **Progress**: User completion tracking per lesson
- **Enrollment**: Course enrollment with completion percentage

## State Management

The application uses Zustand for global state with localStorage persistence:

### Store Structure
```typescript
{
  currentUser: User | null,
  courses: Course[],
  lessons: Lesson[],
  progress: Progress[],
  enrollments: Enrollment[],
  users: User[]
}
```

### Key Actions
- Course CRUD: `addCourse`, `updateCourse`, `deleteCourse`
- Enrollment: `enrollCourse`, `unenrollCourse`
- Progress: `markLessonComplete`, `getCourseProgress`
- Utilities: `isUserEnrolled`, `getLessonsByCourse`



## Current Implementation Status

###  Completed (Phase 1 - MVP)
- Type definitions for all data models
- Mock data module with sample content
- Zustand store with localStorage persistence
- Reusable UI components (CourseCard, ProgressBadge, Modal, Navbar)
- Admin Dashboard with statistics
- Admin Course Management with create/edit/delete
- Student Dashboard with enrolled courses
- Course Catalog with search, filters, and enrollment
- **Course Detail Page**: View course outline with lessons, progress tracking, enrollment
- **Lesson View Page**: Individual lesson page with video player, materials, navigation
- React Router setup with role-based routing
- Production build verified

###  Next Steps (Phase 2)
To implement the next phase, enable **Youware Backend** MCP tool and follow these steps:

1. **Backend Integration** (requires Youware Backend MCP):
   - Replace mock data with real API endpoints
   - User authentication and session management
   - Persistent database storage (D1)
   - File upload for course thumbnails and materials (R2)
   - Video hosting integration (consider YouTube MCP or R2 storage)

3. **Enhanced Features**:
   - User profile management
   - Course completion certificates
   - Admin user management
   - Enrollment analytics and reports
   - Quiz/assessment functionality
   - Discussion forums per course

## Backend Requirements

The platform is designed to integrate with **Youware Backend** for:
- **Database**: Course, lesson, user, progress storage
- **Authentication**: User login and role-based access
- **File Storage**: Course thumbnails, lesson materials, video files
- **API Endpoints**: RESTful API for all CRUD operations

To enable backend functionality:
1. Enable Youware Backend MCP tool in project settings
2. Follow `/skills/backend-integration/` skill documentation
3. Implement API endpoints for each data model
4. Replace mock data store with API calls

## Design Principles

- **Modern UI**: Clean, professional design with Tailwind CSS
- **Responsive**: Mobile-first approach, works on all devices
- **Accessible**: WCAG-compliant color contrast and interactive elements
- **Performance**: Optimized builds with code splitting
- **User Experience**: Intuitive navigation, clear feedback, smooth transitions

## Special Configurations

- **Asset Paths**: Use absolute paths starting with `/assets/` for production compatibility
- **TypeScript**: Strict type checking enabled
- **Tailwind**: Custom configuration for design system
- **Router**: Client-side routing with role-based protection

## Role Switcher

For demo purposes, the navbar includes a role switcher button to toggle between admin and student views. This should be replaced with proper authentication in production.

## Future Considerations

- Video streaming optimization (HLS format)
- Real-time progress sync across devices
- Mobile app support
- Multi-language support (i18next already installed)
- Social learning features (comments, ratings)
- Advanced analytics dashboard
- Email notifications for course updates

