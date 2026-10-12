import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb, Post } from '@/lib/serverDb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'board', 'share', 'announce', 'prayer'
    const search = searchParams.get('search') || ''
    const userRole = searchParams.get('role') || 'associate' // 'super_admin' | 'country_admin' | 'regular' | 'associate'
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const db = readDb()
    let posts = [...db.posts]

    // 카테고리 필터링
    if (type && type !== 'all') {
      posts = posts.filter((p) => p.board_type === type)
    }

    // 검색어 필터링
    if (search.trim()) {
      const q = search.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author_name.toLowerCase().includes(q)
      )
    }

    // 정렬 (공지 고정 우선 -> 최신순)
    posts.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    // 개수 제한
    if (limit > 0) {
      posts = posts.slice(0, limit)
    }

    // 대표님 요구사항 권한 처리:
    // "정회원 로그인 전까지는 게시자 이름을 감춰주고, 국가만 표시"
    // "게시물의 내용도 정회원 로그인 전까지는 1줄만 보여주고 생략표시했다가 정회원 이상 로그인 시 전체 내용 표시"
    const isAuthorizedMember = ['regular', 'country_admin', 'super_admin'].includes(userRole)

    const processedPosts = posts.map((post) => {
      if (!isAuthorizedMember) {
        const firstLine = post.content.split('\n')[0]
        return {
          ...post,
          author_name: `${post.author_name.charAt(0)}** (성도)`,
          content: `${firstLine} ... [🔒 정회원 이상 로그인 시 전체 내용과 댓글이 공개됩니다]`,
          comments: [], // 비회원/준회원 댓글 비공개
        }
      }
      return post
    })

    return NextResponse.json({
      success: true,
      total: processedPosts.length,
      isAuthorized: isAuthorizedMember,
      data: processedPosts,
    })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json({ success: false, message: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, board_type, author_name, author_country, author_role } = body

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: '제목과 내용을 모두 입력해 주세요.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const newPost: Post = {
      id: `p_${Date.now()}`,
      board_type: board_type || 'board',
      title,
      content,
      author_name: author_name || '익명 성도',
      author_country: author_country || 'KR',
      author_role: author_role || 'regular',
      views: 1,
      likes: 0,
      is_pinned: false,
      amen_count: 0,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      comments: [],
    }

    db.posts.unshift(newPost)
    writeDb(db)

    return NextResponse.json({ success: true, data: newPost }, { status: 201 })
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json({ success: false, message: '게시물 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
