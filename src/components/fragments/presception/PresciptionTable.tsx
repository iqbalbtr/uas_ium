import TableLayout from '@components/layouts/TableLayout'
import Loading from '@components/ui/loading'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Prescription } from '@models/prescription'
import { TableMutation, TableView } from '@models/view'
import React from 'react'
import UpdatePresciptionForm from './UpdatePresciptionForm'
import DeletePresciption from './DeletePresciption'
import { PrescriptionStock } from './PresciptionStock'
import { useNumberPage } from '@hooks/use-paggination'
import { getRupiahFormat } from '@libs/utils'

function PresciptionTable({ data, handleFetch, isLoading }: TableView<Prescription>) {

    const { getNumber } = useNumberPage({})

    return (
        <TableLayout>
            <TableLayout>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                No
                            </TableHead>
                            <TableHead>
                                Nama
                            </TableHead>
                            <TableHead>
                                Kode
                            </TableHead>
                            <TableHead>
                                Dokter
                            </TableHead>
                            <TableHead>
                                Deskripsi
                            </TableHead>
                            <TableHead>
                                Diskon
                            </TableHead>
                            <TableHead>
                                Jasa
                            </TableHead>
                            <TableHead>
                                Pajak
                            </TableHead>
                            <TableHead>
                                Obat
                            </TableHead>
                            <TableHead>
                                Harga
                            </TableHead>
                            <TableHead>
                                Stock
                            </TableHead>
                            <TableHead>
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((fo, i) => (
                                <TableRow key={i}>
                                    <TableCell>{getNumber(i)}</TableCell>
                                    <TableCell>{fo.name}</TableCell>
                                    <TableCell>{fo.code_prescription}</TableCell>
                                    <TableCell>{fo.doctor_name}</TableCell>
                                    <TableCell>{fo.description}</TableCell>
                                    <TableCell>{fo.discount}</TableCell>
                                    <TableCell>{fo.fee}%</TableCell>
                                    <TableCell>{fo.tax}%</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{getRupiahFormat(fo.price)}</TableCell>
                                    <TableCell>
                                        <PrescriptionStock data={fo} handleFetch={handleFetch} />
                                    </TableCell>
                                    <TableCell>
                                        <DeletePresciption data={fo} handleFetch={handleFetch} />
                                        <UpdatePresciptionForm data={fo} handleFetch={handleFetch!} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    {
                        isLoading == "loading" ? (
                            <TableCaption className='w-full '>
                                <Loading type='loader' isLoading='loading' />
                            </TableCaption>
                        ) : data.length == 0 && (
                            <TableCaption className='w-full '>
                                Data kosong
                            </TableCaption>
                        )
                    }
                </Table>
            </TableLayout>
        </TableLayout>
    )
}

export default PresciptionTable
