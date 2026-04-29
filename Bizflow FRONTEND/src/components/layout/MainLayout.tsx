import { type ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';
import { AIChatFAB } from './AIChatFAB';

interface MainLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export const MainLayout = ({ children, hideBottomNav }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background Gradient Layer */}
      <div className="absolute inset-0 z-0 soft-gradient-bg pointer-events-none" />
      
      {/* Phone Frame for Desktop */}
      <div className="w-full h-screen md:h-[844px] md:max-w-[390px] bg-white flex flex-col relative md:shadow-2xl md:rounded-[3rem] overflow-hidden md:border-[12px] md:border-slate-800 z-10">
        {/* Mock Status Bar - Only on Desktop */}
        <div className="hidden md:flex h-12 bg-primary items-center justify-between px-8 pt-6 pb-2 text-[12px] font-bold z-50 text-white/80">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><path d="M15 3.5V5H16.5V3.5H15ZM15 6V7.5H16.5V6H15ZM15 8.5V10H16.5V8.5H15ZM13 3.5V5H14.5V3.5H13ZM13 6V7.5H14.5V6H13ZM13 8.5V10H14.5V8.5H13ZM11 3.5V5H12.5V3.5H11ZM11 6V7.5H12.5V6H11ZM11 8.5V10H12.5V8.5H11ZM9 3.5V5H10.5V3.5H9ZM9 6V7.5H10.5V6H9ZM9 8.5V10H10.5V8.5H9ZM7 3.5V5H8.5V3.5H7ZM7 6V7.5H8.5V6H7ZM7 8.5V10H8.5V8.5H7ZM5 6V7.5H6.5V6H5ZM5 8.5V10H6.5V8.5H5ZM3 8.5V10H4.5V8.5H3Z"/></svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 0C3.35 0 0 3.35 0 7.5C0 9.15 0.55 10.7 1.55 12L7.5 20L13.45 12C14.45 10.7 15 9.15 15 7.5C15 3.35 11.65 0 7.5 0Z"/></svg>
            <div className="w-6 h-3 border border-current rounded-sm relative"><div className="absolute left-0.5 top-0.5 bottom-0.5 right-1 bg-current rounded-px" /></div>
          </div>
        </div>
        
        {/* App Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
          <AppHeader />
          <main className="flex-1 overflow-y-auto pb-24 pt-2 px-5 w-full no-scrollbar relative z-10">
            {children}
          </main>
          <AIChatFAB />
          {!hideBottomNav && <BottomNavigation />}
        </div>
        
        {/* Home Indicator - Only on Desktop */}
        <div className="hidden md:flex h-8 bg-transparent justify-center items-center">
          <div className="w-32 h-1.5 bg-slate-800/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
