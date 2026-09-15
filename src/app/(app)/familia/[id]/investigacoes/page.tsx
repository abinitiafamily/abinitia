'use client'

import { useState } from 'react'
import styles from './investigacoes.module.css'

interface Investigation {
  id: string
  title: string
  personName: string
  personId: string
  type: 'DIVERGENCE' | 'MISSING_DATA' | 'HOMONYM' | 'UNCONFIRMED_ORIGIN'
  description: string
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  divergenceDetails?: {
    versionA: { source: string; claim: string }
    versionB: { source: string; claim: string }
  }
  hypothesis?: string
  dateOpened: string
}

const MOCK_INVESTIGATIONS: Investigation[] = [
  {
    id: 'inv-001',
    title: 'Divergência na data de nascimento de Giuseppe Ferraro',
    personName: 'Giuseppe Ferraro',
    personId: 'p-001',
    type: 'DIVERGENCE',
    description: 'A certidão de óbito de São Paulo indica nascimento em 1863, enquanto o registro de desembarque no Porto de Santos aponta idade correspondente a nascimento em 1865.',
    status: 'INVESTIGATING',
    priority: 'HIGH',
    divergenceDetails: {
      versionA: { source: 'Registro de Desembarque (Santos, 1888)', claim: '23 anos (Nascimento provável: 1865)' },
      versionB: { source: 'Certidão de Óbito (São Paulo, 1942)', claim: '79 anos (Nascimento provável: 1863)' },
    },
    hypothesis: 'Comum à época declarar idade aproximada no óbito. O registro consular de Nápoles deve ser consultado para validação definitiva.',
    dateOpened: '18/02/2026',
  },
  {
    id: 'inv-002',
    title: 'Paradeiro e descendência do irmão Matteo Ferraro',
    personName: 'Matteo Ferraro (Salerno)',
    personId: 'p-new-01',
    type: 'UNCONFIRMED_ORIGIN',
    description: 'Relato oral menciona que Giuseppe deixou um irmão ferreiro na província de Salerno. Não há registros de migração para as Américas.',
    status: 'OPEN',
    priority: 'MEDIUM',
    hypothesis: 'Possível ramo da família remanescente na região de Campânia, Itália.',
    dateOpened: '11/09/2026',
  },
  {
    id: 'inv-003',
    title: 'Local exato do casamento de Giuseppe e Rosa Carbone',
    personName: 'Giuseppe & Rosa Ferraro',
    personId: 'p-001',
    type: 'MISSING_DATA',
    description: 'Sabemos que se casaram em 1887 na Itália antes do embarque, mas falta a identificação da paróquia (Nápoles ou Salerno).',
    status: 'INVESTIGATING',
    priority: 'LOW',
    dateOpened: '05/03/2026',
  },
]

