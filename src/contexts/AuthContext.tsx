
import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/models/types";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  currentUser: User | null;
  user: User | null; // Ajout de l'alias user pour compatibilité
  isAuthenticated: boolean;
  isAdmin: boolean; // Ajout de la propriété isAdmin
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      if (user) {
        // On doit convertir le résultat pour inclure un mot de passe (vide) pour satisfaire TypeScript
        setCurrentUser({
          ...user,
          password: "" // Ajout d'un mot de passe vide pour satisfaire TypeScript
        });
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${user.username}!`,
        });
        setIsLoading(false);
        return true;
      }
      toast({
        title: "Échec de la connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Fonction d'inscription
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.register(username, email, password);
      if (user) {
        // On doit convertir le résultat pour inclure un mot de passe (vide) pour satisfaire TypeScript
        setCurrentUser({
          ...user,
          password: "" // Ajout d'un mot de passe vide pour satisfaire TypeScript
        });
        toast({
          title: "Inscription réussie",
          description: `Bienvenue, ${user.username}!`,
        });
        setIsLoading(false);
        return true;
      }
      toast({
        title: "Échec de l'inscription",
        description: "Impossible de créer un compte avec ces informations",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    if (currentUser) {
      authService.logout(currentUser.id);
    } else {
      authService.logout("unknown");
    }
    setCurrentUser(null);
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/login");
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser, // Alias pour compatibilité
        isAuthenticated: !!currentUser,
        isAdmin, // Ajout de la propriété isAdmin
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
