import { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  UserPlus, 
  Smartphone, 
  Banknote,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const AddTransactionScreen = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'CASH' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkStatus, setStkStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');

  const handleNext = () => setStep(s => s + 1);
  // const handleBack = () => setStep(s => s - 1);

  const handleMpesaPay = async () => {
    setIsProcessing(true);
    setStkStatus('pending');
    
    // Simulate STK Push
    toast.loading('Sending STK Push...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate User Approval
    setStkStatus('success');
    toast.dismiss();
    toast.success('Payment Received!');
    setIsProcessing(false);
    handleNext();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 -ml-2 text-neutral-textMid">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl">New Transaction</h2>
        </div>

        {/* Stepper */}
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-neutral-border'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Select Customer</h3>
            <Input 
              placeholder="Search by name or phone..." 
              leftIcon={<Search size={18} />}
            />
            <Button variant="outline" className="w-full border-dashed" leftIcon={<UserPlus size={18} />}>
              Add New Customer
            </Button>
            <div className="space-y-2 mt-4">
              {[1, 2, 3].map(i => (
                <Card key={i} onClick={handleNext} hover className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-background flex items-center justify-center font-bold">
                      J
                    </div>
                    <div>
                      <p className="font-bold text-sm">John Kamau {i}</p>
                      <p className="text-xs text-neutral-textLight">0712 345 67{i}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-neutral-textLight" />
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Select Services</h3>
            <div className="space-y-2">
              {['Haircut', 'Beard Trim', 'Head Massage'].map((s, i) => (
                <Card key={i} className="flex items-center justify-between border-primary/20 bg-primary-light/30">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                    <div>
                      <p className="font-bold text-sm">{s}</p>
                      <p className="text-xs text-neutral-textLight">KSh {500 + i * 100}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="pt-4 border-t border-neutral-border">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">KSh 1,200</span>
              </div>
              <Button className="w-full" onClick={handleNext}>Confirm Services</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('MPESA')}
                className={`flex flex-col items-center justify-center p-6 rounded-card border-2 transition-standard ${
                  paymentMethod === 'MPESA' ? 'border-mpesa-green bg-mpesa-muted/20' : 'border-neutral-border bg-white'
                }`}
              >
                <Smartphone size={32} className={paymentMethod === 'MPESA' ? 'text-mpesa-green' : 'text-neutral-textLight'} />
                <span className={`mt-2 font-bold ${paymentMethod === 'MPESA' ? 'text-mpesa-green' : 'text-neutral-textMid'}`}>M-PESA</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('CASH')}
                className={`flex flex-col items-center justify-center p-6 rounded-card border-2 transition-standard ${
                  paymentMethod === 'CASH' ? 'border-primary bg-primary-light/20' : 'border-neutral-border bg-white'
                }`}
              >
                <Banknote size={32} className={paymentMethod === 'CASH' ? 'text-primary' : 'text-neutral-textLight'} />
                <span className={`mt-2 font-bold ${paymentMethod === 'CASH' ? 'text-primary' : 'text-neutral-textMid'}`}>CASH</span>
              </button>
            </div>

            {paymentMethod === 'MPESA' && (
              <div className="mt-6 p-6 bg-white rounded-card border border-neutral-border animate-in slide-in-from-bottom-4">
                <h4 className="font-bold mb-4">M-PESA STK Push</h4>
                <Input label="M-PESA Phone Number" prefix="+254" defaultValue="712345678" />
                
                {stkStatus === 'pending' ? (
                  <div className="mt-6 text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-mpesa-muted rounded-full" />
                      <div className="absolute inset-0 border-4 border-mpesa-green rounded-full border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm font-medium">Waiting for customer to enter PIN...</p>
                    <p className="text-[10px] text-neutral-textLight uppercase tracking-widest">Do not close this screen</p>
                  </div>
                ) : (
                  <Button 
                    variant="mpesa" 
                    className="w-full mt-6" 
                    onClick={handleMpesaPay}
                    isLoading={isProcessing}
                  >
                    Send STK Push
                  </Button>
                )}
              </div>
            )}

            {paymentMethod === 'CASH' && (
              <div className="mt-6 p-6 bg-white rounded-card border border-neutral-border animate-in slide-in-from-bottom-4">
                <h4 className="font-bold mb-4">Cash Payment</h4>
                <Input label="Amount Received" type="number" prefix="KSh" defaultValue="1500" />
                <div className="mt-4 p-3 bg-neutral-background rounded-card flex justify-between items-center">
                  <span className="text-sm">Change to give</span>
                  <span className="font-bold text-primary">KSh 300</span>
                </div>
                <Button className="w-full mt-6" onClick={handleNext}>Confirm Payment</Button>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6 pt-10">
            <div className="w-20 h-20 bg-mpesa-muted rounded-full flex items-center justify-center mx-auto text-mpesa-green scale-110 animate-in zoom-in duration-500">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Transaction Complete</h3>
              <p className="text-neutral-textLight">Receipt #BF-998273 has been generated</p>
            </div>
            
            <Card className="text-left p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-textLight">Customer</span>
                <span className="font-bold">John Kamau</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-textLight">Payment Method</span>
                <span className="font-bold">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-neutral-border pt-3">
                <span className="text-neutral-textLight">Total Amount</span>
                <span className="font-bold text-lg">KSh 1,200</span>
              </div>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" variant="mpesa">Share Receipt on WhatsApp</Button>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = '/dashboard'}>Done</Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AddTransactionScreen;
