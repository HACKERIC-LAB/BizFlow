import OwnerDashboard from '../owner/OwnerDashboard';

const ManagerDashboard = () => {
  // In a real app, we would pass props or use context to restrict actions
  // For this demo, it just renders the same UI but we can wrap it or add logic
  return <OwnerDashboard />;
};

export default ManagerDashboard;
