import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Event {
    id: string;
    date: Time;
    name: string;
    description: string;
    location: string;
    eventType: string;
}
export interface Mantra {
    id: string;
    title: string;
    text: string;
}
export interface Donation {
    id: string;
    date: Time;
    donorName: string;
    amount: bigint;
    purpose: string;
}
export interface Announcement {
    id: string;
    title: string;
    date: Time;
    description: string;
}
export interface Message {
    id: string;
    date: Time;
    text: string;
}
export interface Volunteer {
    id: string;
    name: string;
    availability: string;
    mobile: string;
    skills: string;
}
export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    blobId?: ExternalBlob;
    itemType: string;
}
export interface UserProfile {
    name: string;
    approved: boolean;
    passwordHash: string;
    mobile: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnnouncement(id: string, title: string, description: string, date: Time): Promise<void>;
    addDonation(id: string, donorName: string, amount: bigint, purpose: string): Promise<void>;
    addGalleryItem(id: string, title: string, description: string, itemType: string, blobId: ExternalBlob | null): Promise<void>;
    addMantra(id: string, title: string, text: string): Promise<void>;
    addMessage(id: string, text: string): Promise<void>;
    approveUser(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvent(id: string, name: string, description: string, date: Time, location: string, eventType: string): Promise<void>;
    deleteAnnouncement(id: string): Promise<void>;
    deleteEvent(id: string): Promise<void>;
    deleteGalleryItem(id: string): Promise<void>;
    deleteMantra(id: string): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllDonations(): Promise<Array<Donation>>;
    getAllEvents(): Promise<Array<Event>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllMantras(): Promise<Array<Mantra>>;
    getAllMessages(): Promise<Array<Message>>;
    getAllVolunteers(): Promise<Array<Volunteer>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerForEvent(eventId: string): Promise<void>;
    registerUser(name: string, mobile: string, passwordHash: string): Promise<void>;
    registerVolunteer(id: string, name: string, mobile: string, skills: string, availability: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAnnouncement(id: string, title: string, description: string, date: Time): Promise<void>;
    updateEvent(id: string, name: string, description: string, date: Time, location: string, eventType: string): Promise<void>;
    updateGalleryItem(id: string, title: string, description: string, itemType: string, blobId: ExternalBlob | null): Promise<void>;
    updateMantra(id: string, title: string, text: string): Promise<void>;
}
