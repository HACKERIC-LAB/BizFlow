import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { LogIn, ArrowUpRight } from 'lucide-react';
import { authApi } from '../../services/authApi';

const schema = z.object({
  phone: z.string().min(9, 'Valid phone number is required'),
  password: z.string().min(6, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data.phone, data.password);
      const { user, accessToken } = response.data;
      
      login(user, accessToken);
      toast.success('Welcome back!');
      
      const defaultPaths: Record<string, string> = {
        OWNER: '/dashboard',
        MANAGER: '/dashboard-manager',
        STAFF: '/queue',
        VIEWER: '/dashboard-viewer',
      };
      navigate(defaultPaths[user.role as keyof typeof defaultPaths] || '/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-900 flex justify-center items-center md:p-8 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-coffee-600/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/15 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Main Container */}
      <div className="w-full h-screen md:h-[844px] md:max-w-[390px] bg-coffee-50 flex flex-col relative md:shadow-2xl md:rounded-[3rem] overflow-hidden md:border-[12px] md:border-coffee-900 z-10 animate-fade-in">
        
        {/* Branding Section */}
        <div className="relative pt-20 pb-12 px-8 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-coffee-900/10 to-transparent" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-large mx-auto flex items-center justify-center mb-6 animate-slide-up">
              <div className="w-12 h-12 bg-coffee-900 rounded-2xl flex items-center justify-center text-white shadow-futuristic">
                <LogIn size={24} />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-coffee-900 tracking-tight animate-slide-up delay-100">
              Biz<span className="text-coffee-900">Flow</span>
            </h1>
            <p className="text-coffee-500 font-medium mt-2 animate-slide-up delay-200">
              Elevate your business operations
            </p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-10 overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-slide-up delay-300">
            <Input
              label="Access Phone"
              prefix="+254"
              placeholder="712345678"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label="Security Key"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            
            <div className="flex items-center justify-end px-1">
              <Link to="/forgot-password" title="Forgot Password" className="text-xs font-bold text-coffee-900 uppercase tracking-wider hover:underline">
                Recovery Access
              </Link>
            </div>

            <Button 
              className="w-full h-14 text-base tracking-wide" 
              type="submit" 
              isLoading={isLoading} 
              rightIcon={<ArrowUpRight size={20} />}
            >
              System Login
            </Button>
          </form>

          <div className="mt-12 text-center animate-slide-up delay-500">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-coffee-200/50" />
              <span className="text-[10px] font-bold text-coffee-500 uppercase tracking-[0.2em]">Partner Hub</span>
              <div className="h-px w-8 bg-coffee-200/50" />
            </div>
            
            <p className="text-sm font-medium text-coffee-600">
              New to the platform?{' '}
              <Link to="/register" className="text-coffee-900 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
        
        {/* Phone Footer - Desktop Only */}
        <div className="hidden md:flex h-8 bg-transparent justify-center items-center shrink-0">
          <div className="w-32 h-1.5 bg-coffee-900/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
