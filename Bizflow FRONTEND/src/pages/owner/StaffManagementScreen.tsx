import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  UserCircle,
  Phone,
  Trash2,
  Lock
} from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useStaffStore } from '../../store/staffStore';
import { getBusinessContent } from '../../utils/businessUtils';

const StaffManagementScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { staff, fetchStaff, isLoading, deactivateStaff } = useStaffStore();
  const content = getBusinessContent(user?.businessType);

  useEffect(() => {
    fetchStaff().catch(() => toast.error('Failed to load staff list'));
  }, [fetchStaff]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this staff member?')) {
      try {
        await deactivateStaff(id);
        toast.success('Staff deactivated');
      } catch (error) {
        toast.error('Failed to deactivate staff');
      }
    }
  };

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">{content.staffLabel} & Team Control</h2>
          <Button size="sm" leftIcon={<Plus size={18} />} onClick={() => navigate('/staff/new')}>
            Add {content.staffLabel.slice(0, -1)}
          </Button>
        </div>

        <div className="relative">
          <Input 
            placeholder={`Search ${content.staffLabel.toLowerCase()} by name or role...`} 
            leftIcon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="relative group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-card flex items-center justify-center text-primary">
                    <UserCircle size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{member.name}</h4>
                      <span className={`px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase ${
                        member.role === 'MANAGER' ? 'bg-blue-light text-blue' : 'bg-neutral-background text-neutral-textMid'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p 
                        className="flex items-center text-xs text-neutral-textLight cursor-pointer hover:text-primary transition-standard"
                        onClick={() => window.location.href = `tel:${member.phone}`}
                      >
                        <Phone size={12} className="mr-1" /> {member.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <HeadlessMenu as="div" className="relative">
                  <HeadlessMenu.Button className="p-2 text-neutral-textLight hover:bg-neutral-background rounded-button transition-standard">
                    <MoreVertical size={20} />
                  </HeadlessMenu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-neutral-border rounded-card bg-white shadow-large ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button 
                              className={`${active ? 'bg-neutral-background' : ''} flex w-full items-center px-4 py-2 text-sm text-neutral-textMid transition-standard`}
                              onClick={() => navigate(`/staff/edit/${member.id}`)}
                            >
                              Edit Profile
                            </button>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button 
                              className={`${active ? 'bg-neutral-background' : ''} flex w-full items-center px-4 py-2 text-sm text-neutral-textMid transition-standard`}
                              onClick={() => navigate(`/staff/schedule/${member.id}`)}
                            >
                              Manage Schedule
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                      <div className="py-1">
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button 
                              className={`${active ? 'bg-neutral-background' : ''} flex w-full items-center px-4 py-2 text-sm text-neutral-textMid transition-standard`}
                              onClick={() => toast.success('Password reset link sent!')}
                            >
                              <Lock size={14} className="mr-2" /> Reset Password
                            </button>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button 
                              className={`${active ? 'bg-accent-redLight text-accent-red' : 'text-accent-red'} flex w-full items-center px-4 py-2 text-sm transition-standard`}
                              onClick={() => handleDelete(member.id)}
                            >
                              <Trash2 size={14} className="mr-2" /> Deactivate
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-border flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-mpesa-green' : 'bg-neutral-border'}`} />
                  <span className="text-[10px] font-bold text-neutral-textLight uppercase tracking-widest">{member.status}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-xs"
                    onClick={() => navigate(`/staff/report/${member.id}`)}
                  >
                    View Report
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffManagementScreen;
