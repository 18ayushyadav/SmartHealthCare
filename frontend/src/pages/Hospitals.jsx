import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, ChevronRight, Stethoscope } from 'lucide-react';

const Hospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/hospitals').then(({ data }) => setHospitals(data)).finally(() => setLoading(false));
    }, []);

    const filtered = hospitals.filter(h =>
        h.hospital_name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="gradient-bg text-white py-14 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold mb-3">Partner Hospitals</h1>
                    <p className="text-blue-100 mb-6">Find top-tier healthcare facilities near you</p>
                    <input
                        className="w-full max-w-md mx-auto block bg-white text-slate-800 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-lg"
                        placeholder="Search by hospital name or location..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => <div key={i} className="card h-40 animate-pulse bg-slate-100" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">No hospitals found</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(h => (
                            <div key={h._id} className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Building2 size={22} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{h.hospital_name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                            <MapPin size={11} className="text-primary-500" />{h.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600 border-t border-slate-50 pt-3">
                                    <div className="flex items-center gap-2"><Phone size={13} className="text-primary-500" />{h.contact}</div>
                                    <div className="flex items-center gap-2"><Stethoscope size={13} className="text-primary-500" />{h.doctors?.length || 0} doctors</div>
                                </div>
                                <Link to={`/doctors?hospital=${h._id}`} className="btn-primary w-full text-center text-sm mt-4 flex items-center justify-center gap-1">
                                    View Doctors <ChevronRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hospitals;
