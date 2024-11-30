"use client"
import { getUser } from '@/actions/auth';
import { User } from '@/model/users';
import { Button } from '@components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Delete } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { TableView } from '@/model/view';
import { Medicine } from '@models/medicines';
import DeleteUser from '../user/DeleteUser';

function MedicineTable({
    data,
    isLoading,
    handleFetch
}: TableView<Medicine>) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Name </TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Dosis</TableHead>
                    <TableHead>Active Ingredient</TableHead>
                    <TableHead>Expired</TableHead>
                    <TableHead>Indication</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Side Effect</TableHead>
                    <TableHead>Reminder</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { isLoading !== "loading" ?
                    data.map((fo, i) => (
                        <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{fo.name}</TableCell>
                            <TableCell>{fo.medicine_code}</TableCell>
                            <TableCell>{fo.medicine_category}</TableCell>
                            <TableCell>{fo.medicine_type}</TableCell>
                            <TableCell>{fo.dosage}</TableCell>
                            <TableCell>{fo.active_ingredients}</TableCell>
                            <TableCell>{fo.expired?.toLocaleString()}</TableCell>
                            <TableCell>{fo.indication}</TableCell>
                            <TableCell>{fo.stock}</TableCell>
                            <TableCell>{fo.price}</TableCell>
                            <TableCell>{fo.side_effect}</TableCell>
                            {/* Kurang paham */}
                            <TableCell>{fo.medicine_reminder?.max_stock}</TableCell>
                            <TableCell>
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
    )
}

export default MedicineTable
