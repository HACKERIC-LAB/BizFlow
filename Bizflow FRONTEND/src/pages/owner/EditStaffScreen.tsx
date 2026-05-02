import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { StaffRole } from '../../store/staffStore';
import { staffApi } from '../../services/staffApi';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ChevronLeft, UserCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EditStaffScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'STAFF' as StaffRole
  });

  useEffect(() => {
    if (id) {
      staffApi.get(id).then(res => {
        setFormData({
          name: res.data.name,
          phone: res.data.phone,
          role: res.data.role
        });
      }).catch(() => toast.error('Failed to load staff details'));
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    try {
      await staffApi.update(id, formData);
      toast.success('Staff profile updated!');
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update staff');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout hideBottomNav>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-coffee-600">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">Edit Staff Profile</h2>
        </div>

        <div className="bg-white p-6 rounded-card border border-coffee-200 shadow-subtle">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-coffee-400 rounded-full flex items-center justify-center text-coffee-900 relative">
                <UserCircle size={40} />
                <div className="absolute bottom-0 right-0 bg-coffee-900 text-white p-1 rounded-full border-2 border-white">
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
              <label className="label-text text-coffee-600">Role</label>
              <select
                className="w-full bg-white border border-coffee-200 rounded-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-coffee-900/20 focus:border-coffee-900 transition-standard"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as StaffRole})}
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
          className="w-full border-dashed text-coffee-500"
          onClick={() => toast('Security settings coming soon')}
        >
          Reset Security Credentials
        </Button>
      </div>
    </MainLayout>
  );
};

export default EditStaffScreen;
