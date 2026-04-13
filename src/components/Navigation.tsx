'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  CalendarDays,
  Users,
  Star,
  Settings,
  Menu,
  Bell,
  Search,
  Bot,
  Smartphone,
  Gift,
  LogOut
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Si tuvieras manejo de estado global (Zustand, Context) o NextAuth, se limpiaría aquí.
    router.push('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chats', path: '/conversations' },
    { icon: Users, label: 'Clientes', path: '/customers' },
    { icon: Bot, label: 'Agente IA', path: '/agente' },
    { icon: Menu, label: 'Catálogo', path: '/catalogo' },
    { icon: Smartphone, label: 'WhatsApp', path: '/whatsapp' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  return (
    <aside className={cn("h-screen w-64 hidden md:flex flex-col fixed left-0 top-0 bg-white border-r border-slate-100 z-50", className)}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-600/20">
            <ReceiptText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 leading-none">BotWhatsapp</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Restaurant Ops</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col justify-evenly">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-teal-50 text-teal-700 font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <item.icon size={20} className={cn("transition-colors", "group-hover:text-teal-600")} />
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
  );
};

export const Header = () => {
  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 md:pl-64">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center gap-4">
          <Menu className="md:hidden text-slate-600 cursor-pointer" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chats', path: '/conversations' },
    { icon: Menu, label: 'Más', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-2 pb-6 md:hidden bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all",
              isActive ? "text-teal-600 bg-teal-50 px-4" : "text-slate-400"
            )}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
