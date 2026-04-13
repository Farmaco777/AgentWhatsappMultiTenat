'use client';

import { usePathname } from 'next/navigation';
import { Sidebar, Header, BottomNav } from '@/src/components/Navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isConversations = pathname === '/conversations';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {!isConversations && <Sidebar />}
      {!isConversations && <Header />}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        !isConversations ? "md:pl-64 pt-16 pb-24 md:pb-8" : ""
      )}>
        <div className={cn(
          "mx-auto h-full",
          !isConversations ? "max-w-7xl p-4 md:p-8" : "max-w-full h-screen"
        )}>
          {children}
        </div>
      </main>
      {!isConversations && <BottomNav />}
    </div>
  );
}

import { cn } from '@/src/lib/utils';
