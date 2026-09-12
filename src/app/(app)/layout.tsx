'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './app-layout.module.css'
import { MOCK_FAMILIES, CURRENT_USER } from '@/lib/mock-data'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '⌂', label: 'Início' },
  { href: '/familia/fam-001/arvore', icon: '🌳', label: 'Árvore' },
  { href: '/familia/fam-001/pessoas', icon: '👥', label: 'Pessoas' },
  { href: '/familia/fam-001/timeline', icon: '📅', label: 'Linha do Tempo' },
  { href: '/familia/fam-001/historias', icon: '📖', label: 'Histórias' },
  { href: '/familia/fam-001/arquivo', icon: '🗂️', label: 'Arquivo' },
  { href: '/familia/fam-001/livro', icon: '📚', label: 'Livro da Família' },
  { href: '/familia/fam-001/membros', icon: '🤝', label: 'Membros' },
  { href: '/agente', icon: '✨', label: 'Agente IA', highlight: true },
]

const BOTTOM_NAV = [
  { href: '/busca', icon: '🔍', label: 'Buscar famílias' },
  { href: '/convites', icon: '📨', label: 'Convites' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const family = MOCK_FAMILIES[0]

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar} id="app-sidebar">
        {/* Logo */}
        <div className={styles.sidebarTop}>
          <Link href="/dashboard" className={styles.brand}>
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
                className={`${styles.navItem} ${pathname === item.href || pathname.startsWith(item.href + '/') ? styles.navItemActive : ''} ${item.highlight ? styles.navItemHighlight : ''}`}
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
          <button className={styles.logoutBtn} data-tooltip="Sair" title="Sair">⏻</button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <button className={styles.menuBtn} aria-label="Menu" id="sidebar-toggle">
            <span/><span/><span/>
          </button>
          <div className={styles.topbarRight}>
            <button className={styles.topbarBtn} data-tooltip="Convidar membro" title="Convidar">
              <span>+ Convidar</span>
            </button>
            <button className={styles.topbarBtn} data-tooltip="Notificações" title="Notificações" id="notifications-btn">
              <span>🔔</span>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
