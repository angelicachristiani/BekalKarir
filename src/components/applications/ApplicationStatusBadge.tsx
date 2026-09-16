"use client";

import type { ApplicationStatus } from "@/types/application";
import { STATUS_CONFIG } from "@/types/application";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export default function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
      {config.label}
    </span>
  );
}
