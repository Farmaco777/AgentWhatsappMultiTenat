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
  X
} from 'lucide-react';
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
  { icon: Settings, label: 'Configuración', path: '/settings' },
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

          <nav className="flex-1 flex flex-col gap-1">
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

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
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
    { icon: Settings, label: 'Configuración', path: '/settings' },
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
