'use client';

import { useState, useEffect } from 'react';
import { Save, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, Info, Smartphone, Loader2, Settings2, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { launchWhatsAppSignup } from '@/src/lib/facebookSdk';

export default function WhatsAppPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'pending'>('disconnected');
  const [configMode, setConfigMode] = useState<'automatic' | 'manual'>('automatic');
  
  // Estados para configuración manual
  const [manualForm, setManualForm] = useState({
    phoneNumberId: '',
    wabaId: '',
    accessToken: ''
  });

  // Simulación de carga de datos del tenant
  const [accountInfo, setAccountInfo] = useState<any>(null);

  const tenantId = 'EL_ID_DEL_TENANT_ACTUAL';

  const handleManualSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualForm,
          tenantId,
          type: 'manual'
        })
      });
      if (res.ok) setStatus('connected');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            WhatsApp Business
          </h1>
          <p className="text-slate-500 font-medium italic">Conecta tu número oficial a la potencia de la IA</p>
        </div>
        
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border shadow-sm",
          status === 'connected' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
        )}>
          <div className={cn("w-2 h-2 rounded-full", status === 'connected' ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
          {status === 'connected' ? 'Cuenta Operativa' : 'Sin Conexión'}
        </div>
      </header>

      {/* Selector de Modo */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setConfigMode('automatic')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2",
            configMode === 'automatic' ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <ShieldCheck size={16} />
          AUTOMÁTICO
        </button>
        <button 
          onClick={() => setConfigMode('manual')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2",
            configMode === 'manual' ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Settings2 size={16} />
          MODO EXPERTO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {configMode === 'automatic' ? (
              <motion.div 
                key="auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
              >
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-[#1877F2]/10 p-3 rounded-2xl">
                    <Smartphone className="text-[#1877F2]" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Embedded Signup</h2>
                    <p className="text-slate-500 text-sm">Flujo oficial de Meta. Conexión en menos de 2 minutos.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       No necesitas crear App en Meta
                    </p>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       Detección automática de números
                    </p>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       Validación de negocio instantánea
                    </p>
                  </div>
                  
                  <button 
                    disabled={loading}
                    className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    onClick={() => {
                      setLoading(true);
                      launchWhatsAppSignup(async (data) => {
                        try {
                          const res = await fetch('/api/whatsapp/connect', {
                            method: 'POST',
                            body: JSON.stringify({ ...data, tenantId, type: 'automatic' })
                          });
                          if (res.ok) setStatus('connected');
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setLoading(false);
                        }
                      });
                    }}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Smartphone size={20} />}
                    {loading ? 'CONECTANDO...' : 'CONECTAR CON FACEBOOK'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="manual"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
              >
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-slate-800/10 p-3 rounded-2xl">
                    <Settings2 className="text-slate-800" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Parámetros Manuales</h2>
                    <p className="text-slate-500 text-sm">Carga tus credenciales si ya posees una App en Meta for Developers.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number ID</label>
                    <input 
                      type="text" 
                      placeholder="Ej: 10928374650912" 
                      value={manualForm.phoneNumberId}
                      onChange={(e) => setManualForm({...manualForm, phoneNumberId: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WABA ID</label>
                    <input 
                      type="text" 
                      placeholder="Ej: 902837465021"
                      value={manualForm.wabaId}
                      onChange={(e) => setManualForm({...manualForm, wabaId: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 transition-all" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Key size={12} className="text-slate-400" />
                      Permanent Access Token (System User)
                    </label>
                    <input 
                      type="password" 
                      placeholder="EAAB..." 
                      value={manualForm.accessToken}
                      onChange={(e) => setManualForm({...manualForm, accessToken: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 transition-all" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleManualSave}
                  disabled={loading || !manualForm.accessToken}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5c] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  GUARDAR CONFIGURACIÓN MANUAL
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Webhook Connection Box */}
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                Configuración del Webhook
              </h3>
              <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">Paso Requerido</span>
            </div>
            <p className="text-xs text-slate-500 mb-6 font-medium">Copia esta URL en tu Panel de Configuración de Meta (Sección Webhooks) para recibir mensajes.</p>
            <div className="flex gap-2">
              <input 
                readOnly
                type="text" 
                value="https://tu-saas.com/api/webhook/whatsapp"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-500 outline-none"
              />
              <button 
                onClick={() => navigator.clipboard.writeText("https://tu-saas.com/api/webhook/whatsapp")}
                className="px-6 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-black text-[10px] text-slate-600 transition-colors"
              >
                COPIAR
              </button>
            </div>
          </div>
        </div>

        {/* Support Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-[#25D366] to-[#1da851] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-6 italic">Guía de Inicio</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm shrink-0 border border-white/20 group-hover:bg-white group-hover:text-[#25D366] transition-all">1</div>
                  <p className="text-xs font-bold text-white leading-relaxed">Conecta tu cuenta comercial de Meta Business.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm shrink-0 border border-white/20 group-hover:bg-white group-hover:text-[#25D366] transition-all">2</div>
                  <p className="text-xs font-bold text-white leading-relaxed">Selecciona el número de teléfono verificado.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm shrink-0 border border-white/20 group-hover:bg-white group-hover:text-[#25D366] transition-all">3</div>
                  <p className="text-xs font-bold text-white leading-relaxed">Configura el Webhook para recibir chats en vivo.</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <ShieldCheck size={200} />
            </div>
          </div>

          <div className="bg-teal-50 p-8 rounded-[2.5rem] border border-teal-100">
             <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-teal-600" size={20} />
                <h4 className="font-black text-sm text-teal-800">Soporte VIP</h4>
             </div>
             <p className="text-xs text-teal-700 font-medium leading-relaxed">¿Tienes problemas con la configuración manual? Nuestro equipo técnico puede ayudarte a configurar tu cuenta de Meta Developers.</p>
             <a 
                href="https://wa.me/573017810256?text=Hola,%20necesito%20ayuda%20con%20mi%20configuración%20de%20WhatsApp%20en%20MultiBot"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-4 bg-teal-600 text-white font-black text-[10px] rounded-2xl hover:bg-[#25D366] transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-900/10 hover:shadow-[#25D366]/20"
             >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                PEDIR ASESORÍA
             </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
