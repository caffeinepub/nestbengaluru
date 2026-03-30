import { useEffect, useState } from "react";
import type { PGListing, Review } from "../../backend.d";
import { Skeleton } from "../../components/ui/skeleton";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface Props {
  pgId: string;
  onBack: () => void;
  onBook: () => void;
}

const COMMUTE_TIMES: Record<
  string,
  { park: string; time: string; mode: string }[]
> = {
  "HSR Layout": [
    { park: "Manyata Tech Park", time: "~45 min", mode: "auto" },
    { park: "Bagmane Tech Park", time: "~30 min", mode: "metro" },
    { park: "Prestige Tech Park", time: "~20 min", mode: "auto" },
    { park: "ITPL Whitefield", time: "~50 min", mode: "bus" },
  ],
  Koramangala: [
    { park: "Manyata Tech Park", time: "~40 min", mode: "auto" },
    { park: "Bagmane Tech Park", time: "~25 min", mode: "auto" },
    { park: "Prestige Tech Park", time: "~15 min", mode: "auto" },
    { park: "ITPL Whitefield", time: "~55 min", mode: "bus" },
  ],
  Whitefield: [
    { park: "Manyata Tech Park", time: "~60 min", mode: "bus" },
    { park: "Bagmane Tech Park", time: "~45 min", mode: "bus" },
    { park: "Prestige Tech Park", time: "~35 min", mode: "auto" },
    { park: "ITPL Whitefield", time: "~15 min", mode: "walk" },
  ],
  "Electronic City": [
    { park: "Manyata Tech Park", time: "~70 min", mode: "bus" },
    { park: "Bagmane Tech Park", time: "~55 min", mode: "bus" },
    { park: "Prestige Tech Park", time: "~40 min", mode: "auto" },
    { park: "ITPL Whitefield", time: "~60 min", mode: "bus" },
  ],
};

const DEFAULT_COMMUTE = [
  { park: "Manyata Tech Park", time: "~45 min", mode: "auto" },
  { park: "Bagmane Tech Park", time: "~35 min", mode: "metro" },
  { park: "Prestige Tech Park", time: "~30 min", mode: "auto" },
  { park: "ITPL Whitefield", time: "~45 min", mode: "bus" },
];

const AMENITY_ICONS: Record<string, string> = {
  wifi: "📡",
  food: "🍽️",
  ac: "❄️",
  laundry: "🧳",
  security: "🔒",
  parking: "🚗",
  gym: "🏃",
  powerBackup: "⚡",
  hotWater: "🚰",
  cleaning: "🧹",
};

const AMENITY_LABELS: Record<string, string> = {
  wifi: "WiFi",
  food: "Food",
  ac: "AC",
  laundry: "Laundry",
  security: "Security",
  parking: "Parking",
  gym: "Gym",
  powerBackup: "Power Backup",
  hotWater: "Hot Water",
  cleaning: "Cleaning",
};

