import ScheduleView from '@/components/network/ScheduleView'
import { setRequestLocale } from 'next-intl/server'

export default async function NetworkSchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ScheduleView />
}
