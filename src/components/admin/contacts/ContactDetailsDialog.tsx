
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactMessage } from "@/models/types";

interface ContactDetailsDialogProps {
  contact: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export function ContactDetailsDialog({ 
  contact, 
  isOpen, 
  onClose,
  onMarkAsRead 
}: ContactDetailsDialogProps) {
  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du message</DialogTitle>
          <DialogDescription>
            Message envoyé le {new Date(contact.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">De</h4>
            <p className="text-sm">{contact.name} ({contact.email})</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Sujet</h4>
            <p className="text-sm">{contact.subject}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Message</h4>
            <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Fermer
          </Button>
          <Button onClick={() => {
            onMarkAsRead(contact.id);
            onClose();
          }}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marquer comme lu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
