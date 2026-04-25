import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      let mockRole: any = 'OWNER';
      if (data.phone.endsWith('1')) mockRole = 'MANAGER';
      if (data.phone.endsWith('2')) mockRole = 'STAFF';
      if (data.phone.endsWith('3')) mockRole = 'VIEWER';

      const mockUser = {
        id: '1',
        phone: data.phone,
        name: 'Test User',
        role: mockRole,
        businessId: 'b1',
        businessName: 'My Business',
      };

      login(mockUser, 'fake-jwt-token');
      toast.success('Welcome back!');
      const defaultPaths: Record<string, string> = {
        OWNER: '/dashboard',
        MANAGER: '/dashboard',
        STAFF: '/queue',
        VIEWER: '/dashboard-viewer',
      };
      navigate(defaultPaths[mockRole]);
    } catch (error) {
      toast.error('Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-darkNavy flex justify-center items-center p-4 lg:p-8">
      <div className="w-full max-w-[414px] aspect-[9/19.5] max-h-[896px] bg-white flex flex-col relative shadow-2xl rounded-[3rem] overflow-hidden border-[8px] border-neutral-darkNavy">
        {/* Mock Status Bar */}
        <div className="h-10 bg-white flex items-center justify-between px-8 pt-4 pb-2 text-[12px] font-bold z-50">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="7" width="16" height="10" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" /></svg>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 bg-neutral-background overflow-y-auto">
          <div className="mb-8 text-center">
            <h1 className="text-primary text-3xl mb-2">BizFlow</h1>
            <p className="text-neutral-textMid">Manage your business on the go</p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Phone Number"
                prefix="+254"
                placeholder="712345678"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
              
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" title="Forgot Password" className="text-sm text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full" type="submit" isLoading={isLoading} leftIcon={<LogIn size={18} />}>
                Sign In
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-border text-center">
              <p className="text-sm text-neutral-textMid">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Register Business
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="h-6 bg-white flex justify-center items-end pb-2 shrink-0">
          <div className="w-32 h-1 bg-neutral-darkNavy/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
