// src/app/api/rooms/route.ts
import { NextResponse } from 'next/server';
import { Room, BookingRequest } from '@/lib/types';
import { findOptimalRooms } from '@/lib/algorithm';

//IN-MEMORY DATABASE
const HOTEL_STATE: Room[] = [];

const initHotel = () => {
  if (HOTEL_STATE.length > 0) return;
  for (let f = 1; f <= 10; f++) {
    const count = f === 10 ? 7 : 10; 
    for (let i = 1; i <= count; i++) {
      HOTEL_STATE.push({
        id: f === 10 ? 1000 + i : f * 100 + i,
        floor: f,
        index: i,
        isBooked: false,
      });
    }
  }
};
initHotel();

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    rooms: HOTEL_STATE 
  });
}

export async function POST(req: Request) {
  const body: BookingRequest = await req.json();
  const { action, count } = body;

  // 1. RESET
  if (action === 'reset') {
    HOTEL_STATE.forEach(r => r.isBooked = false);
    return NextResponse.json({ success: true, rooms: HOTEL_STATE, message: "All rooms reset." });
  }

  // 2. RANDOM OCCUPANCY
  if (action === 'random') {
    HOTEL_STATE.forEach(r => r.isBooked = Math.random() < 0.4); // 40% chance
    return NextResponse.json({ success: true, rooms: HOTEL_STATE, message: "Random occupancy generated." });
  }

  // 3. BOOKING LOGIC
  if (action === 'book') {
    if (!count || count < 1 || count > 5) {
      return NextResponse.json({ success: false, message: "Invalid room count (1-5)." }, { status: 400 });
    }

    const available = HOTEL_STATE.filter(r => !r.isBooked);
    const { roomIds, cost } = findOptimalRooms(available, count);

    if (roomIds.length === 0) {
      return NextResponse.json({ success: false, message: "Not enough optimal rooms available." }, { status: 400 });
    }

    HOTEL_STATE.forEach(r => {
      if (roomIds.includes(r.id)) r.isBooked = true;
    });

    return NextResponse.json({ 
      success: true, 
      bookedRoomIds: roomIds, 
      travelTime: cost, // Pass cost to frontend
      rooms: HOTEL_STATE,
      message: `Successfully booked ${count} rooms.`
    });
  }
}
