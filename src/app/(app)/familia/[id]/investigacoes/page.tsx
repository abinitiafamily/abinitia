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
        <button className="btn btn-primary" id="open-investigation-btn">
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
          className={`${styles.tabBtn} ${filter === 'ALL' ? styles.tabActive : ''}`}
          onClick={() => setFilter('ALL')}
        >
          Todas ({investigations.length})
        </button>
        <button
          className={`${styles.tabBtn} ${filter === 'INVESTIGATING' ? styles.tabActive : ''}`}
          onClick={() => setFilter('INVESTIGATING')}
        >
          🔍 Em Andamento ({investigations.filter(i => i.status === 'INVESTIGATING').length})
        </button>
        <button
          className={`${styles.tabBtn} ${filter === 'OPEN' ? styles.tabActive : ''}`}
          onClick={() => setFilter('OPEN')}
        >
          ⚠️ Em Aberto ({investigations.filter(i => i.status === 'OPEN').length})
        </button>
        <button
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
    </div>
  )
}
