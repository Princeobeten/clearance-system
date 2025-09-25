import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import Department from '@/models/Department';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const departments = await Department.find().sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      departments
    });
    
  } catch (error) {
    console.error('Fetch departments error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const departmentData = await request.json();
    
    // Validate required fields
    if (!departmentData.name) {
      return NextResponse.json(
        { success: false, error: 'Department name is required' },
        { status: 400 }
      );
    }
    
    // Check if department already exists
    const existingDepartment = await Department.findOne({ name: departmentData.name });
    
    if (existingDepartment) {
      return NextResponse.json(
        { success: false, error: 'Department already exists' },
        { status: 400 }
      );
    }
    
    // If staffId is provided, check if staff exists
    if (departmentData.staffId) {
      const staff = await User.findById(departmentData.staffId);
      
      if (!staff || staff.role !== 'staff') {
        return NextResponse.json(
          { success: false, error: 'Invalid staff ID' },
          { status: 400 }
        );
      }
    }
    
    // Create new department
    const department = new Department(departmentData);
    await department.save();
    
    return NextResponse.json({
      success: true,
      department
    });
    
  } catch (error) {
    console.error('Create department error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
