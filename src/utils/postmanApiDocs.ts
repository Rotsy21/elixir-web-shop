
import { toast } from "sonner";

/**
 * Documentation sur les API disponibles et comment les tester avec Postman
 */
export const PostmanApiDocs = {
  /**
   * Renvoie la configuration Postman pour l'API de gestion des utilisateurs
   */
  getUsersApiDocs: () => {
    return {
      info: {
        name: "API Utilisateurs",
        description: "API pour la gestion des utilisateurs",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      endpoints: [
        {
          name: "Lister tous les utilisateurs",
          method: "GET",
          url: "/api/users",
          description: "Récupérer la liste de tous les utilisateurs",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 200,
            body: [{
              id: "string",
              username: "string",
              email: "string",
              role: "string",
              createdAt: "string"
            }]
          }
        },
        {
          name: "Créer un utilisateur",
          method: "POST",
          url: "/api/users",
          description: "Créer un nouvel utilisateur",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          requestBody: {
            username: "string",
            email: "string",
            password: "string",
            role: "string"
          },
          responseFormat: {
            status: 201,
            body: {
              id: "string",
              username: "string",
              email: "string",
              role: "string",
              createdAt: "string"
            }
          }
        },
        {
          name: "Mettre à jour un utilisateur",
          method: "PUT",
          url: "/api/users/{id}",
          description: "Mettre à jour un utilisateur existant",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          requestBody: {
            username: "string (facultatif)",
            email: "string (facultatif)",
            role: "string (facultatif)"
          },
          responseFormat: {
            status: 200,
            body: {
              id: "string",
              username: "string",
              email: "string",
              role: "string",
              createdAt: "string",
              updatedAt: "string"
            }
          }
        },
        {
          name: "Supprimer un utilisateur",
          method: "DELETE",
          url: "/api/users/{id}",
          description: "Supprimer un utilisateur",
          headers: {
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 204,
            body: null
          }
        }
      ]
    };
  },
  
  /**
   * Renvoie la configuration Postman pour l'API de gestion des contacts
   */
  getContactsApiDocs: () => {
    return {
      info: {
        name: "API Contacts",
        description: "API pour la gestion des messages de contact",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      endpoints: [
        {
          name: "Lister tous les contacts",
          method: "GET",
          url: "/api/contacts",
          description: "Récupérer la liste de tous les messages de contact",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 200,
            body: [{
              id: "string",
              name: "string",
              email: "string",
              subject: "string",
              message: "string",
              read: "boolean",
              createdAt: "string"
            }]
          }
        },
        {
          name: "Créer un message de contact",
          method: "POST",
          url: "/api/contacts",
          description: "Envoyer un nouveau message de contact",
          headers: {
            "Content-Type": "application/json"
          },
          requestBody: {
            name: "string",
            email: "string",
            subject: "string",
            message: "string"
          },
          responseFormat: {
            status: 201,
            body: {
              id: "string",
              name: "string",
              email: "string",
              subject: "string",
              message: "string",
              read: false,
              createdAt: "string"
            }
          }
        },
        {
          name: "Marquer comme lu",
          method: "PUT",
          url: "/api/contacts/{id}/read",
          description: "Marquer un message comme lu",
          headers: {
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 200,
            body: {
              id: "string",
              read: true
            }
          }
        },
        {
          name: "Supprimer un contact",
          method: "DELETE",
          url: "/api/contacts/{id}",
          description: "Supprimer un message de contact",
          headers: {
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 204,
            body: null
          }
        }
      ]
    };
  },
  
  /**
   * Renvoie la configuration Postman pour l'API de gestion des newsletters
   */
  getNewslettersApiDocs: () => {
    return {
      info: {
        name: "API Newsletters",
        description: "API pour la gestion des inscriptions à la newsletter",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      endpoints: [
        {
          name: "Lister tous les abonnés",
          method: "GET",
          url: "/api/newsletters",
          description: "Récupérer la liste de tous les abonnés à la newsletter",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 200,
            body: [{
              id: "string",
              email: "string",
              createdAt: "string"
            }]
          }
        },
        {
          name: "S'abonner à la newsletter",
          method: "POST",
          url: "/api/newsletters",
          description: "S'inscrire à la newsletter",
          headers: {
            "Content-Type": "application/json"
          },
          requestBody: {
            email: "string"
          },
          responseFormat: {
            status: 201,
            body: {
              id: "string",
              email: "string",
              createdAt: "string"
            }
          }
        },
        {
          name: "Se désabonner de la newsletter",
          method: "DELETE",
          url: "/api/newsletters/{id}",
          description: "Se désabonner de la newsletter",
          headers: {
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 204,
            body: null
          }
        }
      ]
    };
  },
  
  /**
   * Renvoie la configuration Postman pour l'API de gestion des commandes
   */
  getOrdersApiDocs: () => {
    return {
      info: {
        name: "API Commandes",
        description: "API pour la gestion des commandes",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      endpoints: [
        {
          name: "Lister toutes les commandes",
          method: "GET",
          url: "/api/orders",
          description: "Récupérer la liste de toutes les commandes",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 200,
            body: [{
              id: "string",
              userId: "string",
              items: [{
                productId: "string",
                productName: "string",
                quantity: "number",
                unitPrice: "number"
              }],
              totalAmount: "number",
              status: "string",
              paymentMethod: "string",
              createdAt: "string"
            }]
          }
        },
        {
          name: "Obtenir les commandes d'un utilisateur",
          method: "GET",
          url: "/api/orders/user/{userId}",
          description: "Récupérer les commandes d'un utilisateur spécifique",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          responseFormat: {
            status: 200,
            body: [{
              id: "string",
              userId: "string",
              items: [{}],
              totalAmount: "number",
              status: "string",
              paymentMethod: "string",
              createdAt: "string"
            }]
          }
        },
        {
          name: "Créer une commande",
          method: "POST",
          url: "/api/orders",
          description: "Créer une nouvelle commande",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          requestBody: {
            userId: "string",
            items: [{
              productId: "string",
              productName: "string",
              quantity: "number",
              unitPrice: "number"
            }],
            totalAmount: "number",
            status: "string",
            shippingAddress: {
              fullName: "string",
              addressLine1: "string",
              addressLine2: "string (facultatif)",
              city: "string",
              state: "string",
              postalCode: "string",
              country: "string"
            },
            paymentMethod: "string"
          },
          responseFormat: {
            status: 201,
            body: {
              id: "string",
              userId: "string",
              items: [{}],
              totalAmount: "number",
              status: "string",
              paymentMethod: "string",
              createdAt: "string"
            }
          }
        },
        {
          name: "Mettre à jour le statut d'une commande",
          method: "PUT",
          url: "/api/orders/{id}/status",
          description: "Mettre à jour le statut d'une commande existante",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          },
          requestBody: {
            status: "string (pending, processing, shipped, delivered, cancelled)"
          },
          responseFormat: {
            status: 200,
            body: {
              id: "string",
              status: "string",
              updatedAt: "string"
            }
          }
        }
      ]
    };
  },

  /**
   * Exporte les configurations Postman sous forme de fichier JSON
   */
  exportPostmanConfig: (apiName: 'users' | 'contacts' | 'newsletters' | 'orders') => {
    let config;
    switch (apiName) {
      case 'users':
        config = PostmanApiDocs.getUsersApiDocs();
        break;
      case 'contacts':
        config = PostmanApiDocs.getContactsApiDocs();
        break;
      case 'newsletters':
        config = PostmanApiDocs.getNewslettersApiDocs();
        break;
      case 'orders':
        config = PostmanApiDocs.getOrdersApiDocs();
        break;
      default:
        throw new Error("API non reconnue");
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postman_${apiName}_api.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Configuration Postman pour l'API ${apiName} exportée`);
  }
};
