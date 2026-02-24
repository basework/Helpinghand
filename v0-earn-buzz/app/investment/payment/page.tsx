"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Bank, CreditCard } from "lucide-react";

export default function InvestmentPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amountParam = searchParams.get("amount") || "";
  const planParam = searchParams.get("plan") || "";
  const numeric = parseInt((amountParam || "").toString().replace(/[^\d]/g, ""), 10);
  const displayAmount = Number.isNaN(numeric) ? amountParam : `₦${numeric.toLocaleString("en-NG")}`;

  return (
    <div className="hh-root min-h-screen pb-28 relative overflow-hidden">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="hh-card p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Investment Payment</h1>
              {planParam && (
                <p className="text-sm text-white/50 mt-1">Plan: {decodeURIComponent(planParam)}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-white/50">Amount to Pay</div>
              <div className="text-3xl font-extrabold text-emerald-400">{displayAmount}</div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <Bank className="w-5 h-5 text-emerald-300" />
                <div>
                  <div className="text-sm text-white/70">Bank Transfer</div>
                  <div className="text-xs text-white/40">Instant verification for most banks.</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push(`/withdraw/bank-transfer?amount=${numeric || amountParam}`)}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium"
              >
                Pay via Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => alert("Card payments not configured in demo")}
                className="flex-1 py-3 bg-white/5 text-white rounded-xl font-medium border border-white/10"
              >
                Pay with Card
              </button>
            </div>

            <div className="pt-4">
              <Link href="/investment" className="text-sm text-white/60">Back to investments</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
