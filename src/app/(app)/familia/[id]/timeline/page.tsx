'use client'
import { useState } from 'react'
import styles from './timeline.module.css'
import { MOCK_TIMELINE, MOCK_PEOPLE } from '@/lib/mock-data'
import type { TimelineEvent } from '@/types'

const EVENT_TYPE_ICONS: Record<string, string> = {
  BIRTH: '👶',
  MARRIAGE: '💍',
  DEATH: '🕊️',
  MIGRATION: '🚢',
  PROFESSION: '⚒️',
  OTHER: '📜',
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  BIRTH: 'Nascimento',
  MARRIAGE: 'Casamento',
  DEATH: 'Falecimento',
  MIGRATION: 'Migração',
  PROFESSION: 'Ofício / Trabalho',
  OTHER: 'Fato Histórico',
}

const HISTORICAL_CONTEXT: TimelineEvent[] = [
  {
    id: 'hist-1',
    familyId: 'fam-001',
    title: 'Abolição & Grande Fluxo de Imigração Italiana',
    type: 'HISTORICAL' as any,
    date: '1888',
    location: 'Brasil / Itália',
    description: 'Promulgação da Lei Áurea no Brasil e incentivo à vinda de famílias italianas para o trabalho fabril e agrícola em São Paulo.',
    evidenceStatus: 'CONFIRMED',
    isHistoricalContext: true,
  },
  {
    id: 'hist-2',
    familyId: 'fam-001',
    title: 'Eclosão da Primeira Guerra Mundial',
    type: 'HISTORICAL' as any,
    date: '1914',
    location: 'Europa / Itália',
    description: 'Conflito militar mobiliza jovens na Itália e interrompe correspondências transatlânticas com os parentes no Brasil.',
    evidenceStatus: 'CONFIRMED',
    isHistoricalContext: true,
  },
]

export default function TimelinePage() {
  const [filterType, setFilterType] = useState<string>('ALL')
  const [showHistory, setShowHistory] = useState(true)

  const allEvents = showHistory ? [...MOCK_TIMELINE, ...HISTORICAL_CONTEXT] : [...MOCK_TIMELINE]
  const events = allEvents.sort((a, b) => {
    return parseInt(a.date || '0') - parseInt(b.date || '0')
  })

  const filteredEvents = filterType === 'ALL'
    ? events
    : events.filter(e => e.type === filterType)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Linha do Tempo Familiar</h1>
          <p className={styles.subtitle}>
            A jornada cronológica dos marcos, migrações e celebrações através dos séculos.
          </p>
        </div>
        <button className="btn btn-primary" id="add-event-btn">
          + Adicionar Marco
        </button>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${filterType === 'ALL' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          Todos os Marcos ({events.length})
        </button>
        {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => {
          const count = events.filter(e => e.type === type).length
          if (count === 0) return null
          return (
            <button
              key={type}
              className={`${styles.filterBtn} ${filterType === type ? styles.filterActive : ''}`}
              onClick={() => setFilterType(type)}
            >
              {EVENT_TYPE_ICONS[type]} {label} ({count})
            </button>
          )
        })}

        <button
          className={`${styles.filterBtn} ${showHistory ? styles.historyActive : ''}`}
          onClick={() => setShowHistory(h => !h)}
          title="Alternar contexto histórico nacional e mundial da época"
        >
          🏛️ Contexto Histórico: {showHistory ? 'Ativo' : 'Oculto'}
        </button>
      </div>

      {/* Timeline Stream */}
      <div className={styles.timelineStream}>
        <div className={styles.centralLine} />

        {filteredEvents.map((event, index) => {
          const isLeft = index % 2 === 0
          const icon = EVENT_TYPE_ICONS[event.type] || '📜'
          const peopleInvolved = MOCK_PEOPLE.filter(p => event.personIds?.includes(p.id))

          return (
            <div
              key={event.id}
              className={`${styles.eventItem} ${isLeft ? styles.eventLeft : styles.eventRight}`}
            >
              <div className={styles.eventDot}>
                <span>{icon}</span>
              </div>

              <div className={styles.eventCard}>
                <div className={styles.eventYearBadge}>{event.date}</div>
                <h3 className={styles.eventTitle}>{event.title}</h3>

                {event.location && (
                  <div className={styles.eventLocation}>
                    📍 {event.location}
                  </div>
                )}

                {event.description && (
                  <p className={styles.eventDesc}>{event.description}</p>
                )}

                {peopleInvolved.length > 0 && (
                  <div className={styles.peopleList}>
                    {peopleInvolved.map(p => (
                      <span key={p.id} className={styles.personTag}>
                        👤 {p.firstName} {p.lastName}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.eventFooter}>
                  <span className={`badge ${event.evidenceStatus === 'CONFIRMED' ? 'badge-olive' : 'badge-amber'}`}>
                    {event.evidenceStatus === 'CONFIRMED' ? 'Certidão / Registro' : 'Relato Oral'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
