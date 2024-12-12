"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout, {
  DashboardLayoutHeader,
} from "@components/layouts/DashboardLayout";
import TimelineLog from "@components/layouts/TimelineLog";

function ActivityLog() {
  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Activity Log"></DashboardLayoutHeader>
      <TimelineLog />
    </DashboardLayout>
  );
}

export default ActivityLog;
