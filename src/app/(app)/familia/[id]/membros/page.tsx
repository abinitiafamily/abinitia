'use client'
import { useState } from 'react'
import styles from './membros.module.css'
import { MOCK_MEMBERS, MOCK_PEOPLE } from '@/lib/mock-data'
import type { Role } from '@/types'

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador Familiar',
  EDITOR: 'Editor Genealógico',
  CONTRIBUTOR: 'Contribuidor / Familiar',
  PARTICIPANT: 'Participante',
  READER: 'Leitor / Visitante',
}

const ROLE_BADGES: Record<Role, string> = {
  ADMIN: 'badge-amber',
  EDITOR: 'badge-olive',
  CONTRIBUTOR: 'badge-sepia',
  PARTICIPANT: 'badge-sepia',
  READER: 'badge-sepia',
}

export default function MembrosPage() {
  const [copied, setCopied] = useState(false)
  const inviteUrl = 'https://abinitia.com/convite/fam-001?token=ab_fam_88291f'

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Membros & Colaboradores</h1>
          <p className={styles.subtitle}>
            Gerenciamento de acessos, convites e permissões da Família Ferraro.
          </p>
        </div>
      </div>

      {/* Invite Box */}
      <div className={styles.inviteCard}>
        <div className={styles.inviteIcon}>🔗</div>
        <div className={styles.inviteInfo}>
          <h3 className={styles.inviteTitle}>Convidar Membro da Família</h3>
          <p className={styles.inviteDesc}>
            Compartilhe este link seguro com parentes. Ao acessar, eles poderão indicar
            sua filiação na árvore e aguardar sua aprovação.
          </p>
          <div className={styles.inviteInputRow}>
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className={`form-input ${styles.inviteInput}`}
            />
            <button className="btn btn-primary" onClick={copyLink} id="copy-invite-btn">
              {copied ? '✓ Link Copiado!' : 'Copiar Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className={styles.tableCard}>
        <h3 className={styles.tableHeading}>Colaboradores com Acesso ({MOCK_MEMBERS.length})</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Pessoa Vinculada na Árvore</th>
                <th>Papel / Permissão</th>
                <th>Membro Desde</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MEMBERS.map(m => {
                const person = MOCK_PEOPLE.find(p => p.id === m.personId)
                return (
                  <tr key={m.userId}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {m.userId === 'user-001' ? 'CF' : m.userId === 'user-002' ? 'RF' : 'LF'}
                        </div>
                        <div>
                          <div className={styles.userName}>
                            {m.userId === 'user-001' ? 'Carolina Ferraro (Você)' : m.userId === 'user-002' ? 'Carlos Ferraro' : 'Leitor Convidado'}
                          </div>
                          <div className={styles.userEmail}>
                            {m.userId === 'user-001' ? 'carolina@ferraro.com' : 'familiar@email.com'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {person ? (
                        <span className={styles.linkedPerson}>
                          🌳 {person.firstName} {person.lastName}
                        </span>
                      ) : (
                        <span className={styles.unlinked}>Sem vínculo direto</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${ROLE_BADGES[m.role]}`}>
                        {ROLE_LABELS[m.role]}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(m.joinedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" disabled={m.role === 'ADMIN'}>
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
