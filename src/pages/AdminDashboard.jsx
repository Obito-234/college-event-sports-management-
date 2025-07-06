import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const userObj = JSON.parse(userData);
    setUser(userObj);

    if (userObj.role === 'main_admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        const errorData = await response.json();
        setError('Failed to fetch users: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId));
      } else {
        const errorData = await response.json();
        setError('Failed to delete user: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Role: {user.role === 'main_admin' ? 'Main Admin' : 'Sport Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/sports"
              className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition"
            >
              <h3 className="text-lg font-semibold">Join Sports</h3>
              <p className="text-blue-100">Manage sports with registration</p>
            </Link>
            
            <Link
              to="/admin/sports"
              className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition"
            >
              <h3 className="text-lg font-semibold">Manage Sports</h3>
              <p className="text-green-100">Add, remove & update sports</p>
            </Link>
            
            <Link
              to="/admin/sports"
              className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition"
            >
              <h3 className="text-lg font-semibold">Events</h3>
              <p className="text-purple-100">Manage tournaments & events</p>
            </Link>
            
            <Link
              to="/admin/games"
              className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition"
            >
              <h3 className="text-lg font-semibold">Manage Games</h3>
              <p className="text-orange-100">Add, edit, or delete matches</p>
            </Link>
          </div>
          
          {/* Additional Actions */}
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/"
                className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition"
              >
                <h3 className="text-lg font-semibold">View Public Site</h3>
                <p className="text-gray-100">Go to public sports page</p>
              </Link>
              
              <Link
                to="/admin/sports"
                className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition"
              >
                <h3 className="text-lg font-semibold">All Sports Overview</h3>
                <p className="text-indigo-100">View all sports in one place</p>
              </Link>
            </div>
          </div>
        </div>

        {/* User Management (Main Admin Only) */}
        {user.role === 'main_admin' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                User Management ({users.length} users)
              </h3>
              
              {users.length === 0 ? (
                <p className="text-gray-500">No users found. Only the main admin exists.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => (
                        <tr key={userItem._id || userItem.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {userItem.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                {userItem.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userItem.role === 'main_admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {userItem.role === 'main_admin' ? 'Main Admin' : 'Sport Admin'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userItem.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {userItem.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteUser(userItem._id || userItem.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sport Admin Info */}
        {user.role === 'sport_admin' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Assigned Sports
              </h3>
              <div className="space-y-2">
                {user.sportNames && user.sportNames.length > 0 ? (
                  user.sportNames.map((sportName, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">{sportName}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No sports assigned yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 