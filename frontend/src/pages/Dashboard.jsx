import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Package, 
  AlertTriangle, 
  Calendar, 
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Truck
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
import { Line, Bar } from 'react-chartjs-2';

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

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {trend && (
        <p className={`text-xs mt-2 ${trend > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
          {trend > 0 ? `+${trend}%` : trend} vs dernier mois
        </p>
      )}
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full">Chargement...</div>;

  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Entrées',
        data: Array(12).fill(0).map((_, i) => stats?.charts?.entries.find(e => e.month === i + 1)?.total || 0),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Sorties',
        data: Array(12).fill(0).map((_, i) => stats?.charts?.exits.find(e => e.month === i + 1)?.total || 0),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Bonjour, ISPITS Admin</h1>
        <p className="text-slate-500">Voici l'état actuel de votre stock médical.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Produits" 
          value={stats?.counts.total_products} 
          icon={Package} 
          color="bg-sky-500"
        />
        <StatCard 
          title="Stock Faible" 
          value={stats?.counts.low_stock} 
          icon={AlertTriangle} 
          color="bg-amber-500"
        />
        <StatCard 
          title="Produits Expirés" 
          value={stats?.counts.expired} 
          icon={Calendar} 
          color="bg-rose-500"
        />
        <StatCard 
          title="Près d'Expiration" 
          value={stats?.counts.near_expiry} 
          icon={TrendingUp} 
          color="bg-indigo-500"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Activité de Stock (2026)</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-sky-500 rounded-full"></span> Entrées</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-500 rounded-full"></span> Sorties</div>
            </div>
          </div>
          <div className="h-80">
            <Line 
              data={chartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Mouvements Récents</h3>
          <div className="space-y-6">
            {stats?.recent_entries.map((entry, i) => (
              <div key={`entry-${i}`} className="flex items-center gap-4">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                  <ArrowDownLeft size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{entry.product.name}</p>
                  <p className="text-xs text-slate-500">Entrée: +{entry.quantity} unités</p>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(entry.entry_date).toLocaleDateString()}
                </div>
              </div>
            ))}
            {stats?.recent_exits.map((exit, i) => (
              <div key={`exit-${i}`} className="flex items-center gap-4">
                <div className="bg-rose-100 text-rose-600 p-2 rounded-lg">
                  <ArrowUpRight size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{exit.product.name}</p>
                  <p className="text-xs text-slate-500">Sortie: -{exit.quantity} unités</p>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(exit.exit_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
