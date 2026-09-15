import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      familyId = 'd0100000-0000-0000-0000-000000000001',
      people = [],
      dates = [],
      places = [],
      events = [],
    } = body

    let insertedPeople = 0
    let insertedEvents = 0

    // Inserir pessoas extraídas que tenham nome
    for (const p of people) {
      if (!p || typeof p !== 'string') continue
      // Extrair nome (ex: "Matteo Ferraro (Salerno)" -> firstName: "Matteo", lastName: "Ferraro")
      const clean = p.replace(/\(.*?\)/g, '').trim()
      const parts = clean.split(' ')
      const firstName = parts[0] || 'Desconhecido'
      const lastName = parts.slice(1).join(' ') || 'Ferraro'

      const existing = await query(
        `SELECT id FROM persons WHERE family_id = $1 AND LOWER(first_name) = LOWER($2) AND LOWER(last_name) = LOWER($3) LIMIT 1`,
        [familyId, firstName, lastName]
      )

      if (existing.length === 0) {
        await query(
          `INSERT INTO persons (family_id, first_name, last_name, evidence_status, notes)
           VALUES ($1, $2, $3, 'REPORTED', $4)`,
          [familyId, firstName, lastName, `Identificado pelo Agente Genealogista a partir de relatos orais (${p})`]
        )
        insertedPeople++
      }
    }

    // Inserir eventos extraídos
    for (const ev of events) {
      if (!ev || typeof ev !== 'string') continue
      await query(
        `INSERT INTO timeline_events (family_id, title, date, type, evidence_status, description)
         VALUES ($1, $2, $3, 'OTHER', 'REPORTED', $4)`,
        [familyId, ev, dates[0] || '1900', `Fato extraído pelo Agente de Memória. Locais associados: ${places.join(', ') || 'Não especificado'}`]
      )
      insertedEvents++
    }

    return NextResponse.json({
      success: true,
      insertedPeople,
      insertedEvents,
      message: `${insertedPeople} nova(s) pessoa(s) e ${insertedEvents} novo(s) marco(s) integrados à árvore no banco de dados!`,
    })
  } catch (error: any) {
    console.error('Erro ao integrar fatos do agente ao BD:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
