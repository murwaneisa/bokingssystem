import { Booking, BookingPayload, Room, TimeSlot, TimeslotQuery, User } from "@/types/api";
import useSWR from "swr";
import { fetcher, postRequest } from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";

/**
 * <summary>
 * Fetches all available rooms from the API.
 * Cached for 24 hours to reduce unnecessary requests.
 * </summary>
 */
export const useRooms = () =>
  useSWR<Room[]>("/rooms", (url: string) => fetcher<Room[]>(url), {
    dedupingInterval: 1000 * 60 * 60 * 24,
  });

/**
 * <summary>
 * Fetches all bookings from the API.
 * </summary>
 */
export const useBookings = () =>
  useSWR<Booking[]>("/bookings", (url: string) => fetcher<Booking[]>(url));

/**
 * <summary>
 * Fetches timeslots based on selected date range and optional room filter.
 * </summary>
 * @param start ISO start date string
 * @param end ISO end date string
 * @param roomIds Optional array of room IDs
 */
export const useTimeslots = ({ start, end, roomIds }: TimeslotQuery) => {
  const params = new URLSearchParams({ start, end });
  if (roomIds && roomIds.length > 0) {
    roomIds.forEach((id: number) => params.append("roomIds", id.toString()));
  }

  const url = `/timeslots/filter?${params.toString()}`;

  return useSWR<TimeSlot[]>(url, (url: string) => fetcher<TimeSlot[]>(url));
};

/**
 * <summary>
 * SWR mutation hook to book a timeslot using a POST request.
 * </summary>
 */
export function useBookingMutation() {
  return useSWRMutation(
    '/api/bookings',
    postRequest<BookingPayload, { bookingId: number; message: string }>
  );
}
