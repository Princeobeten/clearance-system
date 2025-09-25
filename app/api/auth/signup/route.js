import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();
    
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // If user is a student, validate student-specific fields
    if (userData.role === 'student') {
      if (!userData.matricNumber || !userData.faculty || !userData.department || !userData.level) {
        return NextResponse.json(
          { success: false, error: 'Matric number, faculty, department, and level are required for students' },
          { status: 400 }
        );
      }
      
      // Check if matric number already exists
      const existingMatric = await User.findOne({ matricNumber: userData.matricNumber });
      
      if (existingMatric) {
        return NextResponse.json(
          { success: false, error: 'Matric number already in use' },
          { status: 400 }
        );
      }
    }
    
    // If user is staff, validate department
    if (userData.role === 'staff' && !userData.departmentId) {
      return NextResponse.json(
        { success: false, error: 'Department is required for staff' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User(userData);
    await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Prepare user object without password
    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      token
    };
    
    if (user.role === 'student') {
      userObj.matricNumber = user.matricNumber;
      userObj.faculty = user.faculty;
      userObj.department = user.department;
      userObj.level = user.level;
    }
    
    return NextResponse.json({
      success: true,
      user: userObj
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
