import React, { useState } from 'react';
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
  Moon,
  Search,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarLink = ({ to, icon: Icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
        isActive 
          ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold" 
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
      )}
    >
      <div className="flex items-center gap-3 relative z-10">
        <Icon size={20} className={cn(isActive ? "text-primary-500 animate-pulse" : "text-slate-400 dark:text-slate-500 group-hover:text-primary-500")} />
        <span className="tracking-wide">{children}</span>
      </div>
      {isActive && <ChevronRight size={16} className="text-primary-500" />}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full"></div>
      )}
    </Link>
  );
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { to: "/", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/products", icon: Package, label: "Produits" },
    { to: "/categories", icon: Tags, label: "Catégories" },
    { to: "/suppliers", icon: Truck, label: "Fournisseurs" },
  ];

  const operationsItems = [
    { to: "/entries", icon: ArrowDownLeft, label: "Approvisionnements" },
    { to: "/exits", icon: ArrowUpRight, label: "Sorties de stock" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans selection:bg-primary-500/30">
      {/* Background blobs for that "special" look */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary-400/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 m-4 lg:m-0 transform transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:block",
          !isSidebarOpen && "-translate-x-[120%]"
        )}
      >
        <div className="h-[calc(100vh-2rem)] lg:h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-3xl lg:rounded-none flex flex-col shadow-2xl lg:shadow-none">
          {/* Logo Area */}
          <div className="p-8 border-b border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white dark:bg-slate-900 p-2.5 rounded-xl text-primary-600 dark:text-primary-400 shadow-xl flex items-center justify-center">
                  <Package size={28} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                  GesAppro
                </span>
                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                  v2.0 Premium
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <div className="px-4 mb-4 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Menu Principal</div>
            {menuItems.map((item) => (
              <SidebarLink key={item.to} to={item.to} icon={item.icon} onClick={() => setIsSidebarOpen(false)}>
                {item.label}
              </SidebarLink>
            ))}

            <div className="px-4 mt-10 mb-4 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Flux de Stock</div>
            {operationsItems.map((item) => (
              <SidebarLink key={item.to} to={item.to} icon={item.icon} onClick={() => setIsSidebarOpen(false)}>
                {item.label}
              </SidebarLink>
            ))}
          </nav>

          {/* Logout & Profile Summary */}
          <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800/50">
            <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-4 mb-4 flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user.name?.charAt(0).toUpperCase()}
               </div>
               <div className="flex-1 overflow-hidden text-sm">
                  <p className="font-bold truncate dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.role?.name || 'Administrateur'}</p>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-slate-600 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-300 font-bold text-sm"
            >
              <LogOut size={18} />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-12 z-30 sticky top-0 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-500">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
            >
              <Menu size={22} />
            </button>
            <div className="hidden md:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl w-64 lg:w-96 shadow-sm focus-within:ring-2 ring-primary-500/20 transition-all group">
              <Search size={18} className="text-slate-400 group-focus-within:text-primary-500" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-3 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              {darkMode ? <Sun size={20} className="text-orange-400" /> : <Moon size={20} className="text-indigo-400" />}
            </button>

            <button className="p-3 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            
            <Link to="/profile" className="flex items-center gap-3 pl-2 group">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-sm font-bold block dark:text-white leading-tight group-hover:text-primary-500 transition-colors">{user.name}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">En ligne</span>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 p-[2px] shadow-lg group-hover:rotate-6 transition-all">
                 <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                    <span className="text-primary-600 font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                 </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-12 flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
          
          {/* Footer */}
          <footer className="mt-auto pt-12 pb-6 text-center">
             <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em]">
                Developed by <a href="https://www.linkedin.com/in/badreddine-ouakili-08a82b290/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">Badreddine Ouakili</a>             </p>
          </footer>        </main>
      </div>
    </div>
  );
}
