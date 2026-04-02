import { Link } from 'react-router-dom';
import { Star, Briefcase, Building2, Clock, IndianRupee } from 'lucide-react';

const SPECIALIZATION_COLORS = {
    Cardiology: 'bg-red-100 text-red-700',
    Neurology: 'bg-purple-100 text-purple-700',
    Orthopedics: 'bg-amber-100 text-amber-700',
    Pediatrics: 'bg-pink-100 text-pink-700',
    Dermatology: 'bg-emerald-100 text-emerald-700',
    Dentistry: 'bg-sky-100 text-sky-700',
    default: 'bg-primary-100 text-primary-700',
};

const avatarColors = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-emerald-500 to-teal-400',
    'from-amber-500 to-orange-400',
    'from-red-500 to-rose-400',
];

const DoctorCard = ({ doctor }) => {
    const colors = avatarColors[doctor.name?.charCodeAt(0) % avatarColors.length];
    const specColor = SPECIALIZATION_COLORS[doctor.specialization] || SPECIALIZATION_COLORS.default;

    return (
        <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                {doctor.avatar ? (
                    <img src={doctor.avatar} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                ) : (
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md`}>
                        {doctor.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-base truncate group-hover:text-primary-700 transition-colors">
                        Dr. {doctor.name}
                    </h3>
                    <span className={`badge mt-1 ${specColor}`}>{doctor.specialization}</span>
                    {doctor.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                            <Star size={12} fill="#f59e0b" className="text-amber-400" />
                            <span className="text-xs text-slate-500 font-medium">{doctor.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2 flex-1">
                {doctor.hospital && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Building2 size={13} className="text-primary-400 flex-shrink-0" />
                        <span className="truncate">{doctor.hospital.hospital_name}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Briefcase size={13} className="text-primary-400 flex-shrink-0" />
                    <span>{doctor.experience} years experience</span>
                </div>
                {doctor.fee > 0 && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <IndianRupee size={13} className="text-primary-400 flex-shrink-0" />
                        <span>₹{doctor.fee} consultation fee</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <Link to={`/doctors/${doctor._id}`} className="btn-secondary flex-1 text-sm text-center py-2">
                    View Profile
                </Link>
                <Link to={`/book/${doctor._id}`} className="btn-primary flex-1 text-sm text-center py-2">
                    Book Now
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;
