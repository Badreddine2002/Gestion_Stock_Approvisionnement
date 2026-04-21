import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Package, Lock, Mail, Loader2, Moon, Sun, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants invalides');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
            {/* Dynamic Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
            </div>

            {/* Theme Toggle */}
            <button 
                onClick={toggleDarkMode}
                className="absolute top-8 right-8 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all z-20"
            >
                {darkMode ? <Sun size={22} className="text-orange-400" /> : <Moon size={22} className="text-indigo-400" />}
            </button>

            <div className="max-w-xl w-full grid lg:grid-cols-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 dark:border-slate-800/50 z-10 animate-in fade-in zoom-in-95 duration-700">
                
                {/* Visual Side (Hidden on Mobile) */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 to-blue-700 relative overflow-hidden text-white">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl shadow-inner border border-white/10">
                            <Package size={32} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-outfit font-extrabold leading-tight">
                            Gérez votre stock <br />
                            <span className="text-primary-200">avec excellence.</span>
                        </h2>
                        <p className="mt-4 text-primary-100 font-medium leading-relaxed">
                            Système intelligent pour le suivi des approvisionnements et de la distribution médicale.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="bg-emerald-400/20 p-2 rounded-lg">
                            <ShieldCheck size={20} className="text-emerald-400" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">Accès sécurisé v2.0</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-12">
                    <div className="lg:hidden mb-10 text-center">
                        <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20">
                            <Package size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-outfit font-extrabold dark:text-white">GesAppro</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Gestion Médicale</p>
                    </div>

                    <div className="mb-10 hidden lg:block">
                        <h3 className="text-2xl font-outfit font-bold dark:text-white">Bon retour !</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Veuillez vous identifier pour continuer.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400"></div>
                                <span className="font-semibold">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email professionnel</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-[1.25rem] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-medium"
                                    placeholder="nom@ispits.ma"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mot de passe</label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-[1.25rem] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-4 rounded-[1.25rem] shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>Accéder au dashboard</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="pt-8 text-center">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                Nouveau sur la plateforme ?{' '}
                                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center z-10">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] opacity-50">
                    © 2026 • Developed by <a href="https://www.linkedin.com/in/badreddine-ouakili-08a82b290/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 transition-colors">Badreddine Ouakili</a>
                </p>
            </div>
        </div>
    );
}
