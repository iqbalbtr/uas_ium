import { Item, NavType } from '@components/app/app-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Switch } from '@components/ui/switch';
import { icons } from 'lucide-react';
import React, { useState } from 'react';

function AccessCard({
    data,
    handle,
    access,
}: {
    data: NavType;
    handle: (parent: string, child?: string) => void;
    access: NavType[];
}) {
    const [isOpen, setOpen] = useState(false);
    const Icon = icons[isOpen ? 'ChevronUp' : 'ChevronDown'];

    const isParentActive = !!access.find((navItem) => navItem.url === data.url);
    const getChildActive = (childUrl: string) =>
        access
            .find((navItem) => navItem.url === data.url)
            ?.items?.some((item) => item.url === childUrl);

    return (
        <Card className="h-fit w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    {data.title}
                    <div className="flex gap-2 items-center">
                        <Switch
                            checked={isParentActive}
                            disabled={data.url == "/dashboard"}
                            onClick={() => handle(data.url)}
                        />
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
                                <Switch
                                    disabled={!isParentActive}
                                    checked={getChildActive(child.url)}
                                    onClick={() => handle(data.url, child.url)}
                                />
                            </CardTitle>
                        </Card>
                    </CardContent>
                ))}
        </Card>
    );
}

export default AccessCard;
