import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    CalendarCheck, Clock, CheckCircle, XCircle, Plus, Trash2, Building2, User
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const STATUS_BADGE = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    rejected: 'badge-rejected',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
};

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('appointments');
    const [availability, setAvailability] = useState([]);
    const [savingAvail, setSavingAvail] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get('/doctors/me'),
            api.get('/doctors/appointments'),
        ]).then(([p, a]) => {
            setProfile(p.data);
            setAvailability(p.data.availability || []);
            setAppointments(a.data);
        }).finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const { data } = await api.patch(`/appointments/${id}/status`, { status });
            setAppointments(prev => prev.map(a => a._id === id ? data : a));
            toast.success(`Appointment ${status}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const toggleDay = (day) => {
        if (availability.find(a => a.day === day)) {
            setAvailability(prev => prev.filter(a => a.day !== day));
        } else {
            setAvailability(prev => [...prev, { day, slots: DEFAULT_SLOTS.map(time => ({ time, isBooked: false })) }]);
        }
    };

    const saveAvailability = async () => {
        setSavingAvail(true);
        try {
            await api.put('/doctors/availability', { availability });
            toast.success('Availability updated!');
        } catch (err) {
            toast.error('Failed to update');
        } finally {
            setSavingAvail(false);
        }
    };

    const pending = appointments.filter(a => a.status === 'pending');
    const confirmed = appointments.filter(a => a.status === 'confirmed');

    const stats = [
        { label: "Today's Appointments", value: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length, color: 'text-primary-600' },
        { label: 'Pending', value: pending.length, color: 'text-amber-600' },
        { label: 'Confirmed', value: confirmed.length, color: 'text-emerald-600' },
        { label: 'Total', value: appointments.length, color: 'text-blue-600' },
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="gradient-bg rounded-2xl p-6 text-white mb-7">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold shadow">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold">Dr. {user?.name}</h1>
                            <div className="flex items-center gap-3 mt-1 text-blue-200 text-sm">
                                <span className="badge bg-white/20 text-white">{profile?.specialization}</span>
                                {profile?.hospital && <span className="flex items-center gap-1"><Building2 size={12} />{profile.hospital.hospital_name}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
                    {stats.map(s => (
                        <div key={s.label} className="card text-center">
                            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex bg-white border border-slate-100 rounded-2xl p-1 mb-6 shadow-sm">
                    {[['appointments', 'Appointments'], ['availability', 'Availability']].map(([t, l]) => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === t ? 'bg-primary-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}>
                            {l}
                        </button>
                    ))}
                </div>

                {activeTab === 'appointments' && (
                    <div className="card">
                        <h2 className="font-bold text-slate-800 mb-4">All Appointments</h2>
                        {appointments.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">No appointments yet</div>
                        ) : (
                            <div className="divide-y divide-slate-50 -my-3">
                                {appointments.map(appt => (
                                    <div key={appt._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow">
                                            {appt.patient_id?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 text-sm">{appt.patient_id?.name}</p>
                                            <p className="text-xs text-slate-500">{appt.patient_id?.email}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><CalendarCheck size={11} />{appt.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={11} />{appt.time}</span>
                                                {appt.reason && <span className="truncate max-w-xs">· {appt.reason}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={STATUS_BADGE[appt.status] || 'badge'}>{appt.status}</span>
                                            {appt.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleStatusChange(appt._id, 'confirmed')} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Confirm">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button onClick={() => handleStatusChange(appt._id, 'rejected')} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Reject">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'availability' && (
                    <div className="card">
                        <h2 className="font-bold text-slate-800 mb-2">Set Weekly Schedule</h2>
                        <p className="text-sm text-slate-500 mb-5">Toggle the days you are available. Default slots will be assigned.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            {DAYS.map(day => {
                                const active = availability.some(a => a.day === day);
                                return (
                                    <button key={day} onClick={() => toggleDay(day)}
                                        className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${active ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}>
                                        {day.slice(0, 3)}
                                    </button>
                                );
                            })}
                        </div>
                        {availability.map(avail => (
                            <div key={avail.day} className="mb-4">
                                <p className="text-sm font-semibold text-slate-700 mb-2">{avail.day}</p>
                                <div className="flex flex-wrap gap-2">
                                    {avail.slots.map((s, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg text-xs font-medium">{s.time}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button onClick={saveAvailability} disabled={savingAvail} className="btn-primary flex items-center gap-2 mt-4">
                            {savingAvail ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                            Save Schedule
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
