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
    <span className="inline-flex items-center gap-1.5">
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

const ICON = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function DollarIcon() {
  return (
    <svg {...ICON}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg {...ICON}>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg {...ICON}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg {...ICON}>
      <path d="M12 2H2v10l9.3 9.3a2 2 0 0 0 2.8 0L22 14.8a2 2 0 0 0 0-2.8Z" />
      <circle cx="7" cy="7" r="1" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg {...ICON}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
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
        <div className="-mx-4 -mt-3">
          <Banner variant="warning" title="Needs Ops pricing" className="rounded-none border-x-0 border-t-0 px-4 py-2.5">
            Confirm freight before sending the quote.
          </Banner>
          <Tabs
            size="sm"
            bar={false}
            defaultValue="details"
            aria-label="Deal views"
            items={[
              { value: "details", label: "Details" },
              { value: "activity", label: "Activity" },
            ]}
            className="border-b border-border px-1.5"
          >
            <TabPanel value="details" className="flex flex-col px-4">
              <DrawerSection title="Properties" className="py-3">
                <DrawerRow label="Revenue" icon={<DollarIcon />}>
                  <span className="tabular-nums">$48,200</span>
                </DrawerRow>
                <DrawerRow label="GP" icon={<DollarIcon />}>
                  <span className="tabular-nums">$15,100</span>
                </DrawerRow>
                <DrawerRow label="Close date" icon={<CalendarIcon />}>
                  24 Apr 2026
                </DrawerRow>
                <DrawerRow label="Stage" icon={<TagIcon />}>
                  <Badge variant="green">Confirmed</Badge>
                </DrawerRow>
                <DrawerRow label="AE" icon={<UserIcon />}>
                  <Person name="Alex Morgan" />
                </DrawerRow>
                <DrawerRow label="Engineer" icon={<UserIcon />}>
                  <Person name="Quinn Patel" />
                </DrawerRow>
                <DrawerRow label="Labels" icon={<TagIcon />}>
                  <span className="inline-flex flex-wrap gap-1">
                    <Badge variant="neutral">Trail</Badge>
                    <Badge variant="neutral">Wholesale</Badge>
                  </span>
                </DrawerRow>
              </DrawerSection>
              <DrawerSection title="Assignment" className="border-t border-border py-3">
                <DrawerRow label="Owner" icon={<UserIcon />}>
                  <Select
                    id="deal-owner"
                    aria-label="Owner"
                    items={OWNERS}
                    value={owner}
                    onValueChange={setOwner}
                    className="h-7 border-0 bg-transparent px-0"
                  />
                </DrawerRow>
                <DrawerRow label="Watch" icon={<EyeIcon />}>
                  <Switch checked={watching} onCheckedChange={setWatching} aria-label="Watch this deal" />
                </DrawerRow>
              </DrawerSection>
              <DrawerSection title="Notes" className="border-t border-border py-3">
                <Textarea
                  id="deal-notes"
                  aria-label="Internal notes"
                  rows={3}
                  defaultValue="Customer wants trail packs in two drops. Flag Ops if freight lands above 8%."
                />
              </DrawerSection>
            </TabPanel>
            <TabPanel value="activity" className="flex flex-col gap-2.5 px-4 py-3">
              {[
                { name: "Alex Morgan", action: "moved status to Confirmed", time: "2 hours ago" },
                { name: "Quinn Patel", action: "joined as engineer", time: "Yesterday" },
                { name: "Sam Rivera", action: "added a note on freight", time: "3 days ago" },
                { name: "System", action: "quote SO-1042 created", time: "Last week" },
              ].map((event) => (
                <div key={event.time} className="flex gap-2.5">
                  <Avatar name={event.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[13px] leading-5 text-foreground">
                      <span className="font-medium">{event.name}</span>{" "}
                      <span className="text-muted-foreground">{event.action}</span>
                    </p>
                    <p className="text-[12px] leading-4 text-muted-foreground">{event.time}</p>
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
