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
import useLoading from "@hooks/use-loading"

export function TypeMedicineSelect({
    onChange,
    value
}: {
    onChange: (...event: any[]) => void;
    value: string
}) {
    const [open, setOpen] = React.useState(false)
    const types = [
        { value: 'Tablet', label: 'Tablet' },
        { value: 'Kapsul', label: 'Kapsul' },
        { value: 'Sirup', label: 'Sirup' },
        { value: 'Salep', label: 'Salep' },
        { value: 'Krim', label: 'Krim' },
        { value: 'Gel', label: 'Gel' },
        { value: 'Injeksi (Suntik)', label: 'Injeksi (Suntik)' },
        { value: 'Suppositoria (Obat Dubur)', label: 'Suppositoria (Obat Dubur)' },
        { value: 'Inhaler (Obat Hirup)', label: 'Inhaler (Obat Hirup)' },
        { value: 'Patch (Koyo/Plester)', label: 'Patch (Koyo/Plester)' },
        { value: 'Serbuk', label: 'Serbuk' },
        { value: 'Suspensi', label: 'Suspensi' },
        { value: 'Tetes Mata', label: 'Tetes Mata' },
        { value: 'Tetes Telinga', label: 'Tetes Telinga' },
        { value: 'Tetes Hidung', label: 'Tetes Hidung' },
        { value: 'Obat Kumur', label: 'Obat Kumur' },
        { value: 'Spray (Semprot)', label: 'Spray (Semprot)' },
        { value: 'Granul (Butiran)', label: 'Granul (Butiran)' },
        { value: 'Infus', label: 'Infus' },
        { value: 'Pil', label: 'Pil' },
        { value: 'Obat Tradisional', label: 'Obat Tradisional' },
        { value: 'Obat Herbal', label: 'Obat Herbal' }
      ];
      
    const { isLoading, setLoading } = useLoading()
    const [category, setCategory] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {value
                        ? types.find((framework) => framework.label === value)?.label
                        : "Pilih kategori..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandInput onInput={(e: any) => setCategory(e.target.value)} placeholder="Search role..." />
                    <CommandList>
                        {
                            isLoading == "loading" ?
                                <span className="px-3 py-2">Loading</span> :
                                <CommandEmpty>No role found.</CommandEmpty>
                        }
                        <CommandGroup>
                            {types.map((framework) => (
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

