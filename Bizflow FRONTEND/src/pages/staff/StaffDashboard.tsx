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
import { useAuthStore } from '../../store/authStore';
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Your Day</h2>
            <p className="body-small text-neutral-textLight">You've served {stats?.transactionCount || 0} clients today.</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gold-light border-2 border-gold flex items-center justify-center text-gold">
            <Award size={24} />
          </div>
        </div>

        {/* Personal Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-primary-light border-primary/10">
            <TrendingUp size={20} className="text-primary mb-2" />
            <p className="text-[10px] uppercase font-bold text-primary/70 tracking-wider">Your Earnings</p>
            <p className="text-xl font-bold text-primary">KSh {(stats?.totalRevenue || 0).toLocaleString()}</p>
          </Card>
          <Card className="p-4">
            <Clock size={20} className="text-blue mb-2" />
            <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">Next Break</p>
            <p className="text-xl font-bold text-neutral-darkNavy">1:00 PM</p>
          </Card>
        </div>

        {/* Current Focus */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Current Focus</h3>
          {nextClient ? (
            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">
                    {nextClient.status === 'SERVING' ? 'Current Service' : 'Upcoming Service'}
                  </p>
                  <h4 className="text-xl font-bold">{nextClient.customerName}</h4>
                  <p className="text-sm text-neutral-textMid">{nextClient.serviceName}</p>
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
            <Card className="p-6 text-center text-neutral-textLight italic">
              No clients in the queue.
            </Card>
          )}
        </section>

        {/* Task List (Dynamic tasks could be added later, for now we keep a clean placeholder) */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Today's Tasks</h3>
          <div className="space-y-3">
            <Card className="flex items-center gap-3 p-4 opacity-60 bg-neutral-background">
               <div className="w-5 h-5 rounded-full border-2 bg-mpesa-green border-mpesa-green flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
               </div>
               <div className="flex-1">
                  <p className="text-sm font-bold line-through">Clean station</p>
                  <p className="text-[10px] text-neutral-textLight">Completed</p>
               </div>
            </Card>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default StaffDashboard;
