import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SendPage from "@/app/send/page";
import * as nextNavigation from "next/navigation";

// --- MOCK MODULES ---

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  fetchHandleSuggestions: jest.fn().mockResolvedValue(["validhandle"]),
  inferRecipientInputType: jest.fn().mockReturnValue("handle"),
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// --- TEST CASE ---

describe("SendPage", () => {
  it("navigates to confirm-transaction with valid input", async () => {
    const push = jest.fn();
    const back = jest.fn();

    // Override the mocked useRouter return value
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push, back });

    render(<SendPage />);

    // Fill in recipient
    fireEvent.change(screen.getByLabelText(/to/i), {
      target: { value: "@validhandle" },
    });

    // Fill in amount
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "25" },
    });

    // Wait for async suggestion fetch and setState
    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toHaveValue(25);
    });

    // Click "Review & Send" button
    fireEvent.click(screen.getByRole("button", { name: /reviewAndSend/i }));

    // Check that router.push was called with expected query string
    await waitFor(() => {
      expect(push).toHaveBeenCalled();
    });

    const pushedUrl = push.mock.calls[0][0] as string;
    expect(pushedUrl).toMatch(/^\/confirm-transaction\?/);
    expect(pushedUrl).toContain("recipient=validhandle");
    expect(pushedUrl).toContain("amount=25");
  });
});