export default function InvestigacoesPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>(MOCK_INVESTIGATIONS)
  const [selectedInv, setSelectedInv] = useState<Investigation | null>(MOCK_INVESTIGATIONS[0])
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'INVESTIGATING' | 'RESOLVED'>('ALL')
  const [resolutionText, setResolutionText] = useState('')
  const [resolvedStatus, setResolvedStatus] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  // Campos de nova investigação
  const [newTitle, setNewTitle] = useState('')
  const [newPersonName, setNewPersonName] = useState('')
  const [newType, setNewType] = useState<Investigation['type']>('DIVERGENCE')
  const [newPriority, setNewPriority] = useState<Investigation['priority']>('HIGH')
  const [newDescription, setNewDescription] = useState('')
  const [newHypothesis, setNewHypothesis] = useState('')

  const filtered = filter === 'ALL'
    ? investigations
    : investigations.filter(i => i.status === filter)

  const handleResolve = (id: string) => {
    setInvestigations(prev => prev.map(inv =>
      inv.id === id ? { ...inv, status: 'RESOLVED' as const } : inv
    ))
    setResolvedStatus('✓ Investigação concluída e registrada no dossiê histórico!')
    setTimeout(() => setResolvedStatus(null), 3500)
  }

  const handleCreateInvestigation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDescription.trim()) return

    const newInv: Investigation = {
      id: `inv-00${investigations.length + 1}`,
      title: newTitle,
      personName: newPersonName.trim() || 'Familiar Geral',
      personId: 'p-gen',
      type: newType,
      priority: newPriority,
      description: newDescription,
      hypothesis: newHypothesis.trim() || undefined,
      status: 'OPEN',
      dateOpened: new Date().toLocaleDateString('pt-BR'),
    }

    setInvestigations(prev => [newInv, ...prev])
    setSelectedInv(newInv)
    setShowNewModal(false)

    // Reset campos
    setNewTitle('')
    setNewPersonName('')
    setNewDescription('')
    setNewHypothesis('')

    setResolvedStatus(`✓ Investigação "${newInv.title}" aberta com sucesso!`)
    setTimeout(() => setResolvedStatus(null), 3500)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.badgeRow}>
            <span className="badge badge-amber">Agente Investigador & Análise de Evidências</span>
            <span className={styles.ucBadge}>UC-022 · UC-023 · UC-024</span>
          </div>
          <h1 className={styles.title}>Investigações & Divergências Genealógicas</h1>
          <p className={styles.subtitle}>
            Rastreamento de lacunas, fontes conflitantes e hipóteses históricas sem apagar registros anteriores.
          </p>
        </div>
        <button
          className="btn btn-primary"
          id="open-investigation-btn"
          type="button"
          onClick={() => setShowNewModal(true)}
        >
          + Abrir Nova Investigação
        </button>
      </div>

      {resolvedStatus && (
        <div className={styles.alertSuccess}>
          {resolvedStatus}
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${filter === 'ALL' ? styles.tabActive : ''}`}
          onClick={() => setFilter('ALL')}
        >
          Todas ({investigations.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${filter === 'INVESTIGATING' ? styles.tabActive : ''}`}
          onClick={() => setFilter('INVESTIGATING')}
        >
          🔍 Em Andamento ({investigations.filter(i => i.status === 'INVESTIGATING').length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${filter === 'OPEN' ? styles.tabActive : ''}`}
          onClick={() => setFilter('OPEN')}
        >
          ⚠️ Em Aberto ({investigations.filter(i => i.status === 'OPEN').length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${filter === 'RESOLVED' ? styles.tabActive : ''}`}
          onClick={() => setFilter('RESOLVED')}
        >
          ✓ Concluídas ({investigations.filter(i => i.status === 'RESOLVED').length})
        </button>
      </div>

      {/* Two Column Layout */}
      <div className={styles.contentGrid}>
        {/* Left: List */}
        <div className={styles.listCol}>
          {filtered.map(inv => {
            const isSelected = selectedInv?.id === inv.id
            return (
              <div
                key={inv.id}
                className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                onClick={() => setSelectedInv(inv)}
              >
                <div className={styles.cardHeader}>
                  <span className={`badge ${inv.status === 'RESOLVED' ? 'badge-olive' : 'badge-amber'}`}>
                    {inv.status === 'RESOLVED' ? 'Resolvida' : inv.status === 'INVESTIGATING' ? 'Investigando' : 'Aberta'}
                  </span>
                  <span className={styles.priorityBadge}>
                    Prioridade {inv.priority === 'HIGH' ? 'Alta' : inv.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{inv.title}</h3>
                <span className={styles.targetPerson}>👤 {inv.personName}</span>

                <p className={styles.cardSnippet}>{inv.description}</p>

                <div className={styles.cardFooter}>
                  <span>Aberta em {inv.dateOpened}</span>
                  <span className={styles.viewLink}>Ver evidências →</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Detailed Dossier */}
        <div className={styles.detailCol}>
          {selectedInv ? (
            <div className={styles.dossierCard}>
              <div className={styles.dossierHeader}>
                <span className={styles.dossierPre}>Dossiê Investigativo · {selectedInv.id}</span>
                <h2 className={styles.dossierTitle}>{selectedInv.title}</h2>
                <span className={styles.dossierPerson}>Antepassado Vinculado: <strong>{selectedInv.personName}</strong></span>
              </div>

              <div className={styles.dossierBody}>
                <div className={styles.sectionBlock}>
                  <h4 className={styles.blockTitle}>Descrição do Fato a Investigar</h4>
                  <p className={styles.blockDesc}>{selectedInv.description}</p>
                </div>

                {/* Divergence Comparison Box */}
                {selectedInv.divergenceDetails && (
                  <div className={styles.divergenceBox}>
                    <h4 className={styles.divergenceTitle}>⚖️ Versões Conflitantes Preservadas (UC-022)</h4>
                    <p className={styles.divergenceHint}>
                      O princípio de preservação histórica do ABINITIA proíbe apagar fontes divergentes. Ambas são mantidas para escrutínio:
                    </p>
                    <div className={styles.comparisonGrid}>
                      <div className={styles.versionCard}>
                        <span className={styles.versionTag}>Fonte A</span>
                        <strong className={styles.versionSource}>{selectedInv.divergenceDetails.versionA.source}</strong>
                        <p className={styles.versionClaim}>"{selectedInv.divergenceDetails.versionA.claim}"</p>
                      </div>
                      <div className={styles.versionCard}>
                        <span className={styles.versionTag}>Fonte B</span>
                        <strong className={styles.versionSource}>{selectedInv.divergenceDetails.versionB.source}</strong>
                        <p className={styles.versionClaim}>"{selectedInv.divergenceDetails.versionB.claim}"</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedInv.hypothesis && (
                  <div className={styles.sectionBlock}>
                    <h4 className={styles.blockTitle}>Hipótese Genealógica Atual</h4>
                    <p className={styles.hypothesisText}>💡 {selectedInv.hypothesis}</p>
                  </div>
                )}

                {selectedInv.status !== 'RESOLVED' && (
                  <div className={styles.resolutionForm}>
                    <h4 className={styles.blockTitle}>Registrar Conclusão ou Evidência Comprobatória (UC-024)</h4>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Descreva o documento, certidão ou confirmação que soluciona esta divergência..."
                      value={resolutionText}
                      onChange={e => setResolutionText(e.target.value)}
                    />
                    <div className={styles.resolutionActions}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleResolve(selectedInv.id)}
                        disabled={!resolutionText.trim()}
                      >
                        ✓ Concluir Investigação e Atualizar Árvore
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>
              Selecione uma investigação para abrir o dossiê detalhado.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Nova Investigação */}
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
                Abrir Nova Investigação Genealógica
              </h2>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-text-faint)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvestigation}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Título da Divergência / Questão *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Divergência no sobrenome de registro do bisavô"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Antepassado Vinculado</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Giuseppe Ferraro"
                    value={newPersonName}
                    onChange={e => setNewPersonName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prioridade</label>
                  <select
                    className="form-input"
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                  >
                    <option value="HIGH">Alta (Bloqueia ramo da árvore)</option>
                    <option value="MEDIUM">Média (Lacuna biográfica)</option>
                    <option value="LOW">Baixa (Curiosidade histórica)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Tipo de Investigação</label>
                <select
                  className="form-input"
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                >
                  <option value="DIVERGENCE">⚖️ Divergência entre Fontes (Datas/Nomes)</option>
                  <option value="MISSING_DATA">❓ Dado Faltante (Certidão / Óbito)</option>
                  <option value="HOMONYM">👥 Homônimo Provável</option>
                  <option value="UNCONFIRMED_ORIGIN">📍 Origem / Cidade não confirmada</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Descrição da Lacuna / Fato *</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Descreva o que os documentos ou relatos orais apontam..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Hipótese Inicial</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Erro de grafia na certidão de imigração ou transliteração"
                  value={newHypothesis}
                  onChange={e => setNewHypothesis(e.target.value)}
                />
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
                  id="submit-inv-btn"
                >
                  Registrar Investigação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
