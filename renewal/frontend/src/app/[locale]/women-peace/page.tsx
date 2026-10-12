import WomenPeaceView from '@/components/women-peace/WomenPeaceView'
import { setRequestLocale } from 'next-intl/server'

export default async function WomenPeacePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <WomenPeaceView />
}
