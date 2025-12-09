import React, { useState, useEffect } from 'react';
import './GameOverScreen.css';

const GameOverScreen = ({ score, onRestart, foundWords }) => {
  const [miniAppSdk, setMiniAppSdk] = useState(null);

  useEffect(() => {
    // Check if we're running in a Mini App environment
    if (typeof window !== 'undefined' && window.MiniAppBridge) {
      setMiniAppSdk(window.MiniAppBridge);
    }
  }, []);

  const shareToFarcaster = async () => {
    const shareText = `I scored ${score} points in WordSwipe! Can you beat my score? Play now: ${window.location.href}`;
    
    if (miniAppSdk) {
      try {
        // Use Mini App SDK to share
        await miniAppSdk.composeCast({
          text: shareText
        });
      } catch (error) {
        console.error('Failed to share via Mini App SDK:', error);
        // Fallback to clipboard
        fallbackToClipboard(shareText);
      }
    } else {
      // Fallback for web browsers
      fallbackToClipboard(shareText);
    }
  };

  const fallbackToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Score copied to clipboard! You can now paste and share it.');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Last resort: show alert with score
      alert(`Your score: ${score} points. Share this link to challenge friends: ${window.location.href}`);
    });
  };

  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h2>Game Over!</h2>
        <div className="final-score">
          <p>Your Score:</p>
          <p className="score-value">{score}</p>
        </div>
        <div className="final-stats">
          <div className="stat-item">
            <p>Words Found:</p>
            <p className="words-value">{foundWords}</p>
          </div>
        </div>
        <div className="medal-container">
          {score >= 1000 && <div className="medal gold">🥇</div>}
          {score >= 500 && score < 1000 && <div className="medal silver">🥈</div>}
          {score >= 250 && score < 500 && <div className="medal bronze">🥉</div>}
          {score < 250 && <div className="medal participation">🏅</div>}
        </div>
        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
        <div className="share-section">
          <p>Share your score:</p>
          <div className="social-buttons">
            <button className="social-button farcaster" onClick={shareToFarcaster}>
              Share on Farcaster
            </button>
          </div>
          <p className="share-link">
            Challenge friends: <a href={window.location.href} target="_blank" rel="noopener noreferrer">{window.location.href}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;