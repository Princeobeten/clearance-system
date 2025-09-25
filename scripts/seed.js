// This script seeds the database with initial data
// Run with: node scripts/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Define schemas for all models needed
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password should be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    default: 'student'
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  matricNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  faculty: {
    type: String
  },
  department: {
    type: String
  },
  level: {
    type: String,
    enum: ['100', '200', '300', '400', '500', 'PG']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  clearanceRequirements: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ClearanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ClearanceRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'rejected'],
    default: 'pending'
  },
  pendingDepartments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }],
  completedDepartments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }],
  rejectedDepartments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }],
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateUrl: {
    type: String
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index to ensure uniqueness of student-department pairs
ClearanceSchema.index({ studentId: 1, departmentId: 1 }, { unique: true });

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
const Clearance = mongoose.models.Clearance || mongoose.model('Clearance', ClearanceSchema);
const ClearanceRequest = mongoose.models.ClearanceRequest || mongoose.model('ClearanceRequest', ClearanceRequestSchema);

// Seed data
const departments = [
  {
    name: 'Library',
    description: 'University Library',
    clearanceRequirements: [
      'Return all borrowed books',
      'Pay any outstanding fines',
      'Return library card'
    ],
    order: 1
  },
  {
    name: 'Bursary',
    description: 'University Bursary Department',
    clearanceRequirements: [
      'Pay all outstanding fees',
      'Submit fee receipts',
      'Clear any financial obligations'
    ],
    order: 2
  },
  {
    name: 'Department',
    description: 'Academic Department',
    clearanceRequirements: [
      'Submit final project/thesis',
      'Return department properties',
      'Complete exit interview'
    ],
    order: 3
  },
  {
    name: 'Sports',
    description: 'Sports Department',
    clearanceRequirements: [
      'Return sports equipment',
      'Clear sports fee',
      'Return sports ID card'
    ],
    order: 4
  },
  {
    name: 'Student Affairs',
    description: 'Student Affairs Department',
    clearanceRequirements: [
      'Return student ID card',
      'Clear hostel accommodation',
      'Complete exit form'
    ],
    order: 5
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@unicross.edu.ng',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Library Staff',
    email: 'library@unicross.edu.ng',
    password: 'staff123',
    role: 'staff',
    // departmentId will be set after departments are created
  },
  {
    name: 'Bursary Staff',
    email: 'bursary@unicross.edu.ng',
    password: 'staff123',
    role: 'staff',
    // departmentId will be set after departments are created
  },
  {
    name: 'Department Staff',
    email: 'department@unicross.edu.ng',
    password: 'staff123',
    role: 'staff',
    // departmentId will be set after departments are created
  },
  {
    name: 'Sports Staff',
    email: 'sports@unicross.edu.ng',
    password: 'staff123',
    role: 'staff',
    // departmentId will be set after departments are created
  },
  {
    name: 'Student Affairs Staff',
    email: 'studentaffairs@unicross.edu.ng',
    password: 'staff123',
    role: 'staff',
    // departmentId will be set after departments are created
  },
  {
    name: 'John Doe',
    email: 'john@unicross.edu.ng',
    password: 'student123',
    role: 'student',
    matricNumber: 'UNI/2020/001',
    faculty: 'Science',
    department: 'Computer Science',
    level: '400'
  },
  {
    name: 'Jane Smith',
    email: 'jane@unicross.edu.ng',
    password: 'student123',
    role: 'student',
    matricNumber: 'UNI/2020/002',
    faculty: 'Engineering',
    department: 'Electrical Engineering',
    level: '500'
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Clearance.deleteMany({});
    await ClearanceRequest.deleteMany({});
    console.log('Cleared existing data');

    // Create departments
    const createdDepartments = await Department.insertMany(departments);
    console.log(`Created ${createdDepartments.length} departments`);

    // Create department map for easy lookup
    const departmentMap = {};
    createdDepartments.forEach(dept => {
      departmentMap[dept.name] = dept._id;
    });

    // Assign departments to staff
    users.forEach(user => {
      if (user.role === 'staff') {
        // Extract department name from email
        const emailParts = user.email.split('@')[0];
        const departmentName = emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
        if (departmentMap[departmentName]) {
          user.departmentId = departmentMap[departmentName];
        }
      }
    });

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async user => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Update departments with staff IDs
    for (const user of createdUsers) {
      if (user.role === 'staff' && user.departmentId) {
        await Department.findByIdAndUpdate(user.departmentId, { staffId: user._id });
      }
    }
    console.log('Updated departments with staff IDs');

    // Create sample clearance requests and clearance items for demo purposes
    const students = createdUsers.filter(user => user.role === 'student');
    for (const student of students) {
      // Create clearance request for the first student only (John Doe)
      if (student.name === 'John Doe') {
        const clearanceRequest = new ClearanceRequest({
          studentId: student._id,
          status: 'in-progress',
          pendingDepartments: createdDepartments.map(dept => dept._id),
          completedDepartments: [],
          rejectedDepartments: []
        });
        
        await clearanceRequest.save();
        console.log(`Created clearance request for ${student.name}`);
        
        // Create clearance items for each department
        for (const dept of createdDepartments) {
          const clearance = new Clearance({
            studentId: student._id,
            departmentId: dept._id,
            status: 'pending'
          });
          
          await clearance.save();
        }
        console.log(`Created clearance items for ${student.name}`);
      }
    }

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@unicross.edu.ng / admin123');
    console.log('Staff: library@unicross.edu.ng / staff123');
    console.log('Student: john@unicross.edu.ng / student123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
