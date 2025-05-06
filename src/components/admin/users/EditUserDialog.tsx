
import { useState, useEffect } from "react";
import { User } from "@/models/types";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm";
import { Save } from "lucide-react";
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

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: Partial<User> | null;
  onUserUpdated: (user: User) => void;
}

export function EditUserDialog({ isOpen, onOpenChange, user, onUserUpdated }: EditUserDialogProps) {
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    username: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    if (user) {
      setCurrentUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  const handleSaveEdit = async () => {
    try {
      if (currentUser.id) {
        await mongodbHelpers.updateUser(currentUser.id, {
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role
        });
        
        onUserUpdated(currentUser as User);
        onOpenChange(false);
        toast({
          title: "Utilisateur modifié",
          description: "L'utilisateur a été modifié avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier un utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur
          </DialogDescription>
        </DialogHeader>
        
        <UserForm 
          user={currentUser} 
          onChange={setCurrentUser} 
          isAddMode={false}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveEdit}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
