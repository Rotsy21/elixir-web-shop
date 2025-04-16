
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date | string;
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
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date | string;
}

export interface Newsletter {
  id: string;
  email: string;
  createdAt: Date | string;
}
