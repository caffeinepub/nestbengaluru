import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    foodRating: bigint;
    pgId: string;
    user: Principal;
    comment: string;
    timestamp: Time;
    safetyRating: bigint;
    rating: bigint;
    valueRating: bigint;
    cleanlinessRating: bigint;
}
export interface GeoLocation {
    latitude: number;
    longitude: number;
}
export interface PGListing {
    latitude: number;
    verified: boolean;
    foodIncluded: boolean;
    wifiSpeed: bigint;
    owner: Principal;
    city: string;
    name: string;
    acAvailable: boolean;
    description: string;
    deposit: bigint;
    amenities: Amenities;
    cleanlinessScore: number;
    availableBeds: bigint;
    longitude: number;
    address: Address;
    gender: string;
    rating: number;
    price: bigint;
    reviewCount: bigint;
    sharingTypes: Array<string>;
    foodScore: number;
    geoLocation?: GeoLocation;
    rooms: Array<RoomType>;
    images: Array<string>;
}
export type Time = bigint;
export interface Amenities {
    ac: boolean;
    gym: boolean;
    cleaning: boolean;
    food: boolean;
    wifi: boolean;
    security: boolean;
    powerBackup: boolean;
    parking: boolean;
    laundry: boolean;
    hotWater: boolean;
}
export interface Address {
    country: string;
    area: string;
    city: string;
    state: string;
    fullAddress: string;
    pincode: bigint;
}
export interface Booking {
    status: Variant_cancelled_pending_confirmed;
    name: string;
    pgId: string;
    user: Principal;
    phone: string;
    moveInDate: string;
    roomType: RoomType;
}
export interface RoomType {
    bedCount: bigint;
    deposit: bigint;
    availableBeds: bigint;
    price: bigint;
    roomType: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    address?: Address;
    gender?: string;
    phone?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_cancelled_pending_confirmed {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export interface backendInterface {
    addBooking(booking: Booking): Promise<{
        id: string;
        booking: Booking;
    }>;
    addPGListing(id: string, listing: PGListing): Promise<void>;
    addReview(review: Review): Promise<string>;
    addToWishlist(pgId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBooking(id: string): Promise<void>;
    deletePGListing(id: string): Promise<void>;
    deleteReview(id: string): Promise<void>;
    getAllPGListings(): Promise<Array<PGListing>>;
    getAnalytics(): Promise<{
        pendingListings: bigint;
        verifiedListings: bigint;
        totalBookings: bigint;
        totalListings: bigint;
        totalUsers: bigint;
        totalReviews: bigint;
    }>;
    getBooking(id: string): Promise<Booking | null>;
    getBookingsByPG(pgId: string): Promise<Array<Booking>>;
    getBookingsByUser(userId: Principal): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getPGListing(id: string): Promise<PGListing | null>;
    getPGListingsByAmenities(required: Amenities): Promise<Array<PGListing>>;
    getPGListingsByArea(area: string): Promise<Array<PGListing>>;
    getPGListingsByAreaAndGender(area: string, gender: string): Promise<Array<PGListing>>;
    getPGListingsByAreaAndSharingType(area: string, sharingType: string): Promise<Array<PGListing>>;
    getPGListingsByCity(city: string): Promise<Array<PGListing>>;
    getPGListingsByOwner(owner: Principal): Promise<Array<PGListing>>;
    getPGListingsByPriceRange(min: bigint, max: bigint): Promise<Array<PGListing>>;
    getPGListingsSortedByPrice(sortOrder: string): Promise<Array<PGListing>>;
    getPGListingsSortedByRating(sortOrder: string): Promise<Array<PGListing>>;
    getPGListingsWithAC(acAvailable: boolean): Promise<Array<PGListing>>;
    getPGListingsWithAvailableBeds(): Promise<Array<PGListing>>;
    getPGListingsWithFoodIncluded(foodIncluded: boolean): Promise<Array<PGListing>>;
    getPGListingsWithMinRating(minRating: number): Promise<Array<PGListing>>;
    getReviewsByUser(user: Principal): Promise<Array<Review>>;
    getReviewsForPG(pgId: string): Promise<Array<Review>>;
    getUserBookings(user: Principal): Promise<Array<Booking>>;
    getUserProfile(user: Principal): Promise<UserProfile>;
    getUserWishlist(user: Principal): Promise<Array<string>>;
    getVerifiedPGListings(): Promise<Array<PGListing>>;
    isCallerAdmin(): Promise<boolean>;
    removeFromWishlist(pgId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPGListings(searchText: string): Promise<Array<PGListing>>;
    updatePGListing(id: string, listing: PGListing): Promise<void>;
    updateUserProfile(user: Principal, profile: UserProfile): Promise<void>;
}
