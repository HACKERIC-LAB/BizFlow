import { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ChevronLeft, Save, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import type { StaffRole } from '../../store/staffStore';
import { staffApi } from '../../services/staffApi';

const AddStaffScreen = () => {
  const navigate = useNavigate();
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
    
    try {
      await staffApi.create(formData);
      toast.success('Staff member added successfully!');
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add staff member');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout hideBottomNav>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-coffee-600">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">Add Staff Member</h2>
        </div>

        <div className="bg-white p-6 rounded-card border border-coffee-200 shadow-subtle">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-coffee-400 rounded-full flex items-center justify-center text-coffee-700">
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
              <label className="label-text text-coffee-600">Role</label>
              <select
                className="w-full bg-white border border-coffee-200 rounded-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-coffee-700/20 focus:border-coffee-700 transition-standard"
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

        <div className="p-4 bg-coffee-50 rounded-card border border-dashed border-coffee-200 text-center">
          <p className="text-xs text-neutral-500">
            Staff can log in using their phone number and the temporary password you set.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddStaffScreen;
