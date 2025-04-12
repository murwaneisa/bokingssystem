'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimeslots } from '@/hooks/api';
import { TimeSlot } from '@/types/api';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import Spinner from './UI/spinner';
import Button from '@/components/UI/button';
import { useIsMobile } from '@/hooks/frontend';

interface TimeslotTableProps {
  selectedRoomIds: number[];
}

export default function TimeslotTable({ selectedRoomIds }: TimeslotTableProps) {
  const isMobile = useIsMobile(); // Detect screen size
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Initialize current week range starting from Monday
  const [currentStartDate, setCurrentStartDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const numberOfDays = isMobile ? 3 : 7;
  const currentEndDate = addDays(currentStartDate, numberOfDays - 1);

  /**
   * Fetch time slots from API based on current week and selected rooms
   */
  const { data: timeslots, isLoading, error } = useTimeslots({
    start: currentStartDate.toISOString(),
    end: currentEndDate.toISOString(),
    roomIds: selectedRoomIds.length > 0 ? selectedRoomIds : undefined,
  });

  /**
   * <summary>
   * Pagination: Moves the calendar view forward by 1 week.
   * </summary>
   * <remarks>
   * Updates the `currentStartDate` to 7 days ahead to fetch the next week’s timeslots.
   * </remarks>
   */

  const handleNextWeek = () => setCurrentStartDate(prev => addDays(prev, 7));

    /**
   * <summary>
   * Pagination: Moves the calendar view backward by 1 week.
   * </summary>
   * <remarks>
   * Updates the `currentStartDate` to 7 days earlier to fetch the previous week’s timeslots.
   * </remarks>
   */
  const handlePrevWeek = () => setCurrentStartDate(prev => subDays(prev, 7));

  /**
   * Group time slots by date string (yyyy-MM-dd)
   */
  const groupedSlots = useMemo(() => {
    const map: Record<string, TimeSlot[]> = {};
    timeslots?.forEach(slot => {
      const key = format(new Date(slot.date), 'yyyy-MM-dd');
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    });
    return map;
  }, [timeslots]);

  /**
 * <description>
 * Generates an array of dates starting from the currentStartDate and spans 
 * numberOfDays (either 3 or 7 depending on screen size).
 * This is memoized to avoid unnecessary re-computation unless the start date
 * or number of days changes.
 * </description>
 * <returns>
 * Array of Date objects for each day to render in the timeslot table.
 * </returns>
 */
  const fullWeekDates = useMemo(() => {
    return Array.from({ length: numberOfDays }, (_, i) =>
      addDays(currentStartDate, i)
    );
  }, [currentStartDate, numberOfDays]);

  /**
   * Handle selecting or deselecting a timeslot
   */
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(prev => (prev?.id === slot.id ? null : slot));
  };

  /**
   * Proceed to next step (form) if a timeslot is selected
   */
  const goToNext = () => {
    if (!selectedSlot) {
      window.alert('Vänligen välj en tid först innan du går vidare.');
      return;
    }

    localStorage.setItem('selectedTimeslot', JSON.stringify(selectedSlot));
    router.push('/bookings/confirm');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center"><Spinner /></div>;
  }

  if (error) {
    return <p className="text-center text-red-500">Kunde inte hämta tider.</p>;
  }

  const hasTimeslots = timeslots && timeslots.length > 0;

  return (
    <div className="w-full mt-6">
      {/* Navigation for week switching */}
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
                        className={`cursor-pointer text-sm border rounded-xl px-2 py-1 m-2 text-center transition
                          ${slot.isBooked
                            ? 'bg-emerald-600 text-white border-emerald-600 pointer-events-none opacity-70'
                            : selectedSlot?.id === slot.id
                              ? 'bg-emerald-900 text-white border-emerald-900'
                              : 'border-emerald-600 text-black'
                          }
                        `}
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

          {/* Next button */}
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
