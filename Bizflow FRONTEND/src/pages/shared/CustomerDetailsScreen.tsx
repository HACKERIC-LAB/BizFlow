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
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getBusinessContent } from '../../utils/businessUtils';
import { customerApi } from '../../services/customerApi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const content = getBusinessContent(user?.businessType);
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      customerApi.get(id)
        .then(res => setCustomer(res.data))
        .catch(() => toast.error('Failed to load customer details'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <MainLayout><div className="flex justify-center items-center h-full pt-20">Loading...</div></MainLayout>;
  if (!customer) return <MainLayout><div className="text-center p-10">Customer not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-textMid">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">Customer Profile</h2>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-card border border-neutral-border shadow-subtle">
          <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-3xl mb-4 border-4 border-white shadow-subtle">
            {customer.name[0]}
          </div>
          <h3 className="text-2xl font-bold text-neutral-darkNavy">{customer.name}</h3>
          <p className="text-neutral-textLight text-sm mb-4">Customer since {format(new Date(customer.createdAt), 'MMM d, yyyy')}</p>
          
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 bg-gold-light rounded-full flex items-center justify-center text-gold mb-2">
              <Star size={16} fill="currentColor" />
            </div>
            <p className="text-xl font-bold text-neutral-darkNavy">{customer.loyaltyPoints || 0}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">Points</p>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary mb-2">
              <TrendingUp size={16} />
            </div>
            <p className="text-xl font-bold text-neutral-darkNavy">{customer.transactions?.length || 0}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">Visits</p>
          </Card>
        </div>

        {/* Contact Info */}
        <section className="space-y-3">
          <h4 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Contact Details</h4>
          <Card className="divide-y divide-neutral-border">
            <div 
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-neutral-background transition-standard"
              onClick={() => window.location.href = `tel:${customer.phone}`}
            >
              <div className="text-primary"><Phone size={18} /></div>
              <div>
                <p className="text-xs text-neutral-textLight">Phone Number</p>
                <p className="text-sm font-bold text-neutral-darkNavy">{customer.phone}</p>
              </div>
            </div>
            {customer.email && (
              <div 
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-neutral-background transition-standard"
                onClick={() => window.location.href = `mailto:${customer.email}`}
              >
                <div className="text-primary"><Mail size={18} /></div>
                <div>
                  <p className="text-xs text-neutral-textLight">Email Address</p>
                  <p className="text-sm font-bold text-neutral-darkNavy">{customer.email}</p>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Recent Transactions */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Recent Activity</h4>
            <Button variant="link" size="sm" className="text-xs font-bold p-0 h-auto">View All</Button>
          </div>
          <div className="space-y-2">
            {customer.transactions?.length > 0 ? (
              customer.transactions.slice(0, 5).map((tx: any) => (
                <Card key={tx.id} className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-background rounded-card">
                      <History size={16} className="text-neutral-textMid" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-darkNavy">{tx.services.map((s: any) => s.service.name).join(', ')}</p>
                      <p className="text-[10px] text-neutral-textLight">{format(new Date(tx.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-neutral-darkNavy">KSh {tx.amount.toLocaleString()}</p>
                </Card>
              ))
            ) : (
              <p className="text-center py-10 text-neutral-textLight text-sm italic">No recent activity</p>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default CustomerDetailsScreen;
