import type { BookingRecord } from "../../types";

interface Props {
  bookings: BookingRecord[];
}

export default function BookingsPage({ bookings }: Props) {
  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-10 pb-4" style={{ background: "#3c4555" }}>
        <h1 className="text-xl font-bold text-white">My Bookings</h1>
        <p className="text-white/60 text-sm">Your visit requests</p>
      </div>
      <div className="px-4 py-4">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-5xl">📅</span>
            <p className="mt-4 text-gray-500 font-medium">No bookings yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Book a visit to your favorite PG
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.ref}
                className="bg-white rounded-2xl p-4 pg-card-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{b.pgName}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {b.roomType} Room • {b.moveInDate}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    Requested
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                  <span className="text-xs text-gray-400">
                    Ref:{" "}
                    <span className="font-bold text-[#ff6b6b]">{b.ref}</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
