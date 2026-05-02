import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Edit2, 
  Search,
  Package,
  Dumbbell,
  Clock,
  CircleDollarSign
} from 'lucide-react';
import { businessApi } from '../../services/businessApi';
import toast from 'react-hot-toast';

const ServicesManagementScreen = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '0'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await businessApi.getServices();
      setServices(res.data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };

    try {
      if (editingService) {
        // Find and update in the list for bulk update
        const updatedServices = services.map(s => 
          s.id === editingService.id ? { ...s, ...serviceData } : s
        );
        await businessApi.updateServices(updatedServices);
        toast.success('Service updated');
      } else {
        const updatedServices = [...services, serviceData];
        await businessApi.updateServices(updatedServices);
        toast.success('Service added');
      }
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ name: '', price: '', duration: '0' });
      fetchServices();
    } catch (error) {
      toast.error('Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const updatedServices = services.filter(s => s.id !== id);
      await businessApi.updateServices(updatedServices);
      toast.success('Service removed');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 pb-20 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-coffee-500">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold">Manage Services</h2>
          </div>
          <Button 
            size="sm" 
            leftIcon={<Plus size={18} />} 
            onClick={() => {
              setEditingService(null);
              setFormData({ name: '', price: '', duration: '0' });
              setIsModalOpen(true);
            }}
          >
            Add New
          </Button>
        </div>

        <div className="relative">
          <Input 
            placeholder="Search services..." 
            leftIcon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center p-20">
            <div className="w-8 h-8 border-4 border-coffee-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Card key={service.id} className="p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-coffee-50 flex items-center justify-center text-coffee-900">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-coffee-900">{service.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-coffee-400 uppercase">
                          <CircleDollarSign size={10} />
                          KSh {service.price.toLocaleString()}
                        </span>
                        {service.duration > 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-coffee-400 uppercase">
                            <Clock size={10} />
                            {service.duration} mins
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingService(service);
                        setFormData({
                          name: service.name,
                          price: service.price.toString(),
                          duration: service.duration.toString()
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-coffee-400 hover:text-coffee-900 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-coffee-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-coffee-50/50 rounded-[2.5rem] border-2 border-dashed border-coffee-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-coffee-200">
                  <Dumbbell size={32} />
                </div>
                <p className="text-coffee-900 font-bold">No services found</p>
                <p className="text-sm text-coffee-500 mb-6">Add your first service to start recording transactions.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Your First Service
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-coffee-900/40 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-md p-8 relative shadow-2xl">
              <h3 className="text-2xl font-black text-coffee-900 mb-6">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input 
                  label="Service Name" 
                  placeholder="e.g. Monthly Membership"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Price" 
                    placeholder="500"
                    prefix="KSh"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                  <Input 
                    label="Duration (mins)" 
                    placeholder="0"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button className="flex-2" type="submit">
                    {editingService ? 'Update Service' : 'Add Service'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ServicesManagementScreen;
