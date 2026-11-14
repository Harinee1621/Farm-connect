-- ==============================================================================
-- FARM CONNECT - SUPABASE DATABASE SCHEMA
-- Direct Farmer-to-Consumer Agricultural Marketplace
-- Designed for PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FARMERS TABLE
CREATE TABLE IF NOT EXISTS public.farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    farm_name VARCHAR(255) NOT NULL,
    farm_location TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    total_reviews INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    upi_id VARCHAR(100),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    collection_hub_assigned VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CONSUMERS TABLE
CREATE TABLE IF NOT EXISTS public.consumers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    preferred_contact VARCHAR(20) DEFAULT 'phone' CHECK (preferred_contact IN ('phone', 'email', 'whatsapp')),
    additional_requirements TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    crop_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Vegetables', 'Fruits', 'Grains & Pulses', 'Spices',
        'Oilseeds', 'Dairy & Poultry', 'Tubers & Roots', 'Organic Specials'
    )),
    images TEXT[] NOT NULL DEFAULT '{}',
    available_quantity NUMERIC(10, 2) NOT NULL CHECK (available_quantity >= 0),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('kg', 'quintal', 'ton', 'bunch', 'crate', 'box')),
    price_per_unit NUMERIC(10, 2) NOT NULL CHECK (price_per_unit > 0),
    quality_grade VARCHAR(50) NOT NULL CHECK (quality_grade IN (
        'Grade A (Export)', 'Grade A (Premium)', 'Grade B (Standard)', 'Organic Certified'
    )),
    harvest_date DATE NOT NULL,
    is_organic BOOLEAN DEFAULT FALSE,
    description TEXT,
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'low_stock', 'out_of_stock')),
    minimum_order_quantity NUMERIC(10, 2) DEFAULT 1,
    hub_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDERS TABLE (Strict Order Approval Workflow)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    consumer_id UUID NOT NULL REFERENCES public.consumers(id) ON DELETE RESTRICT,
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE RESTRICT,
    item_total NUMERIC(10, 2) NOT NULL,
    delivery_charge NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    fulfillment_method VARCHAR(20) NOT NULL CHECK (fulfillment_method IN ('delivery', 'pickup')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'upi_online')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'on_delivery')),
    order_status VARCHAR(30) DEFAULT 'waiting_approval' CHECK (order_status IN (
        'waiting_approval',
        'accepted',
        'preparing',
        'ready_for_pickup',
        'shipped',
        'delivered',
        'rejected',
        'cancelled'
    )),
    rejection_reason TEXT,
    cancellation_reason TEXT,
    order_notes TEXT,
    has_rated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    crop_name VARCHAR(150) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price_per_unit NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    image TEXT
);

-- 6. ORDER TRACKING TIMELINE
CREATE TABLE IF NOT EXISTS public.order_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    note TEXT
);

-- 7. REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    consumer_id UUID NOT NULL REFERENCES public.consumers(id) ON DELETE CASCADE,
    consumer_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'consumer', 'admin')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CHAT MESSAGES (Farmer-Consumer direct communication)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(20) NOT NULL,
    receiver_id UUID NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    crop_name VARCHAR(150),
    text TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. REGIONAL COLLECTION HUBS (Future Expansion Architecture: Ponneri Hub, etc.)
CREATE TABLE IF NOT EXISTS public.regional_hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    manager_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    capacity_metric_tons NUMERIC(10, 2) DEFAULT 500,
    current_stock_metric_tons NUMERIC(10, 2) DEFAULT 0,
    registered_farmers_count INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'operational' CHECK (status IN ('operational', 'planned', 'under_construction')),
    description TEXT,
    established_date DATE DEFAULT CURRENT_DATE
);

-- 11. COMPLAINTS & REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    order_number VARCHAR(30),
    reporter_id UUID NOT NULL,
    reporter_role VARCHAR(20) NOT NULL,
    reporter_name VARCHAR(255) NOT NULL,
    target_id UUID NOT NULL,
    target_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_crop_name ON public.products(crop_name);
CREATE INDEX IF NOT EXISTS idx_products_farmer_id ON public.products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON public.orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_consumer_id ON public.orders(consumer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Re-runnable policy section. Order creation, approval, stock changes, and payment
-- updates must be performed by a trusted server/RPC, not direct client table writes.
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Farmers can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Farmers can update their own products" ON public.products;
DROP POLICY IF EXISTS "Orders viewable by parties" ON public.orders;
DROP POLICY IF EXISTS "Consumers can create orders" ON public.orders;
DROP POLICY IF EXISTS "Parties can update order status" ON public.orders;
DROP POLICY IF EXISTS "Regional hubs are viewable by everyone" ON public.regional_hubs;

CREATE POLICY "Available products are public"
    ON public.products FOR SELECT
    USING (availability_status <> 'out_of_stock');

CREATE POLICY "Verified farmers can insert their own products"
    ON public.products FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.farmers f
            WHERE f.id = farmer_id AND f.user_id = auth.uid() AND f.verified
        )
    );

CREATE POLICY "Farmers can update their own products"
    ON public.products FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.farmers f
        WHERE f.id = farmer_id AND f.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.farmers f
        WHERE f.id = farmer_id AND f.user_id = auth.uid()
    ));

CREATE POLICY "Farmers can delete their own products"
    ON public.products FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.farmers f
        WHERE f.id = farmer_id AND f.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own farmer profile"
    ON public.farmers FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own farmer profile"
    ON public.farmers FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid() AND verified = FALSE);

