import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ChevronLeft, UserCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EditStaffScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Mock initial data
  const [formData, setFormData] = useState({
    name: 'Alice Wambui',
    phone: '0712345678',
    role: 'MANAGER',
    commission: '20'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Staff profile updated!');
    setIsSaving(false);
    navigate(-1);
  };

  return (
    <MainLayout hideBottomNav>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-textMid">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">Edit Staff Profile</h2>
        </div>

        <div className="bg-white p-6 rounded-card border border-neutral-border shadow-subtle">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary relative">
                <UserCircle size={40} />
                <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white">
                  <Save size={12} />
                </div>
              </div>
            </div>

            <Input 
              label="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <Input 
              label="Phone Number" 
              prefix="+254" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            
            <div className="space-y-1.5">
              <label className="label-text text-neutral-textMid">Role</label>
              <select
                className="w-full bg-white border border-neutral-border rounded-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-standard"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
              >
                <option value="STAFF">Standard Staff</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            <Input 
              label="Commission Percentage (%)" 
              type="number"
              value={formData.commission}
              onChange={(e) => setFormData({...formData, commission: e.target.value})}
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={isSaving}
                leftIcon={<Save size={18} />}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-dashed text-neutral-textLight"
          onClick={() => toast('Security settings coming soon')}
        >
          Reset Security Credentials
        </Button>
      </div>
    </MainLayout>
  );
};

export default EditStaffScreen;
