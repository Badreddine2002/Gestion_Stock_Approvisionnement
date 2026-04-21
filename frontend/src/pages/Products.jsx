import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileDown
} from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    supplier_id: '',
    sku: '',
    quantity: 0,
    min_stock_level: 5,
    expiry_date: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, supRes] = await Promise.all([
        api.get(`/products?page=${page}&search=${search}&category_id=${categoryFilter}`),
        api.get('/categories'),
        api.get('/suppliers')
      ]);
      setProducts(prodRes.data.data);
      setTotalPages(prodRes.data.last_page);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', category_id: '', supplier_id: '', sku: '', quantity: 0, min_stock_level: 5, expiry_date: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      supplier_id: product.supplier_id,
      sku: product.sku,
      quantity: product.quantity,
      min_stock_level: product.min_stock_level,
      expiry_date: product.expiry_date ? product.expiry_date.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await api.delete(`/products/${id}`);
      fetchData();
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await api.get(`/products/export?search=${search}&category_id=${categoryFilter}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'produits.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Produits</h1>
          <p className="text-slate-500 text-sm">Gérez votre inventaire médical</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit shadow-sm"
          >
            <FileDown size={20} />
            Exporter CSV
          </button>
          <button 
            onClick={() => { setEditingProduct(null); setShowModal(true); }}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit shadow-md"
          >
            <Plus size={20} />
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou SKU..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-sky-500"
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Produit</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Catégorie</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Quantité</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Seuil Min</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Expiration</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Chargement...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Aucun produit trouvé</td></tr>
              ) : products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{product.name}</div>
                    <div className="text-xs text-slate-400">SKU: {product.sku}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {product.category?.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${product.quantity <= product.min_stock_level ? 'text-amber-600' : 'text-slate-700'}`}>
                        {product.quantity}
                      </span>
                      {product.quantity <= product.min_stock_level && (
                        <AlertCircle size={14} className="text-amber-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.min_stock_level}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(product)} className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium text-slate-700">Nom du produit</label>
                    <input 
                      type="text" required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Catégorie</label>
                    <select 
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Sélectionner</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">SKU</label>
                    <input 
                      type="text" required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Quantité Initiale</label>
                    <input 
                      type="number" min="0" required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Seuil Minimum</label>
                    <input 
                      type="number" min="0" required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.min_stock_level}
                      onChange={e => setFormData({...formData, min_stock_level: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Date d'expiration</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.expiry_date}
                      onChange={e => setFormData({...formData, expiry_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Fournisseur</label>
                    <select 
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.supplier_id}
                      onChange={e => setFormData({...formData, supplier_id: e.target.value})}
                    >
                      <option value="">Sélectionner</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
               </div>
               <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Enregistrer
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const X = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
