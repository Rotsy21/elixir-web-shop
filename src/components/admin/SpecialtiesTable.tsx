
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeveloperSpecialty } from "@/models/types";
import { Download, Edit, PlusCircle, Search, Trash2, Save, Star } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { developerSpecialtyService } from "@/services/developerSpecialtyService";
import { toast } from "@/hooks/use-toast";

interface SpecialtiesTableProps {
  specialties: DeveloperSpecialty[];
  isLoading: boolean;
}

interface SpecialtyFormData {
  id?: string;
  name: string;
  description: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

export function SpecialtiesTable({ specialties: initialSpecialties, isLoading }: SpecialtiesTableProps) {
  const [specialties, setSpecialties] = useState<DeveloperSpecialty[]>(initialSpecialties);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState<SpecialtyFormData>({
    name: '',
    description: '',
    icon: 'code',
    level: 'intermediate'
  });

  const filteredSpecialties = specialties.filter(
    (specialty) =>
      specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSpecialty(prev => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (value: 'beginner' | 'intermediate' | 'expert') => {
    setCurrentSpecialty(prev => ({ ...prev, level: value }));
  };

  const handleIconChange = (value: string) => {
    setCurrentSpecialty(prev => ({ ...prev, icon: value }));
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await developerSpecialtyService.deleteSpecialty(id);
      if (result) {
        setSpecialties(specialties.filter(specialty => specialty.id !== id));
        toast({
          title: "Spécialité supprimée",
          description: "La spécialité a été supprimée avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la spécialité.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    const specialtyToEdit = specialties.find(specialty => specialty.id === id);
    if (specialtyToEdit) {
      setCurrentSpecialty({
        id: specialtyToEdit.id,
        name: specialtyToEdit.name,
        description: specialtyToEdit.description,
        icon: specialtyToEdit.icon,
        level: specialtyToEdit.level
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentSpecialty({
      name: '',
      description: '',
      icon: 'code',
      level: 'intermediate'
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (currentSpecialty.id) {
        const updatedSpecialty = await developerSpecialtyService.updateSpecialty(
          currentSpecialty.id, 
          currentSpecialty
        );
        
        setSpecialties(prev => prev.map(specialty => 
          specialty.id === currentSpecialty.id 
            ? { ...updatedSpecialty } 
            : specialty
        ));
        
        setIsEditDialogOpen(false);
        toast({
          title: "Spécialité modifiée",
          description: "La spécialité a été modifiée avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la spécialité.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAdd = async () => {
    try {
      const newSpecialty = await developerSpecialtyService.addSpecialty(currentSpecialty);
      
      setSpecialties(prev => [...prev, newSpecialty]);
      setIsAddDialogOpen(false);
      toast({
        title: "Spécialité ajoutée",
        description: "La nouvelle spécialité a été ajoutée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la spécialité.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export des spécialités",
      description: "Les données des spécialités ont été exportées.",
    });
  };

  // Les icônes disponibles
  const availableIcons = [
    { value: 'code', label: 'Code' },
    { value: 'server', label: 'Serveur' },
    { value: 'shield', label: 'Sécurité' },
    { value: 'database', label: 'Base de données' },
    { value: 'layout', label: 'Interface' },
    { value: 'settings', label: 'Configuration' },
    { value: 'star', label: 'Étoile' }
  ];

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'expert': return 'Expert';
      default: return level;
    }
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSpecialtyForm = () => (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Nom</label>
        <Input 
          id="name"
          name="name"
          value={currentSpecialty.name}
          onChange={handleInputChange}
          placeholder="Nom de la spécialité"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea 
          id="description"
          name="description"
          value={currentSpecialty.description}
          onChange={handleInputChange}
          placeholder="Description de la spécialité"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="icon" className="text-sm font-medium">Icône</label>
          <Select value={currentSpecialty.icon} onValueChange={handleIconChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une icône" />
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map(icon => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="level" className="text-sm font-medium">Niveau</label>
          <Select value={currentSpecialty.level} onValueChange={handleLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des spécialités</CardTitle>
            <CardDescription>
              Gérez vos compétences et spécialités en développement
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une spécialité
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une spécialité..." 
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Niveau</TableHead>
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
                ) : filteredSpecialties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Aucune spécialité trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSpecialties.map((specialty) => (
                    <TableRow key={specialty.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          {specialty.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {specialty.description}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeClass(specialty.level)}`}>
                          {getLevelLabel(specialty.level)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(specialty.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(specialty.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour modifier une spécialité */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier une spécialité</DialogTitle>
            <DialogDescription>
              Modifiez les détails de votre spécialité
            </DialogDescription>
          </DialogHeader>
          
          {renderSpecialtyForm()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter une spécialité */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une spécialité</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle spécialité à votre profil
            </DialogDescription>
          </DialogHeader>
          
          {renderSpecialtyForm()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveAdd} disabled={!currentSpecialty.name}>
              <Save className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
