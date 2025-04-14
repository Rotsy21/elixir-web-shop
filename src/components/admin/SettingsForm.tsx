
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function SettingsForm() {
  const [formData, setFormData] = useState({
    companyName: "Elixir Drinks",
    email: "contact@elixir-drinks.com",
    phone: "+33 1 23 45 67 89",
    address: "123 Rue des Boissons, 75001 Paris, France"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Paramètres sauvegardés",
      description: "Les modifications ont été enregistrées avec succès.",
    });
    // Ici on pourrait implémenter la logique de sauvegarde
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
        <CardDescription>
          Gérez les paramètres de votre application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom de l'entreprise</label>
            <Input 
              name="companyName"
              value={formData.companyName} 
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email de contact</label>
            <Input 
              name="email"
              value={formData.email} 
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone</label>
            <Input 
              name="phone"
              value={formData.phone} 
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Adresse</label>
            <Input 
              name="address"
              value={formData.address} 
              onChange={handleChange}
            />
          </div>
          <div className="pt-4">
            <Button type="submit">Sauvegarder les modifications</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
