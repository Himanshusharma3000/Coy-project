import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SwipeCard from './components/SwipeCard';
import MatchModal from './components/MatchModal';
import MatchesView from './components/MatchesView';
import { getFeed, postSwipe, getMatches } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState(null);
  const [matchCount, setMatchCount] = useState(0);
  const [showMatches, setShowMatches] = useState(false);
  const [refreshMatches, setRefreshMatches] = useState(0);

  // Load feed
  const loadFeed = useCallback(() => {
    setLoading(true);
    getFeed()
      .then((data) => {
        setProfiles(data || []);
        setCurrentIndex(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Load match count
  useEffect(() => {
    getMatches()
      .then((m) => setMatchCount(m ? m.length : 0))
      .catch(() => {});
  }, [refreshMatches]);

  const handleSwipe = useCallback(
    async (action) => {
      const profile = profiles[currentIndex];
      if (!profile) return;

      try {
        const result = await postSwipe(profile.id, action);

        if (result && result.matched) {
          setMatchModal(result.matchedProfile || profile);
          setMatchCount((c) => c + 1);
          setRefreshMatches((r) => r + 1);
        }

        setCurrentIndex((i) => i + 1);
      } catch (err) {
        console.error('Swipe error:', err);
      }
    },
    [profiles, currentIndex]
  );

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const hasProfiles = currentIndex < profiles.length;

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="header">
        <div
          className="header-logo"
          onClick={() => {
            setActiveTab('discover');
            setShowMatches(false);
          }}
        >
          <h1>coy</h1>
          <span className="dot" />
        </div>

        <div className="header-actions">
          <div
            className="match-counter-pill"
            onClick={() => {
              setActiveTab('discover');
              setShowMatches(true);
            }}
          >
            <span>💕</span>
            <span>{matchCount} {matchCount === 1 ? 'Match' : 'Matches'}</span>
          </div>

          <button
            className="header-icon-btn"
            title="Settings"
            onClick={() => alert('Coy Settings')}
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="home-screen-content">
            <div className="home-banner-card">
              <div className="home-dots-grid">
                <span className="home-dot pink" />
                <span className="home-dot pink" />
              </div>

              <h2 className="home-banner-title">
                Find out if your crush likes you back
              </h2>

              <div className="home-feature-item">
                <div className="home-feature-icon">👤+</div>
                <div className="home-feature-text">
                  Add someone you like, by number or email
                </div>
              </div>

              <div className="home-feature-item">
                <div className="home-feature-icon">🙈</div>
                <div className="home-feature-text">
                  We tell them someone likes them, not who
                </div>
              </div>

              <div className="home-feature-item">
                <div className="home-feature-icon">💖</div>
                <div className="home-feature-text">
                  If they add you back, it's a match
                </div>
              </div>

              <button
                className="home-cta-button"
                onClick={() => {
                  setActiveTab('discover');
                  setShowMatches(false);
                }}
              >
                Go to Discover 🔥
              </button>
            </div>
          </div>
        )}

        {activeTab === 'discover' && !showMatches && (
          <>
            {loading ? (
              <div className="loading-box">
                <div className="loading-spinner" />
                <span style={{ fontSize: 13, color: '#7A7F92' }}>Loading profiles...</span>
              </div>
            ) : !hasProfiles ? (
              <div className="empty-state">
                <div className="empty-radar">✨</div>
                <h3 className="empty-title">You've seen everyone!</h3>
                <p className="empty-desc">
                  There are no more new profiles nearby right now. Check back soon for new people!
                </p>
                <button className="reset-feed-btn" onClick={loadFeed}>
                  Refresh Feed 🔄
                </button>
              </div>
            ) : (
              <>
                {/* Background card preview */}
                {nextProfile && (
                  <SwipeCard
                    key={`bg-${nextProfile.id}`}
                    profile={nextProfile}
                    onSwipe={() => {}}
                    isTop={false}
                  />
                )}
                {/* Active foreground draggable card */}
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  onSwipe={handleSwipe}
                  isTop={true}
                />
              </>
            )}
          </>
        )}

        {activeTab === 'discover' && showMatches && (
          <MatchesView
            onBack={() => setShowMatches(false)}
            refreshTrigger={refreshMatches}
          />
        )}
      </main>

      {/* Floating Action Buttons */}
      {activeTab === 'discover' && !showMatches && hasProfiles && !loading && (
        <div className="action-buttons">
          <button
            className="action-btn pass-btn"
            onClick={() => handleSwipe('pass')}
            title="Pass (Swipe Left)"
          >
            ✕
          </button>

          <button
            className="action-btn superlike-btn"
            onClick={() => handleSwipe('like')}
            title="Super Like"
          >
            ⭐
          </button>

          <button
            className="action-btn like-btn"
            onClick={() => handleSwipe('like')}
            title="Like (Swipe Right)"
          >
            ❤️
          </button>
        </div>
      )}

      {/* Bottom Navigation Tab Bar */}
      <nav className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('home');
            setShowMatches(false);
          }}
        >
          <span className="tab-icon">🏠</span>
          <span>Home</span>
        </button>

        <button
          className={`tab-item ${activeTab === 'discover' && !showMatches ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('discover');
            setShowMatches(false);
          }}
        >
          <span className="tab-icon">🔥</span>
          <span>Discover</span>
        </button>

        <button
          className={`tab-item ${showMatches ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('discover');
            setShowMatches(true);
            setRefreshMatches((r) => r + 1);
          }}
        >
          <span className="tab-icon">💕</span>
          <span>Matches</span>
        </button>
      </nav>

      {/* It's a Match celebration modal */}
      <AnimatePresence>
        {matchModal && (
          <MatchModal
            matchedProfile={matchModal}
            onClose={() => setMatchModal(null)}
            onViewMatches={() => {
              setMatchModal(null);
              setShowMatches(true);
              setRefreshMatches((r) => r + 1);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
