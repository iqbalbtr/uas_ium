import { Item } from '@/app/dashboard/kasir/page'
import { Button } from '@components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { TextArea } from '@components/ui/textarea'
import { BadgeCheck } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { ItemPresciption } from './PresciptionMedicineTable'

function PresciptionMedicineNote({ item, setItem }: { item: ItemPresciption, setItem: Dispatch<SetStateAction<ItemPresciption[]>> }) {

    function handleEdit(e: string) {        
        setItem(pv => pv.map(fo => (
            fo.medicineId == item.medicineId ? {
                ...fo,
                notes: e
            } : fo
        )))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className='px-2 w-full py-2 flex gap-2 items-center'>
                    Ubah
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Catatan Obat
                    </DialogTitle>
                    <DialogDescription>
                        Ini deskripsi
                    </DialogDescription>
                </DialogHeader>
                <TextArea value={item.notes} rows={7} onChange={(e) => handleEdit(e.target.value)} />
            </DialogContent>
        </Dialog>
    )
}

export default PresciptionMedicineNote
