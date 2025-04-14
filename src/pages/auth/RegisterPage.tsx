
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Define form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Le nom d'utilisateur doit comporter au moins 3 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      const success = await register(data.username, data.email, data.password);
      if (success) {
        navigate("/");
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de l'inscription.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-gray-600 mt-2">
            Inscrivez-vous pour commencer à acheter nos produits
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom d'utilisateur" {...field} />
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
                    <Input placeholder="votre@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                J'accepte les{" "}
                <a href="#" className="text-primary hover:text-primary/80">
                  conditions d'utilisation
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "Créer un compte"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Déjà un compte?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
