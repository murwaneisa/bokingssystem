import React from 'react'
import RoomDropdown from '@/components/RoomDropdown'
import { useRooms } from '@/hooks/api';
import TimeSlotTable from '@/components/TimeSlotTable';

const booking =()=> {
  const {data:roomList, error, isLoading} = useRooms()
   /*  const roomList = [
        { id: 1, name: "Margret", capacity: 4 },
        { id: 2, name: "Steve", capacity: 6 },
        { id: 3, name: "Ada", capacity: 10 },
        { id: 4, name: "Edmund", capacity: 10 },
        { id: 5, name: "Grace", capacity: 20 },
      ]; */

      if (error) return <div>Error loading rooms</div>;
    
    const handleRoomSelect = (selected: number[]) => {
        console.log("Selected room IDs:", selected);
      };
    
    return (
        <div className="flex flex-col items-start lg:items-center  p-4 min-h-screen bg-[#ECECEC] text-text">
        <h1 className="text-3xl font-bold mb-8 text-left lg:text-center">
          Välj en tid
        </h1>
        {isLoading ? (
        <p className="text-gray-500">🔄 Laddar rum...</p>
      ) : roomList ? (
        <>
        <RoomDropdown rooms={roomList} onSelect={handleRoomSelect} />
        <div className='mt-6'>
        <TimeSlotTable/>
        </div>
        </>
      ) : (
        <p className="text-gray-500">Inga rum hittades.</p>
      )}
      </div>
    );
}

export default booking