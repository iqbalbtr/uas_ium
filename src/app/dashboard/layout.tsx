"use client"
import Page from '@components/navbar/sidebar'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Page>
        {children}
      </Page>
    </SessionProvider>
  )
}

export default layout
