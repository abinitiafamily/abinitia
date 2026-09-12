'use client'
import { useState } from 'react'
import styles from './configuracoes.module.css'
import { MOCK_FAMILIES } from '@/lib/mock-data'

interface AuditLog {
  id: string
  action: string
  entity: string
  performedBy: string
  date: string
  ipHash: string
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-1', action: 'Cadastro de Pessoa', entity: 'Carolina Ferraro (p-006)', performedBy: 'Carolina Ferraro', date: 'Hoje às 14:32', ipHash: '189.44.***' },
  { id: 'aud-2', action: 'Aprovação de Ingresso', entity: 'Carlos Ferraro (user-002)', performedBy: 'Carolina Ferraro', date: 'Ontem às 19:10', ipHash: '189.44.***' },
  { id: 'aud-3', action: 'Adição de Documento', entity: 'Certidão de Desembarque 1888', performedBy: 'Carolina Ferraro', date: '10/09/2026 às 11:20', ipHash: '189.44.***' },
  { id: 'aud-4', action: 'Criação de Ramificação', entity: 'Ramo Antonio & Maria', performedBy: 'Carolina Ferraro', date: '08/09/2026 às 16:45', ipHash: '189.44.***' },
]

export default function ConfiguracoesPage() {
  const [family, setFamily] = useState(MOCK_FAMILIES[0])
  const [symbol, setSymbol] = useState(family.symbol || '🌿')
  const [motto, setMotto] = useState(family.motto || 'Ferro e esperança')
  const [isPublic, setIsPublic] = useState(family.isPublic)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setFamily(prev => ({ ...prev, symbol, motto, isPublic }))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.badgeRow}>
            <span className="badge badge-amber">Governança & Identidade</span>
            <span className={styles.ucBadge}>UC-033 · UC-034 · UC-035 · LGPD</span>
          </div>
          <h1 className={styles.title}>Identidade Familiar, Selo & Privacidade</h1>
          <p className={styles.subtitle}>
            Personalize os símbolos do legado, defina a visibilidade perante a comunidade e consulte a trilha de auditoria.
          </p>
        </div>
      </div>

      {saved && (
        <div className={styles.alertSuccess}>
          ✓ Configurações e Selo Familiar atualizados com sucesso!
        </div>
      )}

      <div className={styles.layout}>
        {/* Form Column */}
        <div className={styles.mainCol}>
          {/* Selo Familiar Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🏛️ Selo Familiar & Identidade (UC-035)</h2>
            <p className={styles.cardDesc}>
              O selo representa o escudo moral e visual da linhagem, aplicado no frontispício do Livro e nas certidões da família.
            </p>

            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.sealPreviewRow}>
                <div className={styles.sealEmblem}>
                  <span className={styles.sealIcon}>{symbol}</span>
                  <div className={styles.sealRing} />
                </div>
                <div className={styles.sealText}>
                  <h3 className={styles.sealFamilyName}>Família {family.name}</h3>
                  <p className={styles.sealMottoDisplay}>"{motto}"</p>
                  <span className={styles.sealMeta}>Selo Oficial Registrado · 2026</span>
                </div>
              </div>

              <div className={styles.inputsGrid}>
                <div className={styles.formGroup}>
                  <label className="form-label">Símbolo Heráldico / Emblema</label>
                  <div className={styles.symbolSelector}>
                    {['🌿', '🌳', '🦅', '⚔️', '⚓', '🛡️', '🦁', '👑'].map(s => (
                      <button
                        key={s}
                        type="button"
                        className={`${styles.symbolBtn} ${symbol === s ? styles.symbolBtnActive : ''}`}
                        onClick={() => setSymbol(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className="form-label">Lema Familiar / Divisa Ancestral</label>
                  <input
                    type="text"
                    className="form-input"
                    value={motto}
                    onChange={e => setMotto(e.target.value)}
                    placeholder="Ex: Honra, trabalho e memória"
                  />
                </div>
              </div>

              {/* Privacy & LGPD */}
              <div className={styles.divider} />

              <h2 className={styles.cardTitle}>🔒 Privacidade & Consentimentos LGPD (UC-033)</h2>
              <p className={styles.cardDesc}>
                Conforme as diretrizes do documento de segurança e privacidade da ABINITIA,
                você controla se sua árvore é descobrível por parentes na busca pública.
              </p>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong>Árvore Visível na Busca Pública</strong>
                  <span>Permite que parentes de mesmo sobrenome ou linhagem localizem a família e peçam ingresso.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                  className={styles.toggleCheckbox}
                />
              </div>

              <div className={styles.actionRow}>
                <button type="submit" className="btn btn-primary" id="save-seal-btn">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          {/* Audit Log Card */}
          <div className={styles.card}>
            <div className={styles.auditHeader}>
              <div>
                <h2 className={styles.cardTitle}>📋 Trilha de Auditoria & Integridade (UC-034)</h2>
                <p className={styles.cardDesc}>
                  Registro perpétuo e imutável de todas as adições, edições e aprovações genealógicas.
                </p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.auditTable}>
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Alvo / Entidade</th>
                    <th>Responsável</th>
                    <th>Data / Hora</th>
                    <th>Origem</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_AUDIT_LOGS.map(log => (
                    <tr key={log.id}>
                      <td className={styles.actionCell}>{log.action}</td>
                      <td>{log.entity}</td>
                      <td>{log.performedBy}</td>
                      <td className={styles.dateCell}>{log.date}</td>
                      <td className={styles.ipCell}>{log.ipHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
