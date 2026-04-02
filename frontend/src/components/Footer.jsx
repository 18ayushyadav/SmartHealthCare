import { Link } from 'react-router-dom';
import { HeartPulse, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                        <HeartPulse size={18} className="text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-white">MediConnect</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                    Smart Healthcare Connectivity Platform connecting patients with the best doctors and hospitals across the country.
                </p>
                <div className="flex gap-3 mt-5">
                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                        <button key={i} className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                            <Icon size={15} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
                <ul className="space-y-2.5 text-sm">
                    {[['/', 'Home'], ['/doctors', 'Find Doctors'], ['/hospitals', 'Hospitals'], ['/login', 'Login']].map(([to, label]) => (
                        <li key={to}><Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link></li>
                    ))}
                </ul>
            </div>

            {/* Contact */}
            <div>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
                <ul className="space-y-2.5 text-sm">
                    <li className="flex items-center gap-2"><Phone size={14} className="text-primary-400" />(+91) 98765-43210</li>
                    <li className="flex items-center gap-2"><Mail size={14} className="text-primary-400" />support@mediconnect.in</li>
                    <li className="flex items-center gap-2"><MapPin size={14} className="text-primary-400" />Delhi, India</li>
                </ul>
            </div>
        </div>

        <div className="border-t border-slate-800 px-4 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <span>© {new Date().getFullYear()} MediConnect. All rights reserved.</span>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-slate-300">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-300">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
