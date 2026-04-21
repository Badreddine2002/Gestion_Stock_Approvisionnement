import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Package, 
  AlertTriangle, 
  Calendar, 
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Boxes,
  Clock,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, icon: Icon, gradient, delay, to }) => (
  <div className={`glass-card p-6 rounded-3xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-700 ${delay}`}>
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-transform group-hover:scale-150 duration-700 ${gradient}`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{title}</p>
        <h3 className="text-3xl font-outfit font-black text-slate-900 dark:text-white leading-none tracking-tight">{value || 0}</h3>
      </div>
      <div className={`p-3 rounded-2xl shadow-lg shadow-current/10 ${gradient} text-white transform group-hover:rotate-12 transition-transform duration-500`}>
        <Icon size={24} />
      </div>
    </div>
    <Link to={to} className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary-500 transition-colors cursor-pointer">
       <span>Voir les détails</span>
       <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/dashboard?category_id=${categoryFilter}`),
      api.get('/categories')
    ])
      .then(([statsRes, catRes]) => {
        setStats(statsRes.data);
        setCategories(catRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Initialisation des données...</p>
      </div>
    );
  }

  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Entrées',
        data: Array(12).fill(0).map((_, i) => stats?.charts?.entries.find(e => e.month === i + 1)?.total || 0),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.05)',
        fill: true,
        tension: 0.5,
        borderWidth: 4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#0ea5e9',
      },
      {
        label: 'Sorties',
        data: Array(12).fill(0).map((_, i) => stats?.charts?.exits.find(e => e.month === i + 1)?.total || 0),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        fill: true,
        tension: 0.5,
        borderWidth: 4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#f43f5e',
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        titleColor: darkMode ? '#ffffff' : '#0f172a',
        bodyColor: darkMode ? '#94a3b8' : '#64748b',
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 6,
        usePointStyle: true,
        borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', drawBorder: false },
        ticks: { color: '#94a3b8', font: { weight: '600' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { weight: '600' } }
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-black text-primary-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <Activity size={16} /> Dashboard Overview
          </h2>
          <h1 className="text-4xl font-outfit font-black text-slate-900 dark:text-white">
            Ravi de vous revoir, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">{user.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            Voici les dernières statistiques de votre inventaire médical pour aujourd'hui.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
           <div className="glass-morphism px-4 py-2 rounded-2xl flex items-center gap-3">
              <Filter className="text-primary-500" size={18} />
              <select 
                className="bg-transparent border-none text-sm font-bold dark:text-white outline-none focus:ring-0 cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="" className="dark:bg-slate-900">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="dark:bg-slate-900">{cat.name}</option>
                ))}
              </select>
           </div>
           <div className="glass-morphism px-6 py-3 rounded-2xl flex items-center gap-3">
              <Calendar className="text-primary-500" size={20} />
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date actuelle</span>
                 <span className="text-sm font-bold dark:text-white">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Produits" 
          value={stats?.counts.total_products} 
          icon={Boxes} 
          gradient="bg-gradient-to-br from-blue-500 to-primary-600"
          delay="delay-0"
          to="/products"
        />
        <StatCard 
          title="Stock Critique" 
          value={stats?.counts.low_stock} 
          icon={AlertTriangle} 
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          delay="delay-100"
          to="/products"
        />
        <StatCard 
          title="Produits Expirés" 
          value={stats?.counts.expired} 
          icon={Calendar} 
          gradient="bg-gradient-to-br from-rose-500 to-red-600"
          delay="delay-200"
          to="/products"
        />
        <StatCard 
          title="Renouvellement" 
          value={stats?.counts.near_expiry} 
          icon={TrendingUp} 
          gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
          delay="delay-300"
          to="/products"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="xl:col-span-2 glass-card p-8 rounded-[2.5rem] flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-white">Flux de Stock</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Comparaison mensuelle des entrées et sorties</p>
            </div>
            <div className="flex items-center gap-6 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer group">
                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter group-hover:text-primary-500">Entrées</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer group">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter group-hover:text-rose-500">Sorties</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Mouvements */}
        <div className="glass-card p-8 rounded-[2.5rem] flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl">
                   <Clock size={20} />
                </div>
                <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-white">Activités</h3>
             </div>
             <button className="text-primary-500 font-bold text-xs uppercase tracking-widest hover:underline">Tout voir</button>
          </div>
          
          <div className="space-y-5 overflow-y-auto pr-2 max-h-[420px] custom-scrollbar">
            {stats?.recent_entries.map((entry, i) => (
              <div key={`entry-${i}`} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 cursor-pointer">
                <div className="h-12 w-12 shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowDownLeft size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{entry.product.name}</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter mt-0.5">+{entry.quantity} Stock ajouté</p>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  {new Date(entry.entry_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            ))}
            {stats?.recent_exits.map((exit, i) => (
              <div key={`exit-${i}`} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 cursor-pointer">
                <div className="h-12 w-12 shrink-0 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowUpRight size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{exit.product.name}</p>
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-tighter mt-0.5">-{exit.quantity} Distribué</p>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  {new Date(exit.exit_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            ))}
            
            {(stats?.recent_entries.length === 0 && stats?.recent_exits.length === 0) && (
               <div className="text-center py-10">
                  <Package className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={40} />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Aucune activité récente</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
