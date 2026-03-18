export enum UserRole {
  Buyer = 1,
  Seller = 2,
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt?: string | null;
}

export enum OrderStatus {
  Pending = 1,
  Paid = 2,
  Shipped = 3,
  Completed = 4,
  Canceled = 5,
}

export enum PaymentMethod {
  CreditCard = 1,
  DebitCard = 2,
  Pix = 3,
  BankTransfer = 4,
}

export enum PaymentStatus {
  Pending = 1,
  Completed = 2,
  Failed = 3,
  Refunded = 4,
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Seller {
  id: string;
  storeName: string;
  bio?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  categoryId: string;
  sellerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  productName: string;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  totalAmount: number;
  items: CartItem[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  notifyOnPriceDrop: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  externalId?: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  shippingAddressId?: string | null;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  payment?: Payment;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}
