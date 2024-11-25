"use client"
import { getUser } from '@/actions/auth';
import { User } from '@/model/users';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import React, { useEffect, useState } from 'react'

function TableUser() {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getUser().then(res => {
            setUsers([...res.data])
        })
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Name</TableHead>
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
                            <TableCell>{fo.username}</TableCell>
                            <TableCell>{fo.name}</TableCell>
                            <TableCell>{fo.status}</TableCell>
                            <TableCell>{fo.phone}</TableCell>
                            <TableCell>{fo.role.name}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default TableUser
