"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // Send the code in the request body
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/integrations/gmail/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(() => {
          // Redirect back to integrations page after successful callback
          router.push("/integrations");
        })
        .catch((error) => {
          console.error("Error handling OAuth callback:", error);
        });
    }
  }, [searchParams, router]);

  return <div>Processing authentication...</div>;
}
