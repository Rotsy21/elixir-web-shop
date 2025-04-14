
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
import { Newsletter } from "@/models/types";
import { Download, Mail, Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface NewslettersTableProps {
  newsletters: Newsletter[];
  isLoading: boolean;
}

export function NewslettersTable({ newsletters: initialNewsletters, isLoading }: NewslettersTableProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialNewsletters);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNewsletters = newsletters.filter(
    (newsletter) =>
      newsletter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.id.toString().includes(searchTerm)
  );

  const handleUnsubscribe = (id: number) => {
    setNewsletters(newsletters.filter(newsletter => newsletter.id !== id));
    toast({
      title: "Abonné désabonné",
      description: "L'abonné a été désabonné avec succès.",
    });
  };

  const handleSendNewsletter = () => {
    toast({
      title: "Envoi de newsletter",
      description: "Préparation de l'envoi de la newsletter.",
    });
    // Ici on pourrait ouvrir un modal d'envoi de newsletter
  };

  const handleExport = () => {
    toast({
      title: "Export des abonnés",
      description: "Les données des abonnés ont été exportées.",
    });
    // Ici on pourrait implémenter la logique d'export
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Abonnés Newsletter</CardTitle>
          <CardDescription>
            Gérez vos abonnés à la newsletter
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" onClick={handleSendNewsletter}>
            <Mail className="mr-2 h-4 w-4" />
            Envoyer Newsletter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un email..." 
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
                <TableHead>Email</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Chargement des données...
                  </TableCell>
                </TableRow>
              ) : filteredNewsletters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Aucun abonné trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredNewsletters.map((newsletter) => (
                  <TableRow key={newsletter.id}>
                    <TableCell>{newsletter.id}</TableCell>
                    <TableCell>{newsletter.email}</TableCell>
                    <TableCell>{new Date(newsletter.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleUnsubscribe(newsletter.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Désabonner
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
