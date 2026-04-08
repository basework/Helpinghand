import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getProcessedReferralStats(supabase: any, userId: string) {
  const { count: referralCount, error: countError } = await supabase
    .from("referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", userId)
    .eq("processed", true)

  if (countError) throw countError

  const pageSize = 1000
  let from = 0
  let referralBalance = 0

  while (true) {
    const { data, error } = await supabase
      .from("referrals")
      .select("amount")
      .eq("referrer_id", userId)
      .eq("processed", true)
      .range(from, from + pageSize - 1)

    if (error) throw error
    if (!data || data.length === 0) break

    referralBalance += data.reduce((sum: number, row: any) => sum + Number(row.amount || 0), 0)

    if (data.length < pageSize) break
    from += pageSize
  }

  return {
    referralCount: referralCount || 0,
    referralBalance,
  }
}

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

    let referralCount = 0
    let referralBalance = 0

    try {
      const stats = await getProcessedReferralStats(supabase, userId)
      referralCount = stats.referralCount
      referralBalance = stats.referralBalance
    } catch (refError) {
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

    return NextResponse.json(
      {
        success: true,
        user: {
          ...user,
          referral_count: referralCount,
          referral_balance: referralBalance,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}