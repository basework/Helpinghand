import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    // Compute referral stats from processed referrals only
    const { data: processedReferrals, error: refError } = await supabase
      .from("referrals")
      .select("amount")
      .eq("referrer_id", userId)
      .eq("processed", true)

    if (refError) throw refError

    const referralCount = (processedReferrals || []).length
    const referralBalance = (processedReferrals || []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0)

    return NextResponse.json({
      success: true,
      referral_code: user?.referral_code || "",
      referral_count: referralCount,
      referral_balance: referralBalance
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