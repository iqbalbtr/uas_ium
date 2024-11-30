"use client"
import { User } from '@/model/users';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import React from 'react'
import UpdateUserForm from './UpdateUserForm';
import { TableView } from '@/model/view';
import DeleteUser from './DeleteUser';

function UserTable({
    data,
    isLoading,
    handleFetch
}: TableView<User>) {

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
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { isLoading !== "loading" ?
                    data.map((fo, i) => (
                        <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{fo.username}</TableCell>
                            <TableCell>{fo.name}</TableCell>
                            <TableCell>{fo.status}</TableCell>
                            <TableCell>{fo.phone}</TableCell>
                            <TableCell>{fo.role?.name}</TableCell>
                            <TableCell>
                                <DeleteUser data={fo} handleFetch={handleFetch} />
                                <UpdateUserForm handleFetch={handleFetch} data={fo} />  
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

export default UserTable