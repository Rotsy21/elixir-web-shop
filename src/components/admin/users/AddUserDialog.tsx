
import { useState } from "react";
import { User } from "@/models/types";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mongodbHelpers } from "@/data/mongodb";
import { toast } from "sonner";

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
}

export function AddUserDialog({ isOpen, onOpenChange, onUserAdded }: AddUserDialogProps) {
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAdd = async () => {
    try {
      // Validation des champs obligatoires
      if (!currentUser.username || !currentUser.email || !currentUser.password) {
        toast.error("Tous les champs sont obligatoires");
        return;
      }
      
      // Validation du mot de passe
      if (currentUser.password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      
      setIsSubmitting(true);
      console.log("Tentative d'ajout d'utilisateur:", currentUser);
      
      // Création du nouvel utilisateur
      const newUser: Omit<User, 'id' | 'createdAt'> = {
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role || 'user',
        password: currentUser.password
      };
      
      const result = await mongodbHelpers.addUser(newUser);
      console.log("Résultat de l'ajout d'utilisateur:", result);
      
      if (result.success) {
        // Créer un objet utilisateur complet pour l'UI
        const completeUser: User = {
          id: result.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          password: '',
          createdAt: new Date().toISOString()
        };
        
        onUserAdded(completeUser);
        onOpenChange(false);
        toast.success("L'utilisateur a été ajouté avec succès");
      } else {
        toast.error("Impossible d'ajouter l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      toast.error("Une erreur est survenue lors de l'ajout de l'utilisateur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>
            Créez un nouvel utilisateur dans votre système
          </DialogDescription>
        </DialogHeader>
        
        <UserForm 
          user={currentUser} 
          onChange={setCurrentUser} 
          isAddMode={true}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveAdd} 
            disabled={isSubmitting || !currentUser.username || !currentUser.email || !currentUser.password || currentUser.password.length < 6}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isSubmitting ? "Création en cours..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
