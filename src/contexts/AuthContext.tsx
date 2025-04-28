
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "../models/types";
import { authService } from "../services/authService";
import { toast } from "sonner";
import { logSecurityEvent } from "@/utils/securityUtils";
import { applySecurityHeaders } from "@/utils/securityMiddleware";

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

  const isAdmin = user?.role === "admin";

  // Appliquer les en-têtes de sécurité (simulation)
  useEffect(() => {
    applySecurityHeaders();
  }, []);

  // Vérifier l'expiration de la session
  useEffect(() => {
    if (!user) return;

    // Vérifier si la session est expirée après 2 heures d'inactivité
    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity, 10);
        const twoHours = 2 * 60 * 60 * 1000;
        
        if (inactiveTime > twoHours) {
          logSecurityEvent('Session expirée due à l\'inactivité', 'info', { userId: user.id });
          handleLogout();
          toast("Votre session a expiré pour des raisons de sécurité. Veuillez vous reconnecter.");
        }
      }
    };

    checkSessionTimeout();
    
    // Mettre à jour le timestamp d'activité
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };
    
    // Ajouter des écouteurs d'événements pour suivre l'activité de l'utilisateur
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    
    updateActivity(); // Initialiser le timestamp
    
    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
    };
  }, [user]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result) {
        // Stocker l'utilisateur de manière sécurisée (en production, utilisez des cookies HttpOnly)
        setUser(result);
        localStorage.setItem("user", JSON.stringify(result));
        localStorage.setItem('lastActivity', Date.now().toString());
        
        toast(`Bienvenue, ${result.username}!`);
        
        logSecurityEvent("Connexion réussie", "info", { userId: result.id });
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
      console.error("Erreur de connexion:", error);
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
      const result = await authService.register(username, email, password);
      if (result) {
        setUser(result);
        localStorage.setItem("user", JSON.stringify(result));
        localStorage.setItem('lastActivity', Date.now().toString());
        
        toast({
          title: "Inscription réussie",
          description: `Bienvenue, ${result.username}!`,
        });
        
        logSecurityEvent("Inscription réussie", "info", { userId: result.id });
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
      console.error("Erreur d'inscription:", error);
      
      // Obtenir un message d'erreur plus précis si disponible
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur est survenue lors de l'inscription";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (user) {
      authService.logout(user.id);
    }
    
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
    
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes maintenant déconnecté",
    });
    
    logSecurityEvent("Déconnexion réussie", "info", { userId: user?.id });
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
