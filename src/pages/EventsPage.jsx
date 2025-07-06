import React, { useState, useEffect } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

  const getRegistrationStatus = (eventDate) => {
    const now = new Date();
    const date = new Date(eventDate);
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (date < now) {
      return 'Closed';
    } else if (diffDays <= 3) {
      return 'About to Close';
    } else {
      return 'Open';
    }
  };

  return (
    <div className="pt-4 p-8 space-y-6">
      {/* Enhanced Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-blue-200 rounded-full py-2 pl-10 pr-4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <span className="absolute left-3 top-2.5 text-blue-400 pointer-events-none">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-blue-200 rounded-full py-2 px-6 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-700 font-semibold transition"
          >
            <option value="All">All</option>
            <option value="Cultural">Cultural</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event.date);
            const regStatus = getRegistrationStatus(event.date);
            const isPastEvent = status === 'Completed';
            return (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105"
              >
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 rounded-t-lg object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <p className="text-gray-600">{event.date}</p>
                  <p className="text-gray-600 font-semibold">Location: {event.venue}</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                      status === 'Completed'
                        ? 'bg-gray-300 text-gray-700'
                        : status === 'Ongoing'
                        ? 'bg-green-300 text-green-800'
                        : 'bg-yellow-300 text-yellow-800'
                    }`}
                  >
                    {status}
                  </span>
                  <p className="text-gray-700">{event.description}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    {isPastEvent ? (
                      <span className="text-gray-500 font-semibold">Registration Closed</span>
                    ) : (
                      <>
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded bg-blue-600 text-white font-semibold py-2 px-4 hover:bg-blue-700"
                        >
                          Register
                        </a>
                        <span
                          className={`text-sm font-medium ${
                            regStatus === 'Closed'
                              ? 'text-gray-500'
                              : regStatus === 'About to Close'
                              ? 'text-red-500'
                              : 'text-green-600'
                          }`}
                        >
                          {regStatus}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No events found matching your criteria.</p>
      )}
    </div>
  );
}
