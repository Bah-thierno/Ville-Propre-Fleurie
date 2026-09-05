import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MapPin,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    FolderOpen,
    FileText,
    ShieldCheck,
    Crown
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    // Auth Check
    const token = localStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data');
    const user = userDataStr ? JSON.parse(userDataStr) : null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const isSuperAdmin = user?.role?.toUpperCase() === 'SUPER_ADMIN';

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                });
            } catch (err) {
                // Ignore logout network error on client
            }
        }
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin/dashboard' },
        { icon: MapPin, label: 'Villes & Stats', path: '/admin/cities' },
        { icon: Users, label: 'Bénévoles', path: '/admin/volunteers' },
        { icon: FolderOpen, label: 'Projets', path: '/admin/projects' },
        { icon: FileText, label: 'Opérations', path: '/admin/operations' },
        { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
        { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
    ];

    const displayName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Administrateur');
    const initial = displayName?.[0]?.toUpperCase() || 'A';

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-800">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                VPF Guinée
                            </span>
                        </Link>
                        <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Info with Super Admin distinction */}
                    <div className="p-5 border-b border-slate-800 bg-slate-800/40">
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${isSuperAdmin ? 'bg-gradient-to-tr from-amber-600 to-emerald-600 ring-2 ring-amber-400/40' : 'bg-emerald-600'}`}>
                                {isSuperAdmin ? <Crown className="w-5 h-5 text-amber-200" /> : initial}
                            </div>
                            <div className="overflow-hidden flex-1">
                                <p className="font-semibold text-sm text-white truncate">{displayName}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                        <ShieldCheck className="w-3 h-3" />
                                        {isSuperAdmin ? 'Super Admin' : 'Responsable'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${isActive
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
                                >
                                    <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4.5 h-4.5" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="ml-3 font-bold text-gray-900">Administration VPF</span>
                    </div>
                    {isSuperAdmin && (
                        <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-full">
                            Super Admin
                        </span>
                    )}
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
