import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    CalendarCheck, User, Clock, CheckCircle, XCircle,
    Ban, Search, ChevronRight
} from 'lucide-react';

const STATUS_BADGE = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    rejected: 'badge-rejected',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
};

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        api.get('/appointments/my').then(({ data }) => setAppointments(data)).finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this appointment?')) return;
        try {
            await api.patch(`/appointments/${id}/cancel`);
            setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
            toast.success('Appointment cancelled');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        }
    };

    const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
    const past = appointments.filter(a => ['completed', 'rejected', 'cancelled'].includes(a.status));
    const display = activeTab === 'upcoming' ? upcoming : past;

    const stats = [
        { label: 'Total Booked', value: appointments.length, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="gradient-bg rounded-2xl p-6 text-white mb-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold shadow">
                                {user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold">Hello, {user?.name}! 👋</h1>
                                <p className="text-blue-200 text-sm">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <Link to="/doctors" className="flex items-center gap-2 bg-white text-primary-700 font-bold px-5 py-2.5 rounded-xl hover:shadow-lg transition-all active:scale-95 text-sm">
                        <Search size={15} /> Find Doctors
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
                    {stats.map(s => (
                        <div key={s.label} className={`card ${s.bg} border-0 text-center`}>
                            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Appointments */}
                <div className="card">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-800">My Appointments</h2>
                        <div className="flex bg-slate-100 rounded-xl p-1">
                            {['upcoming', 'past'].map(t => (
                                <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === t ? 'bg-white shadow text-primary-700' : 'text-slate-500'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)}
                        </div>
                    ) : display.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarCheck size={40} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500 text-sm">No {activeTab} appointments</p>
                            {activeTab === 'upcoming' && (
                                <Link to="/doctors" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">Book Now <ChevronRight size={14} /></Link>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 -my-3">
                            {display.map(appt => (
                                <div key={appt._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow">
                                        {appt.doctor_id?.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm">Dr. {appt.doctor_id?.name}</p>
                                        <p className="text-xs text-slate-500">{appt.doctor_id?.specialization}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><CalendarCheck size={11} />{appt.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={11} />{appt.time}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={STATUS_BADGE[appt.status] || 'badge'}>{appt.status}</span>
                                        {['pending', 'confirmed'].includes(appt.status) && (
                                            <button onClick={() => handleCancel(appt._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Cancel">
                                                <Ban size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
