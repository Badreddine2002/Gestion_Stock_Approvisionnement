import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, X, ArrowDownLeft, Filter, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';

export default function StockEntries() {
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ product_id: '', supplier_id: '', quantity: '', entry_date: new Date().toISOString().split('T')[0], notes: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [entRes, prodRes, supRes, catRes] = await Promise.all([
        api.get(`/stock-entries?page=${page}&category_id=${categoryFilter}`),
        api.get('/products?per_page=100'),
        api.get('/suppliers'),
        api.get('/categories')
      ]);
      setEntries(entRes.data.data);
      setTotalPages(entRes.data.last_page);
      setProducts(prodRes.data.data);
      setSuppliers(supRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stock-entries', formData);
      setShowModal(false); setFormData({ product_id: '', supplier_id: '', quantity: '', entry_date: new Date().toISOString().split('T')[0], notes: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
  };

  const downloadCSV = async () => {
    try {
      const response = await api.get(`/stock-entries/export?category_id=${categoryFilter}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'approvisionnements.csv');
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
        <h1 className="text-2xl font-bold text-slate-800">Approvisionnements</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit shadow-sm"
          >
            <FileDown size={20} />
            Exporter CSV
          </button>
          <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-emerald-700 shadow-md"><Plus size={20} /> Nouvelle Entrée</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Produit</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Catégorie</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fournisseur</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Quantité</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Chargement...</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Aucune entrée trouvée</td></tr>
              ) : entries.map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-800 font-medium">{e.product?.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{e.product?.category?.name || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{e.supplier?.name}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">+{e.quantity}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(e.entry_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} sur {totalPages}</p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
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
