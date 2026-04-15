-- ==========================================
-- ESQUEMA PROFESIONAL MULTIBOT (SAAS MULTI-TENANT)
-- ==========================================

-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TENANTS (Negocios)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    plan TEXT DEFAULT 'free', -- free, pro, enterprise
    status TEXT DEFAULT 'active', -- active, suspended, trial
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TENANT_USERS (Usuarios por negocio)
CREATE TABLE IF NOT EXISTS public.tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Referencia al auth.users de Supabase
    role TEXT DEFAULT 'admin', -- admin, agent, viewer
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WHATSAPP_ACCOUNTS (Cuentas conectadas)
CREATE TABLE IF NOT EXISTS public.whatsapp_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    waba_id TEXT,
    phone_number_id TEXT UNIQUE,
    display_phone_number TEXT,
    quality_rating TEXT,
    status TEXT DEFAULT 'pending', -- pending, connected, disconnected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WHATSAPP_CREDENTIALS (Tokens cifrados)
CREATE TABLE IF NOT EXISTS public.whatsapp_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    whatsapp_account_id UUID REFERENCES public.whatsapp_accounts(id) ON DELETE CASCADE,
    access_token_encrypted TEXT NOT NULL,
    token_type TEXT DEFAULT 'bearer',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AGENT_CONFIGS (El "cerebro" de cada bot)
CREATE TABLE IF NOT EXISTS public.agent_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    prompt_system TEXT,
    model TEXT DEFAULT 'gemini-1.5-flash',
    temperature FLOAT DEFAULT 0.7,
    is_active BOOLEAN DEFAULT TRUE,
    tools_enabled JSONB DEFAULT '[]'::jsonb, -- reservation, catalog, human_handoff
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. KNOWLEDGE_SOURCES (RAG / Entrenamiento)
CREATE TABLE IF NOT EXISTS public.knowledge_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- url, pdf, text, catalog
    source_url TEXT,
    file_path TEXT,
    content TEXT,
    status TEXT DEFAULT 'pending', -- pending, indexed, error
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CUSTOMERS (Clientes finales en WhatsApp)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT,
    phone TEXT NOT NULL, -- Formato E.164
    email TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, phone)
);

-- 8. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active', -- active, human_required, resolved
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    last_window_start TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- bot, customer, human
    message_type TEXT DEFAULT 'text', -- text, image, interactive
    content TEXT NOT NULL,
    meta_message_id TEXT, -- ID de Meta para tracking
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PRODUCTS (Catálogo)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    image_url TEXT,
    category TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. USAGE_METRICS (Para facturación)
CREATE TABLE IF NOT EXISTS public.usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL, -- ai_token, message_sent, message_received
    amount INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID,
    action TEXT NOT NULL, -- login, connect_whatsapp, update_agent
    resource_type TEXT,
    resource_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TRIGGERS PARA UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tu_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER wa_updated_at BEFORE UPDATE ON public.whatsapp_accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER ac_updated_at BEFORE UPDATE ON public.agent_configs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER cu_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER co_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==========================================
-- RLS (ROW LEVEL SECURITY)
-- ==========================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS (ROW LEVEL SECURITY) - POLÍTICAS DETALLADAS
-- ==========================================

-- 1. Política para tenants (Solo ver el propio)
CREATE POLICY "Users can view their own tenant" ON public.tenants
FOR SELECT USING (
    id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid())
);

-- 2. Política para tenant_users (Ver compañeros de equipo)
CREATE POLICY "Users can view team members" ON public.tenant_users
FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid())
);

-- 3. Políticas genéricas para tablas vinculadas a un tenant_id

CREATE POLICY "Tenant isolation for whatsapp_accounts" ON public.whatsapp_accounts
FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "Tenant isolation for agent_configs" ON public.agent_configs
FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "Tenant isolation for knowledge_sources" ON public.knowledge_sources
FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "Tenant isolation for customers" ON public.customers
FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "Tenant isolation for conversations" ON public.conversations
FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "Tenant isolation for messages" ON public.messages
FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "Tenant isolation for products" ON public.products
FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

-- 4. Protección especial para credenciales (Solo lectura interna/admin)
CREATE POLICY "Internal access only for credentials" ON public.whatsapp_credentials
FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));
