import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import Department from '@/models/Department';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all users
    const users = await User.find().sort({ role: 1, name: 1 }).lean();
    
    // Get all departments for mapping
    const departments = await Department.find().lean();
    const departmentMap = {};
    departments.forEach(dept => {
      departmentMap[dept._id] = dept.name;
    });
    
    // Add department names to staff users
    const usersWithDepartments = users.map(user => {
      if (user.role === 'staff' && user.departmentId) {
        return {
          ...user,
          departmentName: departmentMap[user.departmentId] || 'Unknown Department'
        };
      }
      return user;
    });
    
    return NextResponse.json({
      success: true,
      users: usersWithDepartments
    });
    
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
