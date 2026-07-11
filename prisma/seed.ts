import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Seed Admin User
  const adminEmail = "avniarslan77@gmail.com";
  const existingAdmin = await db.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.adminUser.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log("Admin user seeded.");
  } else {
    console.log("Admin user already exists.");
  }

  // Seed Hero Content
  const heroCount = await db.heroContent.count();
  if (heroCount === 0) {
    await db.heroContent.create({
      data: {
        id: 1,
        title: "Helping You Shine Online",
        description: "I am Avni, a developer passionate about building clean interfaces and solving complex database and economics problems.",
      },
    });
    console.log("Hero content seeded.");
  } else {
    console.log("Hero content already exists.");
  }

  // Seed Interests
  const interestCount = await db.interest.count();
  if (interestCount === 0) {
    await db.interest.createMany({
      data: [
        {
          title: "Artificial Intelligence & ML",
          description: "Exploring deep learning, neural networks, and prompt engineering.",
          order: 0,
        },
        {
          title: "Financial Markets",
          description: "Analyzing macroeconomic indicators and quantitative trading strategies.",
          order: 1,
        },
        {
          title: "Web Development",
          description: "Building fast, premium web experiences with React and Next.js.",
          order: 2,
        },
      ],
    });
    console.log("Interests seeded.");
  } else {
    console.log("Interests already exist.");
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
