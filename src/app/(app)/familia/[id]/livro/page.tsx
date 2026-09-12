'use client'
import { useState } from 'react'
import styles from './livro.module.css'
import { MOCK_BOOK_CHAPTERS, MOCK_FAMILIES } from '@/lib/mock-data'
import type { BookChapter } from '@/types'

export default function LivroPage() {
  const [chapters, setChapters] = useState<BookChapter[]>(MOCK_BOOK_CHAPTERS)
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(MOCK_BOOK_CHAPTERS[0])
  const family = MOCK_FAMILIES[0]
  const progress = family.stats?.bookProgress || 72

  return (
    <div className={styles.container}>
      {/* Book Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.bookCover}>
          <div className={styles.coverSpine} />
          <div className={styles.coverFace}>
            <div className={styles.coverEmblem}>🌿</div>
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
            <button className="btn btn-primary" id="generate-pdf-btn">
              📄 Gerar Prova em PDF
            </button>
            <button className="btn btn-secondary" id="compile-book-btn">
              ✨ Recompilar com Novos Fatos
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
                <p className={styles.paperLead}>
                  Nos últimos anos do século XIX, quando as primeiras notícias da terra além-mar
                  ecoavam pelas colinas ensolaradas de Nápoles, Giuseppe Ferraro reuniu a coragem
                  ancestral de seus antepassados para fincar novas raízes no continente sul-americano.
                </p>

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
                <button className="btn btn-secondary btn-sm" id="edit-chapter-btn">
                  Editar Capítulo
                </button>
                <button className="btn btn-ghost btn-sm" id="insert-photo-btn">
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
    </div>
  )
}
