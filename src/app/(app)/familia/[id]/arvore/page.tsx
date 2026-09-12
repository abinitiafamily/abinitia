import type { Metadata } from 'next'
import ArvorePageClient from './ArvorePageClient'

export const metadata: Metadata = {
  title: 'Árvore Genealógica',
  description: 'Visualização interativa da linhagem genealógica com conexões e evidências.',
}

export default function ArvorePage() {
  return <ArvorePageClient />
}
