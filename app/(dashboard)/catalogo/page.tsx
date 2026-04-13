'use client';

import { useState } from 'react';
import { Sparkles, PlusCircle, X, ShoppingBag, Menu as MenuIcon, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { MOCK_PRODUCTS } from '@/src/data/mockData';
import { Product } from '@/src/types';

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(['Café', 'Panadería', 'Bowls', 'Restaurante']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{name: string, newName: string} | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&h=200&auto=format&fit=crop',
    stock: 'in-stock'
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: categories[0] || '',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&h=200&auto=format&fit=crop',
        stock: 'in-stock'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p));
    } else {
      const newProduct: Product = {
        ...formData,
        id: `p${Date.now()}`,
      } as Product;
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string | number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleRenameCategory = (oldName: string, newName: string) => {
    if (!newName || oldName === newName) return;
    setCategories(categories.map(c => c === oldName ? newName : c));
    setProducts(products.map(p => p.category === oldName ? { ...p, category: newName } : p));
    if (selectedCategory === oldName) setSelectedCategory(newName);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catName: string) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${catName}"? Los productos se moverán a "General".`)) {
      setCategories(categories.filter(c => c !== catName));
      setProducts(products.map(p => p.category === catName ? { ...p, category: 'General' } : p));
      if (selectedCategory === catName) setSelectedCategory('Todos');
      if (!categories.includes('General')) setCategories(prev => [...prev, 'General']);
    }
  };

  return (
    <div className="space-y-8 relative pb-20">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-3">
          <ShoppingBag size={32} className="text-teal-600" />
          Mi Catálogo de Productos
        </h1>
        <p className="text-slate-500 font-medium mt-2">Gestiona el inventario y las categorías que tu agente recomendará.</p>
      </header>

      {/* Products/Menu Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.5rem] bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
              <Sparkles size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">Menú Digital</h3>
              <p className="text-sm text-slate-400 font-medium">Configuración de artículos y disponibilidad.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsManageModalOpen(true)}
              className="p-3 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl hover:border-slate-200 hover:text-slate-600 transition-all shadow-sm"
              title="Gestionar Categorías"
            >
              <Settings2 size={18} />
            </button>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#00897B] text-[#00897B] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00897B] hover:text-white transition-all shadow-sm"
            >
              <PlusCircle size={14} />
              Nueva Categoría
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-slate-900 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
            >
              <PlusCircle size={14} />
              Añadir Producto
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
              selectedCategory === 'Todos'
                ? "bg-[#00897B] border-[#00897B] text-white shadow-md shadow-[#00897B]/20"
                : "bg-white border-slate-100 text-slate-400 hover:bg-[#00897B] hover:border-[#00897B] hover:text-white"
            )}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                selectedCategory === cat
                  ? "bg-[#00897B] border-[#00897B] text-white shadow-md shadow-[#00897B]/20"
                  : "bg-white border-slate-100 text-slate-400 hover:bg-[#00897B] hover:border-[#00897B] hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {products
              .filter(p => selectedCategory === 'Todos' || p.category === selectedCategory)
              .map((product) => (
              <motion.div 
                layout
                key={product.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-800 shadow-sm">
                    ${product.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2 text-slate-600">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-white px-2 py-0.5 rounded-lg border border-slate-100">{product.category}</span>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      product.stock === 'in-stock' ? "bg-green-500" : "bg-orange-500"
                    )} />
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-[#25D366] transition-colors">{product.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-medium">{product.description}</p>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                      Eliminar
                    </button>
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                    >
                      Editar Detalle
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-black text-slate-800">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Producto</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio (COP)</label>
                      <input 
                        required
                        type="number" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                      <select 
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#00897B]/20 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Seleccionar...</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción</label>
                    <textarea 
                      required
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium resize-none leading-relaxed" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">URL de la Imagen</label>
                    <input 
                      type="url" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-[10px] text-slate-400 italic" 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 px-6 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3.5 px-6 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1EBE5C] shadow-lg shadow-[#25D366]/20 transition-all"
                  >
                    {editingProduct ? 'Guardar' : 'Añadir'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8"
            >
              <h3 className="text-xl font-black text-slate-800 mb-6">Nueva Categoría</h3>
              <div className="space-y-4">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Ej. Bebidas, Postres..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-sm font-medium focus:ring-2 focus:ring-[#00897B]/20"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    disabled={!newCatName}
                    onClick={() => {
                      if (newCatName && !categories.includes(newCatName)) {
                        setCategories([...categories, newCatName]);
                        setNewCatName('');
                        setIsCategoryModalOpen(false);
                      }
                    }}
                    className="flex-1 py-3 bg-[#00897B] text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-[#00897B]/20 hover:bg-[#007065] disabled:opacity-50 transition-all"
                  >
                    Crear
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Categories Modal */}
      <AnimatePresence>
        {isManageModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManageModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Gestionar Categorías</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Editar o eliminar etiquetas</p>
                </div>
                <button onClick={() => setIsManageModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 shadow-sm transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-3">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:bg-white hover:border-[#00897B]/30 transition-all">
                    {editingCategory?.name === cat ? (
                      <div className="flex-1 flex gap-2">
                        <input 
                          autoFocus
                          type="text"
                          value={editingCategory.newName}
                          onChange={(e) => setEditingCategory({...editingCategory, newName: e.target.value})}
                          className="flex-1 bg-white border-2 border-[#00897B] rounded-xl px-3 py-1 text-sm font-bold"
                        />
                        <button 
                          onClick={() => handleRenameCategory(cat, editingCategory.newName)}
                          className="px-3 bg-[#00897B] text-white rounded-xl text-[9px] font-black uppercase"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 font-bold text-slate-700">{cat}</span>
                        <button 
                          onClick={() => setEditingCategory({name: cat, newName: cat})}
                          className="p-2 text-slate-300 hover:text-[#00897B] hover:bg-[#00897B]/5 rounded-lg transition-all"
                        >
                          <Settings2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
