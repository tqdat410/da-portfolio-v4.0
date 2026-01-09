"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-light-mint mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-sea-green text-light-mint rounded hover:bg-emerald transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
