
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactActionsMenuProps {
  contactId: string;
  onViewDetails: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

export function ContactActionsMenu({ 
  contactId, 
  onViewDetails, 
  onMarkAsRead, 
  onDelete 
}: ContactActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <span className="sr-only">Actions</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="h-4 w-4 mr-2" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMarkAsRead}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Marquer comme lu
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4 mr-2" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
