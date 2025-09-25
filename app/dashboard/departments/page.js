'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import useDepartments from '@/hooks/useDepartments';
import toast from 'react-hot-toast';

export default function DepartmentsPage() {
  const { user, hasRole } = useApp();
  const { getDepartments } = useDepartments();
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clearanceRequirements: '',
    order: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getDepartments();
        if (result.success) {
          setDepartments(result.departments);
        } else {
          toast.error(result.error || 'Failed to fetch departments');
        }
      } catch (error) {
        console.error('Fetch departments error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user && hasRole('admin')) {
      fetchData();
    }
  }, [user, hasRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real implementation, we would submit the form data to create a new department
    toast.success('Feature not implemented in MVP');
    setShowForm(false);
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
        <h1 className="text-2xl font-bold text-foreground">Departments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-cta hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showForm ? 'Cancel' : 'Add Department'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-primary rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Department</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cta bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cta bg-gray-800 text-white"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cta bg-gray-800 text-white"
                rows="2"
              ></textarea>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Clearance Requirements (one per line)</label>
              <textarea
                name="clearanceRequirements"
                value={formData.clearanceRequirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cta bg-gray-800 text-white"
                rows="4"
              ></textarea>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-cta hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Department
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
        </div>
      ) : (
        <div className="bg-primary rounded-lg shadow overflow-hidden">
          {departments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Staff Assigned
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {departments.map((department) => (
                    <tr key={department._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {department.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {department.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {department.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {department.staffId ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toast.success('Feature not implemented in MVP')}
                          className="text-cta hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toast.success('Feature not implemented in MVP')}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p>No departments found. Add a department to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
