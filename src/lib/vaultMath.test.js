import { describe, expect, it } from "vitest";
import {
  calculateProjectedSavings,
  createVaultRecord,
  getProgressPercent,
  validateDepositAmount
} from "./vaultMath";

describe("validateDepositAmount", () => {
  it("rejects empty deposit amount", () => {
    const result = validateDepositAmount("");

    expect(result.valid).toBe(false);
    expect(result.message).toBe("Please enter a valid deposit amount.");
  });

  it("rejects deposit amount below minimum", () => {
    const result = validateDepositAmount("0.05");

    expect(result.valid).toBe(false);
    expect(result.message).toBe("Minimum deposit is 0.1 XLM for this demo vault.");
  });

  it("accepts valid deposit amount", () => {
    const result = validateDepositAmount("1.5");

    expect(result.valid).toBe(true);
    expect(result.message).toBe("Valid deposit amount.");
  });
});

describe("getProgressPercent", () => {
  it("calculates progress percentage correctly", () => {
    expect(getProgressPercent(25, 100)).toBe(25);
  });

  it("caps progress at 100 percent", () => {
    expect(getProgressPercent(150, 100)).toBe(100);
  });

  it("returns 0 when goal amount is invalid", () => {
    expect(getProgressPercent(10, 0)).toBe(0);
  });
});

describe("calculateProjectedSavings", () => {
  it("calculates projected savings after monthly deposits and APY", () => {
    const result = calculateProjectedSavings({
      currentAmount: 10,
      monthlyDeposit: 10,
      apy: 12,
      months: 2
    });

    expect(result).toBeGreaterThan(30);
  });

  it("returns current amount when months is 0", () => {
    const result = calculateProjectedSavings({
      currentAmount: 20,
      monthlyDeposit: 10,
      apy: 5,
      months: 0
    });

    expect(result).toBe(20);
  });
});

describe("createVaultRecord", () => {
  it("creates a successful vault record", () => {
    const record = createVaultRecord({
      walletAddress: "GUSER",
      vaultAddress: "GVAULT",
      amount: "5",
      txHash: "abcdef1234567890"
    });

    expect(record.amount).toBe(5);
    expect(record.status).toBe("success");
    expect(record.network).toBe("Stellar Testnet");
    expect(record.txHash).toBe("abcdef1234567890");
  });
});