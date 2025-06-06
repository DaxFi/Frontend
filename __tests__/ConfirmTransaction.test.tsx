import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfirmSendPage from "@/app/confirm-transaction/page";
import { useRouter, useSearchParams } from "next/navigation";
import { useSigner, useUser } from "@account-kit/react";
import * as utils from "@/lib/utils";
import * as payments from "@/lib/payments";

// --- MOCK MODULES ---

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  convertUSDToEther: jest.fn().mockReturnValue("0.01"),
  isOnDaxFi: jest.fn(),
  resolveRecipientWalletAddress: jest.fn().mockResolvedValue("0xRecipient"),
  fetchHandleSuggestions: jest.fn().mockResolvedValue(["validhandle"]),
  inferRecipientInputType: jest.fn().mockReturnValue("handle"),
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

jest.mock("@/app/utils/contracts", () => ({
  sendPendingClaim: jest.fn().mockResolvedValue({ hash: "0xFAKEHASH" }),
}));

jest.mock("@/lib/payments", () => ({
  sendPayment: jest.fn(),
}));

jest.mock("@account-kit/react", () => ({
  useSigner: jest.fn(),
  useUser: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// --- TEST CASE ---

describe("ConfirmSendPage", () => {
  it("sends pending claim and writes to Firestore", async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSearchParams as jest.Mock).mockReturnValue({
      entries: () =>
        [
          ["recipient", "test@example.com"],
          ["amount", "10"],
          ["message", "Hi"],
        ][Symbol.iterator](),
    });

    (useSigner as jest.Mock).mockReturnValue({
      getAddress: async () => "0xSENDER",
    });
    (useUser as jest.Mock).mockReturnValue({ email: "alice@example.com" });
    (utils.isOnDaxFi as jest.Mock).mockResolvedValue(false);

    render(<ConfirmSendPage />);

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/status?state=success&to=test@example.com&amount=10");
    });
  });

  it("sends direct payment if recipient is on DaxFi", async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSearchParams as jest.Mock).mockReturnValue({
      entries: () =>
        [
          ["recipient", "bob@example.com"],
          ["amount", "15"],
          ["message", "Test"],
        ][Symbol.iterator](),
    });

    (useSigner as jest.Mock).mockReturnValue({
      getAddress: async () => "0xSENDER",
    });
    (useUser as jest.Mock).mockReturnValue({ email: "bob@example.com" });
    (utils.isOnDaxFi as jest.Mock).mockResolvedValue(true);

    render(<ConfirmSendPage />);

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(payments.sendPayment).toHaveBeenCalledWith({
        signer: expect.anything(),
        to: "0xRecipient",
        message: "Test",
        amountEth: "0.01",
      });
      expect(push).toHaveBeenCalledWith("/status?state=success&to=bob@example.com&amount=15");
    });
  });
});
