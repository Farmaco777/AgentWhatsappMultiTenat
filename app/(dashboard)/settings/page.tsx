'use client';

import { useState } from 'react';
import {
  Store,
  MapPin,
  Cpu,
  Database,
  MessageSquare,
  Plus,
  Trash2,
  Save,
  Sparkles,
  Zap,
  Globe,
  Upload,
  Link as LinkIcon,
  FileText,
  FileCode,
  X,
  Gift,
  MousePointerClick,
  RefreshCw,
  Check,
  Clock,
  Smartphone,
  Phone,
  MessageCircle,
  Hash
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SettingsPage() {
  const [hasChanges, setHasChanges] = useState(false);

  const [branches, setBranches] = useState([
    { id: 1, name: 'Sede Principal', address: 'Downtown - Calle 45 #12-80' }
  ]);

  const addBranch = () => {
    const newId = branches.length > 0 ? Math.max(...branches.map(b => b.id)) + 1 : 1;
    setBranches([...branches, { id: newId, name: '', address: '' }]);
    setHasChanges(true);
  };

  const removeBranch = (id: number) => {
    setBranches(branches.filter(b => b.id !== id));
    setHasChanges(true);
  };

  const updateBranch = (id: number, field: 'name' | 'address', value: string) => {
    setBranches(branches.map(b => b.id === id ? { ...b, [field]: value } : b));
    setHasChanges(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800">Ajustes</h1>
          <p className="text-slate-500 font-medium">Gestiona la identidad de tu negocio, agentes de IA e integraciones.</p>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={!hasChanges}
            onClick={() => setHasChanges(false)}
            className={cn(
              "px-8 py-3 rounded-2xl border-2 border-[#25D366] font-bold transition-all flex items-center gap-2",
              hasChanges
                ? "bg-[#25D366] text-white shadow-xl shadow-[#25D366]/20 hover:bg-[#1EBE5C]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-12 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-[1.5rem] bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm">
                <Store size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Información General</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nombre del Negocio</label>
                <input type="text" defaultValue="La Boheme Bistro" onChange={() => setHasChanges(true)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tipo de Negocio</label>
                <input type="text" defaultValue="Restaurante" onChange={() => setHasChanges(true)} placeholder="Ej: Restaurante, Cafetería..." className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 transition-all" />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Descripción del Negocio</label>
                <textarea 
                  defaultValue="Un espacio acogedor donde la tradición se encuentra con la innovación culinaria. Especialistas en pastas frescas y carnes maduradas."
                  onChange={() => setHasChanges(true)}
                  rows={3}
                  className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Teléfono de Contacto</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" defaultValue="321 456 7890" onChange={() => setHasChanges(true)} className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">WhatsApp Business</label>
                <div className="relative flex items-center bg-slate-50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                  <div className="pl-6 pr-3 py-4 flex items-center gap-3 border-r border-slate-100 bg-slate-50/50">
                    <MessageCircle size={14} className="text-slate-400" />
                    <span className="text-slate-400 font-black text-sm">+57</span>
                  </div>
                  <input 
                    type="text" 
                    defaultValue="321 456 7890" 
                    onChange={() => setHasChanges(true)} 
                    className="flex-1 bg-transparent border-none px-4 py-4 text-slate-700 font-bold outline-none" 
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Horario de Atención</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" defaultValue="Lunes a Sábado: 12:00 PM - 10:00 PM" onChange={() => setHasChanges(true)} className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 transition-all" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between ml-1 mr-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sedes Activas</label>
                  <button 
                    onClick={addBranch}
                    className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1 hover:text-teal-700 transition-all"
                  >
                    <Plus size={12} />
                    Agregar Sede
                  </button>
                </div>
                
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.id} className="group relative bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                      <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Identificador</label>
                          <input 
                            type="text" 
                            value={branch.name}
                            onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
                            placeholder="Ej: Sede Principal, Norte, Mall..."
                            className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Dirección Completa</label>
                          <input 
                            type="text" 
                            value={branch.address}
                            onChange={(e) => updateBranch(branch.id, 'address', e.target.value)}
                            placeholder="Calle, Carrera, Ciudad..."
                            className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20"
                          />
                        </div>
                      </div>
                      {branches.length > 1 && (
                        <button 
                          onClick={() => removeBranch(branch.id)}
                          className="p-3 text-slate-300 hover:text-rose-500 transition-all"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-[1.5rem] bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm">
                <MousePointerClick size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Widget Web</h3>
                <p className="text-slate-500 font-medium text-sm">Integra a tu agente IA directamente en tu página web con un botón flotante.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Instrucciones</label>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Copia y pega el siguiente código justo antes de la etiqueta <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-500 font-bold">&lt;/body&gt;</code> de tu sitio web para activar el chat.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -top-3 right-4 bg-[#25D366] text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest z-10 shadow-lg">
                    Script de Instalación
                  </div>
                  <pre className="bg-slate-900 text-teal-400 p-8 rounded-[2rem] text-[11px] font-mono leading-relaxed overflow-x-auto border-4 border-slate-800 shadow-2xl relative group-hover:border-[#25D366]/30 transition-all">
                    <code>
{`<!-- BotWhatsapp Widget -->
<script 
  src="https://cdn.botwhatsapp.app/widget.js" 
  data-agent-id="bw_5892_rt_boheme"
  defer>
</script>`}
                    </code>
                  </pre>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('<!-- BotWhatsapp Widget -->\n<script \n  src="https://cdn.botwhatsapp.app/widget.js" \n  data-agent-id="bw_5892_rt_boheme"\n  defer>\n</script>');
                    }}
                    className="absolute bottom-4 right-4 bg-[#25D366] hover:bg-[#1EBE5C] text-white p-2 rounded-xl transition-all border border-[#25D366] flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#25D366]/20"
                  >
                    <FileCode size={14} />
                    Copiar Código
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden">
                <div className="text-center space-y-4 mb-8">
                  <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Vista Previa del Botón</h4>
                  <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Así es como tus clientes verán el acceso al agente en tu sitio web.</p>
                </div>

                {/* Simulated Floating Button Preview */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-teal-400/20 blur-2xl rounded-full animate-pulse"></div>
                  <button className="relative w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl shadow-[#25D366]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-default">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </button>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-100 border-4 border-white rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-ping"></div>
                  </div>
                </div>

                <div className="mt-8 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
