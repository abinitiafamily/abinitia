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
  const [people, setPeople] = useState<Person[]>(MOCK_PEOPLE)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | EvidenceStatus>('ALL')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Formulário de cadastro de nova pessoa
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('Ferraro')
  const [birthDate, setBirthDate] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [occupation, setOccupation] = useState('')
  const [evidenceStatus, setEvidenceStatus] = useState<EvidenceStatus>('CONFIRMED')
  const [notes, setNotes] = useState('')

  const filtered = people.filter(p => {
    const fullName = `${p.firstName} ${p.lastName ?? ''}`.toLowerCase()
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      (p.occupation && p.occupation.toLowerCase().includes(search.toLowerCase())) ||
      (p.birthPlace && p.birthPlace.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = filter === 'ALL' || p.evidenceStatus === filter
    return matchesSearch && matchesFilter
  })

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim()) return

    const newPerson: Person = {
      id: `p-${Date.now()}`,
      familyId: 'fam-001',
      firstName,
      lastName: lastName.trim() || undefined,
      birthDate: birthDate.trim() || undefined,
      birthPlace: birthPlace.trim() || undefined,
      occupation: occupation.trim() || undefined,
      evidenceStatus,
      notes: notes.trim() || undefined,
      createdById: 'user-001',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setPeople(prev => [newPerson, ...prev])
    setShowAddModal(false)

    // Reset campos
    setFirstName('')
    setBirthDate('')
    setBirthPlace('')
    setOccupation('')
    setNotes('')

    setSuccessToast(`✓ ${newPerson.firstName} ${newPerson.lastName || ''} cadastrado com sucesso na árvore!`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pessoas da Família</h1>
          <p className={styles.subtitle}>
            {people.length} antepassados e familiares documentados com evidências genealógicas.
          </p>
        </div>
        <button
          className="btn btn-primary"
          id="add-person-btn"
          type="button"
          onClick={() => setShowAddModal(true)}
        >
          + Cadastrar Pessoa
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
            type="button"
            className={`${styles.pill} ${filter === 'ALL' ? styles.pillActive : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Todos ({people.length})
          </button>
          {(['CONFIRMED', 'REPORTED', 'INFERRED', 'INVESTIGATING'] as EvidenceStatus[]).map(status => (
            <button
              type="button"
              key={status}
              className={`${styles.pill} ${filter === status ? styles.pillActive : ''}`}
              onClick={() => setFilter(status)}
            >
              {EVIDENCE_LABEL[status]} ({people.filter(p => p.evidenceStatus === status).length})
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

      {/* Modal: Cadastrar Nova Pessoa */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleArea}>
                <h2 className={styles.modalTitle}>Cadastrar Nova Pessoa</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                  Adicione um antepassado ou familiar à base genealógica.
                </p>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePerson}>
              <div className={styles.modalBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Nome *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Giovanni"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sobrenome</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Ferraro"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Ano / Data de Nascimento</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: 1892 ou 14/05/1892"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Local de Nascimento</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Nápoles, Itália"
                      value={birthPlace}
                      onChange={e => setBirthPlace(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Profissão / Ocupação</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Ferreiro, Tecelã"
                      value={occupation}
                      onChange={e => setOccupation(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grau de Evidência</label>
                    <select
                      className="form-input"
                      value={evidenceStatus}
                      onChange={e => setEvidenceStatus(e.target.value as EvidenceStatus)}
                    >
                      <option value="CONFIRMED">Confirmado (com certidão)</option>
                      <option value="REPORTED">Reportado (relato oral)</option>
                      <option value="INFERRED">Inferido (por contexto)</option>
                      <option value="INVESTIGATING">Em Investigação</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Anotações & Memórias de Família</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Detalhes sobre a vida, histórias passadas por parentes, etc..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
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
                  id="submit-person-btn"
                >
                  Salvar Pessoa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Pessoa Selecionada */}
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
                type="button"
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
              <Link
                href="/agente"
                className="btn btn-secondary"
                id="investigate-with-agent-btn"
              >
                🎙️ Investigar com o Agente IA
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedPerson(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
