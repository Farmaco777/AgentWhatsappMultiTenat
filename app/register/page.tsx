'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, Sparkles, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center lg:justify-start px-6 lg:px-24 relative overflow-hidden bg-slate-900">
      {/* Background with Unsplash Image - SHARED PREMIUM DESIGN */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop"
          alt="Modern office"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
      </div>

      <motion.main
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl p-8 lg:p-10 rounded-[3rem] shadow-2xl border border-white/10"
      >
        <div className="mb-8 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="w-10 h-10 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20">
              <MessageSquare size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">MultiBot</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Crear Cuenta</h1>
          <p className="text-slate-300 font-medium text-sm">Empieza a automatizar tu negocio hoy mismo.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre del Negocio</label>
            <input
              type="text"
              required
              placeholder="Mi Gran Negocio"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#25D366]/50 transition-all outline-none text-sm"
            />
          </div>
          
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
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#25D366]/50 transition-all outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#25D366] text-white font-black py-4 rounded-[2rem] shadow-xl shadow-[#25D366]/20 hover:bg-[#1fb355] active:scale-[0.98] transition-all mt-4 uppercase text-[11px] tracking-widest flex items-center justify-center gap-2"
          >
            Registrarme <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-[#25D366] font-black uppercase text-[10px] tracking-widest hover:underline ml-1">
            Inicia Sesión
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
