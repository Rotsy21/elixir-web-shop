
import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../models/types";
import { login, register } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isAdmin = user?.role === "admin";

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result) {
        setUser(result);
        localStorage.setItem("user", JSON.stringify(result));
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${result.username}!`,
        });
        return true;
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await register(username, email, password);
      if (result) {
        setUser(result);
        localStorage.setItem("user", JSON.stringify(result));
        toast({
          title: "Inscription réussie",
          description: `Bienvenue, ${result.username}!`,
        });
        return true;
      } else {
        toast({
          title: "Erreur d'inscription",
          description: "Cet email est déjà utilisé",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes maintenant déconnecté",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
