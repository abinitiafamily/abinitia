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

console.log('Conectando via Supabase Pooler IPv4...');
const client = new Client({
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.ucvicxjvcsojpbwkydkf',
  password: env.abinitia_POSTGRES_PASSWORD,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('SUCCESS: Conectado com sucesso ao Postgres Supabase!');
    return client.query('SELECT NOW() as current_time, version()');
  })
  .then(res => {
    console.log('Time:', res.rows[0].current_time);
    console.log('Postgres:', res.rows[0].version);
    return client.end();
  })
  .then(() => {
    console.log('Conexao encerrada normalmente.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err.message);
    process.exit(1);
  });
