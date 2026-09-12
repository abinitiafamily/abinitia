import { Pool } from 'pg'

let pool: Pool | null = null

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: 'aws-0-sa-east-1.pooler.supabase.com',
      port: 6543,
      user: 'postgres.ucvicxjvcsojpbwkydkf',
      password: process.env.abinitia_POSTGRES_PASSWORD || 'mtK4VJeTY3gcLAi7',
      database: process.env.abinitia_POSTGRES_DATABASE || 'postgres',
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    })
  }
  return pool
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const p = getDbPool()
  const res = await p.query(text, params)
  return res.rows
}
