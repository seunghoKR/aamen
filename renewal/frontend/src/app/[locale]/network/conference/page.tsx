import ConferenceView from '@/components/network/ConferenceView'
import { setRequestLocale } from 'next-intl/server'

export default async function NetworkConferencePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ConferenceView />
}
