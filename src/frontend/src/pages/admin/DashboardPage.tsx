import { useEffect, useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { useActor } from "../../hooks/useActor";

export default function AdminDashboard() {
  const { actor } = useActor();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAnalytics()
      .then((s) => {
        setStats(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const cards = [
    {
      label: "Total Listings",
      value: stats ? Number(stats.totalListings) : 0,
      icon: "🏢",
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Pending Approval",
      value: stats ? Number(stats.pendingListings) : 0,
      icon: "⏳",
      bg: "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      label: "Verified",
      value: stats ? Number(stats.verifiedListings) : 0,
      icon: "✅",
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      label: "Total Users",
      value: stats ? Number(stats.totalUsers) : 0,
      icon: "👥",
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-2 gap-3 mb-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`${c.bg} rounded-2xl p-4 pg-card-shadow`}
          >
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <span className="text-2xl">{c.icon}</span>
                <p className={`text-3xl font-bold mt-2 ${c.color}`}>
                  {c.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{c.label}</p>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-4 pg-card-shadow">
        <h3 className="font-bold text-gray-800 mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total Reviews</span>
            <span className="font-semibold">
              {stats ? Number(stats.totalReviews) : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total Bookings</span>
            <span className="font-semibold">
              {stats ? Number(stats.totalBookings) : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
