'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  Sparkles,
  Play,
  Send
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function LandingPage() {
  const plans = [
    {
      name: 'Plan Básico',
      description: 'Ideal para flujo inicial.',
      price: '100.000',
      frequency: '/mes',
      features: [
        'Hasta 200 conversaciones/mes',
        'Hasta 200 pedidos/mes',
        '1 negocio / 1 número',
        'Agente de IA estándar',
        'Registro auto. de clientes',
        'Dashboard Básico',
        'Soporte estándar'
      ],
      cta: 'Empezar ahora',
      highlight: false
    },
    {
      name: 'Plan Pro',
      description: 'Para negocios en crecimiento.',
      price: '200.000',
      frequency: '/mes',
      features: [
        'Hasta 500 conversaciones/mes',
        'Hasta 500 pedidos/mes',
        'Control humano manual',
        'Filtros avanzados',
        'Estados de pedido Pro',
        'Métricas de conversión',
        'Soporte prioritario'
      ],
      cta: 'Seleccionar Pro',
      highlight: true
    },
    {
      name: 'Plan Plus',
      description: 'Operaciones multi-sede.',
      price: '300.000',
      frequency: '/mes',
      features: [
        'Hasta 1.000 conversaciones/mes',
        'Hasta 1.000 pedidos/mes',
        'Multi-sede (máximo 2 sedes)',
        'Vistas e informes por sede',
        'Conexión de 2 números',
        'Entrenamiento a medida',
        'Soporte premium'
      ],
      cta: 'Seleccionar Plus',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#25D366]/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg shadow-[#25D366]/20">
              <MessageSquare className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">MultiBot</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Funcionalidades</a>
            <a href="#pricing" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Precios</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-7 py-3 text-[11px] font-black text-slate-900 uppercase tracking-widest border-2 border-[#00897B] rounded-2xl hover:bg-[#00897B] hover:text-white transition-all">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="px-7 py-3 bg-[#25D366] text-white border-2 border-[#25D366] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-transparent hover:text-[#25D366] transition-all shadow-xl shadow-[#25D366]/20">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION - UX EXPERT FOCUS */}
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-24 overflow-hidden">
          {/* Background Decorative Elemets */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#25D366]/5 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

          <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 mb-8">
                  <Sparkles size={12} className="text-[#25D366]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#25D366]">Ecosistema Multi-Tenant AI</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] mb-6">
                  <span className="block md:whitespace-nowrap">Vende de forma</span>
                  <span className="text-[#25D366] block">autónoma.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
                  Automatiza tus ventas por WhatsApp con MultiBot. Un asistente de IA que entiende tu negocio, toma pedidos y atiende clientes 24/7 sin que muevas un dedo.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                  <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-[#25D366] text-white border-2 border-[#25D366] rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-[#25D366]/30 hover:bg-transparent hover:text-[#25D366] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                    Empezar ahora <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/demo" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-[#00897B] text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#00897B] hover:text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                    Ver Demo <Play size={14} fill="currentColor" className="ml-1" />
                  </Link>
                </div>

                <div className="flex items-center gap-4 py-6 border-t border-slate-100">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?u=${i + 15}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    <span className="text-slate-900 block font-black">CASO DE ÉXITO</span>
                    +500 negocios automatizados
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[280px]"
              >
                <div className="rounded-[2.5rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl aspect-[9/16] bg-white flex flex-col uppercase tracking-tighter">
                  <div className="bg-slate-900 p-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white font-black text-[10px]">MB</div>
                      <div>
                        <p className="text-white text-[10px] font-black uppercase tracking-tighter leading-none">MultiBot Agent</p>
                        <p className="text-[#25D366] text-[8px] font-bold">Responde al instante</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#efeae2] p-4 space-y-4 overflow-y-auto flex flex-col justify-center">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                      <p className="text-[11px] font-medium text-slate-800">¡Hola! ¿Qué te gustaría pedir de nuestro catálogo hoy? 🍕🍔</p>
                    </div>
                    <div className="bg-[#dcf8c6] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] ml-auto">
                      <p className="text-[11px] font-medium text-slate-800">Quiero una Pizza de Pepperoni y un refresco.</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] border-l-4 border-orange-400">
                      <p className="text-[9px] font-black text-orange-600 uppercase mb-1 tracking-tighter">Pedido Identificado:</p>
                      <p className="text-[11px] font-bold text-slate-800">1x Pizza Pepperoni ($35.000)</p>
                      <p className="text-[11px] font-bold text-slate-800">1x Coca-Cola ($5.000)</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                      <p className="text-[11px] font-medium text-slate-800">¡Excelente elección! ¿Confirmamos pedido para envío?</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <div className="flex-1 h-8 bg-slate-50 rounded-full border border-slate-100" />
                    <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/20">
                      <Send size={14} className="text-white fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                {/* Visual Accent */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#25D366] rounded-2xl -z-10 rotate-12 opacity-50 blur-xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features SECTION */}
        <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Potencia tu negocio con IA.</h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto uppercase tracking-[0.15em] text-[10px]">Descubre las herramientas que transformarán tu atención al cliente</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <Zap size={28} />, 
                  title: 'Velocidad de Respuesta', 
                  desc: 'Atención inmediata 24/7. Tus clientes nunca volverán a esperar a que alguien lea su mensaje.',
                  color: 'from-orange-500 to-amber-400',
                  bg: 'bg-orange-50',
                  accent: 'group-hover:shadow-orange-200'
                },
                { 
                  icon: <ShieldCheck size={28} />, 
                  title: 'Seguridad Empresarial', 
                  desc: 'Conectado a la API oficial de Meta para máxima estabilidad y cumplimiento de términos legales.',
                  color: 'from-[#25D366] to-[#1EBE5C]',
                  bg: 'bg-emerald-50',
                  accent: 'group-hover:shadow-[#25D366]/20'
                },
                { 
                  icon: <Smartphone size={28} />, 
                  title: 'Gestión Centralizada', 
                  desc: 'Controla pedidos, clientes y conversaciones desde un dashboard unificado de alto rendimiento.',
                  color: 'from-blue-600 to-cyan-400',
                  bg: 'bg-blue-50',
                  accent: 'group-hover:shadow-blue-200'
                }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "group p-10 rounded-[3rem] bg-white border border-slate-200 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden",
                    item.accent
                  )}
                >
                  {/* Decorative Gradient Background on Hover */}
                  <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-full -mr-16 -mt-16 transition-all duration-700 scale-50 group-hover:scale-150",
                    item.color
                  )} />
                  
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-black/5 bg-gradient-to-br",
                    item.color
                  )}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-[13px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing SECTION */}
        <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Precios transparentes.</h2>
            <p className="text-slate-500 font-medium">Escoge el plan que mejor se adapte al volumen de tu negocio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-10 rounded-[3rem] border transition-all flex flex-col relative",
                  plan.highlight 
                    ? "bg-[#00897B] text-white border-[#00897B] shadow-2xl scale-105 z-10" 
                    : "bg-white text-slate-900 border-slate-200 hover:border-[#25D366]"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#25D366] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    MÁS VENDIDO
                  </div>
                )}
                <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                <p className={cn("text-xs font-bold uppercase tracking-widest mb-8", plan.highlight ? "text-[#25D366]" : "text-slate-400")}>
                  {plan.description}
                </p>
                
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-[10px] font-black opacity-60">COP</span>
                  <span className="text-3xl font-black tracking-tighter">${plan.price}</span>
                  <span className="text-[10px] font-bold uppercase opacity-60">{plan.frequency}</span>
                </div>

                <div className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className={cn("shrink-0", plan.highlight ? "text-[#25D366]" : "text-[#25D366]")} size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.highlight ? "/register" : "/login"}
                  className={cn(
                    "w-full py-4 px-6 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                    plan.highlight
                      ? "bg-[#25D366] text-white hover:bg-white hover:text-[#25D366] shadow-xl shadow-[#25D366]/20"
                      : "bg-transparent text-slate-800 border-2 border-[#25D366] hover:bg-[#25D366] hover:text-white"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">¿Grandes Volúmenes o Multi-sede?</h4>
              <p className="text-slate-500 text-sm font-medium max-w-2xl">
                Si superas las 1.000 conversaciones mensuales o manejas más de 2 sedes, solicita un plan a medida con soporte dedicado y entrenamiento de IA profundo.
              </p>
            </div>
            <a 
              href="https://wa.me/tu_numero" 
              className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shrink-0"
            >
              Contactar Ventas
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-white py-16 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#25D366] rounded-xl flex items-center justify-center">
              <MessageSquare className="text-white" size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">MultiBot</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2024 MultiBot. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
