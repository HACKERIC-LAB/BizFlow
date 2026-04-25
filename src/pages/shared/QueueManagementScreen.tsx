import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Plus, 
  MessageCircle, 
  Play, 
  RotateCcw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useQueueStore } from '../../store/queueStore';
import { getSocket } from '../../utils/socket';
import toast from 'react-hot-toast';

const QueueManagementScreen = () => {
  const { queueEntries, nowServing, setQueue, setNowServing } = useQueueStore();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Socket listeners
    const socket = getSocket();
    if (socket) {
      socket.on('queue-updated', (data) => setQueue(data));
      socket.on('now-serving', (data) => {
        setNowServing(data);
        toast(`Now Serving: ${data.customerName}`, { icon: '💇‍♂️' });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (socket) {
        socket.off('queue-updated');
        socket.off('now-serving');
      }
    };
  }, []);

  const handleStartService = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Starting service...',
        success: 'Service started!',
        error: 'Failed to start service.',
      }
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl flex items-center gap-2">
            Queue <span className="text-neutral-textLight text-sm font-normal">({queueEntries.length} waiting)</span>
          </h2>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-badge text-[10px] font-bold uppercase tracking-wider ${
            isOffline ? 'bg-accent-redLight text-accent-red' : 'bg-mpesa-muted text-primary'
          }`}>
            {isOffline ? <><WifiOff size={12} /> Offline Mode</> : <><Wifi size={12} /> Live Sync</>}
          </div>
        </div>

        {/* Now Serving */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Currently Serving</h3>
          {nowServing ? (
            <Card className="bg-primary text-white border-none shadow-large p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-primary-light text-xs uppercase font-bold tracking-widest mb-1">Serving Now</p>
                  <h4 className="text-2xl font-bold">{nowServing.customerName}</h4>
                  <p className="text-primary-light text-sm">{nowServing.service}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-card backdrop-blur-sm">
                  <Play size={24} className="fill-white" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1 bg-white text-primary border-none">
                  Complete
                </Button>
                <Button variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10">
                  Skip
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-dashed flex flex-col items-center justify-center py-10 bg-white/50">
              <RotateCcw size={32} className="text-neutral-border mb-3" />
              <p className="text-neutral-textLight font-medium">No one is being served</p>
              <Button size="sm" className="mt-4" variant="outline">Call Next Customer</Button>
            </Card>
          )}
        </section>

        {/* Waiting List */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-1">Waiting List</h3>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="flex items-center justify-between p-4 group hover:border-primary transition-standard">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-card bg-neutral-background flex flex-col items-center justify-center">
                  <span className="text-[10px] text-neutral-textLight font-bold uppercase">Pos</span>
                  <span className="text-sm font-bold text-neutral-darkNavy">{i}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold">John Mwangi {i}</h4>
                  <p className="text-[10px] text-neutral-textLight">Fade & Beard Trim • Est. 20 min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-primary hover:bg-primary-light rounded-button transition-standard">
                  <MessageCircle size={18} />
                </button>
                <button 
                  onClick={() => handleStartService()}
                  className="p-2 bg-mpesa-green text-white rounded-button hover:bg-mpesa-green/90 transition-standard"
                >
                  <Play size={18} fill="white" />
                </button>
              </div>
            </Card>
          ))}
        </section>

        <div className="h-10" />
      </div>

      {/* FAB */}
      <Button 
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-large z-40 flex items-center justify-center p-0"
        leftIcon={<Plus size={28} className="m-0" />}
      >
        {/* Walk-in Label would go here if not a circle */}
      </Button>
    </MainLayout>
  );
};

export default QueueManagementScreen;
