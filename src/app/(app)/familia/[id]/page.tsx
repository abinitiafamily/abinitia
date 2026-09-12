import { redirect } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default function FamilyIndexPage({ params }: Props) {
  redirect(`/familia/${params.id}/arvore`)
}
