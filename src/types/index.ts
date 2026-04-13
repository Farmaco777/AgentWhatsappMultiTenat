export type OrderStatus = 'nuevo' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
export type CustomerTag = 'VIP' | 'Frecuente' | 'Inactivo' | 'Nuevo';
export type IntentType = 'pedido' | 'soporte' | 'pregunta';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface Order {
  id: string;
  customerName: string;
  items: string;
  total: number;
  status: OrderStatus;
  timestamp: string;
  address?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  image?: string;
  totalSpent: number;
  lastVisit: string;
  frequency: string;
  tags: CustomerTag[];
  address?: string;
  preferences?: {
    favoriteProduct?: string;
    notes?: string;
  };
}

export interface Message {
  id: string;
  sender: 'ai' | 'customer' | 'human';
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  timestamp: string;
  intent: IntentType;
  status: 'active' | 'resolved';
  messages: Message[];
}

export interface Campaign {
  id: string;
  name: string;
  segment: string;
  status: 'active' | 'recurrent' | 'automated';
  sent: number;
  redeemed: number;
  image: string;
  endsIn?: string;
}
