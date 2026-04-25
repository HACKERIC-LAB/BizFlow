import { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ChevronLeft, UserPlus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useStaffStore, StaffRole } from '../../store/staffStore';

const AddStaffScreen = () => {
  const navigate = useNavigate();
  const { addStaff } = useStaffStore();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'STAFF' as StaffRole,
    password: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addStaff({
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      status: 'Active'
    });
    
    toast.success('Staff member added successfully!');
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
          <h2 className="text-xl font-bold">Add Staff Member</h2>
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
              placeholder="e.g. Alice Wambui" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <Input 
              label="Phone Number (Login ID)" 
              prefix="+254" 
              placeholder="712345678" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            
            <div className="space-y-1.5">
              <label className="label-text text-neutral-textMid">Role</label>
              <select
                className="w-full bg-white border border-neutral-border rounded-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-standard"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as StaffRole})}
                required
              >
                <option value="STAFF">Standard Staff</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            <Input 
              label="Temporary Password" 
              type="password"
              placeholder="Set initial password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={isSaving}
                leftIcon={<Save size={18} />}
              >
                Save Staff
              </Button>
            </div>
          </form>
        </div>

        <div className="p-4 bg-neutral-background rounded-card border border-dashed border-neutral-border text-center">
          <p className="text-xs text-neutral-textLight">
            Staff can log in using their phone number and the temporary password you set.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddStaffScreen;
