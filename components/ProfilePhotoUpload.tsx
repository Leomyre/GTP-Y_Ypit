"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

interface ProfilePhotoUploadProps {
  initialPhotoUrl: string
  onPhotoChange: (file: File) => void
}

export function ProfilePhotoUpload({ initialPhotoUrl, onPhotoChange }: ProfilePhotoUploadProps) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onPhotoChange(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32">
        <AvatarImage src={photoUrl} alt="Photo de profil" />
        <AvatarFallback>{initialPhotoUrl ? "Photo" : "Aucune photo"}</AvatarFallback>
      </Avatar>
      <Button onClick={triggerFileInput} variant="outline" className="flex items-center">
        <Camera className="mr-2 h-4 w-4" />
        Changer la photo
      </Button>
      <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
    </div>
  )
}

