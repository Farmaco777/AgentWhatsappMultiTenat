'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Send, 
  User, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

export default function DemoPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! Bienvenidos a su restaurante favorito. ¿En qué podemos ayudarle hoy?', sender: 'ai', time: '10:00 AM' },
    { id: 2, text: 'Hola, me gustaría pedir una Pizza Grande de Pepperoni y dos Cocas heladas.', sender: 'customer', time: '10:02 AM' },
    { id: 3, text: '¡Excelente elección! 🍕 La pizza mediana está en promoción hoy, ¿prefiere cambiar a mediana por un precio menor o mantenemos la grande?', sender: 'ai', time: '10:02 AM' },
    { id: 4, text: 'Mantengamos la grande por favor.', sender: 'customer', time: '10:03 AM' },
  ]);

  const [activeChat] = useState({
    name: 'Luis Sarabia',
    phone: '+57 300 123 4567',
    status: 'Online',
    totalOrders: 12,
    lastOrder: 'Hace 2 días'
  });

  const [orderDraft, setOrderDraft] = useState({
    items: [
      { name: 'Pizza Grande Pepperoni', price: 45000, quantity: 1 },
      { name: 'Coca-Cola 500ml', price: 5000, quantity: 2 },
    ],
    total: 55000
  });

  // Efecto para simular la escritura de la IA
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 4) {
        setMessages(prev => [...prev, {
          id: 5,
          text: 'Entendido. 📝 He tomado su pedido: 1x Pizza Grande y 2x Bebidas. ¿A qué dirección lo enviamos?',
          sender: 'ai',
          time: '10:03 AM'
        }]);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Demo Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-slate-400" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center text-white">
              <MessageSquare size={18} />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">MultiBot <span className="text-[#25D366]">Demo</span></span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full">
          <Sparkles size={14} className="text-orange-500" />
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Previsualización Interactiva: El Motor de tu PWA</p>
        </div>

        <Link href="/register" className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#25D366] transition-all">
          Obtener ahora
        </Link>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Chat List (Hidden on mobile for demo focus) */}
        <aside className="hidden lg:flex w-80 border-r border-slate-200 bg-white flex-col shrink-0">
          <div className="p-4 border-b border-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Buscar chats..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[
              { name: 'Luis Sarabia', msg: 'Mantengamos la grande por favor.', time: '10:03 AM', active: true, img: 'https://i.pravatar.cc/100?u=luis' },
              { name: 'Maria Lopez', msg: '¿Tienen servicio a domicilio?', time: '09:45 AM', active: false, img: 'https://i.pravatar.cc/100?u=maria' },
              { name: 'Carlos Ruiz', msg: 'Pago con tarjeta, gracias.', time: 'Ayer', active: false, img: 'https://i.pravatar.cc/100?u=carlos' },
              { name: 'Ana Martinez', msg: '¿A qué hora cierran hoy?', time: 'Ayer', active: false, img: 'https://i.pravatar.cc/100?u=ana' },
              { name: 'Roberto Diaz', msg: 'El pedido llegó perfecto.', time: '2 días', active: false, img: 'https://i.pravatar.cc/100?u=roberto' },
              { name: 'Elena Gomez', msg: 'Quiero cancelar mi suscripción.', time: '3 días', active: false, img: 'https://i.pravatar.cc/100?u=elena' },
            ].map((chat, i) => (
              <div key={i} className={cn("p-4 border-b border-slate-50 flex gap-3 cursor-pointer transition-colors", chat.active ? "bg-slate-50 border-l-4 border-l-[#25D366]" : "hover:bg-slate-50/50")}>
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                  <img src={chat.img} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-black text-slate-900 truncate">{chat.name}</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{chat.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-medium">{chat.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Column 2: Main Chat - THE HEART */}
        <main className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden shadow-inner">
          {/* Chat Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{activeChat.name}</h3>
                <p className="text-[10px] text-[#25D366] font-black uppercase tracking-widest leading-none mt-0.5">{activeChat.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#25D366]/10 border border-[#25D366]/20 rounded-full mr-4">
                <Zap size={10} className="text-[#25D366] fill-[#25D366]" />
                <span className="text-[9px] font-black text-[#25D366] mt-0.5">IA ACTIVA</span>
              </div>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><Phone size={18} /></button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><Video size={18} /></button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><MoreVertical size={18} /></button>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex flex-col max-w-[85%] lg:max-w-[70%] relative",
                    msg.sender === 'customer' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-3 lg:p-4 rounded-2xl shadow-sm relative",
                    msg.sender === 'customer' 
                      ? "bg-[#dcf8c6] text-slate-800 rounded-tr-none" 
                      : "bg-white text-slate-800 rounded-tl-none border border-black/5"
                  )}>
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-slate-100">
                        <div className="w-4 h-4 bg-[#25D366] rounded-full flex items-center justify-center">
                          <Zap size={8} className="text-white fill-current" />
                        </div>
                        <span className="text-[8px] font-black text-[#25D366] uppercase tracking-[0.15em]">AI Response Agent</span>
                      </div>
                    )}
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter block text-right mt-1 opacity-60">{msg.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <footer className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-400 font-medium">
                Escribe un mensaje...
              </div>
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 cursor-not-allowed">
                <Send size={20} className="ml-0.5" />
              </div>
            </div>
          </footer>
        </main>

        {/* Column 3: Order Summary & Info */}
        <aside className="hidden xl:flex w-96 border-l border-slate-200 bg-white flex-col shrink-0 overflow-y-auto">
          {/* User Profile Info */}
          <div className="p-8 border-b border-slate-50 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-[#25D366]/20 overflow-hidden mb-4 shadow-xl">
              <img src="https://i.pravatar.cc/200?u=luissarabia" alt="user" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{activeChat.name}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-6">{activeChat.phone}</p>
            
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Pedidos Totales</p>
                <p className="text-lg font-black text-slate-900">{activeChat.totalOrders}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Frecuencia</p>
                <p className="text-sm font-black text-slate-900 uppercase">Mensual</p>
              </div>
            </div>
          </div>

          {/* AI Order Draft */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 shadow-sm">
                  <ShoppingBag size={18} />
                </div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Borrador de Pedido IA</h4>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[8px] font-black uppercase tracking-widest">Calculando...</span>
            </div>

            <div className="space-y-4 mb-8">
              {orderDraft.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center text-[10px] font-black text-[#25D366]">{item.quantity}x</div>
                    <span className="text-[11px] font-bold text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full translate-x-12 -translate-y-12" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Total Estimado</p>
                  <Sparkles size={14} className="text-[#25D366]" />
                </div>
                <p className="text-3xl font-black mb-1">${orderDraft.total.toLocaleString()}</p>
                <p className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">Iva incluido • En espera de aprobación</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                <Info size={16} className="text-blue-500 shrink-0" />
                <p className="text-[10px] text-blue-800 font-bold leading-relaxed">
                  Esta información fue extraída automáticamente de la conversación por la IA de MultiBot.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
