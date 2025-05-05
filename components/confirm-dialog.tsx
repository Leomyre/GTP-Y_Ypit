// components/confirm-dialog.tsx
"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface ConfirmDialogProps {
    title: string
    description: string
    onConfirm: () => void
    children: React.ReactNode
    cancelText?: string
    confirmText?: string
    variant?: "default" | "destructive"
    isLoading?: boolean
}

export function ConfirmDialog({
    title,
    description,
    onConfirm,
    children,
    cancelText = "Annuler",
    confirmText = "Confirmer",
    variant = "default",
    isLoading = false,
}: ConfirmDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleConfirm = () => {
        onConfirm()
        setIsOpen(false)
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant === "destructive" ? "destructive" : "default"}
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            {confirmText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}