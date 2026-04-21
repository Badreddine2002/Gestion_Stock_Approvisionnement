import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Search, Edit2, Trash2, Mail, Phone, MapPin, Filter, FileDown, X } from 'lucide-react';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact_person: '', phone: '', email: '', address: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [supRes, catRes] = await Promise.all([
        api.get(`/suppliers?category_id=${categoryFilter}`),
        api.get('/categories')
      ]);
      setSuppliers(supRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) await api.put(`/suppliers/${editingSupplier.id}`, formData);
      else await api.post('/suppliers', formData);
      setShowModal(false); setEditingSupplier(null); setFormData({ name: '', contact_person: '', phone: '', email: '', address: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
  };

  const handleEdit = (s) => {
    setEditingSupplier(s);
    setFormData({ name: s.name, contact_person: s.contact_person || '', phone: s.phone || '', email: s.email || '', address: s.address || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce fournisseur ?')) {
      await api.delete(`/suppliers/${id}`);
      fetchData();
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await api.get(`/suppliers/export?category_id=${categoryFilter}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fournisseurs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fournisseurs</h1>
          <p className="text-slate-500 text-sm">Gérez vos partenaires d'approvisionnement</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit shadow-sm"
          >
            <FileDown size={20} />
            Exporter CSV
          </button>
          <button onClick={() => { setEditingSupplier(null); setFormData({ name: '', contact_person: '', phone: '', email: '', address: '' }); setShowModal(true); }} className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-sky-700 transition-colors"><Plus size={20} /> Nouveau Fournisseur</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-sky-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Toutes les catégories de produits</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 text-center text-slate-500">Chargement...</div>
        ) : suppliers.length === 0 ? (
          <div className="col-span-full py-10 text-center text-slate-500">Aucun fournisseur trouvé</div>
        ) : suppliers.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{s.name}</h3>
                <p className="text-sky-600 text-sm font-medium">{s.contact_person}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(s)} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600 border-t pt-4">
              <div className="flex items-center gap-2"><Mail size={16} className="text-slate-400"/> {s.email || 'N/A'}</div>
              <div className="flex items-center gap-2"><Phone size={16} className="text-slate-400"/> {s.phone || 'N/A'}</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> {s.address || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between bg-sky-50 text-sky-800 font-bold">
              <h3 className="flex items-center gap-2">
                <Truck size={18} />
                {editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
              </h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nom</label>
                <input type="text" required className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Contact</label>
                <input type="text" className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500" value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input type="email" className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Téléphone</label>
                <input type="text" className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Adresse</label>
                <textarea className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-sky-600 text-white py-2.5 rounded-lg hover:bg-sky-700 font-bold transition-colors">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const Truck = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10a1 1 0 0 0 1 1h1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
);
