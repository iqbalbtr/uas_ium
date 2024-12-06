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
import { toast } from "@hooks/use-toast"
import { Order } from "@models/orders"
import { getOrder } from "@/actions/order"
import { getTransaction } from "@/actions/transaction"
import { Transaction } from "@models/transactions"



export default function TransactionSelect({
    onChange,
    value,
    setOrder
}: {
    onChange: (...event: any[]) => void;
    value: string,
    setOrder: React.Dispatch<React.SetStateAction<Transaction | null>>
}) {
    const [open, setOpen] = React.useState(false)
    const [select, setSelect] = React.useState<Transaction[]>([])
    const { isLoading, setLoading } = useLoading()

    const getData = async (name?: string) => {
        setLoading("loading");
        try {
            const get = await getTransaction(1, 5, name, "installment", "pending");
            const data = get?.data || [];
            setSelect(data as any);
        } catch (error: any) {
            console.error("Error fetching select:", error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading("idle")
        }
    };

    const HandleSearch = () => {
        let timeout: NodeJS.Timeout | null = null;
        return (name?: string) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                getData(name);
            }, 800);
        };
    };

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
                        ? select.find((order) => String(order?.code_transaction) === value)?.code_transaction
                        : "Cari..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput onInput={(e: any) => HandleSearch()(e.target.value)} placeholder="Search role..." className="h-9" />
                    <CommandList>
                        {isLoading === "loading" ? (
                            <div>
                                Loading
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>Transaksi tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                    {
                                        select.map((order) => (
                                            <CommandItem
                                                key={order.id}
                                                value={String(order.code_transaction)}
                                                onSelect={(currentValue) => {
                                                    onChange(currentValue === value ? "" : currentValue)
                                                    setOrder(pv => String(pv?.id) === value ? null : order)
                                                    setOpen(false)
                                                }}
                                            >
                                                {order.code_transaction}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value === String(order.id) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    }

                                </CommandGroup>
                            </>
                        )
                        }
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

