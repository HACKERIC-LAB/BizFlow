import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffStore, StaffRole } from '../../store/staffStore';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ChevronLeft, UserCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EditStaffScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { staff, updateStaff } = useStaffStore();
  const [isSaving, setIsSaving] = useState(false);

  // Find the staff member
  const member = staff.find(s => s.id === id);

  // Form state
  const [formData, setFormData] = useState({
    name: member?.name || '',
    phone: member?.phone || '',
    role: member?.role || 'STAFF' as StaffRole
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateStaff(id, {
      name: formData.name,
      phone: formData.phone,
      role: formData.role as StaffRole
    });
    
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
