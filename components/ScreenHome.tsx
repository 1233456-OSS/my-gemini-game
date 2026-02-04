import React from 'react';
import { WordBook } from '../types';
import { Book, Trophy, Play } from 'lucide-react';

interface ScreenHomeProps {
  currentBook: WordBook;
  onChangeBook: () => void;
  onStart: () => void;
  onLeaderboard: () => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  currentBook,
  onChangeBook,
  onStart,
  onLeaderboard,
}) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col bg-[#0f0c29] font-sans text-white select-none">
      
      {/* Custom Animations */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(800px) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0c29] via-[#2a1b3d] to-[#0f0c29] opacity-100"></div>

      {/* Retro Perspective Grid */}
      <div 
        className="absolute bottom-0 left-[-50%] right-[-50%] h-[60%] opacity-20 pointer-events-none"
        style={{
            backgroundImage: `
                linear-gradient(transparent 95%, rgba(217, 70, 239, 0.5) 95%),
                linear-gradient(90deg, transparent 95%, rgba(6, 182, 212, 0.5) 95%)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(300px) rotateX(45deg)',
            transformOrigin: 'bottom'
        }}
      ></div>

      {/* Falling Tetrominoes Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
          {/* I Piece (Cyan) */}
          <div className="absolute left-[10%] -top-20 animate-fall w-4 h-16 flex flex-col gap-0.5" style={{ animationDuration: '7s', animationDelay: '0s' }}>
              <div className="h-4 w-4 border border-cyan-400 bg-cyan-400/20"></div>
              <div className="h-4 w-4 border border-cyan-400 bg-cyan-400/20"></div>
              <div className="h-4 w-4 border border-cyan-400 bg-cyan-400/20"></div>
              <div className="h-4 w-4 border border-cyan-400 bg-cyan-400/20"></div>
          </div>
           {/* O Piece (Yellow) */}
           <div className="absolute left-[70%] -top-20 animate-fall w-8 h-8 grid grid-cols-2 gap-0.5" style={{ animationDuration: '9s', animationDelay: '2s' }}>
              <div className="h-4 w-4 border border-yellow-400 bg-yellow-400/20"></div>
              <div className="h-4 w-4 border border-yellow-400 bg-yellow-400/20"></div>
              <div className="h-4 w-4 border border-yellow-400 bg-yellow-400/20"></div>
              <div className="h-4 w-4 border border-yellow-400 bg-yellow-400/20"></div>
          </div>
          {/* T Piece (Purple) */}
           <div className="absolute left-[30%] -top-20 animate-fall w-12 h-8 flex flex-col items-center gap-0.5" style={{ animationDuration: '11s', animationDelay: '4s' }}>
              <div className="flex gap-0.5">
                  <div className="h-4 w-4 border border-fuchsia-400 bg-fuchsia-400/20"></div>
                  <div className="h-4 w-4 border border-fuchsia-400 bg-fuchsia-400/20"></div>
                  <div className="h-4 w-4 border border-fuchsia-400 bg-fuchsia-400/20"></div>
              </div>
              <div className="h-4 w-4 border border-fuchsia-400 bg-fuchsia-400/20"></div>
          </div>
           {/* L Piece (Orange) */}
           <div className="absolute left-[85%] -top-20 animate-fall w-8 h-12 flex gap-0.5" style={{ animationDuration: '8s', animationDelay: '1s' }}>
              <div className="flex flex-col gap-0.5">
                  <div className="h-4 w-4 border border-orange-400 bg-orange-400/20"></div>
                  <div className="h-4 w-4 border border-orange-400 bg-orange-400/20"></div>
                  <div className="h-4 w-4 border border-orange-400 bg-orange-400/20"></div>
              </div>
              <div className="h-4 w-4 border border-orange-400 bg-orange-400/20 mt-auto"></div>
          </div>
           {/* Z Piece (Red) */}
           <div className="absolute left-[50%] -top-20 animate-fall w-12 h-8" style={{ animationDuration: '10s', animationDelay: '5s' }}>
               <div className="flex gap-0.5 ml-4">
                  <div className="h-4 w-4 border border-red-500 bg-red-500/20"></div>
                  <div className="h-4 w-4 border border-red-500 bg-red-500/20"></div>
               </div>
               <div className="flex gap-0.5 mr-4 -mt-0.5">
                  <div className="h-4 w-4 border border-red-500 bg-red-500/20"></div>
                  <div className="h-4 w-4 border border-red-500 bg-red-500/20"></div>
               </div>
          </div>
      </div>
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0f0c29]/90 pointer-events-none z-10"></div>

      {/* Top Bar */}
      <div className="relative z-20 w-full flex justify-end p-4">
        <button 
            onClick={onChangeBook}
            className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-cyan-500/50 rounded-lg px-3 py-1 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:bg-cyan-900/30 transition-all active:scale-95 group"
        >
            <Book size={14} className="text-cyan-400 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-bold text-cyan-100 tracking-wider uppercase truncate max-w-[120px] shadow-cyan-500/50">
                {currentBook.name.split('(')[0]}
            </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center -mt-8">
        
        {/* Title Section */}
        <div className="flex flex-col items-center mb-10 relative group cursor-default">
            {/* Glow behind logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-fuchsia-600/30 rounded-full blur-[60px] animate-pulse"></div>

            <div className="relative z-10 transform transition-transform group-hover:scale-105 duration-500 flex flex-col items-center">
                <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 via-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
                    WORD
                </h1>
                <div className="relative">
                    <h1 className="text-5xl font-black tracking-[0.2em] text-fuchsia-500 drop-shadow-[2px_2px_0_#4a044e] mt-[-5px]"
                        style={{ textShadow: '0 0 20px rgba(217,70,239,0.8)' }}>
                        TETRIS
                    </h1>
                     {/* Glitch Overlay Effect */}
                     <div className="absolute inset-0 text-5xl font-black tracking-[0.2em] text-cyan-400 opacity-30 animate-pulse" style={{ left: '-2px', animationDuration: '0.2s' }}>TETRIS</div>
                     <div className="absolute inset-0 text-5xl font-black tracking-[0.2em] text-red-500 opacity-30 animate-pulse" style={{ left: '2px', animationDuration: '0.3s' }}>TETRIS</div>
                </div>
            </div>
            
            {/* Animated Tetris Shapes Decoration */}
            <div className="mt-8 flex gap-8 items-end">
                 {/* S Piece (Green) */}
                 <div className="animate-bounce delay-0 transform -rotate-12">
                     <div className="flex gap-1">
                         <div className="w-0.5"></div><div className="w-3 h-3 bg-green-400 border border-green-200 shadow-[0_0_5px_lime]"></div><div className="w-3 h-3 bg-green-400 border border-green-200 shadow-[0_0_5px_lime]"></div>
                     </div>
                     <div className="flex gap-1 -mt-[1px]">
                         <div className="w-3 h-3 bg-green-400 border border-green-200 shadow-[0_0_5px_lime]"></div><div className="w-3 h-3 bg-green-400 border border-green-200 shadow-[0_0_5px_lime]"></div>
                     </div>
                 </div>

                 {/* T Piece (Purple) */}
                 <div className="animate-bounce delay-100 mb-2">
                     <div className="flex gap-1 justify-center">
                         <div className="w-3 h-3 bg-fuchsia-500 border border-fuchsia-300 shadow-[0_0_5px_magenta]"></div><div className="w-3 h-3 bg-fuchsia-500 border border-fuchsia-300 shadow-[0_0_5px_magenta]"></div><div className="w-3 h-3 bg-fuchsia-500 border border-fuchsia-300 shadow-[0_0_5px_magenta]"></div>
                     </div>
                     <div className="flex gap-1 justify-center -mt-[1px]">
                         <div className="w-3 h-3 bg-fuchsia-500 border border-fuchsia-300 shadow-[0_0_5px_magenta]"></div>
                     </div>
                 </div>

                 {/* L Piece (Orange) */}
                 <div className="animate-bounce delay-200 transform rotate-12">
                     <div className="flex flex-col gap-[1px]">
                        <div className="w-3 h-3 bg-orange-400 border border-orange-200 shadow-[0_0_5px_orange]"></div>
                        <div className="w-3 h-3 bg-orange-400 border border-orange-200 shadow-[0_0_5px_orange]"></div>
                        <div className="flex gap-[1px]">
                             <div className="w-3 h-3 bg-orange-400 border border-orange-200 shadow-[0_0_5px_orange]"></div>
                             <div className="w-3 h-3 bg-orange-400 border border-orange-200 shadow-[0_0_5px_orange]"></div>
                        </div>
                     </div>
                 </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-[260px] px-4">
            
            {/* Start Button */}
            <button 
                onClick={onStart}
                className="group relative w-full h-16 bg-black/60 overflow-hidden"
                style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/50 to-blue-600/50 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20"></div>

                {/* Cyberpunk borders */}
                <div className="absolute left-0 top-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                <div className="absolute left-0 bottom-0 w-[15px] h-[2px] bg-cyan-400"></div>
                <div className="absolute right-0 bottom-0 w-full h-[2px] bg-cyan-400"></div>
                <div className="absolute right-0 top-0 w-[2px] h-full bg-cyan-400"></div>
                <div className="absolute left-0 top-0 w-[2px] h-[calc(100%-15px)] bg-cyan-400"></div>
                
                <div className="relative flex items-center justify-center gap-3 h-full z-10">
                    <Play size={24} className="text-cyan-300 fill-cyan-300/50 filter drop-shadow-[0_0_5px_rgba(34,211,238,1)]" />
                    <span className="text-2xl font-black text-white tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] italic">START</span>
                </div>
            </button>

            {/* Leaderboard Button */}
            <button 
                onClick={onLeaderboard}
                className="group relative w-full h-12 bg-black/60 overflow-hidden mt-1"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
                 <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/40 to-purple-600/40 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                 <div className="absolute inset-0 border border-fuchsia-500/50 group-hover:border-fuchsia-400 transition-colors"></div>

                 <div className="relative flex items-center justify-center gap-3 h-full z-10">
                    <Trophy size={18} className="text-fuchsia-400" />
                    <span className="text-lg font-black text-fuchsia-100 tracking-widest drop-shadow-[0_0_5px_rgba(232,121,249,0.8)]">RANKING</span>
                </div>
            </button>

        </div>
        
        {/* Footer Text */}
        <div className="absolute bottom-6 text-[10px] text-cyan-500/60 font-mono tracking-[0.3em] animate-pulse flex flex-col items-center">
             <span>INSERT COIN</span>
             <span className="text-[8px] mt-1 opacity-50">High Score: 999999</span>
        </div>

      </div>
    </div>
  );
};
