import React from 'react';

export default function ChessDetails({ match, onBack }) {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 relative">
      <button onClick={onBack} className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-yellow-300">Back</button>
      <h1 className="text-3xl font-bold">{match.match}</h1>
      <div className="bg-gray-100 rounded-lg p-4 shadow">
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <span className="text-blue-900 text-xl font-bold">{match.teams?.white}</span>
            <span className="text-gray-500 font-normal text-lg mx-2">vs</span>
            <span className="text-red-900 text-xl font-bold">{match.teams?.black}</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-800">
            {match.result ?? '-'}
          </div>
          <div className="text-gray-600 mt-2">Moves: {match.moves}</div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 shadow mt-4">
        <h2 className="text-xl font-bold mb-2">Players</h2>
        <div className="flex flex-row gap-4 flex-wrap">
          {match.players?.map((player, idx) => (
            <span
              key={idx}
              className="inline-block bg-blue-50 text-blue-900 rounded-full px-4 py-1 text-sm font-semibold shadow"
            >
              {player}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}