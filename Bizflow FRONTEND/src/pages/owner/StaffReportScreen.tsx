import { useState, useEffect } from 'react';
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
  BarChart3
} from 'lucide-react';
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
    { label: 'Revenue Generated', value: `KSh ${report.revenue.toLocaleString()}`, icon: DollarSign, color: 'primary' },
    { label: `${content.customersLabel} Served`, value: report.customerCount, icon: Users, color: 'blue' },
    { label: 'Avg. Service Time', value: `${report.avgServiceTime} min`, icon: Clock, color: 'gold' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-textMid">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Staff Performance</h2>
            <p className="text-xs text-neutral-textLight">{report.name} • {report.period}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="p-4 flex flex-col items-center justify-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-${stat.color}-light text-${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <p className="text-lg font-bold text-neutral-darkNavy">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-neutral-darkNavy">Weekly Revenue</h4>
            <BarChart3 size={18} className="text-neutral-textLight" />
          </div>
          <div className="flex items-end justify-between h-32 gap-2 px-2">
            {report.dailyPerformance.map((item: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary rounded-t-sm transition-all duration-500" 
                  style={{ height: `${Math.min((item.revenue / 10000) * 100, 100)}%` }}
                />
                <span className="text-[10px] font-bold text-neutral-textLight">{item.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Service Breakdown */}
        <section className="space-y-3">
          <h4 className="text-xs uppercase font-bold text-neutral-textLight tracking-wider">Top Services</h4>
          <Card className="divide-y divide-neutral-border">
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
    </MainLayout>
  );
};

export default StaffReportScreen;
