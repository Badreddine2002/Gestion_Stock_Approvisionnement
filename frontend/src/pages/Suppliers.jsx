import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact_person: '', phone: '', email: '', address: '' });

  const fetchData = () => api.get('/suppliers').then(res => setSuppliers(res.data));
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/suppliers/${editing.id}`, formData);
    else await api.post('/suppliers', formData);
    setShowModal(false); setEditing(null); setFormData({ name: '', contact_person: '', phone: '', email: '', address: '' });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Fournisseurs</h1>
        <button onClick={() => setShowModal(true)} className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={20} /> Nouveau</button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nom</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Téléphone</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{s.name}</td>
                <td className="px-6 py-4 text-slate-600">{s.contact_person}</td>
                <td className="px-6 py-4 text-slate-600">{s.phone}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => { setEditing(s); setFormData(s); setShowModal(true); }} className="text-sky-600 p-1"><Edit2 size={16} /></button>
                  <button onClick={async () => { if(confirm('Supprimer?')) { await api.delete(`/suppliers/${s.id}`); fetchData(); } }} className="text-rose-600 p-1"><Trash2 size={16} /></button>
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
              <h3 className="font-bold">{editing ? 'Modifier' : 'Ajouter'} Fournisseur</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <input type="text" placeholder="Nom" required className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="Contact" className="w-full p-2 border rounded" value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} />
              <input type="text" placeholder="Téléphone" className="w-full p-2 border rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <textarea placeholder="Adresse" className="w-full p-2 border rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
