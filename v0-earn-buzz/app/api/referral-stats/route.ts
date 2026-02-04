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
    
    // Get stored values (trust signup's direct update—no buggy live sync)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("referral_code, referral_count, referral_balance")
      .eq("id", userId)
      .single()

    if (userError) throw userError

    const referralCount = user.referral_count || 0
    const referralBalance = user.referral_balance || 0
    
      // Get detailed referral information with status
      const { data: referrals, error: referralsError } = await supabase
        .from("referrals")
        .select(`
          id,
          referred_id,
          status,
          created_at,
          users:referred_id(name, email, balance)
        `)
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false })
    
      const referralDetails = referrals?.map((ref: any) => ({
        id: ref.id,
        referred_id: ref.referred_id,
        name: ref.users?.name || "Unknown",
        email: ref.users?.email || "",
        status: ref.status || "PENDING",
        balance: ref.users?.balance || 0,
        created_at: ref.created_at,
      })) || []

    return NextResponse.json({
      success: true,
      referral_code: user.referral_code || "",
      referral_count: referralCount,
      referral_balance: referralBalance
        referrals: referralDetails,
        completed_count: referralDetails.filter((r: any) => r.status === "COMPLETED").length,
        pending_count: referralDetails.filter((r: any) => r.status === "PENDING").length,
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