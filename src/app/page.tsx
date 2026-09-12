import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'ABINITIA — Da origem ao legado',
  description: 'Plataforma inteligente de genealogia, memória e história familiar.',
}

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Redirect to landing or show mini welcome */}
      <div className={styles.center}>
        <div className={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 2 16 2Z" fill="url(#g1)" />
            <path d="M16 26L16 30" stroke="#C68B2E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 28L22 28" stroke="#C68B2E" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="g1" x1="16" y1="2" x2="16" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C68B2E"/>
                <stop offset="100%" stopColor="#8B5E1A"/>
              </linearGradient>
            </defs>
          </svg>
          <span className={styles.logoText}>ABINITIA</span>
        </div>
        <p className={styles.tagline}>Da origem ao legado.</p>
        <div className={styles.actions}>
          <Link href="/cadastro" className="btn btn-primary btn-lg">Criar minha conta</Link>
          <Link href="/login" className="btn btn-ghost btn-lg">Entrar</Link>
        </div>
        <p className={styles.hint}>
          Já tem uma família? <Link href="/busca" className={styles.hintLink}>Buscar famílias</Link>
        </p>
      </div>
    </main>
  )
}
