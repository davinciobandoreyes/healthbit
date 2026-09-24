import React from 'react';
import { X } from 'lucide-react';

interface SheetPopoverProps {
  titleId: string;
  title: string;
  closeLabel: string;
  onClose: () => void;
  hiddenOnDesktop?: boolean;
  offsetTabBar?: boolean;
  children: React.ReactNode;
}

export const SheetPopover: React.FC<SheetPopoverProps> = ({
  titleId,
  title,
  closeLabel,
  onClose,
  hiddenOnDesktop = false,
  offsetTabBar = false,
  children,
}) => (
  <div
    className={`${hiddenOnDesktop ? 'lg:hidden ' : ''}fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-xs animate-fadeIn p-8 ${offsetTabBar ? 'pb-28 lg:pb-8' : ''} sm:p-0`}
    onClick={onClose}
  >
    <div
      className="w-full lg:max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl sm:rounded-t-3xl sm:rounded-b-none bg-slate-50 p-3 pt-2 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="relative flex items-center justify-end px-1 pb-1 min-h-[44px]">
        <span className="w-10 h-1 rounded-full bg-slate-300 absolute left-1/2 top-3 -translate-x-1/2" />
        <span id={titleId} className="sr-only">
          {title}
        </span>
        <span className="w-10" />
        <button
          type="button"
          onClick={onClose}
          className="p-2 min-h-[44px] min-w-[44px] rounded-full bg-white border border-slate-200/80 text-slate-600 cursor-pointer flex items-center justify-center"
          aria-label={closeLabel}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  </div>
);
