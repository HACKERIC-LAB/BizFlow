import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  ChevronLeft, 
  Phone, 
  Mail, 
  History, 
  Star, 
  MessageSquare,
  TrendingUp,
  X,
  UserPlus,
  Trash2
} from 'lucide-react';
import { useQueueStore } from '../../store/queueStore';
import { customerApi } from '../../services/customerApi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const { checkIn } = useQueueStore();
  const [isAddingToQueue, setIsAddingToQueue] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      customerApi.get(id)
        .then(res => setCustomer(res.data))
        .catch(() => toast.error('Failed to load customer details'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleAddToQueue = async () => {
    if (!customer) return;
    setIsAddingToQueue(true);
    try {
      await checkIn({
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone
      });
      toast.success('Added to queue!');
      navigate('/queue');
    } catch (error) {
      toast.error('Failed to add to queue');
    } finally {
      setIsAddingToQueue(false);
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    if (!window.confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) return;
    
    setIsDeleting(true);
    try {
      await customerApi.delete(customer.id);
      toast.success('Customer deleted successfully');
      navigate('/customers');
    } catch (error) {
      toast.error('Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <MainLayout><div className="flex justify-center items-center h-full pt-20 animate-fade-in">Loading...</div></MainLayout>;
  if (!customer) return <MainLayout><div className="text-center p-10">Customer not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-6 pb-10 animate-slide-up">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-coffee-500">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">Customer Profile</h2>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-coffee-200 shadow-medium">
          <div className="w-24 h-24 bg-coffee-900/10 rounded-2xl flex items-center justify-center text-coffee-900 font-bold text-3xl mb-4 border-4 border-white shadow-subtle">
            {customer.name[0]}
          </div>
          <h3 className="text-2xl font-bold text-coffee-900">{customer.name}</h3>
          <p className="text-coffee-500 text-sm mb-4">Customer since {format(new Date(customer.createdAt), 'MMM d, yyyy')}</p>
          
          <div className="flex flex-col gap-2 w-full">
            <Button 
              className="w-full h-14 rounded-2xl shadow-lg shadow-coffee-900/10 font-bold" 
              leftIcon={<UserPlus size={20} />} 
              onClick={handleAddToQueue}
              isLoading={isAddingToQueue}
            >
              Add to Queue
            </Button>
            <div className="flex gap-2 w-full">
              <Button 
                className="flex-1" 
                leftIcon={<MessageSquare size={18} />} 
                variant="mpesa"
                onClick={() => window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`, '_blank')}
              >
                WhatsApp
              </Button>
              <Button 
                className="flex-1" 
                leftIcon={<Phone size={18} />} 
                variant="outline"
                onClick={() => window.location.href = `tel:${customer.phone}`}
              >
                Call
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-2">
              <Star size={16} fill="currentColor" />
            </div>
            <p className="text-xl font-bold text-coffee-900">{customer.loyaltyPoints || 0}</p>
            <p className="text-[10px] uppercase font-bold text-coffee-500 tracking-wider">Points</p>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 bg-coffee-900/10 rounded-lg flex items-center justify-center text-coffee-900 mb-2">
              <TrendingUp size={16} />
            </div>
            <p className="text-xl font-bold text-coffee-900">{customer.transactions?.length || 0}</p>
            <p className="text-[10px] uppercase font-bold text-coffee-500 tracking-wider">Visits</p>
          </Card>
        </div>

        {/* Contact Info */}
        <section className="space-y-3">
          <h4 className="text-xs uppercase font-bold text-coffee-500 tracking-wider">Contact Details</h4>
          <Card className="divide-y divide-coffee-100 p-0 overflow-hidden">
            <div 
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-coffee-50 transition-standard"
              onClick={() => window.location.href = `tel:${customer.phone}`}
            >
              <div className="text-coffee-900"><Phone size={18} /></div>
              <div>
                <p className="text-xs text-coffee-500">Phone Number</p>
                <p className="text-sm font-bold text-coffee-900">{customer.phone}</p>
              </div>
            </div>
            {customer.email && (
              <div 
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-coffee-50 transition-standard"
                onClick={() => window.location.href = `mailto:${customer.email}`}
              >
                <div className="text-coffee-900"><Mail size={18} /></div>
                <div>
                  <p className="text-xs text-coffee-500">Email Address</p>
                  <p className="text-sm font-bold text-coffee-900">{customer.email}</p>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Recent Transactions */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-bold text-coffee-500 tracking-wider">Recent Activity</h4>
            <Button 
              variant="link" 
              size="sm" 
              className="text-xs font-bold p-0 h-auto"
              onClick={() => setIsHistoryModalOpen(true)}
            >
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {customer.transactions?.length > 0 ? (
              customer.transactions.slice(0, 5).map((tx: any) => (
                <Card key={tx.id} className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-coffee-50 rounded-xl text-coffee-500">
                      <History size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-coffee-900">{tx.services.map((s: any) => s.service.name).join(', ')}</p>
                      <p className="text-[10px] text-coffee-500">{format(new Date(tx.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-coffee-900">KSh {(tx.amount || 0).toLocaleString()}</p>
                </Card>
              ))
            ) : (
              <p className="text-center py-10 text-coffee-500 text-sm italic">No recent activity</p>
            )}
          </div>
        </section>

        {/* Dangerous Zone */}
        <div className="pt-6 pb-10">
          <Button 
            variant="outline" 
            className="w-full border-red-100 text-red-500 hover:bg-red-50 rounded-2xl h-14 font-bold"
            leftIcon={<Trash2 size={18} />}
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete Customer
          </Button>
        </div>
      </div>

      {/* Transaction History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-coffee-900/40 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-lg h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-t-[3rem] sm:rounded-[3rem] animate-slide-up">
            <div className="p-8 border-b border-coffee-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl font-black text-coffee-900 tracking-tight">Payment History</h3>
                <p className="text-xs font-medium text-coffee-400 mt-1">{customer.name}'s complete transaction record</p>
              </div>
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-3 bg-coffee-50 text-coffee-900 rounded-2xl hover:bg-coffee-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
              {customer.transactions?.length > 0 ? (
                customer.transactions.map((tx: any) => (
                  <Card key={tx.id} className="p-4 flex justify-between items-center border-coffee-50 hover:border-coffee-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-coffee-50 rounded-xl flex items-center justify-center text-coffee-400">
                        <History size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-coffee-900">
                          {tx.services.map((s: any) => s.service.name).join(', ')}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] font-bold text-coffee-400 uppercase">
                            {format(new Date(tx.createdAt), 'MMM d, h:mm a')}
                          </p>
                          <span className="w-1 h-1 rounded-full bg-coffee-200" />
                          <p className="text-[10px] font-bold text-coffee-400 uppercase">
                            {tx.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-coffee-900">KSh {tx.amount.toLocaleString()}</p>
                      <p className="text-[9px] font-black text-accent uppercase tracking-tighter">Verified</p>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <History size={48} className="mb-4" />
                  <p className="font-bold">No transactions recorded</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-coffee-100 bg-coffee-50/30 shrink-0">
              <Button className="w-full" onClick={() => setIsHistoryModalOpen(false)}>
                Close History
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

export default CustomerDetailsScreen;
