import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { text, voice = 'nova', speed = 1.0 } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Texto não fornecido' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OPENAI_API_KEY não configurada no servidor' },
        { status: 500 }
      )
    }

    // Limpar marcações de áudio/emojis redundantes antes de enviar para síntese
    const cleanText = text
      .replace(/🎙️.*?\]: /g, '')
      .replace(/[\*\_]/g, '')
      .trim()

    // Chamar a API oficial de TTS da OpenAI (a mesma do ChatGPT)
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: cleanText,
        voice: voice, // 'nova', 'onyx', 'alloy', 'echo', 'shimmer', 'fable'
        response_format: 'mp3',
        speed: speed,
      }),
    })

    if (!response.ok) {
      let errJson: any = null
      try {
        errJson = await response.json()
      } catch {
        // ignore
      }

      console.warn('OpenAI TTS indisponível ou sem créditos:', response.status, errJson)

      return NextResponse.json(
        {
          success: false,
          status: response.status,
          code: errJson?.error?.code || 'openai_error',
          error:
            errJson?.error?.message ||
            'Limite de créditos da chave OpenAI atingido ou serviço indisponível.',
          useFallback: true,
        },
        { status: 200 } // Retornamos 200 com flag useFallback para o frontend alternar sem estourar exception
      )
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      },
    })
  } catch (error: any) {
    console.error('Erro na rota /api/tts:', error)
    return NextResponse.json({ success: false, error: error.message, useFallback: true }, { status: 200 })
  }
}
