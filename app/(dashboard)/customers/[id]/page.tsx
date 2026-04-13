'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  Star, 
  History, 
  Edit3, 
  MessageCircle, 
  Coffee, 
  AlertCircle,
  TrendingUp,
  Award,
  Clock,
  Cake,
  X,
  Trash2,
  Save,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_CUSTOMERS } from '@/src/data/mockData';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const customer = MOCK_CUSTOMERS.find(c => c.id === id) || MOCK_CUSTOMERS[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [formData, setFormData] = useState({
    name: customer.name,
    phone: customer.phone,
    birthDay: '15',
    birthMonth: '10' // October
  });

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')) {
      // Mock delete
      router.push('/customers');
    }
  };

  const initials = formData.name.split(' ').map(n => n[0]).join('');
  
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const formatBirthday = () => {
    return `${formData.birthDay} ${months[parseInt(formData.birthMonth) - 1]}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Search and Header - Simplified */}
      <div className="flex items-center gap-4">
        <Link 
          href="/customers"
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Perfil del Cliente</h1>
          <p className="text-sm text-slate-400 font-bold">Información detallada y gestión operativa.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-stretch">
        {/* Main Info Card */}
        <div className="col-span-12 lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group"
          >
            {/* Action Buttons inside Card */}
            <div className="absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
              <button 
                onClick={() => setIsEditing(true)}
                className="p-3 bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all shadow-sm"
                title="Editar Perfil"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                title="Eliminar Cliente"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10 h-full">
              <div className="w-32 h-32 rounded-[2.5rem] bg-teal-50 border-4 border-white flex items-center justify-center text-teal-600 text-4xl font-black uppercase shadow-xl shadow-teal-600/10 shrink-0">
                {initials}
              </div>
              
              <div className="flex-1 text-center md:text-left pt-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h2 className="text-xl xl:text-2xl font-black text-slate-800 tracking-tight leading-tight">{formData.name}</h2>
                  <span className="inline-block w-fit px-3 py-1 rounded-full bg-[#25D366] text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                    VIP Member
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 max-w-xl">
                  <div className="flex items-center gap-3 text-slate-600">
                    <a 
                      href={`https://wa.me/${formData.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-50 text-[#25D366] rounded-lg hover:bg-[#25D366] hover:text-white transition-all shadow-sm shrink-0"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">WhatsApp</span>
                      <span className="font-bold text-[11px] text-slate-700 whitespace-nowrap">{formData.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-2 bg-slate-50 text-pink-500 rounded-lg shrink-0"><Cake size={14} /></div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Cumpleaños</span>
                      <span className="font-bold text-[11px] text-slate-700 whitespace-nowrap">{formatBirthday()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg shrink-0"><MapPin size={14} /></div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Dirección</span>
                      <span className="font-bold text-[11px] text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
                        {customer.address?.split(',')[0] || 'Sin dirección'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg shrink-0"><Clock size={14} /></div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Última visita</span>
                      <span className="font-bold text-[11px] text-slate-700 whitespace-nowrap">{customer.lastVisit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50"></div>
          </motion.div>
        </div>

        {/* Loyalty Stats Card */}
        <div className="col-span-12 lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden h-full flex flex-col justify-center shadow-xl shadow-slate-900/10"
          >
            <div className="relative z-10 space-y-2">
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Puntos Acumulados</h4>
                  <Award size={14} className="text-[#25D366]" />
                </div>
                <p className="text-3xl font-black text-white">{customer.points}</p>
                <div className="mt-2 bg-white/10 rounded-full h-1 w-full overflow-hidden">
                  <div className="bg-[#25D366] h-full w-[70%]"></div>
                </div>
                <p className="text-[7px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Nivel 4: Gourmet Explorer</p>
              </div>

              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Gastado</h5>
                  <p className="text-sm font-black text-white leading-none">${customer.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <h5 className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Frecuencia</h5>
                  <p className="text-sm font-black text-[#25D366] leading-none">{customer.frequency}</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#25D366]/20 rounded-full blur-3xl -mb-16 -mr-16"></div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Secondary Column */}
        <div className="col-span-12 lg:col-span-8">
          {/* Activity History Full Width */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><History size={24} /></div>
                <h3 className="text-xl font-black text-slate-800">Historial Reciente de Pedidos</h3>
              </div>
              <button 
                onClick={() => setShowAllOrders(!showAllOrders)}
                className="text-[10px] font-black uppercase text-teal-600 tracking-widest hover:underline"
              >
                {showAllOrders ? 'Ver menos' : 'Ver todos'}
              </button>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-[2.5fr_1fr_1fr_1.2fr_1fr] px-6 py-3 bg-slate-50/50 rounded-xl mb-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Número pedido</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Fecha</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Puntos</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Precio</span>
            </div>

            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, showAllOrders ? 10 : 3).map(i => (
                <div key={i} className="grid grid-cols-[2.5fr_1fr_1fr_1.2fr_1fr] items-center p-6 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-all">
                      <Clock size={18} />
                    </div>
                    <p className="text-sm font-bold text-slate-700 whitespace-nowrap">Pedido #{8420 - i}</p>
                  </div>
                  
                  <p className="text-[11px] text-slate-500 font-bold text-center">1{i} Oct</p>
                  
                  <div className="flex justify-center text-orange-500 font-black text-[10px] items-center gap-1">
                    <Star size={10} className="fill-orange-500" />
                    +1{i}0
                  </div>

                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                      Entregado
                    </span>
                  </div>

                  <p className="text-sm font-black text-slate-700 text-right">$1{i}.500</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Prediction Sidebar column */}
        <div className="col-span-12 lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp size={24} className="text-teal-600" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predicciones del Agente</h3>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Probabilidad de Retorno</p>
                  <p className="text-3xl font-black text-teal-600 mt-1">94%</p>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed font-bold">
                  "El cliente tiende a visitar los fines de semana por la noche. Sugiero enviar una invitación para el próximo viernes a las 8 PM."
                </p>
              </div>

              <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <AlertCircle size={14} />
                  <p className="text-[10px] font-black uppercase text-orange-500">Restricciones</p>
                </div>
                <p className="text-xs font-bold text-orange-800">{customer.preferences?.notes || 'Sin restricciones detectadas'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsEditing(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Edit3 size={24} className="text-teal-600" />
                Editar Perfil
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono / WhatsApp</label>
                <div className="flex items-center bg-slate-50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                  <div className="px-5 py-4 bg-slate-100/50 border-r border-slate-100 text-slate-400 font-black text-sm">
                    +57
                  </div>
                  <input 
                    type="text" 
                    placeholder="300 123 4567"
                    value={formData.phone.replace('+57 ', '')}
                    onChange={(e) => setFormData({ ...formData, phone: `+57 ${e.target.value}` })}
                    className="w-full bg-transparent border-none px-6 py-4 text-slate-700 font-bold focus:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cumpleaños (Día y Mes)</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Cake size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select 
                      value={formData.birthDay}
                      onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 appearance-none"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <select 
                      value={formData.birthMonth}
                      onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 appearance-none"
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#1EBE5C] transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
