"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmStatusChangeModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  newStatus: string
}

export function ConfirmStatusChangeModal({
  open,
  onClose,
  onConfirm,
  newStatus,
}: ConfirmStatusChangeModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
          <Dialog.Title className="text-lg font-semibold">Confirm Status Change</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to change the order status to <strong>{newStatus}</strong>?
          </Dialog.Description>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
