'use client'

import { useState } from 'react'
import styles from './livro.module.css'
import { MOCK_BOOK_CHAPTERS, MOCK_FAMILIES } from '@/lib/mock-data'
import type { BookChapter } from '@/types'

export default function LivroPage() {
  const [chapters, setChapters] = useState<BookChapter[]>(MOCK_BOOK_CHAPTERS)
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(MOCK_BOOK_CHAPTERS[0])
  const [family, setFamily] = useState(MOCK_FAMILIES[0])
  const [progress, setProgress] = useState(family.stats?.bookProgress || 72)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [isEditingChapter, setIsEditingChapter] = useState(false)
  const [chapterText, setChapterText] = useState(
    'Nos últimos anos do século XIX, quando as primeiras notícias da terra além-mar ecoavam pelas colinas ensolaradas de Nápoles, Giuseppe Ferraro reuniu a coragem ancestral de seus antepassados para fincar novas raízes no continente sul-americano.'
  )

  const handleRecompile = () => {
    setIsCompiling(true)
    setTimeout(() => {
      setIsCompiling(false)
      setProgress(88)
      setSuccessToast('✓ Livro recompilado com 14 novos fatos e relatos trazidos pelo Agente IA!')
      setTimeout(() => setSuccessToast(null), 4000)
    }, 1500)
  }

  const handleGeneratePdf = () => {
    setIsGeneratingPdf(true)
    setTimeout(() => {
      setIsGeneratingPdf(false)
      setShowPdfModal(true)
    }, 1200)
  }

  const handleDownloadPdf = () => {
    setSuccessToast(`📥 Prova editorial Volume I (${family.name}) baixada com sucesso!`)
    setShowPdfModal(false)
    setTimeout(() => setSuccessToast(null), 3000)
  }

  const handleAttachPhoto = () => {
    setSuccessToast('✓ Fotografia histórica de Nápoles (1887) anexada à prancha do capítulo!')
    setTimeout(() => setSuccessToast(null), 3500)
  }

  return (
    <div className={styles.container}>
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

      {/* Book Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.bookCover}>
          <div className={styles.coverSpine} />
          <div className={styles.coverFace}>
            <div className={styles.coverEmblem}>{family.symbol || '🌿'}</div>
            <h2 className={styles.coverTitle}>Memorial da Família</h2>
            <h3 className={styles.coverSubtitle}>{family.surname}</h3>
            <p className={styles.coverMotto}>"{family.motto || 'Da origem ao legado'}"</p>
            <span className={styles.coverYear}>Edição Genealógica · 2026</span>
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badgeRow}>
            <span className="badge badge-amber">Livro Familiar em Construção</span>
            <span className={styles.editionMeta}>Volume I · Linha Principal</span>
          </div>

          <h1 className={styles.mainTitle}>O Livro de Memórias da Família</h1>
          <p className={styles.mainDesc}>
            Uma obra editorial gerada com base em todas as pesquisas, depoimentos, fotos e documentos
            convalidados pela família. Estruturada para publicação física ou preservação digital perpétua.
          </p>

          <div className={styles.progressContainer}>
            <div className={styles.progressLabels}>
              <span>Progresso Editorial</span>
              <span className={styles.progressPct}>{progress}% concluído</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className={styles.heroActions}>
            <button
              className="btn btn-primary"
              id="generate-pdf-btn"
              type="button"
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? '⏳ Diagramando PDF...' : '📄 Gerar Prova em PDF'}
            </button>
            <button
              className="btn btn-secondary"
              id="compile-book-btn"
              type="button"
              onClick={handleRecompile}
              disabled={isCompiling}
            >
              {isCompiling ? '✨ Analisando novos relatos...' : '✨ Recompilar com Novos Fatos'}
            </button>
          </div>
        </div>
      </div>

      {/* Chapters & Content Layout */}
      <div className={styles.contentLayout}>
        {/* Chapters Column */}
        <div className={styles.chaptersSidebar}>
          <h3 className={styles.sectionHeading}>Capítulos do Livro</h3>
          <div className={styles.chapterList}>
            {chapters.map((ch, idx) => {
              const isSelected = selectedChapter?.id === ch.id
              return (
                <div
                  key={ch.id}
                  className={`${styles.chapterCard} ${isSelected ? styles.chapterActive : ''}`}
                  onClick={() => setSelectedChapter(ch)}
                >
                  <div className={styles.chapterNumber}>0{idx + 1}</div>
                  <div className={styles.chapterInfo}>
                    <div className={styles.chapterTitle}>{ch.title}</div>
                    <span className={`badge ${ch.status === 'PUBLISHED' ? 'badge-olive' : 'badge-sepia'}`}>
                      {ch.status === 'PUBLISHED' ? 'Finalizado' : 'Em Elaboração'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chapter Preview Column */}
        <div className={styles.previewArea}>
          {selectedChapter ? (
            <div className={styles.chapterPaper}>
              <div className={styles.paperHeader}>
                <span className={styles.paperCap}>Capítulo 0{selectedChapter.order}</span>
                <h2 className={styles.paperTitle}>{selectedChapter.title}</h2>
                <div className={styles.paperDivider}>❦</div>
              </div>

              <div className={styles.paperBody}>
                {isEditingChapter ? (
                  <div style={{ marginBottom: '16px' }}>
                    <textarea
                      className="form-input"
                      rows={6}
                      value={chapterText}
                      onChange={e => setChapterText(e.target.value)}
                      style={{ width: '100%', fontFamily: 'var(--font-serif)', fontSize: '1rem', lineHeight: '1.7' }}
                    />
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setIsEditingChapter(false)
                          setSuccessToast('✓ Parágrafo do capítulo atualizado!')
                          setTimeout(() => setSuccessToast(null), 3000)
                        }}
                      >
                        Salvar Alteração
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setIsEditingChapter(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.paperLead}>
                    {chapterText}
                  </p>
                )}

                <p>
                  A viagem no vapor durou vinte e oito dias sobre as águas do Atlântico. Entre malas de couro
                  amarradas com cordas grossas e o martelo herdado do pai, guardava-se não apenas a técnica
                  da forja de metais, mas a promessa solene de que nenhum descendente esqueceria o solo
                  onde tudo havia começado.
                </p>

                <div className={styles.paperQuote}>
                  “O ferro se dobra com o fogo e o braço forte, mas a memória familiar resiste a qualquer tempestade.”
                  <span className={styles.paperAuthor}>— Giuseppe Ferraro, anotações de 1912</span>
                </div>

                <p>
                  Ao desembarcar no cais de Santos em outubro de 1888, o calor tropical e o aroma úmido da mata
                  marcaram o primeiro capítulo da história que hoje sustenta sete gerações e mais de duas centenas
                  de descendentes espalhados por todo o território nacional.
                </p>
              </div>

              <div className={styles.paperFooter}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  id="edit-chapter-btn"
                  onClick={() => setIsEditingChapter(prev => !prev)}
                >
                  {isEditingChapter ? 'Cancelar Edição' : 'Editar Capítulo'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  id="insert-photo-btn"
                  onClick={handleAttachPhoto}
                >
                  + Anexar Fotografia Antiga
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyPreview}>
              Selecione um capítulo ao lado para visualizar a diagramação.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Prévia da Prova em PDF */}
      {showPdfModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 5, 2, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 120,
          }}
          onClick={() => setShowPdfModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              background: 'var(--clr-bark)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-olive" style={{ marginBottom: '4px', display: 'inline-block' }}>
                  Prova Editorial Pronta para Impressão
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-parchment)', fontSize: '1.3rem' }}>
                  Memorial da Família {family.name} — Volume I
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-text-faint)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                padding: '20px',
                background: '#FDFBF7',
                color: '#2D1A08',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-serif)',
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '1px solid #E0D2BE', paddingBottom: '14px', marginBottom: '14px' }}>
                <span style={{ fontSize: '2rem' }}>{family.symbol || '🌿'}</span>
                <h3 style={{ fontSize: '1.4rem', margin: '4px 0', fontWeight: 700 }}>FAMÍLIA {family.name.toUpperCase()}</h3>
                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#6A5038' }}>"{family.motto}"</p>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Edição de Luxo · 2026</span>
              </div>
              <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                <strong>Sumário Geral:</strong>
              </p>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '20px', margin: 0 }}>
                <li>Capítulo I: As Origens em Nápoles e a Travessia do Atlântico (1888)</li>
                <li>Capítulo II: A Forja de São Paulo e o Ofício da Rua do Comércio (1905)</li>
                <li>Capítulo III: Cartas Transatlânticas e o Período Entre Guerras</li>
                <li>Capítulo IV: Ramificações, Casamentos e as Sete Gerações</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPdfModal(false)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownloadPdf}
                id="confirm-download-pdf-btn"
              >
                📥 Baixar Arquivo PDF de Impressão (38.4 MB)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
