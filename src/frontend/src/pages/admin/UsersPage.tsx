import { useEffect, useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { useActor } from "../../hooks/useActor";

export default function AdminUsers() {
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

  return (
    <div className="px-4 py-4">
      <div className="bg-white rounded-2xl p-4 pg-card-shadow mb-4">
        <h3 className="font-bold text-gray-800 mb-3">User Overview</h3>
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold" style={{ color: "#3c4555" }}>
              {Number(stats?.totalUsers || 0)}
            </span>
            <span className="text-gray-500">registered users</span>
          </div>
        )}
      </div>
      <div className="bg-blue-50 rounded-2xl p-4">
        <p className="text-sm text-blue-700 font-medium">ℹ️ User Management</p>
        <p className="text-xs text-blue-500 mt-1">
          Individual user profiles and management will be available in a future
          update. User registration and authentication is handled securely via
          Internet Identity.
        </p>
      </div>
    </div>
  );
}
