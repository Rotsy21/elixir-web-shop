
// Importation des services
import { productService } from "@/services/productService";
import { userService } from "@/services/userService";
import { contactService } from "@/services/contactService";
import { newsletterService } from "@/services/newsletterService";
import { useMongoDBConnection } from '@/hooks/useMongoDBConnection';
import { MONGODB_CONFIG } from '@/config/mongoConfig';

// Pour la rétrocompatibilité avec le reste de l'application
const mongodbHelpers = {
  ...productService,
  ...userService,
  ...contactService,
  ...newsletterService
};

// Exportation des services pour utilisation dans l'application
export {
  productService,
  userService,
  contactService,
  newsletterService,
  mongodbHelpers,
  useMongoDBConnection,
  MONGODB_CONFIG
};
