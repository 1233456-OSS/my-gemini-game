import React from 'react';
import { HighScore } from '../types';
import { Trophy, ArrowLeft, Star, Crown } from 'lucide-react';

interface Props {
  scores: HighScore[];
  onBack: () => void;
}

export const ScreenLeaderboard: React.FC<Props> = ({ scores, onBack }) => {
  return (
    <div className="w-full h-full bg-[#FFF9C4] p-4 flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Gradient & Grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-pink-100 to-yellow-100 opacity-80"></div>
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#FBC02D 2px, transparent 2px)', backgroundSize: '20px 20px' }}
      ></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <button 
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full border-2 border-blue-200 shadow-sm flex items-center justify-center text-blue-400 active:scale-90 transition-transform"
        >
            <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <div className="bg-white/80 backdrop-blur px-6 py-2 rounded-full border-2 border-yellow-300 shadow-sm">
            <h2 className="text-xl font-black text-yellow-500 tracking-wider flex items-center gap-2">
                <Crown size={20} fill="currentColor" />
                排行榜
            </h2>
        </div>
        <div className="w-10"></div>
      </div>

      {/* List */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 -mr-2 space-y-3 custom-scrollbar">
        {scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 font-bold gap-3">
                <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center">
                    <Star size={40} className="text-yellow-300" fill="currentColor" />
                </div>
                <p>暂无记录</p>
            </div>
        ) : (
            scores.map((s, i) => (
                <div 
                    key={i} 
                    className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-[0_4px_0_#E0E0E0] border-2 border-transparent transform transition-transform hover:scale-[1.02]"
                >
                    <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm
                            ${i === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-[0_2px_0_#E65100]' : 
                              i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-[0_2px_0_#616161]' : 
                              i === 2 ? 'bg-gradient-to-br from-orange-300 to-red-300 shadow-[0_2px_0_#BF360C]' : 'bg-blue-200 text-blue-500'}
                        `}>
                            {i < 3 ? <Trophy size={18} fill="currentColor"/> : i + 1}
                        </div>
                        
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 rounded-md self-start mb-0.5">{s.book}</span>
                            <span className="text-xs font-bold text-gray-600">{s.date}</span>
                        </div>
                    </div>
                    
                    <div className="text-xl font-black text-orange-500">
                        {s.score}
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Footer Cloud */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-64 h-24 bg-white rounded-full blur-xl opacity-60 z-0"></div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
};
