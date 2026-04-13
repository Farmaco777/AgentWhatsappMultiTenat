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
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  
  const demoChats = [
    { 
      id: 1, 
      name: 'Luis Sarabia', 
      msg: 'Mantengamos la grande por favor.', 
      time: '10:03 AM', 
      img: 'https://i.pravatar.cc/100?u=luis',
      phone: '+57 300 123 4567',
      status: 'Online',
      totalOrders: 12,
      lastOrder: 'Hace 2 días',
      messages: [
        { id: 1, text: '¡Hola! Bienvenidos a su restaurante favorito. ¿En qué podemos ayudarle hoy?', sender: 'ai', time: '10:00 AM' },
        { id: 2, text: 'Hola, me gustaría pedir una Pizza Grande de Pepperoni y dos Cocas heladas.', sender: 'customer', time: '10:02 AM' },
        { id: 3, text: '¡Excelente elección! 🍕 La pizza mediana está en promoción hoy, ¿prefiere cambiar a mediana por un precio menor o mantenemos la grande?', sender: 'ai', time: '10:02 AM' },
        { id: 4, text: 'Mantengamos la grande por favor.', sender: 'customer', time: '10:03 AM' },
      ],
      draft: {
        items: [
          { name: 'Pizza Grande Pepperoni', price: 45000, quantity: 1 },
          { name: 'Coca-Cola 500ml', price: 5000, quantity: 2 },
        ],
        total: 55000
      }
    },
    { 
      id: 2, 
      name: 'Maria Lopez', 
      msg: '¿Tienen servicio a domicilio?', 
      time: '09:45 AM', 
      img: 'https://i.pravatar.cc/100?u=maria',
      phone: '+57 311 987 6543',
      status: 'Chat en espera',
      totalOrders: 5,
      lastOrder: 'Hace 1 semana',
      messages: [
        { id: 1, text: 'Hola, ¿tienen servicio a domicilio?', sender: 'customer', time: '09:45 AM' },
        { id: 2, text: '¡Hola Maria! Sí, tenemos domicilio en todo el sector norte. ¿Te gustaría ver el menú?', sender: 'ai', time: '09:46 AM' },
      ],
      draft: { items: [], total: 0 }
    },
    { 
      id: 3, 
      name: 'Carlos Ruiz', 
      msg: 'Pago con tarjeta, gracias.', 
      time: 'Ayer', 
      img: 'https://i.pravatar.cc/100?u=carlos',
      phone: '+57 320 555 1234',
      status: 'Offline',
      totalOrders: 2,
      lastOrder: 'Ayer',
      messages: [
        { id: 1, text: '¿Puedo pagar con tarjeta al recibir?', sender: 'customer', time: 'Ayer' },
        { id: 2, text: 'Sí, Carlos. Nuestros repartidores llevan datáfono.', sender: 'ai', time: 'Ayer' },
        { id: 3, text: 'Pago con tarjeta, gracias.', sender: 'customer', time: 'Ayer' },
      ],
      draft: {
        items: [{ name: ' Hamburguesa Especial', price: 28000, quantity: 1 }],
        total: 28000
      }
    },
    { 
      id: 4, 
      name: 'Ana Martinez', 
      msg: '¿A qué hora cierran hoy?', 
      time: 'Ayer', 
      img: 'https://i.pravatar.cc/100?u=ana',
      phone: '+57 315 222 3344',
      status: 'Online',
      totalOrders: 8,
      lastOrder: 'Hace 3 días',
      messages: [
        { id: 1, text: 'Hola, ¿a qué hora cierran hoy?', sender: 'customer', time: 'Ayer' },
        { id: 2, text: '¡Hola Ana! Cerramos a las 10:00 PM hoy.', sender: 'ai', time: 'Ayer' },
      ],
      draft: { items: [], total: 0 }
    },
    { 
      id: 5, 
      name: 'Roberto Diaz', 
      msg: 'El pedido llegó perfecto.', 
      time: '2 días', 
      img: 'https://i.pravatar.cc/100?u=roberto',
      phone: '+57 310 444 5566',
      status: 'Offline',
      totalOrders: 15,
      lastOrder: 'Hace 2 días',
      messages: [
        { id: 1, text: 'Hola, mi pedido acaba de llegar. Muchas gracias.', sender: 'customer', time: '2 días' },
        { id: 2, text: '¡Excelente Roberto! Nos alegra mucho. ¡Que lo disfrutes!', sender: 'ai', time: '2 días' },
      ],
      draft: { items: [], total: 0 }
    },
    { 
      id: 6, 
      name: 'Elena Gomez', 
      msg: 'Quiero cancelar mi suscripción.', 
      time: '3 días', 
      img: 'https://i.pravatar.cc/100?u=elena',
      phone: '+57 301 777 8899',
      status: 'Chat en espera',
      totalOrders: 1,
      lastOrder: 'Hace 3 días',
      messages: [
        { id: 1, text: 'Hola, quiero cancelar mi suscripción por ahora.', sender: 'customer', time: '3 días' },
        { id: 2, text: '¡Hola Elena! Lamento escuchar eso. ¿Hay algo en lo que podamos mejorar?', sender: 'ai', time: '3 días' },
      ],
      draft: { items: [], total: 0 }
    }
  ];

  const activeChat = demoChats.find(c => c.id === selectedChatId) || demoChats[0];
  const [messages, setMessages] = useState(activeChat.messages);

  useEffect(() => {
    setMessages(activeChat.messages);
    setIsManualMode(false);
    setIsResolved(false);
  }, [selectedChatId]);

  // Efecto para simular la escritura de la IA en el primer chat
  useEffect(() => {
    if (selectedChatId === 1 && messages.length === 4) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 5,
          text: 'Entendido. 📝 He tomado su pedido: 1x Pizza Grande y 2x Bebidas. ¿A qué dirección lo enviamos?',
          sender: 'ai',
          time: '10:03 AM'
        }]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages, selectedChatId]);

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
        {/* Column 1: Chat List */}
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
            {demoChats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChatId(chat.id)}
                className={cn(
                  "p-4 border-b border-slate-50 flex gap-3 cursor-pointer transition-colors", 
                  selectedChatId === chat.id ? "bg-slate-50 border-l-4 border-l-[#25D366]" : "hover:bg-slate-50/50"
                )}
              >
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

        {/* Column 2: Main Chat */}
        <main className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden shadow-inner">
          {/* Chat Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{activeChat.name}</h3>
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest leading-none mt-0.5",
                  isManualMode ? "text-orange-500" : "text-[#25D366]"
                )}>
                  {isManualMode ? "Control Manual" : activeChat.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#25D366]/10 border border-[#25D366]/20 rounded-full mr-4">
                <Zap size={10} className={cn("mt-0.5", isManualMode ? "text-orange-500 fill-orange-500" : "text-[#25D366] fill-[#25D366]")} />
                <span className={cn("text-[9px] font-black mt-0.5", isManualMode ? "text-orange-500" : "text-[#25D366]")}>
                  {isManualMode ? "IA EN PAUSA" : "IA ACTIVA"}
                </span>
              </div>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><Phone size={18} /></button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><Video size={18} /></button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><MoreVertical size={18} /></button>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedChatId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex flex-col max-w-[85%] lg:max-w-[70%] relative",
                      msg.sender === 'customer' ? "items-start" : "ml-auto items-end"
                    )}
                  >
                    <div className={cn(
                      "p-3 lg:p-4 rounded-2xl shadow-sm relative",
                      msg.sender === 'customer' 
                        ? "bg-white text-slate-800 rounded-tl-none border border-black/5" 
                        : "bg-[#dcf8c6] text-slate-800 rounded-tr-none"
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Input Area + Buttons */}
          <footer className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 shrink-0 space-y-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsManualMode(!isManualMode)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-sm uppercase tracking-wider",
                  isManualMode 
                    ? "bg-slate-900 text-white" 
                    : "bg-white border-2 border-[#25D366] text-[#25D366]"
                )}
              >
                <Zap size={14} />
                {isManualMode ? "Entregar a IA" : "Intervenir Chat"}
              </button>
              <button 
                onClick={() => setIsResolved(!isResolved)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all active:scale-95 uppercase tracking-wider",
                  isResolved
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-slate-400 border-slate-100"
                )}
              >
                <CheckCircle2 size={14} />
                {isResolved ? "Resuelto" : "Resolver"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-400 font-medium">
                {isManualMode ? "Escribe un mensaje de WhatsApp..." : "La IA está respondiendo..."}
              </div>
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 cursor-not-allowed">
                <Send size={20} className="ml-0.5" />
              </div>
            </div>
          </footer>
        </main>

      </div>
    </div>
  );
}
