
// Importation des services
import { ProductService } from "@/services/productService";
import { UserService } from "@/services/userService";
import { ContactService } from "@/services/contactService";
import { NewsletterService } from "@/services/newsletterService";

// Initialisation des services
const productService = new ProductService();
const userService = new UserService();
const contactService = new ContactService();
const newsletterService = new NewsletterService();

// Exportation des services pour utilisation dans l'application
export {
  productService,
  userService,
  contactService,
  newsletterService
};

// Autres exports existants si présents
