import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { BusinessType } from '../../types/business';
import { Check, ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { authApi } from '../../services/authApi';

const SERVICE_PREFILL: Record<BusinessType, { name: string; price: number; duration: number }[]> = {
  BARBERSHOP: [
    { name: 'Haircut', price: 500, duration: 30 },
    { name: 'Shave', price: 300, duration: 20 },
    { name: 'Hair wash', price: 200, duration: 15 },
    { name: 'Beard trim', price: 250, duration: 20 },
  ],
  SALON: [
    { name: 'Hair styling', price: 800, duration: 45 },
    { name: 'Braiding', price: 1500, duration: 120 },
    { name: 'Manicure', price: 600, duration: 30 },
    { name: 'Pedicure', price: 700, duration: 40 },
  ],
  GYM: [
    { name: 'Day pass', price: 500, duration: 0 },
    { name: 'Monthly membership', price: 3000, duration: 0 },
    { name: 'Personal training (1hr)', price: 1500, duration: 60 },
  ],
  SPA: [
    { name: 'Massage (1hr)', price: 2000, duration: 60 },
    { name: 'Facial', price: 1500, duration: 45 },
    { name: 'Body scrub', price: 2500, duration: 60 },
  ],
  OTHER: [],
};

const schema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum(['BARBERSHOP', 'SALON', 'GYM', 'SPA', 'OTHER']),
  businessPhone: z.string().min(9, 'Valid phone number is required'),
  fullName: z.string().min(2, 'Full name is required'),
  ownerPhone: z.string().min(9, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
  services: z.array(z.object({
    name: z.string().min(2, 'Service name is required'),
    price: z.number().min(0),
    duration: z.number().min(0),
  })).min(1, 'At least one service is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const RegisterScreen = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessType: 'BARBERSHOP',
      services: SERVICE_PREFILL.BARBERSHOP,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services"
  });

  // const businessType = watch('businessType');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as BusinessType;
    setValue('businessType', type);
    setValue('services', SERVICE_PREFILL[type]);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.register(data);
      const { user, accessToken } = response.data;

      useAuthStore.getState().login(user, accessToken);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onErrors = (errs: any) => {
    console.error('Validation Errors:', errs);
    toast.error('Please fix the errors in the form.');
  };

  return (
    <div className="min-h-screen bg-neutral-background md:bg-neutral-darkNavy flex justify-center items-center md:p-4 lg:p-8">
      <div className="w-full h-screen md:h-auto md:max-w-[414px] md:aspect-[9/19.5] md:max-h-[896px] bg-white flex flex-col relative md:shadow-2xl md:rounded-[3rem] overflow-hidden md:border-[8px] md:border-neutral-darkNavy">
        {/* Mock Status Bar - Only on Desktop */}
        <div className="hidden md:flex h-10 bg-white items-center justify-between px-8 pt-4 pb-2 text-[12px] font-bold z-50">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="7" width="16" height="10" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" /></svg>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 bg-neutral-background overflow-y-auto">
        <div className="mb-8 text-center pt-8">
          <h1 className="text-primary text-3xl mb-2">BizFlow</h1>
          <p className="text-neutral-textMid">Set up your business in minutes</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-standard ${
                step >= s ? 'bg-primary border-primary text-white' : 'border-neutral-border text-neutral-textLight'
              }`}>
                {step > s ? <Check size={20} /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-primary' : 'bg-neutral-border'}`} />}
            </div>
          ))}
        </div>

        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit, onErrors)}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="mb-4">Business Information</h2>
                <Input
                  label="Business Name"
                  placeholder="e.g. Sharp Cuts Barbershop"
                  {...register('businessName')}
                  error={errors.businessName?.message}
                />
                <div className="space-y-1.5">
                  <label className="label-text text-neutral-textMid">Business Type</label>
                  <select
                    className="w-full bg-white border border-neutral-border rounded-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-standard"
                    {...register('businessType')}
                    onChange={onTypeChange}
                  >
                    <option value="BARBERSHOP">Barbershop</option>
                    <option value="SALON">Salon</option>
                    <option value="GYM">Gym</option>
                    <option value="SPA">Spa</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <Input
                  label="Business Phone"
                  prefix="+254"
                  placeholder="712345678"
                  {...register('businessPhone')}
                  error={errors.businessPhone?.message}
                />
                <Button className="w-full mt-6" onClick={handleNext} type="button">
                  Continue <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="mb-4">Owner Details</h2>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                />
                <Input
                  label="Your Phone"
                  prefix="+254"
                  placeholder="712345678"
                  {...register('ownerPhone')}
                  error={errors.ownerPhone?.message}
                />
                <Input
                  label="Email (optional)"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" className="flex-1" onClick={handleBack} type="button">
                    <ChevronLeft size={18} className="mr-2" /> Back
                  </Button>
                  <Button className="flex-1" onClick={handleNext} type="button">
                    Continue <ChevronRight size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="">Initial Services</h2>
                  <p className="body-small text-neutral-textLight">
                    Based on your business type, we've suggested some services. You can edit, add or remove.
                  </p>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2 bg-neutral-background p-3 rounded-card border border-neutral-border">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Service Name"
                          {...register(`services.${index}.name` as const)}
                          className="bg-white"
                          error={errors.services?.[index]?.name?.message}
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Price"
                            {...register(`services.${index}.price` as const, { valueAsNumber: true })}
                            className="bg-white"
                            prefix="KSh"
                            error={errors.services?.[index]?.price?.message}
                          />
                          <Input
                            type="number"
                            placeholder="Min"
                            {...register(`services.${index}.duration` as const, { valueAsNumber: true })}
                            className="bg-white"
                            rightIcon={<span className="text-xs">min</span>}
                            error={errors.services?.[index]?.duration?.message}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-2 text-neutral-textLight hover:text-accent-red p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => append({ name: '', price: 0, duration: 0 })}
                  type="button"
                  leftIcon={<Plus size={18} />}
                >
                  Add Service
                </Button>

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" className="flex-1" onClick={handleBack} type="button">
                    <ChevronLeft size={18} className="mr-2" /> Back
                  </Button>
                  <Button className="flex-1" type="submit" isLoading={isSubmitting}>
                    Finish Registration
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Home Indicator - Only on Desktop */}
      <div className="hidden md:flex h-6 bg-white justify-center items-end pb-2 shrink-0">
        <div className="w-32 h-1 bg-neutral-darkNavy/20 rounded-full" />
      </div>
    </div>
  </div>
);
};

export default RegisterScreen;
