'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Phone,
  MoreVertical,
  Send,
  PlusCircle,
  Sparkles,
  CheckCircle,
  Hand,
  Calendar,
  Receipt,
  Star,
  History,
  ArrowRight,
  AlertCircle,
  User
} from 'lucide-react';
import { MOCK_CHATS, MOCK_CUSTOMERS } from '@/src/data/mockData';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';

function ConversationsContent() {
  const searchParams = useSearchParams();
  const chatIdParam = searchParams?.get('chatId');

  const initialChat = MOCK_CHATS.find(c => c.id === chatIdParam) || MOCK_CHATS[0];
  const [selectedChat, setSelectedChat] = useState(initialChat);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [localMessages, setLocalMessages] = useState(initialChat.messages);
  const [searchQuery, setSearchQuery] = useState('');

  // Sincronización en tiempo real con Supabase
  useEffect(() => {
    // Solo si el chat seleccionado tiene una ID real de conversación
    // y si Supabase está activo
    if (!selectedChat.id.startsWith('chat') && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const channel = supabase
        .channel(`messages:${selectedChat.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${selectedChat.id}` 
        }, (payload) => {
          const newMessage = payload.new as any;
          setLocalMessages(prev => [...prev, newMessage]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChat.id]);

  useEffect(() => {
    if (chatIdParam) {
      const chat = MOCK_CHATS.find(c => c.id === chatIdParam);
      if (chat) {
        setSelectedChat(chat);
        setLocalMessages(chat.messages);
      }
    }
  }, [chatIdParam]);

  // Sync local messages when chat changes
  const handleChatSelect = (chat: typeof MOCK_CHATS[0]) => {
    setSelectedChat(chat);
    setLocalMessages(chat.messages);
    setIsResolved(false);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'ai' as const, // For demo, we send as 'ai' but in manual mode it would be business
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLocalMessages([...localMessages, newMessage]);
    setMessageInput('');
    setIsManualMode(true); // Automatically take control when sending
  };
  
  // Find customer associated with selected chat
  const customer = MOCK_CUSTOMERS.find(c => 
    c.name.includes(selectedChat.customerName.replace('.', '')) || 
    selectedChat.customerName.includes(c.name.split(' ')[0])
  ) || MOCK_CUSTOMERS[0];

  const filteredChats = MOCK_CHATS.filter(chat => 
    chat.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.intent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[950px] mb-10 pt-24">
      <div className="fixed top-16 md:left-64 left-0 right-0 z-30 bg-slate-50/95 backdrop-blur-sm px-4 md:px-8 py-4 border-b border-slate-100 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Inbox de Mensajería</h1>
        <p className="text-slate-500 font-medium">Gestiona las interacciones de WhatsApp y la IA en tiempo real.</p>
      </div>

      <div className="flex bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 min-h-0">
      {/* Chat List */}
      <section className="w-80 flex flex-col bg-slate-50/50 border-r border-slate-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Inbox</h2>
            <span className="bg-[#25D366] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{MOCK_CHATS.length} Activos</span>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#25D366]/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-6">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={cn(
                "p-4 rounded-2xl cursor-pointer transition-all duration-200 group",
                selectedChat.id === chat.id
                  ? "bg-white shadow-md shadow-slate-200/50 border border-slate-100"
                  : "hover:bg-slate-100/50"
              )}
            >
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-black text-sm uppercase">
                    {chat.customerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[13px] truncate text-slate-700">{chat.customerName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{chat.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-medium">{chat.lastMessage}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider",
                      chat.intent === 'pedido' ? "bg-[#25D366]/10 text-[#25D366]" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {chat.intent}
                    </span>
                    {chat.intent === 'pedido' && (
                      <span className="text-[10px] text-orange-500 font-black flex items-center gap-1">
                        <AlertCircle size={10} />
                        Acción Requerida
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Window */}
      <section className="flex-1 flex flex-col bg-white relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-50 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold text-[10px] uppercase">
              {selectedChat.customerName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800 tracking-tight">{selectedChat.customerName}</h3>
              <span className={cn(
                "flex items-center gap-1.5 text-[10px] font-bold transition-colors uppercase tracking-wider",
                isManualMode ? "text-orange-500" : "text-[#25D366]"
              )}>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  isManualMode ? "bg-orange-500" : "bg-[#25D366]"
                )}></span>
                {isManualMode ? "Control Manual" : "IA Optimizando"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/10">
          <div className="flex justify-center mb-4">
            <span className="bg-white/80 border border-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm">Hoy</span>
          </div>

          {localMessages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[80%]",
                msg.sender === 'customer' ? "items-start" : "items-end ml-auto"
              )}
            >
              <div className={cn(
                "px-5 py-3 rounded-2xl shadow-sm relative",
                msg.sender === 'customer'
                  ? "bg-white text-slate-700 rounded-tl-none border border-slate-200/60"
                  : "bg-[#25D366] text-white rounded-tr-none shadow-lg shadow-[#25D366]/10"
              )}>
                <p className="text-[13px] leading-relaxed font-medium">{msg.text}</p>
                <span className={cn(
                  "text-[9px] mt-1.5 block text-right font-bold",
                  msg.sender === 'customer' ? "text-slate-400" : "text-white/70"
                )}>
                  {msg.timestamp}
                </span>
                {msg.sender === 'ai' && (
                  <div className="absolute -left-10 bottom-0 bg-white border border-orange-100 text-orange-500 p-1.5 rounded-xl shadow-sm">
                    <Sparkles size={14} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* AI Order Draft Card */}
          {selectedChat.intent === 'pedido' && (
            <div className="flex justify-center mt-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-orange-50/50 border-2 border-dashed border-orange-200 p-5 rounded-[2rem] max-w-sm w-full shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-orange-500" />
                  <h4 className="text-[11px] font-black text-orange-900 uppercase tracking-widest">Borrador de Pedido IA</h4>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>2x Pizza Margarita</span>
                    <span>$56.000</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>1x Coca-Cola Zero</span>
                    <span>$6.500</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-orange-100 flex gap-2">
                  <button className="flex-1 py-2 bg-orange-500 text-white rounded-xl text-[10px] font-bold hover:bg-orange-600 transition-colors uppercase tracking-tight">Confirmar y Enviar</button>
                  <button className="flex-1 py-2 bg-white text-orange-500 border border-orange-200 rounded-xl text-[10px] font-bold hover:bg-orange-50 transition-colors uppercase tracking-tight">Editar</button>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        <div className="bg-white border-t border-slate-50 p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsManualMode(!isManualMode)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all active:scale-95 shadow-sm uppercase tracking-wider",
                  isManualMode 
                    ? "bg-slate-900 text-white hover:bg-slate-800" 
                    : "bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
                )}
              >
                <Hand size={16} />
                {isManualMode ? "Entregar a IA" : "Intervenir Chat"}
              </button>
              <button 
                onClick={() => {
                  setIsResolved(!isResolved);
                  if (!isResolved) setIsManualMode(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black border-2 transition-all active:scale-95 uppercase tracking-wider",
                  isResolved
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-slate-400 border-slate-100 hover:text-slate-600 hover:border-slate-200"
                )}
              >
                <CheckCircle size={16} />
                {isResolved ? "Resuelto" : "Resolver"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors shrink-0">
              <PlusCircle size={22} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe un mensaje de WhatsApp..."
                className="w-full bg-slate-50/80 border-none rounded-2xl px-5 py-4 text-[13px] font-medium focus:ring-4 focus:ring-[#25D366]/5 transition-all outline-none"
              />
            </div>
            <button 
              onClick={handleSendMessage}
              className="bg-[#25D366] text-white p-4 rounded-2xl shadow-xl shadow-[#25D366]/10 hover:bg-[#1EBE5C] active:scale-95 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </section>



      </div>
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium tracking-wide">Cargando buzón de chats...</div>}>
      <ConversationsContent />
    </Suspense>
  );
}
