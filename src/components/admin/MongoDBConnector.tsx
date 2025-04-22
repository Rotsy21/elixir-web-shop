
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
  CardFooter,
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
import { 
  Check, 
  X, 
  RefreshCw, 
  Database, 
  Settings, 
  Info,
  Save
} from "lucide-react";

export function MongoDBConnector() {
  const { connect, getStatus, isConnected } = useMongoDBConnection();
  const [connectionString, setConnectionString] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAtlas, setIsAtlas] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testMode, setTestMode] = useState(false);
  
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

  const handleTestConnection = async () => {
    setTestMode(true);
    setIsLoading(true);
    
    try {
      const customString = connectionString.trim() || undefined;
      const result = await connect(isAtlas, customString);
      
      if (result) {
        toast({
          title: "Test réussi",
          description: "La connexion à MongoDB fonctionne correctement",
        });
      } else {
        toast({
          title: "Échec du test",
          description: status.error || "La connexion à MongoDB a échoué",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de test",
        description: "Impossible de tester la connexion à MongoDB",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTestMode(false);
    }
  };

  useEffect(() => {
    // Tentative de connexion automatique à MongoDB local au chargement
    connect(false);
  }, []);

  return (
    <>
      <Card className="mb-6 border-2 border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <CardTitle className="flex items-center text-primary">
              <Database className="mr-2 h-5 w-5" />
              MongoDB Status
            </CardTitle>
            <CardDescription>
              État de la connexion à la base de données
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/80 text-white shadow-md transition-all"
            onClick={() => setIsDialogOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurer la connexion
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
            <div className="flex items-center p-3 rounded-md bg-gray-50">
              <span className="mr-2 font-medium">Status:</span>
              {status.isConnected ? (
                <span className="flex items-center text-green-600 font-medium">
                  <Check className="h-5 w-5 mr-1" /> 
                  Connecté
                </span>
              ) : (
                <span className="flex items-center text-red-600 font-medium">
                  <X className="h-5 w-5 mr-1" /> 
                  Non connecté
                </span>
              )}
            </div>
            
            <div className="flex-grow p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium block mb-1 text-gray-500">Chaîne de connexion:</span>
              {status.connectionString ? (
                <code className="bg-gray-100 px-3 py-1 rounded text-xs block overflow-x-auto whitespace-nowrap max-w-full">
                  {status.connectionString}
                </code>
              ) : (
                <span className="text-gray-500 italic text-sm">
                  Pas de chaîne de connexion configurée
                </span>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 whitespace-nowrap"
              onClick={() => connect(isAtlas, connectionString)}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Rafraîchir
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1 text-primary" />
            {status.isConnected 
              ? "Les données sont maintenant stockées en temps réel" 
              : "Configurez la connexion pour activer le stockage des données"
            }
          </div>
          <span className="text-xs">{isAtlas ? "MongoDB Atlas" : "MongoDB Compass"}</span>
        </CardFooter>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-primary">
              <Database className="mr-2 h-5 w-5" />
              Configurer MongoDB
            </AlertDialogTitle>
            <AlertDialogDescription>
              Configurez votre connexion à MongoDB pour stocker les données en temps réel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Type de connexion</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={isAtlas ? "outline" : "default"}
                  className={!isAtlas ? "bg-primary text-white border-2 border-primary" : ""}
                  onClick={() => setIsAtlas(false)}
                >
                  <Database className="mr-2 h-4 w-4" />
                  MongoDB Local
                </Button>
                <Button
                  type="button"
                  variant={isAtlas ? "default" : "outline"}
                  className={isAtlas ? "bg-primary text-white border-2 border-primary" : ""}
                  onClick={() => setIsAtlas(true)}
                >
                  <svg 
                    className="mr-2 h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 256 256"
                  >
                    <path fill="currentColor" d="M197.43 164.56C193.96 169.5 184.75 171.97 184.75 171.97L92.32 203.69s-2.37.83-5.33.92c0 0-1.1.09-5.33-2.75c-8.48-5.89-80.17-40.92-80.17-40.92S-4.57 156.37 1.6 150.34c4.89-5.81 70.48-56.67 85.54-68.58c15.06-11.91 23.17-5.54 23.17-5.54l82.4 42.48s7.4 3.31 15.16 9.61c4.72 3.83 6.33 9.15 6.33 9.15s5.91 21.72-16.77 27.1"></path>
                  </svg>
                  MongoDB Atlas
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="connectionString" className="text-sm font-medium">
                  Chaîne de connexion
                </label>
                {isAtlas && (
                  <a 
                    href="https://www.mongodb.com/cloud/atlas/register" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Créer un compte Atlas
                  </a>
                )}
              </div>
              <Input
                id="connectionString"
                placeholder={isAtlas ? "mongodb+srv://..." : "mongodb://localhost:27017/elixir_drinks"}
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                className="font-mono text-sm"
              />
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  {isAtlas 
                    ? "Format: mongodb+srv://<username>:<password>@cluster.mongodb.net/db_name" 
                    : "Format: mongodb://localhost:27017/db_name"}
                </p>
                <p className="mt-1">
                  {isAtlas
                    ? "Assurez-vous d'avoir créé un utilisateur dans votre cluster Atlas."
                    : "Assurez-vous que MongoDB Compass est installé et en cours d'exécution."}
                </p>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel>
            <Button 
              variant="outline" 
              onClick={handleTestConnection} 
              disabled={isLoading}
              className="mr-auto"
            >
              {testMode && isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <div className="h-4 w-4 mr-2 flex items-center justify-center">
                  {testMode ? <Check className="h-4 w-4" /> : "✓"}
                </div>
              )}
              Tester
            </Button>
            <AlertDialogAction onClick={handleConnect} disabled={isLoading}>
              {isLoading && !testMode ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading && !testMode ? "Connexion..." : "Se connecter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
