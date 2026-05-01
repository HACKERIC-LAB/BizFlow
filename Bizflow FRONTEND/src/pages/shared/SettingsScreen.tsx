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
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userApi } from '../../services/userApi';
import { useAuthStore } from '../../store/authStore';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-coffee-700 border-t-transparent"></div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8 pb-20">
        <div className="animate-slide-up">
          <h2 className="text-4xl font-heading font-black text-coffee-900 tracking-tighter">Settings</h2>
          <p className="text-neutral-500 text-sm font-medium mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 text-coffee-700 font-black uppercase tracking-[0.2em] text-[10px]">
            <User size={14} className="text-accent" />
            Profile Information
          </div>
          
          <Card className="relative overflow-hidden p-6 sm:p-8 bg-white border border-coffee-100 shadow-md rounded-3xl">
            {!isEditing ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-coffee-50 flex items-center justify-center text-coffee-700 font-heading font-bold text-3xl sm:text-4xl overflow-hidden border border-coffee-700/10">
                    {formData.profilePhoto ? (
                      <img 
                        src={formData.profilePhoto.startsWith('http') ? formData.profilePhoto : `http://localhost:3000${formData.profilePhoto}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      profile?.name?.[0]
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2.5 sm:p-3 bg-coffee-700 text-white rounded-2xl shadow-lg hover:bg-coffee-900 transition-all cursor-pointer border-2 border-white">
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

                {/* Info Container */}
                <div className="w-full sm:flex-1 flex flex-col items-center sm:items-start">
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-coffee-900 text-center sm:text-left break-words w-full px-2">
                    {profile?.name}
                  </h3>
                  <div className="mt-3">
                    <span className="px-3 py-1 bg-coffee-700/10 text-coffee-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                      {profile?.role}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <div className="w-full sm:w-auto mt-6 sm:mt-0">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto font-heading font-bold border-2 border-coffee-700/20 hover:border-coffee-700 hover:bg-coffee-700/5 transition-all"
                  >
                    Edit Profile
                  </Button>
                </div>
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
          <div className="flex items-center gap-2 text-coffee-700 font-bold uppercase tracking-wider text-[10px]">
            <Lock size={14} />
            Security & Authentication
          </div>

          {!isChangingPassword ? (
            <Card hover onClick={() => setIsChangingPassword(true)} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-coffee-100 flex items-center justify-center text-neutral-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold">Change Password</h4>
                  <p className="text-xs text-neutral-500">Last changed 3 months ago</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-coffee-200" />
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
          <div className="flex items-center gap-2 text-coffee-700 font-bold uppercase tracking-wider text-[10px]">
            <FileText size={14} />
            Legal & Privacy
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Card hover onClick={() => navigate('/legal/terms')} className="flex items-center justify-between cursor-pointer py-4 px-6">
              <span className="font-bold text-sm">Terms and Conditions</span>
              <ChevronRight size={16} className="text-coffee-200" />
            </Card>
            <Card hover onClick={() => navigate('/legal/privacy')} className="flex items-center justify-between cursor-pointer py-4 px-6">
              <span className="font-bold text-sm">Privacy Policy</span>
              <ChevronRight size={16} className="text-coffee-200" />
            </Card>
          </div>
        </section>

        {/* Logout Section */}
        <Card variant="outline" className="border-red-500/20 bg-accent-redLight/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <LogOut size={20} />
              </div>
              <div>
                <h4 className="font-bold text-red-500">Logout</h4>
                <p className="text-xs text-red-500/60">Sign out of your account</p>
              </div>
            </div>
            <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card>

        {/* Version info */}
        <div className="text-center pt-4">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">BizFlow v1.0.4 Premium</p>
          <p className="text-[9px] text-neutral-500/60 mt-1">&copy; 2026 HOOD. All rights reserved.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsScreen;
