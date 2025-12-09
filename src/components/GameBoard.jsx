import React, { useState, useEffect, useRef } from 'react';
import './GameBoard.css';

const GameBoard = ({ 
  letters, 
  canFormWord,
  isValidEnglishWord,
  onWordFound, 
  onGameOver, 
  timeLeft, 
  foundWords
}) => {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [message, setMessage] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const boardRef = useRef(null);

  // Handle mouse/touch events for letter selection
  const handleMouseDown = (index) => {
    setIsSelecting(true);
    setSelectedLetters([index]);
    setCurrentWord(letters[index]);
  };

  const handleMouseEnter = (index) => {
    if (!isSelecting) return;
    
    // Check if the letter is adjacent to the last selected letter
    const lastIndex = selectedLetters[selectedLetters.length - 1];
    if (isValidMove(lastIndex, index) && !selectedLetters.includes(index)) {
      const newSelected = [...selectedLetters, index];
      setSelectedLetters(newSelected);
      setCurrentWord(newSelected.map(i => letters[i]).join(''));
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    
    setIsSelecting(false);
    
    // Check if the formed word is valid
    if (currentWord.length >= 2) {
      if (canFormWord(currentWord, letters) && isValidEnglishWord(currentWord)) {
        // Valid word
        if (!foundWords.includes(currentWord)) {
          onWordFound(currentWord);
          setMessage(`Great! Found "${currentWord}" (+${currentWord.length * 10} pts)`);
        } else {
          setMessage(`You already found "${currentWord}"`);
        }
        setTimeout(() => setMessage(''), 2000);
      } else if (!canFormWord(currentWord, letters)) {
        // Cannot be formed from available letters
        setMessage(`"${currentWord}" cannot be formed from these letters`);
        setTimeout(() => setMessage(''), 2000);
      } else {
        // Not a valid English word
        setMessage(`"${currentWord}" is not a valid word`);
        setTimeout(() => setMessage(''), 2000);
      }
    }
    
    setSelectedLetters([]);
    setCurrentWord('');
  };

  // Check if move is valid (adjacent letters)
  const isValidMove = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return false;
    
    const size = 4; // 4x4 grid
    const fromRow = Math.floor(fromIndex / size);
    const fromCol = fromIndex % size;
    const toRow = Math.floor(toIndex / size);
    const toCol = toIndex % size;
    
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    
    return rowDiff <= 1 && colDiff <= 1;
  };

  // Reset selection if time runs out
  useEffect(() => {
    if (timeLeft <= 0) {
      setSelectedLetters([]);
      setCurrentWord('');
    }
  }, [timeLeft]);

  // Render letters in a 4x4 grid
  const renderLetters = () => {
    const grid = [];
    
    for (let i = 0; i < letters.length; i++) {
      const isSelected = selectedLetters.includes(i);
      grid.push(
        <div
          key={i}
          className={`letter-cell ${isSelected ? 'selected' : ''}`}
          onMouseDown={() => handleMouseDown(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onTouchStart={(e) => {
            e.preventDefault();
            handleMouseDown(i);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element && element.classList.contains('letter-cell')) {
              const index = parseInt(element.dataset.index);
              if (!isNaN(index)) {
                handleMouseEnter(index);
              }
            }
          }}
          data-index={i}
        >
          {letters[i]}
        </div>
      );
    }
    
    return grid;
  };

  return (
    <div className="game-board" ref={boardRef}>
      <div className="progress-section">
        <div className="current-word">
          Current Word: {currentWord}
        </div>
      </div>
      
      <div 
        className="letter-grid"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        {renderLetters()}
      </div>
      
      <div className="message">
        {message}
      </div>
      
      <div className="found-words-list">
        <h3>Found Words:</h3>
        <div className="words-container">
          {foundWords.map((word, index) => (
            <span key={index} className="found-word">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;