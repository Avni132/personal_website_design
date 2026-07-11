import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Middleware verification helper
async function verifySession() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function POST(req: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, order } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newInterest = await db.interest.create({
      data: {
        title,
        description,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json(newInterest, { status: 201 });
  } catch (error) {
    console.error("Error creating interest:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, description, order } = await req.json();
    if (!id || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedInterest = await db.interest.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json(updatedInterest);
  } catch (error) {
    console.error("Error updating interest:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await db.interest.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting interest:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
