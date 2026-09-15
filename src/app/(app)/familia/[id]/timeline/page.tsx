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
  HISTORICAL: '🏛️',
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
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(MOCK_TIMELINE)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [showHistory, setShowHistory] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Campos do formulário
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState<string>('MIGRATION')
  const [description, setDescription] = useState('')
  const [evidenceStatus, setEvidenceStatus] = useState<'CONFIRMED' | 'REPORTED'>('CONFIRMED')

  const allEvents = showHistory ? [...timelineEvents, ...HISTORICAL_CONTEXT] : [...timelineEvents]
  const events = allEvents.sort((a, b) => {
    return parseInt(a.date || '0') - parseInt(b.date || '0')
  })

  const filteredEvents = filterType === 'ALL'
    ? events
    : events.filter(e => e.type === filterType)

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date.trim()) return

    const newEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      familyId: 'fam-001',
      title,
      date,
      location: location.trim() || undefined,
      type: type as any,
      description: description.trim() || undefined,
      evidenceStatus: evidenceStatus as any,
    }

    setTimelineEvents(prev => [...prev, newEvent])
    setShowAddModal(false)

    // Reset campos
    setTitle('')
    setDate('')
    setLocation('')
    setDescription('')

    setSuccessToast(`✓ Marco "${newEvent.title}" adicionado à linha do tempo!`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Linha do Tempo Familiar</h1>
          <p className={styles.subtitle}>
            A jornada cronológica dos marcos, migrações e celebrações através dos séculos.
          </p>
        </div>
        <button
          className="btn btn-primary"
          id="add-event-btn"
          type="button"
          onClick={() => setShowAddModal(true)}
        >
          + Adicionar Marco
        </button>
      </div>

      {successToast && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(90, 128, 64, 0.2)',
            border: '1px solid rgba(90, 128, 64, 0.4)',
            color: '#7ea462',
            fontWeight: 500,
            marginBottom: 'var(--sp-4)',
          }}
        >
          {successToast}
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterType === 'ALL' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          Todos os Marcos ({events.length})
        </button>
        {Object.entries(EVENT_TYPE_LABELS).map(([t, label]) => {
          const count = events.filter(e => e.type === t).length
          if (count === 0) return null
          return (
            <button
              type="button"
              key={t}
              className={`${styles.filterBtn} ${filterType === t ? styles.filterActive : ''}`}
              onClick={() => setFilterType(t)}
            >
              {EVENT_TYPE_ICONS[t]} {label} ({count})
            </button>
          )
        })}

        <button
          type="button"
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

      {/* Modal: Adicionar Novo Marco */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 5, 2, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 110,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'var(--clr-bark)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-parchment)', fontSize: '1.25rem' }}>
                Adicionar Marco Histórico
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-text-faint)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Título do Marco *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Chegada da família ao Porto de Santos"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Ano / Data *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: 1888"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Local</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Santos, SP"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tipo do Marco</label>
                  <select
                    className="form-input"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="MIGRATION">🚢 Migração / Desembarque</option>
                    <option value="BIRTH">👶 Nascimento</option>
                    <option value="MARRIAGE">💍 Casamento</option>
                    <option value="PROFESSION">⚒️ Ofício / Fundação</option>
                    <option value="DEATH">🕊️ Falecimento</option>
                    <option value="OTHER">📜 Outro Fato Relevante</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status da Evidência</label>
                  <select
                    className="form-input"
                    value={evidenceStatus}
                    onChange={e => setEvidenceStatus(e.target.value as any)}
                  >
                    <option value="CONFIRMED">Confirmado (Documento)</option>
                    <option value="REPORTED">Reportado (Memória)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Descrição / Contexto</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Relato detalhado do acontecimento e impacto na família..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="submit-event-btn"
                >
                  Salvar Marco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
