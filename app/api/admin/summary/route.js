import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import Department from '@/models/Department';
import ClearanceRequest from '@/models/ClearanceRequest';

export async function GET() {
  try {
    await dbConnect();
    
    // Count users by role
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    // Count departments
    const totalDepartments = await Department.countDocuments();
    
    // Count clearance requests
    const totalClearances = await ClearanceRequest.countDocuments();
    const completedClearances = await ClearanceRequest.countDocuments({ status: 'completed' });
    const pendingClearances = await ClearanceRequest.countDocuments({ status: 'in-progress' });
    const rejectedClearances = await ClearanceRequest.countDocuments({ status: 'rejected' });
    
    // Get recent activity (last 5 clearance requests)
    const recentActivity = await ClearanceRequest.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('studentId', 'name matricNumber')
      .lean();
    
    return NextResponse.json({
      success: true,
      summary: {
        users: {
          total: totalUsers,
          students: totalStudents,
          staff: totalStaff,
          admins: totalAdmins
        },
        departments: totalDepartments,
        clearances: {
          total: totalClearances,
          completed: completedClearances,
          pending: pendingClearances,
          rejected: rejectedClearances
        },
        recentActivity
      }
    });
    
  } catch (error) {
    console.error('Admin summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
