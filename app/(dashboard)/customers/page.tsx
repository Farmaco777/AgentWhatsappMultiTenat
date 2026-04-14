'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Star,
  TrendingUp,
  UserPlus,
  RefreshCw,
  ChevronRight,
  Coffee,
  AlertCircle,
  History,
  MessageCircle,
  Edit3,
  ChevronDown,
  ArrowRight,
  Users,
  ChevronLeft,
  Upload,
  X,
  Save,
  MapPin,
  Cake
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '@/src/data/mockData';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'TODOS' | 'VIP' | 'FRECUENTE' | 'NUEVO'>('TODOS');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isViewAll, setIsViewAll] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    birthDay: '',
    birthMonth: '',
    address: ''
  });

  const handleExport = () => {
    const headers = ["ID", "Nombre", "Telefono", "Direccion", "Gasto Total", "Nivel", "Ultima Visita", "Frecuencia"];
    const rows = MOCK_CUSTOMERS.map(c => [
      c.id,
      c.name,
      `"${c.phone}"`,
      `"${c.address || ''}"`,
      c.totalSpent,
      c.tags.join(' '),
      c.lastVisit,
      c.frequency
    ]);

    // Usamos ";" como separador y el prefijo "sep=;" para que Excel lo abra en columnas automáticamente
    // También incluimos el BOM para caracteres especiales (acentos)
    const csvContent = "sep=;\n" + headers.join(";") + "\n" + rows.map(row => row.join(";")).join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `directorio_clientes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .xlsx';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        alert(`Archivo "${file.name}" cargado exitosamente. Los datos están siendo procesados.`);
      }
    };
    input.click();
  };

  const filteredCustomers = MOCK_CUSTOMERS.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    
    const matchesFilter = 
      filterLevel === 'TODOS' || 
      customer.tags.some(tag => tag.toUpperCase() === filterLevel);

    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Miembros Totales', value: '1.248', change: '+12% este mes', icon: UserPlus, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Ingresos Totales', value: '$24.5M', change: 'Efectividad IA', icon: TrendingUp, color: 'text-[#25D366]', bg: 'bg-green-50' },
    { label: 'Nuevos esta semana', value: '32', change: 'Crecimiento orgánico', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Retención', value: '68%', change: 'Ciclo activo IA', icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (isViewAll) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => setIsViewAll(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-black uppercase tracking-widest mb-2"
            >
              <ChevronLeft size={14} />
              Volver a Clientes
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">Directorio de Clientes</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleImport}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <Upload size={14} className="text-slate-400" />
              IMPORTAR
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-blue-100 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 transition-all shadow-sm"
            >
              <Download size={14} className="text-blue-400" />
              EXPORTAR
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-5">Nombre</th>
                  <th className="px-6 py-5">WhatsApp</th>
                  <th className="px-6 py-5">Dirección</th>
                  <th className="px-6 py-5">Nivel</th>
                  <th className="px-6 py-5">Última Visita</th>
                  <th className="px-6 py-5 shrink-0">Gasto Total</th>
                  <th className="px-6 py-5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_CUSTOMERS.map(customer => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[12px] text-slate-700 whitespace-nowrap">{customer.name}</p>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-400 whitespace-nowrap">{customer.phone}</td>
                    <td className="px-6 py-4 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                      {customer.address?.split(',')[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                        customer.tags[0].toUpperCase() === 'VIP' ? "bg-[#25D366]/10 text-[#25D366]" :
                        customer.tags[0].toUpperCase() === 'FRECUENTE' ? "bg-teal-50 text-teal-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {customer.tags[0]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-400 whitespace-nowrap">{customer.lastVisit}</td>
                    <td className="px-6 py-4 text-[11px] text-slate-700 font-black whitespace-nowrap">${customer.totalSpent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/customers/${customer.id}`}
                        className="p-1 px-2 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all inline-block"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total de registros: {MOCK_CUSTOMERS.length} clientes encontrados
            </p>
            <div className="flex gap-2">
              <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest transition-all">
                Anterior
              </button>
              <button className="px-6 py-2.5 bg-white border-2 border-[#25D366] rounded-xl text-[10px] font-black text-[#25D366] uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all shadow-sm shadow-[#25D366]/10">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Clientes</h1>
          <p className="text-slate-500 font-medium">Gestiona tu base de clientes y visualiza insights personalizados.</p>
        </div>
        <button 
          onClick={() => setIsNewCustomerModalOpen(true)}
          className="flex items-center gap-2 px-8 py-3 bg-[#4ade80] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#22c55e] transition-all shadow-lg shadow-green-100 border-none"
        >
          <UserPlus size={16} />
          NUEVO CLIENTE
        </button>
      </header>

      {/* New Customer Modal */}
      <AnimatePresence>
        {isNewCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewCustomerModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative z-10 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <div className="p-3 bg-green-50 text-[#25D366] rounded-2xl">
                    <UserPlus size={24} />
                  </div>
                  Nuevo Cliente
                </h3>
                <button 
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. Juan Perez"
                    value={newCustomerData.name}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[#25D366]/20 transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center bg-slate-50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#25D366]/20 transition-all">
                    <div className="px-5 py-4 bg-slate-100/50 border-r border-slate-100 text-slate-400 font-black text-sm">
                      +57
                    </div>
                    <input 
                      type="text" 
                      placeholder="300 123 4567"
                      value={newCustomerData.phone}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                      className="w-full bg-transparent border-none px-6 py-4 text-slate-700 font-bold focus:ring-0 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Cake size={12} /> Cumpleaños (Opcional)
                    </label>
                    <div className="flex gap-2">
                      <select 
                        value={newCustomerData.birthDay}
                        onChange={(e) => setNewCustomerData({ ...newCustomerData, birthDay: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[#25D366]/20 outline-none appearance-none"
                      >
                        <option value="">Día</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <select 
                        value={newCustomerData.birthMonth}
                        onChange={(e) => setNewCustomerData({ ...newCustomerData, birthMonth: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[#25D366]/20 outline-none appearance-none"
                      >
                        <option value="">Mes</option>
                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m, i) => (
                          <option key={m} value={i + 1}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <MapPin size={12} /> Dirección (Opcional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Calle 10 #5-20"
                      value={newCustomerData.address}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[#25D366]/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  disabled={!newCustomerData.name || !newCustomerData.phone}
                  onClick={() => {
                    alert('¡Cliente registrado exitosamente!');
                    setIsNewCustomerModalOpen(false);
                    setNewCustomerData({ name: '', phone: '', birthDay: '', birthMonth: '', address: '' });
                  }}
                  className="flex-1 py-4 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1EBE5C] transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                >
                  <Save size={18} />
                  Registrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            <div className={cn("mt-2 flex items-center gap-1 text-[10px] font-bold", stat.color)}>
              <stat.icon size={10} />
              <span>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Customer List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
            <div className="px-8 pt-8 pb-4 space-y-4">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Directorio de Clientes</h3>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[13px] focus:ring-4 focus:ring-teal-500/5 transition-all text-slate-600 placeholder:text-slate-400 shadow-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 lg:flex items-center gap-2 relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-3 md:px-5 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm group",
                      filterLevel !== 'TODOS' 
                        ? "bg-teal-50 border-teal-200 text-teal-700" 
                        : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <Filter size={14} className={cn("transition-colors", filterLevel !== 'TODOS' ? "text-teal-600" : "text-slate-400")} />
                    <span className="truncate">{filterLevel === 'TODOS' ? 'FILTRAR' : `${filterLevel}`}</span>
                    <ChevronDown size={14} className={cn("transition-transform duration-200", isFilterOpen ? "rotate-180" : "")} />
                  </button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 py-2"
                      >
                        {(['TODOS', 'VIP', 'FRECUENTE', 'NUEVO'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => {
                              setFilterLevel(level);
                              setIsFilterOpen(false);
                            }}
                            className={cn(
                              "w-full px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between",
                              filterLevel === level 
                                ? "bg-teal-50 text-teal-700" 
                                : "text-slate-500 hover:bg-slate-50"
                            )}
                          >
                            {level}
                            {filterLevel === level && <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button 
                    onClick={() => setIsViewAll(true)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group whitespace-nowrap"
                  >
                    <Users size={14} className="text-slate-400 group-hover:text-teal-600" />
                    VER TODO
                    <ArrowRight size={12} className="text-slate-300 hidden md:block" />
                  </button>
                </div>
              </div>
            </div>
                  
            <div className="overflow-x-auto no-scrollbar min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-3">Nombre</th>
                    <th className="px-8 py-3">Nivel</th>
                    <th className="px-8 py-4 whitespace-nowrap">Última Visita</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map(customer => (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          layout
                          key={customer.id}
                          onClick={() => setSelectedCustomer(customer)}
                          className={cn(
                            "hover:bg-slate-50 transition-colors cursor-pointer group",
                            selectedCustomer.id === customer.id ? "bg-teal-50/30" : ""
                          )}
                        >
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-bold text-[13px] text-slate-700 whitespace-nowrap">{customer.name}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-5">
                            <div className="flex gap-1">
                              {customer.tags.map(tag => (
                                <span key={tag} className={cn(
                                  "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                                  tag.toUpperCase() === 'VIP' ? "bg-[#25D366]/10 text-[#25D366]" :
                                  tag.toUpperCase() === 'FRECUENTE' ? "bg-teal-50 text-teal-600" : "bg-orange-50 text-orange-600"
                                )}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-400 whitespace-nowrap">{customer.lastVisit}</td>
                          <td className="px-8 py-5 text-right">
                            <Link 
                              href={`/customers/${customer.id}`} 
                              className="p-2 inline-block text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ChevronRight size={18} />
                            </Link>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-10 text-center">
                          <p className="text-sm text-slate-400 font-bold">No se encontraron clientes con estos filtros.</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-8 py-6 bg-white border-t border-slate-50 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Mostrando 1 - {MOCK_CUSTOMERS.length} de {MOCK_CUSTOMERS.length} clientes
              </p>
              
              <div className="flex items-center gap-3">
                <button className="px-6 py-2.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-not-allowed transition-all">
                  Anterior
                </button>
                <button className="px-6 py-2.5 bg-white border-2 border-[#25D366] rounded-2xl text-[10px] font-black text-[#25D366] uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all shadow-sm shadow-[#25D366]/10">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Detail Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCustomer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-6 sticky top-24 shadow-sm border border-slate-100 flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className="h-20 w-20 rounded-[1.5rem] bg-teal-50 border-2 border-white flex items-center justify-center text-teal-600 text-2xl font-black uppercase shadow-xl shadow-teal-600/10 rotate-3">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-xl shadow-lg border border-slate-100">
                    <Star size={14} className="text-orange-500 fill-orange-500" />
                  </div>
                </div>
                <h2 className="text-xl font-black text-slate-800 leading-tight">{selectedCustomer.name}</h2>
                <div className="flex flex-col items-center mt-4">
                  <a 
                    href={`https://wa.me/${selectedCustomer.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 hover:bg-slate-50 rounded-full transition-all group shadow-sm mb-3"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="text-slate-500 font-bold text-[11px] group-hover:text-teal-600 transition-colors uppercase tracking-tight">{selectedCustomer.phone}</span>
                  </a>
                  
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCustomer.address || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-all group"
                  >
                    <MapPin size={12} className="group-hover:animate-bounce" />
                    <p className="text-[10px] font-medium">
                      {selectedCustomer.address?.split(',')[0] || 'Sin dirección registrada'}
                    </p>
                  </a>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-white text-[9px] font-black uppercase tracking-widest",
                    selectedCustomer.tags[0].toUpperCase() === 'VIP' ? "bg-[#25D366]" : 
                    selectedCustomer.tags[0].toUpperCase() === 'FRECUENTE' ? "bg-teal-600" : "bg-orange-600"
                  )}>
                    {selectedCustomer.tags[0]}
                  </span>
                </div>
              </div>

              <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee size={14} className="text-orange-500" />
                  <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Insights IA</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="p-1 bg-white rounded-lg text-teal-600 shadow-sm">
                      <Coffee size={12} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700">Café: Americano sin azúcar</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="p-1 bg-white rounded-lg text-blue-500 shadow-sm">
                      <RefreshCw size={12} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700">Frecuencia: {selectedCustomer.frequency}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="p-1 bg-white rounded-lg text-red-500 shadow-sm">
                      <AlertCircle size={12} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-red-600">Alergia: Maní</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 flex-1 flex flex-col">
                <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <History size={12} />
                  Actividad Reciente
                </h5>
                <div className="space-y-2 flex-1">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-slate-50/50 p-3 rounded-2xl flex justify-between items-center border border-transparent">
                      <div>
                        <p className="text-[10px] font-bold text-slate-700">Pedido #{8290 + i}</p>
                        <p className="text-[9px] text-slate-400">Oct {20 + i} • Entregado</p>
                      </div>
                      <span className="text-[10px] font-black text-teal-600">$45.000</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <Link 
                  href={`/customers/${selectedCustomer.id}`}
                  className="w-full bg-[#25D366] text-white py-3 rounded-2xl font-bold text-xs shadow-lg shadow-[#25D366]/10 hover:bg-[#1EBE5C] transition-all flex items-center justify-center gap-2 group"
                >
                  <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
                  Ver Perfil Completo
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
