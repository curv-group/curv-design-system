"use client";

import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { Dialog, DialogClose } from "./dialog";

/**
 * ConfirmDialog — the sanctioned gate for destructive / irreversible actions
 * (design-system.md accessibility rule: a delete never fires from a bare
 * one-click button). Cancel is focused by default (the safe choice); the
 * confirm button shows a spinner while an async `onConfirm` runs and the dialog
 * closes on success.
 *
 * <ConfirmDialog
 *   trigger={<Button variant="destructive">Delete deal</Button>}
 *   title="Delete deal SO-1042?"
 *   description="This can't be undone."
 *   confirmLabel="Delete"
 *   onConfirm={() => api.deleteDeal(id)}
 * />
 */
export interface ConfirmDialogProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  trigger?: React.ReactElement;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Confirm-button variant — destructive by default. */
  variant?: ButtonProps["variant"];
  /** Runs on confirm; if it returns a promise the button shows a spinner. */
  onConfirm: () => void | Promise<void>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  title,
  description,
  trigger,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  onConfirm,
  open,
  defaultOpen,
  onOpenChange,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  const setOpen = (o: boolean) => {
    onOpenChange?.(o);
    if (open === undefined) setInternalOpen(o);
  };

  const [loading, setLoading] = React.useState(false);
  const confirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Render the trigger ourselves (opens on click) instead of a base-ui
  // Dialog.Trigger — a Trigger + controlled `open` fights the controlled value
  // on close. Focus still restores to it natively (base-ui tracks the
  // previously-focused element).
  const triggerEl = trigger
    ? React.cloneElement(
        trigger as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void; "aria-haspopup"?: string; "aria-expanded"?: boolean }>,
        {
          onClick: (e: React.MouseEvent) => {
            (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
            setOpen(true);
          },
          "aria-haspopup": "dialog",
          "aria-expanded": isOpen,
        },
      )
    : null;

  return (
    <>
      {triggerEl}
      <Dialog
        open={isOpen}
        onOpenChange={setOpen}
        title={title}
        description={description}
        footer={
          <>
            {/* Cancel first → base-ui focuses it (the safe default). */}
            <DialogClose>{cancelLabel}</DialogClose>
            <Button variant={variant} loading={loading} onClick={confirm}>
              {confirmLabel}
            </Button>
          </>
        }
      />
    </>
  );
}
