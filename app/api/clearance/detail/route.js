import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import Clearance from '@/models/Clearance';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const clearanceId = searchParams.get('id');
    
    if (!clearanceId) {
      return NextResponse.json(
        { success: false, error: 'Clearance ID is required' },
        { status: 400 }
      );
    }
    
    // Find the clearance
    const clearance = await Clearance.findById(clearanceId);
    
    if (!clearance) {
      return NextResponse.json(
        { success: false, error: 'Clearance not found' },
        { status: 404 }
      );
    }
    
    // Get student details
    const student = await User.findById(clearance.studentId, 'name email matricNumber faculty department level');
    
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      clearance,
      student
    });
    
  } catch (error) {
    console.error('Clearance detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
