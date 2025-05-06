
import { useState } from "react";
import { User } from "@/models/types";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm";
import { UserPlus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mongodbHelpers } from "@/data/mongodb";
import { toast } from "@/hooks/use-toast";

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

  const handleSaveAdd = async () => {
    try {
      // Création du nouvel utilisateur
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9), // Génération d'ID temporaire
        username: currentUser.username || '',
        email: currentUser.email || '',
        role: currentUser.role || 'user',
        password: currentUser.password || '',
        createdAt: new Date().toISOString()
      };
      
      const result = await mongodbHelpers.addUser(newUser);
      if (result.success) {
        // Mettre à jour avec l'ID généré par MongoDB
        newUser.id = result.id;
        onUserAdded(newUser);
        onOpenChange(false);
        toast({
          title: "Utilisateur ajouté",
          description: "Le nouvel utilisateur a été ajouté avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'utilisateur.",
        variant: "destructive",
      });
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveAdd} 
            disabled={!currentUser.username || !currentUser.email || (currentUser.password && currentUser.password.length < 6)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
