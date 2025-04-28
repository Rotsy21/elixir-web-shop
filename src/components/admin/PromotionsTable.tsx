
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
import { Promotion } from "@/models/types";
import { Download, Edit, PlusCircle, Search, Trash2, Save, Calendar, Tag, Percent } from "lucide-react";
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
import { promotionService } from "@/services/promotionService";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface PromotionsTableProps {
  promotions: Promotion[];
  isLoading: boolean;
}

interface PromotionFormData {
  id?: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  applicableProducts: string[];
  minimumPurchase?: number;
  couponCode?: string;
  isActive: boolean;
  bannerImage?: string;
}

export function PromotionsTable({ promotions: initialPromotions, isLoading }: PromotionsTableProps) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<PromotionFormData>({
    title: '',
    description: '',
    discountPercentage: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applicableProducts: [],
    isActive: true
  });

  const filteredPromotions = promotions.filter(
    (promotion) =>
      promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number | boolean = value;
    
    // Parse number fields
    if (name === 'discountPercentage' || name === 'minimumPurchase') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setCurrentPromotion(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCurrentPromotion(prev => ({ ...prev, isActive: checked }));
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await promotionService.deletePromotion(id);
      if (result) {
        setPromotions(promotions.filter(promotion => promotion.id !== id));
        toast({
          title: "Promotion supprimée",
          description: "La promotion a été supprimée avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la promotion.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    const promotionToEdit = promotions.find(promotion => promotion.id === id);
    if (promotionToEdit) {
      setCurrentPromotion({
        id: promotionToEdit.id,
        title: promotionToEdit.title,
        description: promotionToEdit.description,
        discountPercentage: promotionToEdit.discountPercentage,
        startDate: new Date(promotionToEdit.startDate).toISOString().split('T')[0],
        endDate: new Date(promotionToEdit.endDate).toISOString().split('T')[0],
        applicableProducts: promotionToEdit.applicableProducts,
        minimumPurchase: promotionToEdit.minimumPurchase,
        couponCode: promotionToEdit.couponCode,
        isActive: promotionToEdit.isActive,
        bannerImage: promotionToEdit.bannerImage
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentPromotion({
      title: '',
      description: '',
      discountPercentage: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicableProducts: [],
      isActive: true
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (currentPromotion.id) {
        const updatedPromotion = await promotionService.updatePromotion(currentPromotion.id, {
          ...currentPromotion,
          startDate: new Date(currentPromotion.startDate),
          endDate: new Date(currentPromotion.endDate)
        });
        
        setPromotions(prev => prev.map(promotion => 
          promotion.id === currentPromotion.id 
            ? { ...updatedPromotion } 
            : promotion
        ));
        
        setIsEditDialogOpen(false);
        toast({
          title: "Promotion modifiée",
          description: "La promotion a été modifiée avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la promotion.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAdd = async () => {
    try {
      const newPromotion = await promotionService.addPromotion({
        ...currentPromotion,
        startDate: new Date(currentPromotion.startDate),
        endDate: new Date(currentPromotion.endDate)
      });
      
      setPromotions(prev => [...prev, newPromotion]);
      setIsAddDialogOpen(false);
      toast({
        title: "Promotion ajoutée",
        description: "La nouvelle promotion a été ajoutée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la promotion.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export des promotions",
      description: "Les données des promotions ont été exportées.",
    });
  };

  const renderPromotionForm = () => (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Titre</label>
        <Input 
          id="title"
          name="title"
          value={currentPromotion.title}
          onChange={handleInputChange}
          placeholder="Titre de la promotion"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea 
          id="description"
          name="description"
          value={currentPromotion.description}
          onChange={handleInputChange}
          placeholder="Description de la promotion"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="discountPercentage" className="text-sm font-medium">Pourcentage de réduction</label>
          <div className="relative">
            <Input 
              id="discountPercentage"
              name="discountPercentage"
              type="number"
              min="0"
              max="100"
              step="1"
              value={currentPromotion.discountPercentage}
              onChange={handleInputChange}
              className="pr-8"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Percent className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="minimumPurchase" className="text-sm font-medium">Achat minimum (€)</label>
          <Input 
            id="minimumPurchase"
            name="minimumPurchase"
            type="number"
            min="0"
            step="0.01"
            value={currentPromotion.minimumPurchase || ''}
            onChange={handleInputChange}
            placeholder="Optionnel"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium">Date de début</label>
          <Input 
            id="startDate"
            name="startDate"
            type="date"
            value={currentPromotion.startDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium">Date de fin</label>
          <Input 
            id="endDate"
            name="endDate"
            type="date"
            value={currentPromotion.endDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="couponCode" className="text-sm font-medium">Code promo (optionnel)</label>
        <Input 
          id="couponCode"
          name="couponCode"
          value={currentPromotion.couponCode || ''}
          onChange={handleInputChange}
          placeholder="ex: SUMMER2025"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="isActive" 
          checked={currentPromotion.isActive} 
          onCheckedChange={handleCheckboxChange} 
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          Promotion active
        </label>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des promotions</CardTitle>
            <CardDescription>
              Créez et gérez vos campagnes promotionnelles
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une promotion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une promotion..." 
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
                  <TableHead>Titre</TableHead>
                  <TableHead>Réduction</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Statut</TableHead>
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
                ) : filteredPromotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Aucune promotion trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.title}</TableCell>
                      <TableCell>
                        <span className="font-bold text-red-600">-{promotion.discountPercentage}%</span>
                        {promotion.minimumPurchase && (
                          <span className="block text-xs text-gray-500">
                            Min: {promotion.minimumPurchase}€
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          <span className="text-xs">
                            {format(new Date(promotion.startDate), 'dd/MM/yy', { locale: fr })} - {format(new Date(promotion.endDate), 'dd/MM/yy', { locale: fr })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {promotion.couponCode ? (
                          <span className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">
                            {promotion.couponCode}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          promotion.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {promotion.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(promotion.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(promotion.id)}
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

      {/* Dialog pour modifier une promotion */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier une promotion</DialogTitle>
            <DialogDescription>
              Modifiez les détails de votre promotion
            </DialogDescription>
          </DialogHeader>
          
          {renderPromotionForm()}
          
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

      {/* Dialog pour ajouter une promotion */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une promotion</DialogTitle>
            <DialogDescription>
              Créez une nouvelle campagne promotionnelle
            </DialogDescription>
          </DialogHeader>
          
          {renderPromotionForm()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveAdd} disabled={!currentPromotion.title || currentPromotion.discountPercentage <= 0}>
              <Save className="h-4 w-4 mr-2" />
              Créer la promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
