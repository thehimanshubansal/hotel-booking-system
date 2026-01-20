"use client";
import { useState, useEffect } from "react";
import { Room, BookingResponse } from "@/lib/types";
import { motion } from "framer-motion";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [lastBooked, setLastBooked] = useState<number[]>([]);
  const [lastCost, setLastCost] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState("1");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => { if (data.rooms) setRooms(data.rooms); })
      .catch((_) => console.error("Failed to fetch"));
  }, []);

  const handleAction = async (action: 'book' | 'reset' | 'random') => {
    setLoading(true);
    setMsg("");
    if(action !== 'book') setLastCost(null);
    
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action, 
          count: action === 'book' ? parseInt(inputVal) : undefined 
        }),
      });
      
      const data: BookingResponse = await res.json();
      
      if (data.success) {
        setRooms(data.rooms);
        if (action === 'book' && data.bookedRoomIds) {
          setLastBooked(data.bookedRoomIds);
          setLastCost(data.travelTime || 0);
          setMsg(`Success! Booked rooms: ${data.bookedRoomIds.join(", ")}`);
        } else if (action === 'reset') {
          setLastBooked([]);
          setMsg("System Reset.");
        } else {
          setLastBooked([]);
          setMsg("Random occupancy generated.");
        }
      } else {
        setMsg(data.message || "Error occurred");
      }
    } catch (_) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 lg:p-10">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900">Hotel Reservation System</h1>
        <p className="text-slate-500">by Himanshu Bansal</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT COLUMN: CONTROLS & INFO --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CONTROL CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Reservation Controls</h2>
            
            <div className="mb-6">
              <label htmlFor="roomInput" className="block text-xs font-bold uppercase text-slate-400 mb-2">Rooms to Book (Max 5)</label>
              <div className="flex gap-2">
                <input 
                  id="roomInput"
                  type="number" min="1" max="5" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="border-2 border-slate-200 rounded-lg px-4 py-2 w-full focus:border-indigo-500 focus:outline-none font-bold text-lg"
                  aria-label="Number of rooms to book"
                />
                <button 
                  onClick={() => handleAction('book')}
                  disabled={loading || !inputVal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md w-full disabled:opacity-50 focus:ring-4 focus:ring-indigo-300 outline-none"
                  aria-label="Book Rooms"
                >
                  {loading ? "..." : "Book"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleAction('random')} 
                className="bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 px-4 py-3 rounded-lg transition focus:ring-2 focus:ring-indigo-300 outline-none"
                aria-label="Generate Random Occupancy"
              >
                Randomize
              </button>
              <button 
                onClick={() => handleAction('reset')} 
                className="bg-red-50 text-red-600 font-semibold hover:bg-red-100 px-4 py-3 rounded-lg transition focus:ring-2 focus:ring-red-300 outline-none"
                aria-label="Reset All Bookings"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* STATUS INFO (ARIA-LIVE REGION) */}
          <div 
            className="min-h-[60px]" 
            role="status" 
            aria-live="polite"
          >
            {msg && (
              <div className={`p-5 rounded-2xl border-l-4 shadow-md ${msg.includes("Error") ? "bg-red-50 border-red-500" : "bg-green-50 border-green-500"}`}>
                <h3 className="font-bold text-gray-800 mb-1">{msg.includes("Error") ? "Error" : "Booking Status"}</h3>
                <p className="text-sm text-gray-600 mb-2">{msg}</p>
                
                {lastCost !== null && (
                  <div className="mt-3 pt-3 border-t border-green-200 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-green-700">Total Travel Time</span>
                    <span className="text-xl font-bold text-green-800">{lastCost} <span className="text-sm font-medium">mins</span></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RULES CARD */}
          <div className="bg-slate-800 text-slate-200 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Rules & Constraints
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="font-bold text-yellow-400">1.</span>
                <span>Max <strong>5 rooms</strong> per guest.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-yellow-400">2.</span>
                <span>Priority: <strong>Same Floor</strong> first.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-yellow-400">3.</span>
                <span>Horizontal Travel: <strong>1 min</strong> per room index.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-yellow-400">4.</span>
                <span>Vertical Travel: <strong>2 mins</strong> per floor.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-yellow-400">5.</span>
                <span>Booking minimizes total time (Furthest Room ↔ Furthest Room).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- RIGHT COLUMN: VISUALIZATION --- */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 overflow-x-auto">
            <div className="flex flex-row gap-6 min-w-[600px]">
              {/* LIFT */}
              <div className="w-16 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center shrink-0">
                <span className="-rotate-90 whitespace-nowrap font-bold text-slate-400 tracking-widest text-sm">STAIRS / LIFT</span>
              </div>

              {/* GRID */}
              <div 
                className="flex flex-col-reverse gap-3 w-full" 
                role="grid" 
                aria-label="Hotel Rooms Grid"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(floorNum => (
                  <div key={floorNum} className="flex items-center gap-4" role="row">
                    <span className="w-8 text-right text-xs font-bold text-slate-400 font-mono shrink-0">F{floorNum}</span>
                    <div className="flex gap-2">
                      {rooms.filter(r => r.floor === floorNum).map(room => {
                        const isJustBooked = lastBooked.includes(room.id);
                        const isBooked = room.isBooked;

                        return (
                          <motion.div 
                            key={room.id}
                            role="gridcell"
                            tabIndex={0}
                            aria-label={`Room ${room.id}, ${isBooked ? "Occupied" : "Available"}`}
                            
                            // ANIMATION PROPERTIES
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ 
                              scale: isJustBooked ? 1.15 : 1,
                              opacity: 1,
                              backgroundColor: isJustBooked 
                                ? "#4f46e5" // Indigo-600
                                : isBooked 
                                  ? "#fee2e2" // Red-100
                                  : "#ecfdf5", // Emerald-50
                              borderColor: isJustBooked 
                                ? "#4338ca" // Indigo-700
                                : isBooked 
                                  ? "#fecaca" // Red-200
                                  : "#a7f3d0", // Emerald-200
                              color: isJustBooked 
                                ? "#ffffff" 
                                : isBooked 
                                  ? "#f87171" 
                                  : "#047857"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            
                            className="w-10 h-10 flex items-center justify-center text-[10px] font-bold rounded-md border-2 cursor-default outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {room.id}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* LEGEND */}
            <div className="flex justify-center gap-8 mt-8 border-t border-slate-100 pt-4" aria-hidden="true">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 bg-emerald-50 border border-emerald-200 rounded"></div> Available
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div> Occupied
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-700">
                <div className="w-4 h-4 bg-indigo-600 border border-indigo-600 rounded"></div> Just Booked
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
