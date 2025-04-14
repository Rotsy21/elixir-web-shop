
import { useState } from "react";
import { addContact } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Mail, MapPin, Phone, SendIcon, Loader2 } from "lucide-react";

// Define form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  subject: z.string().min(5, { message: "Le sujet doit comporter au moins 5 caractères" }),
  message: z.string().min(10, { message: "Le message doit comporter au moins 10 caractères" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await addContact(data);
      toast.success("Votre message a été envoyé avec succès !");
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form", error);
      toast.error("Une erreur s'est produite lors de l'envoi du message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Vous avez des questions ou des commentaires ? N'hésitez pas à nous contacter.
            Notre équipe sera ravie de vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-gray-600">123 Rue des Boissons, 75001 Paris, France</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">contact@elixir-drinks.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Heures d'ouverture</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Lundi - Vendredi</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Samedi</span>
                    <span>10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dimanche</span>
                    <span>Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre adresse email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sujet</FormLabel>
                      <FormControl>
                        <Input placeholder="Sujet de votre message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Écrivez votre message ici..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <SendIcon className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Nous trouver</h2>
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            {/* Placeholder for map */}
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">Carte interactive ici</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
