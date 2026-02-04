import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        balance: 50000,
        referral_balance: 0 
      })
    }
    
    const supabase = await createClient()
    
    // Get stored values
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("balance, referral_balance, referral_count")
      .eq("id", userId)
      .single()

    if (userError) throw userError

    let balance = user.balance || 50000
    let referralBalance = user.referral_balance || 0
    let referralCount = user.referral_count || 0

    // Live sync for referral (optional, but fixed)
    const { count: liveCount, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", userId)

    if (!countError && liveCount != null && liveCount !== referralCount) {
      referralCount = liveCount
      referralBalance = liveCount * 10000
      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          referral_count: referralCount, 
          referral_balance: referralBalance 
        })
        .eq("id", userId)
      if (updateError) console.error("Sync error:", updateError)
    }

    return NextResponse.json({
      success: true,
      balance: balance,
      referral_balance: referralBalance
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ 
      success: false,
      balance: 50000,
      referral_balance: 0 
    })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, balance } = await request.json()

    if (!userId || typeof balance !== 'number') {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("users")
      .update({ balance })
      .eq("id", userId)

    if (error) throw error

    return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Update error:", error)
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
  }

  /**
   * PUT /api/user-balance
   * Updates user balance and triggers referral qualification check
   */
  export async function PUT(request: Request) {
    try {
      const { userId, balance } = await request.json()

      if (!userId || typeof balance !== 'number') {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 })
      }

      const supabase = await createClient()

      const { error } = await supabase
        .from("users")
        .update({ balance })
        .eq("id", userId)

      if (error) throw error

      // Trigger referral qualification check (fire and forget)
      // Check if balance crossed 60,000 threshold
      if (balance >= 60000) {
        const qualificationCheck = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/referral-qualification-check`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }
        ).catch((err) => {
          console.error("Referral qualification check failed:", err)
        })
      }

      return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}