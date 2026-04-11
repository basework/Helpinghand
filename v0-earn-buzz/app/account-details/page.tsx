import { getAllPaymentAccountDetails } from "@/lib/payment-account-details"

export default function AccountDetailsPage() {
  const details = getAllPaymentAccountDetails()

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Central Account Details</h1>
        <p className="text-sm text-slate-600">
          All payment pages now pull from a single source: <strong>/lib/payment-account-details.ts</strong>.
        </p>

        {Object.entries(details).map(([key, item]) => (
          <section key={key} className="rounded-xl border bg-white p-4">
            <h2 className="mb-2 text-base font-semibold capitalize text-slate-900">{key} account</h2>
            <div className="space-y-1 text-sm text-slate-700">
              <p>
                <span className="font-medium">Bank:</span> {item.bankName}
              </p>
              <p>
                <span className="font-medium">Account Number:</span> {item.accountNumber}
              </p>
              <p>
                <span className="font-medium">Account Name:</span> {item.accountName}
              </p>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
