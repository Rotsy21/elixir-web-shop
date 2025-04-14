
import { Product, User, ContactMessage, Newsletter } from "../models/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Eau Minérale Pétillante",
    description: "Une eau minérale pétillante rafraîchissante avec des bulles fines et élégantes.",
    price: 2.5,
    image: "/placeholder.svg",
    category: "Eau",
    stock: 100,
    featured: true,
    createdAt: new Date("2023-01-15")
  },
  {
    id: "2",
    name: "Soda Citron",
    description: "Un soda pétillant au goût rafraîchissant de citron, parfait pour les journées chaudes.",
    price: 3.2,
    image: "/placeholder.svg",
    category: "Soda",
    stock: 75,
    featured: true,
    createdAt: new Date("2023-02-10")
  },
  {
    id: "3",
    name: "Thé Glacé Pêche",
    description: "Thé glacé infusé avec de vraies pêches, légèrement sucré et très désaltérant.",
    price: 3.8,
    image: "/placeholder.svg",
    category: "Thé",
    stock: 50,
    featured: false,
    createdAt: new Date("2023-03-05")
  },
  {
    id: "4",
    name: "Jus d'Orange Pressée",
    description: "Jus d'orange fraîchement pressée, riche en vitamine C et savoureux.",
    price: 4.5,
    image: "/placeholder.svg",
    category: "Jus",
    stock: 40,
    featured: true,
    createdAt: new Date("2023-03-15")
  },
  {
    id: "5",
    name: "Limonade Artisanale",
    description: "Limonade faite maison avec du vrai jus de citron et un soupçon de sucre de canne.",
    price: 4.0,
    image: "/placeholder.svg",
    category: "Limonade",
    stock: 60,
    featured: true,
    createdAt: new Date("2023-04-01")
  },
  {
    id: "6",
    name: "Eau de Coco",
    description: "Eau de coco naturelle, hydratante et riche en électrolytes.",
    price: 5.2,
    image: "/placeholder.svg",
    category: "Eau",
    stock: 30,
    featured: false,
    createdAt: new Date("2023-04-10")
  }
];

export const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    password: "admin123", // In a real app, store hashed passwords only
    role: "admin",
    createdAt: new Date("2023-01-01")
  },
  {
    id: "2",
    username: "user1",
    email: "user1@example.com",
    password: "user123",
    role: "user",
    createdAt: new Date("2023-02-15")
  }
];

export const contacts: ContactMessage[] = [
  {
    id: "1",
    name: "Jean Martin",
    email: "jean@example.com",
    subject: "Question sur la livraison",
    message: "Bonjour, j'aimerais savoir si vous livrez dans ma région. Mon code postal est 75001.",
    createdAt: new Date("2023-05-10")
  },
  {
    id: "2",
    name: "Marie Dupont",
    email: "marie@example.com",
    subject: "Demande de partenariat",
    message: "Bonjour, je représente une entreprise locale et nous aimerions discuter d'un possible partenariat.",
    createdAt: new Date("2023-05-15")
  }
];

export const newsletters: Newsletter[] = [
  {
    id: "1",
    email: "subscriber1@example.com",
    createdAt: new Date("2023-04-05")
  },
  {
    id: "2",
    email: "subscriber2@example.com",
    createdAt: new Date("2023-04-10")
  }
];

// Simulated API functions
let localProducts = [...products];
let localUsers = [...users];
let localContacts = [...contacts];
let localNewsletters = [...newsletters];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Products API
export const getProducts = async () => {
  await delay(500);
  return [...localProducts];
};

export const getProductById = async (id: string) => {
  await delay(300);
  return localProducts.find(p => p.id === id);
};

export const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
  await delay(500);
  const newProduct = {
    ...product,
    id: String(localProducts.length + 1),
    createdAt: new Date()
  };
  localProducts.push(newProduct as Product);
  return newProduct;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  await delay(500);
  const index = localProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    localProducts[index] = { ...localProducts[index], ...product };
    return localProducts[index];
  }
  return null;
};

export const deleteProduct = async (id: string) => {
  await delay(500);
  const index = localProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    const deleted = localProducts[index];
    localProducts.splice(index, 1);
    return deleted;
  }
  return null;
};

// Users API
export const getUsers = async () => {
  await delay(500);
  return [...localUsers];
};

export const getUserByEmail = async (email: string) => {
  await delay(300);
  return localUsers.find(u => u.email === email);
};

export const addUser = async (user: Omit<User, "id" | "createdAt" | "role">) => {
  await delay(500);
  const newUser = {
    ...user,
    id: String(localUsers.length + 1),
    role: "user" as const,
    createdAt: new Date()
  };
  localUsers.push(newUser);
  return newUser;
};

// Contacts API
export const getContacts = async () => {
  await delay(500);
  return [...localContacts];
};

export const addContact = async (contact: Omit<ContactMessage, "id" | "createdAt">) => {
  await delay(500);
  const newContact = {
    ...contact,
    id: String(localContacts.length + 1),
    createdAt: new Date()
  };
  localContacts.push(newContact);
  return newContact;
};

// Newsletter API
export const getNewsletters = async () => {
  await delay(500);
  return [...localNewsletters];
};

export const addNewsletter = async (email: string) => {
  await delay(500);
  const existing = localNewsletters.find(n => n.email === email);
  if (existing) return existing;
  
  const newNewsletter = {
    id: String(localNewsletters.length + 1),
    email,
    createdAt: new Date()
  };
  localNewsletters.push(newNewsletter);
  return newNewsletter;
};

// Auth functions
export const login = async (email: string, password: string) => {
  await delay(700);
  const user = localUsers.find(u => u.email === email && u.password === password);
  if (user) {
    return { ...user, password: undefined }; // Don't return password
  }
  return null;
};

export const register = async (username: string, email: string, password: string) => {
  await delay(700);
  // Check if email already exists
  const exists = localUsers.some(u => u.email === email);
  if (exists) return null;
  
  const newUser = await addUser({ username, email, password });
  return { ...newUser, password: undefined }; // Don't return password
};
