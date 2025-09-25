'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import useClearance from '@/hooks/useClearance';
import useDepartments from '@/hooks/useDepartments';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, hasRole } = useApp();
  const { trackClearance } = useClearance();
  const { getPendingClearances } = useDepartments();
  
  const [clearanceData, setClearanceData] = useState(null);
  const [pendingClearances, setPendingClearances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (hasRole('student')) {
          const result = await trackClearance();
          if (result.success) {
            setClearanceData(result);
          } else {
            toast.error(result.error || 'Failed to fetch clearance data');
          }
        } else if (hasRole('staff')) {
          const result = await getPendingClearances();
          if (result.success) {
            setPendingClearances(result.clearances);
          } else {
            toast.error(result.error || 'Failed to fetch pending clearances');
          }
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, hasRole]);

  // Student Dashboard
  if (hasRole('student')) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Student Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
          </div>
        ) : clearanceData?.clearanceRequest ? (
          <div className="bg-primary rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Clearance Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Status</h3>
                <p className="text-2xl font-bold">{clearanceData.clearanceRequest.status}</p>
              </div>
              <div className="bg-blue-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Completed</h3>
                <p className="text-2xl font-bold">{clearanceData.clearanceRequest.completedDepartments.length} / {clearanceData.departments?.length || 0}</p>
              </div>
              <div className="bg-blue-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Pending</h3>
                <p className="text-2xl font-bold">{clearanceData.clearanceRequest.pendingDepartments.length}</p>
              </div>
            </div>
            
            <Link href="/clearance" className="bg-cta hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View Details
            </Link>
          </div>
        ) : (
          <div className="bg-primary rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No Clearance Request Found</h2>
            <p className="mb-6">You haven't initiated a clearance request yet.</p>
            <Link href="/clearance" className="bg-cta hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start Clearance Process
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Staff Dashboard
  if (hasRole('staff')) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Staff Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
          </div>
        ) : (
          <div className="bg-primary rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
            
            {pendingClearances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Matric Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {pendingClearances.map((clearance) => (
                      <tr key={clearance._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{clearance.student?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{clearance.student?.matricNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{clearance.student?.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(clearance.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link href={`/dashboard/approvals/${clearance._id}`} className="bg-cta hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4">No pending approvals</p>
            )}
            
            <div className="mt-6">
              <Link href="/dashboard/approvals" className="bg-cta hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View All
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin Dashboard
  if (hasRole('admin')) {
    const [adminData, setAdminData] = useState({
      users: { total: 0, students: 0, staff: 0, admins: 0 },
      departments: 0,
      clearances: { total: 0, completed: 0, pending: 0, rejected: 0 },
      recentActivity: []
    });
    const [adminLoading, setAdminLoading] = useState(true);

    useEffect(() => {
      const fetchAdminData = async () => {
        setAdminLoading(true);
        try {
          const response = await fetch('/api/admin/summary');
          const data = await response.json();
          
          if (data.success) {
            setAdminData(data.summary);
          } else {
            toast.error(data.error || 'Failed to fetch admin data');
          }
        } catch (error) {
          console.error('Admin data fetch error:', error);
          toast.error('An unexpected error occurred');
        } finally {
          setAdminLoading(false);
        }
      };

      if (user && hasRole('admin')) {
        fetchAdminData();
      }
    }, [user, hasRole]);

    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Admin Dashboard</h1>
        
        {adminLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-primary rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                <p className="text-4xl font-bold mb-4">{adminData.users.total}</p>
                <div className="flex justify-between text-sm mb-4">
                  <span>Students: {adminData.users.students}</span>
                  <span>Staff: {adminData.users.staff}</span>
                  <span>Admins: {adminData.users.admins}</span>
                </div>
                <Link href="/dashboard/users" className="text-cta hover:underline">
                  Manage Users →
                </Link>
              </div>
              
              <div className="bg-primary rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Departments</h2>
                <p className="text-4xl font-bold mb-4">{adminData.departments}</p>
                <Link href="/dashboard/departments" className="text-cta hover:underline">
                  Manage Departments →
                </Link>
              </div>
              
              <div className="bg-primary rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Clearances</h2>
                <p className="text-4xl font-bold mb-4">{adminData.clearances.total}</p>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-green-500">Completed: {adminData.clearances.completed}</span>
                  <span className="text-yellow-500">Pending: {adminData.clearances.pending}</span>
                  <span className="text-red-500">Rejected: {adminData.clearances.rejected}</span>
                </div>
                <Link href="/dashboard/reports" className="text-cta hover:underline">
                  View Reports →
                </Link>
              </div>
            </div>
            
            <div className="bg-primary rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {adminData.recentActivity && adminData.recentActivity.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {adminData.recentActivity.map((activity) => (
                        <tr key={activity._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {activity.studentId?.name || 'Unknown'} ({activity.studentId?.matricNumber || 'N/A'})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              activity.status === 'completed' ? 'bg-green-600' : 
                              activity.status === 'rejected' ? 'bg-red-600' : 
                              'bg-yellow-600'
                            } text-white`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(activity.updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4">No recent activity</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <p>Welcome to the Unicross Online Clearance System</p>
    </div>
  );
}
