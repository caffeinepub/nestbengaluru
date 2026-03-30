import { useEffect, useState } from "react";
import type { PGListing } from "../../backend.d";
import PGCard from "../../components/PGCard";
import { Skeleton } from "../../components/ui/skeleton";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface Props {
  onPGSelect: (id: string) => void;
}

export default function WishlistPage({ onPGSelect }: Props) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [_savedIds, setSavedIds] = useState<string[]>([]);
  const [listings, setListings] = useState<(PGListing & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || !identity) return;
    actor
      .getUserWishlist(identity.getPrincipal())
      .then(async (ids) => {
        setSavedIds(ids);
        const allListings = await actor.getAllPGListings();
        const saved = allListings
          .map((l: any, i: number) => ({ ...l, id: l.id || `pg-${i}` }))
          .filter((l: any) => ids.includes(l.id));
        setListings(saved);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, identity]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-10 pb-4" style={{ background: "#3c4555" }}>
        <h1 className="text-xl font-bold text-white">Saved PGs</h1>
        <p className="text-white/60 text-sm">Your wishlist</p>
      </div>
      <div className="px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ddd"
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <p className="mt-4 text-gray-500 font-medium">No saved PGs yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Tap the heart icon on any PG to save it
            </p>
          </div>
        ) : (
          <div>
            {listings.map((l) => (
              <PGCard
                key={l.id}
                listing={l}
                onPress={() => onPGSelect(l.id)}
                isWishlisted={true}
                onWishlistToggle={() => {
                  setSavedIds((prev) => prev.filter((id) => id !== l.id));
                  setListings((prev) =>
                    prev.filter((item) => item.id !== l.id),
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
