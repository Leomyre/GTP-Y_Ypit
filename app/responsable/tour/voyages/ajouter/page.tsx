"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { VoyageService } from "@/services/service-voyages";
import { DestinationService } from "@/services/service-destinations";
import { useAuth } from "@/hooks/useAuth";
import { Destination } from "@/types/Destinations";

export default function AjouterVoyage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    ville_depart: "",
    destination: "",
    prix: "",
    niveau_confort: "1",
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await DestinationService.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Erreur lors du chargement des destinations:", err);
      }
    };
    fetchDestinations();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Créer une preview de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination || formData.destination === "") {
      setError("Vous devez sélectionner une destination.");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('titre', formData.titre);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('ville_depart', formData.ville_depart);
    formDataToSend.append('destination', formData.destination);
    formDataToSend.append('prix', formData.prix);
    formDataToSend.append('niveau_confort', formData.niveau_confort);

    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      await VoyageService.createVoyage(formDataToSend, token);
      router.push("/responsable/tour/voyages");
    } catch (err) {
      console.error("Erreur lors de la création du voyage:", err);
      if (err.response && err.response.status === 400) {
        setError("Une erreur s'est produite avec la destination. Assurez-vous qu'elle existe.");
      } else {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <h1 className="text-3xl font-bold">Ajouter un Nouveau Voyage</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Détails du Voyage</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <label className="block mb-2">Titre</label>
              <Input
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                placeholder="Titre du voyage"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
              />
            </div>

            <div>
              <label className="block mb-2">Image du voyage</label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Choisir une image
                  </label>
                </div>
                {imagePreview && (
                  <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2">Ville de départ</label>
              <Input
                name="ville_depart"
                value={formData.ville_depart}
                onChange={handleInputChange}
                placeholder="Ville de départ"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Destination</label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionnez une destination</option>
                {destinations.length === 0 ? (
                  <option disabled>Aucune destination disponible</option>
                ) : (
                  destinations.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.nom}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block mb-2">Prix (€)</label>
              <Input
                type="number"
                step="0.01"
                name="prix"
                value={formData.prix}
                onChange={handleInputChange}
                placeholder="Prix"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Niveau de confort</label>
              <select
                name="niveau_confort"
                value={formData.niveau_confort}
                onChange={handleInputChange}
                required
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="1">1 étoile</option>
                <option value="2">2 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="5">5 étoiles</option>
              </select>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer le Voyage"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}