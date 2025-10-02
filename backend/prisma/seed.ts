import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/utils/crypto";

const prisma = new PrismaClient();

const sampleProperties = [
  {
    title: "4 Bedroom Duplex in Lekki",
    description:
      "Beautiful 4 bedroom duplex with modern amenities in a serene environment",
    price: 85000000,
    state: "Lagos",
    city: "Lekki",
    neighborhood: "Lekki Phase 1",
    address: "15 Admiralty Way, Lekki Phase 1, Lagos",
    propertyType: "HOUSE" as const,
    listingType: "SALE" as const,
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    contactName: "Adebayo Johnson",
    contactPhone: "+2348012345678",
    contactEmail: "adebayo@example.com",
  },
  {
    title: "2 Bedroom Apartment in Victoria Island",
    description: "Luxury 2 bedroom apartment with ocean view and 24/7 security",
    price: 3500000,
    state: "Lagos",
    city: "Victoria Island",
    address: "45 Ahmadu Bello Way, Victoria Island, Lagos",
    propertyType: "APARTMENT" as const,
    listingType: "RENT" as const,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    contactName: "Fatima Abdullahi",
    contactPhone: "+2348087654321",
    contactEmail: "fatima@example.com",
  },
  {
    title: "1000sqm Land in Abuja",
    description: "Prime commercial land in the heart of Abuja with C of O",
    price: 45000000,
    state: "Abuja",
    city: "Wuse",
    address: "Plot 123, Wuse Zone 4, Abuja",
    propertyType: "LAND" as const,
    listingType: "SALE" as const,
    area: 1000,
    contactName: "Ibrahim Musa",
    contactPhone: "+2348098765432",
    contactEmail: "ibrahim@example.com",
  },
  {
    title: "3 Bedroom Bungalow in Ibadan",
    description:
      "Spacious 3 bedroom bungalow with large compound and parking space",
    price: 25000000,
    state: "Oyo",
    city: "Ibadan North",
    neighborhood: "Bodija",
    address: "78 Bodija Estate, Ibadan, Oyo State",
    propertyType: "HOUSE" as const,
    listingType: "SALE" as const,
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    contactName: "Chioma Okafor",
    contactPhone: "+2348076543210",
    contactEmail: "chioma@example.com",
  },
  {
    title: "Studio Apartment in Yaba",
    description: "Modern studio apartment perfect for young professionals",
    price: 800000,
    state: "Lagos",
    city: "Yaba",
    address: "12 Herbert Macaulay Street, Yaba, Lagos",
    propertyType: "APARTMENT" as const,
    listingType: "RENT" as const,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    contactName: "Emeka Okonkwo",
    contactPhone: "+2348065432109",
    contactEmail: "emeka@example.com",
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create sample users
  const hashedPassword = await hashPassword("Password123!");

  const users = [
    {
      id: "demo-buyer",
      email: "buyer@realestatehub.com",
      password: hashedPassword,
      name: "Demo Buyer",
      role: UserRole.BUYER,
      isEmailVerified: true,
    },
    {
      id: "demo-seller",
      email: "seller@realestatehub.com",
      password: hashedPassword,
      name: "Demo Seller",
      role: UserRole.SELLER,
      isEmailVerified: true,
    },
    {
      id: "demo-agent",
      email: "agent@realestatehub.com",
      password: hashedPassword,
      name: "Demo Agent",
      role: UserRole.AGENT,
      isEmailVerified: true,
    },
    {
      id: "demo-admin",
      email: "admin@realestatehub.com",
      password: hashedPassword,
      name: "Demo Admin",
      role: "ADMIN" as const,
      isEmailVerified: true,
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✅ Created user: ${user.email} (${user.role})`);
  }

  // Create sample properties with proper user ownership
  const seller = await prisma.user.findUnique({
    where: { email: "seller@realestatehub.com" },
  });
  const agent = await prisma.user.findUnique({
    where: { email: "agent@realestatehub.com" },
  });

  if (!seller || !agent) {
    throw new Error("Users not found");
  }

  const propertiesWithUsers = sampleProperties.map((property, index) => ({
    ...property,
    userId: index % 2 === 0 ? seller.id : agent.id, // Alternate between seller and agent
  }));

  for (const propertyData of propertiesWithUsers) {
    const property = await prisma.property.create({
      data: propertyData,
    });
    console.log(`✅ Created property: ${property.title}`);
  }

  console.log("🎉 Database seeding completed!");
  console.log("📧 Demo accounts:");
  console.log("   Buyer: buyer@realestatehub.com / Password123!");
  console.log("   Seller: seller@realestatehub.com / Password123!");
  console.log("   Agent: agent@realestatehub.com / Password123!");
  console.log("   Admin: admin@realestatehub.com / Password123!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
