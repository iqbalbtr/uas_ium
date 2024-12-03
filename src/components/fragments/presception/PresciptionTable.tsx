import TableLayout from '@components/layouts/TableLayout'
import Loading from '@components/ui/loading'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Prescription } from '@models/prescription'
import { TableMutation, TableView } from '@models/view'
import React from 'react'
import UpdatePresciptionForm from './UpdatePresciptionForm'
import DeletePresciption from './DeletePresciption'
import { PrescriptionStock } from './PresciptionStock'


// export const prescriptions = pgTable("prescriptions", {
//     id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//     code_prescription: varchar("code_prescription", { length: 100 })
//       .unique()
//       .notNull(),
//     prescription_date: timestamp("prescription_date").notNull(),
//     name: varchar("name", { length: 55 }).notNull(),
//     doctor_name: varchar("doctor_name", { length: 50 }),
//     description: text("description"),
//     price: integer("price").notNull(),
//     discount: integer("discount").default(0),
//     fee: integer("fee").default(0),
//     tax: integer("tax").default(0),
//     instructions: text("instructions"),
//   });

//   export const prescription_medicine = pgTable("prescription_medicine", {
//     id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//     prescription_id: integer("prescription_id")
//       .references(() => prescriptions.id, { onDelete: "cascade" })
//       .notNull(),
//     medicine_id: integer("medicine_id").references(() => medicines.id, {
//       onDelete: "set null",
//     }),
//     quantity: integer("quantity").notNull(),
//     notes: text("notes"),
//   });


function PresciptionTable({ data, handleFetch, isLoading }: TableView<Prescription>) {
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
                                <TableRow>
                                    <TableCell>{++i}</TableCell>
                                    <TableCell>{fo.name}</TableCell>
                                    <TableCell>{fo.code_prescription}</TableCell>
                                    <TableCell>{fo.doctor_name}</TableCell>
                                    <TableCell>{fo.description}</TableCell>
                                    <TableCell>{fo.discount}</TableCell>
                                    <TableCell>{fo.fee}</TableCell>
                                    <TableCell>{fo.tax}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{fo.price}</TableCell>
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
                    {isLoading == "loading" && (
                        <TableCaption><Loading isLoading={isLoading} /></TableCaption>
                    )}
                </Table>
            </TableLayout>
        </TableLayout>
    )
}

export default PresciptionTable