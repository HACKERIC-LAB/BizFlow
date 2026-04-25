import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  ChevronLeft, 
  Phone, 
  Mail, 
  Calendar, 
  History, 
  Star, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';

const CustomerDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock customer data - in a real app, you'd fetch this by ID
  const customer = {
    id: id,
    name: 'John Kamau',
    phone: '0712345678',
    email: 'john.kamau@example.com',
    visits: 12,
    spent: 8500,
    points: 150,
    joinDate: 'Jan 15, 2024',
    recentTransactions: [
      { id: 't1', date: '2024-04-10', service: 'Haircut', amount: 800, staff: 'Alice' },
      { id: 't2', date: '2024-03-25', service: 'Full Grooming', amount: 2500, staff: 'Alice' },
      { id: 't3', date: '2024-03-05', service: 'Haircut', amount: 800, staff: 'Alice' },
    ]
  };

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
          <p className="text-neutral-textLight text-sm mb-4">Customer since {customer.joinDate}</p>
          
          <div className="flex gap-2 w-full">
            <Button className="flex-1" leftIcon={<MessageSquare size={18} />} variant="mpesa">WhatsApp</Button>
            <Button className="flex-1" leftIcon={<Phone size={18} />} variant="outline">Call</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 bg-gold-light rounded-full flex items-center justify-center text-gold mb-2">
              <Star size={16} fill="currentColor" />
            </div>
            <p className="text-xl font-bold text-neutral-darkNavy">{customer.points}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">Points</p>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary mb-2">
              <TrendingUp size={16} />
            </div>
            <p className="text-xl font-bold text-neutral-darkNavy">{customer.visits}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">Visits</p>
          </Card>
        </div>

        {/* Contact Info */}
        <section className="space-y-3">
          <h4 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Contact Details</h4>
          <Card className="divide-y divide-neutral-border">
            <div className="p-4 flex items-center gap-4">
              <div className="text-primary"><Phone size={18} /></div>
              <div>
                <p className="text-xs text-neutral-textLight">Phone Number</p>
                <p className="text-sm font-bold text-neutral-darkNavy">{customer.phone}</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="text-primary"><Mail size={18} /></div>
              <div>
                <p className="text-xs text-neutral-textLight">Email Address</p>
                <p className="text-sm font-bold text-neutral-darkNavy">{customer.email}</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Recent Transactions */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Recent Activity</h4>
            <Button variant="link" size="sm" className="text-xs font-bold p-0 h-auto">View All</Button>
          </div>
          <div className="space-y-2">
            {customer.recentTransactions.map((tx) => (
              <Card key={tx.id} className="p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-background rounded-card">
                    <History size={16} className="text-neutral-textMid" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-darkNavy">{tx.service}</p>
                    <p className="text-[10px] text-neutral-textLight">{tx.date} • with {tx.staff}</p>
                  </div>
                </div>
                <p className="font-bold text-sm text-neutral-darkNavy">KSh {tx.amount}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default CustomerDetailsScreen;
