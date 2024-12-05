"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OpenShift() {
  const [initialBalance, setInitialBalance] = React.useState("500000.00");
  const [selectedShift, setSelectedShift] = React.useState("");

  const handleReset = () => {
    setInitialBalance("500000.00");
    setSelectedShift("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      shift: selectedShift,
      initialBalance,
      activeUser: "demotraining.apt (Imedis Apotek Training)",
    });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Buka Shift</CardTitle>
        <CardDescription>
          Open a new shift with initial balance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shift">Pilih Shift</Label>
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger id="shift">
                <SelectValue placeholder="PAGI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pagi">PAGI</SelectItem>
                <SelectItem value="siang">SIANG</SelectItem>
                <SelectItem value="malam">MALAM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Awal</Label>
            <Input
              id="balance"
              type="text"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">User Aktif</Label>
            <Input
              id="user"
              type="text"
              value="demotraining.apt (Imedis Apotek Training)"
              disabled
              className="bg-muted"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Simpan
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
