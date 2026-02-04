import React, { useState, useEffect } from 'react';
import { ConsoleShell } from './components/ConsoleShell';
import { ScreenHome } from './components/ScreenHome';
import { ScreenGame } from './components/ScreenGame';
import { ScreenLeaderboard } from './components/ScreenLeaderboard';
import { GameState, WordBook, Difficulty, HighScore } from './types';
import { WORD_BOOKS } from './constants';
import { audioController } from './utils/audio';

const MOCK_SCORES: HighScore[] = [
    { score: 5000, date: '10/24', book: 'Primary' },
    { score: 2400, date: '10/23', book: 'CET-4' },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [scores, setScores] = useState<HighScore[]>(MOCK_SCORES);

  // Music Control Effect
  useEffect(() => {
    // Only play music in MENU or LEADERBOARD
    if (gameState === GameState.MENU || gameState === GameState.LEADERBOARD) {
        audioController.startMusic();
    } else {
        audioController.stopMusic();
    }
  }, [gameState]);

  const startGame = (diff: Difficulty) => {
      setDifficulty(diff);
      setShowDifficultyModal(false);
      setGameState(GameState.PLAYING);
      audioController.playCorrect();
  };

  const handleGameOver = (finalScore: number) => {
      setGameState(GameState.GAME_OVER);
      const newScore: HighScore = {
          score: finalScore,
          date: new Date().toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }),
          book: WORD_BOOKS[currentBookIndex].name.split('(')[0]
      };
      setScores(prev => [...prev, newScore].sort((a,b) => b.score - a.score).slice(0, 10));
  };

  return (
    <ConsoleShell>
      {/* Modal Overlay for Difficulty */}
      {showDifficultyModal && (
          <div className="absolute inset-0 z-50 bg-black/60 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-[#FFF8E1] border-4 border-[#8D5524] w-full max-w-xs p-6 rounded-3xl shadow-2xl">
                  <h3 className="text-2xl font-black text-[#5D4037] text-center mb-2">DIFFICULTY</h3>
                  <div className="text-sm font-bold text-center mb-6 text-[#8D5524] opacity-80">{WORD_BOOKS[currentBookIndex].name}</div>
                  <div className="space-y-3">
                      {([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD] as Difficulty[]).map((d) => (
                          <button 
                             key={d} 
                             onClick={() => startGame(d)}
                             className="w-full bg-[#FFCA28] hover:bg-[#FFC107] text-[#5D4037] font-bold py-3 rounded-xl border-b-4 border-[#FFA000] active:border-b-0 active:translate-y-1 transition-all"
                          >
                              {d}
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setShowDifficultyModal(false)} className="mt-4 w-full text-center text-sm font-bold text-gray-500 underline">Cancel</button>
              </div>
          </div>
      )}

      {gameState === GameState.MENU && (
        <ScreenHome 
            currentBook={WORD_BOOKS[currentBookIndex]}
            onChangeBook={() => setCurrentBookIndex(prev => (prev + 1) % WORD_BOOKS.length)}
            onStart={() => setShowDifficultyModal(true)}
            onLeaderboard={() => setGameState(GameState.LEADERBOARD)}
        />
      )}

      {gameState === GameState.PLAYING && (
          <ScreenGame 
            difficulty={difficulty}
            book={WORD_BOOKS[currentBookIndex]}
            onGameOver={handleGameOver}
            onExit={() => setGameState(GameState.MENU)}
          />
      )}

      {gameState === GameState.LEADERBOARD && (
          <ScreenLeaderboard scores={scores} onBack={() => setGameState(GameState.MENU)} />
      )}

      {gameState === GameState.GAME_OVER && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#5D4037]/90 p-8 text-center backdrop-blur-sm">
              <h1 className="text-6xl font-black text-white text-stroke mb-4 drop-shadow-xl animate-pulse">GAME OVER</h1>
              <div className="bg-[#FFF8E1] p-6 rounded-3xl border-4 border-[#8D5524] shadow-2xl w-full max-w-xs transform rotate-2">
                  <div className="text-[#8D5524] font-bold uppercase tracking-widest text-sm mb-1">Final Score</div>
                  <div className="text-6xl font-black text-[#F57F17]">{scores[0]?.score}</div>
              </div>
              <button 
                onClick={() => setGameState(GameState.MENU)}
                className="mt-12 bg-[#FF7043] text-white text-xl font-black py-4 px-12 rounded-full border-b-[6px] border-[#D84315] active:border-b-0 active:translate-y-2 shadow-xl btn-3d"
              >
                  CONTINUE
              </button>
          </div>
      )}

    </ConsoleShell>
  );
}
