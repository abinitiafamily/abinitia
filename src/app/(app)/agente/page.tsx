'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './agente.module.css'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
  extractedFacts?: {
    people?: string[]
    dates?: string[]
    places?: string[]
    events?: string[]
  }
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'ai',
    text: 'Olá, Carolina! Sou o Guardião de Memórias da ABINITIA. Estou aqui para ouvir suas histórias e ajudar a reconstruir cada galho da sua árvore genealógica. Você pode conversar comigo digitando ou gravando sua voz. Sobre quem você gostaria de me contar hoje?',
    timestamp: '14:20',
  },
]

export default function AgentePage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedFacts, setExtractedFacts] = useState({
    people: ['Giuseppe Ferraro (1865)', 'Rosa Carbone (1870)', 'Antonio Ferraro (1895)'],
    dates: ['1888 (Desembarque)', '1887 (Casamento em Nápoles)', '1905 (Ferraria SP)'],
    places: ['Nápoles (Itália)', 'Porto de Santos (SP)', 'Rua do Comércio (SP)'],
    events: ['Migração Atlântica', 'Fundação do Comércio Familiar'],
  })
  const [factsIntegrated, setFactsIntegrated] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  // Recording timer simulation
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      setRecordSeconds(0)

      // Simulate audio processing
      setIsProcessing(true)
      setTimeout(() => {
        const userMsg: Message = {
          id: `m-${Date.now()}`,
          sender: 'user',
          text: '🎙️ [Áudio Gravado - 0:14]: "Lembro que minha avó contava que Giuseppe tinha um irmão chamado Matteo que ficou na Itália, na região de Salerno."',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages(prev => [...prev, userMsg])
        setIsProcessing(false)

        // AI Response with fact extraction
        setTimeout(() => {
          const aiMsg: Message = {
            id: `m-${Date.now() + 1}`,
            sender: 'ai',
            text: 'Que detalhe precioso! Identifiquei um novo ramo potencial: Matteo Ferraro, irmão de Giuseppe, residente em Salerno. Você se lembra se Matteo chegou a se casar ou se enviou cartas para o Brasil durante a guerra?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            extractedFacts: {
              people: ['Matteo Ferraro (Irmão de Giuseppe)'],
              places: ['Salerno, Itália'],
              events: ['Permanência na Itália'],
            },
          }
          setMessages(prev => [...prev, aiMsg])
          setExtractedFacts(prev => ({
            ...prev,
            people: [...prev.people, 'Matteo Ferraro (Salerno)'],
            places: [...prev.places, 'Salerno (Itália)'],
          }))
        }, 1200)
      }, 1500)
    } else {
      // Start recording
      setIsRecording(true)
      setRecordSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1)
      }, 1000)
    }
  }

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
    setIsProcessing(true)

    // Simulate AI response
    setTimeout(() => {
      setIsProcessing(false)
      const aiMsg: Message = {
        id: `m-${Date.now() + 1}`,
        sender: 'ai',
        text: `Compreendi! Esse relato sobre "${userText.slice(0, 30)}..." nos ajuda a preencher detalhes cronológicos essenciais. Registrei as menções no caderno de campo genealógico para alimentar a linha do tempo e o livro da família.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1200)
  }

  const handleIntegrateFacts = () => {
    setFactsIntegrated(true)
    setTimeout(() => setFactsIntegrated(false), 4000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.agentBadge}>
            <div className={styles.agentAvatar}>🏛️</div>
            <div>
              <h2 className={styles.agentName}>Agente Genealogista · AG-001</h2>
              <span className={styles.agentStatus}>
                <span className={styles.onlineDot} /> Escuta Ativa & Entrevista Contextual
              </span>
            </div>
          </div>
          <span className="badge badge-amber">Captação de Áudio & Texto</span>
        </div>

        {/* Chat Stream */}
        <div className={styles.chatStream}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.messageBubble} ${msg.sender === 'ai' ? styles.msgAi : styles.msgUser}`}
            >
              <div className={styles.msgHeader}>
                <span className={styles.msgSender}>{msg.sender === 'ai' ? 'Agente ABINITIA' : 'Você'}</span>
                <span className={styles.msgTime}>{msg.timestamp}</span>
              </div>
              <p className={styles.msgText}>{msg.text}</p>
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
              Gravando relato de voz... 00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
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
            placeholder={isRecording ? 'Ouvindo sua voz...' : 'Digite seu relato ou memória familiar aqui...'}
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
            O agente analisa o diálogo em tempo real e identifica automaticamente entidades para a árvore.
          </p>
        </div>

        {factsIntegrated && (
          <div className={styles.integratedNotice}>
            ✓ Novos nós e fatos integrados à árvore da família!
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
            className="btn btn-primary btn-full"
            onClick={handleIntegrateFacts}
            id="integrate-tree-facts-btn"
          >
            Alimentar Árvore Genealógica
          </button>
        </div>
      </div>
    </div>
  )
}
