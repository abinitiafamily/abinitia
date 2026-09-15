'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './app-layout.module.css'
import { MOCK_FAMILIES, CURRENT_USER } from '@/lib/mock-data'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '⌂', label: 'Início' },
  { href: '/familia/fam-001/arvore', icon: '🌳', label: 'Árvore' },
  { href: '/familia/fam-001/pessoas', icon: '👥', label: 'Pessoas' },
  { href: '/familia/fam-001/timeline', icon: '📅', label: 'Linha do Tempo' },
  { href: '/familia/fam-001/historias', icon: '📖', label: 'Histórias' },
  { href: '/familia/fam-001/investigacoes', icon: '🔍', label: 'Investigações' },
  { href: '/familia/fam-001/arquivo', icon: '🗂️', label: 'Arquivo' },
  { href: '/familia/fam-001/livro', icon: '📚', label: 'Livro da Família' },
  { href: '/familia/fam-001/membros', icon: '🤝', label: 'Membros' },
  { href: '/agente', icon: '✨', label: 'Agente IA', highlight: true },
]

const BOTTOM_NAV = [
  { href: '/busca', icon: '🌐', label: 'Buscar famílias' },
  { href: '/convites', icon: '📨', label: 'Convites' },
  { href: '/familia/fam-001/configuracoes', icon: '⚙️', label: 'Selo & Privacidade' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const family = MOCK_FAMILIES[0]

  // Estados de interface interativa
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const inviteLink = 'https://abinitia.com/convite/fam-001?token=ab_fam_88291f'

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 3000)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err)
    } finally {
      router.push('/login')
    }
  }

  return (
    <div className={styles.shell}>
      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        id="app-sidebar"
      >
        {/* Logo */}
        <div className={styles.sidebarTop}>
          <Link
            href="/dashboard"
            className={styles.brand}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C16 2 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 2 16 2Z" fill="url(#sl1)"/>
              <defs><linearGradient id="sl1" x1="16" y1="2" x2="16" y2="26"><stop offset="0%" stopColor="#C68B2E"/><stop offset="100%" stopColor="#8B5E1A"/></linearGradient></defs>
            </svg>
            <span className={styles.brandText}>ABINITIA</span>
          </Link>

          {/* Active Family */}
          <div className={styles.familySelector}>
            <span className={styles.familySymbol}>{family.symbol}</span>
            <div>
              <div className={styles.familyName}>Família {family.name}</div>
              <div className={styles.familyRole}>Administrador</div>
            </div>
            <span className={styles.familyChevron}>⌄</span>
          </div>
        </div>

        {/* Main Nav */}
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`${styles.navItem} ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? styles.navItemActive : ''} ${item.highlight ? styles.navItemHighlight : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {item.highlight && <span className={styles.navBadge}>IA</span>}
              </Link>
            ))}
          </div>

          <div className={styles.navDivider} />

          <div className={styles.navSection}>
            {BOTTOM_NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{CURRENT_USER.name.charAt(0)}</div>
            <div>
              <div className={styles.userName}>{CURRENT_USER.name}</div>
              <div className={styles.userEmail}>{CURRENT_USER.email}</div>
            </div>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            data-tooltip="Sair da conta"
            title="Sair da conta"
            type="button"
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            aria-label="Alternar Menu"
            id="sidebar-toggle"
            type="button"
            onClick={() => setIsSidebarOpen(prev => !prev)}
          >
            <span/><span/><span/>
          </button>

          <div className={styles.topbarRight} style={{ position: 'relative' }}>
            <button
              className={styles.topbarBtn}
              data-tooltip="Convidar membro"
              title="Convidar"
              type="button"
              onClick={() => setIsInviteOpen(true)}
            >
              <span>+ Convidar</span>
            </button>

            <button
              className={styles.topbarBtn}
              data-tooltip="Notificações"
              title="Notificações"
              id="notifications-btn"
              type="button"
              onClick={() => setIsNotifOpen(prev => !prev)}
            >
              <span>🔔</span>
              <span className={styles.notifDot} />
            </button>

            {/* Dropdown de Notificações */}
            {isNotifOpen && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <span className={styles.notifTitle}>Notificações da Família</span>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--clr-text-faint)', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.notifList}>
                  <div className={styles.notifItem}>
                    <span>✨</span>
                    <div>
                      <strong>Agente Genealogista</strong> identificou novo parente potencial (Matteo Ferraro).
                    </div>
                  </div>
                  <div className={styles.notifItem}>
                    <span>🤝</span>
                    <div>
                      <strong>Carlos Ferraro</strong> solicitou ingresso na árvore genealógica.
                    </div>
                  </div>
                  <div className={styles.notifItem}>
                    <span>📜</span>
                    <div>
                      Nova certidão de desembarque de 1888 foi convalidada no Vault.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* GLOBAL FLOATING ACTION BUTTON (FAB) DO AGENTE IA */}
      <Link
        href="/agente"
        className={styles.agentFab}
        id="global-agent-fab"
        title="Conversar ou gravar relato com o Agente de Memória"
      >
        <span className={styles.agentFabIcon}>🎙️</span>
        <div className={styles.agentFabLabel}>
          <span className={styles.agentFabTitle}>Guardião IA</span>
          <span className={styles.agentFabSubtitle}>Ouvir & Registrar</span>
        </div>
      </Link>

      {/* MODAL DE CONVITE RÁPIDO DO TOPBAR */}
      {isInviteOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsInviteOpen(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsInviteOpen(false)}>✕</button>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-parchment)', marginBottom: '8px' }}>
              Convidar Membro para a Família {family.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
              Envie o link seguro abaixo para parentes. Ao acessarem, eles poderão indicar o grau de parentesco e se conectar à árvore genealógica.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="form-input"
                style={{ flex: 1, fontSize: '0.85rem' }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCopyInvite}
              >
                {copiedLink ? '✓ Copiado!' : 'Copiar'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsInviteOpen(false)}
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
