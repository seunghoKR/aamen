import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb, PrayerCard } from '@/lib/serverDb'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({ success: true, data: db.prayer_cards })
  } catch (error) {
    console.error('Failed to get prayer cards:', error)
    return NextResponse.json({ success: false, message: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, author_name, country_code, is_urgent } = body

    if (!title || !content) {
      return NextResponse.json({ success: false, message: '제목과 내용을 입력해 주세요.' }, { status: 400 })
    }

    const db = readDb()
    const newPrayer: PrayerCard = {
      id: `pr_${Date.now()}`,
      author_name: author_name || '익명 기도자',
      country_code: country_code || 'KR',
      title,
      content,
      amen_count: 0,
      is_urgent: !!is_urgent,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    }

    db.prayer_cards.unshift(newPrayer)
    writeDb(db)

    return NextResponse.json({ success: true, data: newPrayer }, { status: 201 })
  } catch (error) {
    console.error('Failed to create prayer:', error)
    return NextResponse.json({ success: false, message: '기도제목 등록 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// 아멘 카운트 증가
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID가 필요합니다.' }, { status: 400 })
    }

    const db = readDb()
    const prayer = db.prayer_cards.find((p) => p.id === id)
    if (!prayer) {
      return NextResponse.json({ success: false, message: '기도제목을 찾을 수 없습니다.' }, { status: 404 })
    }

    prayer.amen_count = (prayer.amen_count || 0) + 1
    writeDb(db)

    return NextResponse.json({ success: true, amen_count: prayer.amen_count })
  } catch (error) {
    console.error('Failed to patch prayer amen:', error)
    return NextResponse.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
