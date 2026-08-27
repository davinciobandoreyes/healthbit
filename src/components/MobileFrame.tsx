import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileView: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isMobileView }) => {
  if (!isMobileView) {
    return <div className="w-full min-h-screen bg-slate-50 pb-12">{children}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-slate-200 py-6 px-2 flex justify-center items-start overflow-x-hidden">
      <div className="relative w-full max-w-[430px] min-h-[880px] bg-slate-50 rounded-[48px] shadow-2xl border-[10px] border-white ring-1 ring-slate-300 overflow-hidden flex flex-col my-auto">
        {/* Dynamic Island / Notch Mock */}
        <div className="w-full bg-slate-50 pt-3 pb-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-800 border-b border-slate-100 select-none">
          <span>9:41</span>
          <div className="w-24 h-4 bg-slate-900/10 rounded-full mx-auto"></div>
          <div className="flex items-center gap-1 text-slate-600">
            <span className="material-symbols-outlined text-xs">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-xs">wifi</span>
            <span className="material-symbols-outlined text-xs">battery_full</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Bottom Home Indicator */}
        <div className="w-full bg-slate-50 py-2 flex justify-center">
          <div className="w-32 h-1 bg-slate-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

