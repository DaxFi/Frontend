"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import { useTheme } from "@/components/providers/appThemeProvider";

const MOCK_CREATORS = [
  {
    handle: "@filmtub",
    image: "/movie.png",
    pricing: { weekly: 2, monthly: 5, yearly: 50 },
  },
  {
    handle: "@frenchwithmarie",
    image: "/france.png",
    pricing: { weekly: 3, monthly: 6, yearly: 60 },
  },
  {
    handle: "@indiecoffee",
    image: "/coffee.png",
    pricing: { weekly: 1.5, monthly: 4, yearly: 45 },
  },
];

export default function NewSubscriptionPage() {
  const router = useRouter();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [query, setQuery] = useState("");
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [message, setMessage] = useState("");

  const suggestions = MOCK_CREATORS.filter((c) =>
    c.handle.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedCreator = MOCK_CREATORS.find((c) => c.handle === selectedHandle);
  const currentPrice = selectedCreator?.pricing[selectedPlan] ?? 0;

  const bg = isDark ? "bg-[#0D0E12]" : "bg-gradient-to-br from-gray-50 to-gray-100";
  const card = isDark ? "bg-[#16181D]" : "bg-white";
  const text = isDark ? "text-white" : "text-gray-900";
  const border = isDark ? "border-gray-700" : "border-gray-300";
  const placeholder = isDark ? "placeholder-gray-400" : "placeholder-gray-500";

  return (
    <main className={`min-h-screen flex items-center justify-center ${bg} py-16 px-4`}>
      <div className={`w-full max-w-md ${card} rounded-2xl shadow-xl p-8`}>
        <button
          onClick={() => router.back()}
          className={`text-sm mb-6 flex items-center gap-1 cursor-pointer ${isDark ? "text-gray-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-500"}`}
        >
          <FaArrowLeft size={14} /> Back
        </button>
        <h1 className={`text-2xl text-center font-bold mb-6 ${text}`}>New Subscription</h1>
        {/* Handle Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaUser />
          </div>
          <input
            type="text"
            value={query}
            placeholder="@subscription"
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedHandle(null); // Reset selection
            }}
            className={`w-full pl-10 pr-4 py-2 rounded-md border ${border} bg-transparent focus:outline-none ${placeholder} ${text}`}
          />

          {/* Suggestions Dropdown */}
          {query.length > 1 && !selectedHandle && suggestions.length > 0 && (
            <ul
              className={`absolute z-10 mt-1 w-full rounded-md shadow-md max-h-48 overflow-auto border ${border} ${
                isDark ? "bg-[#1C1F26]" : "bg-white"
              }`}
            >
              {suggestions.map((creator) => (
                <li
                  key={creator.handle}
                  className={`${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} flex items-center gap-2 px-4 py-2 cursor-pointer`}
                  onClick={() => {
                    setSelectedHandle(creator.handle);
                    setQuery(creator.handle);
                  }}
                >
                  <img src={creator.image} alt={creator.handle} className="w-6 h-6 rounded-full" />
                  <span className={`${text}`}>{creator.handle}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pricing + Plan */}
        {selectedHandle && (
          <>
            <div className="flex gap-2 mb-4">
              <div
                className={`w-1/2 text-center py-2 rounded-md border ${border} ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"} cursor-not-allowed`}
                title="Price is set by creator"
              >
                ${currentPrice}
              </div>

              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value as "weekly" | "monthly" | "yearly")}
                className={`w-1/2 py-2 px-4 rounded-md border ${border} bg-transparent ${text}`}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Message */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message (optional)"
              className={`w-full px-3 py-2 border ${border} rounded-md focus:outline-none ${placeholder} ${text} bg-transparent mb-4`}
            />
          </>
        )}

        {/* Submit */}
        <button
          className={`w-full font-semibold py-2 px-4 rounded-md transition text-white cursor-pointer ${
            selectedHandle && selectedPlan
              ? "bg-gradient-to-r from-[#005AE2] to-[#0074FF] hover:brightness-110"
              : "bg-gray-500 cursor-not-allowed opacity-50"
          }`}
          onClick={() => alert("Mock: Subscribed!")}
          disabled={!selectedHandle || !selectedPlan}
        >
          Review & Subscribe
        </button>
      </div>
    </main>
  );
}
