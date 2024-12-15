"use client";
import React from "react";
import DashboardLayout, {
  DashboardLayoutHeader,
} from "@components/layouts/DashboardLayout";
import TimelineLog from "@components/fragments/activity/TimelineLog";

function ActivityLog() {
  return (
    <DashboardLayout>
      <DashboardLayoutHeader title="Log Aktifitas"></DashboardLayoutHeader>
      <TimelineLog />
    </DashboardLayout>
  );
}

export default ActivityLog;
