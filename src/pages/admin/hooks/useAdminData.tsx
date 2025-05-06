
import { useState, useEffect } from "react";
import { Product, User, ContactMessage, Newsletter, Order, Promotion, DeveloperSpecialty, SiteStatistics } from "@/models/types";
import { productService } from "@/services/productService";
import { userService } from "@/services/userService";
import { contactService } from "@/services/contactService";
import { newsletterService } from "@/services/newsletterService";
import { orderService } from "@/services/orderService";
import { promotionService } from "@/services/promotionService";
import { developerSpecialtyService } from "@/services/developerSpecialtyService";
import { statisticsService } from "@/services/statisticsService";
import { applySecurityHeaders } from "@/utils/securityMiddleware";

export function useAdminData(searchTerm: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [specialties, setSpecialties] = useState<DeveloperSpecialty[]>([]);
  const [statistics, setStatistics] = useState<SiteStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Appliquer les en-têtes de sécurité
    applySecurityHeaders();
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          productsData, 
          usersData, 
          contactsData, 
          newslettersData, 
          ordersData,
          promotionsData,
          specialtiesData,
          statisticsData
        ] = await Promise.all([
          productService.getAllProducts(),
          userService.getAllUsers(),
          contactService.getAllContacts ? contactService.getAllContacts() : [],
          newsletterService.getAllNewsletters(),
          orderService.getAllOrders(),
          promotionService.getAllPromotions ? promotionService.getAllPromotions() : [],
          developerSpecialtyService.getAllSpecialties ? developerSpecialtyService.getAllSpecialties() : [],
          statisticsService.getAllStatistics ? statisticsService.getAllStatistics() : [],
        ]);
        
        setProducts(productsData);
        setUsers(usersData);
        setContacts(contactsData);
        setNewsletters(newslettersData);
        setOrders(ordersData);
        setPromotions(promotionsData);
        setSpecialties(specialtiesData);
        setStatistics(statisticsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données admin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les produits en fonction du terme de recherche
  const filteredProducts = searchTerm 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;
  
  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = searchTerm
    ? users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  // Filtrer les messages de contact en fonction du terme de recherche
  const filteredContacts = searchTerm
    ? contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : contacts;

  // Filtrer les newsletters en fonction du terme de recherche
  const filteredNewsletters = searchTerm
    ? newsletters.filter(n => 
        n.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : newsletters;

  // Filtrer les commandes en fonction du terme de recherche
  const filteredOrders = searchTerm
    ? orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orders;

  // Filtrer les promotions en fonction du terme de recherche
  const filteredPromotions = searchTerm
    ? promotions.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.couponCode && p.couponCode.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : promotions;
    
  // Filtrer les spécialités en fonction du terme de recherche
  const filteredSpecialties = searchTerm
    ? specialties.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : specialties;

  return {
    products,
    users,
    contacts,
    newsletters,
    orders,
    promotions,
    specialties,
    statistics,
    isLoading,
    filteredProducts,
    filteredUsers,
    filteredContacts,
    filteredNewsletters,
    filteredOrders,
    filteredPromotions,
    filteredSpecialties
  };
}
