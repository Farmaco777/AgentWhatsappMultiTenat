'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Smile,
  Heart,
  Diamond,
  Hexagon,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function OnboardingPage() {
  const [step] = useState(3);
  const router = useRouter();

  const tones = [
    { id: 'cordial', label: 'Cordial', icon: Smile, desc: 'Educado, respetuoso y profesional. Ideal para marcas corporativas y servicios.' },
    { id: 'cercano', label: 'Cercano', icon: Heart, desc: 'Amigable y empático. Usa un lenguaje relajado pero profesional.', active: true },
    { id: 'premium', label: 'Premium', icon: Diamond, desc: 'Exclusivo y sofisticado. Enfocado en la excelencia y el lujo.' },
    { id: 'rapido', label: 'Rápido', icon: Hexagon, desc: 'Directo y eficiente. Respuestas cortas al punto, ideal para despachos rápidos.' },
  ];

  const steps = [
    { id: 1, label: 'PERFIL' },
    { id: 2, label: 'OPERACIONES' },
    { id: 3, label: 'AGENTE' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans text-slate-900 pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-teal-50 flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">BotWhatsapp</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Luis Sarabia</p>
            <p className="text-[10px] text-slate-400 font-bold">Administrador</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border-2 border-teal-100">
            <img src="https://i.pravatar.cc/150?u=manager" alt="Manager" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-6xl mx-auto">
        {/* Stepper */}
        <div className="mb-20">
          <div className="flex justify-between items-center max-w-xl mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-teal-100 -z-10 -translate-y-1/2"></div>
            {steps.map(s => (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500",
                  s.id < step 
                    ? "bg-[#00a884] text-white shadow-lg shadow-teal-500/20" 
                    : s.id === 3 
                      ? "bg-transparent border-2 border-[#00a884] text-[#00a884]" // Step 3: border only
                      : "bg-[#00a884] text-white shadow-lg shadow-teal-500/20"
                )}>
                  {s.id < step ? <Check size={18} /> : s.id}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.2em]",
                  s.id <= step ? "text-[#00a884]" : "text-slate-400"
                )}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Selection Area */}
          <div className="lg:col-span-8 flex flex-col">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-sm border border-teal-50 flex-grow"
            >
              <div className="flex items-center gap-6 mb-12">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-[#00a884]">
                  <Zap size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">Personaliza tu Agente</h1>
                  <p className="text-slate-400 font-bold text-sm mt-1 leading-relaxed max-w-md">
                    Define la personalidad de tu asistente virtual para conectar mejor con tus clientes de WhatsApp.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tones.map(tone => (
                  <div
                    key={tone.id}
                    className={cn(
                      "group relative p-7 rounded-[2rem] border-2 transition-all cursor-pointer",
                      tone.active
                        ? "bg-white border-[#00a884] shadow-xl shadow-teal-500/5 ring-4 ring-teal-50/50"
                        : "bg-[#fcfdfd] border-transparent hover:border-teal-100"
                    )}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        tone.active ? "bg-teal-50 text-[#00a884]" : "text-slate-300"
                      )}>
                        <tone.icon size={26} />
                      </div>
                      {tone.active && (
                        <div className="w-5 h-5 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-black text-lg text-slate-800">{tone.label}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">{tone.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <div className="mt-8">
              <button className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest text-[#00a884] hover:bg-teal-50 px-6 py-3 rounded-2xl transition-all">
                <ArrowLeft size={16} />
                Anterior
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-teal-50">
              <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-8">Resumen del Negocio</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#00a884] shrink-0">
                    <Store size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Negocio</p>
                    <p className="font-black text-sm text-slate-800 mt-0.5">Tienda Tech Pro</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#00a884] shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Industria</p>
                    <p className="font-black text-sm text-slate-800 mt-0.5">Retail Tecnológico</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-teal-50">
                  <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest mb-4">Capacidades del Agente</p>
                  <div className="flex flex-wrap gap-2">
                    {['Atención 24/7', 'Venta Directa', 'Catálogo IA'].map(cap => (
                      <span key={cap} className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-700 border border-slate-100">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions Card */}
            <div className="bg-[#006e6a] rounded-[2.5rem] p-8 lg:p-10 text-white relative shadow-2xl shadow-teal-900/20 group flex-grow">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={18} />
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Sugerencia Multibot</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed opacity-100 italic">
                  &quot;Para un negocio de Retail Tecnológico, el tono Cercano ayuda a simplificar términos técnicos y genera mayor confianza en la compra directa.&quot;
                </p>
              </div>
              <div className="absolute bottom-6 right-6 w-12 h-12 border-4 border-white/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            <div className="mt-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-[#26ce73] text-white py-4 rounded-2xl font-black shadow-xl shadow-green-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm"
              >
                Finalizar Configuración
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
