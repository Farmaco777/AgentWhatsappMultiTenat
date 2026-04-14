'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  Users,
  Settings,
  Menu,
  Bell,
  Bot,
  Smartphone,
  LogOut,
  X,
  BellRing,
  MessageSquareWarning,
  AlertTriangle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Inicio', path: '/dashboard' },
  { icon: MessageSquare, label: 'Chats', path: '/conversations' },
  { icon: Bot, label: 'Agente', path: '/agente' },
  { icon: ReceiptText, label: 'Catálogo', path: '/catalogo' },
  { icon: Users, label: 'Clientes', path: '/customers' },
  { icon: Smartphone, label: 'WhatsApp', path: '/whatsapp' },
  { icon: Settings, label: 'Ajustes', path: '/settings' },
];

export const Sidebar = ({ className, isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "h-screen w-64 flex flex-col fixed left-0 top-0 bg-white border-r border-slate-100 z-50 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        className
      )}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-600/20">
                <ReceiptText size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 leading-none">MultiBot</h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Admin Panel</p>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            )}
          </div>

          <nav className="flex-1 flex flex-col justify-between py-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-teal-50 text-teal-700 font-bold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  )}
                >
                  <item.icon size={20} className={cn("transition-colors", isActive ? "text-teal-600" : "group-hover:text-teal-600")} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-red-50 hover:text-red-600 group"
            >
              <LogOut size={20} className="transition-colors text-red-500" />
              <span className="text-sm font-bold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Mock notifications - In production these would come from Supabase real-time
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'intervention', 
      title: 'Intervención Humana', 
      description: 'Luis Sarabia requiere atención manual en su consulta.',
      time: 'Hace 2 min',
      isRead: false,
      icon: MessageSquareWarning,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    { 
      id: 2, 
      type: 'order', 
      title: 'Nuevo Pedido', 
      description: 'Se ha registrado un pedido de Maria Lopez por $55.000.',
      time: 'Hace 15 min',
      isRead: true,
      icon: ReceiptText,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    { 
      id: 3, 
      type: 'system', 
      title: 'Agente IA Actualizado', 
      description: 'Se ha sincronizado el catálogo con el motor de respuestas.',
      time: 'Hace 1 hora',
      isRead: true,
      icon: Bot,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} className="md:hidden" />
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 md:pl-64">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "p-2.5 rounded-full transition-all relative group",
                isNotificationsOpen ? "bg-teal-50 text-teal-600" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {unreadCount > 0 ? (
                <BellRing size={20} className={cn("transition-transform", isNotificationsOpen ? "" : "group-hover:rotate-12")} />
              ) : (
                <Bell size={20} />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-[320px] md:w-[380px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50 flex flex-col max-h-[500px]"
                  >
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                      <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Notificaciones</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Tienes {unreadCount} mensajes sin leer</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={markAllAsRead}
                          className="text-[9px] font-black text-teal-600 uppercase tracking-tighter hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Marcar todo como leído
                        </button>
                        <button 
                          onClick={() => setIsNotificationsOpen(false)}
                          className="p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-full transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-y-auto no-scrollbar py-2">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={cn(
                              "px-6 py-4 flex gap-4 hover:bg-slate-50/80 transition-all cursor-pointer relative group",
                              !notif.isRead && "after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-12 after:bg-teal-500 after:rounded-r-full"
                            )}
                          >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", notif.bg)}>
                              <notif.icon size={20} className={notif.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-0.5">
                                <h4 className={cn("text-xs font-black truncate", notif.isRead ? "text-slate-600" : "text-slate-900")}>
                                  {notif.title}
                                </h4>
                                <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap ml-2 flex items-center gap-1">
                                  <Clock size={8} />
                                  {notif.time}
                                </span>
                              </div>
                              <p className={cn("text-[11px] leading-relaxed line-clamp-2", notif.isRead ? "text-slate-400 font-medium" : "text-slate-500 font-bold")}>
                                {notif.description}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                            <Bell size={32} />
                          </div>
                          <h4 className="text-sm font-black text-slate-800">Todo al día</h4>
                          <p className="text-xs text-slate-400 mt-1 font-medium">No tienes notificaciones nuevas en este momento.</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center sticky bottom-0 z-10">
                      <Link 
                        href="/notifications"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-[10px] font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                        <span>Ver historial completo</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
};

export const BottomNav = () => {
  const pathname = usePathname();

  const mobileNavItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/dashboard' },
    { icon: Bot, label: 'Agente', path: '/agente' },
    { icon: MessageSquare, label: 'Chats', path: '/conversations' },
    { icon: ReceiptText, label: 'Catálogo', path: '/catalogo' },
    { icon: Settings, label: 'Ajustes', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pt-2 pb-6 md:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-100 z-50 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center min-w-[64px] py-1 rounded-xl transition-all duration-300",
              isActive 
                ? "text-teal-600 bg-teal-50 shadow-sm shadow-teal-600/5 translate-y-[-2px]" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <item.icon size={22} className={cn("transition-transform", isActive && "scale-110")} />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-wider mt-1 transition-opacity",
              isActive ? "opacity-100" : "opacity-70"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
