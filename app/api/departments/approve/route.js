import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import Clearance from '@/models/Clearance';
import ClearanceRequest from '@/models/ClearanceRequest';
import User from '@/models/User';
import Department from '@/models/Department';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { clearanceId, remarks, staffId, departmentId, status } = await request.json();
    
    // Validate input
    if (!clearanceId || !staffId || !departmentId || !status) {
      return NextResponse.json(
        { success: false, error: 'Clearance ID, staff ID, department ID, and status are required' },
        { status: 400 }
      );
    }
    
    // Check if status is valid
    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Status must be approved or rejected' },
        { status: 400 }
      );
    }
    
    // If rejecting, remarks are required
    if (status === 'rejected' && !remarks) {
      return NextResponse.json(
        { success: false, error: 'Remarks are required for rejection' },
        { status: 400 }
      );
    }
    
    // Check if staff exists and is authorized
    const staff = await User.findById(staffId);
    
    if (!staff || staff.role !== 'staff') {
      return NextResponse.json(
        { success: false, error: 'Invalid staff ID' },
        { status: 400 }
      );
    }
    
    // Check if department exists and staff belongs to it
    const department = await Department.findById(departmentId);
    
    if (!department) {
      return NextResponse.json(
        { success: false, error: 'Invalid department ID' },
        { status: 400 }
      );
    }
    
    if (staff.departmentId.toString() !== departmentId) {
      return NextResponse.json(
        { success: false, error: 'Staff not authorized for this department' },
        { status: 403 }
      );
    }
    
    // Get the clearance
    const clearance = await Clearance.findById(clearanceId);
    
    if (!clearance) {
      return NextResponse.json(
        { success: false, error: 'Clearance not found' },
        { status: 404 }
      );
    }
    
    // Check if clearance belongs to the department
    if (clearance.departmentId.toString() !== departmentId) {
      return NextResponse.json(
        { success: false, error: 'Clearance not for this department' },
        { status: 400 }
      );
    }
    
    // Update clearance
    clearance.status = status;
    clearance.remarks = remarks;
    clearance.approvedBy = staffId;
    clearance.approvedAt = new Date();
    clearance.updatedAt = new Date();
    
    await clearance.save();
    
    // Update the clearance request
    const clearanceRequest = await ClearanceRequest.findOne({ studentId: clearance.studentId });
    
    if (!clearanceRequest) {
      return NextResponse.json(
        { success: false, error: 'Clearance request not found' },
        { status: 404 }
      );
    }
    
    // Update the appropriate arrays based on status
    if (status === 'approved') {
      clearanceRequest.pendingDepartments = clearanceRequest.pendingDepartments.filter(
        id => id.toString() !== departmentId
      );
      
      if (!clearanceRequest.completedDepartments.includes(departmentId)) {
        clearanceRequest.completedDepartments.push(departmentId);
      }
      
      // Remove from rejected if it was previously rejected
      clearanceRequest.rejectedDepartments = clearanceRequest.rejectedDepartments.filter(
        id => id.toString() !== departmentId
      );
    } else if (status === 'rejected') {
      clearanceRequest.pendingDepartments = clearanceRequest.pendingDepartments.filter(
        id => id.toString() !== departmentId
      );
      
      if (!clearanceRequest.rejectedDepartments.includes(departmentId)) {
        clearanceRequest.rejectedDepartments.push(departmentId);
      }
      
      // Remove from completed if it was previously approved
      clearanceRequest.completedDepartments = clearanceRequest.completedDepartments.filter(
        id => id.toString() !== departmentId
      );
    }
    
    // Update clearance request status
    if (clearanceRequest.pendingDepartments.length === 0) {
      if (clearanceRequest.rejectedDepartments.length === 0) {
        clearanceRequest.status = 'completed';
      } else {
        clearanceRequest.status = 'rejected';
      }
    } else {
      clearanceRequest.status = 'in-progress';
    }
    
    clearanceRequest.updatedAt = new Date();
    
    await clearanceRequest.save();
    
    return NextResponse.json({
      success: true,
      clearance,
      clearanceRequest
    });
    
  } catch (error) {
    console.error('Approve clearance error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
