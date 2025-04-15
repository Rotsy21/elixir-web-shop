
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContactMessage } from "@/models/types";
import { Download, Search, Eye, CheckCircle, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ContactsTableProps {
  contacts: ContactMessage[];
  isLoading: boolean;
}

export function ContactsTable({ contacts: initialContacts, isLoading }: ContactsTableProps) {
  const [contacts, setContacts] = useState<ContactMessage[]>(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewContact, setViewContact] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.id.toString().includes(searchTerm)
  );

  const handleViewDetails = (id: number) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      setViewContact(contact);
      setIsViewDialogOpen(true);
    }
  };

  const handleMarkAsRead = (id: number) => {
    toast({
      title: "Marquer comme lu",
      description: `Message #${id} marqué comme lu.`,
    });
    // Ici on pourrait mettre à jour le statut du message
  };

  const handleDelete = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Message supprimé",
      description: "Le message a été supprimé avec succès.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export des messages",
      description: "Les données des messages ont été exportées.",
    });
    // Ici on pourrait implémenter la logique d'export
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Messages de contact</CardTitle>
            <CardDescription>
              Gérez les messages envoyés par les utilisateurs
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un message..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Chargement des données...
                    </TableCell>
                  </TableRow>
                ) : filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Aucun message trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>{contact.id}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(contact.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkAsRead(contact.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marquer comme lu
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(contact.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog to view contact details */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du message</DialogTitle>
            <DialogDescription>
              Message envoyé le {viewContact && new Date(viewContact.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {viewContact && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">De</h4>
                <p className="text-sm">{viewContact.name} ({viewContact.email})</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Sujet</h4>
                <p className="text-sm">{viewContact.subject}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Message</h4>
                <p className="text-sm whitespace-pre-wrap">{viewContact.message}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Fermer
            </Button>
            {viewContact && (
              <Button onClick={() => {
                handleMarkAsRead(viewContact.id);
                setIsViewDialogOpen(false);
              }}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer comme lu
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
