'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './dashboard.module.css'
import { MOCK_FAMILIES, MOCK_TIMELINE, MOCK_JOIN_REQUESTS, MOCK_BOOK_CHAPTERS, CURRENT_USER } from '@/lib/mock-data'
import type { JoinRequest } from '@/types'

export default function DashboardPage() {
  const [family] = useState(MOCK_FAMILIES[0])
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>(
    MOCK_JOIN_REQUESTS.filter(r => r.status === 'PENDING')
  )
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const stats = family.stats!
  const recentEvents = MOCK_TIMELINE.slice(0, 4)
  const bookChapters = MOCK_BOOK_CHAPTERS

  const handleApprove = (reqId: string, userName: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== reqId))
    setSuccessToast(`✓ ${userName} foi aprovado(a) e integrado(a) à árvore familiar com sucesso!`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  const handleReject = (reqId: string, userName: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== reqId))
    setSuccessToast(`Pedido de ${userName} foi recusado.`)
    setTimeout(() => setSuccessToast(null), 3500)
  }

  return (
    <div className={styles.page}>
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

      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Bem-vinda de volta, {CURRENT_USER.name.split(' ')[0]} ✨</div>
          <h1 className={styles.title}>Família <em>{family.name}</em></h1>
          <p className={styles.subtitle}>{family.description}</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/agente" className="btn btn-primary" id="start-session-btn">
            ✨ Nova sessão com agente
          </Link>
          <Link href="/familia/fam-001/arvore" className="btn btn-ghost" id="view-tree-btn">
            🌳 Ver árvore
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {[
          { value: stats.people,      label: 'Pessoas', icon: '👥', href: '/familia/fam-001/pessoas' },
          { value: stats.generations, label: 'Gerações', icon: '🌿', href: '/familia/fam-001/arvore' },
          { value: stats.stories,     label: 'Histórias', icon: '📖', href: '/familia/fam-001/historias' },
          { value: stats.documents,   label: 'Documentos', icon: '📄', href: '/familia/fam-001/arquivo' },
          { value: stats.photos,      label: 'Fotos', icon: '🖼️', href: '/familia/fam-001/arquivo' },
          { value: stats.events,      label: 'Eventos', icon: '📅', href: '/familia/fam-001/timeline' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} className={styles.statCard}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <span className={styles.statValue}>{stat.value.toLocaleString('pt-BR')}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Book Progress */}
        <div className={styles.bookCard}>
          <div className={styles.bookHeader}>
            <div>
              <div className={styles.cardEyebrow}>📚 Livro da Família</div>
              <h2 className={styles.cardTitle}>Livro {family.name}</h2>
            </div>
            <Link href="/familia/fam-001/livro" className="btn btn-ghost btn-sm">Ver livro →</Link>
          </div>
          <div className={styles.bookProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${stats.bookProgress}%` }} />
            </div>
            <span className={styles.progressLabel}>{stats.bookProgress}% completo</span>
          </div>
          <div className={styles.chapters}>
            {bookChapters.map(ch => (
              <div key={ch.id} className={styles.chapterItem}>
                <span className={`${styles.chapterStatus} ${styles[`status${ch.status}`]}`} />
                <span className={styles.chapterTitle}>{ch.title}</span>
                <span className={`badge ${ch.status === 'PUBLISHED' ? 'badge-green' : 'badge-muted'}`}>
                  {ch.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className={styles.requestsCard}>
              <div className={styles.requestsHeader}>
                <div className={styles.cardTitle}>🤝 Pedidos de entrada</div>
                <span className={`badge badge-amber`}>{pendingRequests.length}</span>
              </div>
              <div className={styles.requestsList}>
                {pendingRequests.map(req => (
                  <div key={req.id} className={styles.requestItem}>
                    <div className={styles.requestAvatar}>{req.userName.charAt(0)}</div>
                    <div className={styles.requestInfo}>
                      <div className={styles.requestName}>{req.userName}</div>
                      <div className={styles.requestMsg}>{req.message?.slice(0, 60)}...</div>
                    </div>
                    <div className={styles.requestActions}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        id={`approve-${req.id}`}
                        onClick={() => handleApprove(req.id, req.userName)}
                        title="Aprovar entrada na família"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        id={`reject-${req.id}`}
                        onClick={() => handleReject(req.id, req.userName)}
                        title="Recusar pedido"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className={styles.activityCard}>
            <div className={styles.cardTitle}>📅 Linha do tempo recente</div>
            <div className={styles.activityList}>
              {recentEvents.map(event => (
                <div key={event.id} className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div>
                    <div className={styles.activityTitle}>{event.title}</div>
                    <div className={styles.activityMeta}>{event.date} · {event.location || event.type}</div>
                  </div>
                  <span className={`badge ${event.evidenceStatus === 'CONFIRMED' ? 'badge-green' : 'badge-muted'}`}>
                    {event.evidenceStatus === 'CONFIRMED' ? 'Confirmado' : 'Reportado'}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/familia/fam-001/timeline" className={styles.seeAll}>Ver todos os eventos →</Link>
          </div>

          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <span className={styles.quickStatIcon}>🔍</span>
              <div>
                <div className={styles.quickStatValue}>{stats.pendingInvestigations}</div>
                <div className={styles.quickStatLabel}>investigações em aberto</div>
              </div>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickStatIcon}>🎙️</span>
              <div>
                <div className={styles.quickStatValue}>{stats.audios}</div>
                <div className={styles.quickStatLabel}>gravações de áudio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investigações em aberto */}
      <div className={styles.investigationsCard}>
        <div className={styles.investigationsHeader}>
          <div className={styles.cardTitle}>🔍 Investigações em aberto</div>
          <Link href="/familia/fam-001/investigacoes" className="btn btn-ghost btn-sm">Ver todas</Link>
        </div>
        <div className={styles.investigationsList}>
          {['Avó materna de Giuseppe', 'Profissão de Rosa antes do casamento', 'Irmãos de Antonio Ferraro', 'Data exata da chegada ao Brasil'].map((inv, i) => (
            <div key={i} className={styles.investigationItem}>
              <span className={styles.investigationIcon}>❓</span>
              <span className={styles.investigationTitle}>{inv}</span>
              <Link href="/agente" className="btn btn-ghost btn-sm">Investigar com IA →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
