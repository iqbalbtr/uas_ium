"use client"
import { Card } from "@/components/ui/card";
import { Building, DollarSign, Clock } from "lucide-react";

export default function NotificationsList() {
  return (
    <div className="w-full space-y-4 p-4 overflow-y-auto">
      {/* Maintenance Request Update */}
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-gray-100 p-2">
            <Building className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <h3 className="font-semibold">Maintenance</h3>
              </div>
              <span className="text-sm text-gray-500">5h ago</span>
            </div>
            <p className="mt-1 text-gray-600">
              The maintenance request for{" "}
              <span className="font-medium">John Doe</span> in{" "}
              <span className="font-medium">Apartment 301</span> has been{" "}
              <span className="text-green-600">Completed</span>. The issue was a{" "}
              <span className="font-medium">leaking faucet in the kitchen</span>
              .
            </p>
          </div>
        </div>
      </Card>

      {/* Rent Payment Confirmation */}
     
    </div>
  );
}
