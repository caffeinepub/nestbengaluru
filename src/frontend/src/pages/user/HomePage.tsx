import { useEffect, useMemo, useState } from "react";
import type { PGListing } from "../../backend.d";
import PGCard from "../../components/PGCard";
import { Skeleton } from "../../components/ui/skeleton";
import { useActor } from "../../hooks/useActor";

interface Props {
  onPGSelect: (id: string) => void;
}

type ListingWithId = PGListing & { id: string };

const FILTERS = [
  { key: "single", label: "Single" },
  { key: "double", label: "Double" },
  { key: "triple", label: "Triple" },
  { key: "food", label: "Food Included" },
  { key: "ac", label: "AC" },
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
  { key: "coliving", label: "Co-living" },
];

export default function HomePage({ onPGSelect }: Props) {
  const { actor } = useActor();
  const [listings, setListings] = useState<ListingWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(20000);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllPGListings()
      .then((res) => {
        const withIds = res.map((l: any, i: number) => ({
          ...l,
          id: l.id || `pg-${i}`,
        }));
        setListings(withIds);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  useEffect(() => {
    if (!actor) return;
    actor
      .getCallerUserRole()
      .then(() => {
        // load wishlist
      })
      .catch(() => {});
  }, [actor]);

  const toggleFilter = (key: string) => {
    if (key === "budget") {
      setBudgetOpen(true);
      return;
    }
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.name.toLowerCase().includes(q) &&
          !(l.address?.area || "").toLowerCase().includes(q)
        )
          return false;
      }
      if (Number(l.price) > maxBudget) return false;
      if (activeFilters.has("food") && !l.foodIncluded) return false;
      if (activeFilters.has("ac") && !l.acAvailable) return false;
      if (activeFilters.has("male") && l.gender !== "Male") return false;
      if (activeFilters.has("female") && l.gender !== "Female") return false;
      if (activeFilters.has("coliving") && l.gender !== "CoLiving")
        return false;
      if (activeFilters.has("single") && !l.sharingTypes?.includes("Single"))
        return false;
      if (activeFilters.has("double") && !l.sharingTypes?.includes("Double"))
        return false;
      if (activeFilters.has("triple") && !l.sharingTypes?.includes("Triple"))
        return false;
      return true;
    });
  }, [listings, search, activeFilters, maxBudget]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-10 pb-3" style={{ background: "#3c4555" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-white/60 text-sm">📍</span>
            <span className="text-white font-semibold text-base">
              Bengaluru
            </span>
            <span className="text-white/60 text-xs">▾</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
          </div>
        </div>
        {/* Search */}
        <div className="relative mb-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search PGs by area, company, or landmark"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setBudgetOpen(true)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              maxBudget < 20000
                ? "bg-[#ff6b6b] border-[#ff6b6b] text-white"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Budget
            {maxBudget < 20000 ? `: ≤₹${(maxBudget / 1000).toFixed(0)}k` : ""}
          </button>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => toggleFilter(f.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                activeFilters.has(f.key)
                  ? "bg-[#ff6b6b] border-[#ff6b6b] text-white"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content header */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">
          {filtered.length} PGs found
        </span>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 text-xs font-medium ${
              viewMode === "list" ? "text-white" : "text-gray-500 bg-white"
            }`}
            style={viewMode === "list" ? { background: "#3c4555" } : {}}
          >
            ☰ List
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1.5 text-xs font-medium ${
              viewMode === "map" ? "text-white" : "text-gray-500 bg-white"
            }`}
            style={viewMode === "map" ? { background: "#3c4555" } : {}}
          >
            🗺 Map
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 pb-4">
        {viewMode === "map" ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#f0f2f5", height: 400, position: "relative" }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 400"
              style={{ position: "absolute", inset: 0 }}
            >
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((x) => (
                <line
                  key={x}
                  x1={x * 400}
                  y1="0"
                  x2={x * 400}
                  y2="400"
                  stroke="#ddd"
                  strokeWidth="1"
                />
              ))}
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y * 400}
                  x2="400"
                  y2={y * 400}
                  stroke="#ddd"
                  strokeWidth="1"
                />
              ))}
              {filtered.slice(0, 8).map((l, i) => {
                const x = ((i * 53 + 60) % 340) + 30;
                const y = ((i * 79 + 60) % 300) + 50;
                return (
                  <g
                    key={l.id}
                    onClick={() => onPGSelect(l.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle cx={x} cy={y} r="14" fill="#ff6b6b" opacity="0.9" />
                    <text
                      x={x}
                      y={y + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      ₹{Math.round(Number(l.price) / 1000)}k
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="bg-white/90 text-gray-500 text-xs px-3 py-1.5 rounded-full">
                Map view — tap pins to view PG
              </span>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-44" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🏠</span>
            <p className="mt-4 text-gray-500">
              No PGs found matching your filters
            </p>
            <button
              onClick={() => {
                setActiveFilters(new Set());
                setSearch("");
              }}
              className="mt-3 text-sm"
              style={{ color: "#ff6b6b" }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="pt-2">
            {filtered.map((l) => (
              <PGCard
                key={l.id}
                listing={l}
                onPress={() => onPGSelect(l.id)}
                isWishlisted={wishlist.has(l.id)}
                onWishlistToggle={() => toggleWishlist(l.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Budget Modal */}
      {budgetOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setBudgetOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4">Max Monthly Budget</h3>
            <div
              className="text-3xl font-bold mb-4"
              style={{ color: "#3c4555" }}
            >
              ₹{maxBudget.toLocaleString("en-IN")}
            </div>
            <input
              type="range"
              min={3000}
              max={20000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#ff6b6b]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹3,000</span>
              <span>₹20,000</span>
            </div>
            <button
              onClick={() => setBudgetOpen(false)}
              className="mt-5 w-full py-3 rounded-xl text-white font-semibold"
              style={{ background: "#ff6b6b" }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
