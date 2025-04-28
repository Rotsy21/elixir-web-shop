import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/models/types";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { logSecurityEvent } from "@/utils/securityUtils";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Simulated authentication logic
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulated API call
      console.log("Login attempt:", { email, password: "********" });
      
      // Basic input validation
      if (!email || !password) {
        toast({
          title: "Erreur de connexion",
          description: "Veuillez remplir tous les champs.",
          variant: "destructive",
        });
        return false;
      }

      // Simulated successful login for admin
      if (email === "admin@example.com" && password === "admin123") {
        const adminUser: User = {
          id: "1",
          username: "Admin",
          email: "admin@example.com",
          password: "", // Don't store passwords client-side
          role: "admin",
          createdAt: new Date().toISOString(),
          specialties: ["Frontend", "UX/UI", "Data Analysis"],
          isActive: true,
          lastLogin: new Date().toISOString()
        };
        
        setUser(adminUser);
        
        // Log successful admin login
        logSecurityEvent("Admin login successful", "info", { userId: adminUser.id, email });
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue, Admin!",
        });
        
        return true;
      }
      
      // Simulated successful login for regular user
      else if (email === "user@example.com" && password === "user123") {
        const regularUser: User = {
          id: "2",
          username: "User",
          email: "user@example.com",
          password: "", // Don't store passwords client-side
          role: "user",
          createdAt: new Date().toISOString(),
          isActive: true,
          lastLogin: new Date().toISOString()
        };
        
        setUser(regularUser);
        
        // Log successful user login
        logSecurityEvent("User login successful", "info", { userId: regularUser.id, email });
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue!",
        });
        
        return true;
      }
      
      // Failed login
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
      
      // Log failed login attempt
      logSecurityEvent("Failed login attempt", "warning", { email });
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      
      // Log error
      logSecurityEvent("Login error", "error", { email, error });
      
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Simulated registration logic
  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      // Basic input validation
      if (!email || !username || !password) {
        toast({
          title: "Erreur d'inscription",
          description: "Veuillez remplir tous les champs.",
          variant: "destructive",
        });
        return false;
      }

      // Simulate checking if email already exists
      if (email === "admin@example.com" || email === "user@example.com") {
        toast({
          title: "Erreur d'inscription",
          description: "Cet email est déjà utilisé.",
          variant: "destructive",
        });
        return false;
      }

      // Simulate successful registration
      const newUser: User = {
        id: crypto.randomUUID(),
        username,
        email,
        password: "", // Don't store passwords client-side
        role: "user",
        createdAt: new Date().toISOString(),
        isActive: true,
        lastLogin: new Date().toISOString()
      };
      
      setUser(newUser);
      
      // Log successful registration
      logSecurityEvent("User registration successful", "info", { userId: newUser.id, email });
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      
      // Log error
      logSecurityEvent("Registration error", "error", { email, error });
      
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Logout function
  const logout = () => {
    if (user) {
      // Log logout event
      logSecurityEvent("User logout", "info", { userId: user.id, email: user.email });
    }
    
    setUser(null);
    navigate("/");
    
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour mettre à jour votre profil.",
          variant: "destructive",
        });
        return false;
      }

      // Simulated API call to update user data
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Log profile update
      logSecurityEvent("Profile updated", "info", { userId: user.id });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      
      // Log error
      logSecurityEvent("Profile update error", "error", { userId: user?.id, error });
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
