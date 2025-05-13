"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function ProfilePhotoUpload({
  initialPhotoUrl,
  onPhotoChange,
}: {
  initialPhotoUrl: string
  onPhotoChange: (file: File | null) => void
}) {
  const [previewUrl, setPreviewUrl] = useState(initialPhotoUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset preview si l'URL initiale change
  useEffect(() => {
    setPreviewUrl(initialPhotoUrl)
  }, [initialPhotoUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]

      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La taille maximale est de 5MB")
        return
      }

      // Vérification du type
      if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner une image valide")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string)
          onPhotoChange(file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPreviewUrl('/placeholder-user.png')
    onPhotoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
        <Image
          src={previewUrl}
          alt="Profile"
          fill
          className="object-cover"
          quality={90}
          priority
          sizes="(max-width: 128px) 100vw"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm"
        >
          Changer
        </Button>

        {previewUrl !== '/placeholder-user.png' && (
          <Button
            variant="outline"
            type="button"
            onClick={handleRemovePhoto}
            className="text-sm text-red-600"
          >
            Supprimer
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
    </div>
  )
}