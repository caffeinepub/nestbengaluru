import { useState } from "react";
import AdminDashboard from "../pages/admin/DashboardPage";
import AdminListings from "../pages/admin/ListingsPage";
import AdminUsers from "../pages/admin/UsersPage";

type Tab = "dashboard" | "listings" | "users";

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-md mx-auto">
      {/* Admin Header */}
      <div className="px-4 pt-10 pb-0" style={{ background: "#3c4555" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🛡️</span>
          <div>
            <h1 className="text-white font-bold text-lg">Admin Panel</h1>
            <p className="text-white/50 text-xs">NestBengaluru</p>
          </div>
        </div>
        <div className="flex">
          {(
            [
              { tab: "dashboard", label: "Dashboard" },
              { tab: "listings", label: "Listings" },
              { tab: "users", label: "Users" },
            ] as { tab: Tab; label: string }[]
          ).map(({ tab, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab
                  ? "border-[#ff6b6b] text-white"
                  : "border-transparent text-white/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "listings" && <AdminListings />}
        {activeTab === "users" && <AdminUsers />}
      </div>
    </div>
  );
}
