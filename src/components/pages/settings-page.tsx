import * as React from "react";
import { cn } from "../../lib/cn";
import { PageContainer } from "../shell/page-container";

export interface SettingsPageProps {
  header: React.ReactNode;
  /** Field stack (and related copy). No dashboard chrome, no KPI cards. */
  children: React.ReactNode;
  className?: string;
}

/**
 * SettingsPage — a form or account surface. Narrow container. Use Field
 * around every control. Do not put charts or tables here.
 */
export function SettingsPage({ header, children, className }: SettingsPageProps) {
  return (
    <PageContainer size="narrow" className={cn("flex flex-col gap-6", className)}>
      {header}
      <div className="flex flex-col gap-5">{children}</div>
    </PageContainer>
  );
}
