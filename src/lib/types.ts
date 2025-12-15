// src/lib/types.ts

export type Room = {
  id: number;       // e.g., 101, 205, 1001
  floor: number;    // 1-10
  index: number;    // 1-10 (Distance from lift)
  isBooked: boolean;
};

export type BookingRequest = {
  action: 'book' | 'reset' | 'random';
  count?: number; // Only needed for 'book'
};

export type BookingResponse = {
  success: boolean;
  message?: string;
  bookedRoomIds?: number[];
  travelTime?: number;
  rooms: Room[]; // Always return updated state
};