import { useEffect, useState } from "react";
import type { PGListing } from "../../backend.d";
import { Skeleton } from "../../components/ui/skeleton";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface Props {
  onEdit: (id: string) => void;
}

export default function MyListingsPage({ onEdit }: Props) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [listings, setListings] = useState<(PGListing & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || !identity) return;
    actor
      .getPGListingsByOwner(identity.getPrincipal())
      .then((res: any[]) => {
        setListings(res.map((l, i) => ({ ...l, id: l.id || `pg-${i}` })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, identity]);

  return (
    <div className="flex flex-col min-h-full overflow-y-auto">
      <div className="px-4 pt-10 pb-4" style={{ background: "#3c4555" }}>
        <h1 className="text-xl font-bold text-white">My PG Listings</h1>
        <p className="text-white/60 text-sm">
          {listings.length} listing{listings.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-5xl">🏢</span>
            <p className="mt-4 text-gray-500 font-medium">No listings yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Add your first PG to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-2xl p-4 pg-card-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{l.name}</p>
                    <p className="text-sm text-gray-500">
                      {l.address?.area || l.city}
                    </p>
                    <p
                      className="font-semibold mt-1"
                      style={{ color: "#3c4555" }}
                    >
                      ₹{Number(l.price).toLocaleString("en-IN")}/mo
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        l.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {l.verified ? "Verified" : "Pending"}
                    </span>
                    <button
                      onClick={() => onEdit(l.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium border border-gray-200 text-gray-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
