import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  TrendingUp, 
  Users, 
  UsersRound, 
  Calendar, 
  Plus, 
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../store/authStore';
import { getBusinessContent } from '../../utils/businessUtils';

const KPI = ({ label, value, icon: Icon, trend, color }: any) => (
  <Card className="flex flex-col justify-between h-32 relative overflow-hidden group">
    <div className="absolute -right-4 -top-4 w-16 h-16 bg-neutral-background rounded-full opacity-50 group-hover:scale-150 transition-standard" />
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-button bg-${color}-light text-${color}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-mpesa-green">
          <ArrowUpRight size={14} className="mr-0.5" /> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">{label}</p>
      <p className="text-xl font-bold text-neutral-darkNavy">{value}</p>
    </div>
  </Card>
);

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const content = getBusinessContent(user?.businessType);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Good Morning!</h2>
            <p className="body-small text-neutral-textLight">Here's what's happening today.</p>
          </div>
          <Button 
            size="sm" 
            leftIcon={<Zap size={16} />} 
            variant="secondary"
            onClick={() => navigate('/ai')}
          >
            AI Insight
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI label="Revenue" value="KSh 12,450" icon={TrendingUp} trend="+12%" color="primary" />
          <KPI label={content.customersLabel} value="24" icon={Users} trend="+5" color="blue" />
          <KPI label="Queue" value="6" icon={UsersRound} color="gold" />
          <KPI label="Bookings" value="8" icon={Calendar} color="primary" />
        </div>

        {/* Team Management Quick Access */}
        <section>
          <Card className="flex items-center justify-between p-4 bg-blue-light/30 border-blue/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue flex items-center justify-center text-white">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-darkNavy">Team & Staff</h4>
                <p className="text-xs text-neutral-textLight">Manage roles, commission, and access</p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate('/staff-management')}>
              Manage
            </Button>
          </Card>
        </section>

        {/* Live Queue Preview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base uppercase tracking-wider text-neutral-textLight font-bold">Live Queue</h3>
            <button onClick={() => navigate('/queue')} className="text-sm text-primary font-bold hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="flex items-center justify-between py-3 border-l-4 border-l-gold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-light text-gold flex items-center justify-center font-bold text-xs">
                    #{i}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{content.customersLabel.slice(0, -1)} Name {i}</p>
                    <p className="text-[10px] text-neutral-textLight">{content.defaultServices[0]} • 15 mins left</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 bg-gold-light text-gold font-bold rounded-badge uppercase">
                    Waiting
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Revenue Chart Teaser */}
        <Card className="p-6 h-64 flex flex-col items-center justify-center border-dashed">
          <TrendingUp size={40} className="text-neutral-border mb-4" />
          <p className="text-neutral-textLight font-medium">Revenue Analytics Chart</p>
          <p className="text-xs text-neutral-textLight mt-1">Detailed reports coming soon</p>
        </Card>

        {/* AI Tip */}
        <Card className="bg-primary-dark text-white border-none relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-card backdrop-blur-sm">
              <Sparkles className="text-gold" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">AI Recommendation</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Most customers arrive between 4 PM and 6 PM. Consider adding an extra staff member during this peak time.
              </p>
            </div>
          </div>
        </Card>

        {/* FAB Space */}
        <div className="h-10" />
      </div>

      {/* FAB */}
      <button 
        onClick={() => navigate('/transactions/new')}
        className="fixed md:absolute bottom-20 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-large flex items-center justify-center hover:bg-primary-dark hover:scale-110 active:scale-95 transition-standard z-40"
      >
        <Plus size={28} />
      </button>
    </MainLayout>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

export default OwnerDashboard;
