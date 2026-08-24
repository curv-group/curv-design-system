/**
 * Copy this into a settings / form page. Narrow. Field around every control.
 * No charts, no tables, no KPI cards.
 */
import { Button, Field, Input, PageHeader, SettingsPage, Switch } from "@curvgroup/design-system";

export function NotificationSettingsPage() {
  return (
    <SettingsPage
      header={
        <PageHeader
          title="Notifications"
          description="How this workspace emails you."
        />
      }
    >
      <Field label="Reply-to email" htmlFor="reply">
        <Input id="reply" defaultValue="ops@curvgroup.com" />
      </Field>
      <Field label="Weekly digest" htmlFor="digest">
        <Switch id="digest" checked aria-label="Weekly digest" />
      </Field>
      <Button>Save</Button>
    </SettingsPage>
  );
}
