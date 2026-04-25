import { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ChevronLeft, UserPlus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddCustomerScreen = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Customer added successfully!');
    setIsSaving(false);
    navigate(-1); // Go back to the previous screen
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-textMid">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl">Add New Customer</h2>
        </div>

        <div className="bg-white p-6 rounded-card border border-neutral-border shadow-subtle">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary">
                <UserPlus size={40} />
              </div>
            </div>

            <Input 
              label="Full Name" 
              placeholder="e.g. John Doe" 
              required
            />
            
            <Input 
              label="Phone Number" 
              prefix="+254" 
              placeholder="712345678" 
              required
            />
            
            <Input 
              label="Email Address (Optional)" 
              type="email"
              placeholder="john@example.com" 
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={isSaving}
                leftIcon={<Save size={18} />}
              >
                Save Customer
              </Button>
            </div>
          </form>
        </div>

        <div className="p-4 bg-neutral-background rounded-card border border-dashed border-neutral-border text-center">
          <p className="text-xs text-neutral-textLight">
            Adding a customer allows you to track their visit history and reward them with loyalty points.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddCustomerScreen;
