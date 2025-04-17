import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useState } from "react";

export default function LandingPage() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const fakeResponse = { success: true, result: [{ result: 2 }] };
      setApiResponse(JSON.stringify(fakeResponse));
    } catch (err) {
      setApiResponse("Mock request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-red-300">
      <CardContent className="p-6 flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-bold text-red-600 text-center">
          Welcome to OpenBench
        </h1>
        <p className="text-center text-gray-700">
          ADD SRC HOURS AND DIRECTORY.
        </p>
        <Button
          onClick={testBackend}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          {loading ? "Checking..." : "Test Backend"}
        </Button>
        {apiResponse && (
          <p className="text-sm text-center text-gray-700 break-words">
            Response: {apiResponse}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
