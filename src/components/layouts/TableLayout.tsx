import React, { ReactNode } from 'react'

function TableLayout({ children } : { children: ReactNode } ) {
    return (
        <div className='max-w-[86vw] overflow-x-auto'>
            <div className='w-full'>
                {children}
            </div>
        </div>
    )
}

export default TableLayout
