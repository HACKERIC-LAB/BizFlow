import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { 
  Search, 
  UserPlus, 
  Phone, 
  History, 
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';

const CustomerListScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    { id: '1', name: 'John Kamau', phone: '0712345678', visits: 12, spent: 8500, points: 150 },
    { id: '2', name: 'Mercy Njeri', phone: '0722334455', visits: 5, spent: 3200, points: 45 },
    { id: '3', name: 'Peter Otieno', phone: '0733445566', visits: 24, spent: 18400, points: 320 },
    { id: '4', name: 'Sarah Wambui', phone: '0744556677', visits: 1, spent: 1500, points: 10 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Customers</h2>
          <Button 
            size="sm" 
            leftIcon={<UserPlus size={18} />}
            onClick={() => navigate('/transactions/new')}
          >
            New
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input 
              placeholder="Search customers..." 
              leftIcon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="px-3">
            <Filter size={18} />
          </Button>
        </div>

        <div className="space-y-3">
          {customers.map((customer) => (
            <Card key={customer.id} hover className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-background rounded-full flex items-center justify-center text-neutral-textMid font-bold text-lg">
                  {customer.name[0]}
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-primary transition-standard">{customer.name}</h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="flex items-center text-[10px] text-neutral-textLight font-medium">
                      <Phone size={10} className="mr-1" /> {customer.phone}
                    </p>
                    <p className="flex items-center text-[10px] text-neutral-textLight font-medium">
                      <History size={10} className="mr-1" /> {customer.visits} Visits
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="text-xs font-bold text-neutral-darkNavy">KSh {customer.spent.toLocaleString()}</p>
                  <p className="flex items-center justify-end text-[10px] text-gold font-bold">
                    <Star size={8} className="mr-0.5 fill-gold" /> {customer.points}
                  </p>
                </div>
                <ChevronRight size={18} className="text-neutral-border group-hover:text-primary transition-standard" />
              </div>
            </Card>
          ))}
        </div>

        {/* Loyalty Program Teaser */}
        <Card className="bg-gold-light border-gold/20 p-6 mt-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gold rounded-card flex items-center justify-center text-white shrink-0">
              <Star size={24} fill="white" />
            </div>
            <div>
              <h4 className="font-bold text-gold-dark">Loyalty Program</h4>
              <p className="text-xs text-gold-dark/80 mt-1">
                You have 12 customers eligible for a discount. Reward your regulars to keep them coming back!
              </p>
              <Button size="sm" variant="outline" className="mt-4 border-gold text-gold hover:bg-gold hover:text-white h-8 text-xs">
                View Eligible Customers
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CustomerListScreen;
