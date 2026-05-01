import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { lazy, Suspense } from 'react';

// Lazy load pages
const LoginScreen = lazy(() => import('./pages/auth/LoginScreen.tsx'));
const RegisterScreen = lazy(() => import('./pages/auth/RegisterScreen.tsx'));
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard.tsx'));
const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard.tsx'));
const ViewerDashboard = lazy(() => import('./pages/viewer/ViewerDashboard.tsx'));
const QueueManagementScreen = lazy(() => import('./pages/shared/QueueManagementScreen.tsx'));
const CustomerListScreen = lazy(() => import('./pages/shared/CustomerListScreen.tsx'));
const AppointmentCalendarScreen = lazy(() => import('./pages/shared/AppointmentCalendarScreen.tsx'));
const AIAssistantScreen = lazy(() => import('./pages/shared/AIAssistantScreen.tsx'));
const StaffManagementScreen = lazy(() => import('./pages/owner/StaffManagementScreen.tsx'));
const AddStaffScreen = lazy(() => import('./pages/owner/AddStaffScreen.tsx'));
const EditStaffScreen = lazy(() => import('./pages/owner/EditStaffScreen.tsx'));
const StaffReportScreen = lazy(() => import('./pages/owner/StaffReportScreen.tsx'));
const StaffScheduleScreen = lazy(() => import('./pages/owner/StaffScheduleScreen.tsx'));
const AddTransactionScreen = lazy(() => import('./pages/shared/AddTransactionScreen.tsx'));
const AddCustomerScreen = lazy(() => import('./pages/shared/AddCustomerScreen.tsx'));
const CustomerDetailsScreen = lazy(() => import('./pages/shared/CustomerDetailsScreen.tsx'));
const SettingsScreen = lazy(() => import('./pages/shared/SettingsScreen.tsx'));
const LegalScreen = lazy(() => import('./pages/shared/LegalScreen.tsx'));

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-coffee-700 border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-manager"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-viewer"
            element={
              <ProtectedRoute allowedRoles={['VIEWER']}>
                <ViewerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'STAFF']}>
                <QueueManagementScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'STAFF', 'VIEWER']}>
                <CustomerListScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'STAFF']}>
                <AddCustomerScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'STAFF', 'VIEWER']}>
                <CustomerDetailsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'STAFF', 'VIEWER']}>
                <AppointmentCalendarScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'STAFF']}>
                <AIAssistantScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/new"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <AddStaffScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <EditStaffScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/report/:id"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <StaffReportScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/schedule/:id"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <StaffScheduleScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-management"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <StaffManagementScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/new"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'STAFF']}>
                <AddTransactionScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'STAFF', 'VIEWER']}>
                <SettingsScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/legal/:type" element={<LegalScreen />} />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
