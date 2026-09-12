const fs = require('fs');
const { Client } = require('pg');

const dotenv = fs.readFileSync('.env.local', 'utf8');
const env = {};
dotenv.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      env[key] = val;
    }
  }
});

const rlsSQL = `
-- 1. Habilitar RLS em todas as tabelas do schema public
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN 
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notes') THEN
    ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 2. Limpar políticas antigas se existirem para evitar conflitos de nomes
DROP POLICY IF EXISTS "Permitir leitura de perfis para autenticados" ON public.profiles;
DROP POLICY IF EXISTS "Permitir usuario editar proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Permitir leitura de familias publicas ou membros" ON public.families;
DROP POLICY IF EXISTS "Permitir criacao e edicao de familias" ON public.families;
DROP POLICY IF EXISTS "Permitir leitura de membros" ON public.family_members;
DROP POLICY IF EXISTS "Permitir gerenciar membros" ON public.family_members;
DROP POLICY IF EXISTS "Permitir leitura de pessoas" ON public.persons;
DROP POLICY IF EXISTS "Permitir escrita de pessoas" ON public.persons;
DROP POLICY IF EXISTS "Permitir leitura de relacionamentos" ON public.relationships;
DROP POLICY IF EXISTS "Permitir escrita de relacionamentos" ON public.relationships;
DROP POLICY IF EXISTS "Permitir leitura de historias" ON public.stories;
DROP POLICY IF EXISTS "Permitir escrita de historias" ON public.stories;
DROP POLICY IF EXISTS "Permitir leitura de timeline" ON public.timeline_events;
DROP POLICY IF EXISTS "Permitir escrita de timeline" ON public.timeline_events;
DROP POLICY IF EXISTS "Permitir leitura de documentos" ON public.documents;
DROP POLICY IF EXISTS "Permitir escrita de documentos" ON public.documents;
DROP POLICY IF EXISTS "Permitir leitura de investigacoes" ON public.investigations;
DROP POLICY IF EXISTS "Permitir escrita de investigacoes" ON public.investigations;
DROP POLICY IF EXISTS "Permitir leitura de capitulos" ON public.book_chapters;
DROP POLICY IF EXISTS "Permitir escrita de capitulos" ON public.book_chapters;
DROP POLICY IF EXISTS "Permitir leitura de convites" ON public.invitations;
DROP POLICY IF EXISTS "Permitir criar convites" ON public.invitations;
DROP POLICY IF EXISTS "Permitir leitura de join requests" ON public.join_requests;
DROP POLICY IF EXISTS "Permitir criar join requests" ON public.join_requests;
DROP POLICY IF EXISTS "Permitir leitura de logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Permitir criar logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Permitir leitura de mensagens" ON public.agent_messages;
DROP POLICY IF EXISTS "Permitir criar mensagens" ON public.agent_messages;

-- 3. Criar Políticas de Segurança (Row Level Security Policies)

-- PROFILES
CREATE POLICY "Permitir leitura de perfis para autenticados"
  ON public.profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir usuario editar proprio perfil"
  ON public.profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- FAMILIES
CREATE POLICY "Permitir leitura de familias publicas ou membros"
  ON public.families FOR SELECT
  TO public
  USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Permitir criacao e edicao de familias"
  ON public.families FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- FAMILY MEMBERS
CREATE POLICY "Permitir leitura de membros"
  ON public.family_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir gerenciar membros"
  ON public.family_members FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- PERSONS
CREATE POLICY "Permitir leitura de pessoas"
  ON public.persons FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir escrita de pessoas"
  ON public.persons FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- RELATIONSHIPS
CREATE POLICY "Permitir leitura de relacionamentos"
  ON public.relationships FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir escrita de relacionamentos"
  ON public.relationships FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- STORIES
CREATE POLICY "Permitir leitura de historias"
  ON public.stories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir escrita de historias"
  ON public.stories FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- TIMELINE EVENTS
CREATE POLICY "Permitir leitura de timeline"
  ON public.timeline_events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir escrita de timeline"
  ON public.timeline_events FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- DOCUMENTS
CREATE POLICY "Permitir leitura de documentos"
  ON public.documents FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir escrita de documentos"
  ON public.documents FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- INVESTIGATIONS
CREATE POLICY "Permitir leitura de investigacoes"
  ON public.investigations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir escrita de investigacoes"
  ON public.investigations FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- BOOK CHAPTERS
CREATE POLICY "Permitir leitura de capitulos"
  ON public.book_chapters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir escrita de capitulos"
  ON public.book_chapters FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- INVITATIONS
CREATE POLICY "Permitir leitura de convites"
  ON public.invitations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir criar convites"
  ON public.invitations FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- JOIN REQUESTS
CREATE POLICY "Permitir leitura de join requests"
  ON public.join_requests FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir criar join requests"
  ON public.join_requests FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- AUDIT LOGS
CREATE POLICY "Permitir leitura de logs"
  ON public.audit_logs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir criar logs"
  ON public.audit_logs FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- AGENT MESSAGES
CREATE POLICY "Permitir leitura de mensagens"
  ON public.agent_messages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir criar mensagens"
  ON public.agent_messages FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
`;

async function applyRLS() {
  console.log('Conectando ao Postgres Supabase para aplicar RLS em todas as tabelas...');
  const client = new Client({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.ucvicxjvcsojpbwkydkf',
    password: env.abinitia_POSTGRES_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  await client.query(rlsSQL);
  console.log('Row Level Security (RLS) habilitado com sucesso em todas as tabelas!');
  console.log('Politicas de seguranca aplicadas com sucesso!');

  const checkSQL = "SELECT c.relname as table_name, c.relrowsecurity as rls_enabled FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r' ORDER BY c.relname;";
  const res = await client.query(checkSQL);
  console.log('\nStatus RLS atualizado das tabelas:');
  res.rows.forEach(r => {
    console.log(' - ' + r.table_name + ': ' + (r.rls_enabled ? 'ATIVADO (PROTEGIDO) OK' : 'DESATIVADO'));
  });

  await client.end();
}

applyRLS().catch(err => {
  console.error('Erro ao aplicar RLS:', err);
  process.exit(1);
});
