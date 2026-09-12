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
  const [filterType, setFilterType] = useState<string>('ALL')

  const filtered = filterType === 'ALL'
    ? MOCK_VAULT_ITEMS
    : MOCK_VAULT_ITEMS.filter(i => i.type === filterType)

  const getTypeIcon = (type: VaultItem['type']) => {
    switch (type) {
      case 'PHOTO': return '🖼️'
      case 'DOCUMENT': return '📜'
      case 'AUDIO': return '🎙️'
      case 'LETTER': return '✉️'
    }
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
        <button className="btn btn-primary" id="upload-doc-btn">
          + Enviar Documento / Foto
        </button>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${filterType === 'ALL' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          Todos ({MOCK_VAULT_ITEMS.length})
        </button>
        <button
          className={`${styles.filterBtn} ${filterType === 'DOCUMENT' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('DOCUMENT')}
        >
          📜 Documentos
        </button>
        <button
          className={`${styles.filterBtn} ${filterType === 'PHOTO' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('PHOTO')}
        >
          🖼️ Fotografias
        </button>
        <button
          className={`${styles.filterBtn} ${filterType === 'AUDIO' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('AUDIO')}
        >
          🎙️ Áudios & Entrevistas
        </button>
        <button
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
              <button className="btn btn-ghost btn-sm">Visualizar</button>
              <button className="btn btn-secondary btn-sm">Baixar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
