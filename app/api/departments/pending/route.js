import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import Clearance from '@/models/Clearance';
import User from '@/models/User';
import Department from '@/models/Department';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    
    // Validate input
    if (!departmentId) {
      return NextResponse.json(
        { success: false, error: 'Department ID is required' },
        { status: 400 }
      );
    }
    
    // Check if department exists
    const department = await Department.findById(departmentId);
    
    if (!department) {
      return NextResponse.json(
        { success: false, error: 'Invalid department ID' },
        { status: 400 }
      );
    }
    
    // Get all pending clearances for this department
    const clearances = await Clearance.find({ 
      departmentId, 
      status: 'pending' 
    });
    
    // Get student details for each clearance
    const clearanceWithStudents = await Promise.all(
      clearances.map(async (clearance) => {
        const student = await User.findById(clearance.studentId, 'name email matricNumber faculty department level');
        return {
          ...clearance.toObject(),
          student
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      clearances: clearanceWithStudents
    });
    
  } catch (error) {
    console.error('Fetch pending clearances error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
