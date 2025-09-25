'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import useDepartments from '@/hooks/useDepartments';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ApprovalDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, hasRole } = useApp();
  const { approveClearance, rejectClearance } = useDepartments();
  
  const [clearance, setClearance] = useState(null);
  const [student, setStudent] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/clearance/detail?id=${id}`);
        const data = await response.json();
        
        if (data.success) {
          setClearance(data.clearance);
          setStudent(data.student);
        } else {
          toast.error(data.error || 'Failed to fetch clearance details');
        }
      } catch (error) {
        console.error('Fetch clearance error:', error);
        toast.error('Failed to fetch clearance details');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('staff')) {
      fetchData();
    }
  }, [id, user, hasRole]);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const result = await approveClearance(id, remarks);
      
      if (result.success) {
        toast.success('Clearance approved successfully!');
        router.push('/dashboard/approvals');
      } else {
        toast.error(result.error || 'Failed to approve clearance');
      }
    } catch (error) {
      console.error('Approve clearance error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error('Remarks are required for rejection');
      return;
    }

    setSubmitting(true);
    try {
      const result = await rejectClearance(id, remarks);
      
      if (result.success) {
        toast.success('Clearance rejected successfully!');
        router.push('/dashboard/approvals');
      } else {
        toast.error(result.error || 'Failed to reject clearance');
      }
    } catch (error) {
      console.error('Reject clearance error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

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
      <h1 className="text-2xl font-bold text-foreground mb-6">Review Clearance</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
        </div>
      ) : (
        <div className="bg-primary rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Student Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {student?.name}</p>
                <p><span className="font-medium">Matric Number:</span> {student?.matricNumber}</p>
                <p><span className="font-medium">Department:</span> {student?.department}</p>
                <p><span className="font-medium">Faculty:</span> {student?.faculty}</p>
                <p><span className="font-medium">Level:</span> {student?.level}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Clearance Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> {clearance?.status}</p>
                <p><span className="font-medium">Date Requested:</span> {new Date(clearance?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Remarks</h2>
            <textarea
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cta bg-gray-800 text-white"
              rows="4"
              placeholder="Enter your remarks here (required for rejection)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={handleReject}
              disabled={submitting || !remarks.trim()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Reject'}
            </button>
            <button
              onClick={() => router.back()}
              disabled={submitting}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
