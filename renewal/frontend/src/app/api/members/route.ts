import { NextResponse } from 'next/server'
import { initialMembers } from '@/lib/store'

export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: initialMembers,
  })
}
