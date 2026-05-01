import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { 
  Plus, 
  Clock,
} from 'lucide-react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { appointmentApi } from '../../services/appointmentApi';
import toast from 'react-hot-toast';

const AppointmentCalendarScreen = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    setIsLoading(true);
    appointmentApi.list({ date: format(selectedDate, 'yyyy-MM-dd') })
      .then(res => setAppointments(res.data))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setIsLoading(false));
  }, [selectedDate]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Bookings</h2>
          <Button 
            size="sm" 
            leftIcon={<Plus size={18} />}
            onClick={() => navigate('/transactions/new')}
          >
            New Booking
          </Button>
        </div>

        {/* Horizontal Calendar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-card border-2 transition-standard shrink-0 ${
                  isSelected ? 'bg-primary border-primary text-white' : 'bg-white border-neutral-border text-neutral-textMid hover:border-primary/50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1">
                  {format(day, 'EEE')}
                </span>
                <span className="text-lg font-bold">
                  {format(day, 'd')}
                </span>
                {isSelected && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
              </button>
            );
          })}
        </div>

        {/* Selected Day View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-neutral-darkNavy">
              {isSameDay(selectedDate, startOfToday()) ? 'Today' : format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <span className="text-xs text-neutral-textLight font-medium">{appointments.length} Appointments</span>
          </div>

          <div className="space-y-4 relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-border z-0" />

            {isLoading ? (
              [1, 2].map(i => <div key={i} className="h-24 bg-neutral-background animate-pulse rounded-card ml-10" />)
            ) : appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt.id} className="relative z-10 pl-10">
                  <div className="absolute left-[13px] top-4 w-2.5 h-2.5 rounded-full border-2 border-white bg-primary shadow-subtle" />
                  <Card className="p-4 flex justify-between items-start hover:border-primary transition-standard">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        <span className="text-sm font-bold text-primary">{format(new Date(apt.startTime), 'hh:mm a')}</span>
                      </div>
                      <h4 className="font-bold text-neutral-darkNavy">{apt.customer.name}</h4>
                      <p className="text-xs text-neutral-textLight">{apt.service.name} with {apt.staff.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase ${
                      apt.status === 'CONFIRMED' ? 'bg-primary-soft text-primary' :
                      apt.status === 'PENDING' ? 'bg-gold-light text-gold' : 'bg-neutral-background text-neutral-textLight'
                    }`}>
                      {apt.status}
                    </span>
                  </Card>
                </div>
              ))
            ) : (
              <div className="pl-10 py-10 text-center text-neutral-textLight text-sm italic">
                No appointments for this day
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AppointmentCalendarScreen;
