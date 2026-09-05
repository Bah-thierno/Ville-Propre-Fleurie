import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Lock, Mail, Shield, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleFillDemoAdmin = () => {
        setFormData({
            email: 'admin@guineepropre.gn',
            password: 'SuperAdmin2026!'
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // First attempt with standard /api/auth/login, then fallback to /api/login
            let response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.status === 404) {
                response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            const data = await response.json().catch(() => ({}));

            if (response.ok && data.token) {
                localStorage.setItem('auth_token', data.token);
                if (data.refreshToken) {
                    localStorage.setItem('refresh_token', data.refreshToken);
                }
                localStorage.setItem('user_data', JSON.stringify(data.user));
                window.location.href = '/admin/dashboard';
            } else {
                const validationMsg = data.errors && Array.isArray(data.errors) && data.errors[0]?.msg;
                setError(validationMsg || data.message || 'Identifiants incorrects ou non autorisés.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Impossible de joindre le serveur API backend. Vérifiez que le service est démarré.');
        } finally {
            setLoading(false);
        }
    };

    // 3D Tilt Effect Setup (Optimized for smoothness)
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${mouseYSpring}deg) rotateY(${mouseXSpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 5);
        y.set(yPct * -5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden font-sans">

            {/* RICH ANIMATED BACKGROUND */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950" />
                <motion.div
                    className="absolute top-0 left-0 w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen"
                    animate={{ x: [-100, 100, -100], y: [-100, 50, -100], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[100px] mix-blend-screen"
                    animate={{ x: [100, -50, 100], y: [100, -100, 100], scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* MAIN CARD CONTAINER */}
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ transformStyle: "preserve-3d", transform }}
                className="relative w-full max-w-4xl perspective-1000"
            >
                <div className="relative bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-black/50 border border-white/40 overflow-hidden flex flex-col md:flex-row">

                    {/* LEFT SIDE */}
                    <div className="relative md:w-5/12 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-10 flex flex-col justify-between overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                        <motion.div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity }} />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mb-8">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-50 text-xs font-bold tracking-wider uppercase">Espace Administrateur</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white leading-tight mb-4">Guinée Propre & <span className="text-emerald-400">Fleurie</span></h2>
                            <p className="text-emerald-100/80 text-sm leading-relaxed">Portail d'administration centrale. Connectez-vous avec vos privilèges pour superviser les villes et les bénévoles.</p>
                        </div>

                        <div className="relative z-10 hidden md:flex items-center justify-center mt-8">
                            <div className="relative w-32 h-32 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl shadow-2xl shadow-emerald-900/50 flex items-center justify-center transform rotate-6 border border-white/20">
                                <Lock className="w-16 h-16 text-white" />
                                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-sm transform -rotate-6" />
                            </div>
                        </div>

                        <div className="relative z-10 mt-6 text-xs text-emerald-200/60 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Authentification chiffrée & sessions sécurisées</span>
                        </div>
                    </div>

                    {/* RIGHT SIDE: FORM */}
                    <div className="relative md:w-7/12 p-8 lg:p-10 bg-white">
                        <div className="max-w-sm mx-auto">
                            <div className="text-left mb-6">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-slate-800">Connexion</h1>
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/60">
                                        Super Admin
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mt-1.5">Saisissez vos identifiants administrateur.</p>
                            </div>

                            {error && (
                                <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200/80 flex items-start gap-2.5">
                                    <Shield className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                                    <div className="relative group">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="admin@guineepropre.gn"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-sm font-bold text-slate-700">Mot de passe</label>
                                    </div>
                                    <div className="relative group">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button disabled={loading} className="w-full h-12 text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 mt-2">
                                    {loading ? 'Connexion en cours...' : (
                                        <span className="flex items-center justify-center gap-2">Se connecter <ArrowRight className="w-5 h-5" /></span>
                                    )}
                                </Button>
                            </form>

                            {/* Demo helper */}
                            <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Test Super Admin :</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleFillDemoAdmin}
                                        className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline transition-colors"
                                    >
                                        Remplir automatiquement
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 text-center border-t border-slate-100 pt-4">
                                <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors">← Retour à l'accueil</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
