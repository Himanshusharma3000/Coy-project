import { useEffect, useState } from 'react';
import { getMatches } from '../api';

export default function MatchesView({ onBack, refreshTrigger }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMatches()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="loading-box">
        <div className="loading-spinner" />
        <span style={{ fontSize: 13, color: '#7A7F92' }}>Loading matches...</span>
      </div>
    );
  }

  return (
    <div className="matches-view">
      <div className="matches-header">
        <button className="matches-back-btn" onClick={onBack} title="Back">
          ←
        </button>
        <h2 className="matches-view-title">Mutual Matches 💕</h2>
      </div>

      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-radar">💘</div>
          <h3 className="empty-title">No matches yet</h3>
          <p className="empty-desc">
            Keep swiping! When someone you like also likes you back, they will appear here.
          </p>
          <button className="reset-feed-btn" onClick={onBack}>
            Start Swiping
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((m) => (
            <div key={m.id} className="match-item-card">
              <img className="match-item-avatar" src={m.photo} alt={m.name} />
              <div className="match-item-info">
                <div className="match-item-name">
                  {m.name}, {m.age}
                </div>
                <div className="match-item-sub">
                  📍 {m.city} {m.college ? `• ${m.college}` : ''}
                </div>
              </div>
              <button className="match-chat-btn">Say Hi 👋</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
