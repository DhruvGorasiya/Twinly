"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/integrations/notion/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(() => {
          setStatus('success');
          setTimeout(() => {
            router.push("/integrations");
          }, 1500);
        })
        .catch((error) => {
          console.error("Error handling Notion OAuth callback:", error);
          setStatus('error');
          setError(error.message);
        });
    } else {
      setStatus('error');
      setError('No authorization code received');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 via-[#0f0f12] to-zinc-900">
      <div className="text-center">
        {status === 'processing' && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white">Processing Notion authentication...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="text-green-500">
            <p>Notion authentication successful! Redirecting...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-500">
            <p>Error: {error}</p>
            <button 
              onClick={() => router.push("/integrations")}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Return to Integrations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NotionOAuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 via-[#0f0f12] to-zinc-900">
        <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
} 