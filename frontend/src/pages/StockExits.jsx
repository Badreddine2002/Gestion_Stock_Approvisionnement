import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, X, ArrowUpRight } from 'lucide-react';

export default function StockExits() {
  const [exits, setExits] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ product_id: '', quantity: '', exit_date: new Date().toISOString().split('T')[0], reason: '' });

  const fetchData = async () => {
    const [extRes, prodRes] = await Promise.all([
      api.get('/stock-exits'),
      api.get('/products?per_page=100')
    ]);
    setExits(extRes.data.data);
    setProducts(prodRes.data.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stock-exits', formData);
      setShowModal(false); setFormData({ product_id: '', quantity: '', exit_date: new Date().toISOString().split('T')[0], reason: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Erreur (Stock insuffisant?)'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Sorties de Stock</h1>
        <button onClick={() => setShowModal(true)} className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={20} /> Nouvelle Sortie</button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Produit</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Quantité</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Motif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {exits.map(e => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-800">{e.product?.name}</td>
                <td className="px-6 py-4 font-semibold text-rose-600">-{e.quantity}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(e.exit_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-slate-600">{e.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between bg-rose-50 text-rose-800">
              <h3 className="font-bold flex items-center gap-2"><ArrowUpRight size={18}/> Enregistrer une sortie</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <select required className="w-full p-2 border rounded" value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})}>
                <option value="">Sélectionner Produit</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Actuel: {p.quantity})</option>)}
              </select>
              <input type="number" placeholder="Quantité" required className="w-full p-2 border rounded" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <input type="date" required className="w-full p-2 border rounded" value={formData.exit_date} onChange={e => setFormData({...formData, exit_date: e.target.value})} />
              <input type="text" placeholder="Motif de sortie" className="w-full p-2 border rounded" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
              <button type="submit" className="w-full bg-rose-600 text-white py-2 rounded">Confirmer la sortie</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
