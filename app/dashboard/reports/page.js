'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { user, hasRole } = useApp();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalStudents: 0,
    totalClearanceRequests: 0,
    completedClearances: 0,
    pendingClearances: 0,
    rejectedClearances: 0,
    departmentStats: []
  });
  const [clearanceList, setClearanceList] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, pending, rejected

  useEffect(() => {
    const fetchReportData = async () => {
      if (!user || !hasRole('admin')) return;
      
      setLoading(true);
      try {
        // Fetch report data
        const response = await fetch('/api/reports/summary');
        const data = await response.json();
        
        if (data.success) {
          setReportData(data.reportData);
        } else {
          toast.error(data.error || 'Failed to fetch report data');
        }
        
        // Fetch clearance list
        const clearanceResponse = await fetch('/api/reports/clearances');
        const clearanceData = await clearanceResponse.json();
        
        if (clearanceData.success) {
          setClearanceList(clearanceData.clearances);
        } else {
          toast.error(clearanceData.error || 'Failed to fetch clearance list');
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [user, hasRole]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredClearances = clearanceList.filter(clearance => {
    if (filter === 'all') return true;
    return clearance.status === filter;
  });

  const handleGenerateReport = async (format) => {
    try {
      toast.success(`Generating ${format.toUpperCase()} report...`);
      // In a real implementation, this would generate and download a report
      // For MVP, we'll just show a success message
      setTimeout(() => {
        toast.success(`${format.toUpperCase()} report generated successfully!`);
      }, 1500);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  if (!hasRole('admin')) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleGenerateReport('pdf')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleGenerateReport('csv')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Export CSV
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Total Students</h3>
              <p className="text-3xl font-bold">{reportData.totalStudents}</p>
            </div>
            <div className="bg-primary rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Total Clearances</h3>
              <p className="text-3xl font-bold">{reportData.totalClearanceRequests}</p>
            </div>
            <div className="bg-green-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Completed</h3>
              <p className="text-3xl font-bold">{reportData.completedClearances}</p>
            </div>
            <div className="bg-yellow-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Pending</h3>
              <p className="text-3xl font-bold">{reportData.pendingClearances}</p>
            </div>
          </div>
          
          {/* Department Stats */}
          <div className="bg-primary rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Department Statistics</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total Requests
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Approved
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rejected
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Pending
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {reportData.departmentStats.map((dept, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{dept.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{dept.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{dept.approved}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{dept.rejected}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{dept.pending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Clearance List */}
          <div className="bg-primary rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Clearance Requests</h2>
              <select
                value={filter}
                onChange={handleFilterChange}
                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cta"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
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
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date Requested
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredClearances.map((clearance, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{clearance.student?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{clearance.student?.matricNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{clearance.student?.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          clearance.status === 'completed' ? 'bg-green-600' : 
                          clearance.status === 'rejected' ? 'bg-red-600' : 
                          'bg-yellow-600'
                        } text-white`}>
                          {clearance.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(clearance.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {clearance.completedAt ? new Date(clearance.completedAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                  {filteredClearances.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm">
                        No clearance requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
