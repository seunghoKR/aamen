import { MemberLevel } from './store'
import { TIER_STORAGE_KEY, TIER_EVENT_NAME } from '@/components/common/GlobalTierSimulator'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'developer' | 'super_admin' | 'country_admin' | 'level3_worker' | 'regular' | 'associate' | 'guest'
  tierLevel: MemberLevel
  status?: string
  country_code?: string
  phone?: string
  provider?: string
}

export const AUTH_USER_KEY = 'aamen_current_user'
export const AUTH_ROLE_KEY = 'aamen_auth_role'
export const AUTH_EVENT_NAME = 'aamen_auth_change'

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (raw) {
      return JSON.parse(raw) as AuthUser
    }
  } catch (e) {
    console.error('Failed to parse stored user:', e)
  }
  return null
}

export function saveAuthUser(user: AuthUser) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    localStorage.setItem(AUTH_ROLE_KEY, user.role)
    localStorage.setItem(TIER_STORAGE_KEY, String(user.tierLevel))

    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: { user } }))
    window.dispatchEvent(new CustomEvent(TIER_EVENT_NAME, { detail: { level: user.tierLevel } }))
  } catch (e) {
    console.error('Failed to save auth user:', e)
  }
}

export function logoutUser() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.setItem(AUTH_ROLE_KEY, 'guest')
    localStorage.setItem(TIER_STORAGE_KEY, '0')

    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: { user: null } }))
    window.dispatchEvent(new CustomEvent(TIER_EVENT_NAME, { detail: { level: 0 } }))
  } catch (e) {
    console.error('Failed to logout user:', e)
  }
}
