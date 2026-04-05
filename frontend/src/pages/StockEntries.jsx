import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, X, ArrowDownLeft } from 'lucide-react';

export default function StockEntries() {
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ product_id: '', supplier_id: '', quantity: '', entry_date: new Date().toISOString().split('T')[0], notes: '' });

  const fetchData = async () => {
    const [entRes, prodRes, supRes] = await Promise.all([
      api.get('/stock-entries'),
      api.get('/products?per_page=100'),
      api.get('/suppliers')
    ]);
    setEntries(entRes.data.data);
    setProducts(prodRes.data.data);
    setSuppliers(supRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stock-entries', formData);
      setShowModal(false); setFormData({ product_id: '', supplier_id: '', quantity: '', entry_date: new Date().toISOString().split('T')[0], notes: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Approvisionnements</h1>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={20} /> Nouvelle Entrée</button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Produit</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fournisseur</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Quantité</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map(e => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-800">{e.product?.name}</td>
                <td className="px-6 py-4 text-slate-600">{e.supplier?.name}</td>
                <td className="px-6 py-4 font-semibold text-emerald-600">+{e.quantity}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(e.entry_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between bg-emerald-50 text-emerald-800">
              <h3 className="font-bold flex items-center gap-2"><ArrowDownLeft size={18}/> Enregistrer une entrée</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <select required className="w-full p-2 border rounded" value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})}>
                <option value="">Sélectionner Produit</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Actuel: {p.quantity})</option>)}
              </select>
              <select required className="w-full p-2 border rounded" value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})}>
                <option value="">Sélectionner Fournisseur</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="number" placeholder="Quantité" required className="w-full p-2 border rounded" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <input type="date" required className="w-full p-2 border rounded" value={formData.entry_date} onChange={e => setFormData({...formData, entry_date: e.target.value})} />
              <textarea placeholder="Notes" className="w-full p-2 border rounded" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded">Confirmer l'entrée</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
