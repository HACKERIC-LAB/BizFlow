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
      <div className={`p-2.5 rounded-xl ${variant === 'primary' ? 'bg-white/20 text-white' : 'bg-coffee-700/10 text-coffee-700'}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`flex items-center px-2 py-0.5 rounded-badge text-[10px] font-bold ${variant === 'primary' ? 'bg-white/20 text-white' : 'bg-coffee-700/10 text-coffee-700'}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="z-10 mt-4">
      <p className={`text-2xl font-bold tracking-tight ${variant === 'primary' ? 'text-white' : 'text-coffee-900'}`}>{value}</p>
      <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${variant === 'primary' ? 'text-white/70' : 'text-coffee-500'}`}>{label}</p>
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
        <div className="flex bg-coffee-100/50 p-1 rounded-2xl border border-coffee-200/50">
          <button 
            onClick={() => setActiveTab('performance')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'performance' ? 'bg-coffee-700 text-white shadow-medium' : 'text-coffee-500 hover:text-coffee-600'}`}
          >
            Performance
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-coffee-700 text-white shadow-medium' : 'text-coffee-500 hover:text-coffee-600'}`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'performance' ? (
          <>
            {/* Main Score Area - Resized to half-height rectangle */}
            <div className="relative py-6 px-6 text-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-coffee-900 via-coffee-700 to-coffee-400 shadow-xl shadow-coffee-400/25 group mb-6">
              {/* Animated Background Elements - Scaled Down */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px] animate-pulse" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative inline-block transform group-hover:scale-110 transition-all duration-700 ease-out cursor-default">
                  <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.35)]">
                    <span className="text-2xl text-white/90 mr-2 uppercase">KSh</span>
                    {stats?.totalRevenue?.toLocaleString() || '0'}
                  </h1>
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-50 mt-1 mb-4 drop-shadow-sm">
                  Daily Revenue Performance
                </p>
                
                <div className="flex items-center justify-center gap-2">
                  <div className="px-4 py-1.5 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 text-[9px] font-black text-white uppercase tracking-[0.1em] flex items-center shadow-lg hover:bg-white/25 transition-all group/badge">
                    <div className="relative mr-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-ping absolute inset-0" />
                      <div className="w-2 h-2 rounded-full bg-accent relative" />
                    </div>
                    <TrendingUp size={12} className="mr-2 text-accent" /> 
                    Top Performance Today
                  </div>
                </div>
              </div>

              {/* Decorative Background Icon - Scaled Down */}
              <div className="absolute -bottom-6 -right-6 text-white/5 transform group-hover:text-white/10 group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000 pointer-events-none">
                <TrendingUp size={140} />
              </div>

              {/* Sweep Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out pointer-events-none" />
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
                <h3 className="text-sm font-bold text-coffee-900 tracking-tight">Today's Activity</h3>
                <button className="text-[10px] font-bold text-coffee-700 uppercase tracking-wider" onClick={() => toast.success('Filter coming soon!')}>Filter</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card variant="flat" className="p-4 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-coffee-900">{stats?.appointmentCount || 0}</p>
                    <p className="text-[10px] font-bold text-coffee-500 uppercase tracking-wider">Bookings</p>
                  </div>
                </Card>
                <Card variant="flat" className="p-4 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-coffee-700/10 text-coffee-700 flex items-center justify-center">
                    <UsersRound size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-coffee-900">{queue.length}</p>
                    <p className="text-[10px] font-bold text-coffee-500 uppercase tracking-wider">In Queue</p>
                  </div>
                </Card>
              </div>
            </section>
          </>
        ) : (
          <div className="space-y-6">
            {/* Analytics Content */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-coffee-900 uppercase tracking-tighter">Revenue Analytics</h3>
                <div className="flex items-center gap-1.5 bg-accent/10 px-2 py-1 rounded-badge border border-accent/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(214,165,111,0.5)]" />
                  <span className="text-[9px] font-black text-accent uppercase tracking-widest">Live Updates</span>
                </div>
              </div>
              
              <Card className="p-6 bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-700 border-none shadow-2xl relative overflow-hidden group rounded-[2rem]">
                {/* Abstract Background Glows */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-coffee-400/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />
                
                <div className="relative z-10 flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-coffee-500 uppercase tracking-[0.25em] mb-2 opacity-80">Weekly Performance</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-accent/80">KSh</span>
                      <h4 className="text-3xl font-black text-white tracking-tighter drop-shadow-sm">
                        {(stats?.weeklyRevenue || 0).toLocaleString()}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl text-accent shadow-inner group-hover:scale-110 group-hover:bg-white/10 transition-all duration-700">
                    <BarChart3 size={22} />
                  </div>
                </div>

                {/* Creative Bar Chart */}
                <div className="flex items-end justify-between h-28 gap-2.5 px-1">
                  {(stats?.weeklyRevenue > 0 || stats?.totalRevenue > 0) ? (
                    (stats?.weeklyData || [25, 40, 35, 60, 85, 70, 55]).map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group/bar">
                        <div className="relative w-full h-full flex items-end">
                          <div 
                            className={`w-full rounded-t-xl transition-all duration-1000 ease-out relative overflow-hidden ${
                              i === 4 
                                ? 'bg-gradient-to-t from-coffee-400 to-accent shadow-[0_0_20px_rgba(214,165,111,0.5)]' 
                                : 'bg-white/10 group-hover/bar:bg-white/20'
                            }`} 
                            style={{ height: `${typeof h === 'number' ? h : 30}%` }}
                          >
                            {/* Inner Shine Effect for the highlighted bar */}
                            {i === 4 && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                            )}
                          </div>
                        </div>
                        <span className={`text-[8px] font-black mt-2 uppercase tracking-widest ${i === 4 ? 'text-accent' : 'text-neutral-500'}`}>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center text-neutral-500/50 gap-3">
                      <div className="w-full h-px bg-white/5" />
                      <p className="text-[10px] italic font-black uppercase tracking-[0.3em]">Awaiting Transaction Data</p>
                      <div className="w-full h-px bg-white/5" />
                    </div>
                  )}
                </div>

                {/* Glass Footer Info */}
                <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-coffee-900 bg-coffee-800 flex items-center justify-center text-[6px] font-bold text-white">
                          <Users size={8} />
                        </div>
                      ))}
                    </div>
                    <span className="text-[9px] font-bold text-coffee-500 uppercase tracking-wider">+12% vs last week</span>
                  </div>
                  <div 
                    className="flex items-center gap-1 text-accent font-black text-[9px] uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer"
                    onClick={() => toast.success('Comprehensive Report coming soon!')}
                  >
                    Report <ArrowUpRight size={12} />
                  </div>
                </div>
              </Card>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <Card hover className="p-6 bg-white border border-coffee-100 flex flex-col items-center text-center relative overflow-hidden group rounded-[2rem]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500">
                  <PieChart size={24} />
                </div>
                <h5 className="text-[10px] font-black text-coffee-500 uppercase tracking-[0.2em] mb-1">Returning Rate</h5>
                <p className="text-2xl font-black text-coffee-900">
                  {stats?.returningRate?.toFixed(0) || 0}%
                </p>
                <div className="w-full h-1.5 bg-coffee-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats?.returningRate || 0}%` }} />
                </div>
              </Card>

              <Card hover className="p-6 bg-white border border-coffee-100 flex flex-col items-center text-center relative overflow-hidden group rounded-[2rem]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-accent to-orange-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-accent/20 group-hover:-rotate-6 transition-transform duration-500">
                  <BarChart3 size={24} />
                </div>
                <h5 className="text-[10px] font-black text-coffee-500 uppercase tracking-[0.2em] mb-1">Top Service</h5>
                <p className="text-sm font-black text-coffee-900 mt-1 truncate w-full px-2">
                  {stats?.topServices?.[0]?.name || 'N/A'}
                </p>
                <div className="mt-3 px-3 py-1 bg-accent/10 rounded-badge border border-accent/10">
                  <span className="text-[9px] font-black text-accent uppercase tracking-widest">High Demand</span>
                </div>
              </Card>
            </div>

            {/* AI Intelligent Forecast */}
            <Card className="bg-gradient-to-br from-coffee-700/10 via-white to-coffee-700/5 border-none p-8 relative overflow-hidden group shadow-xl rounded-[2.5rem]">
              {/* Animated Sparkles in background */}
              <div className="absolute top-4 right-4 text-coffee-700/10 animate-bounce duration-[3000ms]">
                <Sparkles size={40} />
              </div>
              
              <div className="flex gap-6 items-center relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-futuristic flex items-center justify-center text-coffee-700 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                  <Sparkles size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-black text-coffee-900 tracking-tight">BizFlow AI Insights</h4>
                    <span className="bg-coffee-700 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Pro</span>
                  </div>
                  <p className="text-sm text-coffee-600 leading-relaxed font-medium">
                    {stats?.totalRevenue > 0 
                      ? "Based on today's performance, we suggest focusing on your top services to maximize evening revenue."
                      : "Start recording transactions to enable AI-powered business insights and growth forecasts."}
                  </p>
                </div>
              </div>
              
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-coffee-700/10 rounded-full blur-3xl group-hover:bg-coffee-700/20 transition-all duration-1000" />
            </Card>
          </div>
        )}

        {/* Team Management Quick Link */}
        <button 
          onClick={() => window.location.href = '/staff-management'}
          className="w-full bg-white p-6 rounded-[2.5rem] border-2 border-coffee-100 shadow-xl hover:shadow-2xl hover:border-coffee-700/20 hover:-translate-y-1 transition-all duration-500 flex items-center justify-between group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-[1.25rem] bg-coffee-50 flex items-center justify-center text-coffee-700 group-hover:bg-coffee-700 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-inner">
              <UsersRound size={28} />
            </div>
            <div className="text-left">
              <h4 className="text-base font-black text-coffee-900 tracking-tight">Manage Your Team</h4>
              <p className="text-xs font-medium text-coffee-500">Add Managers, Staff & set roles</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-coffee-50 flex items-center justify-center text-coffee-300 group-hover:text-coffee-700 group-hover:bg-white group-hover:shadow-md transition-all duration-500 relative z-10">
            <ChevronRight size={20} />
          </div>
        </button>

        <div className="h-24" />
      </div>
    </MainLayout>
  );
};

export default OwnerDashboard;
