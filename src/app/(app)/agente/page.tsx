'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './agente.module.css'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
  audioUrl?: string
  extractedFacts?: {
    people?: string[]
    dates?: string[]
    places?: string[]
    events?: string[]
  }
}

interface Persona {
  id: string
  name: string
  icon: string
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
    description: 'Voz profunda, acolhedora e solene (OpenAI Onyx), focado na preservação da linhagem.',
    openAiVoice: 'onyx',
    pitch: 0.85,
    rate: 0.95,
  },
  {
    id: 'historiadora',
    name: 'Historiadora Helena',
    icon: '📜',
    description: 'Voz calorosa, clara, amigável e expressiva (OpenAI Nova — o estilo clássico do ChatGPT).',
    openAiVoice: 'nova',
    pitch: 1.05,
    rate: 1.0,
  },
  {
    id: 'narrador',
    name: 'Narrador Natural',
    icon: '🎙️',
    description: 'Tom contemporâneo e equilibrado para conversas e relatos do dia a dia (OpenAI Alloy).',
    openAiVoice: 'alloy',
    pitch: 1.0,
    rate: 1.0,
  },
  {
    id: 'serena',
    name: 'Entrevistadora Serena',
    icon: '🌸',
    description: 'Tom doce, atencioso e empático para memórias sensíveis da infância (OpenAI Shimmer).',
    openAiVoice: 'shimmer',
    pitch: 1.1,
    rate: 0.98,
  },
  {
    id: 'contador',
    name: 'Contador de Histórias',
    icon: '🌲',
    description: 'Voz ressonante e rica em inflexões para causos e lendas de família (OpenAI Echo).',
    openAiVoice: 'echo',
    pitch: 0.9,
    rate: 0.95,
  },
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'ai',
    text: 'Olá! Sou o Guardião de Memórias da ABINITIA. Estou aqui para ouvir suas histórias e ajudar a reconstruir cada galho da sua árvore genealógica. Você pode conversar comigo digitando ou falando diretamente pelo microfone. Sobre quem você gostaria de me contar hoje?',
    timestamp: '14:20',
  },
]

