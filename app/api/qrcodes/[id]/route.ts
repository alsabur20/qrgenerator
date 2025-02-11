import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized", data: {} }, { status: 401 });
  }

  try {
    const { id } = await context.params; // Await params if you explicitly want to use Promise
    const qrCode = await prisma.qRCode.findUnique({
      where: { id, userId },
    });

    if (!qrCode) {
      return NextResponse.json({ success: false, message: "QR code not found", data: {} }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "QR code fetched successfully", data: qrCode });
  } catch {
    return NextResponse.json({ success: false, message: "Error fetching QR code", data: {} }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized", data: {} }, { status: 401 });
  }

  try {
    const { id } = await context.params; // Await params here
    await prisma.qRCode.delete({
      where: { id, userId },
    });

    return NextResponse.json({ success: true, message: "QR code deleted successfully", data: {} });
  } catch {
    return NextResponse.json({ success: false, message: "Error deleting QR code", data: {} }, { status: 500 });
  }
}
