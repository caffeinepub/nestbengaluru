export type AppPage =
  | { name: "home" }
  | { name: "detail"; pgId: string }
  | { name: "wishlist" }
  | { name: "bookings" }
  | { name: "profile" }
  | { name: "booking-flow"; pgId: string }
  | { name: "owner-listings" }
  | { name: "owner-add" }
  | { name: "owner-edit"; pgId: string }
  | { name: "admin-dashboard" }
  | { name: "admin-listings" }
  | { name: "admin-users" };

export type UserRole = "user" | "owner" | "admin";

export interface BookingRecord {
  ref: string;
  pgId: string;
  pgName: string;
  roomType: string;
  moveInDate: string;
  name: string;
  phone: string;
  createdAt: number;
}
