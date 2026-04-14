'use client';

import { 
  Bell, 
  Clock, 
  MessageSquareWarning, 
  ReceiptText, 
  Bot, 
  Filter, 
  CheckCircle2,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'intervention', 
      title: 'Intervención Humana Requerida', 
      description: 'El cliente Luis Sarabia ha solicitado hablar con un agente humano. La IA ha pausado las respuestas automáticas para este chat.',
      time: 'Hace 2 minutos',
      date: '14 Abr, 2026',
      isRead: false,
      icon: MessageSquareWarning,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    { 
      id: 2, 
      type: 'order', 
      title: 'Nuevo Pedido Confirmado', 
      description: 'Maria Lopez ha realizado un pedido de "Pizza Grande Pepperoni" y "2x Coca-Cola". Total: $55.000.',
      time: 'Hace 15 minutos',
      date: '14 Abr, 2026',
      isRead: true,
      icon: ReceiptText,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    { 
      id: 3, 
      type: 'system', 
      title: 'Sincronización de Catálogo Exitosa', 
      description: 'El catálogo digital se ha sincronizado correctamente con el motor de IA de WhatsApp.',
      time: 'Hace 1 hora',
      date: '14 Abr, 2026',
      isRead: true,
      icon: Bot,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    { 
      id: 4, 
      type: 'intervention', 
      title: 'Duda sobre envíos internacionales', 
      description: 'Carlos Ortiz pregunta por envíos fuera del país. El agente IA requiere supervisión para esta respuesta.',
      time: 'Hace 3 horas',
      date: '14 Abr, 2026',
      isRead: true,
      icon: MessageSquareWarning,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    { 
      id: 5, 
      type: 'order', 
      title: 'Pedido Entregado', 
      description: 'El pedido #ORD-9011 de Felipe Ruiz ha sido marcado como entregado.',
      time: 'Ayer',
      date: '13 Abr, 2026',
      isRead: true,
      icon: ReceiptText,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    }
  ]);

  const filteredNotifications = filter === 'ALL' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 flex items-center gap-3">
            <Bell size={36} className="text-teal-600" />
            Centro de Notificaciones
          </h1>
          <p className="text-slate-500 font-medium mt-1">Mantente al tanto de la actividad de tu negocio y las intervenciones del agente.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={markAllAsRead}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 size={14} className="text-teal-500" />
            Marcar todo como leído
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('ALL')}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === 'ALL' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-white"
              )}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilter('UNREAD')}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                filter === 'UNREAD' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-white"
              )}
            >
              No leídas
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              )}
            </button>
          </div>
          
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Filter size={18} />
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={notif.id}
                className={cn(
                  "p-8 flex gap-6 hover:bg-slate-50/50 transition-all group relative",
                  !notif.isRead && "after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1.5 after:bg-teal-500"
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", notif.bg)}>
                  <notif.icon size={24} className={notif.color} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className={cn("text-lg font-black tracking-tight leading-none", notif.isRead ? "text-slate-600" : "text-slate-900")}>
                        {notif.title}
                      </h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {notif.time}
                        </span>
                        <span>•</span>
                        <span>{notif.date}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className={cn(
                    "mt-3 text-sm leading-relaxed max-w-3xl", 
                    notif.isRead ? "text-slate-500 font-medium" : "text-slate-600 font-bold"
                  )}>
                    {notif.description}
                  </p>
                  
                  {!notif.isRead && (
                    <div className="mt-4 flex gap-3">
                      <button className="px-5 py-2 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all">
                        Atender ahora
                      </button>
                      <button className="px-5 py-2 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all">
                        Ignorar
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-100 mb-6">
                <Bell size={48} />
              </div>
              <h4 className="text-xl font-black text-slate-800 tracking-tight">Cero notificaciones</h4>
              <p className="text-sm text-slate-400 mt-2 font-medium max-w-xs mx-auto">
                No hay alertas que coincidan con tu filtro actual. ¡Buen trabajo manteniendo todo bajo control!
              </p>
            </div>
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex justify-center">
            <button className="text-[10px] font-black text-slate-400 hover:text-slate-800 uppercase tracking-[0.2em] transition-all">
              Cargar notificaciones más antiguas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
