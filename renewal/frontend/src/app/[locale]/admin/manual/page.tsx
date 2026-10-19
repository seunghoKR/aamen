'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminSiteManual from '@/components/admin/AdminSiteManual'
import { getStoredUser } from '@/lib/auth'

export default function AdminManualPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ko'
  const currentUser = getStoredUser()
  const isDeveloper = currentUser?.role === 'developer'

  return (
    <div className="space-y-6">
      <AdminSiteManual locale={locale} isDeveloper={isDeveloper} />
    </div>
  )
}
