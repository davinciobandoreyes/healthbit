import React from 'react';
import { Home, FileText, Users, Settings, UserCheck } from 'lucide-react';
import { DoctorPortalTab } from '../types';

interface BottomTabBarProps {
  currentTab: DoctorPortalTab;
  onSelectTab: (tab: DoctorPortalTab) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: DoctorPortalTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav
      aria-label="Navegación inferior estilo iOS"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-t border-slate-200/80 shadow-lg shadow-slate-900/5 transition-all"
    >
      <div className="max-w-md md:max-w-lg mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-around h-16 sm:h-18">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id || (tab.id === 'patients' && currentTab === 'patient-photos');

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all duration-200 select-none group active:scale-95 cursor-pointer`}
              >
                {/* Active Indicator Glow / Pill */}
                {isActive && (
                  <span className="absolute top-1.5 w-10 h-1 rounded-full bg-violet-600 animate-fadeIn" />
                )}

                <div
                  className={`relative p-1 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-violet-600 scale-110'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>

                <span
                  className={`text-[11px] sm:text-xs font-semibold tracking-tight transition-colors duration-200 mt-0.5 ${
                    isActive
                      ? 'text-violet-700 font-bold'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
