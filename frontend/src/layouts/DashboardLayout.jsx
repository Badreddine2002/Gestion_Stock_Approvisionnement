import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Tags, 
  ArrowDownLeft, 
  ArrowUpRight, 
  LogOut, 
  Menu,
  X,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const { darkMode } = useTheme();
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        isActive 
          ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400 font-bold shadow-sm" 
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
      )}
    >
      <Icon size={20} className={cn(isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-400 dark:text-slate-500")} />
      <span>{children}</span>
    </Link>
  );
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500">
      {/* Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 fixed inset-y-0 left-0 z-50 transition-all duration-300 lg:relative lg:translate-x-0 shadow-xl lg:shadow-none",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="bg-sky-600 p-2 rounded-xl text-white shadow-lg shadow-sky-200 dark:shadow-none group-hover:rotate-12 transition-transform">
              <Package size={24} />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">ISPITS Stock</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          <SidebarLink to="/" icon={LayoutDashboard}>Tableau de bord</SidebarLink>
          <SidebarLink to="/products" icon={Package}>Produits</SidebarLink>
          <SidebarLink to="/categories" icon={Tags}>Catégories</SidebarLink>
          <SidebarLink to="/suppliers" icon={Truck}>Fournisseurs</SidebarLink>
          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Opérations</div>
          <SidebarLink to="/entries" icon={ArrowDownLeft}>Approvisionnements</SidebarLink>
          <SidebarLink to="/exits" icon={ArrowUpRight}>Sorties de stock</SidebarLink>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-md">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 px-4 lg:px-0">
             <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden md:block">
                Système de Gestion de Stock v1.0
             </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle Button */}
            <button 
                onClick={toggleDarkMode}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
                title={darkMode ? "Mode clair" : "Mode sombre"}
            >
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition-all active:scale-95">
               <Bell size={20} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                <p className="text-[11px] font-medium text-sky-600 dark:text-sky-400 uppercase tracking-tighter">{user.role?.name || 'Utilisateur'}</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-sky-200 dark:shadow-none transform hover:scale-105 transition-transform">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
