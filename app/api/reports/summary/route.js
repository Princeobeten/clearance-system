import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import Department from '@/models/Department';
import Clearance from '@/models/Clearance';
import ClearanceRequest from '@/models/ClearanceRequest';

export async function GET() {
  try {
    await dbConnect();
    
    // Count total students
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Count clearance requests
    const totalClearanceRequests = await ClearanceRequest.countDocuments();
    
    // Count completed clearances
    const completedClearances = await ClearanceRequest.countDocuments({ status: 'completed' });
    
    // Count pending clearances
    const pendingClearances = await ClearanceRequest.countDocuments({ status: 'in-progress' });
    
    // Count rejected clearances
    const rejectedClearances = await ClearanceRequest.countDocuments({ status: 'rejected' });
    
    // Get department statistics
    const departments = await Department.find();
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const total = await Clearance.countDocuments({ departmentId: dept._id });
        const approved = await Clearance.countDocuments({ 
          departmentId: dept._id,
          status: 'approved'
        });
        const rejected = await Clearance.countDocuments({ 
          departmentId: dept._id,
          status: 'rejected'
        });
        const pending = await Clearance.countDocuments({ 
          departmentId: dept._id,
          status: 'pending'
        });
        
        return {
          _id: dept._id,
          name: dept.name,
          total,
          approved,
          rejected,
          pending
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      reportData: {
        totalStudents,
        totalClearanceRequests,
        completedClearances,
        pendingClearances,
        rejectedClearances,
        departmentStats
      }
    });
    
  } catch (error) {
    console.error('Report summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
