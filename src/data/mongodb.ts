
export { MONGODB_CONFIG } from '@/config/mongoConfig';
export { useMongoDBConnection } from '@/hooks/useMongoDBConnection';
export { productService } from '@/services/productService';
export { userService } from '@/services/userService';
export { contactService } from '@/services/contactService';
export { newsletterService } from '@/services/newsletterService';

// Pour la rétrocompatibilité, on exporte aussi mongodbHelpers
export const mongodbHelpers = {
  ...productService,
  ...userService,
  ...contactService,
  ...newsletterService
};
