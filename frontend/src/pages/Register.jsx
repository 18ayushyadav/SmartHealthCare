import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HeartPulse, Eye, EyeOff, UserPlus } from 'lucide-react';

const ROLES = [
    { label: 'Patient', value: 'patient' },
    { label: 'Doctor', value: 'doctor' },
];

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('patient');
    const [form, setForm] = useState({ 
        name: '', email: '', phone: '', password: '', confirmPassword: '',
        specialization: '', experience: '', fee: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        
        if (role === 'doctor' && !form.specialization) return toast.error('Specialization is required for doctors');

        setLoading(true);
        try {
            const endpoint = role === 'patient' ? '/auth/patient/register' : '/auth/doctor/register';
            const payload = role === 'patient' 
                ? { name: form.name, email: form.email, phone: form.phone, password: form.password }
                : { 
                    name: form.name, email: form.email, phone: form.phone, 
                    password: form.password, specialization: form.specialization,
                    experience: Number(form.experience) || 0, fee: Number(form.fee) || 0
                };

            const { data } = await api.post(endpoint, payload);
            login(data, data.token);
            toast.success(`Welcome to MediConnect, ${role === 'doctor' ? 'Dr. ' : ''}${data.name}!`);
            
            if (role === 'patient') navigate('/patient/dashboard');
            else navigate('/doctor/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl mb-3">
                        <HeartPulse size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gradient">Create Account</h1>
                    <p className="text-slate-500 mt-1">Join MediConnect today</p>
                </div>

                <div className="card shadow-xl">
                    {/* Role tabs */}
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                        {ROLES.map(r => (
                            <button
                                key={r.value}
                                onClick={() => {
                                    setRole(r.value);
                                    setForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', specialization: '', experience: '', fee: '' });
                                }}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === r.value ? 'bg-white shadow text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                            <input type="text" required className="input-field" placeholder="John Doe"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <input type="email" required className="input-field" placeholder="you@example.com"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                                <input type="tel" required className="input-field" placeholder="9876543210"
                                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                        </div>

                        {role === 'doctor' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Specialization</label>
                                    <input type="text" required className="input-field" placeholder="e.g. Cardiologist"
                                        value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience (Years)</label>
                                        <input type="number" min="0" className="input-field" placeholder="0"
                                            value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Consultation Fee (₹)</label>
                                        <input type="number" min="0" className="input-field" placeholder="500"
                                            value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} required className="input-field pr-11"
                                    placeholder="Min. 6 characters"
                                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                            <input type="password" required className="input-field" placeholder="Re-enter password"
                                value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={18} /> Register as {role === 'doctor' ? 'Doctor' : 'Patient'}</>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
