import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { 
  TrendingUp, 
  Users, 
  UsersRound, 
  Calendar, 
  Sparkles,
  ChevronRight,
  BarChart3,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { getBusinessContent } from '../../utils/businessUtils';
import { transactionApi } from '../../services/transactionApi';
import { queueApi } from '../../services/queueApi';
import toast from 'react-hot-toast';

const KPI = ({ label, value, icon: Icon, trend, variant = 'default' }: any) => (
  <Card hover variant={variant} className="flex flex-col justify-between h-40 p-5 relative overflow-hidden">
    <div className="flex justify-between items-start z-10">
      <div className={`p-2.5 rounded-xl ${variant === 'primary' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`flex items-center px-2 py-0.5 rounded-badge text-[10px] font-bold ${variant === 'primary' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="z-10 mt-4">
      <p className={`text-2xl font-bold tracking-tight ${variant === 'primary' ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${variant === 'primary' ? 'text-white/70' : 'text-slate-400'}`}>{label}</p>
    </div>
  </Card>
);

const OwnerDashboard = () => {
  const user = useAuthStore(state => state.user);
  const content = getBusinessContent(user?.businessType);
  const [stats, setStats] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('performance');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, queueRes] = await Promise.all([
          transactionApi.getDailySummary(),
          queueApi.getActive()
        ]);
        setStats(summaryRes.data);
        setQueue(queueRes.data.slice(0, 3));
      } catch (error) {
        toast.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Tab Selection */}
        <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
          <button 
            onClick={() => setActiveTab('performance')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'performance' ? 'bg-primary text-white shadow-medium' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Performance
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-primary text-white shadow-medium' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'performance' ? (
          <>
            {/* Main Score Area */}
            <div className="relative py-4 text-center overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="relative inline-block mb-2">
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
                  {stats?.totalRevenue ? (stats.totalRevenue / 1000).toFixed(1) : '0.0'}
                  <span className="text-2xl text-primary ml-1">k</span>
                </h1>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Revenue Generated Today</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="px-2 py-0.5 rounded-badge bg-primary/10 text-[10px] font-bold text-primary flex items-center">
                  <TrendingUp size={12} className="mr-1" /> Top Performance Today
                </div>
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4">
              <KPI 
                label="Revenue" 
                value={`KSh ${stats?.totalRevenue?.toLocaleString() || 0}`} 
                icon={TrendingUp} 
                trend={stats?.totalRevenue > 0 ? "+Real" : undefined} 
                variant="primary"
              />
              <KPI 
                label={content.customersLabel} 
                value={stats?.customerCount || 0} 
                icon={Users} 
                trend={stats?.customerCount > 0 ? "Live" : undefined} 
                variant="default"
              />
            </div>

            {/* Today's Activity Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Today's Activity</h3>
                <button className="text-[10px] font-bold text-primary uppercase tracking-wider" onClick={() => toast.success('Filter coming soon!')}>Filter</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card variant="flat" className="p-4 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{stats?.appointmentCount || 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bookings</p>
                  </div>
                </Card>
                <Card variant="flat" className="p-4 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <UsersRound size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{queue.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Queue</p>
                  </div>
                </Card>
              </div>
            </section>
          </>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* Analytics Content */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Revenue Trends</h3>
              <Card className="p-6 bg-slate-900 border-none shadow-large relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Weekly Total</p>
                    <h4 className="text-2xl font-black text-white">KSh {(stats?.weeklyRevenue || 0).toLocaleString()}</h4>
                  </div>
                  {stats?.weeklyRevenue > 0 && (
                    <div className="flex items-center gap-1 text-mpesa-green text-xs font-bold bg-mpesa-green/10 px-2 py-1 rounded-badge">
                      <ArrowUpRight size={14} /> Live Data
                    </div>
                  )}
                </div>
                {/* Visual indicator of data presence */}
                <div className="flex items-end justify-between h-24 gap-2">
                  {stats?.totalRevenue > 0 ? (
                    [20, 30, 25, 45, 60, stats?.totalRevenue > 5000 ? 90 : 40, 50].map((h, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-t-lg transition-all duration-1000 ${i === 5 ? 'bg-primary' : 'bg-white/10'}`} 
                        style={{ height: `${h}%` }}
                      />
                    ))
                  ) : (
                    <div className="w-full flex items-center justify-center text-white/20 text-xs italic">No activity recorded yet</div>
                  )}
                </div>
              </Card>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-5 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue/10 text-blue flex items-center justify-center mb-3">
                  <PieChart size={24} />
                </div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Returning Rate</h5>
                <p className="text-xl font-bold text-slate-900 mt-1">{stats?.returningRate?.toFixed(0) || 0}% <span className="text-[10px] text-slate-400">Ret.</span></p>
              </Card>
              <Card className="p-5 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-3">
                  <BarChart3 size={24} />
                </div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Top Service</h5>
                <p className="text-sm font-bold text-slate-900 mt-1 truncate w-full px-2">
                  {stats?.topServices?.[0]?.name || 'N/A'}
                </p>
              </Card>
            </div>

            {/* AI Intelligent Forecast */}
            <Card className="bg-primary/5 border-none p-6 relative overflow-hidden group shadow-subtle rounded-3xl">
              <div className="flex gap-4 items-center relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-medium flex items-center justify-center text-primary group-hover:scale-110 transition-standard">
                  <Sparkles size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-black text-slate-900">AI Insights</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {stats?.totalRevenue > 0 
                      ? "Based on today's performance, we suggest focusing on your top services to maximize evening revenue."
                      : "Start recording transactions to enable AI-powered business insights and growth forecasts."}
                  </p>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </Card>
          </div>
        )}

        {/* Team Management Quick Link */}
        <button 
          onClick={() => window.location.href = '/staff-management'}
          className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-subtle hover:shadow-medium transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-standard">
              <UsersRound size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">Manage Your Team</h4>
              <p className="text-xs text-slate-400">Add Managers, Staff & set roles</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-standard">
            <ChevronRight size={18} />
          </div>
        </button>

        <div className="h-24" />
      </div>
    </MainLayout>
  );
};

export default OwnerDashboard;
