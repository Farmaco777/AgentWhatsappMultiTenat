'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Phone,
  MoreVertical,
  Send,
  Sparkles,
  ArrowRight,
  User,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { MOCK_CHATS } from '@/src/data/mockData';
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

  const handleChatSelect = (chat: typeof MOCK_CHATS[0]) => {
    setSelectedChat(chat);
    setLocalMessages(chat.messages);
    setIsResolved(false);
    setIsManualMode(false);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'ai' as const,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLocalMessages([...localMessages, newMessage]);
    setMessageInput('');
    setIsManualMode(true);
  };
  
  const filteredChats = MOCK_CHATS.filter(chat => 
    chat.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="flex-1 flex overflow-hidden bg-white shadow-2xl border border-slate-100">
        
        {/* Chat List (Sidebar) */}
        <aside className="hidden lg:flex w-85 flex-col bg-white border-r border-slate-100 shrink-0">
          <div className="p-6 border-b border-slate-50">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/dashboard" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
                <ArrowRight className="rotate-180" size={20} />
              </Link>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                Mensajes
                <span className="bg-[#25D366]/10 text-[#25D366] text-[10px] px-2 py-0.5 rounded-full">{MOCK_CHATS.length}</span>
              </h2>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="Buscar chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#25D366]/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 pb-10">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all duration-200 flex gap-3",
                  selectedChat.id === chat.id
                    ? "bg-slate-50 shadow-sm border border-slate-100 border-l-4 border-l-[#25D366]"
                    : "hover:bg-slate-50/50"
                )}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100">
                  <div className="w-full h-full bg-teal-50 flex items-center justify-center text-teal-600 font-black text-sm uppercase">
                    {chat.customerName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-black text-slate-800 truncate">{chat.customerName}</h4>
                    <span className="text-[9px] font-bold text-slate-400">{chat.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-medium">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
          {/* Header */}
          <header className="bg-white/90 backdrop-blur-md h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold border border-teal-100">
                <User size={22} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 tracking-tight">{selectedChat.customerName}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isManualMode ? "text-orange-500" : "text-[#25D366]"
                  )}>
                    {isManualMode ? "Control Manual" : "IA Optimizando"}
                  </p>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded-full">
                    <Sparkles size={10} className={cn(isManualMode ? "text-orange-500" : "text-[#25D366]")} />
                    <span className={cn("text-[9px] font-black", isManualMode ? "text-orange-500" : "text-[#25D366]")}>
                      {isManualMode ? "AI PAUSA" : "AI ACTIVA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-full transition-all"><Phone size={20} /></button>
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-full transition-all"><MoreVertical size={20} /></button>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar pb-10">
            <AnimatePresence mode="popLayout">
              {localMessages.map((msg) => (
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
                    "p-4 rounded-2xl shadow-sm relative",
                    msg.sender === 'customer' 
                      ? "bg-white text-slate-800 rounded-tl-none border border-black/5" 
                      : "bg-[#dcf8c6] text-slate-800 rounded-tr-none"
                  )}>
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-slate-100">
                        <div className="w-4 h-4 bg-[#25D366] rounded-full flex items-center justify-center">
                          <Sparkles size={8} className="text-white" />
                        </div>
                        <span className="text-[8px] font-black text-[#25D366] uppercase tracking-[0.15em]">AI Response Agent</span>
                      </div>
                    )}
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <span className="text-[8px] font-bold text-slate-400 uppercase block text-right mt-1 opacity-60">
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer Control */}
          <div className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-6 space-y-4 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsManualMode(!isManualMode)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-sm uppercase tracking-wider border-2",
                  isManualMode 
                    ? "bg-[#25D366] border-[#25D366] text-white" 
                    : "bg-white border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                )}
              >
                <ArrowRight size={14} className={isManualMode ? "rotate-180" : ""} />
                {isManualMode ? "Entregar a IA" : "Intervenir Chat"}
              </button>
              <button 
                onClick={() => setIsResolved(!isResolved)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-sm uppercase tracking-wider border-2",
                  isResolved
                    ? "bg-[#00897B] border-[#00897B] text-white"
                    : "bg-white border-[#00897B] text-[#00897B] hover:bg-[#00897B] hover:text-white"
                )}
              >
                <CheckCircle2 size={14} />
                {isResolved ? "Resuelto" : "Resolver"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isManualMode ? "Escribe un mensaje..." : "AI se encargará..."}
                  className="w-full bg-transparent border-none text-sm font-medium outline-none"
                  readOnly={!isManualMode}
                />
              </div>
              <button 
                onClick={handleSendMessage}
                disabled={!isManualMode}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white transition-all",
                  isManualMode ? "bg-[#25D366] shadow-lg shadow-[#25D366]/20 cursor-pointer" : "bg-slate-300 cursor-not-allowed"
                )}
              >
                <Send size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </main>

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
