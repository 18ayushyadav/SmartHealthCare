import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorSearch from './pages/DoctorSearch';
import DoctorProfile from './pages/DoctorProfile';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Hospitals from './pages/Hospitals';

const Layout = ({ children, hideFooter = false }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '12px' },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
      }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Layout><DoctorSearch /></Layout>} />
        <Route path="/doctors/:id" element={<Layout><DoctorProfile /></Layout>} />
        <Route path="/hospitals" element={<Layout><Hospitals /></Layout>} />

        {/* Patient protected */}
        <Route path="/book/:doctorId" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Layout hideFooter><BookAppointment /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Layout><PatientDashboard /></Layout>
          </ProtectedRoute>
        } />

        {/* Doctor protected */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Layout><DoctorDashboard /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin protected */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout hideFooter><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <Layout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <div className="text-7xl mb-4">🩺</div>
              <h1 className="text-4xl font-extrabold text-slate-800 mb-2">404</h1>
              <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
