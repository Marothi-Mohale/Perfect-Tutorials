"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useState } from "react";
import { publicEnv } from "@/lib/env";

type ApiError = {
  success?: false;
  message?: string;
};

type CheckoutButtonProps = {
  packageId: string;
  className?: string;
  children: ReactNode;
};

export function CheckoutButton({
  packageId,
  className,
  children,
}: CheckoutButtonProps) {
  const { userId } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${publicEnv.apiBaseUrl}/payments/checkout-sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageId,
            clerkUserId: userId ?? undefined,
            customerEmail: user?.primaryEmailAddress?.emailAddress ?? undefined,
          }),
        },
      );

      const payload = (await response.json()) as
        | {
            success: true;
            data: { checkoutUrl: string };
          }
        | ApiError;

      if (!response.ok || !("success" in payload) || !payload.success) {
        setErrorMessage(
          "message" in payload
            ? (payload.message ?? "We could not start checkout right now.")
            : "We could not start checkout right now.",
        );
        return;
      }

      window.location.assign(payload.data.checkoutUrl);
    } catch {
      setErrorMessage("We could not connect to checkout right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className={clsx(
          "inline-flex w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-70",
          className,
        )}
      >
        {isLoading ? "Redirecting..." : children}
      </button>
      {errorMessage ? (
        <p className="mt-3 text-sm text-[#9f2a2a]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
