import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ActivePiece, Difficulty, Grid, GridCell, TetrominoType, WordBook, WordEntry } from '../types';
import { BOARD_HEIGHT, BOARD_WIDTH, COLORS, TETROMINOS } from '../constants';
import { audioController } from '../utils/audio';
import { LogOut } from 'lucide-react';

interface ScreenGameProps {
  difficulty: Difficulty;
  book: WordBook;
  onGameOver: (score: number) => void;
  onExit: () => void;
}

const createEmptyGrid = (): Grid =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: '' }))
  );

export const ScreenGame: React.FC<ScreenGameProps> = ({ difficulty, book, onGameOver, onExit }) => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'clear' } | null>(null);
  
  // Refs
  const activePieceRef = useRef<ActivePiece | null>(null);
  const gridRef = useRef<Grid>(grid);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dropCounterRef = useRef<number>(0);
  const dropIntervalRef = useRef<number>(1000); 

  useEffect(() => { activePieceRef.current = activePiece; }, [activePiece]);
  useEffect(() => { gridRef.current = grid; }, [grid]);

  // Difficulty adjustment
  useEffect(() => {
    switch (difficulty) {
      case Difficulty.EASY: dropIntervalRef.current = 1000; break;
      case Difficulty.MEDIUM: dropIntervalRef.current = 700; break;
      case Difficulty.HARD: dropIntervalRef.current = 400; break;
    }
  }, [difficulty]);

  const getPieceMatrix = useCallback((type: TetrominoType, rotation: number) => {
    return TETROMINOS[type][rotation % 4];
  }, []);

  // --- Logic: Best Move Heuristic for Easy Mode ---
  const findBestDropZone = useCallback((pieceType: TetrominoType, currentGrid: Grid): number => {
      const rotation = 0;
      const matrix = TETROMINOS[pieceType][rotation];
      
      let minCol = 4, maxCol = 0;
      for(let r=0; r<matrix.length; r++) {
          for(let c=0; c<matrix[r].length; c++) {
              if (matrix[r][c]) {
                  if (c < minCol) minCol = c;
                  if (c > maxCol) maxCol = c;
              }
          }
      }
      const realWidth = maxCol - minCol + 1;

      let bestScore = -999999;
      let bestX = 0;

      for (let x = -minCol; x < BOARD_WIDTH - maxCol; x++) {
          let y = 0;
          while (true) {
              let collision = false;
              for(let r=0; r<matrix.length; r++) {
                  for(let c=0; c<matrix[r].length; c++) {
                      if(matrix[r][c]) {
                          const by = y + 1 + r;
                          const bx = x + c;
                          if (by >= BOARD_HEIGHT || (by >= 0 && currentGrid[by]?.[bx]?.filled)) {
                              collision = true;
                          }
                      }
                  }
              }
              if (collision) break;
              y++;
          }
          let currentScore = y;
          if (currentScore > bestScore) {
              bestScore = currentScore;
              bestX = x;
          }
      }

      const center = bestX + (realWidth / 2);
      const zone = Math.floor(center / 3);
      return Math.max(0, Math.min(3, zone));

  }, []);

  const checkCollision = useCallback((piece: ActivePiece, moveX: number, moveY: number, newRotation?: number) => {
    const rot = newRotation !== undefined ? newRotation : piece.rotation;
    const matrix = getPieceMatrix(piece.type, rot);
    const g = gridRef.current;
    
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x]) {
          const nextX = piece.x + x + moveX;
          const nextY = piece.y + y + moveY;
          if (nextX < 0 || nextX >= BOARD_WIDTH || nextY >= BOARD_HEIGHT) return true;
          if (nextY >= 0 && g[nextY][nextX].filled) return true;
        }
      }
    }
    return false;
  }, [getPieceMatrix]);

  const getRandomWordData = useCallback((targetZone?: number) => {
    const wordPool = book.words;
    // Simple random pick, in a real app might want shuffle bag to avoid repeats
    const target = wordPool[Math.floor(Math.random() * wordPool.length)];
    const distractors: WordEntry[] = [];
    while (distractors.length < 3) {
      const d = wordPool[Math.floor(Math.random() * wordPool.length)];
      if (d.english !== target.english && !distractors.find(x => x.english === d.english)) {
        distractors.push(d);
      }
    }
    
    const options = new Array(4).fill(null);
    
    if (targetZone !== undefined && targetZone >= 0 && targetZone <= 3) {
        options[targetZone] = target;
        let dIdx = 0;
        for(let i=0; i<4; i++) {
            if (i !== targetZone) options[i] = distractors[dIdx++];
        }
    } else {
        const all = [target, ...distractors].sort(() => Math.random() - 0.5);
        for(let i=0; i<4; i++) options[i] = all[i];
    }
    
    return { target, options };
  }, [book]);

  const spawnPiece = useCallback(() => {
    const types = Object.keys(TETROMINOS) as TetrominoType[];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let forcedZone: number | undefined = undefined;
    if (difficulty === Difficulty.EASY) {
        forcedZone = findBestDropZone(type, gridRef.current);
    }

    const { target, options } = getRandomWordData(forcedZone);

    const newPiece: ActivePiece = {
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      type,
      rotation: 0,
      word: target,
      options: options,
    };

    if (checkCollision(newPiece, 0, 0)) {
        onGameOver(score);
    } else {
        setActivePiece(newPiece);
    }
  }, [getRandomWordData, checkCollision, score, onGameOver, difficulty, findBestDropZone]);

  const handleLanding = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece) return;

    const { x, type, rotation, word, options } = piece;
    const matrix = getPieceMatrix(type, rotation);
    
    // Check if piece existed at all (sanity check)
    let minX = 100, maxX = -1;
    let hasBlock = false;
    for(let r=0; r<matrix.length; r++) {
        for(let c=0; c<matrix[r].length; c++) {
            if(matrix[r][c]) {
                hasBlock = true;
                if((x+c) < minX) minX = x+c;
                if((x+c) > maxX) maxX = x+c;
            }
        }
    }
    if (!hasBlock) { setActivePiece(null); spawnPiece(); return; }

    // Zone Logic
    const center = (minX + maxX) / 2;
    const zoneIndex = Math.floor(center / 3);
    const safeZoneIndex = Math.max(0, Math.min(3, zoneIndex));
    const correctIndex = options.findIndex(o => o.english === word.english);
    const isCorrect = correctIndex === safeZoneIndex;

    // 1. Commit Piece to Grid
    // Copy current grid
    let nextGrid = gridRef.current.map(row => row.map(cell => ({ ...cell })));
    let gameOver = false;

    for (let y = 0; y < matrix.length; y++) {
        for (let cx = 0; cx < matrix[y].length; cx++) {
            if (matrix[y][cx]) {
                const boardY = piece.y + y;
                const boardX = piece.x + cx;
                if (boardY < 0) {
                    gameOver = true;
                } else if (boardY < BOARD_HEIGHT) {
                    nextGrid[boardY][boardX] = { 
                        filled: true, 
                        color: COLORS[type],
                        isPermanent: false // Normal blocks are never permanent, they can always be cleared
                    };
                }
            }
        }
    }

    if (gameOver) {
        onGameOver(score);
        return;
    }

    // 2. Score & Feedback
    if (isCorrect) {
        setScore(s => s + 100);
        audioController.playCorrect();
    } else {
        audioController.playError();
        setFeedback({ text: 'OOPS!', type: 'error' });
    }

    // 3. Clear Lines (Logic applies to ALL drops, even wrong ones, unless it's a bedrock row)
    let linesCleared = 0;
    const cleanedGrid = nextGrid.filter(row => {
        const isFull = row.every(cell => cell.filled);
        const isBedrock = row.some(cell => cell.isPermanent); // Check if this is a penalty row
        // If row is full and NOT bedrock, it clears.
        // If row is full AND bedrock, it stays (it's the floor).
        if (isFull && !isBedrock) {
             linesCleared++;
             return false; 
        }
        return true;
    });

    // Fill top with empty rows
    while (cleanedGrid.length < BOARD_HEIGHT) {
        cleanedGrid.unshift(Array(BOARD_WIDTH).fill({ filled: false, color: '' }));
    }
    nextGrid = cleanedGrid;

    // Line clear bonus
    if (linesCleared > 0) {
        // If user got it right AND cleared lines, big bonus.
        // If user got it wrong but cleared lines, they still get points for the clear.
        setScore(s => s + (linesCleared * 500));
        setFeedback({ text: `CLEARED x${linesCleared}`, type: 'clear' });
        audioController.playClear();
    } else if (isCorrect) {
        // Only show PERFECT if correct and NO lines cleared (to avoid overwriting text)
        setFeedback({ text: 'PERFECT!', type: 'success' });
    }

    // 4. Penalty Logic (If Wrong)
    // Apply penalty AFTER line clears. The penalty pushes everything up and adds an unclearable row.
    if (!isCorrect) {
        nextGrid.shift(); // Remove top row (game over if blocks exist there? handled by next collision check)
        nextGrid.push(Array(BOARD_WIDTH).fill({ 
            filled: true, 
            color: '#3E2723', 
            isGarbage: true, 
            isPermanent: true // Bedrock flag
        }));
    }

    setGrid(nextGrid);
    setTimeout(() => setFeedback(null), 500);
    spawnPiece();

  }, [getPieceMatrix, spawnPiece, score, onGameOver]);

  // Game Loop
  const gameTick = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    dropCounterRef.current += deltaTime;
    if (dropCounterRef.current > dropIntervalRef.current) {
        dropCounterRef.current = 0;
        const currentPiece = activePieceRef.current;
        if (currentPiece) {
            if (checkCollision(currentPiece, 0, 1)) {
                 handleLanding(); 
            } else {
                setActivePiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
            }
        }
    }
    requestRef.current = requestAnimationFrame(gameTick);
  }, [checkCollision, handleLanding]); 

  useEffect(() => {
    if (!activePiece) spawnPiece();
    requestRef.current = requestAnimationFrame(gameTick);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []); 

  // --- External Controls Handlers ---
  const handleControl = useCallback((action: string) => {
      const p = activePieceRef.current;
      if (!p) return;
      
      if (action === 'Enter') action = 'rotate';
      if (action === 'ArrowUp') action = 'rotate';

      switch(action) {
          case 'ArrowLeft':
              if (!checkCollision(p, -1, 0)) {
                  setActivePiece(prev => prev ? { ...prev, x: prev.x - 1 } : null);
                  audioController.playMove();
              }
              break;
          case 'ArrowRight':
              if (!checkCollision(p, 1, 0)) {
                  setActivePiece(prev => prev ? { ...prev, x: prev.x + 1 } : null);
                  audioController.playMove();
              }
              break;
          case 'rotate':
              const newRot = (p.rotation + 1) % 4;
              if (!checkCollision(p, 0, 0, newRot)) {
                   setActivePiece(prev => prev ? { ...prev, rotation: newRot } : null);
                   audioController.playRotate();
              }
              break;
          case 'ArrowDown':
              if (!checkCollision(p, 0, 1)) {
                  setActivePiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
                  audioController.playDrop();
              }
              break;
      }
  }, [checkCollision]);

  useEffect(() => {
    const handleEvent = (e: CustomEvent) => handleControl(e.detail);
    const handleKey = (e: KeyboardEvent) => handleControl(e.key);

    window.addEventListener('control-input', handleEvent as EventListener);
    window.addEventListener('keydown', handleKey);
    return () => {
        window.removeEventListener('control-input', handleEvent as EventListener);
        window.removeEventListener('keydown', handleKey);
    };
  }, [handleControl]); 

  // --- Rendering ---
  return (
    <div className="w-full h-full flex flex-col p-2 select-none">
        {/* Header Area */}
        <div className="flex justify-between items-center mb-1 px-1">
            <button onClick={onExit} className="text-[#8D5524] hover:text-[#5D4037]">
                <LogOut size={16} />
            </button>
            <div className="bg-[#FFF8E1] border-2 border-[#8D5524] rounded-lg px-2 flex items-center gap-2 shadow-sm">
                <span className="text-[#8D5524] text-[10px] font-bold uppercase">Score</span>
                <span className="text-[#F57F17] text-lg font-black leading-none">{score}</span>
            </div>
        </div>

        {/* Game Board Frame */}
        <div className="flex-1 relative bg-wood rounded-lg p-2 shadow-inner border-2 border-[#5D3A1A] mx-1 overflow-hidden">
            {/* Inner Grid */}
            <div className="w-full h-full bg-[#263238] rounded overflow-hidden relative border-2 border-[#37474F] shadow-inner">
                {/* Dividers */}
                <div className="absolute inset-0 flex pointer-events-none opacity-20">
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1"></div>
                </div>

                {/* Grid Cells */}
                {grid.map((row, y) => (
                    <div key={y} className="flex h-[5%] w-full">
                        {row.map((cell, x) => (
                            <div key={`${x}-${y}`} className="w-[8.33%] h-full relative" >
                                {cell.filled && (
                                    <div className="absolute inset-[0.5px] rounded-sm shadow-sm" style={{backgroundColor: cell.color}}>
                                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-sm"></div>
                                        {cell.isPermanent && (
                                            <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj48cGF0aCBkPSJNMiAyIEw4IDggTTggMiBMMiA4IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]"></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}

                {/* Active Piece */}
                {activePiece && (() => {
                    const matrix = getPieceMatrix(activePiece.type, activePiece.rotation);
                    return matrix.map((row, r) => row.map((val, c) => {
                         if (!val) return null;
                         const top = (activePiece.y + r) * 5;
                         const left = (activePiece.x + c) * 8.33;
                         return (
                            <div key={`a-${r}-${c}`} className="absolute w-[8.33%] h-[5%] transition-all duration-75" style={{top: `${top}%`, left: `${left}%`}}>
                                <div className="absolute inset-[0.5px] rounded-sm shadow-sm" style={{backgroundColor: COLORS[activePiece.type]}}>
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-sm"></div>
                                </div>
                            </div>
                         );
                    }));
                })()}

                 {/* Word Label */}
                 {activePiece && (
                    <div 
                        className="absolute z-20 px-2 py-0.5 bg-white border border-[#8D5524] text-[#8D5524] rounded-full text-[10px] font-bold shadow whitespace-nowrap"
                        style={{
                            top: `${(activePiece.y * 5) - 5}%`,
                            left: `${(activePiece.x + 1.5) * 8.33}%`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        {activePiece.word.english}
                    </div>
                 )}
                 
                 {/* Feedback */}
                 {feedback && (
                     <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-black text-stroke text-white drop-shadow-md animate-bounce z-30 ${feedback.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                         {feedback.text}
                     </div>
                 )}
            </div>
        </div>

        {/* Options Zones - Updated to strictly match grid columns (25% each) */}
        <div className="h-14 flex mt-1 mx-1">
             {activePiece?.options.map((opt, idx) => {
                 const zoneLabels = ['A', 'B', 'C', 'D'];
                 return (
                     <div key={idx} className="w-1/4 bg-[#FFE0B2] border-r-2 border-[#FFB74D] last:border-r-0 flex flex-col items-center justify-center relative overflow-hidden shadow-sm box-border">
                         <div className="absolute top-0 left-1 text-[8px] text-[#E65100] font-black">{zoneLabels[idx]}</div>
                         <div className="text-[#5D4037] font-bold text-[10px] text-center leading-tight px-0.5 z-10 break-all">
                             {opt.chinese}
                         </div>
                     </div>
                 );
             })}
        </div>
    </div>
  );
};