"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import React, {  ReactNode } from 'react'
import nav from "@assets/json/nav.json"
import { Checkbox } from '@components/ui/checkbox'

function AccessDialog({ children, access, setAccess }: { children: ReactNode, access: string[], setAccess: (arr: string[]) => void }) {

    const handleChek = (val: string) => {
        console.log(val);
        if (access.find(fo => fo == val))
            return setAccess([...access.filter(fi => fi !== val)])
        return setAccess([...access, val])
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Hak akses
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div>
                    {
                        nav.map((fo, i) => (
                            <div key={i}>
                                <div>
                                    <label className='pr-2' htmlFor={fo.path}>{fo.label}</label>
                                    {!fo.child_path.length && <Checkbox defaultChecked={access.includes(fo.path)} onClick={() => handleChek(fo.path)} value={fo.path} id={fo.path} />}
                                </div>
                                <div>
                                    {
                                        fo.child_path.length > 0 && fo.child_path.map((child, j) => (
                                            <div key={j} className='pl-6'>
                                                <label className='pr-2' htmlFor={child.path}>{child.label}</label>
                                                <Checkbox defaultChecked={access.includes(child.path)} onClick={() => handleChek(child.path)} value={child.path} id={child.path} />

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <DialogFooter />
            </DialogContent>
        </Dialog>
    )
}

export default AccessDialog
