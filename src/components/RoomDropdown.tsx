"use client";

import { useState } from "react";
import Button from "@/components/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface Room {
  id: number;
  name: string;
  capacity: number;
}

interface RoomDropdownProps {
  rooms: Room[];
  onSelect: (selected: number[]) => void;
}

export default function RoomDropdown({ rooms, onSelect }: RoomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  const toggleRoom = (roomId: number) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSelect = () => {
    onSelect(selectedRooms);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedRooms([]);
  };

  return (
    <div className="relative w-full max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 bg-white text-text px-4 py-2 rounded-md shadow-sm flex justify-between items-center"
      >
        Mötesrum
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-700" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-xl p-4 shadow-xl space-y-3">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {rooms.map((room) => (
              <label
                key={room.id}
                className="relative flex items-center justify-between text-sm px-2"
              >
                <span>
                  {room.name} ({room.capacity} personer)
                </span>

                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room.id)}
                    onChange={() => toggleRoom(room.id)}
                    className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-sm bg-white cursor-pointer peer"
                  />
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      className="w-4 h-4 text-[#00695C]"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-4 pt-2">
            <Button className="w-1/2 bg-black hover:bg-gray-700" onClick={handleSelect}>
              Välj
            </Button>
            <Button
              className="w-1/2 bg-black hover:bg-gray-700"
              onClick={handleClear}
            >
              Avmarkera
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