function ReviewFormModal({
  pgId,
  onClose,
}: { pgId: string; onClose: () => void }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [food, setFood] = useState(4);
  const [clean, setClean] = useState(4);
  const [safety, setSafety] = useState(4);
  const [value, setValue] = useState(4);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!actor || !identity) return;
    setSubmitting(true);
    try {
      await actor.addReview({
        pgId,
        user: identity.getPrincipal(),
        foodRating: BigInt(food),
        cleanlinessRating: BigInt(clean),
        safetyRating: BigInt(safety),
        valueRating: BigInt(value),
        rating: BigInt(Math.round((food + clean + safety + value) / 4)),
        comment,
        timestamp: BigInt(Date.now()),
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const RatingRow = ({
    label,
    val,
    set,
  }: { label: string; val: number; set: (n: number) => void }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => set(n)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={n <= val ? "#f59e0b" : "#e5e7eb"}
              stroke="none"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg mb-4">Write a Review</h3>
        <RatingRow label="🍛 Food" val={food} set={setFood} />
        <RatingRow label="🧹 Cleanliness" val={clean} set={setClean} />
        <RatingRow label="🔒 Safety" val={safety} set={setSafety} />
        <RatingRow label="💰 Value for Money" val={value} set={setValue} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full border border-gray-200 rounded-xl p-3 text-sm mt-3 outline-none resize-none"
          rows={3}
        />
        <button
          onClick={submit}
          disabled={submitting || !comment}
          className="mt-4 w-full py-3 rounded-xl text-white font-semibold"
          style={{ background: "#ff6b6b", opacity: !comment ? 0.5 : 1 }}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}

export default function PGDetailPage({ pgId, onBack, onBook }: Props) {
  const { actor } = useActor();
  const [listing, setListing] = useState<(PGListing & { id: string }) | null>(
    null,
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!actor) return;
    Promise.all([actor.getPGListing(pgId), actor.getReviewsForPG(pgId)])
      .then(([l, r]) => {
        if (l) setListing({ ...l, id: pgId });
        setReviews(r || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, pgId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto">
        <Skeleton className="w-full h-64" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">PG not found</p>
      </div>
    );
  }

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : [
          `https://picsum.photos/seed/${listing.name.replace(/\s+/g, "-")}/800/500`,
          `https://picsum.photos/seed/${listing.name.replace(/\s+/g, "-")}2/800/500`,
          `https://picsum.photos/seed/${listing.name.replace(/\s+/g, "-")}3/800/500`,
        ];

  const area = listing.address?.area || listing.city || "";
  const commuteTimes = COMMUTE_TIMES[area] || DEFAULT_COMMUTE;
  const amenities = listing.amenities || ({} as Record<string, boolean>);

  const scoreBar = (score: number, max = 5) => (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div
        className="h-1.5 rounded-full"
        style={{ width: `${(score / max) * 100}%`, background: "#ff6b6b" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto pb-24">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 max-w-md mx-auto px-4 pt-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex gap-2">
          <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#333"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={wishlisted ? "#ff6b6b" : "none"}
              stroke={wishlisted ? "#ff6b6b" : "#333"}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative overflow-hidden" style={{ height: 280 }}>
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${imgIndex * 100}%)` }}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={listing.name}
              className="w-full flex-shrink-0 object-cover"
              style={{ height: 280 }}
            />
          ))}
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIndex(i)}
              className="rounded-full transition-all"
              style={{
                width: i === imgIndex ? 20 : 6,
                height: 6,
                background: i === imgIndex ? "white" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
        {listing.verified && (
          <span className="absolute top-14 left-4 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{listing.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {listing.address?.fullAddress || area}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-xl">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#f59e0b"
              stroke="none"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-bold text-amber-600">
              {listing.rating?.toFixed(1)}
            </span>
            <span className="text-amber-500 text-xs">
              ({Number(listing.reviewCount)})
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onBook}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: "#ff6b6b" }}
          >
            Book Visit
          </button>
          <button
            className="flex-1 py-3 rounded-xl font-semibold text-sm border-2"
            style={{ borderColor: "#3c4555", color: "#3c4555" }}
          >
            Request Callback
          </button>
        </div>

        <div className="mt-5 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color: "#3c4555" }}>
              ₹{Number(listing.price).toLocaleString("en-IN")}
            </span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Security deposit: ₹{Number(listing.deposit).toLocaleString("en-IN")}
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {listing.sharingTypes?.map((t) => (
              <span
                key={t}
                className="bg-white border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-full"
              >
                {t} room
              </span>
            ))}
            <span className="bg-white border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-full">
              {listing.gender}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="font-bold text-gray-900 mb-3">Amenities</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(amenities).map(([key, val]) => (
              <div
                key={key}
                className={`flex flex-col items-center p-2.5 rounded-xl ${val ? "bg-green-50" : "bg-gray-50 opacity-50"}`}
              >
                <span className="text-xl">{AMENITY_ICONS[key] || "📦"}</span>
                <span
                  className={`text-xs mt-1 font-medium ${val ? "text-green-700" : "text-gray-400"}`}
                >
                  {AMENITY_LABELS[key] || key}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="font-bold text-gray-900 mb-3">Quality Scores</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-orange-50 p-3 rounded-2xl">
              <span className="text-lg">🍛</span>
              <p className="text-xs text-gray-500 mt-1">Food</p>
              <p className="font-bold text-gray-800">
                {listing.foodScore?.toFixed(1)}
                <span className="text-xs font-normal text-gray-400">/5</span>
              </p>
              {scoreBar(listing.foodScore || 0)}
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl">
              <span className="text-lg">🧹</span>
              <p className="text-xs text-gray-500 mt-1">Cleanliness</p>
              <p className="font-bold text-gray-800">
                {listing.cleanlinessScore?.toFixed(1)}
                <span className="text-xs font-normal text-gray-400">/5</span>
              </p>
              {scoreBar(listing.cleanlinessScore || 0)}
            </div>
            <div className="bg-purple-50 p-3 rounded-2xl">
              <span className="text-lg">📡</span>
              <p className="text-xs text-gray-500 mt-1">WiFi</p>
              <p className="font-bold text-gray-800">
                {Number(listing.wifiSpeed)}
                <span className="text-xs font-normal text-gray-400"> Mbps</span>
              </p>
              {scoreBar(Math.min(Number(listing.wifiSpeed), 100), 100)}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="font-bold text-gray-900 mb-3">
            🚗 Commute to IT Parks
          </h3>
          <div className="space-y-2">
            {commuteTimes.map((c) => (
              <div
                key={c.park}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <span className="text-sm text-gray-700 font-medium">
                  {c.park}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">{c.mode}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#3c4555" }}
                  >
                    {c.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">
              Reviews ({reviews.length || Number(listing.reviewCount)})
            </h3>
            <button
              onClick={() => setShowReviewForm(true)}
              className="text-xs font-semibold"
              style={{ color: "#ff6b6b" }}
            >
              + Add Review
            </button>
          </div>
          {reviews.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-gray-400 text-sm">
                Be the first to review this PG
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                      R
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Resident
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs text-gray-400">
                      🍛 {Number(r.foodRating)}/5
                    </span>
                    <span className="text-xs text-gray-400">
                      🧹 {Number(r.cleanlinessRating)}/5
                    </span>
                    <span className="text-xs text-gray-400">
                      🔒 {Number(r.safetyRating)}/5
                    </span>
                    <span className="text-xs text-gray-400">
                      💰 {Number(r.valueRating)}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-3 bottom-nav-shadow">
        <div className="flex items-center gap-3">
          <p className="text-lg font-bold" style={{ color: "#3c4555" }}>
            ₹{Number(listing.price).toLocaleString("en-IN")}
            <span className="text-sm font-normal text-gray-400">/mo</span>
          </p>
          <button
            onClick={onBook}
            className="flex-1 py-3 rounded-xl text-white font-semibold"
            style={{ background: "#ff6b6b" }}
          >
            Reserve Bed
          </button>
        </div>
      </div>

      {showReviewForm && (
        <ReviewFormModal pgId={pgId} onClose={() => setShowReviewForm(false)} />
      )}
    </div>
  );
}
