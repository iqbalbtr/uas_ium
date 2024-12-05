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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputBeforeClose() {
  const [balance, setBalance] = React.useState("1,100,000.00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      cashierBalance: balance,
    });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Tutup Shift</CardTitle>
        <CardDescription>
          Close the current shift with final balance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Kasir</Label>
            <Input
              id="balance"
              type="text"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Proses
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
