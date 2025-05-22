"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function RequestEmailPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const amount = params.get("amount");
  const message = params.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount))) {
      alert("Invalid amount");
      return;
    }

    setLoading(true);

    try {
      const data = await addDoc(collection(db, "requests"), {
        amount: Number(amount),
        message: message || "",
        recipientEmail: email,
        requesterName: "Someone", // TODO: Make this dynamic
        createdAt: serverTimestamp(),
      });

      console.log("Document: ", data);

      alert("Request sent!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 mb-6 hover:underline flex items-center"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold text-center mb-8">Request Funds</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="To"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            disabled={loading}
          >
            {loading ? "Sending..." : "Finish Request"}
          </Button>
        </form>
      </div>
    </main>
  );
}
