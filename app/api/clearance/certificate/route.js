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
    
    // Get clearance request
    const clearanceRequest = await ClearanceRequest.findOne({ studentId });
    
    if (!clearanceRequest) {
      return NextResponse.json(
        { success: false, error: 'No clearance request found' },
        { status: 404 }
      );
    }
    
    // Check if all departments have approved
    const clearanceItems = await Clearance.find({ studentId });
    const allDepartments = await Department.find();
    
    if (clearanceItems.length !== allDepartments.length) {
      return NextResponse.json(
        { success: false, error: 'Clearance not complete for all departments' },
        { status: 400 }
      );
    }
    
    const pendingOrRejected = clearanceItems.some(item => item.status !== 'approved');
    
    if (pendingOrRejected) {
      return NextResponse.json(
        { success: false, error: 'Clearance not approved by all departments' },
        { status: 400 }
      );
    }
    
    // Generate certificate (in a real system, this would create a PDF)
    // For MVP, we'll just update the clearance request
    clearanceRequest.certificateGenerated = true;
    clearanceRequest.certificateUrl = `/certificates/${studentId}.pdf`; // Mock URL
    clearanceRequest.status = 'completed';
    clearanceRequest.completedAt = new Date();
    
    await clearanceRequest.save();
    
    return NextResponse.json({
      success: true,
      certificateUrl: clearanceRequest.certificateUrl
    });
    
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
