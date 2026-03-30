import { useState } from "react";
import BookingFlowPage from "../pages/user/BookingFlowPage";
import BookingsPage from "../pages/user/BookingsPage";
import HomePage from "../pages/user/HomePage";
import PGDetailPage from "../pages/user/PGDetailPage";
import ProfilePage from "../pages/user/ProfilePage";
import WishlistPage from "../pages/user/WishlistPage";
import type { BookingRecord } from "../types";

type Tab = "home" | "wishlist" | "bookings" | "profile";

export default function UserApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [detailPgId, setDetailPgId] = useState<string | null>(null);
  const [bookingPgId, setBookingPgId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  if (bookingPgId) {
    return (
      <BookingFlowPage
        pgId={bookingPgId}
        onDone={(record) => {
          setBookings((prev) => [record, ...prev]);
          setBookingPgId(null);
          setDetailPgId(null);
          setActiveTab("bookings");
        }}
        onBack={() => setBookingPgId(null)}
      />
    );
  }

  if (detailPgId) {
    return (
      <PGDetailPage
        pgId={detailPgId}
        onBack={() => setDetailPgId(null)}
        onBook={() => setBookingPgId(detailPgId)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-md mx-auto">
      <div className="flex-1 overflow-hidden">
        {activeTab === "home" && (
          <HomePage onPGSelect={(id) => setDetailPgId(id)} />
        )}
        {activeTab === "wishlist" && (
          <WishlistPage onPGSelect={(id) => setDetailPgId(id)} />
        )}
        {activeTab === "bookings" && <BookingsPage bookings={bookings} />}
        {activeTab === "profile" && <ProfilePage />}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white bottom-nav-shadow border-t border-gray-100 flex sticky bottom-0">
        {(
          [
            { tab: "home", icon: "🏠", label: "Home" },
            { tab: "wishlist", icon: "❤️", label: "Saved" },
            { tab: "bookings", icon: "📅", label: "Bookings" },
            { tab: "profile", icon: "👤", label: "Profile" },
          ] as { tab: Tab; icon: string; label: string }[]
        ).map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === tab ? "text-[#ff6b6b]" : "text-gray-400"
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
