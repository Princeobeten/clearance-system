import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import ClearanceRequest from '@/models/ClearanceRequest';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all clearance requests with student details
    const clearanceRequests = await ClearanceRequest.find()
      .sort({ createdAt: -1 })
      .lean();
    
    // Get student details for each clearance request
    const clearancesWithStudents = await Promise.all(
      clearanceRequests.map(async (request) => {
        const student = await User.findById(request.studentId, 'name email matricNumber faculty department level')
          .lean();
        
        return {
          ...request,
          student
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      clearances: clearancesWithStudents
    });
    
  } catch (error) {
    console.error('Clearance list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
