'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TimeSlot } from '@/types/api';
import Button from '@/components/UI/button';
import { useBookingMutation } from '@/hooks/api';
import BookingSuccessCard from '@/components/UI/BookingSuccessCard';

export default function Confirm() {
  const [timeslot, setTimeslot] = useState<TimeSlot | null>(null);
  const [userName, setUserName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const { trigger: book, isMutating, error } = useBookingMutation();

  useEffect(() => {
    const stored = localStorage.getItem('selectedTimeslot');
    if (stored) {
      setTimeslot(JSON.parse(stored));
    } else {
      window.alert('Ingen tid har valts. Du omdirigeras till bokningssidan.');
      router.push('/bookings');
    }
  }, []);

   /**
   * Handles the booking process:
   * 1. Validates user input.
   * 2. Triggers the booking API.
   * 3. If successful, shows success card and redirects home after delay.
   * 4. Handles and shows error messages if booking fails.
   */
  const handleBooking = async () => {
    if (!userName.trim()) {
      window.alert('Vänligen fyll i ditt namn innan du bokar.');
      return;
    }
  
    if (!timeslot) {
      window.alert('Tidsluckan saknas. Vänligen välj en tid på bokningssidan.');
      router.push('/bookings');
      return;
    }
  
    try {
      const result = await book({
        userName,
        roomId: timeslot.roomId,
        timeSlotId: timeslot.id,
      });
  
      //Confirm the response is successful before continuing
      if (result?.bookingId && result.message === 'Booking successful') {
        localStorage.removeItem('selectedTimeslot');
        setShowSuccess(true);
  
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        console.error('Ogiltigt svar:', result);
        window.alert('Något gick fel vid bokningen. Försök igen.');
      }
    } catch (err: any) {
      console.error('Booking failed:', err.message);
      window.alert('Bokningen misslyckades: ' + err.message);
    }
  };
  

  return (
    <div className="bg-primary h-screen flex items-center justify-center px-4 relative">
      {showSuccess && <BookingSuccessCard />}

      <div className="flex flex-col justify-between h-full w-full max-w-md mx-auto">
        <div className="flex-1 pt-6">
          <h1 className="text-2xl font-bold mb-4">Vem bokar?</h1>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-sm font-medium text-gray-700">
              Förnamn och efternamn
              <input
                type="text"
                placeholder="Skriv ditt fullständiga namn här"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </label>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </form>
        </div>

        <div className="pb-4">
          <Button className="w-full" onClick={handleBooking}>
            {isMutating ? 'Bokar...' : 'Boka'}
          </Button>
        </div>
      </div>
    </div>
  );
}
