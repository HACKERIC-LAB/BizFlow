import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { RotateCcw, X, MessageCircle, Play, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useQueueStore } from '../../store/queueStore';
import { getSocket } from '../../utils/socket';
import toast from 'react-hot-toast';

const QueueManagementScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { queueEntries, nowServing, fetchQueue, startServing, complete, skip, setQueue, isLoading, checkIn } = useQueueStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ name: '', phone: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchQueue().catch(() => toast.error('Failed to load queue'));

    const handleOnline = () => {}; // Sync is seamless now
    const handleOffline = () => {};

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Socket listeners
    const socket = getSocket();
    if (socket) {
      socket.on('queue-updated', (data: any) => {
        setQueue(data);
      });
      socket.on('notification', (data: any) => {
        toast(data.message, { icon: '🔔' });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (socket) {
        socket.off('queue-updated');
        socket.off('notification');
      }
    };
  }, [fetchQueue, setQueue]);

  const handleStartService = async (id?: string) => {
    const targetId = id || (queueEntries.length > 0 ? queueEntries[0].id : null);
    if (!targetId) return;

    try {
      await startServing(targetId);
      toast.success('Service started!');
    } catch (error) {
      toast.error('Failed to start service');
    }
  };

  const handleComplete = async () => {
    if (!nowServing) return;
    try {
      const customerToPay = {
        id: nowServing.customerId,
        name: nowServing.customerName,
        phone: nowServing.customerPhone
      };
      await complete(nowServing.id);
      toast.success('Service Completed!');
      
      // Redirect to transaction screen
      navigate('/transactions/new', { 
        state: { customer: customerToPay } 
      });
    } catch (error) {
      toast.error('Failed to complete service');
    }
  };

  const handleSkip = async () => {
    if (!nowServing) return;
    try {
      await skip(nowServing.id);
      toast('Service Skipped', { icon: '⏭️' });
    } catch (error) {
      toast.error('Failed to skip service');
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.phone) return toast.error('Phone number is required');
    
    setIsAdding(true);
    try {
      await checkIn({
        customerName: newEntry.name,
        customerPhone: newEntry.phone
      });
      toast.success('Customer added to queue');
      setNewEntry({ name: '', phone: '' });
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add to queue');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-coffee-900 tracking-tight flex items-center gap-2">
            Queue <span className="text-coffee-400 text-sm font-bold">({queueEntries.length} waiting)</span>
          </h2>
        </div>

        {/* Add to Queue Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-coffee-900/40 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-md p-8 relative shadow-2xl animate-scale-in">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-coffee-400 hover:text-coffee-900 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-coffee-900 text-white flex items-center justify-center shadow-lg">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-coffee-900 tracking-tight">Check-in Customer</h3>
                  <p className="text-xs font-medium text-coffee-400">Add a new person to the waiting list</p>
                </div>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-5">
                <Input 
                  label="Customer Name" 
                  placeholder="Enter name (optional)"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                />
                <Input 
                  label="Phone Number" 
                  placeholder="712 345 678"
                  prefix="+254"
                  type="tel"
                  required
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                />
                
                <div className="pt-4 flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-2" 
                    type="submit"
                    isLoading={isAdding}
                  >
                    Check In
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Now Serving */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-coffee-500 font-bold mb-3">Currently Serving</h3>
          {nowServing ? (
            <Card variant="primary" className="shadow-large p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-coffee-400 text-xs uppercase font-bold tracking-widest mb-1">Serving Now</p>
                  <h4 className="text-2xl font-bold">{nowServing.customerName || nowServing.customerPhone}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-coffee-400 text-sm">{nowServing.serviceName}</p>
                    {nowServing.servedBy && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-coffee-400/50" />
                        <p className="text-coffee-900 text-xs font-bold bg-white/40 px-2 py-0.5 rounded-full border border-white/20">
                          Served by: {nowServing.servedBy.name}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-card backdrop-blur-sm">
                  <Play size={24} className="fill-white" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1 bg-white text-coffee-900 border-none"
                  onClick={handleComplete}
                  disabled={user?.role === 'STAFF' && nowServing.servedById !== user?.id}
                >
                  Complete
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                  onClick={handleSkip}
                  disabled={user?.role === 'STAFF' && nowServing.servedById !== user?.id}
                >
                  Skip
                </Button>
              </div>
              {user?.role === 'STAFF' && nowServing.servedById !== user?.id && (
                <p className="text-[10px] text-white/60 text-center mt-3 font-bold uppercase tracking-widest">
                  Only {nowServing.servedBy?.name} can complete this service
                </p>
              )}
            </Card>
          ) : (
            <Card className="border-dashed flex flex-col items-center justify-center py-10 bg-white/50">
              <RotateCcw size={32} className="text-coffee-200 mb-3" />
              <p className="text-coffee-500 font-medium">No one is being served</p>
              <Button 
                size="sm" 
                className="mt-4" 
                variant="outline"
                onClick={() => handleStartService()}
                disabled={queueEntries.length === 0}
              >
                Call Next Customer
              </Button>
            </Card>
          )}
        </section>

        {/* Waiting List */}
        <section className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-coffee-500 font-bold mb-1">Waiting List</h3>
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-20 bg-coffee-50 animate-pulse rounded-card" />)
          ) : queueEntries.length > 0 ? (
            queueEntries.map((entry, index) => (
              <Card key={entry.id} className="flex items-center justify-between p-4 group hover:border-coffee-900 transition-standard">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-card bg-coffee-50 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-coffee-500 font-bold uppercase">Pos</span>
                    <span className="text-sm font-bold text-coffee-900">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{entry.customerName || entry.customerPhone}</h4>
                    <p className="text-[10px] text-coffee-500">{entry.serviceName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open(`https://wa.me/${entry.customerPhone.replace(/[^0-9]/g, '')}`, '_blank')}
                    className="p-2 text-coffee-900 hover:bg-coffee-400 rounded-button transition-standard"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button 
                    onClick={() => handleStartService(entry.id)}
                    className="p-2 bg-accent text-coffee-900 rounded-button hover:bg-accent/90 transition-standard"
                  >
                    <Play size={18} fill="white" />
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center py-10 text-coffee-500 text-sm italic">Queue is empty</p>
          )}
        </section>

        <div className="h-10" />
      </div>

    </MainLayout>
  );
};

export default QueueManagementScreen;
