import { Order, Customer, Chat, Campaign, Product } from '@/src/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Americano Clásico',
    description: 'Café de origen, 12oz.',
    price: 5500,
    category: 'Café',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200&h=200&auto=format&fit=crop',
    stock: 'in-stock'
  },
  {
    id: 'p2',
    name: 'Croissant de Mantequilla',
    description: 'Hojaldrado artesanal.',
    price: 4200,
    category: 'Panadería',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=200&h=200&auto=format&fit=crop',
    stock: 'in-stock'
  },
  {
    id: 'p3',
    name: 'Acaí Bowl Energético',
    description: 'Frutos rojos y granola.',
    price: 18900,
    category: 'Bowls',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=200&h=200&auto=format&fit=crop',
    stock: 'low-stock'
  },
  {
    id: 'p4',
    name: 'Hamburguesa La Boheme',
    description: 'Carne angus, queso azul, cebolla caramelizada.',
    price: 32000,
    category: 'Restaurante',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&h=200&auto=format&fit=crop',
    stock: 'in-stock'
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-9021', customerName: 'Carlos Mendoza', items: 'Hamburguesa x2, Papas, Soda', total: 45000, status: 'nuevo', timestamp: 'Hace 4 mins', address: 'Calle 127 #45-22, Apto 502, Bogotá', notes: 'Timbrar en recepción.' },
  { id: 'ORD-9020', customerName: 'Mariana Velez', items: 'Pizza Familiar, Alitas x12', total: 68500, status: 'preparando', timestamp: 'Hace 12 mins' },
  { id: 'ORD-9019', customerName: 'Juan Sanabria', items: 'Tacos Mix x3, Horchata', total: 32000, status: 'preparando', timestamp: 'Hace 18 mins' },
  { id: 'ORD-9018', customerName: 'Roberto Gomez', items: 'Sushi Combo x24', total: 92000, status: 'enviado', timestamp: 'Hace 25 mins' },
  { id: 'ORD-9017', customerName: 'Elena Rojas', items: 'Ensalada Cesar, Jugo Natural', total: 28000, status: 'entregado', timestamp: 'Hace 1 hora' },
  { id: 'ORD-9016', customerName: 'Miguel Paez', items: 'Burrito Pollo x2', total: 36000, status: 'nuevo', timestamp: 'Hace 30 mins' },
  { id: 'ORD-9015', customerName: 'Luisa Fernanda', items: 'Pasta Carbonara, Vino', total: 54000, status: 'preparando', timestamp: 'Hace 45 mins' },
  { id: 'ORD-9014', customerName: 'David Castro', items: 'Club Sandwich, Papas', total: 25500, status: 'nuevo', timestamp: 'Hace 50 mins' },
  { id: 'ORD-9013', customerName: 'Andrés Bello', items: 'Ribeye Steak, Pure', total: 78000, status: 'preparando', timestamp: 'Hace 1 hora' },
  { id: 'ORD-9012', customerName: 'Sofia Torres', items: 'Brownie c/ Helado', total: 12000, status: 'nuevo', timestamp: 'Hace 1 hora' },
  { id: 'ORD-9011', customerName: 'Felipe Ruiz', items: 'Combo Almuerzo Ejecutivo', total: 18000, status: 'entregado', timestamp: 'Hace 2 horas' },
  { id: 'ORD-9010', customerName: 'Camila Lopez', items: 'Capuchino x2, Croissant x2', total: 19400, status: 'entregado', timestamp: 'Hace 3 horas' },
  { id: 'ORD-9009', customerName: 'Jorge Ivan', items: 'Bowl de Frutas, Jugo Naranja', total: 22000, status: 'entregado', timestamp: 'Hace 4 horas' },
  { id: 'ORD-9008', customerName: 'Natalia Arias', items: 'Hamburguesa Veggie, Agua', total: 28000, status: 'entregado', timestamp: 'Hace 5 horas' },
  { id: 'ORD-9007', customerName: 'Ricardo Alarcón', items: 'Tinto Campesino, Almojábana', total: 8500, status: 'entregado', timestamp: 'Hace 6 horas' }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Ricardo Villalobos',
    phone: '+57 312 456 7890',
    email: 'ricardo@email.com',
    totalSpent: 1250000,
    lastVisit: 'Ayer',
    frequency: 'Semanal',
    tags: ['VIP'],
    address: 'Calle 100 #15-32, Apto 402, Bucaramanga',
    preferences: { favoriteProduct: 'Americano sin azúcar', notes: 'Alergia al maní.' }
  },
  { id: 'c2', name: 'Andrea Montes', phone: '+57 300 123 4567', totalSpent: 450000, lastVisit: 'Hace 3 días', frequency: 'Mensual', tags: ['Frecuente'], address: 'Carrera 27 #52-10, Edificio Colseguros' },
  { id: 'c3', name: 'Jorge Luna', phone: '+57 315 987 6543', totalSpent: 32000, lastVisit: 'Hoy', frequency: 'Nuevo', tags: ['Nuevo'], address: 'Calle 45 #9-15, Cabecera' },
  { id: 'c4', name: 'Maria Garcia', phone: '+57 310 555 4433', totalSpent: 890000, lastVisit: 'Hace 1 semana', frequency: 'Semanal', tags: ['VIP'], address: 'Anillo Vial #12-45, Conjunto Natura' },
  { id: 'c5', name: 'Felipe Ruiz', phone: '+57 320 111 2233', totalSpent: 120000, lastVisit: 'Hace 2 semanas', frequency: 'Ocasional', tags: ['Frecuente'], address: 'Carrera 33 #34-56, El Prado' },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    customerName: 'Maria G.',
    customerAvatar: 'https://i.pravatar.cc/150?u=maria',
    lastMessage: '¿Tienen domicilio a la Calle 100?',
    timestamp: '12:45',
    intent: 'soporte',
    status: 'active',
    messages: [
      { id: 'm1', sender: 'customer', text: '¡Hola! Quería consultar si tienen domicilios activos hoy.', timestamp: '12:40' },
      { id: 'm2', sender: 'ai', text: '¡Claro que sí! Hacemos domicilios en toda la ciudad. ¿Qué te gustaría pedir hoy?', timestamp: '12:41' },
      { id: 'm3', sender: 'customer', text: '¿Tienen cobertura en la Calle 100 con 15?', timestamp: '12:45' }
    ]
  },
  {
    id: 'chat2',
    customerName: 'Carlos Ortiz',
    customerAvatar: 'https://i.pravatar.cc/150?u=carlos',
    lastMessage: 'Mi pedido #9021 está demorado...',
    timestamp: '12:30',
    intent: 'soporte',
    status: 'active',
    messages: []
  },
  {
    id: 'chat3',
    customerName: 'Ana Belén',
    customerAvatar: 'https://i.pravatar.cc/150?u=ana',
    lastMessage: 'Quiero 2 pizzas margarita por fa',
    timestamp: '12:15',
    intent: 'pedido',
    status: 'active',
    messages: []
  },
  {
    id: 'chat4',
    customerName: 'Luis Sanabria',
    customerAvatar: 'https://i.pravatar.cc/150?u=luis',
    lastMessage: '¿Hasta qué hora atienden hoy?',
    timestamp: '11:50',
    intent: 'soporte',
    status: 'active',
    messages: []
  },
  {
    id: 'chat5',
    customerName: 'Daniela Castro',
    customerAvatar: 'https://i.pravatar.cc/150?u=daniela',
    lastMessage: 'Me gustaría ver el menú de hoy.',
    timestamp: '11:10',
    intent: 'pedido',
    status: 'active',
    messages: []
  },
  {
    id: 'chat6',
    customerName: 'Felipe Ruiz',
    customerAvatar: 'https://i.pravatar.cc/150?u=felipe',
    lastMessage: 'Añade una gaseosa al pedido anterior.',
    timestamp: '10:45',
    intent: 'pedido',
    status: 'active',
    messages: []
  },
  {
    id: 'chat7',
    customerName: 'Sofia Torres',
    customerAvatar: 'https://i.pravatar.cc/150?u=sofia',
    lastMessage: '¿Tienen opciones vegetarianas?',
    timestamp: '10:15',
    intent: 'soporte',
    status: 'active',
    messages: []
  },
  {
    id: 'chat8',
    customerName: 'Jorge Ivan',
    customerAvatar: 'https://i.pravatar.cc/150?u=jorge',
    lastMessage: '¿Mi pedido #9015 ya salió?',
    timestamp: '09:30',
    intent: 'soporte',
    status: 'active',
    messages: []
  },
  {
    id: 'chat9',
    customerName: 'Natalia Arias',
    customerAvatar: 'https://i.pravatar.cc/150?u=natalia',
    lastMessage: 'El pago con tarjeta no pasó',
    timestamp: '09:05',
    intent: 'soporte',
    status: 'active',
    messages: []
  },
  {
    id: 'chat10',
    customerName: 'Andres Bello',
    customerAvatar: 'https://i.pravatar.cc/150?u=andres',
    lastMessage: '2 hamburguesas clásicas por favor.',
    timestamp: '08:45',
    intent: 'pedido',
    status: 'active',
    messages: []
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'camp1', name: '2x1 en Capuchino', segment: 'Clientes VIP', status: 'recurrent', sent: 450, redeemed: 112, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&h=200&auto=format&fit=crop', endsIn: '4 días' },
  { id: 'camp2', name: 'Almuerzo Ejecutivo', segment: 'Oficinas Cercanas', status: 'active', sent: 1200, redeemed: 342, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: 'camp3', name: 'Postre gratis cumple', segment: 'Cumpleañeros', status: 'automated', sent: 12, redeemed: 5, image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=200&h=200&auto=format&fit=crop' }
];
