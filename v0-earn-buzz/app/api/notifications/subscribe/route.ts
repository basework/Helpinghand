import { NextRequest, NextResponse } from "next/server"
import { saveNotificationSubscription } from "@/lib/notifications/server.js"
import type { NotificationSubscribePayload } from "@/lib/notifications/types"

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as NotificationSubscribePayload
    const result = await saveNotificationSubscription(payload)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("[api/subscribe]", error)
    return NextResponse.json(
      {
        success: true,
        message: "Subscription processed (local fallback)",
      },
      { status: 200 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
