import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/serverDb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userRole = searchParams.get('role') || 'associate'

    const db = readDb()
    const postIndex = db.posts.findIndex((p) => p.id === id)

    if (postIndex === -1) {
      return NextResponse.json({ success: false, message: '게시물을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 조회수 1 증가 및 저장
    db.posts[postIndex].views += 1
    writeDb(db)

    const post = db.posts[postIndex]
    const isAuthorizedMember = ['regular', 'country_admin', 'super_admin'].includes(userRole)

    if (!isAuthorizedMember) {
      const firstLine = post.content.split('\n')[0]
      return NextResponse.json({
        success: true,
        isAuthorized: false,
        data: {
          ...post,
          author_name: `${post.author_name.charAt(0)}** (성도)`,
          content: `${firstLine} ...\n\n🔒 [안내] 정회원 이상 로그인하시면 전체 본문과 댓글을 읽고 작성하실 수 있습니다.`,
          comments: [],
        },
      })
    }

    return NextResponse.json({
      success: true,
      isAuthorized: true,
      data: post,
    })
  } catch (error) {
    console.error('Failed to get post detail:', error)
    return NextResponse.json({ success: false, message: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}

// 좋아요 또는 아멘 증가
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body // 'like' | 'amen'

    const db = readDb()
    const post = db.posts.find((p) => p.id === id)

    if (!post) {
      return NextResponse.json({ success: false, message: '게시물을 찾을 수 없습니다.' }, { status: 404 })
    }

    if (action === 'amen') {
      post.amen_count = (post.amen_count || 0) + 1
    } else {
      post.likes = (post.likes || 0) + 1
    }

    writeDb(db)
    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('Failed to update post interactions:', error)
    return NextResponse.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// 게시물 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = readDb()
    const initialLen = db.posts.length
    db.posts = db.posts.filter((p) => p.id !== id)

    if (db.posts.length === initialLen) {
      return NextResponse.json({ success: false, message: '게시물을 찾을 수 없습니다.' }, { status: 404 })
    }

    writeDb(db)
    return NextResponse.json({ success: true, message: '게시물이 삭제되었습니다.' })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return NextResponse.json({ success: false, message: '게시물 삭제 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
