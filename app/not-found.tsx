'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    function handleGoBack() {
        router.push("/");
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-semibold mb-4 tracking-tight">
          404
        </h1>

        <p className="text-lg mb-6 text-muted-foreground">
          The page you’re looking for doesn’t exist.
        </p>

        <Button onClick={handleGoBack} variant="outline" size="lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back home
        </Button>
      </div>
    </div>
  );
}
