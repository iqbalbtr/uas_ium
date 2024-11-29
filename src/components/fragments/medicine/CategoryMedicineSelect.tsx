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

export function CategoryMedicineSelect({
    onChange,
    value
}: {
    onChange: (...event: any[]) => void;
    value: string
}) {
    const [open, setOpen] = React.useState(false)
    const categories = [
        { value: 'Analgesik (Pereda Nyeri)', label: 'Analgesik (Pereda Nyeri)' },
        { value: 'Antibiotik', label: 'Antibiotik' },
        { value: 'Antipiretik (Penurun Panas)', label: 'Antipiretik (Penurun Panas)' },
        { value: 'Antihistamin (Alergi)', label: 'Antihistamin (Alergi)' },
        { value: 'Antidepresan', label: 'Antidepresan' },
        { value: 'Antijamur', label: 'Antijamur' },
        { value: 'Antivirus', label: 'Antivirus' },
        { value: 'Antiparkinson', label: 'Antiparkinson' },
        { value: 'Antihipertensi (Tekanan Darah Tinggi)', label: 'Antihipertensi (Tekanan Darah Tinggi)' },
        { value: 'Antidiabetes', label: 'Antidiabetes' },
        { value: 'Obat Maag dan Lambung', label: 'Obat Maag dan Lambung' },
        { value: 'Vitamin dan Suplemen', label: 'Vitamin dan Suplemen' },
        { value: 'Obat Batuk dan Pilek', label: 'Obat Batuk dan Pilek' },
        { value: 'Obat Kulit', label: 'Obat Kulit' },
        { value: 'Obat Mata', label: 'Obat Mata' },
        { value: 'Obat Telinga', label: 'Obat Telinga' },
        { value: 'Obat Jantung', label: 'Obat Jantung' },
        { value: 'Obat Hormon', label: 'Obat Hormon' },
        { value: 'Psikotropika', label: 'Psikotropika' },
        { value: 'Lainnya', label: 'Lainnya' }
      ];
      
      
    const { isLoading, setLoading } = useLoading()
    const [category, setCategory] = React.useState("")

    // const getData = async (name?: string) => {
    //     setLoading("loading");
    //     try {
    //         const get = await getRole(1, 5, name || "");
    //         const data = get?.data || [];
    //         setRoles(data.map(role => ({ value: role.id, label: role.name })));
    //         setLoading("success");
    //     } catch (error: any) {
    //         console.error("Error fetching roles:", error);
    //         toast({
    //             title: "Error",
    //             description: error.message,
    //             variant: "destructive",
    //         });
    //         setLoading("error");
    //     }
    // }
    // const HandleSearch = (() => {
    //     let timeout: NodeJS.Timeout | null = null;
    //     return (name?: string) => {
    //         if (timeout) clearTimeout(timeout);
    //         timeout = setTimeout(() => {
    //             getData(name);
    //         }, 700);
    //     };
    // })();

    // React.useEffect(() => {
    //     getData()
    // }, [])

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
                        ? categories.find((framework) => framework.label === value)?.label
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
                            {categories.map((framework) => (
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

