import React, { useState } from 'react'
import RoomDropdown from '@/components/RoomDropdown'
import { useRooms } from '@/hooks/api';
import TimeSlotTable from '@/components/TimeSlotTable';
import Spinner from '@/components/UI/spinner';

const booking =()=> {
  const {data:roomList, error, isLoading} = useRooms()
      if (error) return <div>Error loading rooms</div>;
      const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

      const handleRoomSelect = (selected: number[]) => {
        setSelectedRoomIds(selected);
      };
    
    
    return (
        <div className="flex flex-col items-start lg:items-center  p-4 min-h-screen bg-[#ECECEC] text-text">
        <h1 className="text-3xl font-bold mb-8 text-left lg:text-center">
          Välj en tid
        </h1>
        {isLoading ? (
        <Spinner/>
      ) : roomList ? (
        <>
        <RoomDropdown rooms={roomList} onSelect={handleRoomSelect} />
        <div className='mt-6'>
        <TimeSlotTable selectedRoomIds={selectedRoomIds}/>
        </div>
        </>
      ) : (
        <p className="text-gray-500">Inga rum hittades.</p>
      )}
      </div>
    );
}

export default booking