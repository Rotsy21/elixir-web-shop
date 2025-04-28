
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date | string;
  // Champs additionnels pour la gestion des promotions et des préférences
  specialties?: string[];
  isActive?: boolean;
  lastLogin?: Date | string;
  phoneNumber?: string;
  profilePicture?: string;
  // Propriété pour les réponses d'API
  success?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
  createdAt: Date | string;
  // Champs additionnels pour les promotions
  discountPercentage?: number;
  discountPrice?: number;
  isOnSale?: boolean;
  promotionEndDate?: Date | string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  // Propriété pour les réponses d'API
  success?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt: Date | string;
}

export interface Newsletter {
  id: string;
  email: string;
  createdAt: Date | string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: Date | string;
  // Champs additionnels pour la gestion des commandes
  updatedAt?: Date | string;
  trackingNumber?: string;
  estimatedDelivery?: Date | string;
  notes?: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Interface pour les promotions
export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: Date | string;
  endDate: Date | string;
  applicableProducts: string[]; // IDs des produits concernés
  minimumPurchase?: number;
  couponCode?: string;
  isActive: boolean;
  bannerImage?: string;
}

// Interface pour les spécialités du développeur
export interface DeveloperSpecialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

// Interface pour les statistiques d'utilisation
export interface SiteStatistics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  averageOrderValue: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date | string;
}
