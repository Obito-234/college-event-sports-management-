import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [matches, setMatches] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      } else {
        console.error('Failed to fetch matches');
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = async (matchData) => {
    try {
      console.log('Sending match data:', matchData);
      
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(matchData)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const newMatch = await response.json();
        console.log('Match created successfully:', newMatch);
        setMatches([newMatch, ...matches]);
        setShowAddForm(false);
      } else {
        const error = await response.json();
        console.error('Server error response:', error);
        alert(error.message || error.errors?.join(', ') || 'Failed to add match');
      }
    } catch (error) {
      console.error('Error adding match:', error);
      alert('Failed to add match: ' + error.message);
    }
  };

  const handleUpdateMatch = async (id, matchData) => {
    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(matchData)
      });
      
      if (response.ok) {
        const updatedMatch = await response.json();
        setMatches(matches.map(match => 
          match._id === id ? updatedMatch : match
        ));
        setEditingMatch(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update match');
      }
    } catch (error) {
      console.error('Error updating match:', error);
      alert('Failed to update match');
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!window.confirm('Are you sure you want to delete this match?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setMatches(matches.filter(match => match._id !== id));
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete match');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Failed to delete match');
    }
  };

  const AddMatchForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      sport: '',
      match: '',
      slug: '',
      teams: {
        home: '',
        away: ''
      },
      scores: {
        home: 0,
        away: 0
      },
      date: '',
      status: 'Upcoming',
      venue: '',
      description: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Generate slug from match name if not provided
      const matchData = {
        ...formData,
        slug: formData.slug || formData.match.toLowerCase().replace(/\s+/g, '-')
      };
      
      onSubmit(matchData);
    };

    return (
      <div className="add-match-form">
        <h3>Add New Match</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sport:</label>
            <input
              type="text"
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Match Name:</label>
            <input
              type="text"
              value={formData.match}
              onChange={(e) => setFormData({...formData, match: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Slug (optional, auto-generated):</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              placeholder="Will be auto-generated from match name"
            />
          </div>
          <div className="form-group">
            <label>Home Team:</label>
            <input
              type="text"
              value={formData.teams.home}
              onChange={(e) => setFormData({
                ...formData, 
                teams: {...formData.teams, home: e.target.value}
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Away Team:</label>
            <input
              type="text"
              value={formData.teams.away}
              onChange={(e) => setFormData({
                ...formData, 
                teams: {...formData.teams, away: e.target.value}
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Home Score:</label>
            <input
              type="number"
              value={formData.scores.home}
              onChange={(e) => setFormData({
                ...formData, 
                scores: {...formData.scores, home: parseInt(e.target.value) || 0}
              })}
            />
          </div>
          <div className="form-group">
            <label>Away Score:</label>
            <input
              type="number"
              value={formData.scores.away}
              onChange={(e) => setFormData({
                ...formData, 
                scores: {...formData.scores, away: parseInt(e.target.value) || 0}
              })}
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Venue:</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Match</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  };

  const EditMatchForm = ({ match, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      sport: match.sport || '',
      match: match.match || '',
      slug: match.slug || '',
      teams: {
        home: match.teams?.home || '',
        away: match.teams?.away || ''
      },
      scores: {
        home: match.scores?.home || 0,
        away: match.scores?.away || 0
      },
      date: match.date || '',
      status: match.status || 'Upcoming',
      venue: match.venue || '',
      description: match.description || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Generate slug from match name if not provided
      const matchData = {
        ...formData,
        slug: formData.slug || formData.match.toLowerCase().replace(/\s+/g, '-')
      };
      
      onSubmit(match._id, matchData);
    };

    return (
      <div className="edit-match-form">
        <h3>Edit Match</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sport:</label>
            <input
              type="text"
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Match Name:</label>
            <input
              type="text"
              value={formData.match}
              onChange={(e) => setFormData({...formData, match: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Slug:</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Home Team:</label>
            <input
              type="text"
              value={formData.teams.home}
              onChange={(e) => setFormData({
                ...formData, 
                teams: {...formData.teams, home: e.target.value}
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Away Team:</label>
            <input
              type="text"
              value={formData.teams.away}
              onChange={(e) => setFormData({
                ...formData, 
                teams: {...formData.teams, away: e.target.value}
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Home Score:</label>
            <input
              type="number"
              value={formData.scores.home}
              onChange={(e) => setFormData({
                ...formData, 
                scores: {...formData.scores, home: parseInt(e.target.value) || 0}
              })}
            />
          </div>
          <div className="form-group">
            <label>Away Score:</label>
            <input
              type="number"
              value={formData.scores.away}
              onChange={(e) => setFormData({
                ...formData, 
                scores: {...formData.scores, away: parseInt(e.target.value) || 0}
              })}
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Venue:</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Update Match</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  };

  if (loading) {
    return <div className="admin-panel">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Match
        </button>
      </div>

      {showAddForm && (
        <AddMatchForm
          onSubmit={handleAddMatch}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="matches-list">
        <h3>All Matches</h3>
        {matches.length === 0 ? (
          <p>No matches found.</p>
        ) : (
          matches.map(match => (
            <div key={match._id} className="match-item">
              {editingMatch === match._id ? (
                <EditMatchForm
                  match={match}
                  onSubmit={handleUpdateMatch}
                  onCancel={() => setEditingMatch(null)}
                />
              ) : (
                <div className="match-content">
                  <div className="match-info">
                    <h4>{match.match}</h4>
                    <p><strong>Sport:</strong> {match.sport}</p>
                    <p><strong>Teams:</strong> {match.teams?.home} vs {match.teams?.away}</p>
                    <p><strong>Scores:</strong> {match.scores?.home} - {match.scores?.away}</p>
                    <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {match.status}</p>
                    <p><strong>Venue:</strong> {match.venue}</p>
                    <p><strong>Description:</strong> {match.description}</p>
                  </div>
                  <div className="match-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setEditingMatch(match._id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteMatch(match._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 