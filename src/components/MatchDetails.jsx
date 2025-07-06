import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FootballDetails from './FootballDetails';
import CricketDetails from './cricketDetails';
import BasketballDetails from './BasketballDetails';
import KabadiDetails from './KabadiDetails';
import VolleyballDetails from './VolleyballDetails';
import ChessDetails from './ChessDetails';

export default function MatchDetails() {
  const { slug, matchSlug } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`/api/matches/${slug}/${matchSlug}`);
        if (response.ok) {
          const matchData = await response.json();
          setMatch(matchData);
        } else {
          setError('Match not found');
        }
      } catch (err) {
        setError('Failed to load match');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [slug, matchSlug]);

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="sticky top-6 left-0 z-20 inline-flex items-center gap-2 mb-2 px-5 py-2 rounded-full bg-white border border-gray-300 shadow hover:bg-yellow-300 hover:text-black transition font-semibold text-gray-700"
          style={{ marginLeft: '-1.5rem' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back 
        </button>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="sticky top-6 left-0 z-20 inline-flex items-center gap-2 mb-2 px-5 py-2 rounded-full bg-white border border-gray-300 shadow hover:bg-yellow-300 hover:text-black transition font-semibold text-gray-700"
          style={{ marginLeft: '-1.5rem' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back 
        </button>
        <h1 className="text-3xl font-bold">Match not found</h1>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="sticky top-6 left-0 z-20 inline-flex items-center gap-2 mb-2 px-5 py-2 rounded-full bg-white border border-gray-300 shadow hover:bg-yellow-300 hover:text-black transition font-semibold text-gray-700"
        style={{ marginLeft: '-1.5rem' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back 
      </button>
      {
        {
          football: <FootballDetails match={match} />,
          cricket: <CricketDetails match={match} />,
          basketball: <BasketballDetails match={match} />,
          kabaddi: <KabadiDetails match={match} />,
          volleyball: <VolleyballDetails match={match} />,
          chess: <ChessDetails match={match} />,
        }[slug] || <div>Sport not supported</div>
      }
    </div>
  );
}
