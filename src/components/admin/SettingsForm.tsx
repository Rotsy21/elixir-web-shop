
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
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Mail, Phone, MapPin, Save } from "lucide-react";

const settingsFormSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  address: z.string().min(1, "L'adresse est requise")
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      companyName: "Elixir Drinks",
      email: "contact@elixir-drinks.com",
      phone: "+33 1 23 45 67 89",
      address: "123 Rue des Boissons, 75001 Paris, France"
    }
  });

  const handleSubmit = (values: SettingsFormValues) => {
    console.log("Form values:", values);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-primary" />
                    Nom de l'entreprise
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    Email de contact
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    Téléphone
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Adresse
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <Button type="submit" className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
