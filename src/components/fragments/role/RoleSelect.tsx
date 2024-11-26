"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getRole } from "@/actions/role"
import useLoading from "@hooks/use-loading"
import { toast } from "@hooks/use-toast"
import { Role } from "@/model/roles"


export function RoleSelect({
    onChange,
    value
}: {
    onChange: (...event: any[]) => void;
    value: string
}) {
    const [open, setOpen] = React.useState(false)
    const [roles, setRoles] = React.useState<{ value: number, label: string }[]>([])
    const { isLoading, setLoading } = useLoading()

    const getData = async (name?: string) => {
        setLoading("loading");
        try {
            const get = await getRole(1, 5, name || "");
            const data = get?.data || [];
            setRoles(data.map(role => ({ value: role.id, label: role.name })));
            setLoading("success");
        } catch (error: any) {
            console.error("Error fetching roles:", error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            setLoading("error");
        }
    };

    const HandleSearch = (() => {
        let timeout: NodeJS.Timeout | null = null;
        return (name?: string) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                getData(name);
            }, 700);
        };
    })();
    React.useEffect(() => {
        getData()
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? roles.find((framework) => framework.label === value)?.label
                        : "Select role..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput onInput={(e: any) => HandleSearch(e.target.value)} placeholder="Search role..." className="h-9" />
                    <CommandList>
                        {
                            isLoading == "loading" ?
                                <span className="px-3 py-2">Loading</span> :
                                <CommandEmpty>No role found.</CommandEmpty>
                        }
                        <CommandGroup>
                            {roles.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={String(framework.value)}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === String(value) ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {framework.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === String(framework.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

