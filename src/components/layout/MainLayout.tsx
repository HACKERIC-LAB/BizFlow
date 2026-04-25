import { type ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-background md:bg-neutral-darkNavy flex justify-center items-center md:p-4 lg:p-8">
      {/* Phone Frame for Desktop */}
      <div className="w-full h-screen md:h-auto md:max-w-[414px] md:aspect-[9/19.5] md:max-h-[896px] bg-white flex flex-col relative md:shadow-2xl md:rounded-[3rem] overflow-hidden md:border-[8px] md:border-neutral-darkNavy">
        {/* Mock Status Bar - Only on Desktop */}
        <div className="hidden md:flex h-10 bg-white items-center justify-between px-8 pt-4 pb-2 text-[12px] font-bold z-50">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="7" width="16" height="10" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" /></svg>
          </div>
        </div>
        
        {/* App Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-neutral-background">
          <AppHeader />
          <main className="flex-1 overflow-y-auto pb-20 pt-4 px-4 w-full">
            {children}
          </main>
          <BottomNavigation />
        </div>
        
        {/* Home Indicator - Only on Desktop */}
        <div className="hidden md:flex h-6 bg-white justify-center items-end pb-2">
          <div className="w-32 h-1 bg-neutral-darkNavy/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
