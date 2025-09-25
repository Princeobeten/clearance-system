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
