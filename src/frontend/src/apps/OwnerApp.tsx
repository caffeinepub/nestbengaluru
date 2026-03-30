import { useState } from "react";
import AddPGPage from "../pages/owner/AddPGPage";
import MyListingsPage from "../pages/owner/MyListingsPage";
import ProfilePage from "../pages/user/ProfilePage";

type Tab = "listings" | "add" | "profile";

export default function OwnerApp() {
  const [activeTab, setActiveTab] = useState<Tab>("listings");
  const [editPgId, setEditPgId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-md mx-auto">
      <div className="flex-1 overflow-hidden">
        {activeTab === "listings" && (
          <MyListingsPage
            onEdit={(id) => {
              setEditPgId(id);
              setActiveTab("add");
            }}
          />
        )}
        {activeTab === "add" && (
          <AddPGPage
            editPgId={editPgId}
            onDone={() => {
              setEditPgId(null);
              setActiveTab("listings");
            }}
          />
        )}
        {activeTab === "profile" && <ProfilePage />}
      </div>
      <nav className="bg-white bottom-nav-shadow border-t border-gray-100 flex sticky bottom-0">
        {(
          [
            { tab: "listings", icon: "🏢", label: "My PGs" },
            { tab: "add", icon: "➕", label: "Add PG" },
            { tab: "profile", icon: "👤", label: "Profile" },
          ] as { tab: Tab; icon: string; label: string }[]
        ).map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => {
              setEditPgId(null);
              setActiveTab(tab);
            }}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${
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
