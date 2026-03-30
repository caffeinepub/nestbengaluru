import { useState } from "react";
import type { PGListing } from "../backend.d";

interface Props {
  listing: PGListing & { id: string };
  onPress: () => void;
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
}

const amenityLabels: Record<string, string> = {
  wifi: "WiFi",
  food: "Food",
  ac: "AC",
  laundry: "Laundry",
  security: "Security",
  parking: "Parking",
  gym: "Gym",
  powerBackup: "Power Backup",
};

export default function PGCard({
  listing,
  onPress,
  isWishlisted,
  onWishlistToggle,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const seed = listing.name.replace(/\s+/g, "-").toLowerCase();
  const imgSrc =
    !imgError && listing.images && listing.images[0]
      ? listing.images[0]
      : `https://picsum.photos/seed/${seed}/400/220`;

  const activeAmenities = Object.entries(listing.amenities || {})
    .filter(([, v]) => v === true)
    .map(([k]) => amenityLabels[k])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden pg-card-shadow mb-4 cursor-pointer active:scale-[0.99] transition-transform"
      onClick={onPress}
    >
      <div className="relative">
        <img
          src={imgSrc}
          alt={listing.name}
          className="w-full h-44 object-cover"
          onError={() => setImgError(true)}
        />
        {listing.verified && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2 2 4-4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Verified
          </span>
        )}
        <button
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.();
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#ff6b6b" : "none"}
            stroke={isWishlisted ? "#ff6b6b" : "#666"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-[15px] leading-tight">
              {listing.name}
            </h3>
            <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full mt-1">
              {listing.address?.area || listing.city}
            </span>
          </div>
          <div className="text-right ml-2">
            <p className="font-bold text-[15px]" style={{ color: "#3c4555" }}>
              ₹{Number(listing.price).toLocaleString("en-IN")}
              <span className="text-xs font-normal text-gray-400">/mo</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="#f59e0b"
            stroke="none"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">
            {listing.rating?.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            ({Number(listing.reviewCount)} reviews)
          </span>
        </div>
        {activeAmenities.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {activeAmenities.map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
