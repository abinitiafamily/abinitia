'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './historias.module.css'
import { MOCK_STORIES, MOCK_PEOPLE } from '@/lib/mock-data'
import type { Story } from '@/types'

export default function HistoriasPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [activeTab, setActiveTab] = useState<'EDITORIAL' | 'RAW'>('EDITORIAL')

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
          <Link href="/agente" className="btn btn-secondary">
            🎙️ Gravar Relato com IA
          </Link>
          <button className="btn btn-primary" id="new-story-btn">
            + Escrever História
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {MOCK_STORIES.map(story => {
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
                className={styles.closeBtn}
                onClick={() => setSelectedStory(null)}
              >
                ✕
              </button>
            </div>

            {/* Switch tabs: Editorial vs Raw transcription */}
            <div className={styles.modalTabs}>
              <button
                className={`${styles.modalTab} ${activeTab === 'EDITORIAL' ? styles.modalTabActive : ''}`}
                onClick={() => setActiveTab('EDITORIAL')}
              >
                Versão Editorial (Narrativa Final)
              </button>
              <button
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
              <button className="btn btn-secondary" onClick={() => setSelectedStory(null)}>
                Fechar
              </button>
              <button className="btn btn-primary" id="edit-story-btn">
                Editar Narrativa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
