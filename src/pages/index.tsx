import { useRouter } from 'next/router';
import Button from "@/components/button";

export default function Home() {

  const router = useRouter();

  const handleBookingClick = () => {
    router.push('/booking');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="flex flex-col justify-between w-full max-w-md min-h-[80vh] bg-foreground rounded-xl p-8">
        <h1 className="text-5xl font-bold leading-tight text-primary">
          Boka ett <br /> rum
        </h1>

        <div className="w-full mt-12">
        <Button onClick={handleBookingClick} >Boka</Button>
        </div>
      </div>
    </main>
  );
}
