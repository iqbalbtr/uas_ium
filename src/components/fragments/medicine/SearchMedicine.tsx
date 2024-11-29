import { getMedicine } from '@/actions/medicine'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import useLoading from '@hooks/use-loading'
import { toast } from '@hooks/use-toast'
import { Medicine } from '@models/medicines'
import { Minus, Plus, Search } from 'lucide-react'
import React, { useState } from 'react'


function SearchMedicine({ handleAdd }: { handleAdd: (val: Medicine, qty: number) => void }) {

    const [result, setResult] = useState<Medicine[]>([]);
    const [selected, setSelect] = useState<Medicine | null>(null)
    const [qty, setQty] = useState(0)
    const { isLoading, setLoading } = useLoading()

    async function getData(e?: string) {
        try {
            setLoading("loading")
            const get = await getMedicine(1,5,e)
            setResult(get.data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Error searching medicine",
                variant: "destructive"
            })
        } finally {
            setLoading("idle")
        }
    }

    function handleSeacrh() {
        let timeout: NodeJS.Timeout | null = null;
        return (name: string) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                getData(name);
            }, 700);
        };
    }

    function handleSelect(val: Medicine) {
        setSelect(pv => pv ? pv.id == val.id ? null : val : val)
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center p-3 bg-card border-card shadow'>
                <Input placeholder="Cari obat nama, kode" onChange={(e) => handleSeacrh()(e.target.value)} />
            </div>
            <Card className='max-h-[55vh]'>
                <CardHeader>
                    <CardTitle>
                        Hasil
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>harga</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                isLoading == "loading" ? (
                                    (
                                        <TableRow >
                                            <TableCell>Loading</TableCell>
                                        </TableRow>
                                    )
                                ) : result.length ? result.map((fo, i) => (
                                    <TableRow key={i} onClick={() => handleSelect(fo)} className={selected?.id == fo.id ? `bg-primary-foreground` : ""}>
                                        <TableCell>{++i}</TableCell>
                                        <TableCell>{fo.medicine_code}</TableCell>
                                        <TableCell>{fo.name}</TableCell>
                                        <TableCell>{fo.stock}</TableCell>
                                        <TableCell>{fo.price}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow >
                                        <TableCell>Data tidak ada</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className='flex gap-2 items-center p-3 rounded-md bg-card shadow'>
                <Input
                    type='text'
                    onChange={(e) => setQty(!isNaN(Number(e.target.value)) ? Number(e.target.value) : qty)}
                    value={qty} placeholder='Mausukan jumlah'
                />
                <Button onClick={() => {
                    if (!selected)
                        return
                    handleAdd(selected, qty)
                    setSelect(null)
                    setQty(0)
                }}>
                    Tambah
                    <Plus />
                </Button>
            </div>
        </div>
    )
}

export default SearchMedicine
