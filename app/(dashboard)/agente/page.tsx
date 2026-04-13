'use client';

import { useState } from 'react';
import { Save, Bot, Sparkles, MessageCircle, Cpu, Upload, FileText, FileCode, X, Link as LinkIcon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function AgentePage() {
  const [hasChanges, setHasChanges] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  return (
    <div className="space-y-8 relative">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-3">
          <Bot size={32} className="text-teal-600" />
          Configuración del Agente IA
        </h1>
        <p className="text-slate-500 font-medium mt-2">Personaliza el comportamiento, instrucciones y tono de tu asistente virtual.</p>
      </header>

      {/* Main Configuration Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100"
      >
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="space-y-2 lg:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Asistente</label>
              <input
                type="text"
                defaultValue="MenuIA"
                onChange={() => setHasChanges(true)}
                placeholder="Ej. Maria, ChefBot..."
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm py-4 px-5"
              />
            </div>
            
            <div className="space-y-2 lg:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tono de Voz</label>
              <select onChange={() => setHasChanges(true)} className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm py-4 px-5 appearance-none">
                <option value="cercano">Cercano y Amigable</option>
                <option value="cordial">Cordial y Profesional</option>
                <option value="premium">Premium y Exclusivo</option>
                <option value="rapido">Rápido y Directo</option>
              </select>
            </div>

            <div className="space-y-2 lg:col-span-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                Mensaje de Bienvenida
                <MessageCircle size={14} className="text-teal-500" />
              </label>
              <textarea
                rows={2}
                defaultValue="¡Hola! Bienvenido a Mi Restaurante. ¿En qué puedo ayudarte hoy?"
                onChange={() => setHasChanges(true)}
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm py-3 px-5 resize-none leading-relaxed h-full min-h-[56px]"
              />
              <p className="text-[9px] text-slate-400 font-bold ml-1">Se enviará la primera vez.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              Instrucciones Base (Prompt Técnico)
              <Sparkles size={14} className="text-[#25D366]" />
            </label>
            <textarea
              rows={6}
              defaultValue="Eres un asistente experto para Negocios. Tu objetivo principal es tomar pedidos de forma eficiente, resolver dudas sobre el menú/productos y asegurar una experiencia fluida por WhatsApp. Sé proactivo recomendando productos adicionales (upselling) y asegúrate de capturar la información necesaria para el pedido (nombre, dirección si es domicilio)."
              onChange={() => setHasChanges(true)}
              className="w-full bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-[#25D366]/5 text-sm py-5 px-6 resize-none leading-relaxed font-medium text-slate-700"
            />
          </div>


          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              disabled={!hasChanges}
              onClick={() => setHasChanges(false)}
              className={cn(
                "px-8 py-4 rounded-[2rem] border-2 border-[#25D366] font-black transition-all flex items-center gap-3",
                hasChanges
                  ? "bg-[#25D366] text-white shadow-xl shadow-[#25D366]/20 hover:bg-[#1EBE5C] active:scale-95"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Save size={20} />
              Guardar Configuración
            </button>
          </div>

        </div>
      </motion.div>


      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-[1.5rem] bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
            <Cpu size={28} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Entrenamiento del Agente IA</h3>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Documentos de Conocimiento</label>
            </div>

            <label className="border-2 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center group hover:border-teal-200 hover:bg-teal-50/30 transition-all cursor-pointer relative overflow-hidden">
              <input type="file" multiple accept=".pdf,.docx,.xlsx,.txt" onChange={() => setHasChanges(true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-teal-100 group-hover:text-teal-600 transition-all">
                <Upload size={32} />
              </div>
              <h4 className="font-bold text-slate-700">Sube archivos para entrenar</h4>
              <p className="text-sm text-slate-400 mt-1">Arrastra y suelta o haz clic para buscar en tu equipo</p>
              <p className="text-[10px] font-bold text-slate-300 mt-3">PDF, DOCX, XLSX, TXT</p>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={16} /></div>
                  <span className="text-xs font-bold text-slate-600">Menu_Temporada_2024.pdf</span>
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg"><FileCode size={16} /></div>
                  <span className="text-xs font-bold text-slate-600">Precios_Inventario.xlsx</span>
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fuentes Web y Menús Digitales</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://tu-restaurante.com/menu"
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
              <button 
                disabled={!urlInput}
                onClick={() => setUrlInput('')}
                className={cn(
                  "px-6 py-4 rounded-2xl border-2 border-[#25D366] font-bold transition-all",
                  urlInput
                    ? "bg-[#25D366] text-white shadow-md shadow-[#25D366]/20 hover:bg-[#1EBE5C] cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full border border-teal-100">
                <Globe size={14} />
                <span className="text-[10px] font-bold">laboheme.co/carta</span>
                <button className="hover:text-teal-900"><X size={12} /></button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
