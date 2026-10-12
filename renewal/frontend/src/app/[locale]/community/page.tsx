import CommunityView from '@/components/community/CommunityView'
import { setRequestLocale } from 'next-intl/server'

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CommunityView initialTab="board" />
}
