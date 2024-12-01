"use client"
import { Button } from '@components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import React from 'react'
import { TableView } from '@/model/view';
import { Medicine } from '@models/medicines';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import UpdateMedicineForm from './UpdateMedicineForm';
import DeleteMedicine from './DeleteMedicine';

function MedicineTable({
    data,
    isLoading,
    handleFetch
}: TableView<Medicine>) {

    return (
        <div className='max-w-[86vw] overflow-x-auto'>
            <Table className='w-full'>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name </TableHead>
                        <TableHead>Kode</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Dosis</TableHead>
                        <TableHead>Active Ingredient</TableHead>
                        <TableHead>Masa Kadaluarsa</TableHead>
                        <TableHead>Indication</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Side Effect</TableHead>
                        <TableHead>Pengingat</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading !== "loading" ?
                        data.map((fo, i) => (
                            <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{fo.name}</TableCell>
                                <TableCell>{fo.medicine_code}</TableCell>
                                <TableCell>{fo.medicine_category}</TableCell>
                                <TableCell>{fo.medicine_type}</TableCell>
                                <TableCell>{fo.dosage}</TableCell>
                                <TableCell>{fo.active_ingredients}</TableCell>
                                <TableCell>{fo.expired?.toLocaleString()} hari</TableCell>
                                <TableCell>{fo.indication}</TableCell>
                                <TableCell>{fo.stock}</TableCell>
                                <TableCell>{fo.price}</TableCell>
                                <TableCell>{fo.side_effect}</TableCell>
                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline">Cek</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48">
                                            <div className="grid  gap-4">
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>Minimal stok</TableCell>
                                                            <TableCell>{fo.medicine_reminder?.min_stock}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Maksimal stok</TableCell>
                                                            <TableCell>{fo.medicine_reminder?.max_stock}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                <TableCell>
                                    <UpdateMedicineForm data={fo} handleFetch={handleFetch} />
                                    <DeleteMedicine data={fo} handleFetch={handleFetch} />
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell>Loading</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default MedicineTable
