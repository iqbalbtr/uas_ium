import Page from '@components/sidebar'
import React, { ReactNode } from 'react'

function layout({children}:{children: ReactNode}) {
  return (
    <Page>
      {children}
    </Page>
  )
}

export default layout
