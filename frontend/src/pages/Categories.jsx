import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchData = () => api.get('/categories').then(res => setCategories(res.data));
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/categories/${editing.id}`, formData);
      else await api.post('/categories', formData);
      
      setShowModal(false); 
      setEditing(null); 
      setFormData({ name: '', description: '' });
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert(err.response?.data?.message || 'Une erreur est survenue.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Catégories</h1>
        <button onClick={() => setShowModal(true)} className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={20} /> Nouveau</button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nom</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Produits</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{c.name}</td>
                <td className="px-6 py-4 text-slate-600">{c.products_count}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => { setEditing(c); setFormData(c); setShowModal(true); }} className="text-sky-600 p-1"><Edit2 size={16} /></button>
                  <button onClick={async () => { if(confirm('Supprimer?')) { await api.delete(`/categories/${c.id}`); fetchData(); } }} className="text-rose-600 p-1"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between">
              <h3 className="font-bold">{editing ? 'Modifier' : 'Ajouter'} Catégorie</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <input type="text" placeholder="Nom" required className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="Description" className="w-full p-2 border rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
