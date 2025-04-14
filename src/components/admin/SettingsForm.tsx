
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
        <CardDescription>
          Gérez les paramètres de votre application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom de l'entreprise</label>
            <Input defaultValue="Elixir Drinks" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email de contact</label>
            <Input defaultValue="contact@elixir-drinks.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone</label>
            <Input defaultValue="+33 1 23 45 67 89" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Adresse</label>
            <Input defaultValue="123 Rue des Boissons, 75001 Paris, France" />
          </div>
          <div className="pt-4">
            <Button type="button">Sauvegarder les modifications</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
