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
import { format } from 'date-fns';

const ViewerDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    transactionApi.getDailySummary().then(res => setStats(res.data));
    queueApi.getActive().then(res => setQueue(res.data));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Viewer Dashboard</h2>
          <p className="text-neutral-textLight text-sm">Business status at a glance</p>
        </div>

        {/* Live Queue Status */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Queue Highlights</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-mpesa-muted/50 border-none">
              <Clock size={16} className="text-mpesa-green mb-2" />
              <p className="text-xl font-bold text-mpesa-green">{queue.length}</p>
              <p className="text-[10px] font-bold text-neutral-textLight uppercase">Waiting</p>
            </Card>
            <Card className="p-4 bg-primary-light/50 border-none">
              <CheckCircle size={16} className="text-primary mb-2" />
              <p className="text-xl font-bold text-primary">{stats?.customers || 0}</p>
              <p className="text-[10px] font-bold text-neutral-textLight uppercase">Completed</p>
            </Card>
          </div>
        </section>

        {/* Detailed Queue */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Current Waiting List</h3>
          <Card className="divide-y divide-neutral-border overflow-hidden">
            {queue.length > 0 ? queue.map((item, i) => (
              <div key={item.id} className="p-4 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-neutral-border">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-neutral-darkNavy">{item.customerName}</p>
                    <p className="text-[10px] text-neutral-textLight uppercase font-medium">{item.serviceName}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-badge text-[8px] font-black uppercase ${
                   item.status === 'WAITING' ? 'bg-neutral-background text-neutral-textLight' : 'bg-primary-light text-primary'
                }`}>
                  {item.status}
                </div>
              </div>
            )) : (
              <div className="p-10 text-center">
                 <AlertCircle size={32} className="mx-auto text-neutral-border mb-2" />
                 <p className="text-sm text-neutral-textLight italic">Queue is empty</p>
              </div>
            )}
          </Card>
        </section>

        {/* Performance Summary */}
        <section className="p-4 bg-neutral-darkNavy text-white rounded-card shadow-large">
           <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={18} className="text-primary" />
              <h3 className="text-sm font-bold">Daily Performance</h3>
           </div>
           <div className="space-y-3">
              <div className="flex justify-between items-end">
                 <span className="text-xs text-white/60">Target Revenue</span>
                 <span className="text-lg font-bold">KSh 15,000</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${Math.min(((stats?.revenue || 0) / 15000) * 100, 100)}%` }}
                 />
              </div>
              <p className="text-[10px] text-white/40 italic text-right">
                Current: KSh {(stats?.revenue || 0).toLocaleString()}
              </p>
           </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ViewerDashboard;
