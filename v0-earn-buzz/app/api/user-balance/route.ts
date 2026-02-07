import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        balance: 100000,
        referral_balance: 0 
      })
    }
    
    const supabase = await createClient()
    
    // Get stored user balance
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("balance, referral_balance, referral_count")
      .eq("id", userId)
      .single()

    if (userError) throw userError

    const balance = user.balance || 100000

    // Compute referral stats from processed referrals (single source of truth)
    const { data: processedReferrals, error: refError } = await supabase
      .from("referrals")
      .select("amount")
      .eq("referrer_id", userId)
      .eq("processed", true)

    if (refError) {
      console.error("Error fetching referrals:", refError)
      return NextResponse.json({ success: true, balance, referral_balance: 0 })
    }

    const referralBalance = (processedReferrals || []).reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0)
    const referralCount = (processedReferrals || []).length

    // Optionally sync aggregated values back to users table for consistency
    const { error: updateError } = await supabase
      .from("users")
      .update({ referral_count: referralCount, referral_balance: referralBalance })
      .eq("id", userId)
    if (updateError) console.error("Sync error:", updateError)

    return NextResponse.json({
      success: true,
      balance: balance,
      referral_balance: referralBalance
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ 
      success: false,
      balance: 100000,
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