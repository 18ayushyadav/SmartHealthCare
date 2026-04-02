import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HeartPulse, Menu, X, User, LogOut, LayoutDashboard,
    Search, ChevronDown
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'patient') return '/patient/dashboard';
        if (user.role === 'doctor') return '/doctor/dashboard';
        if (user.role === 'admin') return '/admin/dashboard';
        return '/';
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <HeartPulse size={18} className="text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-gradient">MediConnect</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-1">
                    <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'text-primary-700 bg-primary-50' : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'}`}>Home</Link>
                    <Link to="/doctors" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/doctors') ? 'text-primary-700 bg-primary-50' : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'}`}>Find Doctors</Link>
                    <Link to="/hospitals" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/hospitals') ? 'text-primary-700 bg-primary-50' : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'}`}>Hospitals</Link>
                </div>

                {/* Auth area */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropOpen(!dropOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                <ChevronDown size={14} className="text-slate-500" />
                            </button>
                            {dropOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                    <div className="p-3 border-b border-slate-50">
                                        <p className="text-xs text-slate-500">Signed in as</p>
                                        <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                                        <span className="badge bg-primary-100 text-primary-700 mt-1">{user.role}</span>
                                    </div>
                                    <Link to={getDashboardLink()} onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-primary-50 transition-colors">
                                        <LayoutDashboard size={15} /> Dashboard
                                    </Link>
                                    <button onClick={() => { handleLogout(); setDropOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                        <LogOut size={15} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary text-sm py-2">Login</Link>
                            <Link to="/register" className="btn-primary text-sm py-2">Register</Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2">
                    <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Home</Link>
                    <Link to="/doctors" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Find Doctors</Link>
                    <Link to="/hospitals" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Hospitals</Link>
                    {user ? (
                        <>
                            <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-primary-700 hover:bg-primary-50 font-medium">Dashboard</Link>
                            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">Logout</button>
                        </>
                    ) : (
                        <div className="flex gap-2 pt-2">
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-center text-sm">Login</Link>
                            <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm">Register</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
