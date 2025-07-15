"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, available: number) => void
}

export function AddItemModal({ isOpen, onClose, onSubmit }: AddItemModalProps) {
  const [name, setName] = useState("")
  const [available, setAvailable] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim(), available)
      setName("")
      setAvailable(0)
    }
  }

  const handleClose = () => {
    setName("")
    setAvailable(0)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">Add New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name" className="text-slate-300 text-sm">
              Item Name
            </Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available" className="text-slate-300 text-sm">
              Available Quantity
            </Label>
            <Input
              id="available"
              type="number"
              value={available}
              onChange={(e) => setAvailable(Number.parseInt(e.target.value) || 0)}
              placeholder="Enter available quantity"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              min="0"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-slate-300 hover:text-white hover:bg-slate-700 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
