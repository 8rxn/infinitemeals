"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="w-screen min-h-screen flex-col flex gap-6">
        <h2 className="text-center">Something went wrong!</h2>
        <div className="flex gap-2">
        <button onClick={() => reset()}>Try again</button>
        <Link href={"/"}>Go Back Home</Link>
        </div>
      </body>
    </html>
  );
}