CREATE POLICY "Users can update their own farmer profile"
    ON public.farmers FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own consumer profile"
    ON public.consumers FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own consumer profile"
    ON public.consumers FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own consumer profile"
    ON public.consumers FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Order parties can view orders"
    ON public.orders FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.consumers c
            WHERE c.id = consumer_id AND c.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.farmers f
            WHERE f.id = farmer_id AND f.user_id = auth.uid()
        )
    );

CREATE POLICY "Order parties can view order items"
    ON public.order_items FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_id
          AND (
              EXISTS (SELECT 1 FROM public.consumers c WHERE c.id = o.consumer_id AND c.user_id = auth.uid())
              OR EXISTS (SELECT 1 FROM public.farmers f WHERE f.id = o.farmer_id AND f.user_id = auth.uid())
          )
    ));

CREATE POLICY "Order parties can view order tracking"
    ON public.order_tracking FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_id
          AND (
              EXISTS (SELECT 1 FROM public.consumers c WHERE c.id = o.consumer_id AND c.user_id = auth.uid())
              OR EXISTS (SELECT 1 FROM public.farmers f WHERE f.id = o.farmer_id AND f.user_id = auth.uid())
          )
    ));

CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT TO authenticated
    USING (
        (role = 'farmer' AND EXISTS (
            SELECT 1 FROM public.farmers f WHERE f.id = user_id AND f.user_id = auth.uid()
        ))
        OR (role = 'consumer' AND EXISTS (
            SELECT 1 FROM public.consumers c WHERE c.id = user_id AND c.user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can mark their own notifications read"
    ON public.notifications FOR UPDATE TO authenticated
    USING (
        (role = 'farmer' AND EXISTS (
            SELECT 1 FROM public.farmers f WHERE f.id = user_id AND f.user_id = auth.uid()
        ))
        OR (role = 'consumer' AND EXISTS (
            SELECT 1 FROM public.consumers c WHERE c.id = user_id AND c.user_id = auth.uid()
        ))
    )
    WITH CHECK (
        (role = 'farmer' AND EXISTS (
            SELECT 1 FROM public.farmers f WHERE f.id = user_id AND f.user_id = auth.uid()
        ))
        OR (role = 'consumer' AND EXISTS (
            SELECT 1 FROM public.consumers c WHERE c.id = user_id AND c.user_id = auth.uid()
        ))
    );

CREATE POLICY "Chat participants can view messages"
    ON public.chat_messages FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.farmers f WHERE f.id = sender_id AND f.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.consumers c WHERE c.id = sender_id AND c.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.farmers f WHERE f.id = receiver_id AND f.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.consumers c WHERE c.id = receiver_id AND c.user_id = auth.uid())
    );

CREATE POLICY "Chat users can send messages as themselves"
    ON public.chat_messages FOR INSERT TO authenticated
    WITH CHECK (
        (sender_role = 'farmer' AND EXISTS (
            SELECT 1 FROM public.farmers f WHERE f.id = sender_id AND f.user_id = auth.uid()
        ))
        OR (sender_role = 'consumer' AND EXISTS (
            SELECT 1 FROM public.consumers c WHERE c.id = sender_id AND c.user_id = auth.uid()
        ))
    );

CREATE POLICY "Public can view regional hubs"
    ON public.regional_hubs FOR SELECT
    USING (TRUE);

CREATE POLICY "Complaint reporters can view their complaints"
    ON public.complaints FOR SELECT TO authenticated
    USING (
        (reporter_role = 'farmer' AND EXISTS (
            SELECT 1 FROM public.farmers f WHERE f.id = reporter_id AND f.user_id = auth.uid()
        ))
        OR (reporter_role = 'consumer' AND EXISTS (
            SELECT 1 FROM public.consumers c WHERE c.id = reporter_id AND c.user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can submit complaints as themselves"
    ON public.complaints FOR INSERT TO authenticated
    WITH CHECK (
        (reporter_role = 'farmer' AND EXISTS (
            SELECT 1 FROM public.farmers f WHERE f.id = reporter_id AND f.user_id = auth.uid()
        ))
        OR (reporter_role = 'consumer' AND EXISTS (
            SELECT 1 FROM public.consumers c WHERE c.id = reporter_id AND c.user_id = auth.uid()
        ))
    );

CREATE POLICY "Public can view reviews"
    ON public.reviews FOR SELECT
    USING (TRUE);

CREATE POLICY "Consumers can submit verified purchase reviews"
    ON public.reviews FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.consumers c
            JOIN public.orders o ON o.consumer_id = c.id
            JOIN public.order_items oi ON oi.order_id = o.id
            WHERE c.user_id = auth.uid()
              AND c.id = consumer_id
              AND o.id = order_id
              AND o.order_status = 'delivered'
              AND oi.product_id = product_id
              AND o.farmer_id = farmer_id
        )
    );

CREATE OR REPLACE FUNCTION public.prevent_farmer_trust_field_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND (
        NEW.verified IS DISTINCT FROM OLD.verified
        OR NEW.rating IS DISTINCT FROM OLD.rating
        OR NEW.total_reviews IS DISTINCT FROM OLD.total_reviews
        OR NEW.user_id IS DISTINCT FROM OLD.user_id
    ) THEN
        RAISE EXCEPTION 'Verification and review statistics can only be changed by trusted administration.'
            USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_farmer_trust_fields ON public.farmers;
CREATE TRIGGER protect_farmer_trust_fields
    BEFORE UPDATE ON public.farmers
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_farmer_trust_field_changes();
