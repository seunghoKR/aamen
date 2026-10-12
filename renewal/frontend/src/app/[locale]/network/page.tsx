import NetworkView from '@/components/network/NetworkView'
import { setRequestLocale } from 'next-intl/server'

export default async function NetworkPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <NetworkView />
}
