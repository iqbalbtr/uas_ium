"use client"
import AppDashboard from '@components/app/app-dashboard'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppDashboard>
        {children}
      </AppDashboard>
    </SessionProvider>
  )
}

export default layout
