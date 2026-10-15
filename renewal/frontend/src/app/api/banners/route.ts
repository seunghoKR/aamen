import { NextResponse } from 'next/server'
import { defaultBanners } from '@/lib/store'

export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: defaultBanners,
  })
}
