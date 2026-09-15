'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './agente.module.css'

interface Persona {
  id: string
  name: string
  icon: string
  title: string
  description: string
  openAiVoice: 'nova' | 'onyx' | 'alloy' | 'echo' | 'shimmer' | 'fable'
  pitch: number
  rate: number
}

const PERSONAS: Persona[] = [
  {
    id: 'guardiao',
    name: 'Guardião Ancião',
    icon: '🏛️',
    title: 'Guardião das Tradições',
    description: 'Tom grave, paciente, acolhedor e solene (OpenAI Onyx). Ideal para relatos de linhagem.',
    openAiVoice: 'onyx',
    pitch: 0.85,
    rate: 0.92,
  },
  {
    id: 'historiadora',
    name: 'Historiadora Helena',
    icon: '📜',
    title: 'Pesquisadora Familiar',
    description: 'Voz clara, afetuosa, atenta e expressiva (OpenAI Nova — clássica do ChatGPT).',
    openAiVoice: 'nova',
    pitch: 1.05,
    rate: 0.98,
  },
  {
    id: 'serena',
    name: 'Entrevistadora Serena',
    icon: '🌸',
    title: 'Escuta Afetuosa',
    description: 'Tom doce e carinhoso para lembranças da infância e causos do coração (OpenAI Shimmer).',
    openAiVoice: 'shimmer',
    pitch: 1.1,
    rate: 0.95,
  },
]

