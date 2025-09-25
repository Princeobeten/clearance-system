'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Signup() {
  const router = useRouter();
  const { signup, isAuthenticated } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    matricNumber: '',
    faculty: '',
    department: '',
    level: '400',
    departmentId: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Fetch departments for staff signup
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        const data = await response.json();
        
        if (data.success) {
          setDepartments(data.departments || []);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Validate role-specific fields
    if (formData.role === 'student') {
      if (!formData.matricNumber || !formData.faculty || !formData.department || !formData.level) {
        toast.error('All student fields are required');
        return;
      }
    } else if (formData.role === 'staff') {
      if (!formData.departmentId) {
        toast.error('Please select a department');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword from data sent to API
      const { confirmPassword, ...signupData } = formData;
      
      const result = await signup(signupData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-main-bg">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-foreground">
            Unicross Online Clearance System
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-foreground">
            Create your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Basic Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-primary text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            
            {/* Student-specific fields */}
            {formData.role === 'student' && (
              <>
                <div>
                  <label htmlFor="matricNumber" className="block text-sm font-medium text-foreground mb-1">
                    Matric Number
                  </label>
                  <input
                    id="matricNumber"
                    name="matricNumber"
                    type="text"
                    className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                    placeholder="e.g., UNI/2020/001"
                    value={formData.matricNumber}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="faculty" className="block text-sm font-medium text-foreground mb-1">
                    Faculty
                  </label>
                  <input
                    id="faculty"
                    name="faculty"
                    type="text"
                    className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                    placeholder="e.g., Science"
                    value={formData.faculty}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1">
                    Department
                  </label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-foreground mb-1">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    className="appearance-none relative block w-full px-3 py-2 border border-primary text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                    value={formData.level}
                    onChange={handleChange}
                  >
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
              </>
            )}
            
            {/* Staff-specific fields */}
            {formData.role === 'staff' && (
              <div>
                <label htmlFor="departmentId" className="block text-sm font-medium text-foreground mb-1">
                  Department
                </label>
                <select
                  id="departmentId"
                  name="departmentId"
                  className="appearance-none relative block w-full px-3 py-2 border border-primary text-foreground rounded-md focus:outline-none focus:ring-cta focus:border-cta sm:text-sm bg-primary"
                  value={formData.departmentId}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cta hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta"
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-cta hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
