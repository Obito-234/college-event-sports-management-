import React, { useState } from 'react';

export default function BasketballDetails({ match }) {
  const [activeTeam, setActiveTeam] = useState('home');

  const homePlayers = match.details?.homePlayers || [];
  const awayPlayers = match.details?.awayPlayers || [];

  return (
    <div className="px-1 pt-4 pb-4 sm:p-8 max-w-3xl mx-auto space-y-6 relative">
      <h1 className="text-3xl sm:text-4xl font-bold">{match.match}</h1>
      {/* Match info below the title */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-2 text-gray-700 text-base">
        <div className="flex flex-row justify-between items-center w-full">
          <span className="flex flex-col">
            <span>
              Sport: <span className="font-semibold text-blue-700">{match.sportName || 'Basketball'}</span>
            </span>
            <span className="hidden sm:inline">
              Date: <span className="font-semibold">{match.date}</span>
            </span>
          </span>
          <span
            className={
              "ml-auto " +
              (match.status === "Completed"
                ? "bg-green-100 text-green-700"
                : match.status === "Ongoing"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-700") +
              " font-semibold rounded-full px-4 py-1 text-sm shadow"
            }
          >
            {match.status}
          </span>
        </div>
        <span className="sm:hidden">
          Date: <span className="font-semibold">{match.date}</span>
        </span>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 shadow">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 items-center w-full mb-2">
            <span className="text-blue-900 text-lg sm:text-xl font-bold text-right">{match.teams?.home}</span>
            <span className="text-center text-gray-500 font-normal text-base sm:text-lg">vs</span>
            <span className="text-red-900 text-lg sm:text-xl font-bold text-left">{match.teams?.away}</span>
          </div>
          <div className="grid grid-cols-3 items-center w-full">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 text-right">{match.scores?.home ?? '-'}</span>
            <span className="text-lg sm:text-xl font-bold text-gray-500 text-center">:</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-red-900 text-left">{match.scores?.away ?? '-'}</span>
          </div>
        </div>
      </div>
      {/* Quarters as separate cards */}
      {Array.isArray(match.quarters) && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
          {match.quarters.map((q, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow flex flex-col items-center py-2"
            >
              <span className="font-semibold text-gray-700 mb-1">Q{i + 1}</span>
              <span>
                <span className="text-blue-900 font-bold">{q.home}</span>
                <span className="mx-1 text-gray-500">-</span>
                <span className="text-red-900 font-bold">{q.away}</span>
              </span>
            </div>
          ))}
        </div>
      )}
      {(homePlayers.length > 0 && awayPlayers.length > 0) && (
        <div className="bg-gray-100 rounded-lg p-4 shadow mt-4">
          <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">Players</h2>
          {/* Mobile: show only one team at a time, Desktop: show both columns */}
          <div className="block sm:hidden">
            <div className="flex gap-4 justify-center mb-4">
              <button
                className={`font-bold px-4 py-1 rounded-full text-xl transition ${
                  activeTeam === 'home'
                    ? 'bg-blue-100 text-blue-900 shadow'
                    : 'bg-gray-200 text-gray-600'
                }`}
                onClick={() => setActiveTeam('home')}
              >
                {match.teams?.home}
              </button>
              <button
                className={`font-bold px-4 py-1 rounded-full text-xl transition ${
                  activeTeam === 'away'
                    ? 'bg-red-100 text-red-900 shadow'
                    : 'bg-gray-200 text-gray-600'
                }`}
                onClick={() => setActiveTeam('away')}
              >
                {match.teams?.away}
              </button>
            </div>
            <div>
              {activeTeam === 'home' && (
                <div className="flex flex-col gap-2 w-full">
                  {homePlayers.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center w-full"
                    >
                      <span className="flex-1 border-b border-blue-100 text-blue-900 py-2 text-base font-semibold opacity-80">
                        {player.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {activeTeam === 'away' && (
                <div className="flex flex-col gap-2 w-full">
                  {awayPlayers.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center w-full"
                    >
                      <span className="flex-1 border-b border-red-100 text-red-900 py-2 text-base font-semibold opacity-80">
                        {player.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Desktop: show both teams side by side */}
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-x-8">
            <div>
              <div className="font-semibold text-blue-900 mb-2 text-right text-xl">{match.teams?.home}</div>
              <div className="flex flex-col gap-2 items-end w-full">
                {homePlayers.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center w-full"
                  >
                    <span className="flex-1 border-b border-blue-100 text-blue-900 py-2 text-base font-semibold opacity-80 text-right">
                      {player.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-900 mb-2 text-left text-xl">{match.teams?.away}</div>
              <div className="flex flex-col gap-2 items-start w-full">
                {awayPlayers.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center w-full"
                  >
                    <span className="flex-1 border-b border-red-100 text-red-900 py-2 text-base font-semibold opacity-80 text-left">
                      {player.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}