import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb, Comment } from '@/lib/serverDb'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content, author_name, author_country, author_role } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: '댓글 내용을 입력해 주세요.' }, { status: 400 })
    }

    const db = readDb()
    const post = db.posts.find((p) => p.id === id)

    if (!post) {
      return NextResponse.json({ success: false, message: '게시물을 찾을 수 없습니다.' }, { status: 404 })
    }

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      post_id: id,
      author_name: author_name || 'AAMEN 성도',
      author_country: author_country || 'KR',
      author_role: author_role || 'regular',
      content: content.trim(),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    }

    if (!post.comments) {
      post.comments = []
    }
    post.comments.push(newComment)

    writeDb(db)
    return NextResponse.json({ success: true, data: newComment }, { status: 201 })
  } catch (error) {
    console.error('Failed to create comment:', error)
    return NextResponse.json({ success: false, message: '댓글 작성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
