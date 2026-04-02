import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Star, Briefcase, Building2, Phone, IndianRupee,
    Clock, ChevronLeft, Calendar
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/doctors/${id}`).then(({ data }) => setDoctor(data)).finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!doctor) return <div className="text-center py-20 text-slate-500">Doctor not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
                    <ChevronLeft size={16} /> Back to Results
                </button>

                {/* Profile Card */}
                <div className="card mb-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-4xl font-extrabold text-white flex-shrink-0 shadow-lg">
                            {doctor.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-slate-900">Dr. {doctor.name}</h1>
                                    <span className="badge bg-primary-100 text-primary-700 mt-1">{doctor.specialization}</span>
                                    {doctor.rating > 0 && (
                                        <div className="flex items-center gap-1 mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < Math.round(doctor.rating) ? '#f59e0b' : 'none'} className={i < Math.round(doctor.rating) ? 'text-amber-400' : 'text-slate-300'} />
                                            ))}
                                            <span className="text-sm text-slate-500 ml-1">{doctor.rating}/5</span>
                                        </div>
                                    )}
                                </div>
                                {user?.role === 'patient' && (
                                    <Link to={`/book/${doctor._id}`} className="btn-primary flex items-center gap-2">
                                        <Calendar size={16} /> Book Appointment
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Briefcase size={15} className="text-primary-500" />
                                    <span><strong>{doctor.experience}</strong> years experience</span>
                                </div>
                                {doctor.hospital && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Building2 size={15} className="text-primary-500" />
                                        <span>{doctor.hospital.hospital_name}</span>
                                    </div>
                                )}
                                {doctor.fee > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <IndianRupee size={15} className="text-primary-500" />
                                        <span>₹{doctor.fee} consultation</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Bio */}
                    <div className="md:col-span-2 space-y-5">
                        {doctor.bio && (
                            <div className="card">
                                <h2 className="font-bold text-slate-800 mb-3">About</h2>
                                <p className="text-slate-600 text-sm leading-relaxed">{doctor.bio}</p>
                            </div>
                        )}

                        {/* Availability */}
                        <div className="card">
                            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Clock size={16} className="text-primary-500" /> Availability Schedule
                            </h2>
                            {doctor.availability && doctor.availability.length > 0 ? (
                                <div className="space-y-3">
                                    {DAYS.filter(d => doctor.availability.some(a => a.day === d)).map(day => {
                                        const avail = doctor.availability.find(a => a.day === day);
                                        return (
                                            <div key={day} className="flex items-start gap-3">
                                                <span className="w-28 text-sm font-medium text-slate-700 flex-shrink-0">{day}</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {avail.slots.map((slot, i) => (
                                                        <span key={i} className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${slot.isBooked ? 'bg-red-50 text-red-500 border-red-200 line-through' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                                                            {slot.time}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No availability schedule set yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {doctor.hospital && (
                            <div className="card">
                                <h2 className="font-bold text-slate-800 mb-3">Hospital</h2>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p className="font-semibold text-slate-800">{doctor.hospital.hospital_name}</p>
                                    <p>{doctor.hospital.location}</p>
                                    {doctor.hospital.contact && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={13} className="text-primary-500" /> {doctor.hospital.contact}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="card bg-gradient-to-br from-primary-600 to-purple-700 text-white">
                            <h3 className="font-bold mb-2">Book a Consultation</h3>
                            <p className="text-blue-100 text-sm mb-4">Get specialist care from the comfort of your home</p>
                            {user?.role === 'patient' ? (
                                <Link to={`/book/${doctor._id}`} className="block w-full bg-white text-primary-700 font-bold text-center py-2.5 rounded-xl hover:shadow-lg transition-all active:scale-95 text-sm">
                                    Book Appointment
                                </Link>
                            ) : (
                                <Link to="/login" className="block w-full bg-white text-primary-700 font-bold text-center py-2.5 rounded-xl text-sm">
                                    Login to Book
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
