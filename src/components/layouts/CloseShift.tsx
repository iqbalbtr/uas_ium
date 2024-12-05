import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { Printer } from "lucide-react";

export default function CloseShift() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Tutup Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="saldo-awal">Saldo Awal</Label>
                  <Input
                    id="saldo-awal"
                    placeholder="Masukkan saldo awal"
                    type="number"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hasil-penjualan">
                    Hasil Penjualan Apotek
                  </Label>
                  <Input
                    id="hasil-penjualan"
                    placeholder="Masukkan hasil penjualan"
                    type="number"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pembayaran-piutang">
                    Pembayaran Piutang Apotek
                  </Label>
                  <Input
                    id="pembayaran-piutang"
                    placeholder="Masukkan pembayaran piutang"
                    type="number"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total-pendapatan">Total Pendapatan</Label>
                  <Input
                    id="total-pendapatan"
                    placeholder="Total pendapatan"
                    type="number"
                    step="0.01"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retur-penjualan">
                    Retur Penjualan Apotek
                  </Label>
                  <Input
                    id="retur-penjualan"
                    placeholder="Masukkan retur penjualan"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="total-pengeluaran">Total Pengeluaran</Label>
                  <Input
                    id="total-pengeluaran"
                    placeholder="Total pengeluaran"
                    type="number"
                    step="0.01"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saldo-akhir">Saldo Akhir</Label>
                  <Input
                    id="saldo-akhir"
                    placeholder="Saldo akhir"
                    type="number"
                    step="0.01"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saldo-kasir">Saldo Kasir</Label>
                  <Input
                    id="saldo-kasir"
                    placeholder="Masukkan saldo kasir"
                    type="number"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selisih-saldo">Selisih Saldo</Label>
                  <Input
                    id="selisih-saldo"
                    placeholder="Selisih saldo"
                    type="number"
                    step="0.01"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diserahkan-kepada">Di Serahkan Kepada</Label>
                  <Select>
                    <SelectTrigger id="diserahkan-kepada">
                      <SelectValue placeholder="Pilih penerima" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">User 1</SelectItem>
                      <SelectItem value="user2">User 2</SelectItem>
                      <SelectItem value="user3">User 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama</Label>
              <Input id="nama" placeholder="Masukkan nama" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <TextArea
                id="catatan"
                placeholder="Masukkan catatan"
                className="min-h-[100px]"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Apabila ada{" "}
              <span className="font-medium">selisih saldo shift</span>, silakan
              isi kolom catatan untuk memberi penjelasan ke Owner. Agar tidak
              terjadi salah paham.
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
