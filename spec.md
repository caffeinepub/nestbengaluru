# NestBengaluru — PG Discovery & Booking App

## Current State
New project. Empty ICP backend (main.mo scaffold only). No frontend yet.

## Requested Changes (Diff)

### Add
- 3-role system: User (PG Seeker), Owner (PG Provider), Admin
- Role-based auth using Authorization component
- Blob storage for owner PG photo uploads
- Full Motoko backend: PG listings, reviews, wishlist, owner management, admin controls
- Seeded mock data: 8–10 realistic Bengaluru PG listings across HSR Layout, Koramangala, Whitefield, Electronic City
- User Panel: home feed, filters, PG detail, wishlist, booking confirmation flow, reviews
- Owner Panel: add/edit PG, upload photos, manage availability
- Admin Panel: approve/reject listings, verify badge, user list, analytics

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan

### Backend (Motoko)
1. PG Listing type: id, name, area, address, lat, lng, price/month, deposit, sharingTypes[], amenities[], images[] (blob URLs), rating, reviewCount, ownerId, status (pending/approved/rejected), verified flag, bedsAvailable
2. Review type: id, pgId, userId, foodRating, cleanlinessRating, safetyRating, valueRating, comment, timestamp
3. Wishlist: per-user set of pgIds
4. Owner operations: createListing, updateListing, uploadImage (via blob), toggleAvailability
5. User operations: getListings (with filters), getListing, addToWishlist, removeFromWishlist, submitReview
6. Admin operations: approveListing, rejectListing, verifyListing, getUsers, getAnalytics
7. Seed data: 8–10 PGs with realistic Bengaluru details

### Frontend (React + Tailwind)
1. Auth flow: login page → role selection (User / Owner) → onboarding (user type, preferred areas, budget)
2. Role-based routing: User app / Owner dashboard / Admin panel
3. User home: location header, search bar, horizontal filter chips, PG card list, map placeholder toggle
4. PG card: cover image, name, area, price, rating, amenity tags
5. PG detail page: swipeable image gallery, info sections, amenities grid, food/cleanliness/WiFi scores, commute times, CTA buttons (Book Visit, Request Callback, Reserve Bed)
6. Wishlist page: saved PGs grid with compare option
7. Booking flow: room type → move-in date → details → confirmation screen
8. Reviews: rating form with 4 dimensions
9. Owner dashboard: listings list, add/edit form with image upload
10. Admin panel: pending listings queue, verified badge toggle, user list, stats cards
11. Design: primary #3c4555, accent #ff6b6b, mobile-first max-w-md centered, Airbnb-style cards, skeleton loaders
