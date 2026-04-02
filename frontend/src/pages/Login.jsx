import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HeartPulse, Eye, EyeOff, LogIn } from 'lucide-react';

const ROLES = [
    { label: 'Patient', value: 'patient' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Admin', value: 'admin' },
];

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('patient');
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post(`/auth/${role}/login`, form);
            login(data, data.token);
            toast.success(`Welcome back, ${data.name || data.username}!`);
            if (role === 'patient') navigate('/patient/dashboard');
            else if (role === 'doctor') navigate('/doctor/dashboard');
            else navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl mb-3">
                        <HeartPulse size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gradient">MediConnect</h1>
                    <p className="text-slate-500 mt-1">Sign in to your account</p>
                </div>

                <div className="card shadow-xl">
                    {/* Role tabs */}
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                        {ROLES.map(r => (
                            <button
                                key={r.value}
                                onClick={() => setRole(r.value)}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === r.value ? 'bg-white shadow text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    className="input-field pr-11"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {role === 'admin' && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                                💡 Default admin: <strong>admin@mediconnect.com</strong> / <strong>admin123</strong>
                                <br />(Run <code>POST /api/admin/seed</code> first to create it)
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>

                    {role === 'patient' && (
                        <p className="text-center text-sm text-slate-500 mt-5">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register now</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
