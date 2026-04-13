'use client';

import {
  TrendingUp,
  Calendar,
  Users,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Store,
  Send,
  ChevronRight
} from 'lucide-react';
import { MOCK_CHATS } from '@/src/data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  
  const chartData = [
    { day: 'LUN', height: 40, value: '$520.000', chats: 145 },
    { day: 'MAR', height: 60, value: '$780.000', chats: 210 },
    { day: 'MIE', height: 45, value: '$585.000', chats: 160 },
    { day: 'JUE', height: 85, value: '$1.1M', chats: 320 },
    { day: 'VIE', height: 95, value: '$1.25M', chats: 405 },
    { day: 'SAB', height: 70, value: '$910.000', chats: 280 },
    { day: 'DOM', height: 55, value: '$715.000', chats: 190 },
  ];

  const kpis = [
    { label: 'Ventas del día', value: '$1.250.000', change: '+8%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Chats Activos', value: MOCK_CHATS.length.toString(), change: 'En vivo', icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Autonomía IA', value: '94%', change: 'Gestión Auto', icon: Sparkles, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Clientes VIP', value: '18', change: 'Frecuentes', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Panel de Control</h1>
        <p className="text-slate-500 font-medium">Bienvenido de nuevo. Aquí está lo que sucede hoy en tu negocio.</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={kpi.label}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", kpi.bg, kpi.color)}>
                <kpi.icon size={24} />
              </div>
              <span className={cn("text-xs font-bold px-2 py-1 rounded-full", kpi.bg, kpi.color)}>
                {kpi.change}
              </span>
            </div>
            <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">{kpi.label}</p>
              <h3 className="text-2xl font-black mt-1 text-slate-800">{kpi.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Row 1: Rendimiento & Resumen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-full flex flex-col relative z-20">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Rendimiento Semanal</h2>
                  <p className="text-sm text-slate-400">Comparativa de ventas por día</p>
                </div>
                <select className="bg-slate-50 border-none text-xs font-bold rounded-xl px-4 py-2 ring-0 outline-none cursor-pointer">
                  <option>Esta semana</option>
                  <option>Semana pasada</option>
                </select>
              </div>

              <div className="flex items-end justify-between flex-1 min-h-[16rem] gap-2 px-2 mt-auto pt-10">
                {chartData.map((data, i) => (
                  <div 
                    key={data.day} 
                    className="flex flex-col items-center gap-3 flex-1 h-full relative cursor-pointer"
                    onMouseEnter={() => setHoveredDay(i)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <div className="w-full flex-1 flex justify-center items-end relative">
                      <AnimatePresence>
                        {hoveredDay === i && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute -top-16 bg-[#25D366] text-white p-3 rounded-xl shadow-lg shadow-[#25D366]/30 z-30 flex flex-col items-center justify-center pointer-events-none min-w-[90px]"
                          >
                            <span className="font-black text-sm">{data.value}</span>
                            <span className="text-white/90 text-[9px] uppercase tracking-wider font-bold mt-1">{data.chats} msgs</span>
                            <div className="w-3 h-3 bg-[#25D366] rotate-45 absolute -bottom-1.5 rounded-sm"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${data.height}%` }}
                        whileHover={{ scaleY: 1.02 }}
                        className={cn(
                          "w-full rounded-t-xl transition-all origin-bottom",
                          hoveredDay === i ? "bg-teal-400 shadow-xl shadow-teal-400/30" : i === 4 ? "bg-teal-600 shadow-lg shadow-teal-600/20" : "bg-teal-100 opacity-70"
                        )}
                      />
                    </div>
                    <span className={cn("text-[10px] font-bold transition-colors", hoveredDay === i ? "text-teal-600" : i === 4 ? "text-teal-600" : "text-slate-400")}>
                      {data.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Insights Top */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-[#25D366] p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-lg shadow-[#25D366]/20 flex-1 flex flex-col justify-center min-h-[16rem]">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={20} className="text-white/80" />
                  <h2 className="font-bold tracking-tight">Resumen Operativo</h2>
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Tiempo Respuesta</p>
                    <h4 className="text-3xl font-black">45 seg</h4>
                  </div>
                  <div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Hora Pico</p>
                    <h4 className="text-3xl font-black">13:30 - 15:00</h4>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <MessageSquare size={200} />
              </div>
            </div>

            <div className="bg-teal-50 p-6 rounded-[2rem] border border-teal-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">Sugerencia IA</p>
                <p className="text-sm leading-tight text-teal-900 mt-1">Optimiza el personal a las 13:00 hoy para reducir esperas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Chats & Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Chats */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare size={18} className="text-teal-600" />
                  Chats
                </h3>
                <Link href="/conversations" className="text-xs font-bold text-teal-600 hover:underline">Ver todas</Link>
              </div>
              <div className="space-y-4 flex-1">
                {MOCK_CHATS.slice(0, 5).map(chat => (
                  <Link href={`/conversations?chatId=${chat.id}`} key={chat.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={chat.customerAvatar} alt={chat.customerName} className="w-10 h-10 rounded-full border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-sm font-bold truncate text-slate-700">{chat.customerName}</span>
                        <span className="text-[10px] text-slate-400">{chat.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                    </div>
                    <ChevronRight className="text-slate-300 w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Insights Bottom */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500 rounded-xl text-white">
                  <AlertCircle size={18} />
                </div>
                <h4 className="text-sm font-bold text-red-900">Alertas Críticas</h4>
              </div>
              <div className="space-y-3">
                <div className="bg-white/50 p-3 rounded-2xl border border-red-100">
                  <p className="text-xs font-bold text-red-800">Límite de cuota cerca</p>
                  <p className="text-[11px] text-red-700/70 mt-1">El plan de envíos de Meta está al 90%.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-800 rounded-xl text-white shrink-0">
                  <Store size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Estado del Sistema</h4>
              </div>
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[11px] font-bold text-slate-800">WhatsApp Cloud API</p>
                    <p className="text-[10px] text-slate-500 mt-1">Conectado y estable</p>
                  </div>
                  <div className="flex h-3 w-3 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[11px] font-bold text-slate-800">Motor de IA</p>
                    <p className="text-[10px] text-slate-500 mt-1">Latencia: 124ms</p>
                  </div>
                  <div className="flex h-3 w-3 relative shrink-0">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
