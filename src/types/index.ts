export type UserRole = 'farmer' | 'consumer' | 'admin';

export interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  farmName: string;
  farmLocation: string;
  district: string;
  state: string;
  pinCode: string;
  bio?: string;
  avatarUrl?: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  collectionHubAssigned?: string;
  createdAt: string;
}

export interface ConsumerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
  additionalRequirements?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: 'admin';
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains & Pulses'
  | 'Spices'
  | 'Oilseeds'
  | 'Dairy & Poultry'
  | 'Tubers & Roots'
  | 'Organic Specials';

export type ProductUnit = 'kg' | 'quintal' | 'ton' | 'bunch' | 'crate' | 'box';

export type QualityGrade =
  | 'Grade A (Export)'
  | 'Grade A (Premium)'
  | 'Grade B (Standard)'
  | 'Organic Certified';

export type AvailabilityStatus = 'available' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  farmerDistrict: string;
  farmerState: string;
  farmerPhone: string;
  farmerRating: number;
  cropName: string;
  category: ProductCategory;
  images: string[];
  availableQuantity: number;
  unit: ProductUnit;
  pricePerUnit: number;
  qualityGrade: QualityGrade;
  harvestDate: string;
  isOrganic: boolean;
  description: string;
  availabilityStatus: AvailabilityStatus;
  minimumOrderQuantity: number;
  hubId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  fulfillmentMethod: 'delivery' | 'pickup';
}

export type OrderStatus =
  | 'waiting_approval' // Step 3: Waiting for farmer approval
  | 'accepted'         // Step 5: Farmer accepted -> consumer gets official Order Confirmation
  | 'preparing'        // Preparing harvest / sorting
  | 'ready_for_pickup' // Ready for pickup (if pickup) or ready to dispatch
  | 'shipped'          // In transit (if delivery)
  | 'delivered'        // Completed delivery or picked up
  | 'rejected'         // Farmer rejected order request
  | 'cancelled';       // Consumer or admin cancelled

export interface OrderItem {
  productId: string;
  cropName: string;
  quantity: number;
  unit: ProductUnit;
  pricePerUnit: number;
  subtotal: number;
  image: string;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  consumerId: string;
  consumerName: string;
  consumerPhone: string;
  consumerEmail: string;
  consumerAddress: string;
  consumerDistrict: string;
  consumerState: string;
  consumerPinCode: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  farmerDistrict: string;
  items: OrderItem[];
  itemTotal: number;
  deliveryCharge: number;
  totalAmount: number;
  fulfillmentMethod: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'upi_online';
  paymentStatus: 'pending' | 'completed' | 'on_delivery';
  orderStatus: OrderStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  orderNotes?: string;
  trackingHistory: OrderTrackingStep[];
  createdAt: string;
  updatedAt: string;
  hasRated?: boolean;
}

export interface Review {
  id: string;
  orderId: string;
  productId: string;
  farmerId: string;
  consumerId: string;
  consumerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: 'order_request' | 'order_accepted' | 'order_rejected' | 'status_update' | 'message' | 'system';
  relatedOrderId?: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  orderId?: string;
  cropName?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface RegionalHub {
  id: string;
  name: string;
  district: string;
  state: string;
  pinCode: string;
  managerName: string;
  contactPhone: string;
  capacityMetricTons: number;
  currentStockMetricTons: number;
  registeredFarmersCount: number;
  status: 'operational' | 'planned' | 'under_construction';
  description: string;
  establishedDate: string;
}

export interface Complaint {
  id: string;
  orderId: string;
  orderNumber: string;
  reporterId: string;
  reporterRole: UserRole;
  reporterName: string;
  targetId: string;
  targetName: string;
  subject: string;
  details: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  resolution?: string;
}
