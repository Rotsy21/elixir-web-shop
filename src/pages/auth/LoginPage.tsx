
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
const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Mot de passe trop court" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-gray-600 mt-2">
            Connectez-vous pour accéder à votre compte
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-primary hover:text-primary/80">
                  Mot de passe oublié?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Pas encore de compte?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 text-center mb-2">
            Identifiants de démonstration:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <p><strong>Admin:</strong> admin@example.com</p>
              <p><strong>Mot de passe:</strong> admin123</p>
            </div>
            <div>
              <p><strong>Utilisateur:</strong> user1@example.com</p>
              <p><strong>Mot de passe:</strong> user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
