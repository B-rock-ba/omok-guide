
import React from 'react';
import { BoardState, Coordinate, Player } from '../types';

interface OmokBoardProps {
  boardState: BoardState;
  interactive?: boolean;
  onCellClick?: (coord: Coordinate) => void;
  lastMove?: Coordinate | null;
  highlightedCells?: Coordinate[];
  boardSize?: number;
  readOnly?: boolean;
  className?: string; // Allow external sizing
}

const OmokBoard: React.FC<OmokBoardProps> = ({
  boardState,
  interactive = false,
  onCellClick,
  lastMove,
  highlightedCells = [],
  boardSize = 15,
  readOnly = false,
  className = "w-[min(85vw,400px)] h-[min(85vw,400px)]" // Default size
}) => {
  // We render a 15x15 grid (standard for Gomoku)
  const gridSize = boardSize; 
  
  const handleClick = (x: number, y: number) => {
    if (!interactive || readOnly) return;
    if (boardState[`${x},${y}`]) return;
    onCellClick?.({ x, y });
  };

  return (
    <div className={`relative inline-block p-3 bg-[#dcb35c] rounded-lg shadow-xl wood-texture select-none ${className}`}>
      {/* Board Aspect Ratio Box */}
      <div className="relative w-full h-full">
        
        {/* Grid Lines SVG */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox={`0 0 ${gridSize - 1} ${gridSize - 1}`}
          style={{ zIndex: 0 }}
        >
          <defs>
            <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
              <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#5c4033" strokeWidth="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Border outline */}
          <rect width="100%" height="100%" fill="none" stroke="#5c4033" strokeWidth="0.1" />
          
          {/* Hoshi (Star points) */}
          {[3, 7, 11].map(x => 
            [3, 7, 11].map(y => (
              <circle key={`star-${x}-${y}`} cx={x} cy={y} r="0.12" fill="#5c4033" />
            ))
          )}
        </svg>

        {/* Stones Layer */}
        {Object.entries(boardState).map(([key, player]) => {
            const [x, y] = key.split(',').map(Number);
            const isLastMove = lastMove?.x === x && lastMove?.y === y;
            
            return (
              <div
                key={`stone-${key}`}
                className={`absolute rounded-full stone-shadow transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
                  ${player === 'black' ? 'stone-black' : 'stone-white'}
                `}
                style={{
                  left: `${(x / (gridSize - 1)) * 100}%`,
                  top: `${(y / (gridSize - 1)) * 100}%`,
                  width: `${90 / (gridSize - 1)}%`,
                  height: `${90 / (gridSize - 1)}%`,
                  zIndex: 10
                }}
              >
                {isLastMove && (
                  <div className={`w-1/2 h-1/2 rounded-full border-2 ${player === 'black' ? 'border-white/50' : 'border-black/30'}`} />
                )}
              </div>
            );
        })}

        {/* Interactive Click Layer & Highlights */}
        {/* We render a transparent circle at every intersection for clicking and highlighting */}
        {Array.from({ length: gridSize }).map((_, y) => (
           Array.from({ length: gridSize }).map((_, x) => {
             const isHighlighted = highlightedCells.some(c => c.x === x && c.y === y);
             
             return (
                <React.Fragment key={`cell-${x}-${y}`}>
                    {/* Highlight Effect */}
                    {isHighlighted && (
                        <div 
                            className="absolute rounded-full bg-red-500/40 animate-pulse pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${(x / (gridSize - 1)) * 100}%`,
                                top: `${(y / (gridSize - 1)) * 100}%`,
                                width: `${80 / (gridSize - 1)}%`,
                                height: `${80 / (gridSize - 1)}%`,
                                zIndex: 5
                            }}
                        />
                    )}

                    {/* Click Target */}
                    {interactive && !boardState[`${x},${y}`] && (
                         <div
                            onClick={() => handleClick(x, y)}
                            className="absolute rounded-full cursor-pointer hover:bg-black/10 transition-colors transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${(x / (gridSize - 1)) * 100}%`,
                                top: `${(y / (gridSize - 1)) * 100}%`,
                                width: `${60 / (gridSize - 1)}%`,
                                height: `${60 / (gridSize - 1)}%`,
                                zIndex: 20
                            }}
                         />
                    )}
                </React.Fragment>
             );
           })
        ))}
      </div>
    </div>
  );
};

export default OmokBoard;
