// src/lib/types.ts

export type Room = {
  id: number;      
  floor: number;   
  index: number;   
  isBooked: boolean;
};

export type BookingRequest = {
  action: 'book' | 'reset' | 'random';
  count?: number; 
};

export type BookingResponse = {
  success: boolean;
  message?: string;
  bookedRoomIds?: number[];
  travelTime?: number;
  rooms: Room[];
};