import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const SWIPE_THRESHOLD = 90;

export default function SwipeCard({ profile, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-12, 0, 12]);
  const likeOpacity = useTransform(x, [15, 80], [0, 1]);
  const passOpacity = useTransform(x, [-80, -15], [1, 0]);

  const [showFullBio, setShowFullBio] = useState(false);
  const constraintsRef = useRef(null);

  const handleDragEnd = useCallback(
    (event, info) => {
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      if (offset > SWIPE_THRESHOLD || velocity > 400) {
        animate(x, 450, { duration: 0.25 });
        setTimeout(() => onSwipe('like'), 180);
      } else if (offset < -SWIPE_THRESHOLD || velocity < -400) {
        animate(x, -450, { duration: 0.25 });
        setTimeout(() => onSwipe('pass'), 180);
      } else {
        animate(x, 0, { type: 'spring', stiffness: 400, damping: 25 });
      }
    },
    [onSwipe, x]
  );

  if (!isTop) {
    return (
      <div className="card-container">
        <div className="profile-card background-card">
          <CardInner profile={profile} isTop={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="card-container" ref={constraintsRef}>
      <motion.div
        className="profile-card active-card"
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      >
        {/* Swipe Stamp Indicators */}
        <motion.div className="swipe-stamp stamp-like" style={{ opacity: likeOpacity }}>
          <span>LIKE</span> ❤️
        </motion.div>
        <motion.div className="swipe-stamp stamp-pass" style={{ opacity: passOpacity }}>
          <span>NOPE</span> ✕
        </motion.div>

        <CardInner
          profile={profile}
          isTop={true}
          showFullBio={showFullBio}
          onToggleBio={() => setShowFullBio(!showFullBio)}
        />
      </motion.div>
    </div>
  );
}

function CardInner({ profile, isTop, showFullBio, onToggleBio }) {
  return (
    <div className="card-inner-layout">
      {/* Photo Container with subtle gradient */}
      <div className="card-image-wrapper">
        <img
          src={profile.photo}
          alt={profile.name}
          className="card-photo"
          draggable={false}
          loading="eager"
        />
        <div className="card-photo-gradient" />

        {/* Floating Top Pills */}
        <div className="card-top-bar">
          <span className="card-pill location-pill">
            📍 {profile.city}
          </span>
          {isTop && (
            <button
              className="card-info-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBio();
              }}
              title="Toggle Bio"
            >
              {showFullBio ? '✕' : 'ℹ️'}
            </button>
          )}
        </div>

        {/* Overlay Primary Details (Name, Age, Verified) */}
        <div className="card-overlay-header">
          <div className="name-age-row">
            <h2 className="profile-name">{profile.name}</h2>
            <span className="profile-age">{profile.age}</span>
            <span className="verified-badge" title="Verified Profile">✓</span>
          </div>

          {profile.college && (
            <div className="profile-college">
              <span className="college-icon">🎓</span>
              <span>{profile.college}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Info Bottom Panel */}
      <div className={`card-details-panel ${showFullBio ? 'expanded' : ''}`}>
        <p className="profile-bio">
          {profile.bio}
        </p>

        {profile.interests && profile.interests.length > 0 && (
          <div className="interests-container">
            {profile.interests.map((interest, idx) => (
              <span key={idx} className="interest-chip">
                #{interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
