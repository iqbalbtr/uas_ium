import { Button } from '@components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { BadgeCheck } from 'lucide-react'
import React from 'react'

function UserProfile() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className='px-2 w-full py-2 flex gap-2 items-center'>
                    <BadgeCheck size={18} />
                    Account
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Profile User
                    </DialogTitle>
                    <DialogDescription>
                        Ini deskripsi
                    </DialogDescription>
                </DialogHeader>
                <div>
                    ini kontent
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UserProfile
