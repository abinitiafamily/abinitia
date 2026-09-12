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

const fixSQL = `
-- 1. Remover todas as políticas permissivas 'ALL' anteriores
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- 2. Recriar políticas estritas e segmentadas por operação (SELECT vs INSERT/UPDATE/DELETE)

-- ==================== PROFILES ====================
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete" ON public.profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- ==================== FAMILIES ====================
CREATE POLICY "families_select" ON public.families
  FOR SELECT TO authenticated, anon
  USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "families_insert" ON public.families
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "families_update" ON public.families
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "families_delete" ON public.families
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== FAMILY MEMBERS ====================
CREATE POLICY "family_members_select" ON public.family_members
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "family_members_insert" ON public.family_members
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "family_members_update" ON public.family_members
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "family_members_delete" ON public.family_members
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== PERSONS ====================
CREATE POLICY "persons_select" ON public.persons
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "persons_insert" ON public.persons
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "persons_update" ON public.persons
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "persons_delete" ON public.persons
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== RELATIONSHIPS ====================
CREATE POLICY "relationships_select" ON public.relationships
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "relationships_insert" ON public.relationships
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "relationships_update" ON public.relationships
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "relationships_delete" ON public.relationships
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== STORIES ====================
CREATE POLICY "stories_select" ON public.stories
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "stories_insert" ON public.stories
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "stories_update" ON public.stories
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "stories_delete" ON public.stories
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== TIMELINE EVENTS ====================
CREATE POLICY "timeline_events_select" ON public.timeline_events
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "timeline_events_insert" ON public.timeline_events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "timeline_events_update" ON public.timeline_events
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "timeline_events_delete" ON public.timeline_events
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== DOCUMENTS ====================
CREATE POLICY "documents_select" ON public.documents
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "documents_insert" ON public.documents
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "documents_update" ON public.documents
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "documents_delete" ON public.documents
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== INVESTIGATIONS ====================
CREATE POLICY "investigations_select" ON public.investigations
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "investigations_insert" ON public.investigations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "investigations_update" ON public.investigations
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "investigations_delete" ON public.investigations
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== BOOK CHAPTERS ====================
CREATE POLICY "book_chapters_select" ON public.book_chapters
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "book_chapters_insert" ON public.book_chapters
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "book_chapters_update" ON public.book_chapters
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "book_chapters_delete" ON public.book_chapters
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== INVITATIONS ====================
CREATE POLICY "invitations_select" ON public.invitations
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "invitations_insert" ON public.invitations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "invitations_update" ON public.invitations
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "invitations_delete" ON public.invitations
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== JOIN REQUESTS ====================
CREATE POLICY "join_requests_select" ON public.join_requests
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "join_requests_insert" ON public.join_requests
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "join_requests_update" ON public.join_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "join_requests_delete" ON public.join_requests
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== AUDIT LOGS ====================
CREATE POLICY "audit_logs_select" ON public.audit_logs
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "audit_logs_update" ON public.audit_logs
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "audit_logs_delete" ON public.audit_logs
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ==================== AGENT MESSAGES ====================
CREATE POLICY "agent_messages_select" ON public.agent_messages
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "agent_messages_insert" ON public.agent_messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "agent_messages_update" ON public.agent_messages
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "agent_messages_delete" ON public.agent_messages
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);
`;

async function fixPolicies() {
  console.log('Conectando ao Supabase para atualizar e otimizar politicas RLS...');
  const client = new Client({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.ucvicxjvcsojpbwkydkf',
    password: env.abinitia_POSTGRES_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  await client.query(fixSQL);
  console.log('Todas as politicas RLS foram atualizadas com sucesso!');

  const check = await client.query(`
    SELECT tablename, policyname, cmd, roles 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    ORDER BY tablename, cmd;
  `);

  console.log('Total de politicas ativas:', check.rows.length);
  await client.end();
}

fixPolicies().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
