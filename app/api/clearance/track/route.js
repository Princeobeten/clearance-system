import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import Department from '@/models/Department';
import Clearance from '@/models/Clearance';
import ClearanceRequest from '@/models/ClearanceRequest';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
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
    
    // Get clearance request
    const clearanceRequest = await ClearanceRequest.findOne({ studentId });
    
    if (!clearanceRequest) {
      return NextResponse.json(
        { success: false, error: 'No clearance request found' },
        { status: 404 }
      );
    }
    
    // Get all clearance items
    const clearanceItems = await Clearance.find({ studentId });
    
    // Get all departments
    const departments = await Department.find().sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      clearanceRequest,
      clearanceItems,
      departments
    });
    
  } catch (error) {
    console.error('Clearance tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
