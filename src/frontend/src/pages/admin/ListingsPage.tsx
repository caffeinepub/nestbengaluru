import { useEffect, useState } from "react";
import type { PGListing } from "../../backend.d";
import { Skeleton } from "../../components/ui/skeleton";
import { useActor } from "../../hooks/useActor";

export default function AdminListings() {
  const { actor } = useActor();
  const [listings, setListings] = useState<(PGListing & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "all" | "verified">(
    "pending",
  );
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllPGListings()
      .then((res: any[]) => {
        setListings(res.map((l, i) => ({ ...l, id: l.id || `pg-${i}` })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const pending = listings.filter((l) => !l.verified);
  const verified = listings.filter((l) => l.verified);
  const shown =
    activeTab === "pending"
      ? pending
      : activeTab === "verified"
        ? verified
        : listings;

  const handleVerify = async (
    l: PGListing & { id: string },
    verify: boolean,
  ) => {
    if (!actor) return;
    setProcessing(l.id);
    try {
      await actor.updatePGListing(l.id, { ...l, verified: verify });
      setListings((prev) =>
        prev.map((item) =>
          item.id === l.id ? { ...item, verified: verify } : item,
        ),
      );
    } catch (e) {
      console.error(e);
    }
    setProcessing(null);
  };

  return (
    <div className="px-4 py-4">
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
        {(["pending", "all", "verified"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize ${
              activeTab === t
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            {t}{" "}
            {t === "pending"
              ? `(${pending.length})`
              : t === "verified"
                ? `(${verified.length})`
                : `(${listings.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No listings in this category
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl p-4 pg-card-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900">{l.name}</p>
                  <p className="text-xs text-gray-500">
                    {l.address?.area || l.city} • ₹
                    {Number(l.price).toLocaleString("en-IN")}/mo
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    l.verified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {l.verified ? "Verified" : "Pending"}
                </span>
              </div>
              {!l.verified && (
                <div className="flex gap-2 mt-3">
                  <button
                    disabled={processing === l.id}
                    onClick={() => handleVerify(l, true)}
                    className="flex-1 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold"
                  >
                    {processing === l.id ? "..." : "✓ Approve"}
                  </button>
                  <button
                    disabled={processing === l.id}
                    onClick={() => handleVerify(l, false)}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
              {l.verified && (
                <button
                  disabled={processing === l.id}
                  onClick={() => handleVerify(l, false)}
                  className="mt-2 text-xs text-red-500 font-medium"
                >
                  Revoke verification
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
