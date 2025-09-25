'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import useClearance from '@/hooks/useClearance';
import AuthCheck from '@/app/components/AuthCheck';
import Navigation from '@/app/components/Navigation';
import toast from 'react-hot-toast';

export default function ClearancePage() {
  const { user } = useApp();
  const { requestClearance, trackClearance, generateCertificate } = useClearance();
  
  const [clearanceData, setClearanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await trackClearance();
        if (result.success) {
          setClearanceData(result);
        }
      } catch (error) {
        console.error('Clearance tracking error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleRequestClearance = async () => {
    setSubmitting(true);
    try {
      const result = await requestClearance();
      
      if (result.success) {
        toast.success('Clearance request submitted successfully!');
        setClearanceData({
          clearanceRequest: result.clearanceRequest,
          clearanceItems: result.clearanceItems,
          departments: [] // Will be populated on next fetch
        });
      } else {
        toast.error(result.error || 'Failed to submit clearance request');
      }
    } catch (error) {
      console.error('Clearance request error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateCertificate = async () => {
    setGeneratingCertificate(true);
    try {
      const result = await generateCertificate();
      
      if (result.success) {
        toast.success('Certificate generated successfully!');
        // In a real system, we would download or display the certificate
        // For MVP, we'll just show a success message
      } else {
        toast.error(result.error || 'Failed to generate certificate');
      }
    } catch (error) {
      console.error('Certificate generation error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-yellow-600';
    }
  };

  return (
    <AuthCheck allowedRoles={['student']}>
      <div className="min-h-screen bg-main-bg">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">Clearance Management</h1>
            
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
              </div>
            ) : !clearanceData?.clearanceRequest ? (
              <div className="bg-primary rounded-lg shadow p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Start Your Clearance Process</h2>
                <p className="mb-6">
                  Click the button below to initiate your final year clearance process.
                  This will create clearance requests for all required departments.
                </p>
                <button
                  onClick={handleRequestClearance}
                  disabled={submitting}
                  className="bg-cta hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Request Clearance'}
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-primary rounded-lg shadow p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Clearance Status</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-900 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Status</h3>
                      <p className="text-2xl font-bold capitalize">{clearanceData.clearanceRequest.status}</p>
                    </div>
                    <div className="bg-blue-900 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Completed</h3>
                      <p className="text-2xl font-bold">{clearanceData.clearanceRequest.completedDepartments.length}</p>
                    </div>
                    <div className="bg-blue-900 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Pending</h3>
                      <p className="text-2xl font-bold">{clearanceData.clearanceRequest.pendingDepartments.length}</p>
                    </div>
                    <div className="bg-blue-900 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Rejected</h3>
                      <p className="text-2xl font-bold">{clearanceData.clearanceRequest.rejectedDepartments.length}</p>
                    </div>
                  </div>
                  
                  {clearanceData.clearanceRequest.status === 'completed' && (
                    <button
                      onClick={handleGenerateCertificate}
                      disabled={generatingCertificate}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                      {generatingCertificate ? 'Generating...' : 'Generate Certificate'}
                    </button>
                  )}
                </div>
                
                <div className="bg-primary rounded-lg shadow overflow-hidden">
                  <h2 className="text-xl font-semibold p-6">Department Clearance Status</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Department
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Remarks
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {clearanceData.clearanceItems?.map((item) => {
                          const department = clearanceData.departments?.find(
                            (dept) => dept._id === item.departmentId
                          );
                          
                          return (
                            <tr key={item._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {department?.name || 'Unknown Department'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)} text-white`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {item.remarks || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthCheck>
  );
}
