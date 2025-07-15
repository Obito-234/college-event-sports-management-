import React, { useState, useEffect } from 'react';

export default function JoinSportsPage() {
  const [sportsList, setSportsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sports/upcoming')
      .then(res => res.json())
      .then(data => {
        setSportsList(data);
        setLoading(false);
      })
      .catch(() => {
        setSportsList([]);
        setLoading(false);
      });
  }, []);

  const upcomingSports = sportsList.filter(
    (sport) =>
      sport.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pt-4 p-8 space-y-10 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 drop-shadow mb-4">
          Join Upcoming Sports
        </h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 p-8 space-y-10 max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 drop-shadow mb-4">
        Join Upcoming Sports
      </h1>
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search sports..."
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
      </div>
      {upcomingSports.length > 0 ? (
        <div className="space-y-10">
          {upcomingSports.map((sport) => (
            <div
              key={sport.id}
              className="bg-white rounded-2xl flex flex-col md:flex-row shadow hover:shadow-2xl transition overflow-hidden"
            >
              <div className="relative w-full md:w-1/3 flex-shrink-0">
                <img
                  src={sport.image}
                  alt={sport.title}
                  className="h-full w-full object-cover"
                />
                {/* Right fade for desktop, bottom fade for mobile */}
                <div className="hidden md:block absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white"></div>
                <div className="block md:hidden absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white"></div>
              </div>

              <div className="p-6 flex-1">
                <h2 className="text-2xl font-bold">{sport.title}</h2>
                <p className="text-gray-600">{sport.date}</p>
                <p className="font-semibold text-gray-800">Location: {sport.venue}</p>
                <p className="text-gray-700 mt-2">{sport.description}</p>
                <div className="bg-gray-100 rounded p-3 mt-3 space-y-1 text-gray-800">
                  <p><span className="font-semibold">Minimum Players:</span> {sport.minPlayers}</p>
                  <p><span className="font-semibold">Arrival Time:</span> {sport.arrivalTime}</p>
                  <p><span className="font-semibold">Fixture:</span> {sport.fixture}</p>
                  <p><span className="font-semibold">Game Timing:</span> {sport.gameTiming}</p>
                </div>
                <div className="flex space-x-3 mt-4">
                  <a
                    href={sport.registerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-blue-600 text-white font-semibold py-2 px-4 hover:bg-blue-700"
                  >
                    Register
                  </a>
                  <a
                    href={sport.moreDetailsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-gray-300 text-gray-700 font-semibold py-2 px-4 hover:bg-gray-100"
                  >
                    More Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No upcoming sports events found at the moment!</p>
      )}
    </div>
  );
}
