
import { useState, useEffect } from "react";
import { useMongoDBConnection } from "@/data/mongodb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, DatabaseIcon, X, RefreshCcw } from "lucide-react";

export function MongoDBConnector() {
  const { connect, getStatus, isConnected } = useMongoDBConnection();
  const [connectionString, setConnectionString] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAtlas, setIsAtlas] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const status = getStatus();
  
  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const customString = connectionString.trim() || undefined;
      const result = await connect(isAtlas, customString);
      
      if (result) {
        toast({
          title: "Connexion réussie",
          description: "Connecté à MongoDB avec succès",
        });
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Erreur de connexion",
          description: status.error || "Impossible de se connecter à MongoDB",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Tentative de connexion automatique à MongoDB local au chargement
    connect(false);
  }, []);

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>MongoDB Status</CardTitle>
            <CardDescription>
              État de la connexion à la base de données
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <DatabaseIcon className="mr-2 h-4 w-4" />
            Configurer la connexion
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2">Status:</span>
              {status.isConnected ? (
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" /> Connecté
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <X className="h-4 w-4 mr-1" /> Non connecté
                </span>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              {status.connectionString ? (
                <code className="bg-gray-100 px-2 py-1 rounded">{status.connectionString}</code>
              ) : (
                "Pas de chaîne de connexion configurée"
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => connect(isAtlas, connectionString)}
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Rafraîchir
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Configurer MongoDB</AlertDialogTitle>
            <AlertDialogDescription>
              Configurez votre connexion à MongoDB pour stocker les données en temps réel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de connexion</label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={isAtlas ? "outline" : "default"}
                  onClick={() => setIsAtlas(false)}
                >
                  MongoDB Local (Compass)
                </Button>
                <Button
                  type="button"
                  variant={isAtlas ? "default" : "outline"}
                  onClick={() => setIsAtlas(true)}
                >
                  MongoDB Atlas
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="connectionString" className="text-sm font-medium">
                Chaîne de connexion (optionnelle)
              </label>
              <Input
                id="connectionString"
                placeholder={isAtlas ? "mongodb+srv://..." : "mongodb://localhost:27017/elixir_drinks"}
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {isAtlas 
                  ? "Format: mongodb+srv://<username>:<password>@cluster.mongodb.net/db_name" 
                  : "Format: mongodb://localhost:27017/db_name"}
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConnect} disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
