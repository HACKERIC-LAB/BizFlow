import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UsersRound, Calendar, Settings, Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/user';

interface NavItem {
  label: string;
  path: string;
  icon: any;
}

const ROLE_NAV: Record<UserRole, NavItem[]> = {
  OWNER: [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Queue', path: '/queue', icon: UsersRound },
    { label: 'Team', path: '/staff-management', icon: Users },
    { label: 'Clients', path: '/customers', icon: Users },
  ],
  MANAGER: [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Queue', path: '/queue', icon: UsersRound },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Clients', path: '/customers', icon: Users },
  ],
  STAFF: [
    { label: 'Queue', path: '/queue', icon: UsersRound },
    { label: 'Clients', path: '/customers', icon: Users },
    { label: 'Booking', path: '/appointments', icon: Calendar },
    { label: 'Profile', path: '/profile', icon: Settings },
  ],
  VIEWER: [
    { label: 'Home', path: '/dashboard-viewer', icon: LayoutDashboard },
    { label: 'Clients', path: '/customers', icon: Users },
    { label: 'Booking', path: '/appointments', icon: Calendar },
  ],
};

export const BottomNavigation = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const items = ROLE_NAV[user.role] || [];

  return (
    <div className="fixed md:absolute bottom-0 left-0 z-50 w-full px-6 pb-6 pointer-events-none">
      <nav className="w-full bg-white h-24 flex items-center justify-between px-2 rounded-3xl shadow-[0_-10px_40px_rgba(59,35,27,0.08)] border-2 border-coffee-100 pointer-events-auto relative animate-slide-up">
        {/* First Half */}
        <div className="flex flex-1 justify-around">
          {items.slice(0, Math.ceil(items.length / 2)).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center py-2 gap-1.5 transition-all duration-300
                ${isActive ? 'text-coffee-900 scale-110 drop-shadow-md' : 'text-coffee-500 hover:text-coffee-600 hover:scale-105'}
              `}
            >
              <item.icon size={26} strokeWidth={2.5} />
              <span className="text-[11px] font-black tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Center FAB */}
        <div className="relative -top-10 flex flex-col items-center">
          <button 
            onClick={() => window.location.href = '/transactions/new'}
            className="w-20 h-20 bg-coffee-900 text-white rounded-full shadow-[0_10px_30px_rgba(59,35,27,0.3)] border-4 border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative group"
          >
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={40} strokeWidth={3} className="relative z-10" />
          </button>
        </div>

        {/* Second Half */}
        <div className="flex flex-1 justify-around">
          {items.slice(Math.ceil(items.length / 2)).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center py-2 gap-1.5 transition-all duration-300
                ${isActive ? 'text-coffee-900 scale-110 drop-shadow-md' : 'text-coffee-500 hover:text-coffee-600 hover:scale-105'}
              `}
            >
              <item.icon size={26} strokeWidth={2.5} />
              <span className="text-[11px] font-black tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
