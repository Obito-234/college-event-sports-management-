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
          Authorization: `Bearer ${token}`,
        },
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
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((u) => u._id !== userId));
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold text-gray-700 animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 pt-20"> 
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow z-50"> 
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user.username}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
              Role: {user.role === 'main_admin' ? 'Main Admin' : 'Sport Admin'}
            </span>
            <Link
              to="/"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8"> 
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Join Sports',
                desc: 'Manage sports with registration',
                bgColor: 'bg-blue-600',
                hoverColor: 'hover:bg-blue-700',
                textColor: 'text-blue-100',
                to: '/admin/sports',
              },
              {
                title: 'Manage Sports',
                desc: 'Add, remove & update sports',
                bgColor: 'bg-green-600',
                hoverColor: 'hover:bg-green-700',
                textColor: 'text-green-100',
                to: '/admin/sports',
              },
              {
                title: 'Manage Games',
                desc: 'Add, edit, or delete matches',
                bgColor: 'bg-orange-600',
                hoverColor: 'hover:bg-orange-700',
                textColor: 'text-orange-100',
                to: '/admin/games',
              },
              {
                title: 'Events',
                desc: 'Manage tournaments & events',
                bgColor: 'bg-purple-600',
                hoverColor: 'hover:bg-purple-700',
                textColor: 'text-purple-100',
                to: '/admin/sports',
              }
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className={`${item.bgColor} ${item.hoverColor} text-white rounded-xl p-5 transition`}
              >
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className={`${item.textColor} text-sm`}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>



        {/* Main Admin Section */}
        {user.role === 'main_admin' && (
          <section className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              User Management ({users.length} users)
            </h3>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found. Only the main admin exists.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white text-sm border">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-6 py-3 border-b">User</th>
                      <th className="px-6 py-3 border-b">Role</th>
                      <th className="px-6 py-3 border-b">Status</th>
                      <th className="px-6 py-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 border-b">
                          <div className="font-medium text-gray-800">{u.username}</div>
                          <div className="text-gray-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 border-b">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              u.role === 'main_admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {u.role === 'main_admin' ? 'Main Admin' : 'Sport Admin'}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              u.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-red-600 hover:text-red-800"
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
          </section>
        )}

        {/* Sport Admin Section */}
        {user.role === 'sport_admin' && (
          <section className="bg-white p-6 mt-10 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Assigned Sports</h3>
            {user.sportNames?.length ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {user.sportNames.map((sport, i) => (
                  <li key={i}>{sport}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No sports assigned yet.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
