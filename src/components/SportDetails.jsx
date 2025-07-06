import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function SportDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [sport, setSport] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sport details
        const sportResponse = await fetch(`/api/sports/slug/${slug}`);
        const sportData = await sportResponse.json();
        setSport(sportData);

        // Fetch matches for this sport
        const matchesResponse = await fetch(`/api/matches/${slug}`);
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Sport not found</h1>
        <button
          onClick={() => navigate('/sports')}
          className="mt-4 rounded bg-gray-600 text-white font-semibold py-2 px-4 hover:bg-gray-800"
        >
          ← Back
        </button>
      </div>
    );
  }

  // Split into ongoing and completed
  const ongoingGames = matches.filter((game) => game.status !== 'Completed');
  const completedGames = matches.filter((game) => game.status === 'Completed');

  // Move these to top of the page
  const sortedGames = [...ongoingGames, ...completedGames];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 relative">
      <button
        onClick={() => navigate('/sports')}
        className="sticky top-6 left-0 z-20 inline-flex items-center gap-2 mb-2 px-5 py-2 rounded-full bg-white border border-gray-300 shadow hover:bg-yellow-300 hover:text-black transition font-semibold text-gray-700"
        style={{ marginLeft: '-1.5rem' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Sports
      </button>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{sport.title} Games</h1>
      
      {sortedGames.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No matches found for this sport.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {sortedGames.map((game) => {
            if (slug === 'chess') {
              const { white, black } = game.teams;
              const result = game.result;

              let winner = null;
              if (game.status === 'Completed' && result) {
                if (result === '1-0') winner = white;
                else if (result === '0-1') winner = black;
                else if (result === '½-½') winner = 'Draw';
              }

              // Card color classes for chess
              const isCompleted = game.status === 'Completed';
              const cardBg = isCompleted
                ? "bg-gradient-to-br from-green-100 to-white border-green-200"
                : "bg-gradient-to-br from-yellow-50 to-white border-yellow-100";

              return (
                <div
                  key={game.slug}
                  className={`block p-5 rounded-2xl shadow-lg ${cardBg} border space-y-2 flex flex-col items-center text-center`}
                >
                  <div className="flex flex-col items-center mb-2">
                    <div className="text-lg font-bold">{white}</div>
                    <div className="mx-2 text-gray-500 font-normal">vs</div>
                    <div className="text-lg font-bold">{black}</div>
                  </div>
                  <div className="mb-1 text-base font-semibold">
                    {game.status === 'Completed' && result
                      ? `Result: ${result}`
                      : `Moves so far: ${game.moves}`}
                  </div>
                  {game.status === 'Completed' && winner && (
                    <div className="text-green-700 font-bold mb-1">
                      Winner: {winner}
                    </div>
                  )}
                  <div className="text-gray-600 text-sm mb-2">Date: {game.date}</div>
                  <span
                    className={`text-xs font-bold rounded-full px-3 py-1 ${
                      game.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {game.status === 'Completed' ? 'Completed' : 'Live'}
                  </span>
                </div>
              );
            }

            if (slug === 'kabaddi') {
              const { home, away } = game.teams;
              const { home: homeScore, away: awayScore } = game.scores || {};
              const isCompleted = game.status === 'Completed';
              const winner = isCompleted && homeScore !== undefined && awayScore !== undefined && homeScore !== awayScore
                ? homeScore > awayScore
                  ? home
                  : away
                : homeScore === awayScore
                  ? 'Draw'
                  : null;

              // Card color classes
              const cardBg = isCompleted
                ? "bg-gradient-to-br from-pink-100 to-white border-pink-200"
                : "bg-gradient-to-br from-yellow-100 to-white border-yellow-200";

              return (
                <Link
                  to={`/sports/${slug}/${game.slug}`}
                  key={game.slug}
                  className={`block p-5 rounded-2xl shadow-lg ${cardBg} border space-y-2 transition hover:scale-[1.02] hover:bg-opacity-90 flex flex-col items-center text-center`}
                >
                  <div className="text-lg font-bold mb-1">
                    {home} <span className="mx-2 text-gray-500 font-normal">vs</span> {away}
                  </div>
                  <div className="text-3xl font-extrabold mb-1">
                    {homeScore ?? '-'} <span className="text-xl font-bold text-gray-500">:</span> {awayScore ?? '-'}
                  </div>
                  {isCompleted ? (
                    winner && (
                      <div className="text-green-700 font-bold mb-1">
                        Winner: {winner}
                      </div>
                    )
                  ) : null}
                  <div className="text-gray-600 text-sm mb-2">Date: {game.date}</div>
                  <span
                    className={`text-xs font-bold rounded-full px-3 py-1 ${
                      game.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {game.status === 'Completed' ? 'Completed' : 'Live'}
                  </span>
                </Link>
              );
            }

            // Cricket-specific card
            if (slug === 'cricket') {
              const { home, away } = game.teams;
              const { home: homeScore, away: awayScore } = game.scores;
              const isCompleted = game.status === 'Completed';
              const winner = isCompleted && homeScore !== awayScore
                ? homeScore > awayScore
                  ? home
                  : away
                : homeScore === awayScore
                  ? 'Draw'
                  : null;

              // Card color classes
              const cardBg = isCompleted
                ? "bg-gradient-to-br from-blue-100 to-white border-blue-200"
                : "bg-gradient-to-br from-yellow-100 to-white border-yellow-200";

              return (
                <Link
                  to={`/sports/${slug}/${game.slug}`}
                  key={game.slug}
                  className={`block p-5 rounded-2xl shadow-lg ${cardBg} border space-y-2 transition hover:scale-[1.02] hover:bg-opacity-90 flex flex-col items-center text-center`}
                >
                  <div className="text-lg font-bold mb-1">
                    {home} <span className="mx-2 text-gray-500 font-normal">vs</span> {away}
                  </div>
                  <div className="text-3xl font-extrabold mb-1">
                    {homeScore ?? '-'} <span className="text-xl font-bold text-gray-500">:</span> {awayScore ?? '-'}
                  </div>
                  {isCompleted ? (
                    winner && (
                      <div className="text-green-700 font-bold mb-1">
                        Winner: {winner}
                      </div>
                    )
                  ) : null}
                  <div className="text-gray-600 text-sm mb-2">Date: {game.date}</div>
                  <span
                    className={`text-xs font-bold rounded-full px-3 py-1 ${
                      game.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {game.status === 'Completed' ? 'Completed' : 'Live'}
                  </span>
                </Link>
              );
            }

            // Default card for other sports
            const { home, away } = game.teams;
            const { home: homeScore, away: awayScore } = game.scores || {};
            const isCompleted = game.status === 'Completed';
            const winner = isCompleted && homeScore !== undefined && awayScore !== undefined && homeScore !== awayScore
              ? homeScore > awayScore
                ? home
                : away
              : homeScore === awayScore
                ? 'Draw'
                : null;

            // Card color classes
            const cardBg = isCompleted
              ? "bg-gradient-to-br from-green-100 to-white border-green-200"
              : "bg-gradient-to-br from-yellow-100 to-white border-yellow-200";

            return (
              <Link
                to={`/sports/${slug}/${game.slug}`}
                key={game.slug}
                className={`block p-5 rounded-2xl shadow-lg ${cardBg} border space-y-2 transition hover:scale-[1.02] hover:bg-opacity-90 flex flex-col items-center text-center`}
              >
                <div className="text-lg font-bold mb-1">
                  {home} <span className="mx-2 text-gray-500 font-normal">vs</span> {away}
                </div>
                <div className="text-3xl font-extrabold mb-1">
                  {homeScore ?? '-'} <span className="text-xl font-bold text-gray-500">:</span> {awayScore ?? '-'}
                </div>
                {isCompleted ? (
                  winner && (
                    <div className="text-green-700 font-bold mb-1">
                      Winner: {winner}
                    </div>
                  )
                ) : null}
                <div className="text-gray-600 text-sm mb-2">Date: {game.date}</div>
                <span
                  className={`text-xs font-bold rounded-full px-3 py-1 ${
                    game.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {game.status === 'Completed' ? 'Completed' : 'Live'}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
