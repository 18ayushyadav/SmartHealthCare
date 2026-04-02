import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    Building2, Briefcase, IndianRupee, CalendarCheck, Clock,
    ChevronLeft, CheckCircle
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const BookAppointment = () => {
    const { doctorId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        api.get(`/doctors/${doctorId}`).then(({ data }) => {
            setDoctor(data);
            if (!user) navigate('/login');
        }).finally(() => setLoading(false));
    }, [doctorId]);

    const availableDays = doctor?.availability?.map(a => a.day) || [];
    const daySlots = doctor?.availability?.find(a => a.day === selectedDay)?.slots?.filter(s => !s.isBooked) || [];

    const handleBook = async (e) => {
        e.preventDefault();
        if (!selectedSlot || !date) return toast.error('Please select a date and time slot');
        setSubmitting(true);
        try {
            await api.post('/appointments', {
                doctor_id: doctorId,
                date,
                time: selectedSlot,
                reason,
            });
            setConfirmed(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

    if (confirmed) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center shadow-xl">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                        <CheckCircle size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Appointment Booked!</h2>
                    <p className="text-slate-500 mb-6">Your appointment with <strong>Dr. {doctor?.name}</strong> on <strong>{date}</strong> at <strong>{selectedSlot}</strong> has been requested. You'll receive a confirmation email shortly.</p>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/patient/dashboard')} className="btn-primary flex-1">View Dashboard</button>
                        <button onClick={() => navigate('/doctors')} className="btn-secondary flex-1">Find Another Doctor</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
                    <ChevronLeft size={16} /> Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Doctor Info */}
                    <div className="md:col-span-1">
                        <div className="card sticky top-20">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-md">
                                {doctor?.name?.charAt(0)}
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg">Dr. {doctor?.name}</h3>
                            <span className="badge bg-primary-100 text-primary-700 mt-1 mb-3">{doctor?.specialization}</span>
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2"><Briefcase size={13} className="text-primary-500" />{doctor?.experience} yrs exp</div>
                                {doctor?.hospital && <div className="flex items-center gap-2"><Building2 size={13} className="text-primary-500" />{doctor.hospital.hospital_name}</div>}
                                {doctor?.fee > 0 && <div className="flex items-center gap-2"><IndianRupee size={13} className="text-primary-500" />₹{doctor.fee} fee</div>}
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="md:col-span-2">
                        <div className="card shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <CalendarCheck className="text-primary-500" size={20} /> Book Your Appointment
                            </h2>

                            <form onSubmit={handleBook} className="space-y-5">
                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Date</label>
                                    <input type="date" required className="input-field" min={new Date().toISOString().split('T')[0]}
                                        value={date}
                                        onChange={e => {
                                            setDate(e.target.value);
                                            const d = new Date(e.target.value);
                                            const dayName = DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
                                            setSelectedDay(availableDays.includes(dayName) ? dayName : '');
                                            setSelectedSlot('');
                                        }}
                                    />
                                    {date && !selectedDay && <p className="text-xs text-amber-600 mt-1">Doctor is not available on this day</p>}
                                </div>

                                {/* Day detection info */}
                                {selectedDay && (
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                                        ✅ Dr. {doctor?.name} is available on <strong>{selectedDay}s</strong>
                                    </div>
                                )}

                                {/* Time slots */}
                                {daySlots.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                                            <Clock size={14} className="text-primary-500" /> Select Time Slot
                                        </label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {daySlots.map((slot, i) => (
                                                <button type="button" key={i}
                                                    onClick={() => setSelectedSlot(slot.time)}
                                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${selectedSlot === slot.time ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-primary-400'}`}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason for Visit <span className="text-slate-400 font-normal">(optional)</span></label>
                                    <textarea rows={3} className="input-field resize-none" placeholder="Describe your symptoms or reason..."
                                        value={reason} onChange={e => setReason(e.target.value)} />
                                </div>

                                <button type="submit" disabled={submitting || !selectedSlot} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                                    {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CalendarCheck size={18} /> Confirm Appointment</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
