'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  MoreVertical,
  Send,
  Sparkles,
  ArrowRight,
  User,
  CheckCircle2,
  Zap,
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';

function ConversationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatIdParam = searchParams?.get('chatId');

  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO: Obtener de Auth real
  const tenantId = 'EL_ID_DEL_TENANT_ACTUAL';

  // 1. Cargar Conversaciones Iniciales
  useEffect(() => {
    async function loadChats() {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          customers (*)
        `)
        .eq('tenant_id', tenantId)
        .order('updated_at', { ascending: false });

      if (data) {
        setChats(data);
        if (chatIdParam) {
          const chat = data.find(c => c.id === chatIdParam);
          if (chat) setSelectedChat(chat);
        } else if (data.length > 0) {
          setSelectedChat(data[0]);
        }
      }
      setLoading(false);
    }
    loadChats();
  }, [tenantId, chatIdParam]);

  // 2. Cargar Mensajes cuando cambia el chat seleccionado
  useEffect(() => {
    if (selectedChat) {
      async function loadMessages() {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedChat.id)
          .order('created_at', { ascending: true });
        
        if (data) setLocalMessages(data);
      }
      loadMessages();

      // Suscripción en tiempo real para nuevos mensajes
      const channel = supabase
        .channel(`chat:${selectedChat.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${selectedChat.id}` 
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setLocalMessages(prev => [...prev, payload.new]);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedChat?.id]);

  // 3. Acciones de Handoff (Intervenir / Resolver)
  const updateStatus = async (newStatus: string) => {
    if (!selectedChat) return;
    const { error } = await supabase
      .from('conversations')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', selectedChat.id);
    
    if (!error) {
      setSelectedChat({ ...selectedChat, status: newStatus });
      setChats(prev => prev.map(c => c.id === selectedChat.id ? { ...c, status: newStatus } : c));
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || sending) return;
    setSending(true);

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          conversationId: selectedChat.id,
          message: messageInput,
          phoneNumber: selectedChat.customers?.phone // Ajustar según tu esquema de customers
        })
      });

      if (res.ok) {
        setMessageInput('');
        // El mensaje aparecerá via Realtime
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#25D366]" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cargando conversaciones...</p>
      </div>
    );
  }

  const filteredChats = chats.filter(chat => 
    chat.customers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.last_message_content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-144px)] md:h-[calc(100vh-96px)] w-full flex flex-col bg-slate-50 overflow-hidden md:rounded-3xl border border-slate-100 shadow-sm relative">
      <div className="flex-1 flex overflow-hidden bg-white">
        
        {/* Chat List (Sidebar) */}
        <aside className="hidden lg:flex w-80 flex-col bg-white border-r border-slate-100 shrink-0">
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
              Mensajería
              <span className="bg-[#25D366]/10 text-[#25D366] text-[10px] px-2 py-0.5 rounded-full">{chats.length}</span>
            </h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="Buscar chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#25D366]/20 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 pb-10">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all duration-200 flex gap-3",
                  selectedChat?.id === chat.id
                    ? "bg-slate-50 shadow-sm border border-slate-100 border-l-4 border-l-[#25D366]"
                    : "hover:bg-slate-50/50"
                )}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-teal-50 flex items-center justify-center text-teal-600 font-black text-sm uppercase">
                  {chat.customers?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-black text-slate-800 truncate">{chat.customers?.name || 'Cliente'}</h4>
                    <span className="text-[9px] font-bold text-slate-400">
                      {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-medium">{chat.last_message_content || 'Sin mensajes'}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
          {selectedChat ? (
            <>
              {/* Header */}
              <header className="bg-white/90 backdrop-blur-md h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-black border border-teal-100 uppercase text-xs shadow-sm">
                    {selectedChat.customers?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">{selectedChat.customers?.name || 'Cliente'}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        selectedChat.status === 'human_required' ? "text-orange-500" : "text-[#25D366]"
                      )}>
                        {selectedChat.status === 'human_required' ? "Control Humano" : "IA Activa"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateStatus(selectedChat.status === 'human_required' ? 'active' : 'human_required')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black transition-all active:scale-95 shadow-sm uppercase tracking-wider border-2",
                      selectedChat.status === 'human_required' 
                        ? "bg-orange-500 border-orange-500 text-white" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-500"
                    )}
                  >
                    <Zap size={14} />
                    {selectedChat.status === 'human_required' ? "Devolver a IA" : "Intervenir"}
                  </button>
                  <button 
                    onClick={() => updateStatus('resolved')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black transition-all active:scale-95 shadow-sm uppercase tracking-wider border-2",
                      selectedChat.status === 'resolved'
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-500"
                    )}
                  >
                    <CheckCircle2 size={14} />
                    {selectedChat.status === 'resolved' ? "Resuelto" : "Resolver"}
                  </button>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar pb-10 bg-[url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-dark-pattern.jpg')] bg-repeat">
                <AnimatePresence mode="popLayout">
                  {localMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex flex-col max-w-[85%] lg:max-w-[70%] relative",
                        msg.sender_type === 'customer' ? "items-start" : "ml-auto items-end"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-2xl shadow-sm relative",
                        msg.sender_type === 'customer' 
                          ? "bg-white text-slate-800 rounded-tl-none border border-black/5" 
                          : "bg-[#dcf8c6] text-slate-800 rounded-tr-none"
                      )}>
                        {msg.sender_type === 'bot' && (
                          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-black/5">
                            <Sparkles size={10} className="text-[#25D366]" />
                            <span className="text-[8px] font-black text-[#25D366] uppercase tracking-[0.15em]">IA Respuesta</span>
                          </div>
                        )}
                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                        <span className="text-[8px] font-bold text-slate-400 uppercase block text-right mt-1 opacity-60">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </AnimatePresence>
              </div>

              {/* Footer Input */}
              <div className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 flex items-center">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={selectedChat.status === 'human_required' ? "Escribe un mensaje..." : "AI se encargará..."}
                      className="w-full bg-transparent border-none text-sm font-medium outline-none"
                      disabled={selectedChat.status !== 'human_required'}
                    />
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={selectedChat.status !== 'human_required' || sending}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white transition-all",
                      selectedChat.status === 'human_required' ? "bg-[#25D366] shadow-lg shadow-[#25D366]/20" : "bg-slate-300"
                    )}
                  >
                    {sending ? <Loader2 className="animate-spin" /> : <Send size={20} className="ml-1" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Zap size={40} className="text-slate-200" />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.2em]">Selecciona un chat</p>
            </div>
          )}
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
