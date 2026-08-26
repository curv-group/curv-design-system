/**
 * Copy this when an OS needs a record peek. This is the **full surface** —
 * badge, identifier, copy, ⋯ menu, Banner, in-drawer tabs, property rows,
 * fields, sticky footer. Delete the slots the job does not need. Do not invent
 * a thinner private drawer.
 *
 * A peek is not a new route and not a page tab. Stay on the list / report.
 */
import * as React from "react";
import {
  Avatar,
  Badge,
  Banner,
  Button,
  CopyButton,
  Drawer,
  DrawerClose,
  DrawerRow,
  DrawerSection,
  Field,
  Menu,
  MenuItem,
  MenuSeparator,
  Select,
  Switch,
  TabPanel,
  Tabs,
  Textarea,
  TooltipProvider,
} from "@curvgroup/design-system";

const OWNERS = [
  { value: "alex", label: "Alex Morgan" },
  { value: "sam", label: "Sam Rivera" },
  { value: "jordan", label: "Jordan Lee" },
];

function Person({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Avatar name={name} size="sm" />
      {name}
    </span>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export function DealDrawer() {
  const [owner, setOwner] = React.useState("alex");
  const [watching, setWatching] = React.useState(true);

  return (
    <TooltipProvider>
      <Drawer
        trigger={<Button variant="outline" size="sm">Open deal</Button>}
        title="Adventure Works"
        description="SO-1042"
        badge={<Badge variant="green">Confirmed</Badge>}
        headerActions={
          <>
            <CopyButton value="SO-1042" label="Copy order number" />
            <Menu
              align="end"
              trigger={
                <Button variant="ghost" size="icon" className="size-8" aria-label="Deal actions">
                  <MoreIcon />
                </Button>
              }
            >
              <MenuItem>Duplicate</MenuItem>
              <MenuSeparator />
              <MenuItem destructive>Archive</MenuItem>
            </Menu>
          </>
        }
        footer={
          <>
            <DrawerClose render={<Button variant="secondary" size="sm">Close</Button>} />
            <Button size="sm">Save</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Banner variant="warning" title="Needs Ops pricing">
            Confirm freight before sending the quote.
          </Banner>
          <Tabs
            bar={false}
            defaultValue="details"
            aria-label="Deal views"
            items={[
              { value: "details", label: "Details" },
              { value: "activity", label: "Activity" },
            ]}
            className="-mx-1 border-b border-border"
          >
            <TabPanel value="details" className="flex flex-col gap-6 pt-4">
              <DrawerSection title="Properties">
                <DrawerRow label="Revenue">
                  <span className="tabular-nums">$48,200</span>
                </DrawerRow>
                <DrawerRow label="GP">
                  <span className="tabular-nums">$15,100</span>
                </DrawerRow>
                <DrawerRow label="Close date">24 Apr 2026</DrawerRow>
                <DrawerRow label="AE">
                  <Person name="Alex Morgan" />
                </DrawerRow>
                <DrawerRow label="Engineer">
                  <Person name="Quinn Patel" />
                </DrawerRow>
              </DrawerSection>
              <DrawerSection title="Assignment">
                <Field label="Owner" htmlFor="deal-owner">
                  <Select id="deal-owner" items={OWNERS} value={owner} onValueChange={setOwner} />
                </Field>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">Watch this deal</p>
                    <p className="text-[12px] text-muted-foreground">Ping on status changes</p>
                  </div>
                  <Switch checked={watching} onCheckedChange={setWatching} aria-label="Watch this deal" />
                </div>
              </DrawerSection>
              <DrawerSection title="Notes">
                <Field label="Internal notes" htmlFor="deal-notes">
                  <Textarea
                    id="deal-notes"
                    rows={4}
                    defaultValue="Customer wants trail packs in two drops. Flag Ops if freight lands above 8%."
                  />
                </Field>
              </DrawerSection>
            </TabPanel>
            <TabPanel value="activity" className="flex flex-col gap-4 pt-4">
              {[
                { name: "Alex Morgan", action: "moved status to Confirmed", time: "2 hours ago" },
                { name: "Quinn Patel", action: "joined as engineer", time: "Yesterday" },
                { name: "Sam Rivera", action: "added a note on freight", time: "3 days ago" },
                { name: "System", action: "quote SO-1042 created", time: "Last week" },
              ].map((event) => (
                <div key={event.time} className="flex gap-3">
                  <Avatar name={event.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[13px] leading-5 text-foreground">
                      <span className="font-medium">{event.name}</span>{" "}
                      <span className="text-muted-foreground">{event.action}</span>
                    </p>
                    <p className="text-[12px] text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </TabPanel>
          </Tabs>
        </div>
      </Drawer>
    </TooltipProvider>
  );
}
