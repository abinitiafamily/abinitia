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

const schemaSQL = `
-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (Users public data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAMILIES
CREATE TABLE IF NOT EXISTS public.families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  description TEXT,
  origin TEXT,
  symbol TEXT,
  motto TEXT,
  is_public BOOLEAN DEFAULT false,
  admin_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAMILY MEMBERS
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID,
  person_id UUID,
  role TEXT NOT NULL DEFAULT 'CONTRIBUTOR',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERSONS
CREATE TABLE IF NOT EXISTS public.persons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  aliases TEXT[] DEFAULT '{}',
  birth_date TEXT,
  birth_place TEXT,
  death_date TEXT,
  death_place TEXT,
  gender CHAR(1),
  occupation TEXT,
  nationality TEXT,
  notes TEXT,
  user_id UUID,
  photos TEXT[] DEFAULT '{}',
  evidence_status TEXT DEFAULT 'REPORTED',
  created_by_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RELATIONSHIPS
CREATE TABLE IF NOT EXISTS public.relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  person_a_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  person_b_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  evidence_status TEXT DEFAULT 'REPORTED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STORIES
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  original_content TEXT,
  author_id UUID,
  associated_person_ids UUID[] DEFAULT '{}',
  associated_event_ids UUID[] DEFAULT '{}',
  audio_url TEXT,
  transcription TEXT,
  visibility TEXT DEFAULT 'FAMILY',
  evidence_status TEXT DEFAULT 'REPORTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TIMELINE EVENTS
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  date_approx TEXT,
  type TEXT NOT NULL,
  person_ids UUID[] DEFAULT '{}',
  location TEXT,
  evidence_status TEXT DEFAULT 'REPORTED',
  is_historical_context BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOCUMENTS & ARCHIVE
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  transcription TEXT,
  date TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVESTIGATIONS
CREATE TABLE IF NOT EXISTS public.investigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  person_target TEXT,
  status TEXT DEFAULT 'OPEN',
  hypotheses TEXT,
  findings TEXT,
  sources TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOK CHAPTERS
CREATE TABLE IF NOT EXISTS public.book_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  chapter_order INT DEFAULT 0,
  generation_from INT,
  generation_to INT,
  branch_id TEXT,
  status TEXT DEFAULT 'DRAFT',
  story_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVITATIONS
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  created_by_id UUID,
  target_person_id UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'PENDING',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOIN REQUESTS
CREATE TABLE IF NOT EXISTS public.join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  target_person_id UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  message TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AGENT CONVERSATION MESSAGES
CREATE TABLE IF NOT EXISTS public.agent_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  audio_url TEXT,
  extracted_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_persons_family_id ON public.persons(family_id);
CREATE INDEX IF NOT EXISTS idx_relationships_family_id ON public.relationships(family_id);
CREATE INDEX IF NOT EXISTS idx_stories_family_id ON public.stories(family_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_family_id ON public.timeline_events(family_id);
CREATE INDEX IF NOT EXISTS idx_documents_family_id ON public.documents(family_id);
CREATE INDEX IF NOT EXISTS idx_investigations_family_id ON public.investigations(family_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_family_id ON public.audit_logs(family_id);
`;

async function runMigration() {
  console.log('Iniciando migracao do schema no Supabase...');
  const client = new Client({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.ucvicxjvcsojpbwkydkf',
    password: env.abinitia_POSTGRES_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Conectado ao Supabase!');

  await client.query(schemaSQL);
  console.log('Todas as 14 tabelas e indices foram criados com sucesso!');

  const queryCheck = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;";
  const res = await client.query(queryCheck);
  
  console.log('Tabelas no schema public:');
  res.rows.forEach(r => console.log(' - ' + r.table_name));

  await client.end();
  console.log('Migracao finalizada com sucesso!');
}

runMigration().catch(err => {
  console.error('Erro na migracao:', err);
  process.exit(1);
});
