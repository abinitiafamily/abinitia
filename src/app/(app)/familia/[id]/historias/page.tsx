'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './historias.module.css'
import { MOCK_STORIES, MOCK_PEOPLE } from '@/lib/mock-data'
import type { Story } from '@/types'

export default function HistoriasPage() {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [activeTab, setActiveTab] = useState<'EDITORIAL' | 'RAW'>('EDITORIAL')
  const [showNewModal, setShowNewModal] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Campos de nova história
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [includeInBook, setIncludeInBook] = useState(true)
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([])

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const newStory: Story = {
      id: `story-${Date.now()}`,
      familyId: 'fam-001',
      title,
      content,
      originalContent: content,
      authorId: 'user-001',
      associatedPersonIds: selectedPersonIds,
      evidenceStatus: 'CONFIRMED',
      visibility: includeInBook ? 'BOOK' : 'FAMILY',
      createdAt: new Date(),
    }

    setStories(prev => [newStory, ...prev])
    setShowNewModal(false)

    // Reset campos
    setTitle('')
    setContent('')
    setSelectedPersonIds([])

    setSuccessToast(`✓ História "${newStory.title}" registrada com sucesso!`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  const togglePersonSelection = (personId: string) => {
    setSelectedPersonIds(prev =>
      prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Histórias & Memórias Orais</h1>
          <p className={styles.subtitle}>
            Relatos vivos, cartas e memórias transmitidas entre gerações.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/agente" className="btn btn-secondary" id="record-with-agent-btn">
            🎙️ Gravar Relato com IA
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            id="new-story-btn"
            onClick={() => setShowNewModal(true)}
          >
            + Escrever História
          </button>
        </div>
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

      <div className={styles.grid}>
        {stories.map(story => {
          const associated = MOCK_PEOPLE.filter(p => story.associatedPersonIds?.includes(p.id))

          return (
            <div
              key={story.id}
              className={styles.card}
              onClick={() => { setSelectedStory(story); setActiveTab('EDITORIAL') }}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelectedStory(story)}
            >
              <div className={styles.cardTop}>
                <span className={styles.bookBadge}>
                  {story.visibility === 'BOOK' ? '📖 Aprovado para o Livro' : '🔒 Memória Familiar'}
                </span>
                <span className="badge badge-amber">
                  {story.evidenceStatus === 'CONFIRMED' ? 'Confirmado' : 'Relato Testemunhal'}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{story.title}</h3>
              <p className={styles.cardContent}>{story.content}</p>

              {associated.length > 0 && (
                <div className={styles.associatedList}>
                  {associated.map(p => (
                    <span key={p.id} className={styles.personTag}>
                      👤 {p.firstName} {p.lastName}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.cardFooter}>
                <span className={styles.dateLabel}>
                  {new Date(story.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <span className={styles.readMore}>Ler história completa →</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Escrever Nova História */}
      {showNewModal && (
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
          onClick={() => setShowNewModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: 'var(--clr-bark)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-parchment)', fontSize: '1.25rem' }}>
                Escrever Nova História Familiar
              </h2>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-text-faint)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStory}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Título da História *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: A primeira oficina e a chegada dos filhos em São Paulo"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Narrativa / Memória *</label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Descreva a história preservada pela tradição familiar, anedotas, dificuldades e superações..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Antepassados Relacionados</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '100px', overflowY: 'auto' }}>
                  {MOCK_PEOPLE.map(p => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => togglePersonSelection(p.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        background: selectedPersonIds.includes(p.id) ? 'var(--clr-amber)' : 'rgba(198, 139, 46, 0.1)',
                        color: selectedPersonIds.includes(p.id) ? 'var(--clr-bark-deep)' : 'var(--clr-parchment)',
                        border: '1px solid rgba(198, 139, 46, 0.3)',
                        fontWeight: 600,
                      }}
                    >
                      {p.firstName} {p.lastName}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="include-book-check"
                  checked={includeInBook}
                  onChange={e => setIncludeInBook(e.target.checked)}
                />
                <label htmlFor="include-book-check" style={{ fontSize: '0.85rem', color: 'var(--clr-parchment)', cursor: 'pointer' }}>
                  Aprovar para inclusão no <strong>Livro da Família</strong>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="submit-story-btn"
                >
                  Salvar História
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reader Modal */}
      {selectedStory && (
        <div className={styles.modalOverlay} onClick={() => setSelectedStory(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalPre}>História Familiar</span>
                <h2 className={styles.modalTitle}>{selectedStory.title}</h2>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedStory(null)}
              >
                ✕
              </button>
            </div>

            {/* Switch tabs: Editorial vs Raw transcription */}
            <div className={styles.modalTabs}>
              <button
                type="button"
                className={`${styles.modalTab} ${activeTab === 'EDITORIAL' ? styles.modalTabActive : ''}`}
                onClick={() => setActiveTab('EDITORIAL')}
              >
                Versão Editorial (Narrativa Final)
              </button>
              <button
                type="button"
                className={`${styles.modalTab} ${activeTab === 'RAW' ? styles.modalTabActive : ''}`}
                onClick={() => setActiveTab('RAW')}
              >
                Transcrição Original / Relato Bruto
              </button>
            </div>

            <div className={styles.modalBody}>
              {activeTab === 'EDITORIAL' ? (
                <div className={styles.narrativeContent}>
                  <p className={styles.narrativeText}>{selectedStory.content}</p>
                </div>
              ) : (
                <div className={styles.rawContent}>
                  <div className={styles.rawAlert}>
                    <span>🎙️ Transcrição do áudio gravado em entrevista familiar</span>
                  </div>
                  <p className={styles.rawText}>
                    "{selectedStory.originalContent || selectedStory.content}"
                  </p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedStory(null)}
              >
                Fechar
              </button>
              <Link
                href="/agente"
                className="btn btn-primary"
                id="expand-with-agent-btn"
              >
                ✨ Aprofundar com Agente IA
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
