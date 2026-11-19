import { motion } from 'framer-motion';

export default function MatchModal({ matchedProfile, onClose, onViewMatches }) {
  return (
    <motion.div
      className="match-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="match-modal-card"
        initial={{ scale: 0.75, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="match-sparkles">💖✨</div>
        <h2 className="match-title">It's a Match!</h2>
        <p className="match-subtitle">
          You and <strong>{matchedProfile.name}</strong> liked each other!
        </p>

        <div className="match-photos-cluster">
          <img
            className="match-avatar-circle"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            alt="You"
          />
          <img
            className="match-avatar-circle"
            src={matchedProfile.photo}
            alt={matchedProfile.name}
          />
        </div>

        <button className="match-cta-btn primary" onClick={onViewMatches}>
          View Matches 💕
        </button>
        <button className="match-cta-btn secondary" onClick={onClose}>
          Keep Swiping
        </button>
      </motion.div>
    </motion.div>
  );
}
