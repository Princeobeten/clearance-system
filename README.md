# Unicross Online Final-Year Student Clearance System

## Project Overview

The Unicross Online Final-Year Student Clearance System is a web-based platform designed to automate and streamline the final-year clearance process at the University of Cross River State (Unicross). This system replaces the traditional manual, paper-based method—where students physically visit multiple departments (e.g., Library, Bursary, Department, Sports, Student Affairs) for approvals—with a digital workflow. It ensures students fulfill all institutional obligations (e.g., returning books, settling fees, completing academics) before graduation, reducing delays, errors, and administrative burdens.

## How It Works

- **Student Initiation**: A final-year student logs in and submits a clearance request. The system automatically routes the request to relevant departments based on predefined workflows.
- **Departmental Review**: Staff in each department (e.g., Library checks for overdue books, Bursary verifies fees) logs in, reviews the student's records, and approves or rejects with remarks. All actions are logged for audit trails.
- **Real-Time Tracking**: Students view their clearance status on a dashboard, seeing pending/approved departments in real-time. Simulated notifications (UI toasts) alert users of updates.
- **Final Approval and Reporting**: Once all departments approve, the system generates a digital clearance certificate. Admins access an oversight dashboard to monitor requests, generate reports, and manage users.
- **Security and Access**: Role-based authentication ensures students only initiate/track, staff handle approvals for their department, and admins have full oversight.

This MVP focuses on core automation, transparency, and efficiency, making the process faster (from weeks to days) and accessible remotely via any device with internet.

## Features

- **User Authentication**: Role-based access for students, staff, and administrators
- **Clearance Request**: Students can initiate clearance requests
- **Real-time Tracking**: Students can track their clearance status
- **Departmental Approvals**: Staff can review and approve/reject clearance requests
- **Admin Dashboard**: Administrators can manage users, departments, and view reports
- **Notifications**: Real-time notifications using toast messages

## Tech Stack

