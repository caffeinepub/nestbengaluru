import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const prefs = JSON.parse(localStorage.getItem("onboarding-prefs") || "{}");
  const principal = identity?.getPrincipal().toString() || "";

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-10 pb-6" style={{ background: "#3c4555" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#ff6b6b] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {prefs.userType?.[0] || "U"}
            </span>
          </div>
          <div>
            <p className="text-white font-bold text-lg">
              {prefs.userType || "User"}
            </p>
            <p className="text-white/50 text-xs">{principal.slice(0, 20)}...</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {prefs.userType && (
          <div className="bg-white rounded-2xl p-4 pg-card-shadow">
            <p className="text-xs text-gray-400 mb-1">User Type</p>
            <p className="font-semibold text-gray-900">{prefs.userType}</p>
          </div>
        )}
        {prefs.selectedAreas?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 pg-card-shadow">
            <p className="text-xs text-gray-400 mb-2">Preferred Areas</p>
            <div className="flex flex-wrap gap-2">
              {prefs.selectedAreas.map((a: string) => (
                <span
                  key={a}
                  className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
        {prefs.budget && (
          <div className="bg-white rounded-2xl p-4 pg-card-shadow">
            <p className="text-xs text-gray-400 mb-1">Budget Range</p>
            <p className="font-semibold text-gray-900">
              ₹{prefs.budget[0]?.toLocaleString("en-IN")} — ₹
              {prefs.budget[1]?.toLocaleString("en-IN")}/mo
            </p>
          </div>
        )}

        <button
          onClick={clear}
          className="w-full py-4 mt-4 rounded-2xl border-2 font-semibold"
          style={{ borderColor: "#ff6b6b", color: "#ff6b6b" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
