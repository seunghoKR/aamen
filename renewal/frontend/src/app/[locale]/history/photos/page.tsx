import HistoryView from '@/components/history/HistoryView'
import { setRequestLocale } from 'next-intl/server'

export default async function HistoryPhotosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <HistoryView initialTab="photos" />
}
