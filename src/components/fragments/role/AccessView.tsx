"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { Item, NavType } from '@components/app/app-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Switch } from '@components/ui/switch';
import { icons } from 'lucide-react';
import React, { useState } from 'react';

function AccessCard({
    data,
}: {
    data: NavType;
}) {
    const [isOpen, setOpen] = useState(false);
    const Icon = icons[isOpen ? 'ChevronUp' : 'ChevronDown'];

    return (
        <Card className="h-fit w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    {data.title}
                    <div className="flex gap-2 items-center">
                        {data.items?.length! > 0 && (
                            <Icon
                                className="cursor-pointer"
                                onClick={() => setOpen((prev) => !prev)}
                            />
                        )}
                    </div>
                </CardTitle>
            </CardHeader>

            {isOpen &&
                data.items?.length! > 0 &&
                data.items?.map((child, index) => (
                    <CardContent className="flex flex-col gap-1 p-1" key={index}>
                        <Card className="py-2 shadow-none px-5 my-0">
                            <CardTitle className="flex items-center justify-between gap-2">
                                {child.title}
                            </CardTitle>
                        </Card>
                    </CardContent>
                ))}
        </Card>
    );
}


function AccessView({ data }: { data: NavType[] }) {
    
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
                {
                        data.map((fo, i) => <AccessCard data={fo} key={i} />)
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AccessView
