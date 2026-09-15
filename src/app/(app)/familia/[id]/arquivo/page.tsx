'use client'

import { useState } from 'react'
import styles from './arquivo.module.css'

interface VaultItem {
  id: string
  title: string
  type: 'PHOTO' | 'DOCUMENT' | 'AUDIO' | 'LETTER'
  date?: string
  format: string
  size: string
  personName?: string
  status: 'VERIFIED' | 'PENDING'
}

const MOCK_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'v-1',
    title: 'Registro de Desembarque - Porto de Santos',
    type: 'DOCUMENT',
    date: 'Outubro de 1888',
    format: 'PDF',
    size: '4.2 MB',
    personName: 'Giuseppe Ferraro',
    status: 'VERIFIED',
  },
  {
    id: 'v-2',
    title: 'Retrato de Casamento Giuseppe & Rosa em Nápoles',
    type: 'PHOTO',
    date: 'Maio de 1887',
    format: 'JPG (Restaurada)',
    size: '8.7 MB',
    personName: 'Giuseppe & Rosa Ferraro',
    status: 'VERIFIED',
  },
  {
    id: 'v-3',
    title: 'Áudio: Depoimento de Carlos sobre o avô ferreiro',
    type: 'AUDIO',
    date: 'Gravação de 2018',
    format: 'WAV',
    size: '18.4 MB',
    personName: 'Carlos Ferraro',
    status: 'VERIFIED',
  },
  {
    id: 'v-4',
    title: 'Carta enviada para a irmã na Itália',
    type: 'LETTER',
    date: 'Dezembro de 1914',
    format: 'PNG',
    size: '3.1 MB',
    personName: 'Giuseppe Ferraro',
    status: 'VERIFIED',
  },
  {
    id: 'v-5',
    title: 'Alvará de Funcionamento da Ferraria da Rua do Comércio',
    type: 'DOCUMENT',
    date: 'Março de 1905',
    format: 'PDF',
    size: '2.5 MB',
    personName: 'Giuseppe Ferraro',
    status: 'VERIFIED',
  },
  {
    id: 'v-6',
    title: 'Certidão de Nascimento de Antonio Ferraro',
    type: 'DOCUMENT',
    date: 'Julho de 1895',
    format: 'PDF',
    size: '1.9 MB',
    personName: 'Antonio Ferraro',
    status: 'VERIFIED',
  },
]

