import { prisma } from "../client";

export async function seedCenterHolidays() {
  const centers = await prisma.gym_center.findMany();

  if (centers.length === 0) {
    console.log("⚠️ No gym centers found. Please seed gym centers first.");
    return;
  }

  // ✅ Fixed public holidays (same for all gyms, with names)
  const publicHolidays = [
    { name: "New Year", startDate: new Date("2025-01-01"), endDate: new Date("2025-01-01") },
    { name: "Independence Day", startDate: new Date("2025-08-15"), endDate: new Date("2025-08-15") },
    { name: "Gandhi Jayanti", startDate: new Date("2025-10-02"), endDate: new Date("2025-10-02") },
    { name: "Diwali", startDate: new Date("2025-10-20"), endDate: new Date("2025-10-20") },
    { name: "Christmas", startDate: new Date("2025-12-25"), endDate: new Date("2025-12-25") },
  ];

  // ✅ Generate 2 random gym-specific holidays per center
  function generateGymSpecificHolidays(year: number, centerName: string): { name: string; startDate: Date; endDate: Date }[] {
    const holidays: { name: string; startDate: Date; endDate: Date }[] = [];

    for (let i = 0; i < 2; i++) {
      const month = Math.floor(Math.random() * 12); // 0-11
      const day = 1 + Math.floor(Math.random() * 28); // safe for all months
      const start = new Date(year, month, day);
      const end = new Date(start); // single-day holiday
      holidays.push({
        name: `${centerName} Maintenance Holiday ${i + 1}`,
        startDate: start,
        endDate: end,
      });
    }

    return holidays;
  }

  // ✅ Seed holidays
  for (const center of centers) {
    const gymSpecific = generateGymSpecificHolidays(2025, center.center_name);
    const allHolidays = [...publicHolidays, ...gymSpecific]; // total 7

    for (const holiday of allHolidays) {
      await prisma.center_holiday.upsert({
        where: {
          center_id_startDate_endDate: {
            center_id: center.center_id,
            startDate: holiday.startDate,
            endDate: holiday.endDate,
          },
        },
        update: { name: holiday.name },
        create: {
          name: holiday.name,
          center_id: center.center_id,
          startDate: holiday.startDate,
          endDate: holiday.endDate,
        },
      });
    }
  }

  console.log("✅ 7 holidays (5 public + 2 gym-specific) seeded for all centers");
}
