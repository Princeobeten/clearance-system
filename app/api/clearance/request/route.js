import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import Department from '@/models/Department';
import Clearance from '@/models/Clearance';
import ClearanceRequest from '@/models/ClearanceRequest';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { studentId } = await request.json();
    
    // Validate input
    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }
    
    // Check if student exists
    const student = await User.findById(studentId);
    
    if (!student || student.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }
    
    // Check if clearance request already exists
    let clearanceRequest = await ClearanceRequest.findOne({ studentId });
    
    if (clearanceRequest) {
      return NextResponse.json(
        { success: false, error: 'Clearance request already exists' },
        { status: 400 }
      );
    }
    
    // Get all departments
    const departments = await Department.find().sort({ order: 1 });
    
    if (!departments.length) {
      return NextResponse.json(
        { success: false, error: 'No departments found' },
        { status: 400 }
      );
    }
    
    // Create clearance request
    clearanceRequest = new ClearanceRequest({
      studentId,
      status: 'in-progress',
      pendingDepartments: departments.map(dept => dept._id),
      completedDepartments: [],
      rejectedDepartments: []
    });
    
    await clearanceRequest.save();
    
    // Create clearance items for each department
    const clearanceItems = [];
    
    for (const department of departments) {
      const clearance = new Clearance({
        studentId,
        departmentId: department._id,
        status: 'pending'
      });
      
      await clearance.save();
      clearanceItems.push(clearance);
    }
    
    return NextResponse.json({
      success: true,
      clearanceRequest,
      clearanceItems
    });
    
  } catch (error) {
    console.error('Clearance request error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
