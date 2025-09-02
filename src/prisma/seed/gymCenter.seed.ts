import { prisma } from "../client";

export async function seedGymCenters() {
  const centersData = [
    // User 1 → 2 centers
    {
      manager_id: 1,
      centers: [
        { center_name: "Alpha Fitness", location: "Delhi", contact_no: "+911234567890" },
        { center_name: "Beta Fitness", location: "Mumbai", contact_no: "+911234567891" },
      ],
    },
    // User 2 → 3 centers
    {
      manager_id: 2,
      centers: [
        { center_name: "Gamma Gym", location: "Bangalore", contact_no: "+911234567892" },
        { center_name: "Delta Gym", location: "Pune", contact_no: "+911234567893" },
        { center_name: "Epsilon Gym", location: "Chennai", contact_no: "+911234567894" },
      ],
    },
    // User 3 → 2 centers
    {
      manager_id: 3,
      centers: [
        { center_name: "Zeta Fitness", location: "Hyderabad", contact_no: "+911234567895" },
        { center_name: "Eta Gym", location: "Kolkata", contact_no: "+911234567896" },
      ],
    },
    // User 4 → 3 centers
    {
      manager_id: 4,
      centers: [
        { center_name: "Theta Gym", location: "Ahmedabad", contact_no: "+911234567897" },
        { center_name: "Iota Fitness", location: "Jaipur", contact_no: "+911234567898" },
        { center_name: "Kappa Gym", location: "Lucknow", contact_no: "+911234567899" },
      ],
    },
  ];

  for (const manager of centersData) {
    for (const center of manager.centers) {
      await prisma.gym_center.create({
        data: {
          center_name: center.center_name,
          location: center.location,
          contact_no: center.contact_no,
          manager_id: manager.manager_id,
        },
      });
    }
  }

  console.log("✅ Gym centers seeded for users 1-4");
}
