'use client';

import { useEffect, useState } from 'react';
import { TimeSlot } from '@/types/api';
import { useRouter } from 'next/router';
import Button from '@/components/button';

export default function Confirm() {
  const [timeslot, setTimeslot] = useState<TimeSlot | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('selectedTimeslot');
    if (stored) {
      setTimeslot(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="bg-primary h-screen flex items-center justify-center px-4">
      <div className="flex flex-col justify-between h-full w-full max-w-md mx-auto">
        {/* Top Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Vem bokar?</h1>
          <form className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Förnamn och efternamn
              <input
                type="text"
                placeholder="Skriv ditt fullständiga namn här"
                className="mt-1 p-2 border rounded w-full"
              />
            </label>
          </form>
        </div>

        {/* Bottom Button */}
        <div className="pb-4">
          <Button className="w-full">Boka</Button>
        </div>
      </div>
    </div>
  );
}
