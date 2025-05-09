
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Download, TerminalSquare } from "lucide-react";
import { PostmanApiDocs } from "@/utils/postmanApiDocs";
import { toast } from "sonner";

export function PostmanApiDocsComponent() {
  const [activeTab, setActiveTab] = useState("users");

  const handleExportConfig = (apiName: 'users' | 'contacts' | 'newsletters' | 'orders') => {
    try {
      PostmanApiDocs.exportPostmanConfig(apiName);
    } catch (error) {
      console.error("Erreur lors de l'exportation de la configuration Postman:", error);
      toast.error("Une erreur s'est produite lors de l'exportation");
    }
  };

  const renderEndpoints = (endpoints: any[]) => {
    return endpoints.map((endpoint, index) => (
      <div key={index} className="mb-6 border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 text-xs font-bold rounded ${
            endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
            endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-sm">{endpoint.url}</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
        
        {/* Headers */}
        <div className="mb-3">
          <h4 className="text-xs uppercase font-semibold text-gray-500 mb-1">Headers</h4>
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(endpoint.headers, null, 2)}
          </pre>
        </div>
        
        {/* Request Body (if any) */}
        {endpoint.requestBody && (
          <div className="mb-3">
            <h4 className="text-xs uppercase font-semibold text-gray-500 mb-1">Request Body</h4>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(endpoint.requestBody, null, 2)}
            </pre>
          </div>
        )}
        
        {/* Response Format */}
        <div>
          <h4 className="text-xs uppercase font-semibold text-gray-500 mb-1">Response ({endpoint.responseFormat.status})</h4>
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(endpoint.responseFormat.body, null, 2)}
          </pre>
        </div>
      </div>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TerminalSquare className="h-5 w-5" />
          Documentation API pour Postman
        </CardTitle>
        <CardDescription>
          Consultez et exportez la documentation des API pour tester avec Postman
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="newsletters">Newsletter</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="flex justify-end mb-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleExportConfig('users')}
              >
                <Download className="h-4 w-4" />
                Exporter pour Postman
              </Button>
            </div>
            <div className="space-y-4">
              {renderEndpoints(PostmanApiDocs.getUsersApiDocs().endpoints)}
            </div>
          </TabsContent>
          
          <TabsContent value="contacts">
            <div className="flex justify-end mb-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleExportConfig('contacts')}
              >
                <Download className="h-4 w-4" />
                Exporter pour Postman
              </Button>
            </div>
            <div className="space-y-4">
              {renderEndpoints(PostmanApiDocs.getContactsApiDocs().endpoints)}
            </div>
          </TabsContent>
          
          <TabsContent value="newsletters">
            <div className="flex justify-end mb-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleExportConfig('newsletters')}
              >
                <Download className="h-4 w-4" />
                Exporter pour Postman
              </Button>
            </div>
            <div className="space-y-4">
              {renderEndpoints(PostmanApiDocs.getNewslettersApiDocs().endpoints)}
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="flex justify-end mb-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleExportConfig('orders')}
              >
                <Download className="h-4 w-4" />
                Exporter pour Postman
              </Button>
            </div>
            <div className="space-y-4">
              {renderEndpoints(PostmanApiDocs.getOrdersApiDocs().endpoints)}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Code className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-700 mb-1">Comment utiliser cette documentation</h3>
              <ol className="text-sm text-blue-700 space-y-2 list-decimal pl-4">
                <li>Exportez la configuration pour l'API souhaitée</li>
                <li>Importez le fichier JSON dans Postman</li>
                <li>Remplacez les variables {'{token}'} par votre token d'authentification</li>
                <li>Utilisez les requêtes pour tester l'API</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
