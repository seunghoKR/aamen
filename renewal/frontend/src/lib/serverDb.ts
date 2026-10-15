import fs from 'fs'
import path from 'path'

export interface Member {
  id: string
  email: string
  name: string
  avatar_url?: string
  provider: string
  country_code: string
  role: 'super_admin' | 'country_admin' | 'regular' | 'associate'
  status: 'active' | 'pending' | 'suspended'
  bio?: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_id?: string
  author_name: string
  author_country: string
  author_role: string
  content: string
  created_at: string
}

export interface Post {
  id: string
  board_type: 'board' | 'share' | 'announce' | 'prayer'
  title: string
  content: string
  author_id?: string
  author_name: string
  author_country: string
  author_role: 'super_admin' | 'country_admin' | 'regular' | 'associate'
  views: number
  likes: number
  is_pinned: boolean
  amen_count: number
  created_at: string
  updated_at: string
  comments: Comment[]
}

export interface PrayerCard {
  id: string
  author_name: string
  country_code: string
  title: string
  content: string
  amen_count: number
  is_urgent: boolean
  created_at: string
}

export interface DatabaseData {
  members: Member[]
  posts: Post[]
  prayer_cards: PrayerCard[]
}

// DB 파일 저장 경로
const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'aamen_database.json')

// 기본 시드 데이터
const defaultData: DatabaseData = {
  members: [
    {
      id: 'admin',
      email: 'leeshkr@gmail.com',
      name: '개발자 관리자 (이승호)',
      provider: 'google',
      country_code: 'KR',
      role: 'super_admin',
      status: 'active',
      bio: 'AAMEN 시스템 개발 및 운영 총괄',
      created_at: '2026-09-01 09:00:00',
      updated_at: '2026-10-15 22:00:00',
    },
    {
      id: 'Jeanette',
      email: 'Jeanette.m.hanson@gmail.com',
      name: 'Jeanette Hanson',
      provider: 'google',
      country_code: 'US',
      role: 'super_admin',
      status: 'active',
      bio: 'MWC Boss / 총괄 리더십',
      created_at: '2026-09-05 10:00:00',
      updated_at: '2026-10-15 22:00:00',
    },
    {
      id: 'Jeremiah',
      email: 'hkjerechoi@gmail.com',
      name: 'Jeremiah',
      provider: 'google',
      country_code: 'HK',
      role: 'country_admin',
      status: 'active',
      bio: 'Hongkong Coordinator',
      created_at: '2026-09-10 14:00:00',
      updated_at: '2026-10-15 22:00:00',
    },
    {
      id: 'Paulus',
      email: 'psw.dosen@gmail.com',
      name: 'Paulus S. Widjaja',
      provider: 'google',
      country_code: 'ID',
      role: 'country_admin',
      status: 'active',
      bio: 'Indonesia Coordinator',
      created_at: '2026-09-12 11:00:00',
      updated_at: '2026-10-15 22:00:00',
    },
    {
      id: 'Andi',
      email: 'andiospeace@gmail.com',
      name: 'Andi Santoso',
      provider: 'google',
      country_code: 'US',
      role: 'country_admin',
      status: 'active',
      bio: 'Coordinator / MNN',
      created_at: '2026-09-15 09:00:00',
      updated_at: '2026-10-15 22:00:00',
    },
    {
      id: 'Hiro',
      email: 'h98484435@gmail.com',
      name: 'Hiro Katano',
      provider: 'google',
      country_code: 'JP',
      role: 'country_admin',
      status: 'active',
      bio: 'Japan Coordinator',
      created_at: '2026-09-18 10:00:00',
      updated_at: '2026-10-15 22:00:00',
    },
    {
      id: 'Bockki',
      email: 'bockkikim@gmail.com',
      name: 'Kim Bockki',
      provider: 'google',
      country_code: 'KR',
      role: 'regular',
      status: 'active',
      bio: 'Helper / MCSK 사역자',
      created_at: '2026-09-20 15:00:00',
      updated_at: '2026-10-15 22:00:00',
    },
    {
      id: 'Yongha',
      email: 'byh1424@gmail.com',
      name: 'Bae Yongha',
      provider: 'google',
      country_code: 'KR',
      role: 'country_admin',
      status: 'active',
      bio: 'Korea Coordinator / MCSK',
      created_at: '2026-09-22 16:00:00',
      updated_at: '2026-10-15 22:00:00',
    },
  ],
  posts: [],
  prayer_cards: [],
}

// DB 읽기 함수
export function readDb(): DatabaseData {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      writeDb(defaultData)
      return defaultData
    }
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    console.error('Database read error:', error)
    return defaultData
  }
}

// DB 쓰기 함수
export function writeDb(data: DatabaseData): boolean {
  try {
    const dir = path.dirname(DB_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Database write error:', error)
    return false
  }
}
