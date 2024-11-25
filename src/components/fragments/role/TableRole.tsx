"use client"
import { getUser } from '@/actions/auth';
import { getRole } from '@/actions/role';
import { Role } from '@/model/roles';
import { User } from '@/model/users';
import { Button } from '@components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import React, { useEffect, useState } from 'react'

function TableRole() {

    const [users, setUsers] = useState<Role[]>([]);

    useEffect(() => {
        getRole().then(res => {
            setUsers([...res.data])
        })
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Hak Akses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    users.map((fo, i) => (
                        <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{fo.name}</TableCell>
                            <TableCell><Button>Cek Akses</Button></TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default TableRole
