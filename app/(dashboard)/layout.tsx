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
      <Sidebar />
      <Header />
      <main className={`transition-all duration-300 min-h-screen md:pl-64 ${isConversations ? 'pt-16 pb-2' : 'pt-16 pb-24 md:pb-8'}`}>
        <div className={`mx-auto ${isConversations ? 'max-w-full p-2 md:p-4' : 'max-w-7xl p-4 md:p-8'}`}>
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
