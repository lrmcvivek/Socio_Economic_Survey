# Socio-Economic Survey System - Backend

This is the backend API for the Socio-Economic Survey System built with Node.js, Express, and MongoDB. The system manages user authentication, survey data, and provides RESTful APIs for the frontend application.

## 🚀 Features

- **JWT-based Authentication**: Secure user authentication with token-based sessions
- **Role-based Access Control**: ADMIN, SUPERVISOR, and SURVEYOR roles with fine-grained permissions
- **State and District Management**: Hierarchical location data management
- **Slum Management**: Create, update, and manage slum information
- **Survey Assignment System**: Assign slums to surveyors with validation
- **Survey Data Collection**: Store and manage slum and household survey data
- **Data Export**: CSV export functionality for reporting
- **RESTful API Design**: Consistent and predictable API endpoints
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Structured error responses for better debugging

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv
- **Development**: nodemon (for auto-restart during development)

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 📦 Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ses-system

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here_change_in_production
JWT_EXPIRE=7d

# Security
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## 🗄️ Database Setup

1. Ensure MongoDB service is running on your system

2. Seed the database with initial data:
```bash
# Seed default users (admin, supervisor, surveyor)
npm run seed:users

# Seed states and districts
npm run seed:locations
```

Default seeded users:
- Admin: username `admin`, password `admin123`
- Supervisor: username `supervisor`, password `supervisor123`
- Surveyor: username `surveyor`, password `surveyor123`

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Location Management
- `GET /api/locations/states` - Get all states
- `GET /api/locations/districts/:stateId` - Get districts by state

### User Management (Admin only)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Slum Management (Supervisor/Admin only)
- `GET /api/surveys/slums` - Get all slums
- `POST /api/surveys/slums` - Create slum
- `GET /api/surveys/slums/:id` - Get slum by ID
- `PUT /api/surveys/slums/:id` - Update slum
- `DELETE /api/surveys/slums/:id` - Delete slum

### Assignment Management (Supervisor/Admin only)
- `GET /api/surveys/assignments` - Get all assignments
- `POST /api/surveys/assignments` - Create assignment
- `GET /api/surveys/assignments/:id` - Get assignment by ID
- `PUT /api/surveys/assignments/:id` - Update assignment
- `DELETE /api/surveys/assignments/:id` - Delete assignment
- `GET /api/surveys/assignments/my-assigned-slums` - Get current user's assignments

### Survey Operations
- `POST /api/surveys/slum-surveys` - Submit slum survey
- `GET /api/surveys/slum-surveys/:assignmentId` - Get slum survey
- `POST /api/surveys/household-surveys` - Submit household survey
- `GET /api/surveys/household-surveys/:householdId` - Get household survey
- `GET /api/surveys/household-surveys/slum/:slumId` - Get all household surveys for a slum

### Data Export
- `GET /api/export/slums` - Export slum data to CSV
- `GET /api/export/surveys` - Export survey data to CSV
- `GET /api/export/assignments` - Export assignments to CSV

## 🔐 Authentication

All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Tokens are generated upon successful login and expire after 7 days by default (configurable via JWT_EXPIRE).

## 👥 Role-Based Access Control

- **ADMIN**: Full system access, user management, view all data
- **SUPERVISOR**: Slum management, assignment creation, view all survey data
- **SURVEYOR**: Access to assigned surveys only, submit surveys

## 🏗️ Project Structure

```
backend/
├── scripts/                    # Database seeding scripts
│   ├── seed-users.js           # Seed default users
│   └── seed-states-districts.js # Seed states and districts
├── src/
│   ├── app.js                  # Express application setup
│   ├── controllers/            # Business logic controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── locationController.js # State/district management
│   │   ├── userController.js   # User management
│   │   ├── slumController.js   # Slum operations
│   │   └── survey/
│   │       ├── assignmentController.js      # Assignment management
│   │       ├── slumSurveyController.js      # Slum survey operations
│   │       └── householdSurveyController.js # Household survey operations
│   ├── middlewares/            # Custom middleware
│   │   └── auth.js             # Authentication middleware
│   ├── models/                 # Mongoose models
│   │   ├── User.js             # User schema
│   │   ├── State.js            # State schema
│   │   ├── District.js         # District schema
│   │   ├── Slum.js             # Slum schema
│   │   ├── Household.js        # Household schema
│   │   ├── Assignment.js       # Assignment schema
│   │   ├── SlumSurvey.js       # Slum survey schema
│   │   └── HouseholdSurvey.js  # Household survey schema
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js       # Authentication routes
│   │   ├── adminRoutes.js      # Admin routes
│   │   ├── exportRoutes.js     # Export routes
│   │   └── survey/
│   │       └── surveyRoutes.js # Survey-related routes
│   └── utils/                  # Utility functions
│       └── helpers/
│           └── responseHelper.js # Response formatting
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🛡️ Error Handling

API responses follow this standardized structure:
```json
{
  "success": true/false,
  "message": "Description of the operation",
  "data": {}, // Present when success is true
  "error": "Error message" // Present when success is false
}
```

## 🧪 Testing

Run the backend tests:
```bash
npm test
```

## 🚀 Deployment

1. Set NODE_ENV to 'production'
2. Update database connection string for production
3. Change JWT_SECRET to a strong, secure value
4. Update CORS_ORIGIN to production URL
5. Build the application: `npm run build`
6. Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with descriptive messages
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with detailed description

## ©️ License

This project is licensed under the MIT License.