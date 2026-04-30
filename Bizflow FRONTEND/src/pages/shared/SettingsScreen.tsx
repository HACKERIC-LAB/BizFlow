import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  ChevronRight, 
  Camera,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userApi } from '../../services/userApi';
import { useAuthStore } from '../../store/authStore';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePhoto: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    userApi.getMe()
      .then(res => {
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email || '',
          profilePhoto: res.data.profilePhoto || ''
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size must be less than 5MB');
    }

    setIsUploading(true);
    try {
      const res = await userApi.uploadPhoto(file);
      setFormData({ ...formData, profilePhoto: res.data.photoUrl });
      setProfile({ ...profile, profilePhoto: res.data.photoUrl });
      toast.success('Photo uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.updateMe(formData);
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      await userApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password change failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (isLoading) return (
    <MainLayout>
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8 pb-20">
        <div>
          <h2 className="text-3xl">Settings</h2>
          <p className="text-neutral-textLight text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[10px]">
            <User size={14} />
            Profile Information
          </div>
          
          <Card className="relative overflow-hidden">
            {!isEditing ? (
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-primary-soft flex items-center justify-center text-primary font-bold text-3xl overflow-hidden border-2 border-primary/10 shadow-inner">
                    {formData.profilePhoto ? (
                      <img 
                        src={formData.profilePhoto.startsWith('http') ? formData.profilePhoto : `http://localhost:3000${formData.profilePhoto}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      profile?.name[0]
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-white rounded-2xl shadow-xl hover:bg-primary-dark transition-standard cursor-pointer border-2 border-white">
                    <Camera size={16} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-neutral-darkNavy">{profile?.name}</h3>
                  <p className="text-neutral-textLight text-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-mpesa-green animate-pulse" />
                    {profile?.email || 'No email set'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded-md">
                      {profile?.role}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-widest rounded-md">
                      ID: {profile?.id?.slice(-6)}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Details</Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    placeholder="Enter your full name"
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    placeholder="name@example.com"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">Save Profile Details</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </Card>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[10px]">
            <Lock size={14} />
            Security & Authentication
          </div>

          {!isChangingPassword ? (
            <Card hover onClick={() => setIsChangingPassword(true)} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold">Change Password</h4>
                  <p className="text-xs text-neutral-textLight">Last changed 3 months ago</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-neutral-border" />
            </Card>
          ) : (
            <Card className="animate-fade-in">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input 
                  label="Current Password" 
                  type="password" 
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="New Password" 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                  <Input 
                    label="Confirm New Password" 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">Update Password</Button>
                  <Button variant="outline" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          )}
        </section>

        {/* Legal Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[10px]">
            <FileText size={14} />
            Legal & Privacy
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Card hover onClick={() => navigate('/legal/terms')} className="flex items-center justify-between cursor-pointer py-4 px-6">
              <span className="font-bold text-sm">Terms and Conditions</span>
              <ChevronRight size={16} className="text-neutral-border" />
            </Card>
            <Card hover onClick={() => navigate('/legal/privacy')} className="flex items-center justify-between cursor-pointer py-4 px-6">
              <span className="font-bold text-sm">Privacy Policy</span>
              <ChevronRight size={16} className="text-neutral-border" />
            </Card>
          </div>
        </section>

        {/* Logout Section */}
        <Card variant="outline" className="border-accent-red/20 bg-accent-redLight/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-accent-red/10 flex items-center justify-center text-accent-red">
                <LogOut size={20} />
              </div>
              <div>
                <h4 className="font-bold text-accent-red">Logout</h4>
                <p className="text-xs text-accent-red/60">Sign out of your account</p>
              </div>
            </div>
            <Button variant="outline" className="border-accent-red/30 text-accent-red hover:bg-accent-red hover:text-white" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card>

        {/* Version info */}
        <div className="text-center pt-4">
          <p className="text-[10px] text-neutral-textLight uppercase tracking-widest font-bold">BizFlow v1.0.4 Premium</p>
          <p className="text-[9px] text-neutral-textLight/60 mt-1">&copy; 2026 HOOD. All rights reserved.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsScreen;
