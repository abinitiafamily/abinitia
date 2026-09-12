import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../auth.module.css'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 2 16 2Z" fill="url(#lg1)"/>
            <defs><linearGradient id="lg1" x1="16" y1="2" x2="16" y2="26"><stop offset="0%" stopColor="#C68B2E"/><stop offset="100%" stopColor="#8B5E1A"/></linearGradient></defs>
          </svg>
          <span>ABINITIA</span>
        </Link>

        <h1 className={styles.title}>Bem-vindo de volta</h1>
        <p className={styles.subtitle}>Entre na sua conta para acessar a história da sua família.</p>

        <form className={styles.form} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">E-mail</label>
            <input id="login-email" type="email" className="form-input" placeholder="seu@email.com" autoComplete="email" required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Senha</label>
            <input id="login-password" type="password" className="form-input" placeholder="••••••••" autoComplete="current-password" required />
            <Link href="#" className={styles.forgot}>Esqueceu a senha?</Link>
          </div>

          <Link href="/dashboard" className={`btn btn-primary btn-full btn-lg ${styles.submitBtn}`} id="login-btn">
            Entrar
          </Link>
        </form>

        <div className={styles.divider}>
          <span>ou continue com</span>
        </div>

        <button className={`btn btn-ghost btn-full ${styles.oauthBtn}`} id="google-oauth-btn" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Entrar com Google
        </button>

        <p className={styles.switch}>
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className={styles.switchLink}>Criar conta grátis</Link>
        </p>
      </div>
    </div>
  )
}