- **Frontend & Backend**: Next.js (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **State Management**: React Context API
- **UI Framework**: Tailwind CSS
- **Notifications**: React Hot Toast

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/clearance-system.git
cd clearance-system
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following content:
```
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
NEXT_PUBLIC_APP_NAME="Unicross Online Final-Year Student Clearance System"
```

4. Seed the database with initial data
```bash
node scripts/seed.js
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Login Credentials

After seeding the database, you can use the following credentials to log in:

- **Admin**: admin@unicross.edu.ng / admin123
- **Staff**: library@unicross.edu.ng / staff123
- **Student**: john@unicross.edu.ng / student123

### User Roles

1. **Student**
   - Initiate clearance request
   - Track clearance status
   - Generate clearance certificate when all departments approve

2. **Staff**
   - View pending clearance requests for their department
   - Approve or reject clearance requests with remarks

3. **Admin**
   - Manage departments
   - Manage users
   - View reports and statistics

## Project Structure

```
├── /app                  # Next.js app directory (App Router)
│   ├── /api              # API routes
│   │   ├── /auth         # Auth-related routes (login, signup)
│   │   ├── /clearance    # Clearance-related routes (request, track, certificate)
│   │   └── /departments  # Department-related routes (approvals, pending)
│   ├── /components       # Reusable UI components
│   ├── /dashboard        # Dashboard pages
│   │   └── /approvals    # Staff approval pages
│   │   └── /departments  # Department management pages
│   ├── /login            # Login page
│   └── /clearance        # Student clearance pages
├── /context              # Global state management
├── /hooks                # Custom hooks
├── /lib                  # Utility functions
│   └── /utils            # Helper functions
├── /models               # Mongoose models
├── /scripts              # Scripts for seeding data
├── /public               # Static assets
└── dbConnect.js          # MongoDB connection
```

## UI/UX Design

The UI/UX emphasizes a modern, professional dashboard design with a dark theme that prioritizes usability and readability. Key design elements include:

- **Color Scheme**: Dark background (#111827) with primary elements in dark blue-gray (#152345) and CTA buttons in blue (#2563eb)
- **Layout**: Responsive design with sidebar navigation for desktop and hamburger menu for mobile
- **Components**: Cards, tables, and forms with consistent styling
- **Feedback**: Toast notifications for user actions and loading spinners for async operations

## Conclusion

The Unicross Online Final-Year Student Clearance System provides a modern, efficient solution to the traditional paper-based clearance process. By digitizing the workflow, it reduces administrative burden, minimizes errors, and provides transparency to all stakeholders.

This MVP implementation focuses on core functionality while maintaining a professional and user-friendly interface. Future enhancements could include email notifications, document uploads, and integration with other university systems.
models/ (root): Mongoose schemas:
User.js: { email: String, password: String (hashed), role: String ('student'|'staff'|'admin'), name: String, departmentId: ObjectId }.
Clearance.js: { studentId: ObjectId, departmentId: ObjectId, status: String ('pending'|'approved'|'rejected'), remarks: String, createdAt: Date }.
Department.js: { name: String, staffId: ObjectId, clearanceRequirements: Array }.


context/AppContext.tsx: Binds authentication, user state, and DB interactions. Wraps the app in layout.tsx to spread state globally. Integrates with hooks for API calls.
hooks/: Hooks like useAuth.tsx (for login/signup/logout), useClearance.tsx (for initiating/tracking clearance requests), and useDepartments.tsx (for managing approvals) that call API routes via fetch.
app/api/: Serverless API routes using Mongoose for CRUD (e.g., /api/clearance for POST/GET, /api/departments for approval updates).
components/AuthCheck.tsx: Protects routes (e.g., dashboard, clearance pages) by checking auth via context.

MVP Development Plan (Waterfall Methodology)
The MVP will be built in sequential phases, ensuring each step is completed before moving to the next. This plan is detailed and specific, allowing an AI (e.g., Grok) or developers to follow it step-by-step. Use Git for version control, with commits at each sub-task.
Phase 1: Requirements Gathering

Gather and Document Requirements:
Review the document: Core needs include student clearance initiation, departmental approvals (Library, Bursary, Department, Sports, Student Affairs), real-time tracking, and reporting.
Define User Roles:
Student: Initiate request, track status.
Staff: Approve/reject per department.
Admin: Oversight, generate reports/certificates.


List MVP Features (Strictly Core, No Extras):
Authentication: Login/signup/logout with role-based access.
Clearance Request: Student submits request; system assigns to departments.
Tracking: Real-time status dashboard for students.
Approvals: Staff reviews and approves/rejects with remarks.
Dashboard: Modern admin view for all requests, reports, and certificate generation.
Notifications: Simulated UI toasts for status changes.


Define Data Models: As listed in Key Files (User, Clearance, Department).
Tools/Tech Stack: Next.js App Router, Tailwind CSS, Mongoose, react-hot-toast, bcrypt (for passwords).


Output: Create a requirements.md file in the project root summarizing features, roles, and models.

Phase 2: System Design

Design Database Schema:
Use Mongoose to define models in /models/.
Ensure relationships: Clearance links to User (student) and Department.


Design API Routes:
/api/auth/login: POST - Validate credentials, return JWT.
/api/auth/signup: POST - Create user (admin-only for staff).
/api/clearance/request: POST - Student initiates clearance.
/api/clearance/track: GET - Fetch status by student ID.
/api/departments/approve: POST - Staff approves/rejects with remarks.
/api/clearance/report: GET - Admin fetches reports.
/api/clearance/certificate: POST - Generate certificate if all approved.


Design UI Components and Pages:
Components: ClearanceCard (status display), ApprovalForm (staff input), StatusTable (dashboard list).
Pages: /login (simple form), /clearance (student view), /dashboard (staff/admin view with grids/cards).
Layout: Dark-themed modern dashboard with sidebar navigation.


Color Scheme Integration:
Text: #ffffff (white) - All text for high contrast.
Foreground: #152345 (dark blue-gray) - Inputs (border-[#152345]), cards (bg-[#152345]).
CTA: #2563eb (blue) - Buttons (bg-[#2563eb] hover:bg-[#1d4ed8]).
Main Background: #111827 (dark gray) - Body (bg-[#111827]).
Update tailwind.config.js:module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#152345',  // Foreground
        cta: '#2563eb',      // CTA
        background: '#111827', // Main background
      },
    },
  },
};




Output: Create wireframes (e.g., via Figma or sketches) and a design.md file detailing API endpoints, component props, and page flows.

Phase 3: Implementation

Setup Project:
Run npx create-next-app@latest (use App Router).
Install deps: npm install mongoose react-hot-toast bcrypt.
Configure Tailwind: Add color extensions as above.
Add dbConnect.js (standard Mongoose connection).


Implement Database and Models:
Create /models/User.js, /models/Clearance.js, /models/Department.js with schemas.
Seed initial data: Pre-populate departments (Library, Bursary, etc.) via a script in /scripts/seed.js.


Implement Authentication:
Build useAuth.tsx hook: Async functions for login/signup/logout using fetch to API.
Create /api/auth routes: Use bcrypt for hashing, JWT for tokens (store in localStorage).
Add AppContext.tsx: Manage user state, isAuthenticated.
Build /login page: Form with inputs (border-primary text-white), submit button (bg-cta).
Add AuthCheck component: Redirect unauthenticated users.


Implement Clearance Features:
Build useClearance.tsx hook: requestClearance (POST to API), trackClearance (GET status).
Create /api/clearance routes: Handle requests, status updates.
Build /clearance page: Student form to initiate (bg-background text-white), status cards (bg-primary text-white).


Implement Departmental Approvals:
Build useDepartments.tsx hook: approveClearance (POST with remarks).
Create /api/departments routes: Update clearance status.
Integrate in /dashboard: List pending requests in a table (bg-primary text-white), approval form (border-primary).


Implement Reporting and Certificate:
Add generateReport, generateCertificate to useClearance.tsx.
Create /api/clearance/report and /api/clearance/certificate routes: Fetch data, generate PDF-like output (use html-to-pdf or simple text for MVP).
Add to /dashboard: Report buttons (bg-cta), certificate viewer component.


Implement Notifications:
Use react-hot-toast: On status change, show toasts (e.g., "Clearance Approved!" with custom styles matching scheme).


Polish UI:
Apply color scheme globally: Body bg-background text-white, cards/inputs bg-primary border-primary, buttons bg-cta.
Dashboard: Sidebar (bg-primary text-white), grid cards (grid-cols-1 md:grid-cols-3 gap-4), subtle transitions (transition-all).



Phase 4: Testing

Unit Testing: Test hooks (e.g., useAuth) with Jest: Mock fetch, check states.
Integration Testing: Test API routes with supertest: Validate responses, errors.
UI/Functional Testing: Manual browser tests: Login as student (initiate request), staff (approve), admin (report). Check real-time updates via context.
Error Handling: Implement try-catch in hooks/APIs, log errors, return user-friendly messages (e.g., toast "Invalid Credentials").
Security Checks: Role-based access (e.g., students can't approve).
Output: Fix bugs, add a tests.md summarizing coverage.

Phase 5: Deployment

Deploy to Vercel: Connect Git repo, set env vars (MONGODB_URI).
Test deployed version: Ensure API/DB connections work.
Pilot Prep: Seed test users/departments for demo.

UI/UX Design Details

Modern Dashboard Focus: The /dashboard is the system's centerpiece—a cool, modern interface with a dark theme for professionalism. Use grids/tables for data display (bg-primary text-white), interactive elements with hover effects (hover:bg-cta/80), and real-time updates via context polling (e.g., fetch status every 30s).
Color Scheme: As specified, integrated throughout for consistency and visual appeal.
Best Practices: Responsive design, loading states, error toasts. Use system defaults for fonts to ensure compatibility.

Goal
Follow this plan to deliver a ready MVP: A secure, automated clearance system with a modern dashboard, deployable for pilot testing. This blueprint ensures AI or devs can build it efficiently.
For questions, reference the project document. Contribute via PRs.