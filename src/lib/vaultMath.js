export function validateDepositAmount(amount) {
  const numericAmount = Number(amount);

  if (!amount || Number.isNaN(numericAmount)) {
    return {
      valid: false,
      message: "Please enter a valid deposit amount."
    };
  }

  if (numericAmount <= 0) {
    return {
      valid: false,
      message: "Deposit amount must be greater than 0 XLM."
    };
  }

  if (numericAmount < 0.1) {
    return {
      valid: false,
      message: "Minimum deposit is 0.1 XLM for this demo vault."
    };
  }

  return {
    valid: true,
    message: "Valid deposit amount."
  };
}

export function getProgressPercent(currentAmount, goalAmount) {
  const current = Number(currentAmount);
  const goal = Number(goalAmount);

  if (!goal || goal <= 0) {
    return 0;
  }

  const progress = (current / goal) * 100;

  return Math.min(Math.round(progress), 100);
}

export function calculateProjectedSavings({
  currentAmount,
  monthlyDeposit,
  apy,
  months
}) {
  const current = Number(currentAmount) || 0;
  const monthly = Number(monthlyDeposit) || 0;
  const annualRate = Number(apy) / 100 || 0;
  const totalMonths = Number(months) || 0;

  let balance = current;

  for (let i = 0; i < totalMonths; i += 1) {
    balance += monthly;
    balance *= 1 + annualRate / 12;
  }

  return Number(balance.toFixed(2));
}

export function createVaultRecord({
  walletAddress = "Demo Wallet",
  vaultAddress = "Demo Vault",
  amount,
  txHash
}) {
  return {
    id: `${Date.now()}-${txHash.slice(0, 8)}`,
    walletAddress,
    vaultAddress,
    amount: Number(amount),
    txHash,
    createdAt: new Date().toISOString(),
    network: "Stellar Testnet",
    status: "success"
  };
}