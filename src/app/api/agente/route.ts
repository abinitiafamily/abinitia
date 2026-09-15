import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const familyId = searchParams.get('familyId') || 'd0100000-0000-0000-0000-000000000001'

    const rows = await query(
      `SELECT id, role, content, audio_url, extracted_data, created_at 
       FROM agent_messages 
       WHERE family_id = $1 
       ORDER BY created_at ASC`,
      [familyId]
    )

    return NextResponse.json({ success: true, messages: rows })
  } catch (error: any) {
    console.error('Erro ao buscar mensagens do agente:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      familyId = 'd0100000-0000-0000-0000-000000000001',
      userId,
      role = 'user',
      content,
      audioUrl,
      extractedData,
    } = body

    if (!content && !audioUrl) {
      return NextResponse.json({ success: false, error: 'Conteúdo ou áudio obrigatório' }, { status: 400 })
    }

    const rows = await query(
      `INSERT INTO agent_messages (family_id, user_id, role, content, audio_url, extracted_data)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, family_id, role, content, audio_url, extracted_data, created_at`,
      [
        familyId,
        userId || null,
        role,
        content,
        audioUrl || null,
        extractedData ? JSON.stringify(extractedData) : null,
      ]
    )

    return NextResponse.json({ success: true, message: rows[0] })
  } catch (error: any) {
    console.error('Erro ao salvar mensagem do agente no BD:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
