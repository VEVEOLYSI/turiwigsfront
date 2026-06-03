// ─── Enums ────────────────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'staff' | 'admin';
export type OrderStatus =
  | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered'
  | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type BookingStatus =
  | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type ReviewTarget = 'product' | 'service';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: { id: string; email: string };
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface ProductImage {
  url: string;
  alt?: string;
  sort_order?: number;
}

export interface ProductVariant {
  id: string;
  color?: string;
  length?: string;
  density?: string;
  lace_type?: string;
  price_modifier?: number;
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  images: ProductImage[];
  variants: ProductVariant[];
  is_featured: boolean;
  avg_rating?: number;
  review_count?: number;
  created_at: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  duration_minutes: number;
  capacity: number;
  images: ProductImage[];
  is_featured: boolean;
}

export interface ServiceSlot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  quantity: number;
  unit_price: number;
  variant_id?: string;
  notes?: string;
  products?: Pick<Product, 'id' | 'name' | 'slug' | 'images' | 'stock'>;
  services?: Pick<Service, 'id' | 'name' | 'slug' | 'price'>;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
}

// ─── Order ────────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  product_id?: string;
  variant_id?: string;
  product_snapshot: {
    name: string;
    sku?: string;
    price: number;
    image?: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  notes?: string;
  created_at: string;
  order_items?: OrderItem[];
  addresses?: {
    street: string;
    city: string;
    county?: string;
    country: string;
  };
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export interface Booking {
  id: string;
  booking_number: string;
  scheduled_date: string;
  scheduled_time: string;
  status: BookingStatus;
  price: number;
  notes?: string;
  services?: { name: string; duration_minutes: number };
  created_at: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  images: ProductImage[];
  is_verified_purchase: boolean;
  created_at: string;
  profiles?: { name: string; avatar_url?: string };
}

// ─── Address ──────────────────────────────────────────────────────────────────
export interface Address {
  id: string;
  label?: string;
  street: string;
  city: string;
  county?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read_at?: string;
  created_at: string;
}

// ─── Promotion ────────────────────────────────────────────────────────────────
export interface Promotion {
  id: string;
  title: string;
  type: string;
  image_url?: string;
  link_url?: string;
  description?: string;
  starts_at?: string;
  ends_at?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
