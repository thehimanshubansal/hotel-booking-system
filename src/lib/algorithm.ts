// src/lib/algorithm.ts
import { Room } from './types';

// Constants
const VERTICAL_TIME_PER_FLOOR = 2; 
const HORIZONTAL_TIME_PER_ROOM = 1; 

// Changed return type to Object
export function findOptimalRooms(availableRooms: Room[], required: number): { roomIds: number[], cost: number } {
  if (required > 5 || required < 1) return { roomIds: [], cost: 0 };

  const floors: Record<number, Room[]> = {};
  availableRooms.forEach(r => {
    if (!floors[r.floor]) floors[r.floor] = [];
    floors[r.floor].push(r);
  });

  // Ensure sorted by index (101, 102...)
  Object.values(floors).forEach(list => list.sort((a, b) => a.index - b.index));

  let bestSelection: number[] = [];
  let minCost = Infinity;
  let foundSingleFloor = false;

  // --- STRATEGY 1: SINGLE FLOOR ---
  for (const floorNumStr in floors) {
    const floorRooms = floors[floorNumStr];
    if (floorRooms.length >= required) {
      for (let i = 0; i <= floorRooms.length - required; i++) {
        const window = floorRooms.slice(i, i + required);
        
        // Cost: Horizontal distance (Index of Last - Index of First)
        // e.g., 101, 102, 105, 106. Indices: 1, 2, 5, 6. Cost = 6 - 1 = 5 mins.
        const cost = (window[window.length - 1].index - window[0].index) * HORIZONTAL_TIME_PER_ROOM;
        
        if (cost < minCost) {
          minCost = cost;
          bestSelection = window.map(r => r.id);
          foundSingleFloor = true;
        }
      }
    }
  }

  if (foundSingleFloor) {
    return { roomIds: bestSelection, cost: minCost };
  }

  // --- STRATEGY 2: MULTI-FLOOR ---
  minCost = Infinity; 
  const activeFloors = Object.keys(floors).map(Number).sort((a, b) => a - b);

  for (let i = 0; i < activeFloors.length; i++) {
    for (let j = i + 1; j < activeFloors.length; j++) {
      const fStart = activeFloors[i];
      const fEnd = activeFloors[j];

      const verticalCost = (fEnd - fStart) * VERTICAL_TIME_PER_FLOOR;
      if (verticalCost >= minCost) continue;

      let candidates: Room[] = [];
      for (let f = fStart; f <= fEnd; f++) {
        if (floors[f]) candidates.push(...floors[f]);
      }

      if (candidates.length < required) continue;

      // Sort by Proximity to Lift (Index) primarily
      candidates.sort((a, b) => a.index - b.index || a.floor - b.floor);

      const selected = candidates.slice(0, required);
      
      const selFloors = selected.map(r => r.floor);
      const minF = Math.min(...selFloors);
      const maxF = Math.max(...selFloors);

      // Max walk on bottom floor involved + Max walk on top floor involved
      const bottomWalk = Math.max(...selected.filter(r => r.floor === minF).map(r => r.index));
      const topWalk = Math.max(...selected.filter(r => r.floor === maxF).map(r => r.index));

      const totalCost = bottomWalk + topWalk + ((maxF - minF) * VERTICAL_TIME_PER_FLOOR);

      if (totalCost < minCost) {
        minCost = totalCost;
        bestSelection = selected.map(r => r.id);
      }
    }
  }

  return { roomIds: bestSelection, cost: minCost === Infinity ? 0 : minCost };
}