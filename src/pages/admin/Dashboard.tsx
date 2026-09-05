import {
    Users,
    MapPin,
    Trash2,
    TrendingUp,
    ShieldCheck,
    Crown,
    CheckCircle2,
    Clock,
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const userDataStr = localStorage.getItem('user_data');
    const user = userDataStr ? JSON.parse(userDataStr) : null;
    const isSuperAdmin = user?.role?.toUpperCase() === 'SUPER_ADMIN';

    const [apiOnline, setApiOnline] = useState<boolean | null>(null);

    useEffect(() => {
        // Test health endpoint
        fetch('/api/health')
            .then(res => res.json())
            .then(() => setApiOnline(true))
            .catch(() => setApiOnline(false));
    }, []);

    const stats = [
        { label: 'Villes Actives', value: '24', icon: MapPin, color: 'bg-blue-500' },
        { label: 'Bénévoles Total', value: '1,250', icon: Users, color: 'bg-emerald-500' },
        { label: 'Déchets Collectés', value: '850 T', icon: Trash2, color: 'bg-orange-500' },
        { label: 'Opérations ce mois', value: '12', icon: TrendingUp, color: 'bg-purple-500' },
    ];

    const displayName = user?.name || user?.fullName || 'Super Administrateur';

    return (
        <div className="space-y-8">
            {/* Top Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
                            <Crown className="w-3.5 h-3.5 text-amber-300" />
                            <span>{isSuperAdmin ? 'Session Super Administrateur' : 'Session Responsable'}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Bienvenue, <span className="text-emerald-300">{displayName}</span> 👋
                        </h1>
                        <p className="text-emerald-100/80 text-sm mt-1">
                            Connecté en tant que <strong className="text-white">{user?.email || 'admin@guineepropre.gn'}</strong>. Vous disposez de tous les droits de gestion sur la plateforme nationale.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right">
                            <span className="text-xs text-emerald-200/70 block">Rôle actif</span>
                            <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5 justify-end">
                                <ShieldCheck className="w-4 h-4" />
                                {isSuperAdmin ? 'SUPER ADMIN' : user?.role || 'GESTIONNAIRE'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                +12% vs N-1
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-gray-900 text-lg">Activités Récentes</h2>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> En temps réel
                        </span>
                    </div>
                    <div className="space-y-5">
                        {[
                            { title: 'Rapport mensuel soumis par', place: 'Kindia', time: 'Il y a 2 heures', dot: 'bg-emerald-500' },
                            { title: 'Nouvelle inscription bénévole à', place: 'Kaloum', time: 'Il y a 4 heures', dot: 'bg-teal-500' },
                            { title: 'Opération de nettoyage planifiée à', place: 'Labé', time: 'Hier à 16:30', dot: 'bg-blue-500' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className={`w-2.5 h-2.5 mt-1.5 rounded-full ${item.dot} flex-shrink-0 shadow-sm`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {item.title} <span className="text-emerald-700 font-semibold">{item.place}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status / Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-6">État du système</h2>
                    <div className="space-y-3.5">
                        <div className={`flex items-center gap-3 p-3.5 rounded-xl text-sm border ${apiOnline === true ? 'bg-emerald-50 text-emerald-800 border-emerald-200/70' : apiOnline === false ? 'bg-red-50 text-red-800 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${apiOnline === true ? 'bg-emerald-500' : apiOnline === false ? 'bg-red-500' : 'bg-amber-500'}`} />
                            <div className="flex-1">
                                <p className="font-semibold text-xs uppercase tracking-wider">Serveur API Express</p>
                                <p className="text-xs opacity-90">{apiOnline === true ? 'En ligne (port 3000)' : apiOnline === false ? 'Hors ligne' : 'Vérification...'}</p>
                            </div>
                            {apiOnline === true && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>

                        <div className="flex items-center gap-3 p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-sm border border-emerald-200/70">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                            <div className="flex-1">
                                <p className="font-semibold text-xs uppercase tracking-wider">Base de données</p>
                                <p className="text-xs opacity-90">PostgreSQL (Prisma ORM)</p>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>

                        <div className="flex items-center gap-3 p-3.5 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-200/70">
                            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                            <div className="flex-1">
                                <p className="font-semibold text-xs uppercase tracking-wider">Accès Privilégié</p>
                                <p className="text-xs opacity-90">Super Administrateur actif</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
