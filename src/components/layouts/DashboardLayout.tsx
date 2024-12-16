import React, { ReactNode } from 'react'

function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <main className="w-full p-4 relative">
            {children}
        </main>
    )
}

export function DashboardLayoutHeader({ children, title }: { title: string, children?: ReactNode }) {
    return (
        <div className="flex w-full justify-between">
            <h1 className="text-2xl py-3 font-semibold">{title}</h1>
            <div className='flex items-center gap-2'>
                {children}
            </div>
        </div>

    )
}

export default DashboardLayout