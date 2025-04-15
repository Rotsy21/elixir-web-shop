
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface NewslettersTableProps {
  newsletters: Newsletter[];
  isLoading: boolean;
}

export function NewslettersTable({ newsletters: initialNewsletters, isLoading }: NewslettersTableProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialNewsletters);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewsletterDialogOpen, setIsNewsletterDialogOpen] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");

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
    setIsNewsletterDialogOpen(true);
  };

  const handleSendNewsletterConfirm = () => {
    setIsNewsletterDialogOpen(false);
    toast({
      title: "Newsletter envoyée",
      description: `La newsletter "${newsletterSubject}" a été envoyée à ${newsletters.length} abonnés.`,
    });
    setNewsletterSubject("");
    setNewsletterContent("");
  };

  const handleExport = () => {
    toast({
      title: "Export des abonnés",
      description: "Les données des abonnés ont été exportées.",
    });
    // Ici on pourrait implémenter la logique d'export
  };

  return (
    <>
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

      {/* Send Newsletter Dialog */}
      <Dialog open={isNewsletterDialogOpen} onOpenChange={setIsNewsletterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Envoyer une newsletter</DialogTitle>
            <DialogDescription>
              Créez et envoyez une newsletter à vos {newsletters.length} abonnés.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
              <Input 
                id="subject"
                value={newsletterSubject}
                onChange={(e) => setNewsletterSubject(e.target.value)}
                placeholder="Saisissez le sujet de la newsletter"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Contenu</label>
              <textarea
                id="content"
                className="w-full min-h-[200px] p-2 border rounded-md"
                value={newsletterContent}
                onChange={(e) => setNewsletterContent(e.target.value)}
                placeholder="Saisissez le contenu de la newsletter"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewsletterDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSendNewsletterConfirm}
              disabled={!newsletterSubject.trim() || !newsletterContent.trim()}
            >
              <Mail className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
