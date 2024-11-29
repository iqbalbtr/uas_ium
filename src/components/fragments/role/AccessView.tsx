"use client"
import { getRoleByAccess } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import React from 'react'

function AccessView({ data }: { data: string[] }) {
    
    return (
        <Dialog>
            <DialogTrigger>
                Cek Akses
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hak akses</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div>
                    {getRoleByAccess(data).map((fo, i) => (
                        <div key={i}>
                            <div>
                                <label className='pr-2' htmlFor={fo.path}>{fo.label}</label>
                            </div>
                            <div>
                                {
                                    fo.child_path.length > 0 && fo.child_path.map((child, j) => (
                                        <div key={j} className='pl-6'>
                                            <label className='pr-2' htmlFor={child.path}>{child.label}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AccessView
