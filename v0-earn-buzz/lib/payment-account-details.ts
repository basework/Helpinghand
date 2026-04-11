export type PaymentAccountUseCase = "default" | "loan" | "momo"

export interface PaymentAccountDetails {
  bankName: string
  accountNumber: string
  accountName: string
}

const ACCOUNT_DETAILS_BY_USE_CASE: Record<PaymentAccountUseCase, PaymentAccountDetails> = {
  default: {
    bankName: "Sparkle",
    accountNumber: "1003072574",
    accountName: "Uchenna Solomon",
  },
  loan: {
    bankName: "Sparkle Bank",
    accountNumber: "1003072574",
    accountName: "Solomon Uchenna",
  },
  momo: {
    bankName: "Sparkle Bank",
    accountNumber: "1003072574",
    accountName: "Solomon Uchenna",
  },
}

export function getPaymentAccountDetails(options?: {
  useCase?: PaymentAccountUseCase
  selectedBankName?: string
}): PaymentAccountDetails {
  const useCase = options?.useCase || "default"
  const base = ACCOUNT_DETAILS_BY_USE_CASE[useCase]

  return {
    ...base,
    bankName: options?.selectedBankName?.trim() || base.bankName,
  }
}

export function getAllPaymentAccountDetails() {
  return ACCOUNT_DETAILS_BY_USE_CASE
}
