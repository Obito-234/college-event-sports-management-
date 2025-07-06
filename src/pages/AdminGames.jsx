import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [localPlayers, setLocalPlayers] = useState({ home: [], away: [] });
  const [modalNewPlayer, setModalNewPlayer] = useState({
    name: '',
    position: '',
    number: '',
    team: 'home'
  });
  const [formData, setFormData] = useState({
    sport: '',
    match: '',
    slug: '',
    teams: { home: '', away: '' },
    scores: { home: 0, away: 0 },
    result: '',
    date: '',
    status: 'Upcoming',
    players: {
      home: [],
      away: []
    }
  });

  const [playerFormData, setPlayerFormData] = useState({
    name: '',
    position: '',
    number: '',
    team: 'home' // 'home' or 'away'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    fetchSports();
    fetchGames();
  }, [navigate]);

  const fetchSports = async () => {
    try {
      const response = await fetch('/api/sports');
      if (response.ok) {
        const data = await response.json();
        setSports(data);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/matches');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      } else {
        setError('Failed to fetch games');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePlayerInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPlayer = () => {
    if (!playerFormData.name || !playerFormData.position) {
      alert('Please fill in player name and position');
      return;
    }

    const newPlayer = {
      id: Date.now(), // Simple ID generation
      name: playerFormData.name,
      position: playerFormData.position,
      number: playerFormData.number || ''
    };

    setFormData(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [playerFormData.team]: [...(prev.players[playerFormData.team] || []), newPlayer]
      }
    }));

    // Reset player form
    setPlayerFormData({
      name: '',
      position: '',
      number: '',
      team: 'home'
    });
  };

  const handleRemovePlayer = (team, playerId) => {
    setFormData(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [team]: prev.players[team].filter(player => player.id !== playerId)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      const token = localStorage.getItem('token');
      const url = editingGame 
        ? `/api/matches/${editingGame._id}`
        : '/api/matches';
      
      const method = editingGame ? 'PUT' : 'POST';

      console.log('Submitting match data:', JSON.stringify(formData, null, 2));
      console.log('Request URL:', url);
      console.log('Request method:', method);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Match saved successfully');
        if (editingGame) {
          // Update the specific game in the list
          const updatedGames = games.map(game => 
            game._id === editingGame._id 
              ? { ...formData, _id: editingGame._id }
              : game
          );
          setGames(updatedGames);
        } else {
          // For new games, fetch the updated list
          await fetchGames();
        }
        
        setShowForm(false);
        setEditingGame(null);
        setFormData({
          sport: '',
          match: '',
          slug: '',
          teams: { home: '', away: '' },
          scores: { home: 0, away: 0 },
          result: '',
          date: '',
          status: 'Upcoming',
          players: { home: [], away: [] }
        });
      } else {
        const data = await response.json();
        console.error('Error response:', data);
        setError(data.message || 'Failed to save game');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      sport: game.sport,
      match: game.match,
      slug: game.slug,
      teams: game.teams || { home: '', away: '' },
      scores: game.scores || { home: 0, away: 0 },
      result: game.result || '',
      date: game.date,
      status: game.status || 'Upcoming',
      players: game.players || { home: [], away: [] }
    });
    setShowForm(true);
  };

  const handleDelete = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/matches/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove the game from the local state
        setGames(prevGames => prevGames.filter(game => game._id !== gameId));
      } else {
        setError('Failed to delete game');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const openPlayerModal = (game) => {
    setSelectedGame(game);
    setLocalPlayers({
      home: game.players?.home || [],
      away: game.players?.away || []
    });
    setModalNewPlayer({
      name: '',
      position: '',
      number: '',
      team: 'home'
    });
    setShowPlayerModal(true);
  };

  const closePlayerModal = () => {
    setShowPlayerModal(false);
    setSelectedGame(null);
    setLocalPlayers({ home: [], away: [] });
    setModalNewPlayer({
      name: '',
      position: '',
      number: '',
      team: 'home'
    });
  };

  const addPlayerToModal = () => {
    if (!modalNewPlayer.name || !modalNewPlayer.position) {
      alert('Please fill in player name and position');
      return;
    }

    const player = {
      id: Date.now(),
      name: modalNewPlayer.name,
      position: modalNewPlayer.position,
      number: modalNewPlayer.number || ''
    };

    setLocalPlayers(prev => ({
      ...prev,
      [modalNewPlayer.team]: [...prev[modalNewPlayer.team], player]
    }));

    setModalNewPlayer({
      name: '',
      position: '',
      number: '',
      team: 'home'
    });
  };

  const removePlayerFromModal = (team, playerId) => {
    setLocalPlayers(prev => ({
      ...prev,
      [team]: prev[team].filter(player => player.id !== playerId)
    }));
  };

  const savePlayers = async () => {
    setError(''); // Clear any previous errors
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/matches/${selectedGame._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...selectedGame,
          players: localPlayers
        })
      });

      if (response.ok) {
        // Update the games list with the new data
        const updatedGames = games.map(game => 
          game._id === selectedGame._id 
            ? { ...game, players: localPlayers }
            : game
        );
        setGames(updatedGames);
        
        // Close the modal
        closePlayerModal();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update players');
      }
    } catch (error) {
      setError('Network error');
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
              <h1 className="text-3xl font-bold text-gray-900">Games Management</h1>
              <p className="text-gray-600">Manage matches, games, and players</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/sports')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Manage Sports
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

        {/* Add Game Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingGame(null);
              setFormData({
                sport: '',
                match: '',
                slug: '',
                teams: { home: '', away: '' },
                scores: { home: 0, away: 0 },
                result: '',
                date: '',
                status: 'Upcoming',
                players: { home: [], away: [] }
              });
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add New Game
          </button>
        </div>

        {/* Game Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingGame ? 'Edit Game' : 'Add New Game'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sport</label>
                    <select
                      name="sport"
                      value={formData.sport}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Sport</option>
                      {sports.map((sport) => (
                        <option key={sport._id} value={sport.name}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Match Name</label>
                    <input
                      type="text"
                      name="match"
                      value={formData.match}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
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
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Team</label>
                    <input
                      type="text"
                      name="teams.home"
                      value={formData.teams.home}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Away Team</label>
                    <input
                      type="text"
                      name="teams.away"
                      value={formData.teams.away}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Score</label>
                    <input
                      type="number"
                      name="scores.home"
                      value={formData.scores.home}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Away Score</label>
                    <input
                      type="number"
                      name="scores.away"
                      value={formData.scores.away}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Result</label>
                  <input
                    type="text"
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    placeholder="e.g., Home Team wins 3-1"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Player Management Section */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Player Management</h4>
                  
                  {/* Add Player Form */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Player Name</label>
                      <input
                        type="text"
                        name="name"
                        value={playerFormData.name}
                        onChange={handlePlayerInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Player name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={playerFormData.position}
                        onChange={handlePlayerInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Forward, Midfielder"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number</label>
                      <input
                        type="number"
                        name="number"
                        value={playerFormData.number}
                        onChange={handlePlayerInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Jersey number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Team</label>
                      <select
                        name="team"
                        value={playerFormData.team}
                        onChange={handlePlayerInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="home">Home Team</option>
                        <option value="away">Away Team</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddPlayer}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
                  >
                    Add Player
                  </button>

                  {/* Display Players */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Home Team Players */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Home Team Players ({formData.players.home?.length || 0})
                      </h5>
                      <div className="bg-gray-50 p-3 rounded-md">
                        {formData.players.home?.length > 0 ? (
                          <div className="space-y-2">
                            {formData.players.home.map((player) => (
                              <div key={player.id} className="flex justify-between items-center bg-white p-2 rounded border">
                                <div>
                                  <span className="font-medium">{player.name}</span>
                                  <span className="text-gray-500 ml-2">({player.position})</span>
                                  {player.number && <span className="text-gray-400 ml-2">#{player.number}</span>}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlayer('home', player.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No players added</p>
                        )}
                      </div>
                    </div>

                    {/* Away Team Players */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Away Team Players ({formData.players.away?.length || 0})
                      </h5>
                      <div className="bg-gray-50 p-3 rounded-md">
                        {formData.players.away?.length > 0 ? (
                          <div className="space-y-2">
                            {formData.players.away.map((player) => (
                              <div key={player.id} className="flex justify-between items-center bg-white p-2 rounded border">
                                <div>
                                  <span className="font-medium">{player.name}</span>
                                  <span className="text-gray-500 ml-2">({player.position})</span>
                                  {player.number && <span className="text-gray-400 ml-2">#{player.number}</span>}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlayer('away', player.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No players added</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingGame ? 'Update Game' : 'Add Game')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingGame(null);
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

        {/* Games List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Games ({games.length})</h3>
            
            {games.length === 0 ? (
              <p className="text-gray-500">No games found. Add your first game!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Game
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sport
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teams
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Players
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {games.map((game) => (
                      <tr key={game._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {game.match}
                            </div>
                            {game.result && (
                              <div className="text-sm text-gray-500">
                                {game.result}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {game.sport}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {game.teams?.home && game.teams?.away ? (
                              <>
                                {game.teams.home} vs {game.teams.away}
                                {game.scores?.home !== undefined && game.scores?.away !== undefined && (
                                  <div className="text-sm text-gray-500">
                                    {game.scores.home} - {game.scores.away}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400">No teams</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Home: {game.players?.home?.length || 0}</div>
                            <div>Away: {game.players?.away?.length || 0}</div>
                            <button
                              onClick={() => openPlayerModal(game)}
                              className="text-blue-600 hover:text-blue-900 text-xs mt-1"
                            >
                              Manage Players
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            game.status === 'Completed' 
                              ? 'bg-green-100 text-green-800'
                              : game.status === 'Ongoing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {game.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {game.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(game)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(game._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Player Management Modal */}
      {showPlayerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Manage Players - {selectedGame?.match}
              </h3>
              
              {/* Add Player Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Player Name</label>
                  <input
                    type="text"
                    value={modalNewPlayer.name}
                    onChange={(e) => setModalNewPlayer({...modalNewPlayer, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Player name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    value={modalNewPlayer.position}
                    onChange={(e) => setModalNewPlayer({...modalNewPlayer, position: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Forward, Midfielder"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number</label>
                  <input
                    type="number"
                    value={modalNewPlayer.number}
                    onChange={(e) => setModalNewPlayer({...modalNewPlayer, number: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jersey number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team</label>
                  <select
                    value={modalNewPlayer.team}
                    onChange={(e) => setModalNewPlayer({...modalNewPlayer, team: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="home">Home Team</option>
                    <option value="away">Away Team</option>
                  </select>
                </div>
              </div>
              
              <button
                type="button"
                onClick={addPlayerToModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6"
              >
                Add Player
              </button>

              {/* Display Players */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Home Team Players */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Home Team Players ({localPlayers.home?.length || 0})
                  </h5>
                  <div className="bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto">
                    {localPlayers.home?.length > 0 ? (
                      <div className="space-y-2">
                        {localPlayers.home.map((player) => (
                          <div key={player.id} className="flex justify-between items-center bg-white p-2 rounded border">
                            <div>
                              <span className="font-medium">{player.name}</span>
                              <span className="text-gray-500 ml-2">({player.position})</span>
                              {player.number && <span className="text-gray-400 ml-2">#{player.number}</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => removePlayerFromModal('home', player.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No players added</p>
                    )}
                  </div>
                </div>

                {/* Away Team Players */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Away Team Players ({localPlayers.away?.length || 0})
                  </h5>
                  <div className="bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto">
                    {localPlayers.away?.length > 0 ? (
                      <div className="space-y-2">
                        {localPlayers.away.map((player) => (
                          <div key={player.id} className="flex justify-between items-center bg-white p-2 rounded border">
                            <div>
                              <span className="font-medium">{player.name}</span>
                              <span className="text-gray-500 ml-2">({player.position})</span>
                              {player.number && <span className="text-gray-400 ml-2">#{player.number}</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => removePlayerFromModal('away', player.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No players added</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={savePlayers}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={closePlayerModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 