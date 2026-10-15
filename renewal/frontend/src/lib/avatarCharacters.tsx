'use client'

import React from 'react'

export interface AvatarItem {
  id: string
  src: string
}

// 50 Shuffled Avatar Icons
export const AVATAR_LIST: AvatarItem[] = Array.from({ length: 50 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0')
  return {
    id: `avatar_${num}`,
    src: `/images/avatars/avatar_${num}.png?v=2`,
  }
})

export function getAvatarSrc(id?: string): string {
  if (!id) return '/images/avatars/avatar_01.png?v=2'
  if (id.startsWith('avatar_')) {
    const num = id.replace('avatar_', '')
    const n = parseInt(num, 10)
    if (!isNaN(n) && n >= 1 && n <= 50) {
      return `/images/avatars/avatar_${String(n).padStart(2, '0')}.png?v=2`
    }
  }
  return '/images/avatars/avatar_01.png?v=2'
}

/**
 * Avatar Display Component
 * Cleanly renders the circular or rounded avatar image
 */
export function CharacterSvg({
  id,
  className = 'w-full h-full',
}: {
  id?: string
  className?: string
}) {
  const src = getAvatarSrc(id)

  return (
    <img
      src={src}
      alt="Avatar"
      className={`object-cover ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to avatar_01 if failed
        const target = e.currentTarget
        if (!target.src.includes('avatar_01.png')) {
          target.src = '/images/avatars/avatar_01.png'
        }
      }}
    />
  )
}

// Backward-compatibility stubs for any legacy references
export const CHARACTER_LIST = AVATAR_LIST.map((a) => ({
  id: a.id,
  title: 'Avatar',
  gender: 'all' as const,
  ageGroup: 'youth' as const,
  mood: '',
  hairDesc: '',
  skinDesc: '',
  outfitDesc: '',
  bgHex: '#ffffff',
}))

export function getCharacterItem(id: string) {
  return CHARACTER_LIST.find((c) => c.id === id) || CHARACTER_LIST[0]
}

export function getLocalizedCharacter(id: string, _locale: string) {
  return {
    id,
    title: 'Avatar',
    mood: '',
    hairDesc: '',
    skinDesc: '',
    outfitDesc: '',
    gender: 'all' as const,
    ageGroup: 'youth' as const,
  }
}

export function getLocalizedCharacterList(_locale: string) {
  return CHARACTER_LIST
}
