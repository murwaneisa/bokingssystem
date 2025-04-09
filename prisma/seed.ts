const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      { name: 'Victoria Norling', email: 'victoria@abc.com' },
      { name: 'John Doe', email: 'john@xyz.com' },
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Emily Davis', email: 'emily@example.com' },
      { name: 'Michael Brown', email: 'michael@example.com' },
      { name: 'Lisa Martin', email: 'lisa@example.com' },
      { name: 'Daniel Lee', email: 'daniel@example.com' },
    ],
  });

  // Seed Rooms (from Figma)
  const roomsData = [
    { name: 'Ada', capacity: 10, features: ['Whiteboard', 'TV'] },
    { name: 'Steve', capacity: 6, features: ['Whiteboard'] },
    { name: 'Margret', capacity: 4, features: ['Whiteboard'] },
    { name: 'Edmund', capacity: 10, features: ['TV'] },
    { name: 'Grace', capacity: 20, features: ['Whiteboard', 'Projector'] },
  ];

  const roomPromises = roomsData.map(room =>
    prisma.room.create({ data: room })
  );
  const rooms = await Promise.all(roomPromises);

  // Define 3 seed days: today, tomorrow, day after
  const baseDate = new Date();
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Figma-like time slots: 08:00 – 17:00, one-hour intervals
  const timeRanges = [
    ['08:00', '09:00'],
    ['09:00', '10:00'],
    ['10:00', '11:00'],
    ['11:00', '12:00'],
    ['13:00', '14:00'],
    ['14:00', '15:00'],
    ['15:00', '16:00'],
    ['16:00', '17:00'],
  ];

  for (const room of rooms) {
    for (const date of dates) {
      for (const [start, end] of timeRanges) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);

        const startTime = new Date(date);
        startTime.setHours(sh, sm, 0);

        const endTime = new Date(date);
        endTime.setHours(eh, em, 0);

        await prisma.timeSlot.create({
          data: {
            roomId: room.id,
            date: new Date(date),
            startTime,
            endTime,
          },
        });
      }
    }
  }

  console.log('Database seeded with users, rooms, and time slots!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
