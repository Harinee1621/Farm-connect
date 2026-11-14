import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { ConsumerMarketplace } from './components/consumer/ConsumerMarketplace';
import { MyOrdersView } from './components/consumer/MyOrdersView';
import { ConsumerProfileView } from './components/consumer/ConsumerProfileView';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { FarmerProfileView } from './components/farmer/FarmerProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RegionalHubsView } from './components/hubs/RegionalHubsView';
import { AuthModal } from './components/auth/AuthModal';
import { CartDrawer } from './components/consumer/CartDrawer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ChatModal } from './components/common/ChatModal';
import { ReviewModal } from './components/common/ReviewModal';
import { DatabaseModal } from './components/common/DatabaseModal';
import { Order } from './types';

const AppContent: React.FC = () => {
  const { userRole, orders } = useStore();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<'farmer' | 'consumer'>('consumer');
  const [authInitialMode, setAuthInitialMode] = useState<'register' | 'login'>('register');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState<any>(null);
  const [chatOrderId, setChatOrderId] = useState<string | undefined>();
  const [chatCropName, setChatCropName] = useState<string | undefined>();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  const handleOpenAuth = (role: 'farmer' | 'consumer' = 'consumer', mode: 'register' | 'login' = 'register') => {
    setAuthInitialRole(role);
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const roleRequired: Record<string, 'farmer' | 'consumer' | 'admin' | undefined> = {
      'farmer-dashboard': 'farmer',
      'farmer-profile': 'farmer',
      'my-orders': 'consumer',
      'consumer-profile': 'consumer',
      'admin-dashboard': 'admin',
    };
    const requiredRole = roleRequired[currentTab];
    if (requiredRole && userRole !== requiredRole) {
      setCurrentTab('landing');
    }
  }, [currentTab, userRole]);

  const handleOpenChat = (targetUser: any, orderId?: string, cropName?: string) => {
    setChatTargetUser(targetUser);
    setChatOrderId(orderId);
    setChatCropName(cropName);
    setIsChatOpen(true);
  };

  const handleOpenReview = (order: Order) => {
    setReviewOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleOrderPlaced = (orderIds: string[]) => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#4ade80', '#f59e0b', '#22c55e'],
      });
    } catch (e) {
      // safe fallback
    }
    setCurrentTab('my-orders');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-forest-100 selection:text-forest-900">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAuthModal={handleOpenAuth}
        openCartDrawer={() => setIsCartOpen(true)}
        openNotificationDrawer={() => setIsNotificationOpen(true)}
        openDatabaseModal={() => setIsDatabaseModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            setCurrentTab={setCurrentTab}
            openAuthModal={handleOpenAuth}
          />
        )}

        {currentTab === 'marketplace' && (
          <ConsumerMarketplace
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenChat={handleOpenChat}
          />
        )}

        {currentTab === 'my-orders' && (
          <MyOrdersView
            onOpenChat={handleOpenChat}
            onOpenReview={handleOpenReview}
            onBrowseCrops={() => setCurrentTab('marketplace')}
          />
        )}

        {currentTab === 'consumer-profile' && <ConsumerProfileView />}

        {currentTab === 'farmer-dashboard' && (
          <FarmerDashboard
            onOpenChat={handleOpenChat}
            onNavigateToProfile={() => setCurrentTab('farmer-profile')}
          />
        )}

        {currentTab === 'farmer-profile' && <FarmerProfileView />}

        {currentTab === 'admin-dashboard' && <AdminDashboard />}

        {currentTab === 'regional-hubs' && <RegionalHubsView />}
      </main>

      {/* Footer */}
      <Footer
        setCurrentTab={setCurrentTab}
        openAuthModal={handleOpenAuth}
      />

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authInitialRole}
        initialMode={authInitialMode}
        onSuccess={(role) => {
          if (role === 'farmer') {
            setCurrentTab('farmer-dashboard');
          } else {
            setCurrentTab('marketplace');
          }
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderPlaced}
        onOpenAuthModal={handleOpenAuth}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigateToOrder={(orderId) => {
          if (userRole === 'farmer') {
            setCurrentTab('farmer-dashboard');
          } else {
            setCurrentTab('my-orders');
          }
        }}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        targetUser={chatTargetUser}
        orderId={chatOrderId}
        cropName={chatCropName}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={reviewOrder}
      />

      <DatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
