import { useState, useEffect } from 'react';
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
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { customerApi } from '../../services/customerApi';
import toast from 'react-hot-toast';

const CustomerListScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    customerApi.list()
      .then(res => setCustomers(res.data.customers || []))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Customers</h2>
          <Button 
            size="sm" 
            leftIcon={<UserPlus size={18} />}
            onClick={() => navigate('/customers/new')}
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
          
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button className="h-14 px-4 bg-white border border-neutral-border/50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-standard shadow-subtle">
              <Filter size={18} />
            </HeadlessMenu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-neutral-border rounded-2xl bg-white shadow-large ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-1">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort By</div>
                <div className="py-1">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button className={`${active ? 'bg-primary/10 text-primary' : 'text-slate-600'} group flex w-full items-center px-3 py-2 text-xs font-bold rounded-xl transition-standard`}>
                        Most Recent
                      </button>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button className={`${active ? 'bg-primary/10 text-primary' : 'text-slate-600'} group flex w-full items-center px-3 py-2 text-xs font-bold rounded-xl transition-standard`}>
                        Most Visits
                      </button>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button className={`${active ? 'bg-primary/10 text-primary' : 'text-slate-600'} group flex w-full items-center px-3 py-2 text-xs font-bold rounded-xl transition-standard`}>
                        Top Spenders
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-20 bg-neutral-background animate-pulse rounded-card" />)
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <Card 
                key={customer.id} 
                hover 
                className="flex items-center justify-between group cursor-pointer"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
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
                        <History size={10} className="mr-1" /> {customer._count?.transactions || 0} Visits
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-xs font-bold text-neutral-darkNavy">KSh {(customer.totalSpent || 0).toLocaleString()}</p>
                    <p className="flex items-center justify-end text-[10px] text-gold font-bold">
                      <Star size={8} className="mr-0.5 fill-gold" /> {customer.loyaltyPoints || 0}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-neutral-border group-hover:text-primary transition-standard" />
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center py-10 text-neutral-textLight text-sm italic">No customers found</p>
          )}
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
                Reward your regulars to keep them coming back! Track points and offer discounts automatically.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CustomerListScreen;
