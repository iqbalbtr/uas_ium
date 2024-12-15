import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-6xl font-bold text-slate-700">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-slate-600">
            Oops! Page Not Found
          </h2>
          <p className="mt-4 text-xl">You weren't meant to see this...</p>
          <p className="mt-2 text-muted-foreground max-w-sm">
            Either the internet has broken or we couldn't find the file that you
            were looking for.
          </p>
          <Button asChild className="mt-6 bg-slate-700 hover:bg-slate-600">
            <Link href="/login">Back to login...</Link>
          </Button>
        </div>

        {/* SVG Illustration */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Circle */}
            <circle cx="200" cy="200" r="180" fill="#f3f4f6" />

            {/* Laptop Base */}
            <path
              d="M100,220 L300,220 L320,280 L80,280 Z"
              fill="#0d9488"
              className="text-teal-600"
            />

            {/* Laptop Screen */}
            <path
              d="M110,140 L290,140 L290,220 L110,220 Z"
              fill="#14b8a6"
              className="text-teal-500"
            />

            {/* Dashboard Elements */}
            <rect
              x="130"
              y="160"
              width="60"
              height="20"
              fill="#99f6e4"
              className="text-teal-200"
            />
            <rect
              x="130"
              y="190"
              width="40"
              height="10"
              fill="#99f6e4"
              className="text-teal-200"
            />
            <rect
              x="200"
              y="160"
              width="70"
              height="40"
              fill="#99f6e4"
              className="text-teal-200"
            />

            {/* Decorative Gears */}
            <circle
              cx="320"
              cy="120"
              r="20"
              fill="#5eead4"
              className="text-teal-300"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 320 120"
                to="360 320 120"
                dur="10s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="350"
              cy="160"
              r="15"
              fill="#5eead4"
              className="text-teal-300"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 350 160"
                to="0 350 160"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Person Silhouette */}
            <path
              d="M180,200 Q200,180 220,200 L220,240 L180,240 Z"
              fill="#0f766e"
              className="text-teal-700"
            />
            <circle
              cx="200"
              cy="185"
              r="15"
              fill="#0f766e"
              className="text-teal-700"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
