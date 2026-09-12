'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './pessoas.module.css'
import { MOCK_PEOPLE } from '@/lib/mock-data'
import type { Person, EvidenceStatus } from '@/types'

const EVIDENCE_BADGE_CLASS: Record<EvidenceStatus, string> = {
  CONFIRMED: 'badge-olive',
  REPORTED: 'badge-amber',
  INFERRED: 'badge-amber',
  UNCONFIRMED: 'badge-sepia',
  INVESTIGATING: 'badge-amber',
}

const EVIDENCE_LABEL: Record<EvidenceStatus, string> = {
  CONFIRMED: 'Confirmado',
  REPORTED: 'Reportado',
  INFERRED: 'Inferido',
  UNCONFIRMED: 'Não Confirmado',
  INVESTIGATING: 'Investigando',
}

export default function PessoasPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | EvidenceStatus>('ALL')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const filtered = MOCK_PEOPLE.filter(p => {
    const fullName = `${p.firstName} ${p.lastName ?? ''}`.toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase()) ||
      (p.occupation && p.occupation.toLowerCase().includes(search.toLowerCase())) ||
      (p.birthPlace && p.birthPlace.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = filter === 'ALL' || p.evidenceStatus === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pessoas da Família</h1>
          <p className={styles.subtitle}>
            {MOCK_PEOPLE.length} antepassados e familiares documentados com evidências genealógicas.
          </p>
        </div>
        <button className="btn btn-primary" id="add-person-btn">
          + Cadastrar Pessoa
        </button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nome, profissão, local..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="people-search-input"
          />
        </div>

        <div className={styles.statusPills}>
          <button
            className={`${styles.pill} ${filter === 'ALL' ? styles.pillActive : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Todos ({MOCK_PEOPLE.length})
          </button>
          {(['CONFIRMED', 'REPORTED', 'INFERRED', 'INVESTIGATING'] as EvidenceStatus[]).map(status => (
            <button
              key={status}
              className={`${styles.pill} ${filter === status ? styles.pillActive : ''}`}
              onClick={() => setFilter(status)}
            >
              {EVIDENCE_LABEL[status]} ({MOCK_PEOPLE.filter(p => p.evidenceStatus === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map(person => {
          const status = person.evidenceStatus ?? 'UNCONFIRMED'
          const badgeClass = EVIDENCE_BADGE_CLASS[status]

          return (
            <div
              key={person.id}
              className={styles.card}
              onClick={() => setSelectedPerson(person)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelectedPerson(person)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {person.firstName[0]}
                  {person.lastName ? person.lastName[0] : ''}
                </div>
                <div className={styles.cardMeta}>
                  <h3 className={styles.personName}>
                    {person.firstName} {person.lastName}
                  </h3>
                  <span className={`badge ${badgeClass}`}>
                    {EVIDENCE_LABEL[status]}
                  </span>
                </div>
              </div>

              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Período:</span>
                  <span>{person.birthDate || '?'} – {person.deathDate || 'vivo'}</span>
                </div>
                {person.birthPlace && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Origem:</span>
                    <span>{person.birthPlace}</span>
                  </div>
                )}
                {person.occupation && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Profissão:</span>
                    <span>{person.occupation}</span>
                  </div>
                )}
              </div>

              {person.notes && (
                <p className={styles.cardSnippet}>{person.notes}</p>
              )}

              <div className={styles.cardActions}>
                <Link
                  href={`/familia/fam-001/arvore`}
                  className={styles.actionLink}
                  onClick={e => e.stopPropagation()}
                >
                  Ver na árvore →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal / Detail Drawer */}
      {selectedPerson && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPerson(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleArea}>
                <h2 className={styles.modalTitle}>
                  {selectedPerson.firstName} {selectedPerson.lastName}
                </h2>
                <span className={`badge ${EVIDENCE_BADGE_CLASS[selectedPerson.evidenceStatus ?? 'UNCONFIRMED']}`}>
                  {EVIDENCE_LABEL[selectedPerson.evidenceStatus ?? 'UNCONFIRMED']}
                </span>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedPerson(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoSection}>
                <h4>Dados Pessoais & Linhagem</h4>
                <div className={styles.infoGrid}>
                  <div>
                    <span className={styles.infoKey}>Nascimento</span>
                    <p className={styles.infoVal}>{selectedPerson.birthDate || 'Desconhecido'} ({selectedPerson.birthPlace || 'Local não informado'})</p>
                  </div>
                  <div>
                    <span className={styles.infoKey}>Falecimento</span>
                    <p className={styles.infoVal}>{selectedPerson.deathDate || 'Em vida / não registrado'} ({selectedPerson.deathPlace || '—'})</p>
                  </div>
                  <div>
                    <span className={styles.infoKey}>Nacionalidade</span>
                    <p className={styles.infoVal}>{selectedPerson.nationality || 'Não especificada'}</p>
                  </div>
                  <div>
                    <span className={styles.infoKey}>Ocupação</span>
                    <p className={styles.infoVal}>{selectedPerson.occupation || 'Não especificada'}</p>
                  </div>
                </div>
              </div>

              {selectedPerson.notes && (
                <div className={styles.infoSection}>
                  <h4>Memórias & Anotações de Campo</h4>
                  <p className={styles.notesBox}>{selectedPerson.notes}</p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setSelectedPerson(null)}>
                Fechar
              </button>
              <button className="btn btn-primary" id="modal-edit-btn">
                Editar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
