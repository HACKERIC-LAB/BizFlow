import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const AppHeader = () => {
  const { user } = useAuth();

  return (
    <header className="h-24 flex items-center justify-between px-6 bg-primary relative z-50 rounded-b-[2rem] shadow-medium">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/20 overflow-hidden shadow-subtle border-2 border-white/30 backdrop-blur-md">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=fff&color=0D9488`} 
            alt="profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Welcome back,</p>
          <h2 className="text-base font-bold text-white leading-tight">{user?.name}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => toast('No new notifications', { icon: '🔔' })}
          className="p-3 text-white bg-white/20 rounded-2xl shadow-subtle hover:bg-white/30 transition-standard border border-white/20 backdrop-blur-md"
        >
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
};