export default function ArquivoPage() {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(MOCK_VAULT_ITEMS)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [previewItem, setPreviewItem] = useState<VaultItem | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Formulário de upload
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'PHOTO' | 'DOCUMENT' | 'AUDIO' | 'LETTER'>('DOCUMENT')
  const [date, setDate] = useState('')
  const [personName, setPersonName] = useState('')
  const [fileName, setFileName] = useState('')

  const filtered = filterType === 'ALL'
    ? vaultItems
    : vaultItems.filter(i => i.type === filterType)

  const getTypeIcon = (t: VaultItem['type']) => {
    switch (t) {
      case 'PHOTO': return '🖼️'
      case 'DOCUMENT': return '📜'
      case 'AUDIO': return '🎙️'
      case 'LETTER': return '✉️'
    }
  }

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newItem: VaultItem = {
      id: `v-${Date.now()}`,
      title,
      type,
      date: date.trim() || 'Data não identificada',
      format: type === 'PHOTO' ? 'JPG' : type === 'AUDIO' ? 'MP3' : 'PDF',
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      personName: personName.trim() || undefined,
      status: 'VERIFIED',
    }

    setVaultItems(prev => [newItem, ...prev])
    setShowUploadModal(false)

    // Reset campos
    setTitle('')
    setDate('')
    setPersonName('')
    setFileName('')

    setSuccessToast(`✓ Documento "${newItem.title}" preservado no Vault da Família!`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  const handleDownload = (item: VaultItem) => {
    setSuccessToast(`📥 Download iniciado: ${item.title} (${item.format})`)
    setTimeout(() => setSuccessToast(null), 3000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Arquivo Familiar & Vault</h1>
          <p className={styles.subtitle}>
            Preservação digital de certidões, fotos históricas, cartas e gravações de áudio.
          </p>
        </div>
        <button
          className="btn btn-primary"
          id="upload-doc-btn"
          type="button"
          onClick={() => setShowUploadModal(true)}
        >
          + Enviar Documento / Foto
        </button>
      </div>

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

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterType === 'ALL' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          Todos ({vaultItems.length})
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterType === 'DOCUMENT' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('DOCUMENT')}
        >
          📜 Documentos
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterType === 'PHOTO' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('PHOTO')}
        >
          🖼️ Fotografias
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterType === 'AUDIO' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('AUDIO')}
        >
          🎙️ Áudios & Entrevistas
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterType === 'LETTER' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('LETTER')}
        >
          ✉️ Cartas & Correspondências
        </button>
      </div>

      {/* Grid of Vault Items */}
      <div className={styles.grid}>
        {filtered.map(item => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardIcon}>{getTypeIcon(item.type)}</div>
            <div className={styles.cardBody}>
              <div className={styles.cardMeta}>
                <span className={styles.formatTag}>{item.format} · {item.size}</span>
                <span className="badge badge-olive">Verificado</span>
              </div>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              {item.personName && (
                <span className={styles.personTag}>👤 {item.personName}</span>
              )}
              {item.date && (
                <span className={styles.dateText}>📅 {item.date}</span>
              )}
            </div>
            <div className={styles.cardFooter}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setPreviewItem(item)}
              >
                Visualizar
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDownload(item)}
              >
                Baixar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Enviar Documento */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 5, 2, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 110,
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'var(--clr-bark)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-parchment)', fontSize: '1.25rem' }}>
                Enviar Documento ou Foto Histórica
              </h2>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-text-faint)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Título do Item / Descrição *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Certidão de Casamento em Nápoles"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tipo de Arquivo</label>
                  <select
                    className="form-input"
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                  >
                    <option value="DOCUMENT">📜 Certidão / Documento</option>
                    <option value="PHOTO">🖼️ Fotografia Antiga</option>
                    <option value="AUDIO">🎙️ Gravação de Áudio</option>
                    <option value="LETTER">✉️ Carta / Diário</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Data Estimada</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Maio de 1887"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Pessoa Vinculada na Árvore</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Giuseppe Ferraro"
                  value={personName}
                  onChange={e => setPersonName(e.target.value)}
                />
              </div>

              <div
                style={{
                  border: '2px dashed var(--clr-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'rgba(198, 139, 46, 0.04)',
                  marginBottom: '20px',
                  cursor: 'pointer',
                }}
                onClick={() => setFileName('certidao_napoles_1887_digitalizada.pdf')}
              >
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>📂</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--clr-parchment)', fontWeight: 600 }}>
                  {fileName ? `Arquivo selecionado: ${fileName}` : 'Clique para selecionar arquivo do seu dispositivo'}
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--clr-text-faint)', marginTop: '4px' }}>
                  Suporta PDF, JPG, PNG, WAV, MP3 até 50MB
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="submit-doc-btn"
                >
                  Convalidar & Arquivar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Visualizador do Arquivo */}
      {previewItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 5, 2, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 120,
          }}
          onClick={() => setPreviewItem(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              background: 'var(--clr-bark)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: '4px', display: 'inline-block' }}>
                  {previewItem.type} · Vault Criptografado
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-parchment)', fontSize: '1.25rem' }}>
                  {previewItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--clr-text-faint)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                height: '240px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--clr-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '3.5rem' }}>{getTypeIcon(previewItem.type)}</span>
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>
                Prévia digital de {previewItem.format} · {previewItem.size}
              </p>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginBottom: '20px' }}>
              <p>👤 <strong>Pessoa associada:</strong> {previewItem.personName || 'Geral da Família'}</p>
              <p>📅 <strong>Datação:</strong> {previewItem.date || 'Desconhecida'}</p>
              <p>🛡️ <strong>Integridade:</strong> Assinatura e preservação convalidada no Vault perpétuo.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPreviewItem(null)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleDownload(previewItem)
                  setPreviewItem(null)
                }}
              >
                Baixar Arquivo Original
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
