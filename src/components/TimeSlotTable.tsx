// Update TimeSlotTable.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimeslots } from '@/hooks/api';
import { TimeSlot } from '@/types/api';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import Spinner from './UI/spinner';
import Button from '@/components/button';

interface TimeslotTableProps {
  selectedRoomIds: number[];
}

export default function TimeslotTable({ selectedRoomIds }: TimeslotTableProps) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [currentStartDate, setCurrentStartDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const currentEndDate = addDays(currentStartDate, 6);

  const { data: timeslots, isLoading, error } = useTimeslots({
    start: currentStartDate.toISOString(),
    end: currentEndDate.toISOString(),
    roomIds: selectedRoomIds.length > 0 ? selectedRoomIds : undefined,
  });

  const handleNextWeek = () => setCurrentStartDate(prev => addDays(prev, 7));
  const handlePrevWeek = () => setCurrentStartDate(prev => subDays(prev, 7));

  const groupedSlots = useMemo(() => {
    const map: Record<string, TimeSlot[]> = {};
    timeslots?.forEach(slot => {
      const key = format(new Date(slot.date), 'yyyy-MM-dd');
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    });
    return map;
  }, [timeslots]);

  const fullWeekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentStartDate, i));
  }, [currentStartDate]);

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(prev => (prev?.id === slot.id ? null : slot));
  };

  const goToNext = () => {
    if (selectedSlot) {
      localStorage.setItem('selectedTimeslot', JSON.stringify(selectedSlot));
      router.push('/bookings/confirm');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center"><Spinner /></div>;
  }

  if (error) {
    return <p className="text-center text-red-500">❌ Kunde inte hämta tider.</p>;
  }

  const hasTimeslots = timeslots && timeslots.length > 0;

  return (
    <div className="w-full mt-6">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4 px-4">
        <button onClick={handlePrevWeek}>
          <ArrowLeftCircleIcon className="h-7 w-7 cursor-pointer text-gray-700 hover:text-primary" />
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentStartDate, 'd MMM')} - {format(currentEndDate, 'd MMM')}
        </h2>
        <button onClick={handleNextWeek}>
          <ArrowRightCircleIcon className="h-7 w-7 cursor-pointer text-gray-700 hover:text-primary" />
        </button>
      </div>

      {!hasTimeslots ? (
        <p className="text-center text-gray-600">Inga lediga tider hittades för denna vecka.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 md:grid-cols-7 border border-[#BDBDBD] rounded-xl overflow-hidden">
            {fullWeekDates.map(date => {
              const key = format(date, 'yyyy-MM-dd');
              const slots = groupedSlots[key] || [];

              return (
                <div key={key} className="border-r last:border-r-0 border-[#BDBDBD]">
                  <div className="border-b border-[#BDBDBD] py-3 text-center">
                    <h3 className="font-bold text-sm">{format(date, 'dd MMM')}</h3>
                  </div>
                  <div className="p-2">
                    {slots.map(slot => (
                      <div
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        className={`cursor-pointer text-sm border rounded-xl px-2 py-1 m-2 text-center transition ${
                          selectedSlot?.id === slot.id
                            ? 'bg-emerald-900 text-white border-emerald-900'
                            : 'border-emerald-600 text-black'
                        }`}
                      >
                        {slot.room.name} ({slot.room.capacity})<br />
                        {format(new Date(slot.startTime), 'HH:mm')} - {format(new Date(slot.endTime), 'HH:mm')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

            <div className="mt-6 flex justify-center">
              <Button className="w-full max-w-md" onClick={goToNext}>
                Nästa
              </Button>
            </div>
        </>
      )}
    </div>
  );
}
