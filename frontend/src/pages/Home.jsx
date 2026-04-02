import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HeartPulse, Search, CalendarCheck, ShieldCheck, Clock,
    Star, ChevronRight, Users, Building2, Stethoscope, Award
} from 'lucide-react';

const SPECIALIZATIONS = [
    { name: 'Cardiology', icon: '❤️', color: 'bg-red-50 border-red-100' },
    { name: 'Neurology', icon: '🧠', color: 'bg-purple-50 border-purple-100' },
    { name: 'Orthopedics', icon: '🦴', color: 'bg-amber-50 border-amber-100' },
    { name: 'Pediatrics', icon: '👶', color: 'bg-pink-50 border-pink-100' },
    { name: 'Dermatology', icon: '🧴', color: 'bg-emerald-50 border-emerald-100' },
    { name: 'Dentistry', icon: '🦷', color: 'bg-sky-50 border-sky-100' },
    { name: 'Ophthalmology', icon: '👁️', color: 'bg-teal-50 border-teal-100' },
    { name: 'General Medicine', icon: '💊', color: 'bg-orange-50 border-orange-100' },
];

const STATS = [
    { icon: Users, value: '50,000+', label: 'Patients Served', color: 'text-primary-600' },
    { icon: Stethoscope, value: '1,200+', label: 'Expert Doctors', color: 'text-purple-600' },
    { icon: Building2, value: '80+', label: 'Partner Hospitals', color: 'text-emerald-600' },
    { icon: Award, value: '98%', label: 'Satisfaction Rate', color: 'text-amber-600' },
];

const FEATURES = [
    { icon: Search, title: 'Smart Doctor Search', desc: 'Filter by specialization, hospital, location, and availability in seconds.' },
    { icon: CalendarCheck, title: 'Instant Booking', desc: 'Book appointments online 24/7 without phone calls or long queues.' },
    { icon: ShieldCheck, title: 'Verified Doctors', desc: 'All doctors are verified professionals with validated credentials.' },
    { icon: Clock, title: 'Real-time Availability', desc: 'View live slot availability and get instant appointment confirmations.' },
];

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden gradient-bg text-white py-24 px-4">
                {/* decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            The #1 Healthcare Booking Platform in India
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                            Your Health,<br />Our <span className="text-amber-300">Priority</span>
                        </h1>
                        <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-xl">
                            Connect with top-rated doctors, book appointments instantly, and manage all your healthcare needs in one place.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/doctors" className="flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:shadow-xl transition-all active:scale-95">
                                <Search size={18} /> Find Doctors
                            </Link>
                            {!user && (
                                <Link to="/register" className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-xl border border-white/30 transition-all">
                                    Get Started <ChevronRight size={16} />
                                </Link>
                            )}
                        </div>
                        {/* Quick search stats */}
                        <div className="flex items-center gap-6 mt-10">
                            <div className="flex -space-x-3">
                                {['A', 'B', 'C', 'D'].map((l, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold shadow">
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1"><Star size={14} fill="#fbbf24" className="text-amber-400" /><Star size={14} fill="#fbbf24" className="text-amber-400" /><Star size={14} fill="#fbbf24" className="text-amber-400" /><Star size={14} fill="#fbbf24" className="text-amber-400" /><Star size={14} fill="#fbbf24" className="text-amber-400" /></div>
                                <p className="text-xs text-blue-200">Trusted by 50,000+ patients</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero card */}
                    <div className="hidden lg:flex justify-center">
                        <div className="w-full max-w-sm glass-card p-6 text-slate-800">
                            <h3 className="font-bold text-lg mb-4 text-slate-900">Quick Appointment</h3>
                            <div className="space-y-3 mb-4">
                                <select className="input-field text-sm">
                                    <option>Select Specialization</option>
                                    {SPECIALIZATIONS.map(s => <option key={s.name}>{s.name}</option>)}
                                </select>
                                <input className="input-field text-sm" placeholder="Your Location" />
                                <input className="input-field text-sm" type="date" />
                            </div>
                            <Link to="/doctors" className="btn-primary w-full text-center block">Find Available Doctors</Link>
                            <p className="text-center text-xs text-slate-500 mt-3">100% free to search and book</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map(({ icon: Icon, value, label, color }) => (
                        <div key={label} className="text-center">
                            <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
                            <div className="text-sm text-slate-500 mt-1">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Specializations */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Browse by Specialization</h2>
                    <p className="text-slate-500">Find specialists across every medical field</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {SPECIALIZATIONS.map((s) => (
                        <Link
                            to={`/doctors?specialization=${encodeURIComponent(s.name)}`}
                            key={s.name}
                            className={`card flex flex-col items-center justify-center p-5 text-center border-2 hover:border-primary-300 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer ${s.color}`}
                        >
                            <span className="text-3xl mb-2">{s.icon}</span>
                            <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Why Choose MediConnect?</h2>
                        <p className="text-slate-500">A seamless healthcare experience from search to consultation</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="card text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 shadow-md">
                                    <Icon size={24} className="text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 hero-gradient text-white text-center">
                <div className="max-w-2xl mx-auto">
                    <HeartPulse size={48} className="mx-auto mb-4 opacity-90" />
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
                    <p className="text-blue-100 mb-8 text-lg">Join 50,000+ patients who trust MediConnect for their healthcare needs.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {!user ? (
                            <>
                                <Link to="/register" className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all active:scale-95">Register as Patient</Link>
                                <Link to="/login" className="bg-white/15 border border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/25 transition-all">Login</Link>
                            </>
                        ) : (
                            <Link to="/doctors" className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all active:scale-95">
                                Find Doctors Now
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
