import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized", data: [] }, { status: 401 })
  }

  try {
    const qrCodes = await prisma.qRCode.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, message: "QR codes fetched successfully", data: qrCodes })
  } catch {
    return NextResponse.json({ success: false, message: "Error fetching QR codes", data: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized", data: {} }, { status: 401 })
  }

  try {
    const { url } = await request.json()
    const newQRCode = await prisma.qRCode.create({
      data: { url, userId },
    })
    return NextResponse.json(
      { success: true, message: "QR code created successfully", data: newQRCode },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ success: false, message: "Error creating QR code", data: {} }, { status: 500 })
  }
}

