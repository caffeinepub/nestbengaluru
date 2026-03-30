import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Data Types

  type Address = {
    area : Text;
    city : Text;
    state : Text;
    country : Text;
    pincode : Nat;
    fullAddress : Text;
  };

  type Amenities = {
    wifi : Bool;
    laundry : Bool;
    parking : Bool;
    food : Bool;
    cleaning : Bool;
    security : Bool;
    ac : Bool;
    gym : Bool;
    hotWater : Bool;
    powerBackup : Bool;
  };

  type GeoLocation = {
    latitude : Float;
    longitude : Float;
  };

  type RoomType = {
    roomType : Text;
    bedCount : Nat;
    price : Nat;
    availableBeds : Nat;
    deposit : Nat;
  };

  type PGListing = {
    owner : Principal;
    name : Text;
    address : Address;
    amenities : Amenities;
    images : [Text];
    description : Text;
    price : Nat;
    deposit : Nat;
    sharingTypes : [Text];
    rating : Float;
    reviewCount : Nat;
    city : Text;
    availableBeds : Nat;
    foodIncluded : Bool;
    acAvailable : Bool;
    gender : Text;
    latitude : Float;
    longitude : Float;
    wifiSpeed : Nat;
    cleanlinessScore : Float;
    foodScore : Float;
    rooms : [RoomType];
    geoLocation : ?GeoLocation;
    verified : Bool;
  };

  module PGListing {
    public func compareByPrice(p1 : PGListing, p2 : PGListing) : Order.Order {
      Nat.compare(p1.price, p2.price);
    };

    public func compareByRating(p1 : PGListing, p2 : PGListing) : Order.Order {
      if (p1.rating < p2.rating) { return #less };
      if (p1.rating > p2.rating) { return #greater };
      #equal;
    };
  };

  type Review = {
    pgId : Text;
    user : Principal;
    rating : Nat;
    foodRating : Nat;
    cleanlinessRating : Nat;
    safetyRating : Nat;
    valueRating : Nat;
    comment : Text;
    timestamp : Time.Time;
  };

  type Booking = {
    user : Principal;
    pgId : Text;
    roomType : RoomType;
    moveInDate : Text;
    name : Text;
    phone : Text;
    status : { #confirmed; #pending; #cancelled };
  };

  public type UserProfile = {
    name : Text;
    phone : ?Text;
    email : ?Text;
    gender : ?Text;
    address : ?Address;
  };

  type Provider = {
    user : Principal;
    pgId : Text;
    name : Text;
    phone : Text;
    address : Address;
    pincode : Nat;
  };

  type BookingStatus = {
    status : { #confirmed; #pending; #cancelled };
    updatedBy : Principal;
    updatedAt : Time.Time;
    comment : ?Text;
  };

  type Wallet = {
    user : Principal;
    balance : Nat;
    lastUpdated : Time.Time;
    transactions : [Transaction];
  };

  type Transaction = {
    id : Text;
    walletId : Text;
    amount : Nat;
    type_ : { #deposit; #withdrawal; #refund };
    timestamp : Time.Time;
    description : ?Text;
  };

  type TransactionType = {
    #deposit;
    #withdrawal;
    #transfer;
    #refund;
  };

  var bookingIdCounter = 0;
  func generateBookingId() : Text {
    bookingIdCounter += 1;
    "BOOKING-" # bookingIdCounter.toText();
  };

  var reviewIdCounter = 0;
  func generateReviewId() : Text {
    reviewIdCounter += 1;
    "REVIEW-" # reviewIdCounter.toText();
  };

  // Persistent Storage
  let pgListings = Map.empty<Text, PGListing>();
  let reviews = Map.empty<Text, Review>();
  let bookings = Map.empty<Text, Booking>();
  let users = Map.empty<Principal, UserProfile>();
  let wishlists = Map.empty<Principal, List.List<Text>>();
  let bookingStatuses = Map.empty<Text, BookingStatus>();
  let bookingTransactions = Map.empty<Text, Transaction>();
  let wallets = Map.empty<Principal, Wallet>();
  let transactionHistory = Map.empty<Principal, List.List<Transaction>>();

  // Half PG Stays Functions

  public shared ({ caller }) func addPGListing(id : Text, listing : PGListing) : async () {
    pgListings.add(id, listing);
  };

  public query ({ caller }) func getPGListing(id : Text) : async ?PGListing {
    pgListings.get(id);
  };

  public query ({ caller }) func getAllPGListings() : async [PGListing] {
    pgListings.values().toArray();
  };

  public query ({ caller }) func searchPGListings(searchText : Text) : async [PGListing] {
    let searchTextLower = searchText.toLower();
    pgListings.values().toArray().filter(
      func(listing) {
        listing.address.area.toLower().contains(#text searchTextLower) or
        listing.name.toLower().contains(#text searchTextLower) or
        listing.address.city.toLower().contains(#text searchTextLower);
      }
    );
  };

  public query ({ caller }) func getPGListingsByArea(area : Text) : async [PGListing] {
    let areaLower = area.toLower();
    pgListings.values().toArray().filter(
      func(listing) {
        listing.address.area.toLower().contains(#text areaLower);
      }
    );
  };

  public query ({ caller }) func getPGListingsByCity(city : Text) : async [PGListing] {
    let cityLower = city.toLower();
    pgListings.values().toArray().filter(
      func(listing) {
        listing.address.city.toLower().contains(#text cityLower);
      }
    );
  };

  public query ({ caller }) func getPGListingsByPriceRange(min : Nat, max : Nat) : async [PGListing] {
    pgListings.values().toArray().filter(
      func(listing) {
        listing.price >= min and listing.price <= max;
      }
    );
  };

  public query ({ caller }) func getPGListingsByAmenities(required : Amenities) : async [PGListing] {
    pgListings.values().toArray().filter(
      func(listing) {
        (not required.wifi or listing.amenities.wifi) and
        (not required.laundry or listing.amenities.laundry) and
        (not required.parking or listing.amenities.parking) and
        (not required.food or listing.amenities.food) and
        (not required.cleaning or listing.amenities.cleaning) and
        (not required.security or listing.amenities.security) and
        (not required.ac or listing.amenities.ac) and
        (not required.gym or listing.amenities.gym) and
        (not required.hotWater or listing.amenities.hotWater) and
        (not required.powerBackup or listing.amenities.powerBackup);
      }
    );
  };

  public shared ({ caller }) func deletePGListing(id : Text) : async () {
    switch (pgListings.get(id)) {
      case (null) { Runtime.trap("PG Listing not found!") };
      case (?listing) {
        if (caller != listing.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins or the listing owner can delete this listing");
        };
        pgListings.remove(id);
      };
    };
  };

  public shared ({ caller }) func updatePGListing(id : Text, listing : PGListing) : async () {
    switch (pgListings.get(id)) {
      case (null) { Runtime.trap("PG Listing not found! Cannot update non-existent listing") };
      case (?current) {
        if (caller != current.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins or the listing owner can update this listing");
        };
        pgListings.add(id, listing);
      };
    };
  };

  public query ({ caller }) func getPGListingsByAreaAndSharingType(area : Text, sharingType : Text) : async [PGListing] {
    let areaLower = area.toLower();
    let sharingTypeLower = sharingType.toLower();
    pgListings.values().toArray().filter(
      func(listing) {
        listing.address.area.toLower().contains(#text areaLower) and
        listing.sharingTypes.find(func(t) { t.toLower().contains(#text sharingTypeLower) }) != null;
      }
    );
  };

  public query ({ caller }) func getPGListingsByAreaAndGender(area : Text, gender : Text) : async [PGListing] {
    let areaLower = area.toLower();
    let genderLower = gender.toLower();
    pgListings.values().toArray().filter(
      func(listing) {
        listing.address.area.toLower().contains(#text areaLower) and
        listing.gender.toLower().contains(#text genderLower);
      }
    );
  };

  public query ({ caller }) func getPGListingsSortedByPrice(sortOrder : Text) : async [PGListing] {
    let compareByPrice = PGListing.compareByPrice;
    let sorted = pgListings.values().toArray().sort(compareByPrice);
    if (sortOrder == "desc") {
      return sorted.reverse();
    };
    sorted;
  };

  public query ({ caller }) func getPGListingsSortedByRating(sortOrder : Text) : async [PGListing] {
    let compareByRating = PGListing.compareByRating;
    let sorted = pgListings.values().toArray().sort(compareByRating);
    if (sortOrder == "desc") {
      return sorted;
    };
    sorted.reverse();
  };

  public query ({ caller }) func getPGListingsWithFoodIncluded(foodIncluded : Bool) : async [PGListing] {
    pgListings.values().toArray().filter(
      func(listing) { listing.foodIncluded == foodIncluded }
    );
  };

  public query ({ caller }) func getPGListingsWithAC(acAvailable : Bool) : async [PGListing] {
    pgListings.values().toArray().filter(
      func(listing) { listing.acAvailable == acAvailable }
    );
  };

  public query ({ caller }) func getVerifiedPGListings() : async [PGListing] {
    pgListings.values().toArray();
  };

  public query ({ caller }) func getPGListingsByOwner(owner : Principal) : async [PGListing] {
    pgListings.values().toArray().filter(
      func(listing) { listing.owner == owner }
    );
  };

  public query ({ caller }) func getPGListingsWithAvailableBeds() : async [PGListing] {
    pgListings.values().toArray().filter(
      func(listing) { listing.availableBeds > 0 }
    );
  };

  public query ({ caller }) func getPGListingsWithMinRating(minRating : Float) : async [PGListing] {
    pgListings.values().toArray().filter(
      func(listing) {
        listing.rating >= minRating;
      }
    );
  };

  // Booking Functions

  public shared ({ caller }) func addBooking(booking : Booking) : async {
    id : Text;
    booking : Booking;
  } {
    let bookingId = generateBookingId();
    let bookingWithUser = {
      booking with
      user = caller;
    };
    bookings.add(bookingId, bookingWithUser);
    { id = bookingId; booking = bookingWithUser };
  };

  public query ({ caller }) func getBooking(id : Text) : async ?Booking {
    bookings.get(id);
  };

  public query ({ caller }) func getBookingsByUser(userId : Principal) : async [Booking] {
    bookings.values().toArray().filter(func(booking) { booking.user == userId });
  };

  public query ({ caller }) func getBookingsByPG(pgId : Text) : async [Booking] {
    bookings.values().toArray().filter(func(booking) { booking.pgId == pgId });
  };

  public shared ({ caller }) func deleteBooking(id : Text) : async () {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found!") };
      case (?booking) {
        if (caller != booking.user and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins or the booking user can delete this booking");
        };
        bookings.remove(id);
      };
    };
  };

  public query ({ caller }) func getUserBookings(user : Principal) : async [Booking] {
    bookings.values().toArray().filter(func(booking) { booking.user == user });
  };

  // Reviews and Ratings Functions
  public shared ({ caller }) func addReview(review : Review) : async Text {
    let reviewId = generateReviewId();
    reviews.add(reviewId, review);
    reviewId;
  };

  public query ({ caller }) func getReviewsForPG(pgId : Text) : async [Review] {
    reviews.values().toArray().filter(func(review) { review.pgId == pgId });
  };

  public query ({ caller }) func getReviewsByUser(user : Principal) : async [Review] {
    reviews.values().toArray().filter(func(review) { review.user == user });
  };

  public shared ({ caller }) func deleteReview(id : Text) : async () {
    switch (reviews.get(id)) {
      case (null) { Runtime.trap("Review not found!") };
      case (?review) {
        if (caller != review.user and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins or the review author can delete this review");
        };
        reviews.remove(id);
      };
    };
  };

  // User Functions

  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found!") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async UserProfile {
    switch (users.get(user)) {
      case (null) { Runtime.trap("User not found!") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    users.add(caller, profile);
  };

  public shared ({ caller }) func updateUserProfile(user : Principal, profile : UserProfile) : async () {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins or the user can update this profile");
    };
    users.add(user, profile);
  };

  public query ({ caller }) func getUserWishlist(user : Principal) : async [Text] {
    switch (wishlists.get(user)) {
      case (null) { [] };
      case (?wishlist) { wishlist.toArray() };
    };
  };

  public shared ({ caller }) func addToWishlist(pgId : Text) : async () {
    switch (wishlists.get(caller)) {
      case (null) {
        let newWishlist = List.empty<Text>();
        newWishlist.add(pgId);
        wishlists.add(caller, newWishlist);
      };
      case (?wishlist) {
        wishlist.add(pgId);
      };
    };
  };

  public shared ({ caller }) func removeFromWishlist(pgId : Text) : async () {
    switch (wishlists.get(caller)) {
      case (null) {};
      case (?wishlist) {
        let newWishlist = wishlist.filter(func(id) { id != pgId });
        wishlists.add(caller, newWishlist);
      };
    };
  };

  // Analytics Functions

  public query ({ caller }) func getAnalytics() : async {
    totalListings : Nat;
    verifiedListings : Nat;
    pendingListings : Nat;
    totalUsers : Nat;
    totalBookings : Nat;
    totalReviews : Nat;
  } {
    {
      totalListings = pgListings.size();
      verifiedListings = pgListings.size();
      pendingListings = pgListings.size();
      totalUsers = users.size();
      totalBookings = bookings.size();
      totalReviews = reviews.size();
    };
  };
};
