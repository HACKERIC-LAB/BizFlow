import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { 
  Users, 
  TrendingUp, 
} from 'lucide-react';
import { transactionApi } from '../../services/transactionApi';
import { staffApi } from '../../services/staffApi';
import { queueApi } from '../../services/queueApi';
import { format } from 'date-fns';

const ManagerDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    transactionApi.getDailySummary().then(res => setStats(res.data));
    staffApi.list().then(res => setStaff(res.data));
    queueApi.getActive().then(res => setQueue(res.data));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Manager Dashboard</h2>
          <p className="text-neutral-textLight text-sm">Overview of today's operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-primary text-white border-none">
            <TrendingUp size={20} className="mb-2 opacity-80" />
            <p className="text-2xl font-bold">KSh {(stats?.revenue || 0).toLocaleString()}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Daily Revenue</p>
          </Card>
          <Card className="p-4 bg-white shadow-subtle border-none">
            <Users size={20} className="mb-2 text-primary" />
            <p className="text-2xl font-bold text-neutral-darkNavy">{stats?.customers || 0}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-textLight">Customers Served</p>
          </Card>
        </div>

        {/* Active Queue */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Live Queue</h3>
            <span className="text-[10px] font-bold text-primary-accent bg-primary-soft px-2 py-0.5 rounded-badge uppercase animate-pulse">Live</span>
          </div>
          <Card className="divide-y divide-neutral-border">
            {queue.length > 0 ? queue.slice(0, 3).map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-background flex items-center justify-center font-bold text-xs">
                    {item.position}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.customerName}</p>
                    <p className="text-[10px] text-neutral-textLight">{item.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-primary">{item.status}</p>
                  <p className="text-[10px] text-neutral-textLight">{format(new Date(item.createdAt), 'hh:mm a')}</p>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-sm text-neutral-textLight italic">No active queue</div>
            )}
          </Card>
        </section>

        {/* Staff Attendance */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Staff Status</h3>
          <div className="grid grid-cols-1 gap-2">
            {staff.map(member => (
              <Card key={member.id} className="p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${member.status === 'ACTIVE' ? 'bg-primary-accent' : 'bg-neutral-border'}`} />
                   <p className="text-sm font-medium">{member.name}</p>
                </div>
                <p className="text-[10px] font-bold text-neutral-textLight uppercase">{member.role}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ManagerDashboard;
