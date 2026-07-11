import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedHero = await db.heroContent.upsert({
      where: { id: 1 },
      update: { title, description },
      create: { id: 1, title, description },
    });

    return NextResponse.json(updatedHero);
  } catch (error) {
    console.error("Error updating hero content:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
