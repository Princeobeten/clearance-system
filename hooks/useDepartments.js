'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function useDepartments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useApp();

  const getDepartments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/departments', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch departments');
      }

      return { success: true, departments: data.departments };
    } catch (error) {
      console.error('Fetch departments error:', error);
      setError(error.message || 'An error occurred while fetching departments');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getPendingClearances = async () => {
    if (!user || user.role !== 'staff') {
      setError('User not authenticated or not authorized');
      return { success: false, error: 'User not authenticated or not authorized' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/departments/pending?departmentId=${user.departmentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch pending clearances');
      }

      return { success: true, clearances: data.clearances };
    } catch (error) {
      console.error('Fetch pending clearances error:', error);
      setError(error.message || 'An error occurred while fetching pending clearances');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const approveClearance = async (clearanceId, remarks = '') => {
    if (!user || user.role !== 'staff') {
      setError('User not authenticated or not authorized');
      return { success: false, error: 'User not authenticated or not authorized' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/departments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clearanceId, 
          remarks, 
          staffId: user._id,
          departmentId: user.departmentId,
          status: 'approved'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve clearance');
      }

      return { success: true, clearance: data.clearance };
    } catch (error) {
      console.error('Approve clearance error:', error);
      setError(error.message || 'An error occurred while approving clearance');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const rejectClearance = async (clearanceId, remarks) => {
    if (!user || user.role !== 'staff') {
      setError('User not authenticated or not authorized');
      return { success: false, error: 'User not authenticated or not authorized' };
    }

    if (!remarks) {
      setError('Remarks are required for rejection');
      return { success: false, error: 'Remarks are required for rejection' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/departments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clearanceId, 
          remarks, 
          staffId: user._id,
          departmentId: user.departmentId,
          status: 'rejected'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject clearance');
      }

      return { success: true, clearance: data.clearance };
    } catch (error) {
      console.error('Reject clearance error:', error);
      setError(error.message || 'An error occurred while rejecting clearance');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    getDepartments,
    getPendingClearances,
    approveClearance,
    rejectClearance,
    loading,
    error,
  };
}
