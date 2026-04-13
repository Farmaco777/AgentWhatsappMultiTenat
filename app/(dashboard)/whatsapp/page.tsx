'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function WhatsAppPage() {
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          WhatsApp
        </h1>
        <p className="text-slate-500 font-medium">Configura la conexión con la API de WhatsApp Business</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-6"
      >
        <div className="space-y-2">
          <label className="font-bold text-sm text-slate-800">Verify Token</label>
          <input
            type="text"
            defaultValue="admin@restaurant.com"
            onChange={() => setHasChanges(true)}
            className="w-full bg-[#eff4fc] border border-transparent focus:border-blue-200 rounded-lg px-4 py-3 text-sm text-slate-800 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-sm text-slate-800">Access Token</label>
          <input
            type="password"
            defaultValue="password"
            onChange={() => setHasChanges(true)}
            className="w-full bg-[#eff4fc] border border-transparent focus:border-blue-200 rounded-lg px-4 py-3 text-sm text-slate-800 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-sm text-slate-800">Phone Number ID</label>
          <input
            type="text"
            placeholder="ID del número de teléfono"
            onChange={() => setHasChanges(true)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-sm text-slate-800">WhatsApp Business Account ID</label>
          <input
            type="text"
            placeholder="ID de la cuenta de WhatsApp Business"
            onChange={() => setHasChanges(true)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all shadow-sm"
          />
        </div>

        <div className="bg-[#fcfaf9] p-6 rounded-xl border border-slate-100 mt-8">
          <label className="font-bold text-sm text-slate-800 mb-2 block">URL del Webhook</label>
          <input
            type="text"
            defaultValue="https://pedidos-realtime-5.preview.emergentagent.com/api/webhook"
            onChange={() => setHasChanges(true)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 font-mono outline-none focus:border-teal-400 transition-all shadow-sm mb-3"
          />
          <p className="text-xs text-slate-400">Usa esta URL en la configuración del webhook de Meta</p>
        </div>

        <div className="pt-4">
          <button 
            disabled={!hasChanges}
            onClick={() => setHasChanges(false)}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm border-2 border-[#25D366]",
              hasChanges 
                ? "bg-[#25D366] text-white hover:bg-[#1EBE5C] hover:border-[#1EBE5C] active:scale-95 cursor-pointer"
                : "bg-slate-50 text-slate-400 cursor-not-allowed"
            )}
          >
            <Save size={18} />
            Guardar credenciales
          </button>
        </div>

      </motion.div>
    </div>
  );
}
