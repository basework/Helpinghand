import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const supabase = await createClient()

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, referral_code, password, referred_by, created_at")
      .eq("id", userId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Compute referral stats from processed referrals (single source of truth)
    const { data: processedReferrals, error: refError } = await supabase
      .from("referrals")
      .select("amount")
      .eq("referrer_id", userId)
      .eq("processed", true)

    if (refError) {
      console.error("Error fetching referrals:", refError)
      return NextResponse.json({
        success: true,
        user: {
          ...user,
          referral_count: 0,
          referral_balance: 0,
        },
      })
    }

    const referralBalance = (processedReferrals || []).reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0)
    const referralCount = (processedReferrals || []).length

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        referral_count: referralCount,
        referral_balance: referralBalance,
      },
    })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}