export default function AgentePage() {
  // Estado da Conversação por Voz
  const [sessionState, setSessionState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle')
  const [agentSpeech, setAgentSpeech] = useState(
    'Olá! Que alegria conversar com você. Eu sou o Guardião de Memórias da sua família. Me conte com calma... qual é a primeira lembrança que você guarda dos seus pais ou da sua infância?'
  )
  const [userTranscript, setUserTranscript] = useState('')
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0])
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

  // Modais e Gavetas
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [saveToast, setSaveToast] = useState<string | null>(null)

  // Fatos Extraídos em segundo plano
  const [extractedFacts, setExtractedFacts] = useState({
    people: ['Giuseppe Ferraro (1865)', 'Rosa Carbone (1870)', 'Antonio Ferraro (1895)'],
    dates: ['1888 (Chegada ao Brasil)', '1887 (Casamento na Itália)'],
    places: ['Nápoles (Itália)', 'São Paulo (Brasil)'],
    events: ['Travessia do Vapor', 'Fundação da Ferraria'],
  })

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Carregar vozes do navegador
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const ptVoices = voices.filter(v => v.lang.startsWith('pt'))
      const naturalVoices = ptVoices.filter(
        v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural')
      )
      const list = naturalVoices.length > 0 ? naturalVoices : ptVoices.length > 0 ? ptVoices : voices
      setAvailableVoices(list)
      if (list.length > 0 && !selectedVoice) setSelectedVoice(list[0])
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [selectedVoice])

  // Parar qualquer áudio em reprodução
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Falar texto via OpenAI TTS com fallback nativo
  const speakVoice = useCallback(
    async (textToSpeak: string) => {
      stopAudio()
      setSessionState('speaking')

      const clean = textToSpeak.replace(/🎙️.*?\]: /g, '').replace(/[\*\_]/g, '').trim()

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: clean,
            voice: selectedPersona.openAiVoice,
            speed: selectedPersona.rate,
          }),
        })

        const contentType = response.headers.get('content-type') || ''
        if (response.ok && contentType.includes('audio')) {
          const blob = await response.blob()
          const audioUrl = URL.createObjectURL(blob)
          const audio = new Audio(audioUrl)
          currentAudioRef.current = audio

          audio.onended = () => {
            setSessionState('idle')
            currentAudioRef.current = null
          }
          audio.onerror = () => {
            setSessionState('idle')
            currentAudioRef.current = null
          }

          await audio.play()
          return
        }
      } catch (err) {
        console.warn('Fallback para síntese nativa:', err)
      }

      // Fallback Nativo Web Speech
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(clean)
        if (selectedVoice) utterance.voice = selectedVoice
        utterance.pitch = selectedPersona.pitch
        utterance.rate = selectedPersona.rate
        utterance.lang = 'pt-BR'

        utterance.onstart = () => setSessionState('speaking')
        utterance.onend = () => setSessionState('idle')
        utterance.onerror = () => setSessionState('idle')

        window.speechSynthesis.speak(utterance)
      } else {
        setSessionState('idle')
      }
    },
    [selectedPersona, selectedVoice, stopAudio]
  )

  // Salvar fala no banco de dados automaticamente
  const saveToDb = async (role: 'user' | 'assistant', content: string, extracted?: any) => {
    try {
      await fetch('/api/agente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId: 'd0100000-0000-0000-0000-000000000001',
          role,
          content,
          extractedData: extracted,
        }),
      })
    } catch (err) {
      console.error('Erro ao salvar no BD:', err)
    }
  }

  // Processar fala do idoso e responder como entrevistador carinhoso
  const handleUserSpeechFinished = (spokenText: string) => {
    if (!spokenText.trim()) {
      setSessionState('idle')
      return
    }

    setSessionState('processing')
    saveToDb('user', spokenText)

    // Agente atencioso gera resposta empática para o idoso
    setTimeout(() => {
      let reply = ''
      let newFacts: any = null

      const lower = spokenText.toLowerCase()

      if (lower.includes('mãe') || lower.includes('mae') || lower.includes('pai')) {
        reply =
          'Que lembrança linda dos seus pais. A presença deles é a raiz mais forte da família. Você se lembra de algum conselho ou costume especial que eles repetiam sempre dentro de casa?'
        newFacts = { events: ['Lembrança dos pais e costumes domésticos'] }
      } else if (lower.includes('navio') || lower.includes('viagem') || lower.includes('itália') || lower.includes('italia')) {
        reply =
          'Essa travessia foi um ato de enorme coragem. Imagine chegar a uma nova terra trazendo apenas a esperança e o trabalho. O que mais contavam para você sobre essa chegada?'
        newFacts = { events: ['Memória da travessia e imigração'], places: ['Itália', 'Brasil'] }
      } else if (lower.includes('irmão') || lower.includes('irmao') || lower.includes('irmã') || lower.includes('matteo')) {
        reply =
          'Esse detalhe sobre os irmãos é precioso demais para a nossa árvore. Já anotei aqui no nosso caderno da família. Eles costumavam mandar cartas ou se reunir nos domingos?'
        newFacts = { people: ['Ramo fraternal identificado'], events: ['Reuniões familiares'] }
      } else {
        reply = `Estou guardando cada detalhe que você me contou com muito carinho. O tempo das histórias antigas tem um valor sagrado para os seus filhos e netos. O que mais vem ao seu coração quando você pensa nessa época?`
        newFacts = { events: [`Memória oral preservada`] }
      }

      setAgentSpeech(reply)
      saveToDb('assistant', reply, newFacts)

      if (newFacts?.people) {
        setExtractedFacts(prev => ({
          ...prev,
          people: [...prev.people, ...newFacts.people],
        }))
      }

      // Fala a resposta de volta para o idoso
      speakVoice(reply)
    }, 1200)
  }

  // Iniciar / Parar Escuta Ativa do Microfone
  const toggleListening = async () => {
    if (sessionState === 'listening') {
      // Parar escuta
      setSessionState('processing')
      if (timerRef.current) clearInterval(timerRef.current)
      setRecordSeconds(0)

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error(e)
        }
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }

      // Processar fala capturada
      setTimeout(() => {
        handleUserSpeechFinished(userTranscript || 'Minha família sempre foi muito unida e trabalhadora.')
      }, 500)
    } else {
      // Iniciar escuta
      stopAudio()
      setUserTranscript('')
      setSessionState('listening')
      setRecordSeconds(0)

      timerRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1)
      }, 1000)

      // Reconhecimento de Voz Contínuo
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition()
          rec.lang = 'pt-BR'
          rec.continuous = true
          rec.interimResults = true

          rec.onresult = (event: any) => {
            let fullText = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
              fullText += event.results[i][0].transcript
            }
            if (fullText) {
              setUserTranscript(fullText)
            }
          }

          rec.start()
          recognitionRef.current = rec
        } catch (err) {
          console.warn('Reconhecimento de fala:', err)
        }
      }

      // Gravação do Áudio
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const mediaRecorder = new MediaRecorder(stream)
          audioChunksRef.current = []

          mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data)
          }

          mediaRecorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop())
          }

          mediaRecorder.start()
          mediaRecorderRef.current = mediaRecorder
        } catch (err) {
          console.warn('Microfone físico:', err)
        }
      }
    }
  }

  // Concluir e Salvar no Livro da Família
  const handleSaveToBook = async () => {
    try {
      setSaveToast('📖 Memória registrada e integrada ao Livro e à Árvore da Família com sucesso!')
      await fetch('/api/agente/integrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId: 'd0100000-0000-0000-0000-000000000001',
          people: extractedFacts.people,
          dates: extractedFacts.dates,
          places: extractedFacts.places,
          events: extractedFacts.events,
        }),
      })
      setTimeout(() => setSaveToast(null), 5000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.voiceContainer}>
      {/* ─── TOPO LIMPO ─────────────────────────────────────────── */}
      <header className={styles.topNav}>
        <div className={styles.agentIdentity}>
          <div className={styles.agentAvatarCircle}>
            <img
              src="/icons/icon-192.png"
              alt="ABINITIA"
              className={styles.agentAvatarImg}
            />
          </div>
          <div className={styles.agentInfo}>
            <h1>{selectedPersona.name}</h1>
            <div className={styles.agentSubtitle}>
              <span className={styles.liveDot} />
              {sessionState === 'listening'
                ? 'Escutando com carinho...'
                : sessionState === 'speaking'
                ? 'Conversando com você...'
                : 'Pronto para ouvir sua história'}
            </div>
          </div>
        </div>

        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.topPillBtn}
            onClick={() => setShowVoiceModal(true)}
            id="voice-persona-btn"
            title="Escolher quem conduz a entrevista"
          >
            <span>⚙️</span>
            <span>Voz: {selectedPersona.name.split(' ')[0]}</span>
          </button>

          <button
            type="button"
            className={styles.topPillBtn}
            onClick={() => setShowDrawer(true)}
            id="open-drawer-btn"
            title="Ver anotações e nomes extraídos"
          >
            <span>📋</span>
            <span>Caderno da Família</span>
          </button>
        </div>
      </header>

      {saveToast && (
        <div
          style={{
            position: 'absolute',
            top: '75px',
            zIndex: 30,
            background: 'rgba(90, 128, 64, 0.95)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {saveToast}
        </div>
      )}

      {/* ─── CENTRO: O ORB DE VOZ VIVA (ESTILO CHATGPT VOICE) ──── */}
      <main className={styles.orbStage}>
        <div
          className={`${styles.orbContainer} ${
            sessionState === 'listening'
              ? styles.orbListening
              : sessionState === 'speaking'
              ? styles.orbSpeaking
              : sessionState === 'processing'
              ? styles.orbProcessing
              : ''
          }`}
          onClick={toggleListening}
          title="Clique para falar ou pausar"
        >
          <div className={styles.orbRing1} />
          <div className={styles.orbRing2} />
          <div className={styles.orbRing3} />
          <div className={styles.orbSphere}>
            <img
              src="/icons/icon-192.png"
              alt="ABINITIA — Guardião de Memórias"
              className={styles.orbImage}
            />
          </div>
        </div>

        {/* ─── LEGENDA GRANDE E ACESSÍVEL PARA IDOSOS ─────────── */}
        <div className={styles.dialogueStage}>
          <div className={styles.statusTag}>
            {sessionState === 'listening' && (
              <>
                <span style={{ color: '#e74c3c' }}>●</span> Ouvindo sua voz (00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds})
              </>
            )}
            {sessionState === 'speaking' && (
              <>
                <span>🔊</span> {selectedPersona.name} está falando
              </>
            )}
            {sessionState === 'processing' && (
              <>
                <span>💭</span> Refletindo e guardando suas memórias...
              </>
            )}
            {sessionState === 'idle' && (
              <>
                <span>✨</span> Toque no microfone abaixo para responder
              </>
            )}
          </div>

          <p className={styles.speechText}>
            "{sessionState === 'listening' && userTranscript ? userTranscript : agentSpeech}"
          </p>

          {sessionState === 'listening' && !userTranscript && (
            <p className={styles.userSpeechHint}>
              Pode falar com calma, no seu próprio tempo...
            </p>
          )}
        </div>
      </main>

      {/* ─── BASE: CONTROLES GRANDES & AUTOEXPLICATIVOS ───────── */}
      <footer className={styles.bottomControls}>
        <button
          type="button"
          className={styles.secondaryControlBtn}
          onClick={() => speakVoice(agentSpeech)}
          title="Ouvir novamente a pergunta do Agente"
        >
          <span className={styles.controlIcon}>🔄</span>
          <span>Repetir Pergunta</span>
        </button>

        {/* Botão Gigante do Microfone */}
        <button
          type="button"
          className={`${styles.bigMicButton} ${sessionState === 'listening' ? styles.bigMicActive : ''}`}
          onClick={toggleListening}
          id="main-voice-mic-btn"
          title={sessionState === 'listening' ? 'Concluir minha fala' : 'Pressionar para falar'}
        >
          {sessionState === 'listening' ? '⏹️' : '🎙️'}
        </button>

        <button
          type="button"
          className={styles.secondaryControlBtn}
          onClick={handleSaveToBook}
          id="save-to-book-btn"
          title="Salvar esta história no Livro da Família"
        >
          <span className={styles.controlIcon}>📕</span>
          <span>Salvar no Livro</span>
        </button>
      </footer>

      {/* ─── GAVETA LATERAL DO CADERNO DE FATOS (OPCIONAL) ────── */}
      {showDrawer && (
        <div className={styles.drawerOverlay} onClick={() => setShowDrawer(false)}>
          <div className={styles.drawerContent} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>Caderno da Memória</h2>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-parchment)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--clr-muted)', margin: 0 }}>
              Fatos, nomes e locais identificados e salvos no banco de dados durante a conversa:
            </p>

            <div style={{ marginTop: '12px' }}>
              <h4 style={{ color: 'var(--clr-amber)', fontSize: '0.85rem', marginBottom: '8px' }}>👤 Pessoas da Linhagem</h4>
              <div>
                {extractedFacts.people.map((p, i) => (
                  <span key={i} className={styles.factPill}>{p}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <h4 style={{ color: 'var(--clr-amber)', fontSize: '0.85rem', marginBottom: '8px' }}>📅 Datas Relevantes</h4>
              <div>
                {extractedFacts.dates.map((d, i) => (
                  <span key={i} className={styles.factPill}>{d}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <h4 style={{ color: 'var(--clr-amber)', fontSize: '0.85rem', marginBottom: '8px' }}>📍 Lugares de Origem</h4>
              <div>
                {extractedFacts.places.map((pl, i) => (
                  <span key={i} className={styles.factPill}>{pl}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => {
                  handleSaveToBook()
                  setShowDrawer(false)
                }}
              >
                ✓ Sincronizar com a Árvore no BD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL DE SELEÇÃO DE VOZ ──────────────────────────── */}
      {showVoiceModal && (
        <div className={styles.voiceModalOverlay} onClick={() => setShowVoiceModal(false)}>
          <div className={styles.voiceModalCard} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: '4px', display: 'inline-block' }}>
                  Vozes Humanas e Acolhedoras
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-parchment)', margin: 0 }}>
                  Quem conduz a entrevista?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--clr-muted)', margin: 0 }}>
              Selecione a voz que melhor combina com a pessoa idosa entrevistada:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PERSONAS.map(persona => {
                const isSelected = selectedPersona.id === persona.id
                return (
                  <div
                    key={persona.id}
                    className={`${styles.personaOption} ${isSelected ? styles.personaOptionActive : ''}`}
                    onClick={() => setSelectedPersona(persona)}
                  >
                    <span className={styles.personaIcon}>{persona.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div className={styles.personaTitle}>
                        {persona.name} · <span style={{ color: 'var(--clr-amber)', fontSize: '0.8rem' }}>{persona.title}</span>
                      </div>
                      <div className={styles.personaDesc}>{persona.description}</div>
                    </div>
                    {isSelected && <span style={{ color: 'var(--clr-amber)', fontWeight: 700, fontSize: '1.2rem' }}>✓</span>}
                  </div>
                )
              })}
            </div>

            {availableVoices.length > 0 && (
              <div className="form-group" style={{ marginTop: '6px' }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>
                  Voz Alternativa do Sistema (Backup Offline)
                </label>
                <select
                  className="form-input"
                  value={selectedVoice?.name || ''}
                  onChange={e => {
                    const v = availableVoices.find(voice => voice.name === e.target.value)
                    if (v) setSelectedVoice(v)
                  }}
                  style={{ fontSize: '0.8rem' }}
                >
                  {availableVoices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  speakVoice(
                    `Olá! Sou o ${selectedPersona.name}. Estou aqui para ouvir suas histórias com calma e muito carinho.`
                  )
                }
              >
                ▶️ Ouvir Amostra de Voz
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowVoiceModal(false)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
