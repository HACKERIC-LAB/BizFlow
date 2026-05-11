import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Download, DollarSign } from 'lucide-react';
import { reportsApi } from '../../services/reportsApi';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface MonthSelect {
  year: number;
  month: number;
}

const MonthSelector = ({ value, onChange, label }: { value: MonthSelect, onChange: (val: MonthSelect) => void, label: string }) => {
  const years = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-coffee-400 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        <select
          value={value.month}
          onChange={(e) => onChange({ ...value, month: Number(e.target.value) })}
          className="bg-coffee-50 border border-coffee-200 text-coffee-900 text-sm rounded-xl px-3 py-2 outline-none focus:border-accent transition-colors"
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={value.year}
          onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
          className="bg-coffee-50 border border-coffee-200 text-coffee-900 text-sm rounded-xl px-3 py-2 outline-none focus:border-accent transition-colors"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default function MonthlyReportScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  const [selectedMonth, setSelectedMonth] = useState<MonthSelect>(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportsApi.getMonthlyComparison([selectedMonth]);
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      toast.error('Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      const toastId = toast.loading('Generating PDF...');
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BizFlow_Monthly_Report_${new Date().getTime()}.pdf`);
      toast.success('PDF generated successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };



  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in pb-24">
        {/* Tab Selection */}
        <div className="flex bg-coffee-100/50 p-1 rounded-2xl border border-coffee-200/50 mb-2">
          <button 
            onClick={() => navigate('/')}
            className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all text-coffee-400 hover:text-coffee-600"
          >
            Performance
          </button>
          <button 
            className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all bg-coffee-900 text-white shadow-medium"
          >
            Analytics
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-coffee-900 tracking-tight">Monthly Report</h1>
            <p className="text-xs font-medium text-coffee-500">Analyze performance for selected month</p>
          </div>
          <Button onClick={handleExportPDF} rightIcon={<Download size={18} />} variant="primary" className="shadow-lg shadow-coffee-900/20">
            Export PDF
          </Button>
        </div>

        <Card className="p-4 bg-white border border-coffee-100 flex flex-col md:flex-row gap-4 items-end justify-between shadow-subtle z-20 relative">
          <div className="flex flex-wrap gap-4 w-full">
            <MonthSelector label="Select Month" value={selectedMonth} onChange={setSelectedMonth} />
          </div>
        </Card>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div ref={reportRef} className="space-y-6 bg-coffee-50 p-2 md:p-6 rounded-[2rem] -mx-2 md:mx-0">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4">
              {data.map((monthData, idx) => (
                <Card key={idx} className="bg-white border-none shadow-medium relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                  <div className="relative z-10">
                    <h3 className="text-sm font-black text-coffee-400 uppercase tracking-widest mb-4">
                      {MONTHS[monthData.month - 1]} {monthData.year}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-coffee-400 uppercase">Revenue</p>
                        <p className="text-2xl font-black text-coffee-900">KSh {monthData.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-coffee-100 pt-3">
                        <div>
                          <p className="text-[10px] font-bold text-coffee-400 uppercase">Transactions</p>
                          <p className="text-lg font-black text-coffee-700">{monthData.transactionCount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-coffee-400 uppercase">Cash / M-Pesa</p>
                          <p className="text-sm font-bold text-coffee-700">
                            {Math.round((monthData.cashRevenue / (monthData.totalRevenue || 1)) * 100)}% / {Math.round((monthData.mpesaRevenue / (monthData.totalRevenue || 1)) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>


            {/* Top Services Breakdown */}
            <Card className="bg-coffee-900 text-white border-none shadow-large p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign size={20} className="text-accent" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Top Services Performance</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {data.map((monthData, idx) => (
                    <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
                        {MONTHS[monthData.month - 1]} {monthData.year}
                      </h4>
                      {monthData.topServices.length > 0 ? (
                        <div className="space-y-3">
                          {monthData.topServices.map((service: any, sIdx: number) => (
                            <div key={sIdx}>
                              <div className="flex justify-between text-sm font-medium mb-1">
                                <span className="truncate pr-2">{service.name}</span>
                                <span className="font-bold">KSh {service.revenue.toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-accent h-full rounded-full" 
                                  style={{ width: `${(service.revenue / (monthData.topServices[0].revenue || 1)) * 100}%` }} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-white/50 text-center py-4">No data available</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
