import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSports() {
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [activeTab, setActiveTab] = useState('join_sport'); // join_sport, normal_sport, event
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    slug: '',
    type: 'join_sport',
    category: 'Outdoor',
    description: '',
    image: '',
    date: '',
    venue: '',
    registerLink: '',
    moreDetailsLink: '',
    minPlayers: 1,
    maxPlayers: null,
    arrivalTime: '',
    fixture: '',
    gameTiming: '',
    registrationDeadline: '',
    registrationFee: 0,
    eventType: 'other',
    organizer: '',
    contactInfo: '',
    status: 'upcoming'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch both sports and events
      const [sportsResponse, eventsResponse] = await Promise.all([
        fetch('/api/sports'),
        fetch('/api/events')
      ]);
      
      if (sportsResponse.ok) {
        const sportsData = await sportsResponse.json();
        setSports(sportsData);
      }
      
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    await fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Determine the correct API endpoint based on the type
      let url, method, requestData;
      
      if (activeTab === 'event') {
        // Transform data for Event model
        requestData = {
          title: formData.name || formData.title,
          date: formData.date,
          venue: formData.venue,
          description: formData.description,
          imageUrl: formData.image,
          registrationLink: formData.registerLink,
          category: formData.eventType === 'workshop' ? 'Technology' : 'Cultural',
          status: formData.status || 'upcoming',
          eventType: formData.eventType,
          organizer: formData.organizer,
          contactInfo: formData.contactInfo
        };
        
        url = editingSport 
          ? `/api/events/${editingSport._id}`
          : '/api/events';
      } else {
        // Use original data for Sport model
        requestData = formData;
        url = editingSport 
          ? `/api/sports/${editingSport._id}`
          : '/api/sports';
      }
      
      method = editingSport ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        await fetchSports();
        setShowForm(false);
        setEditingSport(null);
        resetForm();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save sport');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sport) => {
    setEditingSport(sport);
    setFormData({
      name: sport.name,
      title: sport.title,
      slug: sport.slug,
      type: sport.type,
      category: sport.category,
      description: sport.description,
      image: sport.image,
      date: sport.date,
      venue: sport.venue,
      registerLink: sport.registerLink,
      moreDetailsLink: sport.moreDetailsLink,
      minPlayers: sport.minPlayers,
      maxPlayers: sport.maxPlayers,
      arrivalTime: sport.arrivalTime,
      fixture: sport.fixture,
      gameTiming: sport.gameTiming,
      registrationDeadline: sport.registrationDeadline,
      registrationFee: sport.registrationFee,
      eventType: sport.eventType,
      organizer: sport.organizer,
      contactInfo: sport.contactInfo,
      status: sport.status
    });
    setShowForm(true);
  };

  // Helper to get event status based on date
  const getEventStatus = (eventDate) => {
    const now = new Date();
    const date = new Date(eventDate);
    if (date.toDateString() === now.toDateString()) {
      return 'Ongoing';
    } else if (date < now) {
      return 'Completed';
    } else {
      return 'Upcoming';
    }
  };

  const handleDelete = async (itemId) => {
    console.log('Attempting to delete:', itemId, 'Type:', activeTab);
    
    if (!window.confirm(`Are you sure you want to delete this ${activeTab === 'event' ? 'event' : 'sport'}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = activeTab === 'event'
        ? `/api/events/${itemId}`
        : `/api/sports/${itemId}`;
      
      console.log('Delete URL:', url);
      console.log('Token:', token ? 'Present' : 'Missing');

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        console.log('Delete successful, refreshing data...');
        await fetchData();
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        setError(`Failed to delete ${activeTab === 'event' ? 'event' : 'sport'}: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete network error:', error);
      setError('Network error: ' + error.message);
    }
  };

  const resetForm = () => {
    const baseForm = {
      name: '',
      title: '',
      slug: '',
      type: activeTab,
      description: '',
      image: '',
      date: '',
      venue: '',
      status: 'upcoming'
    };

    // Add type-specific fields
    if (activeTab === 'join_sport') {
      setFormData({
        ...baseForm,
        category: 'Outdoor',
        registerLink: '',
        moreDetailsLink: '',
        minPlayers: 1,
        maxPlayers: null,
        registrationDeadline: '',
        registrationFee: 0
      });
    } else if (activeTab === 'normal_sport') {
      setFormData({
        ...baseForm,
        category: 'Outdoor',
        minPlayers: 1,
        arrivalTime: '',
        fixture: '',
        gameTiming: '',
        moreDetailsLink: ''
      });
    } else if (activeTab === 'event') {
      setFormData({
        ...baseForm,
        eventType: 'other',
        organizer: '',
        contactInfo: '',
        registerLink: '',
        registrationFee: 0,
        registrationDeadline: ''
      });
    }
  };

  const filteredSports = activeTab === 'event' 
    ? events.map(event => ({
        ...event,
        name: event.title,
        type: 'event'
      }))
    : sports.filter(sport => sport.type === activeTab);

  const getTypeLabel = (type) => {
    switch (type) {
      case 'join_sport': return 'Join Sports (Registration)';
      case 'normal_sport': return 'Regular Sports';
      case 'event': return 'Events';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sports Management</h1>
              <p className="text-gray-600">Manage Join Sports, Regular Sports, and Events - Add, Edit, Delete</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/games')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Manage Games
              </button>
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

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['join_sport', 'normal_sport', 'event'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    resetForm();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {getTypeLabel(tab)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Add Sport Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingSport(null);
              resetForm();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add New {activeTab === 'event' ? 'Event' : activeTab === 'join_sport' ? 'Join Sport' : 'Sport'}
          </button>
        </div>

        {/* Sport Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSport ? `Edit ${activeTab === 'event' ? 'Event' : 'Sport'}` : `Add New ${activeTab === 'event' ? 'Event' : activeTab === 'join_sport' ? 'Join Sport' : 'Sport'}`}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common Fields for All Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Venue</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Join Sports Specific Fields */}
                {activeTab === 'join_sport' && (
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Join Sports Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Outdoor">Outdoor</option>
                          <option value="Indoor">Indoor</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Min Players</label>
                        <input
                          type="number"
                          name="minPlayers"
                          value={formData.minPlayers}
                          onChange={handleInputChange}
                          min="1"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Players</label>
                        <input
                          type="number"
                          name="maxPlayers"
                          value={formData.maxPlayers || ''}
                          onChange={handleInputChange}
                          min="1"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                        <input
                          type="date"
                          name="registrationDeadline"
                          value={formData.registrationDeadline || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Fee</label>
                        <input
                          type="number"
                          name="registrationFee"
                          value={formData.registrationFee}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Link</label>
                        <input
                          type="url"
                          name="registerLink"
                          value={formData.registerLink || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Normal Sports Specific Fields */}
                {activeTab === 'normal_sport' && (
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Normal Sports Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Outdoor">Outdoor</option>
                          <option value="Indoor">Indoor</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Min Players</label>
                        <input
                          type="number"
                          name="minPlayers"
                          value={formData.minPlayers}
                          onChange={handleInputChange}
                          min="1"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Game Timing</label>
                        <input
                          type="text"
                          name="gameTiming"
                          value={formData.gameTiming || ''}
                          onChange={handleInputChange}
                          placeholder="e.g., 2:00 PM - 4:00 PM"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
                        <input
                          type="text"
                          name="arrivalTime"
                          value={formData.arrivalTime || ''}
                          onChange={handleInputChange}
                          placeholder="e.g., 1:30 PM"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fixture</label>
                        <input
                          type="text"
                          name="fixture"
                          value={formData.fixture || ''}
                          onChange={handleInputChange}
                          placeholder="e.g., Team A vs Team B"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">More Details Link</label>
                        <input
                          type="url"
                          name="moreDetailsLink"
                          value={formData.moreDetailsLink || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Specific Fields */}
                {activeTab === 'event' && (
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Event Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Event Type</label>
                        <select
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="exhibition">Exhibition</option>
                          <option value="workshop">Workshop</option>
                          <option value="competition">Competition</option>
                          <option value="seminar">Seminar</option>
                          <option value="conference">Conference</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Organizer</label>
                        <input
                          type="text"
                          name="organizer"
                          value={formData.organizer || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                        <input
                          type="text"
                          name="contactInfo"
                          value={formData.contactInfo || ''}
                          onChange={handleInputChange}
                          placeholder="Phone or Email"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Link</label>
                        <input
                          type="url"
                          name="registerLink"
                          value={formData.registerLink || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Fee</label>
                        <input
                          type="number"
                          name="registrationFee"
                          value={formData.registrationFee}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                        <input
                          type="date"
                          name="registrationDeadline"
                          value={formData.registrationDeadline || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingSport ? `Update ${activeTab === 'event' ? 'Event' : 'Sport'}` : `Add ${activeTab === 'event' ? 'Event' : activeTab === 'join_sport' ? 'Join Sport' : 'Sport'}`)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSport(null);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sports List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {getTypeLabel(activeTab)} ({filteredSports.length})
            </h3>
            
            {filteredSports.length === 0 ? (
              <p className="text-gray-500">No {getTypeLabel(activeTab).toLowerCase()} found. Add your first one!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      {(activeTab === 'join_sport' || activeTab === 'normal_sport') && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {activeTab === 'join_sport' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration
                        </th>
                      )}
                      {activeTab === 'normal_sport' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Players
                        </th>
                      )}
                      {activeTab === 'event' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event Type
                        </th>
                      )}
                      {activeTab === 'event' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organizer
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSports.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {item.name}
                          <div className="text-xs text-gray-500 font-normal">{item.title}</div>
                        </td>
                        {(activeTab === 'join_sport' || activeTab === 'normal_sport') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.venue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {activeTab === 'event' ? getEventStatus(item.date) : item.status}
                        </td>
                        {activeTab === 'join_sport' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.registrationDeadline || 'N/A'}</td>
                        )}
                        {activeTab === 'normal_sport' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.minPlayers || 'N/A'}</td>
                        )}
                        {activeTab === 'event' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.eventType || 'N/A'}</td>
                        )}
                        {activeTab === 'event' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.organizer || 'N/A'}</td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            className="text-blue-600 hover:underline mr-4"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleDelete(item._id)}
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
      </div>
    </div>
  );
} 