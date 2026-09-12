import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const families = await query('SELECT id, name, surname, origin, motto FROM public.families ORDER BY name ASC')
    const personsCount = await query('SELECT count(*)::int as count FROM public.persons')
    
    return NextResponse.json({
      status: 'online',
      database: 'Supabase PostgreSQL',
      timestamp: new Date().toISOString(),
      stats: {
        familiesCount: families.length,
        personsCount: personsCount[0]?.count || 0
      },
      families
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err.message },
      { status: 500 }
    )
  }
}
