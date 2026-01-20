# Socio-Economic Survey System - Frontend

This is the frontend application for the government-grade socio-economic survey system built with Next.js. The application features a modern, responsive UI with Progressive Web App (PWA) capabilities.

## 🚀 Features

- **Progressive Web App (PWA)**: Installable application with offline capabilities
- **Role-based access control**: Admin, Supervisor, and Surveyor roles
- **Multi-step survey forms**: Comprehensive household and slum surveys
- **Responsive design**: Optimized for both desktop and mobile surveyors
- **Secure authentication**: JWT-based authentication system
- **Real-time progress tracking**: Dashboard with KPIs and progress indicators
- **Full-screen survey mode**: Distraction-free survey experience
- **Offline support**: Continue working without internet connectivity

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Communication**: Axios
- **Authentication**: JWT-based
- **Build Tool**: Turbopack

## 📦 Installation

1. Ensure Node.js 18+ is installed on your system
2. Navigate to the frontend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file with the API configuration:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

## ▶️ Running the Application

1. Ensure the backend server is running on port 5000
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` in your browser

## 📁 Project Structure

```
/app                    # Next.js app router pages
├── admin/              # Admin dashboard and management
├── supervisor/         # Supervisor dashboard and assignments
├── surveyor/           # Surveyor dashboard and survey forms
├── login/              # Authentication pages
├── globals.css         # Global styles
├── layout.tsx          # Root layout with PWA integration
├── loading.tsx         # Loading component
├── page.tsx            # Home page
/components            # Reusable UI components
├── Accordion.tsx       # Collapsible sections
├── Button.tsx          # Reusable button component
├── Card.tsx            # Card UI component
├── DashboardLayout.tsx # Dashboard layout
├── Input.tsx           # Input field component
├── Select.tsx          # Select dropdown component
├── Sidebar.tsx         # Navigation sidebar
├── Stepper.tsx         # Multi-step progress indicator
├── SurveyorLayout.tsx  # Layout for surveyor pages
├── InstallPrompt.tsx   # PWA install prompt
├── PWAStatusIndicator.tsx # Online/offline status indicator
├── SlumForm.tsx        # Slum creation form
├── Toast.tsx           # Notification system
├── BottomNav.tsx       # Mobile bottom navigation
├── Checkbox.tsx        # Checkbox component
├── LayoutSkeleton.tsx  # Loading skeleton
├── LoadingSpinner.tsx  # Loading spinner
├── ModernTable.tsx     # Data table component
├── DeleteConfirmationDialog.tsx # Confirmation dialog
├── DashboardStats.tsx  # Dashboard statistics cards
contexts/              # React Context providers
├── SidebarContext.tsx  # Sidebar state management
├── PWAContext.tsx      # PWA functionality context
services/              # API service and utilities
├── api.ts              # Centralized API client
utils/                 # Utility functions
├── colors.ts           # Color constants
├── constants.ts        # Application constants
├── navigationConfig.ts # Navigation configuration
lib/                   # Library utilities
├── utils.ts            # Utility functions
types/                  # TypeScript type definitions
├── global.d.ts         # Global type declarations
```

## 📱 PWA Capabilities

The application includes full PWA functionality:
- Installable on mobile devices and desktops
- Works offline with cached content
- Push notification support
- Native-like experience
- Fast loading and smooth interactions

## 🎯 Available Pages

- `/` - Home/Login page
- `/login` - User authentication
- `/admin/dashboard` - Admin dashboard
- `/admin/slums` - Admin slum management
- `/admin/users` - Admin user management
- `/supervisor/dashboard` - Supervisor dashboard
- `/supervisor/slums` - Supervisor slum management
- `/supervisor/assignments` - Assignment creation
- `/supervisor/progress` - Progress tracking
- `/surveyor/dashboard` - Surveyor dashboard
- `/surveyor/slums` - Surveyor slum list
- `/surveyor/slum-survey/[id]` - Slum survey form
- `/surveyor/household-survey/[id]` - Household survey form

## 🧪 Testing

Run the frontend tests:
```bash
npm run test
```

## 🚀 Building for Production

Create a production build:
```bash
npm run build
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:5000/api |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ©️ License

This project is licensed under the MIT License.