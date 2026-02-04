import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const ConsoleShell: React.FC<Props> = ({ children }) => {
  const dispatch = (action: string) => {
    window.dispatchEvent(new CustomEvent('control-input', { detail: action }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Device Body */}
      <div className="relative w-full max-w-[420px] aspect-[9/18] bg-[#D12B56] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_-8px_4px_rgba(0,0,0,0.2)] border-4 border-[#A01B3D] flex flex-col items-center p-6 select-none">
        
        {/* Glossy Reflection on Body */}
        <div className="absolute top-4 left-4 right-4 h-32 bg-gradient-to-b from-white/20 to-transparent rounded-[30px] pointer-events-none"></div>

        {/* Screen Area */}
        <div className="w-full aspect-[9/13] bg-black rounded-xl p-[2px] mb-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] relative z-10 flex flex-col border-4 border-[#333]">
            {/* Screen Protector / Glass Reflection */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-br from-white/5 to-transparent rounded-lg"></div>
            
            {/* The Actual LCD Screen */}
            <div className="flex-1 bg-[#FFF8E1] rounded-lg overflow-hidden relative">
                {children}
            </div>
            
            {/* Branding under screen */}
            <div className="h-6 flex items-center justify-center bg-black">
                <span className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">English Master</span>
            </div>
        </div>

        {/* Controls Area */}
        <div className="flex-1 w-full relative">
            
            {/* D-Pad */}
            <div className="absolute top-2 left-6 w-36 h-36">
                 {/* Cross Base */}
                 <div className="absolute inset-0 bg-[#A01B3D]/50 rounded-full transform scale-90 blur-sm"></div>
                 <div className="w-full h-full relative">
                      <div className="absolute top-0 left-1/3 w-1/3 h-full bg-[#111] rounded shadow-[0_2px_5px_rgba(0,0,0,0.5)]"></div>
                      <div className="absolute top-1/3 left-0 w-full h-1/3 bg-[#111] rounded shadow-[0_2px_5px_rgba(0,0,0,0.5)]"></div>
                      <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-[#111] radial-gradient(circle at center, #222 0%, #111 100%)">
                        <div className="w-4 h-4 bg-[#0a0a0a] rounded-full opacity-50 m-auto mt-2"></div>
                      </div>

                      {/* Click Areas */}
                      <button className="absolute top-0 left-1/3 w-1/3 h-1/3 active:bg-[#333] rounded-t-sm flex justify-center pt-1" onPointerDown={() => dispatch('ArrowUp')}>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#333]"></div>
                      </button>
                      <button className="absolute bottom-0 left-1/3 w-1/3 h-1/3 active:bg-[#333] rounded-b-sm flex justify-center items-end pb-1" onPointerDown={() => dispatch('ArrowDown')}>
                         <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#333]"></div>
                      </button>
                      <button className="absolute top-1/3 left-0 w-1/3 h-1/3 active:bg-[#333] rounded-l-sm flex items-center pl-1" onPointerDown={() => dispatch('ArrowLeft')}>
                         <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-[#333]"></div>
                      </button>
                      <button className="absolute top-1/3 right-0 w-1/3 h-1/3 active:bg-[#333] rounded-r-sm flex items-center justify-end pr-1" onPointerDown={() => dispatch('ArrowRight')}>
                         <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-[#333]"></div>
                      </button>
                 </div>
            </div>

            {/* Tian Button */}
            <div className="absolute top-6 right-8 flex flex-col items-center gap-2">
                <button 
                    className="w-20 h-20 bg-[#111] rounded-2xl shadow-[0_5px_0_#000,0_10px_10px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-[5px] flex items-center justify-center border-t border-gray-700"
                    onPointerDown={() => dispatch('Enter')} // Map to Enter/Confirm
                >
                    <div className="grid grid-cols-2 gap-1.5 opacity-80">
                         <div className="w-3 h-3 bg-[#333] rounded-sm"></div>
                         <div className="w-3 h-3 bg-[#333] rounded-sm"></div>
                         <div className="w-3 h-3 bg-[#333] rounded-sm"></div>
                         <div className="w-3 h-3 bg-[#333] rounded-sm"></div>
                    </div>
                </button>
                <span className="text-[#901e3b] font-bold text-xs uppercase tracking-wider drop-shadow-sm">Confirm</span>
            </div>

            {/* Speakers */}
            <div className="absolute bottom-4 right-8 flex gap-2 transform -rotate-12 opacity-50">
                 <div className="w-1.5 h-10 bg-[#901e3b] rounded-full"></div>
                 <div className="w-1.5 h-10 bg-[#901e3b] rounded-full"></div>
                 <div className="w-1.5 h-10 bg-[#901e3b] rounded-full"></div>
            </div>

        </div>
        
      </div>
    </div>
  );
};