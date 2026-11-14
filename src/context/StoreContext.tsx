import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  FarmerProfile,
  ConsumerProfile,
  Product,
  CartItem,
  Order,
  OrderStatus,
  Review,
  Notification,
  ChatMessage,
  RegionalHub,
  Complaint,
} from '../types';
import { createPasswordSalt, hashPassword, PBKDF2_ITERATIONS } from '../lib/localAuth';

interface LocalCredential {
  id: string;
  role: 'farmer' | 'consumer';
  userId: string;
  email: string;
  salt: string;
  passwordHash: string;
  iterations: number;
}

type RegistrationResult<T> =
  | { success: true; user: T }
  | { success: false; message: string };

interface StoreContextType {
  currentUser: FarmerProfile | ConsumerProfile | null;
  userRole: UserRole | 'guest';
  login: (email: string, password: string, role: 'farmer' | 'consumer') => Promise<boolean>;
  logout: () => void;

  // Profiles
  farmers: FarmerProfile[];
  consumers: ConsumerProfile[];
  registerFarmer: (
    data: Omit<FarmerProfile, 'id' | 'rating' | 'totalReviews' | 'verified' | 'createdAt'>,
    password: string
  ) => Promise<RegistrationResult<FarmerProfile>>;
  registerConsumer: (
    data: Omit<ConsumerProfile, 'id' | 'createdAt'>,
    password: string
  ) => Promise<RegistrationResult<ConsumerProfile>>;
  updateFarmerProfile: (id: string, updates: Partial<FarmerProfile>) => void;
  updateConsumerProfile: (id: string, updates: Partial<ConsumerProfile>) => void;
  verifyFarmer: (id: string, verified: boolean) => void;

  // Products
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'farmerRating'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, fulfillmentMethod?: 'delivery' | 'pickup') => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartFulfillment: (productId: string, method: 'delivery' | 'pickup') => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (details: {
    fulfillmentMethod: 'delivery' | 'pickup';
    paymentMethod: 'cash' | 'upi_online';
    orderNotes?: string;
    consumerAddressOverride?: string;
  }) => { success: boolean; orderIds: string[]; message?: string };
  farmerAcceptOrder: (orderId: string) => { success: boolean; message?: string };
  farmerRejectOrder: (orderId: string, reason: string) => void;
  advanceOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (reviewData: { orderId: string; productId: string; farmerId: string; rating: number; comment: string }) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  unreadNotificationsCount: number;

  // Chat / Messages
  chatMessages: ChatMessage[];
  sendChatMessage: (receiverId: string, text: string, orderId?: string, cropName?: string) => void;

  // Regional Hubs
  regionalHubs: RegionalHub[];
  addRegionalHub: (hub: Omit<RegionalHub, 'id' | 'establishedDate'>) => void;

  // Complaints
  complaints: Complaint[];
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => void;
  resolveComplaint: (id: string, resolution: string) => void;

  clearAllData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FARMERS: 'fc_farmers_v1',
  CONSUMERS: 'fc_consumers_v1',
  PRODUCTS: 'fc_products_v1',
  ORDERS: 'fc_orders_v1',
  REVIEWS: 'fc_reviews_v1',
  NOTIFICATIONS: 'fc_notifications_v1',
  CHATS: 'fc_chats_v1',
  HUBS: 'fc_hubs_v1',
  COMPLAINTS: 'fc_complaints_v1',
  CURRENT_USER_ID: 'fc_current_user_id',
  CURRENT_ROLE: 'fc_current_role',
  WISHLIST: 'fc_wishlist_v1',
  CREDENTIALS: 'fc_credentials_v1',
};

const LEGACY_FARMER_IDS = new Set(['farmer-1', 'farmer-2', 'farmer-3', 'farmer-4']);
const LEGACY_CONSUMER_IDS = new Set(['consumer-1', 'consumer-2']);

