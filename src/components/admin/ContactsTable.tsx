
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContactMessage } from "@/models/types";
import { Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { mongodbHelpers } from "@/data/mongodb";
import { ContactSearch } from "./contacts/ContactSearch";
import { ContactDetailsDialog } from "./contacts/ContactDetailsDialog";
import { ContactActionsMenu } from "./contacts/ContactActionsMenu";

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

  const handleViewDetails = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      setViewContact(contact);
      setIsViewDialogOpen(true);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await mongodbHelpers.updateContact(id, { read: true });
      toast.success(`Message #${id} marqué comme lu.`);
    } catch (error) {
      toast.error("Impossible de marquer le message comme lu.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mongodbHelpers.deleteContact(id);
      setContacts(contacts.filter(contact => contact.id !== id));
      toast.success("Message supprimé avec succès.");
    } catch (error) {
      toast.error("Impossible de supprimer le message.");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Messages de contact</CardTitle>
          <CardDescription>
            Gérez les messages envoyés par les utilisateurs
          </CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={() => {
          toast.success("Les données des messages ont été exportées.");
        }}>
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <ContactSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
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
                      <ContactActionsMenu
                        contactId={contact.id}
                        onViewDetails={() => handleViewDetails(contact.id)}
                        onMarkAsRead={() => handleMarkAsRead(contact.id)}
                        onDelete={() => handleDelete(contact.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ContactDetailsDialog
        contact={viewContact}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        onMarkAsRead={handleMarkAsRead}
      />
    </Card>
  );
}
