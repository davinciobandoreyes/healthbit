import React from 'react';
import { Activity, PanelLeft, PanelLeftClose } from 'lucide-react';
import { AppNavItem } from '../nav';

interface AppSidebarProps {
  items: AppNavItem[];
  currentId: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  items,
  currentId,
  onSelect,
  collapsed,
  onToggleCollapsed,
}) => {
  return (
    <aside
      className={`hidden lg:flex flex-col h-screen sticky top-0 shrink-0 bg-white border-r border-slate-200/80 z-40 transition-[width] duration-200 ${
        collapsed ? 'w-[72px]' : 'w-[232px]'
      }`}
      aria-label="Navegación principal"
    >
      <div className={`flex items-center gap-2.5 h-16 px-3 border-b border-slate-200/80 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-400 text-white flex items-center justify-center shadow-xs shadow-violet-200 shrink-0">
          <Activity className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        {!collapsed && (
          <span className="font-extrabold text-lg tracking-tight text-slate-900 whitespace-nowrap">
            Health<span className="text-violet-600">Bit</span>
          </span>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full min-h-[44px] flex items-center rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                collapsed ? 'justify-center px-0' : 'gap-2.5 px-3'
              } ${
                isActive
                  ? 'text-violet-700 bg-violet-50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-slate-200/80">
        <button
          type="button"
          onClick={onToggleCollapsed}
          title={collapsed ? 'Desplegar menú' : 'Comprimir menú'}
          aria-label={collapsed ? 'Desplegar menú' : 'Comprimir menú'}
          className={`w-full min-h-[44px] flex items-center rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer ${
            collapsed ? 'justify-center px-0' : 'gap-2.5 px-3'
          }`}
        >
          {collapsed ? <PanelLeft className="w-5 h-5 shrink-0" /> : <PanelLeftClose className="w-5 h-5 shrink-0" />}
          {!collapsed && <span className="whitespace-nowrap">Comprimir</span>}
        </button>
      </div>
    </aside>
  );
};
