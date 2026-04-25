import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UsersRound, Calendar, Sparkles, Settings } from 'lucide-react';
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
    { label: 'Clients', path: '/customers', icon: Users },
    { label: 'Booking', path: '/appointments', icon: Calendar },
    { label: 'AI', path: '/ai', icon: Sparkles },
    // { label: 'Settings', path: '/settings', icon: Settings },
  ],
  MANAGER: [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Queue', path: '/queue', icon: UsersRound },
    { label: 'Clients', path: '/customers', icon: Users },
    { label: 'AI', path: '/ai', icon: Sparkles },
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
    <nav className="fixed bottom-0 left-0 z-30 w-full bg-white border-t border-neutral-border h-16 flex items-center justify-around px-2 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-standard
            ${isActive ? 'text-primary' : 'text-neutral-textLight hover:text-neutral-textMid'}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} className={isActive ? 'animate-in fade-in zoom-in duration-300' : ''} />
              <span className="text-[10px] font-medium uppercase tracking-tight">{item.label}</span>
              {isActive && <div className="w-1 h-1 bg-primary rounded-full absolute bottom-1" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
