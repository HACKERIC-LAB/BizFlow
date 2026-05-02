import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Award
} from 'lucide-react';
import { transactionApi } from '../../services/transactionApi';
import { queueApi } from '../../services/queueApi';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [nextClient, setNextClient] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, queueRes] = await Promise.all([
          transactionApi.getDailySummary(),
          queueApi.getActive()
        ]);
        setStats(summaryRes.data);
        const next = queueRes.data.find((q: any) => q.status === 'WAITING' || q.status === 'SERVING');
        setNextClient(next);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Day</h2>
            <p className="text-sm text-coffee-500">You've served {stats?.transactionCount || 0} clients today.</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border-2 border-white flex items-center justify-center text-accent shadow-subtle">
            <Award size={24} />
          </div>
        </div>

        {/* Personal Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-coffee-900 text-white border-none shadow-medium">
            <TrendingUp size={20} className="text-white/80 mb-2" />
            <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Your Earnings</p>
            <p className="text-xl font-bold text-white">KSh {(stats?.totalRevenue || 0).toLocaleString()}</p>
          </Card>
          <Card className="p-4 bg-white border border-coffee-200 shadow-subtle">
            <Clock size={20} className="text-coffee-900 mb-2" />
            <p className="text-[10px] uppercase font-bold text-coffee-500 tracking-wider">Next Break</p>
            <p className="text-xl font-bold text-coffee-900">1:00 PM</p>
          </Card>
        </div>

        {/* Current Focus */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-coffee-500 font-bold">Current Focus</h3>
          {nextClient ? (
            <Card className="p-6 border-l-4 border-l-primary bg-white shadow-medium">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-coffee-900 text-xs font-bold uppercase tracking-widest mb-1">
                    {nextClient.status === 'SERVING' ? 'Current Service' : 'Upcoming Service'}
                  </p>
                  <h4 className="text-xl font-bold text-coffee-900">{nextClient.customerName}</h4>
                  <p className="text-sm text-coffee-500">{nextClient.serviceName}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {nextClient.status === 'WAITING' ? (
                  <Button className="flex-1" leftIcon={<Play size={16} fill="white" />}>Start Service</Button>
                ) : (
                  <Button className="flex-1" variant="mpesa" leftIcon={<CheckCircle2 size={16} />}>Complete Service</Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-coffee-500 italic bg-coffee-50 border-dashed">
              No clients in the queue.
            </Card>
          )}
        </section>

        {/* Task List */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-coffee-500 font-bold">Today's Tasks</h3>
          <div className="space-y-3">
            <Card className="flex items-center gap-3 p-4 bg-coffee-50 border-none opacity-60">
               <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
               </div>
               <div className="flex-1">
                  <p className="text-sm font-bold text-coffee-900 line-through">Clean station</p>
                  <p className="text-[10px] text-coffee-500">Completed</p>
               </div>
            </Card>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default StaffDashboard;
