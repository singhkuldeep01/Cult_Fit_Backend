import { prisma } from "../client";

export async function seedCenterHolidays() {
  const centers = await prisma.gym_center.findMany();

  if (centers.length === 0) {
    console.log("⚠️ No gym centers found. Please seed gym centers first.");
    return;
  }

  // ✅ Fixed public holidays (same for all gyms, with names)
  const publicHolidays = [
    { name: "New Year", holidayDate: new Date("2025-01-01") },
    { name: "Independence Day", holidayDate: new Date("2025-08-15") },
    { name: "Gandhi Jayanti", holidayDate: new Date("2025-10-02") },
    { name: "Diwali", holidayDate: new Date("2025-10-20") },
    { name: "Christmas", holidayDate: new Date("2025-12-25") },
  ];

  // ✅ Generate 2 random gym-specific holidays per center
  function generateGymSpecificHolidays(year: number, centerName: string): { name: string; holidayDate: Date }[] {
    const holidays: { name: string; holidayDate: Date }[] = [];

    for (let i = 0; i < 2; i++) {
      const month = Math.floor(Math.random() * 12); // 0-11
      const day = 1 + Math.floor(Math.random() * 28); // safe for all months
      const holidayDate = new Date(year, month, day);
      holidays.push({
        name: `${centerName} Maintenance Holiday ${i + 1}`,
        holidayDate,
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
          center_id_holidayDate: {
            center_id: center.center_id,
            holidayDate: holiday.holidayDate,
          },
        },
        update: { name: holiday.name },
        create: {
          name: holiday.name,
          center_id: center.center_id,
          holidayDate: holiday.holidayDate,
        },
      });
    }
  }

  console.log("✅ 7 holidays (5 public + 2 gym-specific) seeded for all centers");
}
