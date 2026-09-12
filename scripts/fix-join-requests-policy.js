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

const sql = `
DROP POLICY IF EXISTS "join_requests_insert" ON public.join_requests;

CREATE POLICY "join_requests_insert" ON public.join_requests
  FOR INSERT TO authenticated, anon
  WITH CHECK (
    user_email IS NOT NULL 
    AND length(trim(user_email)) > 3 
    AND user_name IS NOT NULL 
    AND length(trim(user_name)) > 0
    AND (status IS NULL OR status = 'PENDING')
  );
`;

async function fixJoinRequestPolicy() {
  console.log('Aplicando correcao na politica join_requests_insert...');
  const client = new Client({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.ucvicxjvcsojpbwkydkf',
    password: env.abinitia_POSTGRES_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  await client.query(sql);
  console.log('Politica join_requests_insert atualizada com validacao estrita!');

  const check = await client.query(`
    SELECT tablename, policyname, cmd, with_check 
    FROM pg_policies 
    WHERE tablename = 'join_requests' AND policyname = 'join_requests_insert';
  `);
  console.log('Check atual:', check.rows[0]);

  await client.end();
}

fixJoinRequestPolicy().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