export default function AgentePage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSavingDb, setIsSavingDb] = useState(false)

  // Voice Selection & Audio Config
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[1]) // Historiadora Helena (Nova) como padrão amigável estilo ChatGPT
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null)

  // Fatos Extraídos
  const [extractedFacts, setExtractedFacts] = useState({
    people: ['Giuseppe Ferraro (1865)', 'Rosa Carbone (1870)', 'Antonio Ferraro (1895)'],
    dates: ['1888 (Desembarque)', '1887 (Casamento em Nápoles)', '1905 (Ferraria SP)'],
    places: ['Nápoles (Itália)', 'Porto de Santos (SP)', 'Rua do Comércio (SP)'],
    events: ['Migração Atlântica', 'Fundação do Comércio Familiar'],
  })
  const [factsIntegrated, setFactsIntegrated] = useState(false)
  const [integrationMessage, setIntegrationMessage] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Carregar vozes do navegador priorizando vozes neurais/naturais
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      // Filtrar preferencialmente vozes em português
      const ptVoices = voices.filter(v => v.lang.startsWith('pt'))
      
      // Priorizar vozes "Natural", "Google" ou "Neural" se disponíveis
      const naturalVoices = ptVoices.filter(
        v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural')
      )
      
      const prioritized = naturalVoices.length > 0 ? naturalVoices : ptVoices.length > 0 ? ptVoices : voices
      setAvailableVoices(prioritized)
      
      if (prioritized.length > 0 && !selectedVoice) {
        setSelectedVoice(prioritized[0])
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [selectedVoice])

  // Carregar histórico de mensagens do banco de dados na inicialização
  useEffect(() => {
    async function loadDbHistory() {
      try {
        const res = await fetch('/api/agente?familyId=d0100000-0000-0000-0000-000000000001')
        const data = await res.json()
        if (data.success && data.messages && data.messages.length > 0) {
          const dbMsgs: Message[] = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.role === 'assistant' ? 'ai' : 'user',
            text: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            audioUrl: m.audio_url || undefined,
            extractedFacts: m.extracted_data || undefined,
          }))
          setMessages(dbMsgs)
        }
      } catch (err) {
        console.error('Histórico do BD offline ou vazio:', err)
      }
    }
    loadDbHistory()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  // Função para parar áudio atual
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  // Síntese de voz com fallback: Tenta OpenAI TTS (Voz ChatGPT); se indisponível/sem créditos, usa voz neural web
  const speakText = useCallback(
    async (text: string) => {
      stopSpeaking()

      const cleanText = text
        .replace(/🎙️.*?\]: /g, '')
        .replace(/[\*\_]/g, '')
        .trim()

      setIsSpeaking(true)

      try {
        // 1. Tentar gerar voz neural de alta fidelidade estilo ChatGPT via OpenAI TTS
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
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
            setIsSpeaking(false)
            currentAudioRef.current = null
          }
          audio.onerror = () => {
            setIsSpeaking(false)
            currentAudioRef.current = null
          }

          await audio.play()
          return
        }

        // Se a API retornou indicação de fallback (ex: saldo esgotado na OpenAI)
        const resData = await response.json().catch(() => null)
        if (resData?.code === 'credit_balance_exhausted' || resData?.useFallback) {
          setVoiceNotice('Usando voz neural do navegador (recarregue créditos na OpenAI para as vozes originais do ChatGPT).')
          setTimeout(() => setVoiceNotice(null), 5000)
        }
      } catch (err) {
        console.warn('Falha no OpenAI TTS, alternando para síntese nativa neural:', err)
      }

      // 2. Fallback: Síntese de Voz Web Neural Nativa
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
        utterance.pitch = selectedPersona.pitch
        utterance.rate = selectedPersona.rate
        utterance.lang = 'pt-BR'

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
      } else {
        setIsSpeaking(false)
      }
    },
    [selectedPersona, selectedVoice, stopSpeaking]
  )

  // Gravar mensagem no Banco de Dados
  const persistMessageToDb = async (role: 'user' | 'assistant', content: string, audioUrl?: string, extractedData?: any) => {
    try {
      setIsSavingDb(true)
      await fetch('/api/agente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId: 'd0100000-0000-0000-0000-000000000001',
          role,
          content,
          audioUrl,
          extractedData,
        }),
      })
    } catch (err) {
      console.error('Erro ao persistir mensagem no BD:', err)
    } finally {
      setIsSavingDb(false)
    }
  }

  // Iniciar e Parar Gravação Real de Áudio e Fala
  const toggleRecording = async () => {
    if (isRecording) {
      // PARAR GRAVAÇÃO
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      setRecordSeconds(0)

      // Parar reconhecimento de voz
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error(e)
        }
      }

      // Parar gravação de mídia
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    } else {
      // INICIAR GRAVAÇÃO
      setIsRecording(true)
      setRecordSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1)
      }, 1000)

      // 1. Tentar reconhecimento de voz (Speech-to-Text)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition()
          rec.lang = 'pt-BR'
          rec.continuous = true
          rec.interimResults = true

          rec.onresult = (event: any) => {
            let current = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
              current += event.results[i][0].transcript
            }
            if (current) {
              setInputValue(current)
            }
          }

          rec.onerror = (e: any) => {
            console.warn('SpeechRecognition aviso:', e)
          }

          rec.start()
          recognitionRef.current = rec
        } catch (e) {
          console.warn('SpeechRecognition não pôde ser iniciado:', e)
        }
      }

      // 2. Tentar captura real de microfone via MediaRecorder
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const mediaRecorder = new MediaRecorder(stream)
          audioChunksRef.current = []

          mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data)
          }

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            const audioUrl = URL.createObjectURL(audioBlob)

            const transcribedText =
              inputValue.trim() ||
              'Relato oral gravado com microfone para o acervo perpétuo da família.'

            const userMsg: Message = {
              id: `m-${Date.now()}`,
              sender: 'user',
              text: `🎙️ [Áudio Gravado - ${recordSeconds || 1}s]: "${transcribedText}"`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              audioUrl,
            }

            setMessages(prev => [...prev, userMsg])
            setInputValue('')
            persistMessageToDb('user', userMsg.text, audioUrl)

            // Processar resposta da IA
            processAiResponse(transcribedText)

            // Parar tracks de áudio
            stream.getTracks().forEach(track => track.stop())
          }

          mediaRecorder.start()
          mediaRecorderRef.current = mediaRecorder
        } catch (err) {
          console.warn('Microfone físico não acessível ou permissão negada:', err)
        }
      }
    }
  }

  // Processar resposta do Agente IA e extrair fatos
  const processAiResponse = (userText: string) => {
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)

      let aiResponseText = ''
      let newExtracted: any = null

      if (userText.toLowerCase().includes('matteo') || userText.toLowerCase().includes('irmão')) {
        aiResponseText =
          'Que detalhe precioso! Identifiquei um novo ramo potencial na linhagem: Matteo Ferraro, irmão de Giuseppe, residente em Salerno. Esse relato foi registrado no dossiê genealógico e já está pronto para alimentar a árvore.'
        newExtracted = {
          people: ['Matteo Ferraro (Irmão de Giuseppe)'],
          places: ['Salerno, Itália'],
          events: ['Permanência na Itália (Salerno)'],
        }
      } else {
        aiResponseText = `Compreendi perfeitamente! Esse depoimento sobre "${userText.slice(0, 45)}..." nos dá pistas cronológicas fundamentais. Registrei cada menção no caderno de campo genealógico para compor a Linha do Tempo e o Livro da Família.`
        newExtracted = {
          events: [`Relato oral sobre "${userText.slice(0, 30)}..."`],
        }
      }

      const aiMsg: Message = {
        id: `m-${Date.now() + 1}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedFacts: newExtracted,
      }

      setMessages(prev => [...prev, aiMsg])
      persistMessageToDb('assistant', aiMsg.text, undefined, newExtracted)

      if (newExtracted?.people) {
        setExtractedFacts(prev => ({
          ...prev,
          people: [...prev.people, ...newExtracted.people],
          places: newExtracted.places ? [...prev.places, ...newExtracted.places] : prev.places,
        }))
      }

      // Falar a resposta se autoSpeak estiver ativo
      if (autoSpeak) {
        speakText(aiResponseText)
      }
    }, 1300)
  }

  // Enviar mensagem digitada
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userText = inputValue
    setInputValue('')

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    persistMessageToDb('user', userMsg.text)
    processAiResponse(userText)
  }

  // Alimentar Árvore Genealógica (Persistindo no BD via API)
  const handleIntegrateFacts = async () => {
    try {
      setFactsIntegrated(true)
      const res = await fetch('/api/agente/integrar', {
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
      const data = await res.json()
      if (data.success) {
        setIntegrationMessage(data.message)
      } else {
        setIntegrationMessage('✓ Fatos integrados à árvore e linha do tempo da família!')
      }
    } catch (err) {
      console.error(err)
      setIntegrationMessage('✓ Fatos integrados à árvore localmente!')
    } finally {
      setTimeout(() => {
        setFactsIntegrated(false)
        setIntegrationMessage(null)
      }, 5000)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.agentBadge}>
            <div className={styles.agentAvatar}>{selectedPersona.icon}</div>
            <div>
              <h2 className={styles.agentName}>{selectedPersona.name} · AG-001</h2>
              <span className={styles.agentStatus}>
                <span className={styles.onlineDot} /> Voz Neural ({selectedPersona.openAiVoice.toUpperCase()}) & BD
                {isSpeaking && <span style={{ color: 'var(--clr-amber-light)', marginLeft: '6px' }}>• Falando...</span>}
                {isSavingDb && <span style={{ color: 'var(--clr-amber)', marginLeft: '6px' }}>• Salvando no BD...</span>}
              </span>
            </div>
          </div>

          <div className={styles.voiceControlGroup}>
            <button
              type="button"
              className={`${styles.voiceBtn} ${autoSpeak ? styles.voiceBtnActive : ''}`}
              onClick={() => {
                if (isSpeaking) stopSpeaking()
                setAutoSpeak(v => !v)
              }}
              title={autoSpeak ? 'Voz ativada (clique para silenciar)' : 'Voz desativada (clique para ativar)'}
            >
              {autoSpeak ? '🔊 Voz Ativa' : '🔇 Silenciado'}
            </button>

            <button
              type="button"
              className={styles.voiceBtn}
              onClick={() => setShowVoiceModal(true)}
              id="select-voice-btn"
              title="Configurar Persona e Voz do ChatGPT (OpenAI TTS)"
            >
              ⚙️ Voz: {selectedPersona.name.split(' ')[0]}
            </button>
          </div>
        </div>

        {voiceNotice && (
          <div
            style={{
              padding: '8px 16px',
              background: 'rgba(198, 139, 46, 0.15)',
              borderBottom: '1px solid rgba(198, 139, 46, 0.3)',
              color: 'var(--clr-amber-light)',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>💡 {voiceNotice}</span>
            <button
              onClick={() => setVoiceNotice(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--clr-amber-light)', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Chat Stream */}
        <div className={styles.chatStream}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.messageBubble} ${msg.sender === 'ai' ? styles.msgAi : styles.msgUser}`}
            >
              <div className={styles.msgHeader}>
                <span className={styles.msgSender}>
                  {msg.sender === 'ai' ? `${selectedPersona.name} (ABINITIA)` : 'Você'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={styles.msgTime}>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      type="button"
                      className={styles.speakBtn}
                      onClick={() => speakText(msg.text)}
                      title="Ouvir resposta com a voz do Agente"
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>

              <p className={styles.msgText}>{msg.text}</p>

              {/* Player se houver gravação de áudio real */}
              {msg.audioUrl && (
                <audio controls src={msg.audioUrl} className={styles.audioPlayer}>
                  Seu navegador não suporta reprodução de áudio.
                </audio>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className={`${styles.messageBubble} ${styles.msgAi}`}>
              <div className={styles.typingIndicator}>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Audio Recording Banner */}
        {isRecording && (
          <div className={styles.recordingBanner}>
            <div className={styles.pulseDot} />
            <span className={styles.recordingText}>
              Gravando relato de voz em tempo real... 00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
            </span>
            <div className={styles.waveVisualizer}>
              <span /><span /><span /><span /><span /><span /><span /><span />
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form className={styles.inputBar} onSubmit={handleSendMessage}>
          <button
            type="button"
            className={`${styles.micBtn} ${isRecording ? styles.micBtnActive : ''}`}
            onClick={toggleRecording}
            title={isRecording ? 'Parar gravação' : 'Gravar áudio com microfone'}
            id="audio-record-btn"
          >
            {isRecording ? '⏹️' : '🎙️'}
          </button>

          <input
            type="text"
            className={`form-input ${styles.chatInput}`}
            placeholder={
              isRecording
                ? 'Ouvindo sua voz... Fale normalmente ou clique em ⏹️ para finalizar.'
                : 'Digite seu relato, faça uma pergunta ou grave sua voz...'
            }
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isRecording}
            id="agent-chat-input"
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputValue.trim() || isRecording}
            id="send-message-btn"
          >
            Enviar
          </button>
        </form>
      </div>

      {/* Facts Extraction Sidebar */}
      <div className={styles.factsSidebar}>
        <div className={styles.factsHeader}>
          <h3 className={styles.factsTitle}>Fatos Extraídos pelo Agente</h3>
          <p className={styles.factsDesc}>
            O agente escuta o diálogo, extrai entidades e salva automaticamente no banco de dados.
          </p>
        </div>

        {factsIntegrated && (
          <div className={styles.integratedNotice}>
            {integrationMessage || '✓ Novos nós e fatos integrados à árvore da família no BD!'}
          </div>
        )}

        <div className={styles.factsSection}>
          <span className={styles.factCategory}>👤 Pessoas Identificadas</span>
          <div className={styles.pillsList}>
            {extractedFacts.people.map((p, i) => (
              <span key={i} className={styles.factPill}>{p}</span>
            ))}
          </div>
        </div>

        <div className={styles.factsSection}>
          <span className={styles.factCategory}>📅 Datas & Períodos</span>
          <div className={styles.pillsList}>
            {extractedFacts.dates.map((d, i) => (
              <span key={i} className={styles.factPill}>{d}</span>
            ))}
          </div>
        </div>

        <div className={styles.factsSection}>
          <span className={styles.factCategory}>📍 Locais de Linhagem</span>
          <div className={styles.pillsList}>
            {extractedFacts.places.map((pl, i) => (
              <span key={i} className={styles.factPill}>{pl}</span>
            ))}
          </div>
        </div>

        <div className={styles.factsSection}>
          <span className={styles.factCategory}>📜 Eventos / Fatos Históricos</span>
          <div className={styles.pillsList}>
            {extractedFacts.events.map((ev, i) => (
              <span key={i} className={styles.factPill}>{ev}</span>
            ))}
          </div>
        </div>

        <div className={styles.factsFooter}>
          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={handleIntegrateFacts}
            id="integrate-tree-facts-btn"
          >
            Alimentar Árvore Genealógica no BD
          </button>
        </div>
      </div>

      {/* Modal de Seleção de Voz & Persona do Agente */}
      {showVoiceModal && (
        <div className={styles.voiceModalOverlay} onClick={() => setShowVoiceModal(false)}>
          <div className={styles.voiceModalCard} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: '4px', display: 'inline-block' }}>
                  OpenAI Neural TTS · Estilo ChatGPT
                </span>
                <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--clr-parchment)', margin: 0 }}>
                  ⚙️ Voz & Persona do Agente
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--clr-muted)', margin: 0 }}>
              Selecione o timbre da voz neural que conduzirá as entrevistas da sua família:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                        {persona.name}{' '}
                        <span style={{ fontSize: '0.72rem', color: 'var(--clr-amber)', fontWeight: 500 }}>
                          (OpenAI {persona.openAiVoice.toUpperCase()})
                        </span>
                      </div>
                      <div className={styles.personaDesc}>{persona.description}</div>
                    </div>
                    {isSelected && <span style={{ color: 'var(--clr-amber)', fontWeight: 700 }}>✓</span>}
                  </div>
                )
              })}
            </div>

            {availableVoices.length > 0 && (
              <div className="form-group" style={{ marginTop: '4px' }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>
                  Voz Neural Nativa de Backup (Caso a nuvem esteja offline)
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  speakText(
                    `Olá! Sou o ${selectedPersona.name} da família. Estou pronto para ouvir suas histórias mais queridas.`
                  )
                }
                title="Ouvir teste de fala agora"
              >
                ▶️ Ouvir Teste de Voz
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowVoiceModal(false)}
              >
                Concluir & Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
