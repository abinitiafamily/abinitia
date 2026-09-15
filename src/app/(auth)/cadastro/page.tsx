'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../auth.module.css'
import { supabase } from '@/lib/supabase'

export default function CadastroPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [surname, setSurname] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleGoogleSignUp = async () => {
    setErrorMessage(null)
    setIsGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (err: any) {
      console.error('Erro no cadastro com Google:', err)
      setErrorMessage(
        err?.message ||
          'Não foi possível conectar à conta do Google no momento. Verifique a configuração no painel do Supabase.'
      )
      setIsGoogleLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!termsAccepted) {
      setErrorMessage('Por favor, aceite os Termos de Uso e Política de Privacidade.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            family_surname: surname || undefined,
          },
        },
      })

      if (error) throw error

      if (data?.user) {
        if (data.session) {
          router.push('/dashboard')
        } else {
          setSuccessMessage(
            'Conta criada com sucesso! Verifique seu e-mail para confirmar seu acesso ou continue para o dashboard.'
          )
          setTimeout(() => router.push('/dashboard'), 2000)
        }
      }
    } catch (err: any) {
      console.error('Erro no cadastro por email:', err)
      setErrorMessage(err?.message || 'Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 2 16 2Z" fill="url(#lg2)"/>
            <defs><linearGradient id="lg2" x1="16" y1="2" x2="16" y2="26"><stop offset="0%" stopColor="#C68B2E"/><stop offset="100%" stopColor="#8B5E1A"/></linearGradient></defs>
          </svg>
          <span>ABINITIA</span>
        </Link>

        <h1 className={styles.title}>Comece sua história</h1>
        <p className={styles.subtitle}>Crie sua conta e preserve o legado da sua família para as próximas gerações.</p>

        {errorMessage && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(192, 57, 43, 0.15)',
              border: '1px solid rgba(192, 57, 43, 0.35)',
              color: '#e74c3c',
              fontSize: '0.85rem',
              marginBottom: '16px',
              lineHeight: '1.4',
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(90, 128, 64, 0.15)',
              border: '1px solid rgba(90, 128, 64, 0.35)',
              color: '#7ea462',
              fontSize: '0.85rem',
              marginBottom: '16px',
              lineHeight: '1.4',
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {/* Botão Google OAuth em destaque no topo */}
        <button
          className={`btn btn-ghost btn-full ${styles.oauthBtn}`}
          id="google-signup-btn"
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || isLoading}
          style={{ cursor: isGoogleLoading ? 'wait' : 'pointer' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isGoogleLoading ? 'Conectando ao Google...' : 'Cadastrar com Google'}
        </button>

        <div className={styles.divider}>
          <span>ou cadastre-se com e-mail</span>
        </div>

        <form className={styles.form} id="cadastro-form" onSubmit={handleEmailSignUp}>
          <div className="form-group">
            <label className="form-label" htmlFor="cadastro-name">Nome completo</label>
            <input
              id="cadastro-name"
              type="text"
              className="form-input"
              placeholder="Seu nome"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cadastro-email">E-mail</label>
            <input
              id="cadastro-email"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cadastro-password">Senha</label>
            <input
              id="cadastro-password"
              type="password"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cadastro-surname">Sobrenome familiar</label>
            <input
              id="cadastro-surname"
              type="text"
              className="form-input"
              placeholder="Ex: Ferraro, Silva, Costa..."
              value={surname}
              onChange={e => setSurname(e.target.value)}
            />
            <span className={styles.fieldHint}>Opcional — para iniciar sua linhagem</span>
          </div>

          <div className={styles.terms}>
            <input
              id="terms-check"
              type="checkbox"
              className={styles.checkbox}
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              required
            />
            <label htmlFor="terms-check">
              Aceito os <Link href="#" className={styles.switchLink}>Termos de Uso</Link> e{' '}
              <Link href="#" className={styles.switchLink}>Política de Privacidade</Link>
            </label>
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-full btn-lg ${styles.submitBtn}`}
            id="cadastro-btn"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? 'Criando sua conta...' : 'Criar conta gratuitamente'}
          </button>
        </form>

        <p className={styles.switch} style={{ marginTop: '20px' }}>
          Já tem conta?{' '}
          <Link href="/login" className={styles.switchLink}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}
