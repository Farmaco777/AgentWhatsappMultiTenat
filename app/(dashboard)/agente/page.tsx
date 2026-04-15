'use client';

import { useState, useEffect } from 'react';
import { Save, Bot, Sparkles, MessageCircle, Cpu, Upload, FileText, FileCode, X, Link as LinkIcon, Globe, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function AgentePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  const [config, setConfig] = useState({
    name: 'MultiBot Agent',
    tone: 'cordial',
    welcome_message: '¡Hola! ¿En qué puedo ayudarte hoy?',
    prompt_system: '',
    model: 'gemini-1.5-flash'
  });

  const [knowledgeSources, setKnowledgeSources] = useState<any[]>([]);

  // TODO: Obtener el tenantId real de la sesión de Auth
  const tenantId = 'EL_ID_DEL_TENANT_ACTUAL';

  useEffect(() => {
    async function loadData() {
      try {
        const [configRes, knowledgeRes] = await Promise.all([
          fetch(`/api/agent/config?tenantId=${tenantId}`),
          fetch(`/api/agent/knowledge?tenantId=${tenantId}`)
        ]);

        const configData = await configRes.json();
        const knowledgeData = await knowledgeRes.json();

        if (configData.id) {
          setConfig({
            name: configData.name || 'Agent',
            tone: configData.tone || 'cordial',
            welcome_message: configData.welcome_message || '¡Hola!',
            prompt_system: configData.prompt_system || '',
            model: configData.model || 'gemini-1.5-flash'
          });
        }
        setKnowledgeSources(knowledgeData);
      } catch (e) {
        console.error('Error cargando datos del agente:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tenantId]);

  const saveConfig = async () => {
    setSaving(true);
    try {
      await fetch('/api/agent/config', {
        method: 'POST',
        body: JSON.stringify({
          tenantId,
          ...config
        })
      });
      setHasChanges(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const addKnowledgeSource = async () => {
    if (!urlInput) return;
    try {
      const res = await fetch('/api/agent/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          tenantId,
          type: 'url',
          source_url: urlInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setKnowledgeSources([...knowledgeSources, data.data]);
        setUrlInput('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeSource = async (id: string) => {
    try {
      await fetch(`/api/agent/knowledge?id=${id}`, { method: 'DELETE' });
      setKnowledgeSources(knowledgeSources.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative pb-20">
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
                value={config.name}
                onChange={(e) => { setConfig({...config, name: e.target.value}); setHasChanges(true); }}
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm py-4 px-5"
              />
            </div>
            
            <div className="space-y-2 lg:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tono de Voz</label>
              <select 
                value={config.tone}
                onChange={(e) => { setConfig({...config, tone: e.target.value}); setHasChanges(true); }} 
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm py-4 px-5 appearance-none"
              >
                <option value="cercano">Cercano y Amigable</option>
                <option value="cordial">Cordial y Profesional</option>
                <option value="premium">Premium y Exclusivo</option>
                <option value="rapido">Rápido y Directo</option>
              </select>
            </div>

            <div className="space-y-2 lg:col-span-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                Modelo de Inteligencia
                <Cpu size={14} className="text-teal-500" />
              </label>
              <select 
                value={config.model}
                onChange={(e) => { setConfig({...config, model: e.target.value}); setHasChanges(true); }} 
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm py-4 px-5 appearance-none"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Rápido)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Razonamiento Complejo)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              Instrucciones Base (Prompt Técnico)
              <Sparkles size={14} className="text-[#25D366]" />
            </label>
            <textarea
              rows={6}
              value={config.prompt_system}
              onChange={(e) => { setConfig({...config, prompt_system: e.target.value}); setHasChanges(true); }}
              placeholder="Describe cómo debe actuar tu bot..."
              className="w-full bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-[#25D366]/5 text-sm py-5 px-6 resize-none leading-relaxed font-medium text-slate-700"
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              disabled={!hasChanges || saving}
              onClick={saveConfig}
              className={cn(
                "px-8 py-4 rounded-[2rem] border-2 border-[#25D366] font-black transition-all flex items-center gap-3",
                hasChanges && !saving
                  ? "bg-[#25D366] text-white shadow-xl shadow-[#25D366]/20 hover:bg-[#1EBE5C] active:scale-95 cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {saving ? 'Guardando...' : 'Guardar Configuración'}
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
          <h3 className="text-2xl font-black text-slate-800">Entrenamiento del Agente IA (RAG)</h3>
        </div>

        <div className="space-y-12">
          {/* SECCIÓN DE DOCUMENTOS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Documentos de Conocimiento</label>
            
            <label className="border-2 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center group hover:border-teal-200 hover:bg-teal-50/30 transition-all cursor-pointer relative overflow-hidden">
              <input type="file" multiple accept=".pdf,.docx,.txt" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={() => alert('Próximamente: Integración con Supabase Storage')} />
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-teal-100 group-hover:text-teal-600 transition-all">
                <Upload size={32} />
              </div>
              <h4 className="font-bold text-slate-700">Sube archivos para entrenar</h4>
              <p className="text-sm text-slate-400 mt-1">Arrastra y suelta o haz clic para buscar en tu equipo</p>
              <p className="text-[10px] font-bold text-slate-300 mt-3">PDF, DOCX, TXT</p>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnimatePresence>
                {knowledgeSources.filter(s => s.type === 'file').map((source) => (
                  <motion.div 
                    key={source.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={16} /></div>
                      <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{source.file_path || 'Documento'}</span>
                    </div>
                    <button onClick={() => removeSource(source.id)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <hr className="border-slate-50" />

          {/* SECCIÓN DE URLS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fuentes Web y Menús Digitales</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://tu-negocio.com/ayuda"
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
              <button 
                disabled={!urlInput}
                onClick={addKnowledgeSource}
                className={cn(
                  "px-6 py-4 rounded-2xl border-2 border-[#25D366] font-bold transition-all whitespace-nowrap",
                  urlInput
                    ? "bg-[#25D366] text-white shadow-md shadow-[#25D366]/20 hover:bg-[#1EBE5C] cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                Agregar Fuente
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <AnimatePresence>
                {knowledgeSources.filter(s => s.type === 'url').map((source) => (
                  <motion.div 
                    key={source.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full border border-teal-100"
                  >
                    <Globe size={14} />
                    <span className="text-[10px] font-bold truncate max-w-[200px]">{source.source_url}</span>
                    <button onClick={() => removeSource(source.id)} className="hover:text-teal-900"><X size={12} /></button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
