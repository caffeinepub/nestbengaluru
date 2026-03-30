import { useEffect, useState } from "react";
import type { PGListing } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import type { BookingRecord } from "../../types";

interface Props {
  pgId: string;
  onDone: (record: BookingRecord) => void;
  onBack: () => void;
}

export default function BookingFlowPage({ pgId, onDone, onBack }: Props) {
  const { actor } = useActor();
  const [listing, setListing] = useState<PGListing | null>(null);
  const [step, setStep] = useState(0);
  const [roomType, setRoomType] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ref, setRef] = useState("");

  useEffect(() => {
    if (!actor) return;
    actor.getPGListing(pgId).then((l) => l && setListing(l));
  }, [actor, pgId]);

  const handleConfirm = () => {
    const bookingRef = `NBK${Math.floor(100000 + Math.random() * 900000)}`;
    setRef(bookingRef);
    setStep(2);
  };

  const handleDone = () => {
    onDone({
      ref,
      pgId,
      pgName: listing?.name || "",
      roomType,
      moveInDate,
      name,
      phone,
      createdAt: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col">
      {/* Header */}
      {step < 2 && (
        <div className="px-4 pt-10 pb-4" style={{ background: "#3c4555" }}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="text-white/80">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-white font-bold text-lg">Book PG</h1>
          </div>
          <div className="flex gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{
                  background: i <= step ? "#ff6b6b" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 px-4 pt-6">
        {/* Step 0: Room type */}
        {step === 0 && (
          <div>
            <p className="text-gray-500 mb-1">Step 1 of 2</p>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Select Room Type
            </h2>
            {listing?.sharingTypes?.map((type) => (
              <button
                key={type}
                onClick={() => setRoomType(type)}
                className={`w-full p-4 rounded-2xl border-2 text-left mb-3 transition-all ${
                  roomType === type
                    ? "border-[#ff6b6b] bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <p className="font-semibold text-gray-900">{type} Room</p>
                <p className="text-[#3c4555] font-bold mt-1">
                  ₹{Number(listing.price).toLocaleString("en-IN")}/mo
                </p>
              </button>
            )) ||
              ["Single", "Double", "Triple"].map((type) => (
                <button
                  key={type}
                  onClick={() => setRoomType(type)}
                  className={`w-full p-4 rounded-2xl border-2 text-left mb-3 transition-all ${
                    roomType === type
                      ? "border-[#ff6b6b] bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{type} Room</p>
                </button>
              ))}
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div>
            <p className="text-gray-500 mb-1">Step 2 of 2</p>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Your Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Move-in Date
                </label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff6b6b]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff6b6b]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff6b6b]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="flex flex-col items-center pt-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Booking Requested!
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              The PG owner will contact you shortly
            </p>

            <div className="w-full mt-8 bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Reference</span>
                <span className="font-bold" style={{ color: "#ff6b6b" }}>
                  {ref}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">PG</span>
                <span className="font-medium text-gray-800">
                  {listing?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Room Type</span>
                <span className="font-medium text-gray-800">{roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Move-in Date</span>
                <span className="font-medium text-gray-800">{moveInDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Contact</span>
                <span className="font-medium text-gray-800">{phone}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-4 pb-10 pt-4">
        {step === 0 && (
          <button
            disabled={!roomType}
            onClick={() => setStep(1)}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base"
            style={{ background: "#ff6b6b", opacity: !roomType ? 0.5 : 1 }}
          >
            Next
          </button>
        )}
        {step === 1 && (
          <button
            disabled={!moveInDate || !name || !phone}
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base"
            style={{
              background: "#ff6b6b",
              opacity: !moveInDate || !name || !phone ? 0.5 : 1,
            }}
          >
            Confirm Booking
          </button>
        )}
        {step === 2 && (
          <button
            onClick={handleDone}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base"
            style={{ background: "#3c4555" }}
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
}
