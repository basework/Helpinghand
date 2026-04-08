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
        referral_code: "",
        referral_count: 0,
        referral_balance: 0 
      })
    }
    
    const supabase = await createClient()

    // Fetch the user's referral code from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("referral_code")
      .eq("id", userId)
      .maybeSingle()

    if (userError) throw userError

    const { referralCount, referralBalance } = await getProcessedReferralStats(supabase, userId)

    // Also compute pending referrals count (not processed)
    const { count: pendingCount, error: pendingError } = await supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", userId)
      .eq("processed", false)

    if (pendingError) throw pendingError

    return NextResponse.json({
      success: true,
      referral_code: user?.referral_code || "",
      referral_count: referralCount,
      referral_balance: referralBalance,
      pending_count: pendingCount
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ 
      success: false,
      referral_code: "",
      referral_count: 0,
      referral_balance: 0 
    })
  }
}