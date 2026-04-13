'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, Sparkles, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center lg:justify-start px-6 lg:px-24 relative overflow-hidden bg-slate-900">
      {/* Background with Unsplash Image - RESTORED DESIGN */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2000&auto=format&fit=crop"
          alt="Modern workspace"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
      </div>

      <motion.main
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl p-8 lg:p-10 rounded-[3rem] shadow-2xl border border-white/10"
      >
        <div className="mb-6 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="w-10 h-10 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20">
              <MessageSquare size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">MultiBot</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Bienvenido</h1>
          <p className="text-slate-300 font-medium text-sm">Accede a tu panel de operaciones inteligentes.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Correo electrónico</label>
            <input
              type="email"
              required
              placeholder="tu@negocio.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#25D366]/50 transition-all outline-none text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Contraseña</label>
              <a href="#" className="text-[10px] font-bold text-[#25D366] hover:text-[#25D366] uppercase tracking-widest">Olvidé mi contraseña</a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#25D366]/50 transition-all outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#25D366] text-white font-black py-4 rounded-[2rem] shadow-xl shadow-[#25D366]/20 hover:bg-[#1fb355] active:scale-[0.98] transition-all mt-2 uppercase text-[11px] tracking-widest"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-400">
          ¿Aún no tienes cuenta?{' '}
          <Link href="/register" className="text-[#25D366] font-black uppercase text-[10px] tracking-widest hover:underline ml-1">
            Regístrate ahora
          </Link>
        </p>

      </motion.main>

      <footer className="fixed bottom-8 right-12 hidden lg:block">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
          MultiBot © 2026 • Intelligent Agent Platform
        </p>
      </footer>
    </div>
  );
}
