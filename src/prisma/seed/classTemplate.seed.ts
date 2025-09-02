import { prisma } from "../client";

export async function seedClassTemplates() {
  const centers = await prisma.gym_center.findMany();

  if (centers.length === 0) {
    console.log("⚠️ No centers found. Please seed gym centers first.");
    return;
  }

  for (const center of centers) {
    const templatesData = [
      {
        name: `${center.center_name} Yoga`,
        description: "Morning Yoga Class focused on flexibility and breathing",
        capacity: 20,
      },
      {
        name: `${center.center_name} Strength`,
        description: "Strength training with weights and resistance",
        capacity: 25,
      },
      {
        name: `${center.center_name} Cardio`,
        description: "High-intensity cardio workout",
        capacity: 30,
      },
    ];

    for (const template of templatesData) {
      await prisma.classTemplate.create({
        data: {
          name: template.name,
          description: template.description,
          capacity: template.capacity,
          center_id: center.center_id,
        },
      });
    }
  }

  console.log("✅ Class templates seeded for all gym centers");
}