function readStoredArray<T>(key: string, keep: (entry: T) => boolean = () => true): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error(`Ignoring invalid Farm Connect browser data for "${key}": expected an array.`);
      return [];
    }
    return parsed.filter(keep);
  } catch (error) {
    console.error(`Unable to load Farm Connect browser data for "${key}".`, error);
    return [];
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credentials, setCredentials] = useState<LocalCredential[]>(() =>
    readStoredArray<LocalCredential>(
      STORAGE_KEYS.CREDENTIALS,
      (credential) =>
        !LEGACY_FARMER_IDS.has(credential.userId) && !LEGACY_CONSUMER_IDS.has(credential.userId)
    )
  );
  const persistedFarmers = readStoredArray<FarmerProfile>(
    STORAGE_KEYS.FARMERS,
    (farmer) => !LEGACY_FARMER_IDS.has(farmer.id)
  );
  const persistedConsumers = readStoredArray<ConsumerProfile>(
    STORAGE_KEYS.CONSUMERS,
    (consumer) => !LEGACY_CONSUMER_IDS.has(consumer.id)
  );
  const farmerAccountIds = new Set(persistedFarmers.map((farmer) => farmer.id));
  const consumerAccountIds = new Set(persistedConsumers.map((consumer) => consumer.id));

  // Keep user-created profiles and their data; remove only known seeded demo accounts.
  const [farmers, setFarmers] = useState<FarmerProfile[]>(() => {
    return persistedFarmers;
  });

  const [consumers, setConsumers] = useState<ConsumerProfile[]>(() => {
    return persistedConsumers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    return readStoredArray(STORAGE_KEYS.PRODUCTS, (product) => farmerAccountIds.has(product.farmerId));
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return readStoredArray(
      STORAGE_KEYS.ORDERS,
      (order) => farmerAccountIds.has(order.farmerId) && consumerAccountIds.has(order.consumerId)
    );
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    return readStoredArray(
      STORAGE_KEYS.REVIEWS,
      (review) => farmerAccountIds.has(review.farmerId) && consumerAccountIds.has(review.consumerId)
    );
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return readStoredArray(
      STORAGE_KEYS.NOTIFICATIONS,
      (notification) =>
        farmerAccountIds.has(notification.userId) || consumerAccountIds.has(notification.userId)
    );
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return readStoredArray(
      STORAGE_KEYS.CHATS,
      (message) =>
        (farmerAccountIds.has(message.senderId) || consumerAccountIds.has(message.senderId)) &&
        (farmerAccountIds.has(message.receiverId) || consumerAccountIds.has(message.receiverId))
    );
  });

  const [regionalHubs, setRegionalHubs] = useState<RegionalHub[]>(() => {
    return readStoredArray(STORAGE_KEYS.HUBS);
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    return readStoredArray(
      STORAGE_KEYS.COMPLAINTS,
      (complaint) =>
        (farmerAccountIds.has(complaint.reporterId) || consumerAccountIds.has(complaint.reporterId)) &&
        (farmerAccountIds.has(complaint.targetId) || consumerAccountIds.has(complaint.targetId))
    );
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const productIds = new Set(
      readStoredArray<Product>(STORAGE_KEYS.PRODUCTS, (product) => !LEGACY_FARMER_IDS.has(product.farmerId))
        .map((product) => product.id)
    );
    return readStoredArray<string>(STORAGE_KEYS.WISHLIST, (id) => productIds.has(id));
  });

  // Restore a session only when the profile has a registered password credential.
  const [userRole, setUserRole] = useState<UserRole | 'guest'>(() => {
    const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '';
    if (
      savedRole === 'farmer' &&
      farmers.some((farmer) => farmer.id === savedId) &&
      credentials.some((credential) => credential.userId === savedId && credential.role === 'farmer')
    ) return 'farmer';
    if (
      savedRole === 'consumer' &&
      consumers.some((consumer) => consumer.id === savedId) &&
      credentials.some((credential) => credential.userId === savedId && credential.role === 'consumer')
    ) return 'consumer';
    return 'guest';
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSUMERS, JSON.stringify(consumers));
  }, [consumers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HUBS, JSON.stringify(regionalHubs));
  }, [regionalHubs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, userRole);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [userRole, currentUserId]);

  useEffect(() => {
    const syncCollection = <T,>(
      key: string,
      setValue: React.Dispatch<React.SetStateAction<T[]>>,
      value: string
    ) => {
      try {
        const parsed: unknown = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setValue(parsed as T[]);
        } else {
          console.error(`Ignoring invalid Farm Connect browser data for "${key}": expected an array.`);
        }
      } catch (error) {
        console.error(`Unable to sync Farm Connect browser data for "${key}".`, error);
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage || event.newValue === null) return;

      switch (event.key) {
        case STORAGE_KEYS.FARMERS:
          syncCollection(STORAGE_KEYS.FARMERS, setFarmers, event.newValue);
          break;
        case STORAGE_KEYS.CONSUMERS:
          syncCollection(STORAGE_KEYS.CONSUMERS, setConsumers, event.newValue);
          break;
        case STORAGE_KEYS.PRODUCTS:
          syncCollection(STORAGE_KEYS.PRODUCTS, setProducts, event.newValue);
          break;
        case STORAGE_KEYS.ORDERS:
          try {
            const incoming: unknown = JSON.parse(event.newValue);
            if (!Array.isArray(incoming)) {
              console.error('Ignoring invalid Farm Connect browser orders: expected an array.');
              break;
            }
            setOrders((current) => {
              const byId = new Map(current.map((order) => [order.id, order]));
              (incoming as Order[]).forEach((order) => {
                const existing = byId.get(order.id);
                if (!existing || Date.parse(order.updatedAt) >= Date.parse(existing.updatedAt)) {
                  byId.set(order.id, order);
                }
              });
              return [...byId.values()].sort(
                (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
              );
            });
          } catch (error) {
            console.error('Unable to sync Farm Connect orders across tabs.', error);
          }
          break;
        case STORAGE_KEYS.REVIEWS:
          syncCollection(STORAGE_KEYS.REVIEWS, setReviews, event.newValue);
          break;
        case STORAGE_KEYS.NOTIFICATIONS:
          try {
            const incoming: unknown = JSON.parse(event.newValue);
            if (!Array.isArray(incoming)) {
              console.error('Ignoring invalid Farm Connect browser notifications: expected an array.');
              break;
            }
            setNotifications((current) => {
              const byId = new Map(current.map((notification) => [notification.id, notification]));
              (incoming as Notification[]).forEach((notification) => {
                const existing = byId.get(notification.id);
                byId.set(
                  notification.id,
                  existing
                    ? { ...notification, read: existing.read || notification.read }
                    : notification
                );
              });
              return [...byId.values()].sort(
                (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
              );
            });
          } catch (error) {
            console.error('Unable to sync Farm Connect notifications across tabs.', error);
          }
          break;
        case STORAGE_KEYS.CHATS:
          syncCollection(STORAGE_KEYS.CHATS, setChatMessages, event.newValue);
          break;
        case STORAGE_KEYS.HUBS:
          syncCollection(STORAGE_KEYS.HUBS, setRegionalHubs, event.newValue);
          break;
        case STORAGE_KEYS.COMPLAINTS:
          syncCollection(STORAGE_KEYS.COMPLAINTS, setComplaints, event.newValue);
          break;
        case STORAGE_KEYS.WISHLIST:
          syncCollection(STORAGE_KEYS.WISHLIST, setWishlist, event.newValue);
          break;
        case STORAGE_KEYS.CREDENTIALS:
          syncCollection(STORAGE_KEYS.CREDENTIALS, setCredentials, event.newValue);
          break;
        default:
          break;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Derive Current User object
  const currentUser: FarmerProfile | ConsumerProfile | null = (() => {
    if (userRole === 'farmer') {
      return farmers.find((f) => f.id === currentUserId) || null;
    }
    if (userRole === 'consumer') {
      return consumers.find((c) => c.id === currentUserId) || null;
    }
    return null;
  })();

  const login = async (email: string, password: string, role: 'farmer' | 'consumer'): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const credential = credentials.find(
      (entry) => entry.email === normalizedEmail && entry.role === role
    );
    if (!credential) return false;

    const suppliedHash = await hashPassword(password, credential.salt, credential.iterations);
    if (suppliedHash !== credential.passwordHash) return false;

    setUserRole(role);
    setCurrentUserId(credential.userId);
    return true;
  };

  const logout = () => {
    setUserRole('guest');
    setCurrentUserId('');
  };

  // Farmer Registration
  const registerFarmer = async (
    data: Omit<FarmerProfile, 'id' | 'rating' | 'totalReviews' | 'verified' | 'createdAt'>,
    password: string
  ): Promise<RegistrationResult<FarmerProfile>> => {
    const email = data.email.trim().toLowerCase();
    if (password.length < 8) {
      return { success: false, message: 'Use a password with at least 8 characters.' };
    }
    if (credentials.some((credential) => credential.role === 'farmer' && credential.email === email)) {
      return { success: false, message: 'A farmer account with this email already exists.' };
    }

    const salt = createPasswordSalt();
    const passwordHash = await hashPassword(password, salt);
    const existingFarmer = farmers.find((farmer) => farmer.email.toLowerCase() === email);
    const newFarmer = existingFarmer || {
      ...data,
      email,
      id: `farmer-${crypto.randomUUID()}`,
      rating: 5.0,
      totalReviews: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    if (!existingFarmer) setFarmers((prev) => [newFarmer, ...prev]);
    setCredentials((prev) => [
      ...prev,
      {
        id: `credential-${crypto.randomUUID()}`,
        role: 'farmer',
        userId: newFarmer.id,
        email,
        salt,
        passwordHash,
        iterations: PBKDF2_ITERATIONS,
      },
    ]);
    setUserRole('farmer');
    setCurrentUserId(newFarmer.id);

    if (!existingFarmer) {
      const welcomeNotif: Notification = {
        id: `notif-${Date.now()}`,
        userId: newFarmer.id,
        role: 'farmer',
        title: 'Welcome to Farm Connect!',
        message: `Welcome ${newFarmer.name}! Your farm is registered. Start listing crops to reach consumers.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [welcomeNotif, ...prev]);
    }

    return { success: true, user: newFarmer };
  };

  // Consumer Registration
  const registerConsumer = async (
    data: Omit<ConsumerProfile, 'id' | 'createdAt'>,
    password: string
  ): Promise<RegistrationResult<ConsumerProfile>> => {
    const email = data.email.trim().toLowerCase();
    if (password.length < 8) {
      return { success: false, message: 'Use a password with at least 8 characters.' };
    }
    if (credentials.some((credential) => credential.role === 'consumer' && credential.email === email)) {
      return { success: false, message: 'A consumer account with this email already exists.' };
    }

    const salt = createPasswordSalt();
    const passwordHash = await hashPassword(password, salt);
    const existingConsumer = consumers.find((consumer) => consumer.email.toLowerCase() === email);
    const newConsumer = existingConsumer || {
      ...data,
      email,
      id: `consumer-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    if (!existingConsumer) setConsumers((prev) => [newConsumer, ...prev]);
    setCredentials((prev) => [
      ...prev,
      {
        id: `credential-${crypto.randomUUID()}`,
        role: 'consumer',
        userId: newConsumer.id,
        email,
        salt,
        passwordHash,
        iterations: PBKDF2_ITERATIONS,
      },
    ]);
    setUserRole('consumer');
    setCurrentUserId(newConsumer.id);

    if (!existingConsumer) {
      const welcomeNotif: Notification = {
        id: `notif-${Date.now()}`,
        userId: newConsumer.id,
        role: 'consumer',
        title: 'Welcome to Farm Connect!',
        message: `Welcome ${newConsumer.name}! Explore crops listed directly by local farmers.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [welcomeNotif, ...prev]);
    }

    return { success: true, user: newConsumer };
  };

  const updateFarmerProfile = (id: string, updates: Partial<FarmerProfile>) => {
    const normalizedEmail = updates.email?.trim().toLowerCase();
    setFarmers((prev) =>
      prev.map((farmer) => (farmer.id === id ? { ...farmer, ...updates, ...(normalizedEmail ? { email: normalizedEmail } : {}) } : farmer))
    );
    if (normalizedEmail) {
      setCredentials((prev) =>
        prev.map((credential) =>
          credential.role === 'farmer' && credential.userId === id
            ? { ...credential, email: normalizedEmail }
            : credential
        )
      );
    }
  };

  const updateConsumerProfile = (id: string, updates: Partial<ConsumerProfile>) => {
    const normalizedEmail = updates.email?.trim().toLowerCase();
    setConsumers((prev) =>
      prev.map((consumer) => (consumer.id === id ? { ...consumer, ...updates, ...(normalizedEmail ? { email: normalizedEmail } : {}) } : consumer))
    );
    if (normalizedEmail) {
      setCredentials((prev) =>
        prev.map((credential) =>
          credential.role === 'consumer' && credential.userId === id
            ? { ...credential, email: normalizedEmail }
            : credential
        )
      );
    }
  };

  const verifyFarmer = (id: string, verified: boolean) => {
    setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, verified } : f)));
  };

  // Product Management
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'farmerRating'>) => {
    const currentFarmer = farmers.find((f) => f.id === productData.farmerId) || (currentUser as FarmerProfile);
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      farmerRating: currentFarmer?.rating || 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  // Cart & Wishlist
  const addToCart = (product: Product, quantity = 1, fulfillmentMethod: 'delivery' | 'pickup' = 'delivery') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, fulfillmentMethod }
            : item
        );
      }
      return [...prev, { product, quantity, fulfillmentMethod }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const updateCartFulfillment = (productId: string, method: 'delivery' | 'pickup') => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, fulfillmentMethod: method } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // ==============================================================================
  // CRITICAL ORDER APPROVAL WORKFLOW
  // Step 1: Consumer places order
  // Step 2: Send purchase request to respective farmer(s)
  // Step 3: Consumer status: "Waiting for Farmer Approval"
  // Step 4: Farmer receives request -> can Accept Order or Reject Order
  // Step 5: Only AFTER farmer accepts does consumer get Order Confirmation!
  // ==============================================================================
  const placeOrder = ({
    fulfillmentMethod,
    paymentMethod,
    orderNotes,
    consumerAddressOverride,
  }: {
    fulfillmentMethod: 'delivery' | 'pickup';
    paymentMethod: 'cash' | 'upi_online';
    orderNotes?: string;
    consumerAddressOverride?: string;
  }) => {
    if (cart.length === 0) {
      return { success: false, orderIds: [], message: 'Your cart is empty' };
    }

    if (paymentMethod === 'upi_online') {
      return {
        success: false,
        orderIds: [],
        message: 'Online payments are unavailable until a payment provider is configured. Choose pay on delivery or pickup.',
      };
    }

    const consumer = currentUser as ConsumerProfile;
    if (!consumer || userRole !== 'consumer') {
      return { success: false, orderIds: [], message: 'Please log in as a consumer to place an order' };
    }

    // Check inventory availability first to prevent overselling
    for (const item of cart) {
      const currentStock = products.find((p) => p.id === item.product.id)?.availableQuantity ?? 0;
      if (item.quantity > currentStock) {
        return {
          success: false,
          orderIds: [],
          message: `Cannot place order. Requested quantity for "${item.product.cropName}" (${item.quantity} ${item.product.unit}) exceeds available stock (${currentStock} ${item.product.unit}).`,
        };
      }
    }

    // Group items by farmer! (Support multiple farmers in single consumer cart)
    const itemsByFarmer: { [farmerId: string]: CartItem[] } = {};
    cart.forEach((item) => {
      const fId = item.product.farmerId;
      if (!itemsByFarmer[fId]) {
        itemsByFarmer[fId] = [];
      }
      itemsByFarmer[fId].push(item);
    });

    const createdOrderIds: string[] = [];
    const newOrdersList: Order[] = [];
    const newNotificationsList: Notification[] = [];
    const nowIso = new Date().toISOString();

    Object.entries(itemsByFarmer).forEach(([farmerId, farmerItems], index) => {
      const farmer = farmers.find((f) => f.id === farmerId);
      const farmerName = farmer?.name || farmerItems[0]?.product.farmerName || 'Farmer';
      const farmerPhone = farmer?.phone || farmerItems[0]?.product.farmerPhone || '';
      const farmerLocation = farmer?.farmLocation || farmerItems[0]?.product.farmerLocation || '';
      const farmerDistrict = farmer?.district || farmerItems[0]?.product.farmerDistrict || '';

      const itemTotal = farmerItems.reduce(
        (sum, it) => sum + it.quantity * it.product.pricePerUnit,
        0
      );
      // Flat nominal delivery fee if delivery chosen
      const deliveryCharge = fulfillmentMethod === 'delivery' ? 50 : 0;
      const totalAmount = itemTotal + deliveryCharge;

      const orderNumber = `FC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderId = `order-${Date.now()}-${index}`;

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        consumerId: consumer.id,
        consumerName: consumer.name,
        consumerPhone: consumer.phone,
        consumerEmail: consumer.email,
        consumerAddress: consumerAddressOverride || consumer.address,
        consumerDistrict: consumer.district || consumer.city,
        consumerState: consumer.state,
        consumerPinCode: consumer.pinCode,
        farmerId,
        farmerName,
        farmerPhone,
        farmerLocation,
        farmerDistrict,
        items: farmerItems.map((it) => ({
          productId: it.product.id,
          cropName: it.product.cropName,
          quantity: it.quantity,
          unit: it.product.unit,
          pricePerUnit: it.product.pricePerUnit,
          subtotal: it.quantity * it.product.pricePerUnit,
          image: it.product.images[0] || '',
        })),
        itemTotal,
        deliveryCharge,
        totalAmount,
        fulfillmentMethod,
        paymentMethod,
        paymentStatus: 'on_delivery',
        // CRITICAL: Must be waiting_approval initially! Never confirmed before farmer approval!
        orderStatus: 'waiting_approval',
        orderNotes: orderNotes || '',
        trackingHistory: [
          {
            status: 'waiting_approval',
            timestamp: nowIso,
            note: `Purchase request placed by ${consumer.name}. Waiting for farmer approval.`,
          },
        ],
        createdAt: nowIso,
        updatedAt: nowIso,
        hasRated: false,
      };

      newOrdersList.push(newOrder);
      createdOrderIds.push(orderId);

      // Notification to farmer
      newNotificationsList.push({
        id: `notif-${Date.now()}-farmer-${index}`,
        userId: farmerId,
        role: 'farmer',
        title: 'New Purchase Request',
        message: `${consumer.name} requested ${farmerItems.length} crop item(s) (Order ${orderNumber}). Please review and accept or reject.`,
        type: 'order_request',
        relatedOrderId: orderId,
        read: false,
        createdAt: nowIso,
      });

      // Notification to consumer
      newNotificationsList.push({
        id: `notif-${Date.now()}-cons-${index}`,
        userId: consumer.id,
        role: 'consumer',
        title: 'Order Request Submitted',
        message: `Your request (${orderNumber}) for ${farmerName}'s crops was sent. Status: Waiting for Farmer Approval.`,
        type: 'status_update',
        relatedOrderId: orderId,
        read: false,
        createdAt: nowIso,
      });
    });

    setOrders((prev) => [...newOrdersList, ...prev]);
    setNotifications((prev) => [...newNotificationsList, ...prev]);
    clearCart();

    return {
      success: true,
      orderIds: createdOrderIds,
      message:
        createdOrderIds.length > 1
          ? `Cart split into ${createdOrderIds.length} orders for each respective farmer. Status: Waiting for Farmer Approval.`
          : 'Purchase request sent to farmer! Status: Waiting for Farmer Approval.',
    };
  };

  // Farmer Accepts Order (Step 4 & 5)
  const farmerAcceptOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };
    if (userRole !== 'farmer' || currentUserId !== order.farmerId) {
      return { success: false, message: 'Only the assigned farmer can accept this order.' };
    }
    if (order.orderStatus !== 'waiting_approval') {
      return { success: false, message: 'This order is no longer waiting for approval.' };
    }

    // Prevent overselling: check inventory once more before accepting
    for (const item of order.items) {
      const currentProduct = products.find((p) => p.id === item.productId);
      if (currentProduct && currentProduct.availableQuantity < item.quantity) {
        return {
          success: false,
          message: `Cannot accept order. Available quantity for ${item.cropName} is now only ${currentProduct.availableQuantity} ${item.unit}.`,
        };
      }
    }

    // Deduct stock for all items
    setProducts((prev) =>
      prev.map((prod) => {
        const orderItem = order.items.find((item) => item.productId === prod.id);
        if (orderItem) {
          const newQty = Math.max(0, prod.availableQuantity - orderItem.quantity);
          const newStatus =
            newQty === 0
              ? 'out_of_stock'
              : newQty <= prod.minimumOrderQuantity * 2
              ? 'low_stock'
              : 'available';
          return {
            ...prod,
            availableQuantity: newQty,
            availabilityStatus: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return prod;
      })
    );

    const nowIso = new Date().toISOString();

    // Update order status to accepted
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: 'accepted',
            updatedAt: nowIso,
            trackingHistory: [
              ...o.trackingHistory,
              {
                status: 'accepted',
                timestamp: nowIso,
                note: `Farmer ${o.farmerName} has accepted your order request! Official Order Confirmation confirmed.`,
              },
            ],
          };
        }
        return o;
      })
    );

    // Notify consumer: official order confirmation!
    const acceptNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: order.consumerId,
      role: 'consumer',
      title: 'Order Approved by Farmer!',
      message: `Great news! Farmer ${order.farmerName} has accepted your order (${order.orderNumber}). Official Confirmation issued.`,
      type: 'order_accepted',
      relatedOrderId: order.id,
      read: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [acceptNotif, ...prev]);

    return { success: true, message: `Order ${order.orderNumber} accepted successfully!` };
  };

  // Farmer Rejects Order
  const farmerRejectOrder = (orderId: string, reason: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || userRole !== 'farmer' || currentUserId !== order.farmerId) return;
    if (order.orderStatus !== 'waiting_approval') return;

    const nowIso = new Date().toISOString();

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: 'rejected',
            rejectionReason: reason,
            updatedAt: nowIso,
            trackingHistory: [
              ...o.trackingHistory,
              {
                status: 'rejected',
                timestamp: nowIso,
                note: `Order request rejected by farmer: ${reason}`,
              },
            ],
          };
        }
        return o;
      })
    );

    // Notify consumer of rejection
    const rejectNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: order.consumerId,
      role: 'consumer',
      title: 'Order Request Rejected',
      message: `Farmer ${order.farmerName} was unable to fulfill order (${order.orderNumber}). Reason: ${reason}`,
      type: 'order_rejected',
      relatedOrderId: order.id,
      read: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [rejectNotif, ...prev]);
  };

  // Advance Order Status along tracking lifecycle
  const advanceOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || userRole !== 'farmer' || currentUserId !== order.farmerId) return;
    const nextStatuses: Partial<Record<OrderStatus, OrderStatus[]>> = {
      accepted: ['preparing'],
      preparing: ['ready_for_pickup'],
      ready_for_pickup: order.fulfillmentMethod === 'pickup' ? ['delivered'] : ['shipped'],
      shipped: ['delivered'],
    };
    if (!nextStatuses[order.orderStatus]?.includes(newStatus)) return;

    const nowIso = new Date().toISOString();
    const defaultNotes: Record<OrderStatus, string> = {
      waiting_approval: 'Waiting for farmer review.',
      accepted: 'Farmer accepted purchase request.',
      preparing: 'Farmer is harvesting and sorting fresh crops.',
      ready_for_pickup:
        order.fulfillmentMethod === 'pickup'
          ? 'Produce weighed and packed! Ready for consumer pickup at farm gate.'
          : 'Packed and ready for delivery dispatch.',
      shipped: 'Out for delivery to consumer address.',
      delivered:
        order.fulfillmentMethod === 'pickup'
          ? 'Successfully picked up by consumer at farm gate.'
          : 'Successfully delivered to consumer doorstep.',
      rejected: 'Order was rejected.',
      cancelled: 'Order was cancelled.',
    };

    const statusLabels: Record<OrderStatus, string> = {
      waiting_approval: 'Waiting Approval',
      accepted: 'Accepted',
      preparing: 'Preparing Produce',
      ready_for_pickup: order.fulfillmentMethod === 'pickup' ? 'Ready for Pickup' : 'Ready to Dispatch',
      shipped: 'Out for Delivery',
      delivered: 'Delivered / Completed',
      rejected: 'Rejected',
      cancelled: 'Cancelled',
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: newStatus,
            updatedAt: nowIso,
            trackingHistory: [
              ...o.trackingHistory,
              {
                status: newStatus,
                timestamp: nowIso,
                note: note || defaultNotes[newStatus],
              },
            ],
          };
        }
        return o;
      })
    );

    // Notify consumer of status change
    const updateNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: order.consumerId,
      role: 'consumer',
      title: `Order Status: ${statusLabels[newStatus]}`,
      message: `Order ${order.orderNumber} update: ${note || defaultNotes[newStatus]}`,
      type: 'status_update',
      relatedOrderId: order.id,
      read: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [updateNotif, ...prev]);
  };

  // Cancel order (by consumer or admin)
  const cancelOrder = (orderId: string, reason = 'Cancelled by user') => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || (userRole !== 'admin' && (userRole !== 'consumer' || currentUserId !== order.consumerId))) return;
    if (!['waiting_approval', 'accepted'].includes(order.orderStatus)) return;

    const nowIso = new Date().toISOString();

    // If order was accepted, restore product inventory
    if (order.orderStatus === 'accepted') {
      setProducts((prev) =>
        prev.map((prod) => {
          const item = order.items.find((i) => i.productId === prod.id);
          if (item) {
            return {
              ...prod,
              availableQuantity: prod.availableQuantity + item.quantity,
              availabilityStatus: 'available',
            };
          }
          return prod;
        })
      );
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: 'cancelled',
            cancellationReason: reason,
            updatedAt: nowIso,
            trackingHistory: [
              ...o.trackingHistory,
              {
                status: 'cancelled',
                timestamp: nowIso,
                note: `Order cancelled: ${reason}`,
              },
            ],
          };
        }
        return o;
      })
    );

    // Notify farmer of cancellation
    const cancelNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: order.farmerId,
      role: 'farmer',
      title: 'Order Cancelled',
      message: `Consumer cancelled Order ${order.orderNumber}. Reason: ${reason}`,
      type: 'status_update',
      relatedOrderId: order.id,
      read: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [cancelNotif, ...prev]);
  };

  // Reviews
  const addReview = ({
    orderId,
    productId,
    farmerId,
    rating,
    comment,
  }: {
    orderId: string;
    productId: string;
    farmerId: string;
    rating: number;
    comment: string;
  }) => {
    const consumer = currentUser as ConsumerProfile;
    const order = orders.find((candidate) => candidate.id === orderId);
    if (
      userRole !== 'consumer' ||
      !consumer ||
      !order ||
      order.consumerId !== consumer.id ||
      order.orderStatus !== 'delivered' ||
      order.hasRated
    ) {
      return;
    }
    const consumerName = consumer?.name || 'Verified Consumer';

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      orderId,
      productId,
      farmerId,
      consumerId: consumer.id,
      consumerName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Mark order as rated
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, hasRated: true } : o))
    );

    // Recalculate farmer's average rating
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          const allFarmerReviews = [...reviews.filter((r) => r.farmerId === farmerId), newReview];
          const avg = allFarmerReviews.reduce((sum, r) => sum + r.rating, 0) / allFarmerReviews.length;
          return {
            ...f,
            rating: Number(avg.toFixed(1)),
            totalReviews: allFarmerReviews.length,
          };
        }
        return f;
      })
    );

    // Also notify farmer of review
    const revNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: farmerId,
      role: 'farmer',
      title: 'New Customer Review Received!',
      message: `${consumerName} left a ${rating}★ review: "${comment.slice(0, 50)}${comment.length > 50 ? '...' : ''}"`,
      type: 'message',
      relatedOrderId: orderId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [revNotif, ...prev]);
  };

  // Notifications helpers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => n.userId === (currentUser?.id ?? '') && !n.read
  ).length;

  // In-app messaging
  const sendChatMessage = (
    receiverId: string,
    text: string,
    orderId?: string,
    cropName?: string
  ) => {
    if (!currentUser || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: userRole as UserRole,
      receiverId,
      orderId,
      cropName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Receiver notification
    const chatNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: receiverId,
      role: userRole === 'farmer' ? 'consumer' : 'farmer',
      title: `New Message from ${currentUser.name}`,
      message: text.slice(0, 70),
      type: 'message',
      relatedOrderId: orderId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [chatNotif, ...prev]);
  };

  // Regional Hubs
  const addRegionalHub = (hubData: Omit<RegionalHub, 'id' | 'establishedDate'>) => {
    const newHub: RegionalHub = {
      ...hubData,
      id: `hub-${Date.now()}`,
      establishedDate: new Date().toISOString().split('T')[0],
    };
    setRegionalHubs((prev) => [...prev, newHub]);
  };

  // Complaints
  const submitComplaint = (comp: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const newComp: Complaint = {
      ...comp,
      id: `comp-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComp, ...prev]);
  };

  const resolveComplaint = (id: string, resolution: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved', resolution } : c))
    );
  };

  // Clear all locally stored accounts and marketplace data.
  const clearAllData = () => {
    setFarmers([]);
    setConsumers([]);
    setProducts([]);
    setOrders([]);
    setReviews([]);
    setNotifications([]);
    setChatMessages([]);
    setRegionalHubs([]);
    setComplaints([]);
    setWishlist([]);
    setCredentials([]);
    setCart([]);
    setUserRole('guest');
    setCurrentUserId('');
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        userRole,
        login,
        logout,
        farmers,
        consumers,
        registerFarmer,
        registerConsumer,
        updateFarmerProfile,
        updateConsumerProfile,
        verifyFarmer,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        updateCartFulfillment,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        farmerAcceptOrder,
        farmerRejectOrder,
        advanceOrderStatus,
        cancelOrder,
        reviews,
        addReview,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        chatMessages,
        sendChatMessage,
        regionalHubs,
        addRegionalHub,
        complaints,
        submitComplaint,
        resolveComplaint,
        clearAllData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
