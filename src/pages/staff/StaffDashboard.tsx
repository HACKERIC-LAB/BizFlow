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

const StaffDashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Your Day</h2>
            <p className="body-small text-neutral-textLight">You've served 8 clients today.</p>
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
            <p className="text-xl font-bold text-primary">KSh 3,250</p>
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
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Upcoming Service</p>
                <h4 className="text-xl font-bold">John Mwangi</h4>
                <p className="text-sm text-neutral-textMid">Haircut & Shave • KSh 800</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-neutral-textLight">10:45 AM</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" leftIcon={<Play size={16} fill="white" />}>Start Service</Button>
            </div>
          </Card>
        </section>

        {/* Task List */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Today's Tasks</h3>
          <div className="space-y-3">
            {[
              { task: 'Clean station 4', time: 'Every 2 hours', done: true },
              { task: 'Restock shaving cream', time: 'ASAP', done: false },
              { task: 'Update profile photo', time: 'Optional', done: false },
            ].map((t, i) => (
              <Card key={i} className={`flex items-center gap-3 p-4 ${t.done ? 'opacity-60 bg-neutral-background' : ''}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-standard ${
                  t.done ? 'bg-mpesa-green border-mpesa-green' : 'border-neutral-border'
                }`}>
                  {t.done && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${t.done ? 'line-through' : ''}`}>{t.task}</p>
                  <p className="text-[10px] text-neutral-textLight">{t.time}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default StaffDashboard;
