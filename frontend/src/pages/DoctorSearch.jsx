import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import DoctorCard from '../components/DoctorCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const SPECIALIZATIONS = [
    'All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Dermatology', 'Dentistry', 'Ophthalmology', 'General Medicine',
];

const DoctorSearch = () => {
    const [params] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hospitals, setHospitals] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        specialization: params.get('specialization') || 'All',
        location: '',
        hospital: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await api.get('/doctors');
                setDoctors(data);
                setFiltered(data);
                const hospData = await api.get('/hospitals');
                setHospitals(hospData.data);
            } catch (_) { }
            setLoading(false);
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        let result = [...doctors];
        if (filters.name) result = result.filter(d => d.name.toLowerCase().includes(filters.name.toLowerCase()));
        if (filters.specialization && filters.specialization !== 'All') {
            result = result.filter(d => d.specialization.toLowerCase() === filters.specialization.toLowerCase());
        }
        if (filters.location) {
            result = result.filter(d => d.hospital?.location?.toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.hospital) {
            result = result.filter(d => d.hospital?._id === filters.hospital);
        }
        setFiltered(result);
    }, [filters, doctors]);

    const clearFilters = () => setFilters({ name: '', specialization: 'All', location: '', hospital: '' });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="gradient-bg text-white py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold mb-3">Find Your Doctor</h1>
                    <p className="text-blue-100 mb-6">Search from {doctors.length}+ verified specialists</p>
                    {/* Main search bar */}
                    <div className="relative max-w-lg mx-auto">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-lg"
                            placeholder="Search by doctor name..."
                            value={filters.name}
                            onChange={e => setFilters({ ...filters, name: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Specialization pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {SPECIALIZATIONS.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilters({ ...filters, specialization: s })}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filters.specialization === s
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Filters row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-sm">
                            <strong className="text-slate-800">{filtered.length}</strong> doctors found
                        </span>
                        {(filters.location || filters.hospital) && (
                            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-600 hover:underline">
                                <X size={12} /> Clear filters
                            </button>
                        )}
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:border-primary-300 transition-colors">
                        <SlidersHorizontal size={15} /> Filters
                    </button>
                </div>

                {/* Advanced filters */}
                {showFilters && (
                    <div className="card mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Location</label>
                            <input className="input-field text-sm" placeholder="e.g. Mumbai, Delhi"
                                value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Hospital</label>
                            <select className="input-field text-sm" value={filters.hospital} onChange={e => setFilters({ ...filters, hospital: e.target.value })}>
                                <option value="">All Hospitals</option>
                                {hospitals.map(h => <option key={h._id} value={h._id}>{h.hospital_name}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {/* Results */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                                    <div className="flex-1 space-y-2 pt-1">
                                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-slate-200 rounded" />
                                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No doctors found</h3>
                        <p className="text-slate-500">Try adjusting your search filters</p>
                        <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map(doctor => <DoctorCard key={doctor._id} doctor={doctor} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorSearch;
