import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Types
  type UserProfile = {
    name : Text;
    mobile : Text;
    passwordHash : Text;
    approved : Bool;
  };

  module Event {
    public type Event = {
      id : Text;
      name : Text;
      description : Text;
      date : Time.Time;
      location : Text;
      eventType : Text;
    };

    public func compare(event1 : Event, event2 : Event) : Order.Order {
      if (event1.date < event2.date) #less else #greater;
    };
  };

  type Donation = {
    id : Text;
    donorName : Text;
    amount : Nat;
    purpose : Text;
    date : Time.Time;
  };

  type Message = {
    id : Text;
    text : Text;
    date : Time.Time;
  };

  type Mantra = {
    id : Text;
    title : Text;
    text : Text;
  };

  type Volunteer = {
    id : Text;
    name : Text;
    mobile : Text;
    skills : Text;
    availability : Text;
  };

  type GalleryItem = {
    id : Text;
    title : Text;
    description : Text;
    itemType : Text;
    blobId : ?Storage.ExternalBlob;
  };

  type Announcement = {
    id : Text;
    title : Text;
    description : Text;
    date : Time.Time;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let users = Map.empty<Principal, UserProfile>();
  let events = Map.empty<Text, Event.Event>();
  let eventRegistrations = Map.empty<Text, Set.Set<Principal>>();
  let donations = Map.empty<Text, Donation>();
  let messages = Map.empty<Text, Message>();
  let mantras = Map.empty<Text, Mantra>();
  let volunteers = Map.empty<Text, Volunteer>();
  let gallery = Map.empty<Text, GalleryItem>();
  let announcements = Map.empty<Text, Announcement>();

  // User Management
  public shared ({ caller }) func registerUser(name : Text, mobile : Text, passwordHash : Text) : async () {
    // No authorization check - anyone including guests can register
    users.add(
      caller,
      {
        name;
        mobile;
        passwordHash;
        approved = false;
      },
    );
  };

  public shared ({ caller }) func approveUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve users");
    };
    switch (users.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) {
        users.add(user, { profile with approved = true });
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    users.add(caller, profile);
  };

  // Events
  public shared ({ caller }) func createEvent(id : Text, name : Text, description : Text, date : Time.Time, location : Text, eventType : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };
    events.add(
      id,
      {
        id;
        name;
        description;
        date;
        location;
        eventType;
      },
    );
    eventRegistrations.add(id, Set.empty<Principal>());
  };

  public shared ({ caller }) func updateEvent(id : Text, name : Text, description : Text, date : Time.Time, location : Text, eventType : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event does not exist") };
      case (?_) {
        events.add(
          id,
          {
            id;
            name;
            description;
            date;
            location;
            eventType;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteEvent(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };
    events.remove(id);
    eventRegistrations.remove(id);
  };

  public shared ({ caller }) func registerForEvent(eventId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register for events");
    };
    switch (eventRegistrations.get(eventId)) {
      case (null) { Runtime.trap("Event does not exist") };
      case (?registrants) {
        registrants.add(caller);
      };
    };
  };

  public query ({ caller }) func getAllEvents() : async [Event.Event] {
    // No authorization check - anyone can view events
    events.values().toArray().sort();
  };

  // Donations
  public shared ({ caller }) func addDonation(id : Text, donorName : Text, amount : Nat, purpose : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit donations");
    };
    donations.add(
      id,
      {
        id;
        donorName;
        amount;
        purpose;
        date = Time.now();
      },
    );
  };

  public query ({ caller }) func getAllDonations() : async [Donation] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all donations");
    };
    donations.values().toArray();
  };

  // Messages
  public shared ({ caller }) func addMessage(id : Text, text : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add messages");
    };
    messages.add(
      id,
      {
        id;
        text;
        date = Time.now();
      },
    );
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    // No authorization check - anyone can read messages
    messages.values().toArray();
  };

  // Mantras
  public shared ({ caller }) func addMantra(id : Text, title : Text, text : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add mantras");
    };
    mantras.add(
      id,
      {
        id;
        title;
        text;
      },
    );
  };

  public shared ({ caller }) func updateMantra(id : Text, title : Text, text : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update mantras");
    };
    switch (mantras.get(id)) {
      case (null) { Runtime.trap("Mantra does not exist") };
      case (?_) {
        mantras.add(
          id,
          {
            id;
            title;
            text;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteMantra(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete mantras");
    };
    mantras.remove(id);
  };

  public query ({ caller }) func getAllMantras() : async [Mantra] {
    // No authorization check - anyone can read mantras
    mantras.values().toArray();
  };

  // Volunteers
  public shared ({ caller }) func registerVolunteer(id : Text, name : Text, mobile : Text, skills : Text, availability : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as volunteers");
    };
    volunteers.add(
      id,
      {
        id;
        name;
        mobile;
        skills;
        availability;
      },
    );
  };

  public query ({ caller }) func getAllVolunteers() : async [Volunteer] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all volunteers");
    };
    volunteers.values().toArray();
  };

  // Gallery
  public shared ({ caller }) func addGalleryItem(id : Text, title : Text, description : Text, itemType : Text, blobId : ?Storage.ExternalBlob) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };
    gallery.add(
      id,
      {
        id;
        title;
        description;
        itemType;
        blobId;
      },
    );
  };

  public shared ({ caller }) func updateGalleryItem(id : Text, title : Text, description : Text, itemType : Text, blobId : ?Storage.ExternalBlob) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update gallery items");
    };
    switch (gallery.get(id)) {
      case (null) { Runtime.trap("Gallery item does not exist") };
      case (?_) {
        gallery.add(
          id,
          {
            id;
            title;
            description;
            itemType;
            blobId;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteGalleryItem(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    gallery.remove(id);
  };

  public query ({ caller }) func getAllGalleryItems() : async [GalleryItem] {
    // No authorization check - anyone can view gallery
    gallery.values().toArray();
  };

  // Announcements
  public shared ({ caller }) func addAnnouncement(id : Text, title : Text, description : Text, date : Time.Time) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add announcements");
    };
    announcements.add(
      id,
      {
        id;
        title;
        description;
        date;
      },
    );
  };

  public shared ({ caller }) func updateAnnouncement(id : Text, title : Text, description : Text, date : Time.Time) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update announcements");
    };
    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement does not exist") };
      case (?_) {
        announcements.add(
          id,
          {
            id;
            title;
            description;
            date;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };
    announcements.remove(id);
  };

  public query ({ caller }) func getAllAnnouncements() : async [Announcement] {
    // No authorization check - anyone can view announcements
    announcements.values().toArray();
  };
};
