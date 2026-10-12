import CommunityView from '@/components/community/CommunityView'

export function generateStaticParams() {
  return [
    { tab: 'announce' },
    { tab: 'announcements' },
    { tab: 'resources' },
    { tab: 'board' },
    { tab: 'share' },
    { tab: 'prayer' },
    { tab: 'photos' },
    { tab: 'photo' },
  ]
}

import { setRequestLocale } from 'next-intl/server'

export default async function CommunitySubPage({
  params,
}: {
  params: Promise<{ locale: string; tab: string }>
}) {
  const { locale, tab } = await params
  setRequestLocale(locale)

  let initialTab: 'announce' | 'resources' | 'prayer' | 'photos' = 'announce'
  if (tab === 'prayer') initialTab = 'prayer'
  else if (tab === 'resources' || tab === 'share' || tab === 'board') initialTab = 'resources'
  else if (tab === 'photos' || tab === 'photo') initialTab = 'photos'
  else if (tab === 'announce' || tab === 'announcements') initialTab = 'announce'

  return <CommunityView initialTab={initialTab} />
}
