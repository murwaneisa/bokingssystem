'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TimeSlot } from '@/types/api';
import Button from '@/components/button';
import { useBookingMutation } from '@/hooks/api';

export default function Confirm() {
  const [timeslot, setTimeslot] = useState<TimeSlot | null>(null);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const { trigger: book, isMutating, error } = useBookingMutation();

  useEffect(() => {
    const stored = localStorage.getItem('selectedTimeslot');
    if (stored) {
      setTimeslot(JSON.parse(stored));
      console.log('Stored timeslot:', JSON.parse(stored));
    }
  }, []);

  const handleBooking = async () => {
    if (!userName.trim() || !timeslot) return;

    try {
      const result = await book({
        userName,
        roomId: timeslot.roomId,
        timeSlotId: timeslot.id,
      });
    
      console.log('Booking successful:', result);
      localStorage.removeItem('selectedTimeslot');
      //router.push('/booking/success');
    } catch (err: any) {
      console.error('Booking failed:', err.message);
    }
  };

  return (
    <div className="bg-primary h-screen flex items-center justify-center px-4">
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
          <Button className="w-full" onClick={handleBooking} >
            {isMutating ? 'Bokar...' : 'Boka'}
          </Button>
        </div>
      </div>
    </div>
  );
}
