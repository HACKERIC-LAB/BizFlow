import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { 
  BarChart2, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { transactionApi } from '../../services/transactionApi';
import { queueApi } from '../../services/queueApi';

const ViewerDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    transactionApi.getDailySummary().then(res => setStats(res.data));
    queueApi.getActive().then(res => setQueue(res.data));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6 animate-slide-up">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Viewer Dashboard</h2>
          <p className="text-slate-500 text-sm">Business status at a glance</p>
        </div>

        {/* Live Queue Status */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Queue Highlights</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-white border border-slate-200 shadow-subtle">
              <Clock size={16} className="text-primary mb-2" />
              <p className="text-xl font-bold text-slate-900">{queue.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waiting</p>
            </Card>
            <Card className="p-4 bg-primary text-white border-none shadow-medium">
              <CheckCircle size={16} className="text-white/80 mb-2" />
              <p className="text-xl font-bold text-white">{stats?.transactionCount || 0}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Completed</p>
            </Card>
          </div>
        </section>

        {/* Detailed Queue */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Current Waiting List</h3>
          <Card className="divide-y divide-slate-100 p-0 overflow-hidden bg-white shadow-medium border-slate-200">
            {queue.length > 0 ? queue.map((item, i) => (
              <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-standard">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-slate-200">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.customerName}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{item.serviceName}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-badge text-[8px] font-black uppercase ${
                   item.status === 'WAITING' ? 'bg-slate-100 text-slate-500' : 'bg-primary/10 text-primary'
                }`}>
                  {item.status}
                </div>
              </div>
            )) : (
              <div className="p-10 text-center">
                 <AlertCircle size={32} className="mx-auto text-slate-200 mb-2" />
                 <p className="text-sm text-slate-400 italic font-medium">Queue is empty</p>
              </div>
            )}
          </Card>
        </section>

        {/* Performance Summary */}
        <section className="p-6 bg-slate-900 text-white rounded-3xl shadow-large relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <BarChart2 size={18} className="text-primary" />
                 <h3 className="text-sm font-bold uppercase tracking-widest">Daily Performance</h3>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-end">
                    <span className="text-xs text-white/60 font-medium">Target Revenue</span>
                    <span className="text-lg font-bold">KSh 15,000</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                       className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(13,148,136,0.5)]" 
                       style={{ width: `${Math.min(((stats?.totalRevenue || 0) / 15000) * 100, 100)}%` }}
                    />
                 </div>
                 <p className="text-[10px] text-white/40 italic font-medium text-right">
                   Current: KSh {(stats?.totalRevenue || 0).toLocaleString()}
                 </p>
              </div>
           </div>
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        </section>
      </div>
    </MainLayout>
  );
};

export default ViewerDashboard;
