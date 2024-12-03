"use client"
import { Card } from "@/components/ui/card";
import { Building, DollarSign, Clock } from "lucide-react";

export default function NotificationsList() {
  return (
    <div className="w-full max-w-2xl space-y-4 p-4 overflow-y-auto">
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
                <h3 className="font-semibold">Maintenance request update</h3>
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
      <Card className="bg-green-50 p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-white p-2">
            <DollarSign className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <h3 className="font-semibold">Rent Payment Confirmation</h3>
              </div>
              <span className="text-sm text-gray-500">7h ago</span>
            </div>
            <p className="mt-1 text-gray-600">
              We have received the rent payment of{" "}
              <span className="font-medium">$1,200</span> for{" "}
              <span className="font-medium">Jane Smith</span> in{" "}
              <span className="font-medium">Apartment 102</span>. The payment
              was processed <span className="text-green-600">successfully</span>
              .
            </p>
          </div>
        </div>
      </Card>

      {/* Lease Renewal Reminder */}
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-gray-100 p-2">
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <h3 className="font-semibold">Lease Renewal Reminder</h3>
              </div>
              <span className="text-sm text-gray-500">7h ago</span>
            </div>
            <p className="mt-1 text-gray-600">
              The lease for <span className="font-medium">Esther Howard</span>{" "}
              in <span className="font-medium">Apartment 308</span> is set to{" "}
              <span className="text-red-600">expire on October 15, 2023</span>.
              Please take appropriate action to initiate lease renewal
              discussions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
