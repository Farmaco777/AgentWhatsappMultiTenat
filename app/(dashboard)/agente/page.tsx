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
    prompt_system: 'Eres un asistente experto para Negocios. Tu objetivo principal es tomar pedidos de forma eficiente, resolver dudas sobre el menú/productos y asegurar una experiencia fluida por WhatsApp. Sé proactivo recomendando productos adicionales (upselling) y asegúrate de capturar la información necesaria para el pedido (nombre, dirección si es domicilio).',
    model: 'gemini-1.5-flash'
  });

  const [knowledgeSources, setKnowledgeSources] = useState<any[]>([]);

  // ID del tenant real para persistencia
  const tenantId = '623a5c39-f9fd-4869-967b-3a4f6f682d52';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          type: 'url',
          source_url: urlInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setKnowledgeSources([data.data, ...knowledgeSources]);
        setUrlInput('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        setSaving(true);
        // En una app real subiríamos a Storage. Aquí registramos la fuente.
        const res = await fetch('/api/agent/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId,
            type: 'file',
            file_path: file.name
          })
        });
        const data = await res.json();
        if (data.success) {
          setKnowledgeSources(prev => [data.data, ...prev]);
        }
      } catch (err) {
        console.error('Error subiendo archivo:', err);
      } finally {
        setSaving(false);
      }
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
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm h-[76px] px-5"
              />
            </div>
            
            <div className="space-y-2 lg:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tono de Voz</label>
              <select 
                value={config.tone}
                onChange={(e) => { setConfig({...config, tone: e.target.value}); setHasChanges(true); }} 
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm h-[76px] px-5 appearance-none cursor-pointer"
              >
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
                value={config.welcome_message}
                onChange={(e) => { setConfig({...config, welcome_message: e.target.value}); setHasChanges(true); }}
                placeholder="¡Hola! Bienvenido a..."
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm h-[76px] py-4 px-5 resize-none font-medium leading-relaxed"
              />
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
          <h3 className="text-2xl font-black text-slate-800">Entrenamiento del Agente IA</h3>
        </div>

        <div className="space-y-12">
          {/* SECCIÓN DE DOCUMENTOS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Documentos de Conocimiento</label>
            
            <label className="border-2 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center group hover:border-teal-200 hover:bg-teal-50/30 transition-all cursor-pointer relative overflow-hidden">
              <input 
                type="file" 
                multiple 
                accept=".pdf,.docx,.txt,.xlsx,.xls" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
                disabled={saving}
              />
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-teal-100 group-hover:text-teal-600 transition-all">
                {saving ? <Loader2 className="animate-spin text-teal-600" /> : <Upload size={32} />}
              </div>
              <h4 className="font-bold text-slate-700">Sube archivos para entrenar</h4>
              <p className="text-sm text-slate-400 mt-1">Arrastra y suelta o haz clic para buscar en tu equipo</p>
              <p className="text-[10px] font-bold text-slate-300 mt-3">PDF, DOCX, XLSX, TXT</p>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
              <AnimatePresence>
                {knowledgeSources.filter(s => s.type === 'file').map((source) => {
                  const isExcel = source.file_path?.endsWith('.xlsx') || source.file_path?.endsWith('.xls');
                  return (
                    <motion.div 
                      key={source.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                          isExcel ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {isExcel ? <FileCode size={20} /> : <FileText size={20} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{source.file_path || 'Documento'}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Fuente de conocimiento</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeSource(source.id)} 
                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  );
                })}
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
