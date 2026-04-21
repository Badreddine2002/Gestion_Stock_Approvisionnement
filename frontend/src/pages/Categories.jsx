import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Search, Edit2, Trash2, Tags, X, FileDown } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) await api.put(`/categories/${editingCategory.id}`, formData);
      else await api.post('/categories', formData);
      setShowModal(false); setEditingCategory(null); setFormData({ name: '', description: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette catégorie ?')) {
      await api.delete(`/categories/${id}`);
      fetchData();
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await api.get('/categories/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'categories.csv');
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
          <h1 className="text-2xl font-bold text-slate-800">Catégories</h1>
          <p className="text-slate-500 text-sm">Gérez les types de produits</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit shadow-sm"
          >
            <FileDown size={20} />
            Exporter CSV
          </button>
          <button onClick={() => { setEditingCategory(null); setFormData({ name: '', description: '' }); setShowModal(true); }} className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-sky-700 transition-colors"><Plus size={20} /> Nouvelle Catégorie</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 text-center text-slate-500 uppercase font-bold tracking-widest text-xs animate-pulse">Chargement...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-10 text-center text-slate-500">Aucune catégorie trouvée</div>
        ) : categories.map(cat => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => handleEdit(cat)} className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"><Trash2 size={16} /></button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                <Tags size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{cat.name}</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">{cat.description || 'Aucune description'}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between bg-sky-50 text-sky-800 font-bold">
              <h3 className="flex items-center gap-2"><Tags size={18}/> {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nom de la catégorie</label>
                <input type="text" required className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-sky-600 text-white py-3 rounded-xl hover:bg-sky-700 font-bold transition-all shadow-lg shadow-sky-600/20 mt-4">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
