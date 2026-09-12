'use client'
import { useState } from 'react'
import styles from './convites.module.css'
import { MOCK_JOIN_REQUESTS, MOCK_PEOPLE } from '@/lib/mock-data'
import type { JoinRequest } from '@/types'

export default function ConvitesPage() {
  const [requests, setRequests] = useState<JoinRequest[]>(MOCK_JOIN_REQUESTS)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setRequests(prev => prev.filter(r => r.id !== id))
    setStatusMsg(
      action === 'APPROVED'
        ? '✓ Solicitação aprovada com sucesso! O novo familiar foi integrado à árvore.'
        : 'Solicitação recusada.'
    )
    setTimeout(() => setStatusMsg(null), 4000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Solicitações de Entrada & Aprovações</h1>
          <p className={styles.subtitle}>
            Para preservar a fidelidade genealógica, todo novo membro precisa da sua aprovação
            para se conectar à árvore da Família Ferraro.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className={styles.alert}>
          {statusMsg}
        </div>
      )}

      {requests.length === 0 ? (
        <div className={styles.emptyBox}>
          <div className={styles.emptyIcon}>✓</div>
          <h3 className={styles.emptyTitle}>Nenhuma pendência no momento</h3>
          <p className={styles.emptyDesc}>
            Todas as solicitações de familiares foram analisadas. Novos pedidos aparecerão aqui quando forem enviados.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {requests.map(req => {
            const targetPerson = MOCK_PEOPLE.find(p => p.id === req.targetPersonId)

            return (
              <div key={req.id} className={styles.requestCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>
                    {req.userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className={styles.senderInfo}>
                    <h3 className={styles.senderName}>{req.userName}</h3>
                    <span className={styles.senderEmail}>{req.userEmail}</span>
                  </div>
                  <span className="badge badge-amber">Aguardando Validação</span>
                </div>

                <div className={styles.connectionBlock}>
                  <span className={styles.blockLabel}>Indicação de Parentesco / Vínculo:</span>
                  <div className={styles.targetPersonRow}>
                    <span>Deseja vincular-se a:</span>
                    {targetPerson ? (
                      <strong className={styles.targetName}>
                        🌳 {targetPerson.firstName} {targetPerson.lastName} ({targetPerson.birthDate || '?'})
                      </strong>
                    ) : (
                      <strong>Raiz da Família</strong>
                    )}
                  </div>
                </div>

                <div className={styles.messageBox}>
                  <span className={styles.blockLabel}>Mensagem do Solicitante:</span>
                  <p className={styles.messageText}>"{req.message}"</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.dateLabel}>
                    Recebido em {new Date(req.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <div className={styles.actions}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleAction(req.id, 'REJECTED')}
                    >
                      Recusar
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAction(req.id, 'APPROVED')}
                      id={`approve-${req.id}`}
                    >
                      ✓ Aprovar & Conectar à Árvore
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
