import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase/admin"

/**
 * POST /api/referral-qualification-check
 * Validates and updates referral status for a given user
 * Called when user balance changes (task completion, etc)
 */
export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      )
    }

    // Get user's current balance
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, balance")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userBalance = user.balance || 0

    // If user has reached 60,000, update their referrals to COMPLETED
    if (userBalance >= 60000) {
      const { error: updateError } = await supabase
        .from("referrals")
        .update({ status: "COMPLETED" })
        .eq("referred_id", userId)
        .eq("status", "PENDING")

      if (updateError) {
        console.error("Error updating referral status:", updateError)
        return NextResponse.json(
          { error: "Failed to update referral status" },
          { status: 500 }
        )
      }

      // Get count of newly completed referrals
      const { count: completedCount, error: countError } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("referred_id", userId)
        .eq("status", "COMPLETED")

      return NextResponse.json({
        success: true,
        qualified: true,
        userBalance,
        completedReferrals: completedCount || 0,
        message: `User balance reached 60,000. Referral(s) marked as COMPLETED.`,
      })
    }

    // Check pending referrals for this user
    const { data: pendingReferrals, error: pendingError } = await supabase
      .from("referrals")
      .select("id, status")
      .eq("referred_id", userId)
      .eq("status", "PENDING")

    if (pendingError) {
      console.error("Error fetching pending referrals:", pendingError)
      return NextResponse.json(
        { error: "Failed to fetch referral data" },
        { status: 500 }
      )
    }

    const earnedAmount = Math.max(userBalance - 50000, 0)

    return NextResponse.json({
      success: true,
      qualified: false,
      userBalance,
      earnedAmount,
      earningsNeeded: Math.max(10000 - earnedAmount, 0),
      balanceNeeded: Math.max(60000 - userBalance, 0),
      pendingReferrals: pendingReferrals?.length || 0,
      message: `User needs ₦${Math.max(60000 - userBalance, 0)} more to qualify.`,
    })
  } catch (error) {
    console.error("[referral-qualification-check] Error:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/referral-qualification-check?userId=<userId>
 * Retrieves referral qualification status for a user (read-only)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      )
    }

    // Get user's balance
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, balance")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userBalance = user.balance || 0
    const earnedAmount = Math.max(userBalance - 50000, 0)
    const qualified = userBalance >= 60000

    // Get referral counts
    const { count: completedCount, error: completedError } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referred_id", userId)
      .eq("status", "COMPLETED")

    const { count: pendingCount, error: pendingError } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referred_id", userId)
      .eq("status", "PENDING")

    return NextResponse.json({
      success: true,
      userId,
      userBalance,
      earnedAmount,
      qualified,
      earningsNeeded: Math.max(10000 - earnedAmount, 0),
      balanceNeeded: Math.max(60000 - userBalance, 0),
      completedReferrals: completedCount || 0,
      pendingReferrals: pendingCount || 0,
    })
  } catch (error) {
    console.error("[referral-qualification-check] GET Error:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
