import React from "react";
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import { Shift as ShiftType } from "@models/shift";
import { Apotek } from "@models/apotek";
import { getDateFormat } from "@libs/utils";

const Shift = ({ shift, apotek }: { shift: ShiftType, apotek: Apotek }) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.apotekInfo}>Nama Apotek: {apotek.name}</Text>
      <Text style={styles.apotekInfo}>Alamat: {apotek.alamat}</Text>
      <Text style={styles.apotekInfo}>Kontak: {apotek.phone}</Text>
      <Text style={styles.apotekInfo}>Email: {apotek.email}</Text>

      <Text style={styles.title}>Laporan Shift</Text>
      <Text style={styles.subtitle}>Periode: {getDateFormat(shift.start_shift, "/")} 08:00 - {getDateFormat(shift.end_shift, "/")} 16:00</Text>

      <Text style={styles.sectionTitle}>Rincian Keuangan:</Text>
      <Text style={styles.text}>Saldo Awal: Rp. {shift.begining_balance}</Text>
      <Text style={styles.text}>Hasil Penjualan Apotek: Rp. {shift.sales_total}</Text>
      <Text style={styles.text}>Pembayaran Piutang: Rp. {shift.receivables_total}</Text>
      <Text style={styles.text}>Total Pendapatan: Rp. {shift.income_total}</Text>
      <Text style={styles.text}>Retur Penjualan Apotek: Rp. {shift.retur_total}</Text>
      <Text style={styles.text}>Total Pengeluaran: Rp. {shift.retur_total}</Text>
      <Text style={styles.text}>Saldo Akhir: Rp. {shift.ending_balance}</Text>
      <Text style={styles.text}>Selisih Saldo: Rp. {shift.balance_different}</Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingBottom: 15,
    height: "auto",
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 20,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  text: {
    marginVertical: 3,
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  apotekInfo: {
    fontSize: 10,
    textAlign: "left",
    marginBottom: 2,
  },
});

export default Shift;
