"use client"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import React from 'react'
import AccessView from './AccessView';
import UpdateRoleForm from './UpdateRoleForm';
import DeleteRole from './DeleteRole';
import { TableView } from '@/model/view';
import { Role } from '@/model/roles';
import Loading from '@components/ui/loading';

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
                {
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
                    ))
                }
            </TableBody>
            {
                isLoading == "loading" && (
                    <TableCaption className='w-full '>
                        <Loading type='loader' isLoading='loading' />
                    </TableCaption>
                )
            }
        </Table>
    )
}

export default TableRole
