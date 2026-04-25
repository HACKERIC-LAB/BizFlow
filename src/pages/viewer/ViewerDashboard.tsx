import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { 
  TrendingUp, 
  Users, 
  Eye,
  Info
} from 'lucide-react';

const ViewerDashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Business Summary</h2>
            <p className="body-small text-neutral-textLight">View-only access to current metrics.</p>
          </div>
          <span className="px-3 py-1 bg-neutral-darkNavy text-white text-[10px] font-bold rounded-badge uppercase flex items-center gap-1.5">
            <Eye size={12} /> Viewer
          </span>
        </div>

        <Card className="bg-blue-light border-blue/20 p-4 flex gap-3">
          <Info className="text-blue shrink-0" size={20} />
          <p className="text-xs text-blue font-medium leading-relaxed">
            You are currently in read-only mode. To make changes or process transactions, please contact the business owner.
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <TrendingUp size={20} className="text-primary mb-3" />
            <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">Today's Revenue</p>
            <p className="text-xl font-bold text-neutral-darkNavy">KSh 8,400</p>
          </Card>
          <Card className="p-4">
            <Users size={20} className="text-blue mb-3" />
            <p className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">Customers Served</p>
            <p className="text-xl font-bold text-neutral-darkNavy">18</p>
          </Card>
        </div>

        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Recent Transactions</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-background flex items-center justify-center text-xs font-bold">
                    {i}
                  </div>
                  <div>
                    <p className="text-sm font-bold">Transaction #{i + 1200}</p>
                    <p className="text-[10px] text-neutral-textLight">2:45 PM • M-PESA</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">KSh 1,500</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Button variant="outline" className="w-full">Download Full Report</Button>
      </div>
    </MainLayout>
  );
};

const Button = ({ children, variant, className }: any) => (
  <button className={`h-12 rounded-card border font-bold text-sm transition-standard ${
    variant === 'outline' ? 'border-neutral-border text-neutral-textMid hover:bg-neutral-background' : ''
  } ${className}`}>
    {children}
  </button>
);

export default ViewerDashboard;
