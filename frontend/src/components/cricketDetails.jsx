import React, { useState } from 'react';

export default function CricketDetails({ match, onBack }) {
  const [activeTeam, setActiveTeam] = useState('team1'); 
  const [allPlayersTeam, setAllPlayersTeam] = useState('team1'); 

  const getPlayers = (team) =>
    team === 'team1'
      ? match.details.team1Players || []
      : match.details.team2Players || [];

  const getBatsmanStats = (player, team) =>
    (match.topBatsmen || []).find((b) => b.name === player.name);
  const getBowlerStats = (player, team) =>
    (match.topBowlers || []).find((b) => b.name === player.name);

  return (
    <div className="px-1 pt-4 pb-4 sm:p-8 max-w-3xl mx-auto space-y-6 relative">
      <h1 className="text-3xl sm:text-4xl font-bold">{match.match}</h1>
      <div className="bg-gray-100 rounded-lg p-4 shadow">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 items-center w-full max-w-xs mb-2">
            <span className="text-blue-900 text-lg sm:text-xl font-bold text-right">{match.teams?.team1}</span>
            <span className="text-center text-gray-500 font-normal text-base sm:text-lg">vs</span>
            <span className="text-red-900 text-lg sm:text-xl font-bold text-left">{match.teams?.team2}</span>
          </div>
          <div className="grid grid-cols-3 items-center w-full max-w-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 text-right">
              {match.scores?.team1 ?? '-'}
              {match.wickets?.team1 !== undefined && (
                <span className="text-base font-semibold text-gray-700">/{match.wickets.team1}</span>
              )}
            </span>
            <span className="text-lg sm:text-xl font-bold text-gray-500 text-center">:</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-red-900 text-left">
              {match.scores?.team2 ?? '-'}
              {match.wickets?.team2 !== undefined && (
                <span className="text-base font-semibold text-gray-700">/{match.wickets.team2}</span>
              )}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center w-full max-w-xs mt-1">
            <span className="text-blue-900 text-sm text-right">
              {match.overs?.team1 !== undefined && `Overs: ${match.overs.team1}`}
            </span>
            <span />
            <span className="text-red-900 text-sm text-left">
              {match.overs?.team2 !== undefined && `Overs: ${match.overs.team2}`}
            </span>
          </div>
          {match.scores?.team1 !== undefined && match.scores?.team2 !== undefined && match.overs?.team1 !== undefined && match.overs?.team2 !== undefined && (
            (() => {
              const team1Score = Number(match.scores.team1);
              const team2Score = Number(match.scores.team2);
              const team2Overs = Number(match.overs.team2);
              const totalOvers = match.totalOvers ? Number(match.totalOvers) : 50; 
              if (team2Overs > 0 && team2Overs < totalOvers && team1Score > 0) {
                const runsRequired = team1Score - team2Score + 1;
                const ballsBowled = Math.floor(team2Overs) * 6 + Math.round((team2Overs % 1) * 10);
                const ballsLeft = totalOvers * 6 - ballsBowled;
                const oversLeft = (ballsLeft / 6).toFixed(1);
                return (
                  <div className="mt-2 text-center text-base font-semibold text-yellow-700 border-t border-yellow-200 pt-2">
                    {runsRequired > 0
                      ? `Required: ${runsRequired} runs in ${ballsLeft} balls (${oversLeft} overs)`
                      : `Chase completed`}
                  </div>
                );
              }
              return null;
            })()
          )}
          {match.status === 'completed' && match.result && (
            <div className="mt-4 text-center text-lg font-bold text-green-700 border-t border-green-200 pt-2">
              {match.result}
            </div>
          )}
        </div>
      </div>

      {(getPlayers('team1').length > 0 || getPlayers('team2').length > 0) && (
        <div className="bg-gray-100 rounded-lg p-4 shadow mt-4">
          <div className="flex gap-4 justify-center mb-4 sm:hidden">
            <button
              className={`font-bold px-4 py-1 rounded-full text-xl transition ${
                activeTeam === 'team1'
                  ? 'bg-blue-100 text-blue-900 shadow'
                  : 'bg-gray-200 text-gray-600'
              }`}
              onClick={() => setActiveTeam('team1')}
            >
              {match.teams?.team1}
            </button>
            <button
              className={`font-bold px-4 py-1 rounded-full text-xl transition ${
                activeTeam === 'team2'
                  ? 'bg-red-100 text-red-900 shadow'
                  : 'bg-gray-200 text-gray-600'
              }`}
              onClick={() => setActiveTeam('team2')}
            >
              {match.teams?.team2}
            </button>
          </div>
          {/* Mobile */}
          <div className="block sm:hidden">
            <div className="font-semibold mb-2 text-xl text-center"></div>
            <div className="flex flex-col gap-4 w-full">
              {/* Batters */}
              <div>
                <h3 className={`text-base font-bold mb-1 text-center ${activeTeam === 'team1' ? 'text-blue-900' : 'text-red-900'}`}>Batters</h3>
                {getPlayers(activeTeam)
                  .filter(p => p.role === 'Batsman' || p.role === 'All-rounder' || p.role === 'Wicket Keeper')
                  .map((player, idx) => {
                    const stats = getBatsmanStats(player, activeTeam);
                    return (
                      <div key={idx} className="flex items-center w-full">
                        <span className={`flex-1 border-b py-2 text-base font-semibold opacity-80 text-left ${activeTeam === 'team1' ? 'border-blue-100 text-blue-900' : 'border-red-100 text-red-900'}`}>
                          {player.name}
                        </span>
                        <span className="ml-2 text-gray-700 whitespace-nowrap text-sm text-right">
                          {stats ? `${stats.runs} (${stats.balls} balls)` : 'Yet to bat'}
                        </span>
                      </div>
                    );
                  })}
              </div>
              {/* Bowlers */}
              <div>
                <h3 className={`text-base font-bold mb-1 text-center ${activeTeam === 'team1' ? 'text-red-900' : 'text-blue-900'}`}>Bowlers</h3>
                {getPlayers(activeTeam === 'team1' ? 'team2' : 'team1')
                  .filter(p => p.role === 'Bowler' || p.role === 'All-rounder')
                  .map((player, idx) => {
                    const stats = getBowlerStats(player, activeTeam === 'team1' ? 'team2' : 'team1');
                    return (
                      <div key={idx} className="flex items-center w-full">
                        <span className={`flex-1 border-b py-2 text-base font-semibold opacity-80 text-left ${activeTeam === 'team1' ? 'border-red-100 text-red-900' : 'border-blue-100 text-blue-900'}`}>
                          {player.name}
                        </span>
                        <span className="ml-2 text-gray-700 whitespace-nowrap text-sm text-right">
                          {stats ? `${stats.wickets} wickets, ${stats.runs} runs` : 'Yet to bowl'}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* Desktop */}
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-x-8">
            {/* Team1 */}
            <div>
              {/* Batters */}
              <h3 className="text-base font-bold text-blue-900 mb-1 text-right">Batters</h3>
              <div className="flex flex-col gap-2 items-end w-full mb-3">
                {getPlayers('team1')
                  .filter(p => p.role === 'Batsman' || p.role === 'All-rounder' || p.role === 'Wicket Keeper')
                  .map((player, idx) => {
                    const stats = getBatsmanStats(player, 'team1');
                    return (
                      <div key={idx} className="flex items-center w-full">
                        <span className="flex-1 text-gray-700 text-sm text-right pr-4">
                          {stats ? `${stats.runs} (${stats.balls} balls)` : 'Yet to bat'}
                        </span>
                        <span className="border-b border-blue-100 text-blue-900 py-2 text-base font-semibold opacity-80 min-w-[120px] text-left pl-4">
                          {player.name}
                        </span>
                      </div>
                    );
                  })}
              </div>
              {/* Bowlers (from team2, swap color) */}
              <h3 className="text-base font-bold text-red-900 mb-1 text-right">Bowlers</h3>
              <div className="flex flex-col gap-2 items-end w-full">
                {getPlayers('team2')
                  .filter(p => p.role === 'Bowler' || p.role === 'All-rounder')
                  .map((player, idx) => {
                    const stats = getBowlerStats(player, 'team2');
                    return (
                      <div key={idx} className="flex items-center w-full">
                        <span className="flex-1 text-gray-700 text-sm text-right pr-4">
                          {stats ? `${stats.wickets} wickets, ${stats.runs} runs` : 'Yet to bowl'}
                        </span>
                        <span className="border-b border-red-100 text-red-900 py-2 text-base font-semibold opacity-80 min-w-[120px] text-left pl-4">
                          {player.name}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
            {/* Team2 */}
            <div>
              {/* Batters */}
              <h3 className="text-base font-bold text-red-900 mb-1 text-left">Batters</h3>
              <div className="flex flex-col gap-2 items-start w-full mb-3">
                {getPlayers('team2')
                  .filter(p => p.role === 'Batsman' || p.role === 'All-rounder' || p.role === 'Wicket Keeper')
                  .map((player, idx) => {
                    const stats = getBatsmanStats(player, 'team2');
                    return (
                      <div key={idx} className="flex items-center w-full">
                        <span className="border-b border-red-100 text-red-900 py-2 text-base font-semibold opacity-80 min-w-[120px] text-left pr-4">
                          {player.name}
                        </span>
                        <span className="flex-1 text-gray-700 text-sm text-left pl-4">
                          {stats ? `${stats.runs} (${stats.balls} balls)` : 'Yet to bat'}
                        </span>
                      </div>
                    );
                  })}
              </div>
              {/* Bowlers (from team1, swap color) */}
              <h3 className="text-base font-bold text-blue-900 mb-1 text-left">Bowlers</h3>
              <div className="flex flex-col gap-2 items-start w-full">
                {getPlayers('team1')
                  .filter(p => p.role === 'Bowler' || p.role === 'All-rounder')
                  .map((player, idx) => {
                    const stats = getBowlerStats(player, 'team1');
                    return (
                      <div key={idx} className="flex items-center w-full">
                        <span className="border-b border-blue-100 text-blue-900 py-2 text-base font-semibold opacity-80 min-w-[120px] text-left pr-4">
                          {player.name}
                        </span>
                        <span className="flex-1 text-gray-700 text-sm text-left pl-4">
                          {stats ? `${stats.wickets} wickets, ${stats.runs} runs` : 'Yet to bowl'}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Players */}
      {(getPlayers('team1').length > 0 || getPlayers('team2').length > 0) && (
        <div className="bg-white rounded-lg p-4 shadow mt-4">
          <h2 className="text-xl font-bold mb-4 text-center">All Players</h2>
          <div className="flex gap-4 justify-center mb-4 sm:hidden">
            <button
              className={`font-bold px-4 py-1 rounded-full text-lg transition ${
                allPlayersTeam === 'team1'
                  ? 'bg-blue-100 text-blue-900 shadow'
                  : 'bg-gray-200 text-gray-600'
              }`}
              onClick={() => setAllPlayersTeam('team1')}
            >
              {match.teams?.team1}
            </button>
            <button
              className={`font-bold px-4 py-1 rounded-full text-lg transition ${
                allPlayersTeam === 'team2'
                  ? 'bg-red-100 text-red-900 shadow'
                  : 'bg-gray-200 text-gray-600'
              }`}
              onClick={() => setAllPlayersTeam('team2')}
            >
              {match.teams?.team2}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mx-auto">
            {/* Team 1 */}
            <div className="flex-1">
              <h3 className="text-base font-bold text-blue-900 mb-2 text-center">{match.teams?.team1}</h3>
              <div className="flex flex-col gap-2">
                {(window.innerWidth < 640 ? allPlayersTeam === 'team1' : true) &&
                  getPlayers('team1').map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-blue-100 py-2 px-2 text-blue-900"
                    >
                      <span className="font-semibold">{player.name}</span>
                      <span className="text-xs text-gray-500">{player.role}</span>
                    </div>
                  ))}
              </div>
            </div>
            {/* Team 2 */}
            <div className="flex-1">
              <h3 className="text-base font-bold text-red-900 mb-2 text-center">{match.teams?.team2}</h3>
              <div className="flex flex-col gap-2">
                {(window.innerWidth < 640 ? allPlayersTeam === 'team2' : true) &&
                  getPlayers('team2').map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-red-100 py-2 px-2 text-red-900"
                    >
                      <span className="font-semibold">{player.name}</span>
                      <span className="text-xs text-gray-500">{player.role}</span>
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