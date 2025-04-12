import {FaceSmileIcon} from '@heroicons/react/24/outline'

export default function BookingSuccessCard() {
    return (
      <div className="fixed inset-0 bg-[#BDBDBD]/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl px-10 py-8 text-center">
          <p className="text-lg font-semibold text-gray-800">Ditt rum är bokat!</p>
          <FaceSmileIcon className="h-7 w-7 text-primary mx-auto mt-4" />
        </div>
      </div>
    );
  }
  