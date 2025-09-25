'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import useDepartments from '@/hooks/useDepartments';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ApprovalsPage() {
  const { user, hasRole } = useApp();
  const { getPendingClearances } = useDepartments();
  
  const [pendingClearances, setPendingClearances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getPendingClearances();
        if (result.success) {
          setPendingClearances(result.clearances);
        } else {
          toast.error(result.error || 'Failed to fetch pending clearances');
        }
      } catch (error) {
        console.error('Fetch pending clearances error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('staff')) {
      fetchData();
    }
  }, [user, hasRole]);

  if (!hasRole('staff')) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Pending Approvals</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
        </div>
      ) : (
        <div className="bg-primary rounded-lg shadow overflow-hidden">
          {pendingClearances.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Matric Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date Requested
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {pendingClearances.map((clearance) => (
                    <tr key={clearance._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {clearance.student?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {clearance.student?.matricNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {clearance.student?.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {clearance.student?.faculty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(clearance.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link 
                          href={`/dashboard/approvals/${clearance._id}`}
                          className="bg-cta hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p>No pending approvals found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
