import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

useEffect(() => {
  if (statusParam === "success") {
    setStatus("success");
  } else if (statusParam === "error") {
    setStatus("error");
  } else {
    setStatus("error"); // fallback for no param
  }
}, [statusParam]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {status === "loading" && <p className="text-gray-600">Verifying...</p>}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Email Verified!</h2>
            <p className="text-gray-700">You can now log in to your account.</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-2">❌ Verification Failed</h2>
            <p className="text-gray-700">This link may be invalid or expired.</p>
          </>
        )}
      </div>
    </div>
  );
}
