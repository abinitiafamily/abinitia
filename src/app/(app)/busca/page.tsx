'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './busca.module.css'
import { MOCK_FAMILIES } from '@/lib/mock-data'
import type { Family } from '@/types'

export default function BuscaFamiliasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [requestSent, setRequestSent] = useState<string | null>(null)
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
  const [message, setMessage] = useState('')

  const filteredFamilies = MOCK_FAMILIES.filter(f => {
    const term = searchTerm.toLowerCase()
    return f.name.toLowerCase().includes(term) ||
      (f.origin && f.origin.toLowerCase().includes(term)) ||
      (f.description && f.description.toLowerCase().includes(term))
  })

  const handleSendRequest = (famId: string) => {
    setRequestSent(famId)
    setSelectedFamily(null)
    setMessage('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.heroSearch}>
        <h1 className={styles.title}>Busca de Famílias Cadastradas</h1>
        <p className={styles.subtitle}>
          Encontre ramificações de sua linhagem em famílias públicas ou solicite entrada em árvores existentes.
        </p>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Digite o sobrenome, cidade de origem ou palavra-chave (ex: Ferraro, Nápoles, Silva)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            id="family-search-input"
          />
        </div>
      </div>

      {requestSent && (
        <div className={styles.alertSuccess}>
          <span>✓ Solicitação de ingresso enviada ao criador da família com sucesso! Você será notificado quando for aprovado.</span>
        </div>
      )}

      {/* Families Results Grid */}
      <div className={styles.resultsGrid}>
        {filteredFamilies.map(family => (
          <div key={family.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.symbol}>{family.symbol || '🌳'}</div>
              <div className={styles.meta}>
                <h3 className={styles.familyName}>Família {family.name}</h3>
                <span className={styles.origin}>📍 {family.origin || 'Origem não declarada'}</span>
              </div>
              <span className={`badge ${family.isPublic ? 'badge-olive' : 'badge-sepia'}`}>
                {family.isPublic ? 'Pública' : 'Privada'}
              </span>
            </div>

            <p className={styles.desc}>{family.description}</p>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{family.stats?.people ?? 0}</span>
                <span className={styles.statLabel}>Pessoas</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{family.stats?.generations ?? 0}</span>
                <span className={styles.statLabel}>Gerações</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{family.stats?.stories ?? 0}</span>
                <span className={styles.statLabel}>Histórias</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <Link href={`/familia/${family.id}/arvore`} className="btn btn-ghost btn-sm">
                Explorar Árvore
              </Link>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedFamily(family)}
                disabled={requestSent === family.id}
              >
                {requestSent === family.id ? 'Solicitado' : 'Solicitar Ingresso'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {selectedFamily && (
        <div className={styles.modalOverlay} onClick={() => setSelectedFamily(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalPre}>Solicitação de Ingresso</span>
                <h2 className={styles.modalTitle}>Família {selectedFamily.name}</h2>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedFamily(null)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDesc}>
                Para garantir a integridade da genealogia, a entrada de novos membros
                precisa ser validada e aprovada pelo criador do perfil familiar.
              </p>

              <div className={styles.formGroup}>
                <label className="form-label">Como você se conecta a esta família?</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Ex: Sou neto de Antonio Ferraro, filho de Paulo Ferraro. Tenho documentos de nascimento de 1952 em Santos..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  id="join-reason-textarea"
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setSelectedFamily(null)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleSendRequest(selectedFamily.id)}
                disabled={!message.trim()}
                id="confirm-join-request-btn"
              >
                Enviar Solicitação ao Criador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
