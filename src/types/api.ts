// src/types.ts
export interface Room {
    id: number;
    name: string;
    capacity: number;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export interface Booking {
    id: number;
    userId: number;
    timeSlotId: number;
    roomId: number;
  }

  export interface TimeslotQuery {
    start: string;
    end: string;
    roomIds?: number[];
  }

  export interface TimeSlot {
    id: number;
    roomId: number;
    date: string; // ISO format
    startTime: string; // ISO format
    endTime: string; // ISO format
    isBooked: boolean;
    room: Room;
  }

  export interface BookingPayload {
    userName: string;
    timeSlotId: number;
    roomId: number;
  }
  