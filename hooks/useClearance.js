'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function useClearance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useApp();

  const requestClearance = async () => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/clearance/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request clearance');
      }

      return { success: true, clearanceRequest: data.clearanceRequest };
    } catch (error) {
      console.error('Clearance request error:', error);
      setError(error.message || 'An error occurred during clearance request');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const trackClearance = async () => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/clearance/track?studentId=${user._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track clearance');
      }

      return { 
        success: true, 
        clearanceRequest: data.clearanceRequest,
        clearanceItems: data.clearanceItems,
        departments: data.departments
      };
    } catch (error) {
      console.error('Clearance tracking error:', error);
      setError(error.message || 'An error occurred while tracking clearance');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async () => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/clearance/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate certificate');
      }

      return { success: true, certificateUrl: data.certificateUrl };
    } catch (error) {
      console.error('Certificate generation error:', error);
      setError(error.message || 'An error occurred during certificate generation');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    requestClearance,
    trackClearance,
    generateCertificate,
    loading,
    error,
  };
}
