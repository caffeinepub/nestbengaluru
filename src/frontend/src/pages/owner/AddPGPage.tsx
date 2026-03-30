import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useRef, useState } from "react";
import { loadConfig } from "../../config";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { StorageClient } from "../../utils/StorageClient";

const AREAS = [
  "HSR Layout",
  "Koramangala",
  "Whitefield",
  "Electronic City",
  "Indiranagar",
  "BTM Layout",
];

interface Props {
  editPgId: string | null;
  onDone: () => void;
}

export default function AddPGPage({ editPgId, onDone }: Props) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [sharingTypes, setSharingTypes] = useState<string[]>([]);
  const [gender, setGender] = useState("CoLiving");
  const [foodIncluded, setFoodIncluded] = useState(false);
  const [acAvailable, setAcAvailable] = useState(false);
  const [wifiSpeed, setWifiSpeed] = useState("50");
  const [amenityKeys, setAmenityKeys] = useState<string[]>(["wifi"]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const AMENITY_LIST = [
    { key: "wifi", label: "WiFi" },
    { key: "food", label: "Food" },
    { key: "ac", label: "AC" },
    { key: "laundry", label: "Laundry" },
    { key: "security", label: "Security" },
    { key: "parking", label: "Parking" },
    { key: "gym", label: "Gym" },
    { key: "powerBackup", label: "Power Backup" },
    { key: "hotWater", label: "Hot Water" },
    { key: "cleaning", label: "Cleaning" },
  ];

  const toggleSharing = (type: string) => {
    setSharingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleAmenity = (key: string) => {
    setAmenityKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !identity) return;
    try {
      setUploadProgress(0);
      const config = await loadConfig();
      const agent = await HttpAgent.create({
        host: config.backend_host,
        identity,
      });
      const client = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, (pct) =>
        setUploadProgress(pct),
      );
      const url = await client.getDirectURL(hash);
      setImageUrls((prev) => [...prev, url]);
      setUploadProgress(null);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadProgress(null);
    }
  };

  const buildAmenities = () => ({
    wifi: amenityKeys.includes("wifi"),
    food: foodIncluded,
    ac: acAvailable,
    laundry: amenityKeys.includes("laundry"),
    security: amenityKeys.includes("security"),
    parking: amenityKeys.includes("parking"),
    gym: amenityKeys.includes("gym"),
    powerBackup: amenityKeys.includes("powerBackup"),
    hotWater: amenityKeys.includes("hotWater"),
    cleaning: amenityKeys.includes("cleaning"),
  });

  const handleSubmit = async () => {
    if (!actor || !identity || !name || !area || !price) return;
    setSubmitting(true);
    try {
      const id = crypto.randomUUID();
      await actor.addPGListing(id, {
        name,
        city: "Bengaluru",
        description: "",
        address: {
          area,
          fullAddress: address,
          city: "Bengaluru",
          state: "Karnataka",
          country: "India",
          pincode: BigInt(560001),
        },
        latitude: 12.9716,
        longitude: 77.5946,
        price: BigInt(price),
        deposit: BigInt(deposit || "0"),
        sharingTypes,
        amenities: buildAmenities(),
        images: imageUrls,
        rating: 0,
        reviewCount: BigInt(0),
        owner: identity.getPrincipal(),
        verified: false,
        availableBeds: BigInt(1),
        foodIncluded,
        acAvailable,
        gender,
        wifiSpeed: BigInt(wifiSpeed || "50"),
        cleanlinessScore: 0,
        foodScore: 0,
        rooms: sharingTypes.map((t) => ({
          roomType: t,
          price: BigInt(price),
          deposit: BigInt(deposit || "0"),
          bedCount: BigInt(t === "Single" ? 1 : t === "Double" ? 2 : 3),
          availableBeds: BigInt(1),
        })),
      });
      onDone();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-full overflow-y-auto">
      <div className="px-4 pt-10 pb-4" style={{ background: "#3c4555" }}>
        <h1 className="text-xl font-bold text-white">
          {editPgId ? "Edit PG" : "Add New PG"}
        </h1>
      </div>

      <div className="px-4 py-4 space-y-5 pb-10">
        {/* Basic info */}
        <div className="bg-white rounded-2xl p-4 pg-card-shadow">
          <h3 className="font-bold text-gray-800 mb-3">Basic Info</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">PG Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunshine PG"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 outline-none focus:border-[#ff6b6b]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Area *</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 outline-none focus:border-[#ff6b6b] bg-white"
              >
                <option value="">Select area</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Full Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House no, street, landmark"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 outline-none focus:border-[#ff6b6b]"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-4 pg-card-shadow">
          <h3 className="font-bold text-gray-800 mb-3">Pricing</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Price/month (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9500"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 outline-none focus:border-[#ff6b6b]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="19000"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 outline-none focus:border-[#ff6b6b]"
              />
            </div>
          </div>
        </div>

        {/* Room types & Gender */}
        <div className="bg-white rounded-2xl p-4 pg-card-shadow">
          <h3 className="font-bold text-gray-800 mb-3">Room & Gender</h3>
          <p className="text-xs text-gray-500 mb-2">Sharing types</p>
          <div className="flex gap-2 mb-4">
            {["Single", "Double", "Triple"].map((t) => (
              <button
                key={t}
                onClick={() => toggleSharing(t)}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium ${
                  sharingTypes.includes(t)
                    ? "bg-[#ff6b6b] border-[#ff6b6b] text-white"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-2">For</p>
          <div className="flex gap-2">
            {["Male", "Female", "CoLiving"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium ${
                  gender === g
                    ? "bg-[#3c4555] border-[#3c4555] text-white"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {g === "CoLiving" ? "Co-living" : g}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities toggles */}
        <div className="bg-white rounded-2xl p-4 pg-card-shadow">
          <h3 className="font-bold text-gray-800 mb-3">
            Amenities & Facilities
          </h3>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Food Included</span>
            <button
              onClick={() => setFoodIncluded(!foodIncluded)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                foodIncluded ? "bg-[#ff6b6b]" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  foodIncluded ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">AC Available</span>
            <button
              onClick={() => setAcAvailable(!acAvailable)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                acAvailable ? "bg-[#ff6b6b]" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  acAvailable ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">WiFi Speed (Mbps)</p>
            <input
              type="number"
              value={wifiSpeed}
              onChange={(e) => setWifiSpeed(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#ff6b6b]"
            />
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Other amenities</p>
            <div className="flex flex-wrap gap-2">
              {AMENITY_LIST.filter(
                (a) => !["wifi", "food", "ac"].includes(a.key),
              ).map((a) => (
                <button
                  key={a.key}
                  onClick={() => toggleAmenity(a.key)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                    amenityKeys.includes(a.key)
                      ? "bg-[#3c4555] border-[#3c4555] text-white"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl p-4 pg-card-shadow">
          <h3 className="font-bold text-gray-800 mb-3">Photos</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadProgress !== null}
            className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 flex items-center justify-center gap-2"
          >
            {uploadProgress !== null ? (
              <span>Uploading... {uploadProgress}%</span>
            ) : (
              <>
                <span className="text-xl">📷</span> Upload Photo
              </>
            )}
          </button>
          {imageUrls.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  <button
                    onClick={() =>
                      setImageUrls((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !name || !area || !price}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base"
          style={{
            background: "#ff6b6b",
            opacity: !name || !area || !price ? 0.5 : 1,
          }}
        >
          {submitting
            ? "Saving..."
            : editPgId
              ? "Update Listing"
              : "Submit for Approval"}
        </button>
      </div>
    </div>
  );
}
