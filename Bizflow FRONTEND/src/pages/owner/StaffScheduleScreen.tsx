import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  ChevronLeft, 
  Save, 
  Trash2, 
  Plus 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../services/staffApi';

const StaffScheduleScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      staffApi.list().then(res => {
        const found = res.data.find((s: any) => s.id === id);
        if (found) {
          setMember(found);
          // If the member has a schedule, use it, otherwise use default
          setSchedule(found.schedule || days.map(day => ({
            day,
            off: day === 'Sunday',
            shifts: day === 'Sunday' ? [] : [{ start: '09:00', end: '18:00' }]
          })));
        }
        setIsLoading(false);
      });
    }
  }, [id]);

  const toggleDayOff = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].off = !newSchedule[index].off;
    if (!newSchedule[index].off && newSchedule[index].shifts.length === 0) {
      newSchedule[index].shifts = [{ start: '09:00', end: '18:00' }];
    }
    setSchedule(newSchedule);
  };

  const updateShift = (dayIndex: number, shiftIndex: number, field: 'start' | 'end', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].shifts[shiftIndex][field] = value;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    
    try {
      await staffApi.update(id, { schedule });
      toast.success('Schedule updated successfully!');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to update schedule');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <MainLayout>Loading...</MainLayout>;

  return (
    <MainLayout hideBottomNav>
      <div className="space-y-6 pb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-textMid">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Manage Schedule</h2>
            <p className="text-xs text-neutral-textLight">Set working hours for {member?.name}</p>
          </div>
        </div>

        <div className="space-y-4">
          {schedule.map((item, dayIndex) => (
            <Card key={item.day} className={`p-4 border-l-4 ${item.off ? 'border-l-neutral-border bg-neutral-background/50' : 'border-l-primary'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold ${item.off ? 'text-neutral-textLight' : 'text-neutral-darkNavy'}`}>
                    {item.day}
                  </h4>
                  {item.off && (
                    <span className="text-[10px] bg-neutral-border text-neutral-textMid px-2 py-0.5 rounded-full uppercase font-bold">
                      Day Off
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => toggleDayOff(dayIndex)}
                  className={`text-xs font-bold ${item.off ? 'text-primary' : 'text-accent-red'}`}
                >
                  {item.off ? 'Set Working' : 'Set Day Off'}
                </button>
              </div>

              {!item.off && (
                <div className="space-y-3">
                  {item.shifts.map((shift: any, shiftIndex: number) => (
                    <div key={shiftIndex} className="flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div className="relative">
                          <input 
                            type="time" 
                            className="w-full bg-neutral-background border border-neutral-border rounded-input px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
                            value={shift.start}
                            onChange={(e) => updateShift(dayIndex, shiftIndex, 'start', e.target.value)}
                          />
                        </div>
                        <div className="relative">
                          <input 
                            type="time" 
                            className="w-full bg-neutral-background border border-neutral-border rounded-input px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
                            value={shift.end}
                            onChange={(e) => updateShift(dayIndex, shiftIndex, 'end', e.target.value)}
                          />
                        </div>
                      </div>
                      <button className="p-1.5 text-neutral-textLight hover:text-accent-red">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <Plus size={14} /> Add Shift
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="pt-4">
          <Button 
            className="w-full shadow-large" 
            leftIcon={<Save size={18} />}
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save Weekly Schedule
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffScheduleScreen;
