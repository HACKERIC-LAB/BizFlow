import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  ChevronLeft, 
  Users, 
  Clock, 
  DollarSign,
  Calendar,
  BarChart3,
  X,
  Phone
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuthStore } from '../../store/authStore';
import { getBusinessContent } from '../../utils/businessUtils';
import { staffApi } from '../../services/staffApi';
import toast from 'react-hot-toast';

const StaffReportScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const content = getBusinessContent(user?.businessType);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showClientsModal, setShowClientsModal] = useState(false);

  useEffect(() => {
    if (id) {
      staffApi.getReport(id)
        .then(res => setReport(res.data))
        .catch(() => toast.error('Failed to load performance report'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <MainLayout>Loading report...</MainLayout>;
  if (!report) return <MainLayout>Report not found</MainLayout>;

  const stats = [
    { id: 'revenue', label: 'Revenue Generated', value: `KSh ${report.revenue.toLocaleString()}`, icon: DollarSign, color: 'primary' },
    { id: 'clients', label: `${content.customersLabel} Served`, value: report.customerCount, icon: Users, color: 'blue', clickable: true },
    { id: 'working', label: 'Working Days', value: report.activeDaysCount, icon: Calendar, color: 'primary' },
    { id: 'off', label: 'Off Days', value: report.offDaysCount, icon: Clock, color: 'gold' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-10 animate-fade-in">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-coffee-600">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Staff Performance</h2>
            <p className="text-xs text-coffee-500">{report.name} • {report.period}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <Card 
              key={stat.id} 
              className={`p-4 flex flex-col items-center justify-center text-center transition-standard ${stat.clickable ? 'cursor-pointer hover:border-coffee-900/40 hover:shadow-subtle' : ''}`}
              onClick={stat.clickable ? () => setShowClientsModal(true) : undefined}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-${stat.color}-light text-${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <p className="text-lg font-bold text-coffee-900">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold text-coffee-500 tracking-wider">
                {stat.label}
                {stat.clickable && <span className="block text-[8px] text-coffee-900 lowercase font-normal">(View List)</span>}
              </p>
            </Card>
          ))}
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-coffee-900">Weekly Revenue</h4>
            <BarChart3 size={18} className="text-coffee-500" />
          </div>
          <div className="flex items-end justify-between h-32 gap-2 px-2">
            {report.dailyPerformance.map((item: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-coffee-900 rounded-t-sm transition-all duration-500" 
                  style={{ height: `${Math.min((item.revenue / 10000) * 100, 100)}%` }}
                />
                <span className="text-[10px] font-bold text-coffee-500">{item.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Service Breakdown */}
        <section className="space-y-3">
          <h4 className="text-xs uppercase font-bold text-coffee-500 tracking-wider">Top Services</h4>
          <Card className="divide-y divide-coffee-200">
            {report.topServices.map((s: any, i: number) => (
              <div key={i} className="p-4 flex justify-between items-center">
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-sm font-bold">{s.count} times</span>
              </div>
            ))}
          </Card>
        </section>

        <Button variant="outline" className="w-full" leftIcon={<Calendar size={18} />}>
          View Another Month
        </Button>
      </div>

      {/* Clients Modal */}
      <Transition appear show={showClientsModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowClientsModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title as="h3" className="text-lg font-bold text-coffee-900">
                      Served Clients
                    </Dialog.Title>
                    <button onClick={() => setShowClientsModal(false)} className="p-2 -mr-2 text-coffee-500">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                    {report.servedCustomers && report.servedCustomers.length > 0 ? (
                      report.servedCustomers.map((client: any) => (
                        <div key={client.id} className="flex items-center justify-between p-3 rounded-card bg-coffee-50 border border-coffee-200">
                          <div>
                            <p className="font-bold text-coffee-900 text-sm">{client.name}</p>
                            <p className="text-xs text-coffee-600 flex items-center gap-1 mt-0.5">
                              <Phone size={10} /> {client.phone}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-coffee-500 uppercase font-bold tracking-wider">Last Served</p>
                            <p className="text-[10px] font-bold text-coffee-900">
                              {new Date(client.lastVisit).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-coffee-500">
                        <Users size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm italic">No clients served this month yet.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <Button variant="outline" className="w-full" onClick={() => setShowClientsModal(false)}>
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </MainLayout>
  );
};

export default StaffReportScreen;
