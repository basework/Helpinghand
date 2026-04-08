import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    let referralCount = 0
    let referralBalance = 0

    try {
      const stats = await getProcessedReferralStats(supabase, userId)
      referralCount = stats.referralCount
      referralBalance = stats.referralBalance
    } catch (refError) {
      console.error("Error fetching referrals:", refError)
      return NextResponse.json({ success: true, balance, referral_balance: 0 })
    }

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