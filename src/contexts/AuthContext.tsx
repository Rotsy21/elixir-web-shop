
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/models/types";
import { authService } from "@/services/auth";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export interface AuthContextType {
  currentUser: User | null;
  user: User | null; // Ajout de l'alias user pour compatibilité
  isAuthenticated: boolean;
  isAdmin: boolean;
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
  const location = useLocation();

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log("Utilisateur chargé du localStorage:", parsedUser);
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error);
    }
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Tentative de connexion pour:", email);
      const user = await authService.login(email, password);
      
      if (user) {
        console.log("Connexion réussie, utilisateur:", user);
        // On doit convertir le résultat pour inclure un mot de passe (vide) pour satisfaire TypeScript
        const userWithEmptyPassword = {
          ...user,
          password: "" // Ajout d'un mot de passe vide pour satisfaire TypeScript
        };
        
        setCurrentUser(userWithEmptyPassword);
        
        // Sauvegarder l'utilisateur dans le localStorage
        localStorage.setItem('currentUser', JSON.stringify(userWithEmptyPassword));
        
        toast.success(`Bienvenue, ${user.username}!`);
        
        setIsLoading(false);
        
        // Rediriger vers la page précédente ou la page d'accueil
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
        
        return true;
      }
      console.log("Échec de connexion");
      toast.error("Email ou mot de passe incorrect");
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Une erreur s'est produite lors de la connexion");
      setIsLoading(false);
      return false;
    }
  };

  // Fonction d'inscription
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Tentative d'inscription pour:", email);
      const user = await authService.register(username, email, password);
      
      if (user) {
        console.log("Inscription réussie, utilisateur:", user);
        // On doit convertir le résultat pour inclure un mot de passe (vide) pour satisfaire TypeScript
        const userWithEmptyPassword = {
          ...user,
          password: "" // Ajout d'un mot de passe vide pour satisfaire TypeScript
        };
        
        setCurrentUser(userWithEmptyPassword);
        
        // Sauvegarder l'utilisateur dans le localStorage
        localStorage.setItem('currentUser', JSON.stringify(userWithEmptyPassword));
        
        toast.success(`Bienvenue, ${user.username}!`);
        
        setIsLoading(false);
        navigate("/");
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
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
    
    // Supprimer l'utilisateur du localStorage
    localStorage.removeItem('currentUser');
    
    setCurrentUser(null);
    toast.success("Vous avez été déconnecté avec succès");
    navigate("/login");
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = currentUser?.role === "admin";
  
  console.log("État actuel de l'authentification:", {
    isAuthenticated: !!currentUser,
    isAdmin,
    currentUser
  });

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser, // Alias pour compatibilité
        isAuthenticated: !!currentUser,
        isAdmin,
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
