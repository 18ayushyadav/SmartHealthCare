import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
    Users, Stethoscope, Building2, CalendarCheck, Trash2,
    TrendingUp, CheckCircle, Clock, XCircle, Plus
} from 'lucide-react';

const TABS = ['overview', 'patients', 'doctors', 'hospitals', 'appointments'];

const StatCard = ({ icon: Icon, label, value, color, subValue, subLabel }) => (
    <div className="card flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
            {subValue !== undefined && <p className="text-xs text-slate-400 mt-0.5">{subValue} {subLabel}</p>}
        </div>
    </div>
);

const AdminDashboard = () => {
    const [tab, setTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showHospitalForm, setShowHospitalForm] = useState(false);
    const [hospitalForm, setHospitalForm] = useState({ hospital_name: '', location: '', contact: '', email: '', description: '' });

    useEffect(() => { api.get('/admin/stats').then(({ data }) => setStats(data)); }, []);

    const load = async (t) => {
        setTab(t);
        if (t === 'patients' && !patients.length) {
            const { data } = await api.get('/admin/patients'); setPatients(data);
        } else if (t === 'doctors' && !doctors.length) {
            const { data } = await api.get('/admin/doctors'); setDoctors(data);
        } else if (t === 'hospitals' && !hospitals.length) {
            const { data } = await api.get('/admin/hospitals'); setHospitals(data);
        } else if (t === 'appointments' && !appointments.length) {
            const { data } = await api.get('/admin/appointments'); setAppointments(data);
        }
    };

    const del = async (type, id, setter) => {
        if (!window.confirm('Are you sure?')) return;
        await api.delete(`/admin/${type}/${id}`);
        setter(prev => prev.filter(x => x._id !== id));
        toast.success('Deleted');
    };

    const handleAddHospital = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/hospitals/register', hospitalForm);
            setHospitals([data, ...hospitals]);
            toast.success('Hospital added successfully');
            setShowHospitalForm(false);
            setHospitalForm({ hospital_name: '', location: '', contact: '', email: '', description: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add hospital');
        }
    };

    const STATUS_COLORS = { pending: 'badge-pending', confirmed: 'badge-confirmed', rejected: 'badge-rejected', completed: 'badge-completed', cancelled: 'badge-cancelled' };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="gradient-bg rounded-2xl p-6 text-white mb-7 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold mb-1">Admin Dashboard</h1>
                        <p className="text-blue-200 text-sm">MediConnect Control Center</p>
                    </div>
                </div>

                {/* Tab Nav */}
                <div className="flex overflow-x-auto gap-2 mb-7 pb-1">
                    {TABS.map(t => (
                        <button key={t} onClick={() => load(t)}
                            className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'}`}>
                            {t}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {tab === 'overview' && stats && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard icon={Users} label="Total Patients" value={stats.patients} color="bg-primary-600" />
                            <StatCard icon={Stethoscope} label="Total Doctors" value={stats.doctors} color="bg-purple-600" />
                            <StatCard icon={Building2} label="Hospitals" value={stats.hospitals} color="bg-emerald-600" />
                            <StatCard icon={CalendarCheck} label="Appointments" value={stats.appointments} color="bg-amber-600" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Pending', value: stats.pending, ic: Clock, c: 'text-amber-600 bg-amber-50' },
                                { label: 'Confirmed', value: stats.confirmed, ic: CheckCircle, c: 'text-emerald-600 bg-emerald-50' },
                                { label: 'Completed', value: stats.completed, ic: TrendingUp, c: 'text-blue-600 bg-blue-50' },
                                { label: 'Rejected', value: stats.rejected, ic: XCircle, c: 'text-red-600 bg-red-50' },
                            ].map(({ label, value, ic: Ic, c }) => (
                                <div key={label} className={`card ${c.split(' ')[1]} border-0 flex items-center gap-3`}>
                                    <Ic size={22} className={c.split(' ')[0]} />
                                    <div>
                                        <p className={`text-2xl font-extrabold ${c.split(' ')[0]}`}>{value}</p>
                                        <p className="text-xs text-slate-500">{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Patients */}
                {tab === 'patients' && (
                    <div className="card">
                        <h2 className="font-bold text-slate-800 mb-4">All Patients ({patients.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-slate-100">
                                    {['Name', 'Email', 'Phone', 'Joined', 'Actions'].map(h => <th key={h} className="text-left py-3 px-3 text-xs text-slate-500 font-semibold uppercase">{h}</th>)}
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {patients.map(p => (
                                        <tr key={p._id} className="hover:bg-slate-50">
                                            <td className="py-3 px-3 font-medium text-slate-800">{p.name}</td>
                                            <td className="py-3 px-3 text-slate-500">{p.email}</td>
                                            <td className="py-3 px-3 text-slate-500">{p.phone}</td>
                                            <td className="py-3 px-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 px-3">
                                                <button onClick={() => del('patients', p._id, setPatients)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {patients.length === 0 && <p className="text-center py-8 text-slate-500">No patients found</p>}
                        </div>
                    </div>
                )}

                {/* Doctors */}
                {tab === 'doctors' && (
                    <div className="card">
                        <h2 className="font-bold text-slate-800 mb-4">All Doctors ({doctors.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-slate-100">
                                    {['Name', 'Specialization', 'Hospital', 'Experience', 'Actions'].map(h => <th key={h} className="text-left py-3 px-3 text-xs text-slate-500 font-semibold uppercase">{h}</th>)}
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {doctors.map(d => (
                                        <tr key={d._id} className="hover:bg-slate-50">
                                            <td className="py-3 px-3 font-medium text-slate-800">Dr. {d.name}</td>
                                            <td className="py-3 px-3"><span className="badge bg-primary-100 text-primary-700">{d.specialization}</span></td>
                                            <td className="py-3 px-3 text-slate-500">{d.hospital?.hospital_name || '—'}</td>
                                            <td className="py-3 px-3 text-slate-500">{d.experience} yrs</td>
                                            <td className="py-3 px-3">
                                                <button onClick={() => del('doctors', d._id, setDoctors)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {doctors.length === 0 && <p className="text-center py-8 text-slate-500">No doctors found</p>}
                        </div>
                    </div>
                )}

                {/* Hospitals */}
                {tab === 'hospitals' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-slate-800 text-xl">All Hospitals ({hospitals.length})</h2>
                            <button onClick={() => setShowHospitalForm(!showHospitalForm)} className="btn-primary flex items-center gap-2 text-sm py-2">
                                <Plus size={16} /> {showHospitalForm ? 'Cancel' : 'Add Hospital'}
                            </button>
                        </div>
                        
                        {showHospitalForm && (
                            <div className="card shadow-md border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4">Add New Hospital</h3>
                                <form onSubmit={handleAddHospital} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name</label>
                                            <input type="text" required className="input-field" placeholder="City General Hospital"
                                                value={hospitalForm.hospital_name} onChange={e => setHospitalForm({...hospitalForm, hospital_name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                            <input type="text" required className="input-field" placeholder="123 Health Ave, City"
                                                value={hospitalForm.location} onChange={e => setHospitalForm({...hospitalForm, location: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                                            <input type="text" required className="input-field" placeholder="+1 234 567 8900"
                                                value={hospitalForm.contact} onChange={e => setHospitalForm({...hospitalForm, contact: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                            <input type="email" required className="input-field" placeholder="contact@hospital.com"
                                                value={hospitalForm.email} onChange={e => setHospitalForm({...hospitalForm, email: e.target.value})} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea className="input-field h-20 resize-none" placeholder="Brief description of the hospital facilities..."
                                            value={hospitalForm.description} onChange={e => setHospitalForm({...hospitalForm, description: e.target.value})}></textarea>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button type="submit" className="btn-primary py-2 px-6">Save Hospital</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="card">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                <thead><tr className="border-b border-slate-100">
                                    {['Hospital Name', 'Location', 'Contact', 'Doctors', 'Actions'].map(h => <th key={h} className="text-left py-3 px-3 text-xs text-slate-500 font-semibold uppercase">{h}</th>)}
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {hospitals.map(h => (
                                        <tr key={h._id} className="hover:bg-slate-50">
                                            <td className="py-3 px-3 font-medium text-slate-800">{h.hospital_name}</td>
                                            <td className="py-3 px-3 text-slate-500">{h.location}</td>
                                            <td className="py-3 px-3 text-slate-500">{h.contact}</td>
                                            <td className="py-3 px-3 text-slate-500">{h.doctors?.length || 0}</td>
                                            <td className="py-3 px-3">
                                                <button onClick={() => del('hospitals', h._id, setHospitals)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {hospitals.length === 0 && <p className="text-center py-8 text-slate-500">No hospitals found</p>}
                        </div>
                    </div>
                    </div>
                )}

                {/* Appointments */}
                {tab === 'appointments' && (
                    <div className="card">
                        <h2 className="font-bold text-slate-800 mb-4">All Appointments ({appointments.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-slate-100">
                                    {['Patient', 'Doctor', 'Date', 'Time', 'Status'].map(h => <th key={h} className="text-left py-3 px-3 text-xs text-slate-500 font-semibold uppercase">{h}</th>)}
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {appointments.map(a => (
                                        <tr key={a._id} className="hover:bg-slate-50">
                                            <td className="py-3 px-3 text-slate-800 font-medium">{a.patient_id?.name}</td>
                                            <td className="py-3 px-3 text-slate-600">Dr. {a.doctor_id?.name}</td>
                                            <td className="py-3 px-3 text-slate-500">{a.date}</td>
                                            <td className="py-3 px-3 text-slate-500">{a.time}</td>
                                            <td className="py-3 px-3"><span className={STATUS_COLORS[a.status] || 'badge'}>{a.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {appointments.length === 0 && <p className="text-center py-8 text-slate-500">No appointments found</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
