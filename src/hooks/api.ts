import { Booking, Room, TimeSlot, TimeslotQuery, User } from "@/types/api";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";


  // ✅ Hook for fetching users
  interface UseUsersResponse {
    data?: User[];
    error?: any;
    isLoading: boolean;
}
export const useRooms = () =>
    useSWR<Room[]>("/rooms", (url: string) => fetcher<Room[]>(url), {
      dedupingInterval: 1000 * 60 * 60 * 24, // 24h
    });
  
export const useUsers = () =>
    useSWR<User[]>("/users", (url:string) => fetcher<User[]>(url));
  
  // ✅ Hook for bookings
  export const useBookings = () =>
    useSWR<Booking[]>("/bookings", (url:string) => fetcher<Booking[]>(url));

  export const useTimeslots = ({ start, end, roomIds }: TimeslotQuery) => {
    const params = new URLSearchParams({ start, end });
    if (roomIds && roomIds.length > 0) {
    roomIds.forEach((id: number) => params.append("roomIds", id.toString()));
    }
  
    const url = `/timeslots/filter?${params.toString()}`;
  
    return useSWR<TimeSlot[]>(url, (url:string) => fetcher<TimeSlot[]>(url));
  };