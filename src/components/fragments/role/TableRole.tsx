"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import React from 'react'
import AccessView from './AccessView';
import UpdateRoleForm from './UpdateRoleForm';
import DeleteRole from './DeleteRole';
import { TableView } from '@/model/view';
import { Role } from '@/model/roles';

function TableRole({ data, isLoading, handleFetch }: TableView<Role>) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-[30px]'>No</TableHead>
                    <TableHead className='min-w-[100px] w-[100px]'>Nama</TableHead>
                    <TableHead>Hak Akses</TableHead>
                    <TableHead className='w-[120px]'>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading !== "loading" ?
                    data.map((fo, i) => (
                        <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{fo.name}</TableCell>
                            <TableCell><AccessView data={fo.access_rights ?? []} /></TableCell>
                            <TableCell>
                                <UpdateRoleForm handleFetch={handleFetch} data={fo ?? {}} />
                                <DeleteRole handleFetch={handleFetch} data={fo} />
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow >
                            <TableCell className='text-center' rowSpan={4}>
                                Loading
                            </TableCell>
                        </TableRow>
                    )
                }
            </TableBody>
        </Table>
    )
}

export default TableRole
