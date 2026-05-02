import { Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const AIChatFAB = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);

  // Only show for Owners and Managers
  if (!user || (user.role !== 'OWNER' && user.role !== 'MANAGER')) return null;

  // Don't show if we're already on the AI page
  if (location.pathname === '/ai') return null;

  return (
    <button
      onClick={() => navigate('/ai')}
      className="fixed md:absolute bottom-32 right-6 w-14 h-14 bg-coffee-900 text-white rounded-full shadow-large z-50 flex items-center justify-center hover:scale-110 active:scale-95 transition-standard group animate-pulse-gold"
      aria-label="AI Assistant"
    >
      <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping group-hover:animate-none" />
      <Sparkles size={24} className="relative z-10 text-accent" fill="currentColor" />
    </button>
  );
};
