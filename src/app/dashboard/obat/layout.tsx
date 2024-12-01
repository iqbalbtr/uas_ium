"use client"
import React, { ReactNode, Suspense } from 'react'

function Layout({children}:{children: ReactNode}) {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

export default Layout
